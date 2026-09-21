// Pronunciation & Voice Engine Service
// Solves linguistic & pronunciation issues in audio/TTS across the application.
// Provides custom selectable reciters (Mishary, Sudais, Ghamdi, Husary, Shatri, Bengali translation),
// system TTS voice filtering & selection, Tajweed speed controls, and pronunciation assistance modes.

export interface ReciterOption {
  id: string;
  nameBn: string;
  nameEn: string;
  subtitleBn: string;
  country: string;
  badge: string;
  getUrl: (surahNum: number) => string;
  backupUrl?: (surahNum: number) => string;
}

export type PronunciationMode =
  | 'studio_reciter'     // খাঁটি স্টুডিও কারীর তিলাওয়াত (প্রাকৃতিক নির্ভুল অডিও)
  | 'arabic_tajweed_tts' // আরবি মাখরাজ উচ্চারণ সহায়িকা (TTS)
  | 'bangla_meaning_tts' // বাংলা উচ্চারণ ও অর্থ সহায়িকা (TTS)
  | 'bilingual_guide';   // দ্বৈত সহায়িকা (আরবি পাঠ + বাংলা অনুবাদ)

export interface PronunciationSettings {
  activeReciterId: string;
  selectedArabicVoiceURI: string;
  selectedBengaliVoiceURI: string;
  arabicVoiceUri?: string;
  bengaliVoiceUri?: string;
  ttsSpeedRate: number; // 0.75, 0.85, 1.0, 1.25
  speechRate?: number;
  ttsPitch: number;     // 0.9, 1.0, 1.1
  speechPitch?: number;
  pronunciationMode: PronunciationMode;
  repeatCount: number;  // 1, 3, 7
  autoAssistOnPlay: boolean; // whether to automatically narrate pronunciation
}

export type VoiceSettings = PronunciationSettings;

export const RECITERS_LIST: ReciterOption[] = [
  {
    id: 'mishary',
    nameBn: 'মিশারি রশিদ আল-আফাসী',
    nameEn: 'Mishary Rashid Alafasy',
    subtitleBn: 'বিশ্বখ্যাত মধুর কন্ঠ ও বিশুদ্ধ তাজবীদ (ডিফল্ট)',
    country: 'কুয়েত',
    badge: 'সেরা তাজবীদ',
    getUrl: (num: number) => `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${num}.mp3`,
    backupUrl: (num: number) => `https://server8.mp3quran.net/afs/${String(num).padStart(3, '0')}.mp3`
  },
  {
    id: 'sudais',
    nameBn: 'শায়খ আবদুর রহমান আস-সুদাইস',
    nameEn: 'Abdur Rahman As-Sudais',
    subtitleBn: 'মসজিদুল হারামের সুমধুর আবেগময় তিলাওয়াত',
    country: 'মক্কা মুকাররমা',
    badge: 'হারামাইন',
    getUrl: (num: number) => `https://server11.mp3quran.net/sds/${String(num).padStart(3, '0')}.mp3`,
    backupUrl: (num: number) => `https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/${String(num).padStart(3, '0')}.mp3`
  },
  {
    id: 'ghamdi',
    nameBn: 'শায়খ সাদ আল-গামদি',
    nameEn: 'Saad Al-Ghamdi',
    subtitleBn: 'হৃদয়গ্রাহী ও স্পষ্ট উচ্চারণ, সহজে মুখস্থের জন্য দারুণ',
    country: 'সৌদি আরব',
    badge: 'স্পষ্ট সুর',
    getUrl: (num: number) => `https://server7.mp3quran.net/s_gmd/${String(num).padStart(3, '0')}.mp3`,
    backupUrl: (num: number) => `https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/${String(num).padStart(3, '0')}.mp3`
  },
  {
    id: 'husary',
    nameBn: 'শায়খ মাহমুদ খলিল আল-হুসারী',
    nameEn: 'Mahmoud Khalil Al-Husary',
    subtitleBn: 'মাখরাজ ও বিশুদ্ধ তারতীলের বিশ্ব শিক্ষক (শিক্ষামূলক)',
    country: 'মিশর',
    badge: 'মাখরাজ শিক্ষক',
    getUrl: (num: number) => `https://server13.mp3quran.net/husr/${String(num).padStart(3, '0')}.mp3`,
    backupUrl: (num: number) => `https://download.quranicaudio.com/qdc/khalil_al_husary/murattal/${num}.mp3`
  },
  {
    id: 'shatri',
    nameBn: 'আবু বকর আল-শাতরী',
    nameEn: 'Abu Bakr Al-Shatri',
    subtitleBn: 'ধীর, প্রশান্ত ও গভীর ভাবগম্ভীর তিলাওয়াত',
    country: 'সৌদি আরব',
    badge: 'ভাবগম্ভীর',
    getUrl: (num: number) => `https://server11.mp3quran.net/shatri/${String(num).padStart(3, '0')}.mp3`
  },
  {
    id: 'bangla_translation',
    nameBn: 'সহীহ বাংলা অনুবাদ ও তিলাওয়াত',
    nameEn: 'Bengali Translation & Recitation',
    subtitleBn: 'আরবি আয়াতের পাশাপাশি স্পষ্ট বাংলা অর্থসহ তিলাওয়াত',
    country: 'বাংলাদেশ',
    badge: 'বাংলা তরজমা',
    getUrl: (num: number) => `https://server12.mp3quran.net/bng/${String(num).padStart(3, '0')}.mp3`
  }
];

const STORAGE_KEY = 'islamic_pronunciation_voice_settings';

const DEFAULT_SETTINGS: PronunciationSettings = {
  activeReciterId: 'mishary',
  selectedArabicVoiceURI: 'default',
  selectedBengaliVoiceURI: 'default',
  arabicVoiceUri: 'default',
  bengaliVoiceUri: 'default',
  ttsSpeedRate: 0.85, // Perfect calm speed for Tajweed learning
  speechRate: 0.85,
  ttsPitch: 1.0,
  speechPitch: 1.0,
  pronunciationMode: 'studio_reciter',
  repeatCount: 1,
  autoAssistOnPlay: false
};

class PronunciationVoiceService {
  private settings: PronunciationSettings = { ...DEFAULT_SETTINGS };
  private listeners: Array<() => void> = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Pre-warm voices
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.notify();
        };
      }
    }
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load pronunciation voice settings:', e);
    }
  }

  public saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
      this.notify();
      window.dispatchEvent(new CustomEvent('pronunciation-settings-changed', {
        detail: this.settings
      }));
    } catch (e) {
      console.warn('Failed to save pronunciation voice settings:', e);
    }
  }

  public getSettings(): PronunciationSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<PronunciationSettings>) {
    const next = { ...this.settings, ...partial };
    if (partial.speechRate !== undefined) next.ttsSpeedRate = partial.speechRate;
    if (partial.ttsSpeedRate !== undefined) next.speechRate = partial.ttsSpeedRate;
    if (partial.speechPitch !== undefined) next.ttsPitch = partial.speechPitch;
    if (partial.ttsPitch !== undefined) next.speechPitch = partial.ttsPitch;
    if (partial.arabicVoiceUri !== undefined) next.selectedArabicVoiceURI = partial.arabicVoiceUri;
    if (partial.selectedArabicVoiceURI !== undefined) next.arabicVoiceUri = partial.selectedArabicVoiceURI;
    if (partial.bengaliVoiceUri !== undefined) next.selectedBengaliVoiceURI = partial.bengaliVoiceUri;
    if (partial.selectedBengaliVoiceURI !== undefined) next.bengaliVoiceUri = partial.selectedBengaliVoiceURI;
    this.settings = next;
    this.saveSettings();
  }

  public resetDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }

  public getReciters(): ReciterOption[] {
    return RECITERS_LIST;
  }

  public getActiveReciter(): ReciterOption {
    return (
      RECITERS_LIST.find((r) => r.id === this.settings.activeReciterId) ||
      RECITERS_LIST[0]
    );
  }

  public setActiveReciter(id: string) {
    const found = RECITERS_LIST.find((r) => r.id === id);
    if (found) {
      this.settings.activeReciterId = id;
      this.saveSettings();
      // Broadcast event so active audio can switch track stream URL immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('reciter-changed', {
            detail: { reciter: found }
          })
        );
      }
    }
  }

  /**
   * Returns categorized system voices
   */
  public getCategorizedVoices(): {
    arabicVoices: SpeechSynthesisVoice[];
    bengaliVoices: SpeechSynthesisVoice[];
    allVoices: SpeechSynthesisVoice[];
  } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { arabicVoices: [], bengaliVoices: [], allVoices: [] };
    }
    const allVoices = window.speechSynthesis.getVoices() || [];

    const arabicVoices = allVoices.filter(
      (v) =>
        v.lang.startsWith('ar') ||
        v.lang.includes('ar-') ||
        v.name.toLowerCase().includes('arabic') ||
        v.name.toLowerCase().includes('naayf') ||
        v.name.toLowerCase().includes('maged') ||
        v.name.toLowerCase().includes('tarik')
    );

    const bengaliVoices = allVoices.filter(
      (v) =>
        v.lang.startsWith('bn') ||
        v.lang.includes('BD') ||
        v.lang.includes('IN') ||
        v.name.toLowerCase().includes('bengali') ||
        v.name.toLowerCase().includes('bangla')
    );

    return { arabicVoices, bengaliVoices, allVoices };
  }

  /**
   * Resolves appropriate voice by user preference or smart fallback
   */
  public getVoice(lang: 'ar' | 'bn'): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const { arabicVoices, bengaliVoices, allVoices } = this.getCategorizedVoices();

    if (lang === 'ar') {
      if (this.settings.selectedArabicVoiceURI && this.settings.selectedArabicVoiceURI !== 'default') {
        const custom = allVoices.find((v) => v.voiceURI === this.settings.selectedArabicVoiceURI);
        if (custom) return custom;
      }
      return arabicVoices[0] || null;
    }

    if (lang === 'bn') {
      if (this.settings.selectedBengaliVoiceURI && this.settings.selectedBengaliVoiceURI !== 'default') {
        const custom = allVoices.find((v) => v.voiceURI === this.settings.selectedBengaliVoiceURI);
        if (custom) return custom;
      }
      return bengaliVoices[0] || null;
    }

    return null;
  }

  /**
   * Stop any active TTS pronunciation
   */
  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.notify();
  }

  public stopSpeech(): void {
    this.stop();
  }

  public speakArabic(text: string, onEnd?: () => void): void {
    this.speak(text, { lang: 'ar', onEnd });
  }

  public speakBengali(text: string, onEnd?: () => void): void {
    this.speak(text, { lang: 'bn', onEnd });
  }

  public getAvailableVoices(): {
    arabicVoices: SpeechSynthesisVoice[];
    bengaliVoices: SpeechSynthesisVoice[];
    allVoices: SpeechSynthesisVoice[];
  } {
    return this.getCategorizedVoices();
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Cleans text to improve TTS pronunciation and avoid robotic stutter
   */
  private sanitizeForTTS(text: string, isArabic: boolean): string {
    if (!text) return '';
    let cleaned = text.trim();
    if (isArabic) {
      // Normalize zero-width joiners and extreme Quranic pause marks that confuse browser TTS
      cleaned = cleaned
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        // Clean special Quranic pause marks that some browser speech engines read as digits
        .replace(/[\u06D6-\u06DC\u06DF-\u06E8]/g, ' ');
    } else {
      // Bengali cleaning
      cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
    }
    return cleaned;
  }

  /**
   * Plays custom pronunciation with user's selected voice and speed
   */
  public speak(
    text: string,
    options: {
      lang?: 'ar' | 'bn';
      speed?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError(new Error('Speech synthesis not supported'));
      return;
    }

    this.stop();

    const targetLang = options.lang || 'ar';
    const isArabic = targetLang === 'ar';
    const cleanText = this.sanitizeForTTS(text, isArabic);

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isArabic ? 'ar-SA' : 'bn-BD';
    utterance.rate = options.speed ?? this.settings.ttsSpeedRate;
    utterance.pitch = options.pitch ?? this.settings.ttsPitch;

    const voice = this.getVoice(targetLang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (err) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
      if (options.onError) options.onError(err);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Plays bilingual Dua/Ayah pronunciation (Arabic then Bangla translation)
   */
  public speakBilingual(
    arabicText: string,
    banglaMeaning: string,
    callbacks?: { onStart?: () => void; onEnd?: () => void }
  ): void {
    if (callbacks?.onStart) callbacks.onStart();

    this.speak(arabicText, {
      lang: 'ar',
      onEnd: () => {
        if (!banglaMeaning) {
          if (callbacks?.onEnd) callbacks.onEnd();
          return;
        }
        setTimeout(() => {
          this.speak(banglaMeaning, {
            lang: 'bn',
            onEnd: () => {
              if (callbacks?.onEnd) callbacks.onEnd();
            }
          });
        }, 500);
      }
    });
  }

  /**
   * Test/Preview current selected voice
   */
  public testVoice(lang: 'ar' | 'bn', onDone?: () => void) {
    const testText =
      lang === 'ar'
        ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'
        : 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।';
    this.speak(testText, {
      lang,
      onEnd: onDone,
      onError: onDone
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const pronunciationVoiceService = new PronunciationVoiceService();
