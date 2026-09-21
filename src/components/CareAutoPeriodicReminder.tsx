import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  CheckCircle2,
  Bell,
  Play,
  Square,
  RefreshCw,
  Radio,
  Activity
} from 'lucide-react';
import { RoutineTask, AiContextBrainState } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface CareAutoPeriodicReminderProps {
  tasks: RoutineTask[];
  brainState: AiContextBrainState;
  activeProfileName: string;
}

const STORAGE_KEY_ENABLED = 'care_auto_10m_reminder_enabled_v1';
const INTERVAL_SECONDS = 600; // 10 minutes

export const CareAutoPeriodicReminder: React.FC<CareAutoPeriodicReminderProps> = ({
  tasks,
  brainState,
  activeProfileName
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_ENABLED) === 'true';
  });
  const [secondsRemaining, setSecondsRemaining] = useState<number>(INTERVAL_SECONDS);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Toggle enable/disable
  const handleToggle = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    localStorage.setItem(STORAGE_KEY_ENABLED, String(next));
    if (next) {
      setSecondsRemaining(INTERVAL_SECONDS);
    } else {
      stopSpeech();
    }
  };

  // Play pleasant notification bell chime
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic chime chord
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('Chime audio error:', e);
    }
  };

  // Construct intelligent, fluent Bengali briefing text
  const generateBriefingText = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${toBengaliDigits(hours)} টা ${toBengaliDigits(mins)} মিনিট`;

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Current active task
    const nowMin = now.getHours() * 60 + now.getMinutes();
    let currentTask: RoutineTask | null = null;
    let nextTask: RoutineTask | null = null;

    for (const t of tasks) {
      const [h, m] = t.scheduledTime.split(':');
      const start = parseInt(h || '0', 10) * 60 + parseInt(m || '0', 10);
      const end = start + (t.durationMinutes || 30);
      if (nowMin >= start && nowMin < end && t.status !== 'completed') {
        currentTask = t;
      }
      if (start > nowMin && !nextTask && t.status !== 'completed') {
        nextTask = t;
      }
    }

    let message = `আসসালামু আলাইকুম। ${activeProfileName}-এর রুটিন আপডেট। এখন সময় ${timeStr}। `;
    message += `আজকের রুটিনের অগ্রগতি শতকরা ${toBengaliDigits(progressPercent)} ভাগ সম্পন্ন হয়েছে। `;
    message += `${toBengaliDigits(completed)}টি কাজ সম্পন্ন হয়েছে এবং ${toBengaliDigits(pending)}টি কাজ বাকি রয়েছে। `;

    if (currentTask) {
      message += `বর্তমানে নির্ধারিত কাজ হলো: ${currentTask.title}। `;
      if (currentTask.amountOrDose) {
        message += `পরিমাণ: ${currentTask.amountOrDose}। `;
      }
    } else {
      message += `বর্তমানে কোনো নির্ধারিত কাজ নেই, এটি অবকাশ ও ফাঁকা সময়। `;
    }

    if (nextTask) {
      const [nh, nm] = nextTask.scheduledTime.split(':');
      message += `পরবর্তী করণীয় কাজ: ${nextTask.title}, যা শুরু হবে ${toBengaliDigits(nh)}টা ${toBengaliDigits(nm)} মিনিটে। `;
    }

    // Contextual Islamic dhikr
    const dhikrOptions = [
      'এই সময়ে বেশি বেশি সুবহানাল্লাহি ওয়া বিহামদিহি পাঠ করুন।',
      'আল্লাহর রহমত কামনায় লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ স্মরণ করুন।',
      'অন্তরকে শান্ত রাখতে ৩ বার আস্তাগফিরুল্লাহ পড়ুন।',
      'আল্লাহ আমাদের সময় ও আমলে বরকত দান করুন।'
    ];
    const chosenDhikr = dhikrOptions[Math.floor(Math.random() * dhikrOptions.length)];
    message += chosenDhikr;

    return message;
  };

  // Speak the briefing text using Web Speech API
  const speakBriefing = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('আপনার ডিভাইসে বাংলা ভয়েস সমর্থন নেই।');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      playChime();
      setIsSpeaking(true);

      const text = generateBriefingText();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BD'));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Timer ticker
  useEffect(() => {
    if (!isEnabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Trigger briefing
          speakBriefing();
          return INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEnabled, tasks, activeProfileName]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const countdownFormatted = `${toBengaliDigits(String(mins).padStart(2, '0'))}:${toBengaliDigits(String(secs).padStart(2, '0'))}`;

  const progressPercent = Math.round(((INTERVAL_SECONDS - secondsRemaining) / INTERVAL_SECONDS) * 100);

  return (
    <div className={`rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md shadow-lg ${
      isEnabled
        ? 'bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-amber-400/60 shadow-amber-950/20'
        : 'bg-slate-900/80 border-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left info & switch */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow transition ${
            isEnabled ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-white">
                ১০ মিনিট পর পর অটো অডিও ব্রিফিং ও রিমাইন্ডার
              </h4>
              {isEnabled && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>সক্রিয়</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              বর্তমান অগ্রগতি, সম্পন্ন কাজ, চলমান অবস্থা ও পরবর্তী কাজের সারসংক্ষেপ স্পষ্ট বাংলায় শুনুন
            </p>
          </div>
        </div>

        {/* Right Toggle Switch */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleToggle}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow ${
              isEnabled
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isEnabled ? (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>চালু আছে (অন)</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>বন্ধ আছে (অফ)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* When Enabled: Countdown & Manual Controls */}
      {isEnabled && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>পরবর্তী অডিও ঘোষণা:</span>
              <span className="font-mono font-black text-amber-300 text-sm bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                {countdownFormatted} পর
              </span>
            </div>

            {/* Test Listen / Stop Buttons */}
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <button
                  type="button"
                  onClick={stopSpeech}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>ভয়েস বন্ধ করুন</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={speakBriefing}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>এখনই সম্পূর্ণ অডিও শুনুন (টেস্ট)</span>
                </button>
              )}
            </div>
          </div>

          {/* Mini progress bar towards next 10m announcement */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
