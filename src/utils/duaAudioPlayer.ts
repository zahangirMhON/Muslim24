/**
 * Dua & Dhikr Audio Player Utility
 * Provides high-accuracy Arabic Tajweed pronunciation & Bengali meaning narration.
 * Enables users to listen, practice, repeat, and verify pure pronunciation (শুদ্ধ উচ্চারণ).
 */

export interface DuaAudioOptions {
  speed?: number; // 0.8 (slow practice) or 1.0 (normal)
  mode?: 'arabic_only' | 'arabic_and_meaning' | 'transliteration_only';
  loop?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let activeLoopTimeout: any = null;
let currentPlayingId: string | null = null;

// Find best Arabic and Bengali voices
function getVoicesForLanguage(langPrefix: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  
  if (langPrefix === 'ar') {
    // Prefer high quality Arabic native voices
    const arVoice = voices.find(
      v => v.lang.startsWith('ar') || v.lang.includes('ar-SA') || v.lang.includes('ar-EG') || v.name.toLowerCase().includes('arabic')
    );
    return arVoice || null;
  }

  if (langPrefix === 'bn') {
    const bnVoice = voices.find(
      v => v.lang.startsWith('bn') || v.lang.includes('BD') || v.lang.includes('IN') || v.name.toLowerCase().includes('bengali')
    );
    return bnVoice || null;
  }

  return null;
}

// Preload voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Stop any ongoing recitation or speech immediately
 */
export function stopDuaAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (activeLoopTimeout) {
    clearTimeout(activeLoopTimeout);
    activeLoopTimeout = null;
  }
  activeUtterance = null;
  currentPlayingId = null;
}

/**
 * Get the currently playing Dua/Azkar ID
 */
export function getCurrentPlayingDuaId(): string | null {
  return currentPlayingId;
}

/**
 * Preview / Test pronounce a single Arabic or Bangla word/text immediately
 * Perfect for the "নতুন জিকির যোগ" (custom dhikr add) modal.
 */
export function previewPronunciation(
  text: string,
  isArabic: boolean = true,
  speed: number = 0.85,
  onEndCallback?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  stopDuaAudio();
  if (!text || !text.trim()) return;

  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.rate = speed;
  utterance.pitch = 1.0;

  if (isArabic) {
    utterance.lang = 'ar-SA';
    const voice = getVoicesForLanguage('ar');
    if (voice) utterance.voice = voice;
  } else {
    utterance.lang = 'bn-BD';
    const voice = getVoicesForLanguage('bn');
    if (voice) utterance.voice = voice;
  }

  utterance.onend = () => {
    if (onEndCallback) onEndCallback();
  };

  utterance.onerror = () => {
    if (onEndCallback) onEndCallback();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Play full Dua / Dhikr / Ayah audio with customizable practice speed,
 * Arabic recitation, and optional Bengali meaning narration.
 */
export function playDuaAudio(
  id: string,
  data: {
    titleBn: string;
    arabicText: string;
    transliterationBn?: string;
    translationBn?: string;
  },
  options: DuaAudioOptions = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('আপনার ডিভাইসে টেক্সট-টু-স্পিচ অডিও সিস্টেম সাপোর্ট করছে না।');
    return;
  }

  stopDuaAudio();

  const {
    speed = 0.85,
    mode = 'arabic_only',
    loop = false,
    onStart,
    onEnd,
    onError
  } = options;

  currentPlayingId = id;
  if (onStart) onStart();

  const playArabicPart = () => {
    if (!data.arabicText || !data.arabicText.trim()) {
      if (data.transliterationBn) {
        playBanglaPart();
      } else {
        finish();
      }
      return;
    }

    const arabicUtterance = new SpeechSynthesisUtterance(data.arabicText.trim());
    arabicUtterance.lang = 'ar-SA';
    arabicUtterance.rate = speed;
    arabicUtterance.pitch = 1.0;

    const arVoice = getVoicesForLanguage('ar');
    if (arVoice) arabicUtterance.voice = arVoice;

    arabicUtterance.onend = () => {
      if (mode === 'arabic_and_meaning' && (data.translationBn || data.transliterationBn)) {
        // Small pause then read Bengali meaning
        setTimeout(() => {
          if (currentPlayingId === id) {
            playBanglaPart();
          }
        }, 400);
      } else if (loop) {
        // Repeat loop
        activeLoopTimeout = setTimeout(() => {
          if (currentPlayingId === id) {
            playArabicPart();
          }
        }, 1200);
      } else {
        finish();
      }
    };

    arabicUtterance.onerror = (e) => {
      console.warn('Arabic speech utterance error:', e);
      if (onError) onError(e);
      finish();
    };

    activeUtterance = arabicUtterance;
    window.speechSynthesis.speak(arabicUtterance);
  };

  const playBanglaPart = () => {
    const banglaText = `${data.titleBn}। উচ্চারণ: ${data.transliterationBn || ''}। অর্থ: ${data.translationBn || ''}`;
    const bnUtterance = new SpeechSynthesisUtterance(banglaText.trim());
    bnUtterance.lang = 'bn-BD';
    bnUtterance.rate = 0.95;
    bnUtterance.pitch = 1.0;

    const bnVoice = getVoicesForLanguage('bn');
    if (bnVoice) bnUtterance.voice = bnVoice;

    bnUtterance.onend = () => {
      if (loop) {
        activeLoopTimeout = setTimeout(() => {
          if (currentPlayingId === id) {
            playArabicPart();
          }
        }, 1500);
      } else {
        finish();
      }
    };

    bnUtterance.onerror = (e) => {
      console.warn('Bengali speech utterance error:', e);
      finish();
    };

    activeUtterance = bnUtterance;
    window.speechSynthesis.speak(bnUtterance);
  };

  const finish = () => {
    currentPlayingId = null;
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  if (mode === 'transliteration_only') {
    playBanglaPart();
  } else {
    playArabicPart();
  }
}
