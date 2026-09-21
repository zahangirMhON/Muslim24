// Smart Alarm Engine for 24/7 AI Care, Life, Amal & Routine Operating System
// Supports Bengali Voice Announcements, 24/7 Radio Audio Folders, Islamic Azan/Surah tones, Snooze & Auto-triggers.

import { SmartAlarmItem, AlarmToneType, CareProfileId } from '../types/careRoutine';
import { playlistManager } from './audioPlaylistManager';

const ALARMS_STORAGE_KEY = 'islamic_app_smart_alarms_v1';

type AlarmCallback = (alarm: SmartAlarmItem) => void;

class SmartAlarmService {
  private static instance: SmartAlarmService;
  private alarms: SmartAlarmItem[] = [];
  private activeRingingAlarm: SmartAlarmItem | null = null;
  private listeners: Set<() => void> = new Set();
  private ringingListeners: Set<AlarmCallback> = new Set();
  private checkIntervalTimer: any = null;
  private lastTriggeredMinute: string = '';
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private synthInterval: any = null;

  private constructor() {
    this.loadAlarms();
    this.startClockTicker();
  }

  public static getInstance(): SmartAlarmService {
    if (!SmartAlarmService.instance) {
      SmartAlarmService.instance = new SmartAlarmService();
    }
    return SmartAlarmService.instance;
  }

  private loadAlarms() {
    try {
      const stored = localStorage.getItem(ALARMS_STORAGE_KEY);
      if (stored) {
        this.alarms = JSON.parse(stored);
      } else {
        // Initial default smart alarms
        this.alarms = [
          {
            id: 'alarm-fajr-amal',
            title: 'ফজর ও সকালের জিকির',
            timeString: '05:00',
            profileId: 'self',
            enabled: true,
            toneType: 'bengali_voice',
            voiceText: 'বিসমিল্লাহ। আসসালাতু খাইরুম মিনান নাওম। ফজর ও সকালের জিকিরের সময় হয়েছে।'
          },
          {
            id: 'alarm-ammu-med',
            title: 'আম্মুর সকালের ওষুধ',
            timeString: '07:15',
            profileId: 'ammu',
            enabled: true,
            toneType: 'bengali_voice',
            voiceText: 'বিসমিল্লাহ। আম্মুর সকালের নাস্তার আগের ওষুধ দেওয়ার সময় হয়েছে।'
          }
        ];
        this.saveAlarms();
      }
    } catch (e) {
      console.error('Error loading smart alarms:', e);
    }
  }

  private saveAlarms() {
    try {
      localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(this.alarms));
    } catch (e) {
      console.error('Error saving smart alarms:', e);
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public onAlarmRinging(cb: AlarmCallback): () => void {
    this.ringingListeners.add(cb);
    return () => this.ringingListeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  public getAlarms(): SmartAlarmItem[] {
    return [...this.alarms];
  }

  public getActiveRingingAlarm(): SmartAlarmItem | null {
    return this.activeRingingAlarm;
  }

  public addOrUpdateAlarm(alarm: SmartAlarmItem): void {
    const idx = this.alarms.findIndex(a => a.id === alarm.id);
    if (idx >= 0) {
      this.alarms[idx] = alarm;
    } else {
      this.alarms.push(alarm);
    }
    this.saveAlarms();
  }

  public deleteAlarm(alarmId: string): void {
    this.alarms = this.alarms.filter(a => a.id !== alarmId);
    this.saveAlarms();
  }

  public toggleAlarm(alarmId: string): void {
    const a = this.alarms.find(x => x.id === alarmId);
    if (a) {
      a.enabled = !a.enabled;
      this.saveAlarms();
    }
  }

  // Quick method to create an alarm from a Music Track or Radio Folder
  public createAlarmFromTrackOrFolder(params: {
    title: string;
    timeString: string;
    profileId: CareProfileId;
    folderId?: string;
    folderTitleBn?: string;
    trackUrl?: string;
    trackTitle?: string;
    voiceText?: string;
  }): SmartAlarmItem {
    const newAlarm: SmartAlarmItem = {
      id: `alarm-${Date.now()}`,
      title: params.title,
      timeString: params.timeString,
      profileId: params.profileId,
      enabled: true,
      toneType: params.folderId ? 'folder_audio' : params.trackUrl ? 'quran' : 'bengali_voice',
      folderId: params.folderId,
      folderTitleBn: params.folderTitleBn,
      trackUrl: params.trackUrl,
      trackTitle: params.trackTitle,
      voiceText: params.voiceText || `বিসমিল্লাহ। এখন ${params.title}-এর সময় হয়েছে।`
    };
    this.addOrUpdateAlarm(newAlarm);
    return newAlarm;
  }

  private startClockTicker() {
    if (this.checkIntervalTimer) clearInterval(this.checkIntervalTimer);

    this.checkIntervalTimer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentMinuteStr = `${hours}:${minutes}`;

      if (currentMinuteStr === this.lastTriggeredMinute) {
        return;
      }

      // Check alarms
      const nowMs = Date.now();
      for (const alarm of this.alarms) {
        if (!alarm.enabled) continue;

        // Check snoozed
        if (alarm.snoozedUntil && alarm.snoozedUntil <= nowMs) {
          alarm.snoozedUntil = undefined;
          this.triggerAlarm(alarm);
          this.lastTriggeredMinute = currentMinuteStr;
          break;
        }

        if (alarm.timeString === currentMinuteStr && !alarm.snoozedUntil) {
          this.triggerAlarm(alarm);
          this.lastTriggeredMinute = currentMinuteStr;
          break;
        }
      }
    }, 2000);
  }

  public triggerAlarm(alarm: SmartAlarmItem) {
    this.activeRingingAlarm = { ...alarm, isRinging: true };
    this.saveAlarms();

    // Play Sound / Voice
    this.playAlarmAudio(alarm);

    // Notify listeners
    this.ringingListeners.forEach(cb => {
      try { cb(this.activeRingingAlarm!); } catch (e) { console.error(e); }
    });
    this.notify();
  }

  private playAlarmAudio(alarm: SmartAlarmItem) {
    this.stopAudio();

    // 1. If Folder Audio selected, resolve a track from the folder
    let targetAudioUrl = alarm.trackUrl;
    if (alarm.folderId && !targetAudioUrl) {
      const tracks = playlistManager.getTracksInFolder(alarm.folderId);
      if (tracks && tracks.length > 0) {
        targetAudioUrl = tracks[0].audioUrl;
      }
    }

    if (targetAudioUrl) {
      try {
        this.audioElement = new Audio(targetAudioUrl);
        this.audioElement.loop = true;
        this.audioElement.play().catch(e => {
          console.warn('Audio play failed, falling back to Web Audio synth:', e);
          this.playSynthesizedBeep();
        });
      } catch (e) {
        this.playSynthesizedBeep();
      }
    } else {
      // Default to Web Audio chime + Bengali Voice Announcement
      this.playSynthesizedBeep();
    }

    // Always announce Bengali Voice if provided or if tone is bengali_voice
    this.speakBengaliVoice(alarm.voiceText || `বিসমিল্লাহ। এখন ${alarm.title}-এর নির্ধারিত সময় হয়েছে।`);
  }

  private speakBengaliVoice(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BD'));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS voice failed:', e);
    }
  }

  private playSynthesizedBeep() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const playTone = () => {
        if (!this.audioContext) return;
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        // Pleasant Islamic chime frequencies: 528Hz (Love/Healing), 660Hz
        osc.frequency.setValueAtTime(528, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now);
        osc.stop(now + 0.85);
      };

      playTone();
      this.synthInterval = setInterval(playTone, 2000);
    } catch (e) {
      console.error('Synthesizer tone error:', e);
    }
  }

  public stopAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public dismissActiveAlarm(): void {
    this.stopAudio();
    if (this.activeRingingAlarm) {
      this.activeRingingAlarm = null;
      this.notify();
    }
  }

  public snoozeActiveAlarm(minutes: number = 5): void {
    this.stopAudio();
    if (this.activeRingingAlarm) {
      const snoozedUntil = Date.now() + minutes * 60 * 1000;
      const id = this.activeRingingAlarm.id;
      const target = this.alarms.find(a => a.id === id);
      if (target) {
        target.snoozedUntil = snoozedUntil;
      }
      this.activeRingingAlarm = null;
      this.saveAlarms();
    }
  }
}

export const smartAlarmService = SmartAlarmService.getInstance();
