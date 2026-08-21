import { AsmaulHusnaItem } from '../data/asmaulHusnaData';

let synthVoice: SpeechSynthesisVoice | null = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    synthVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('IN') || v.lang.includes('BD')) || null;
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function playAsmaulHusnaCompleteAudio(
  item: AsmaulHusnaItem,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('আপনার ব্রাউজারে অডিও স্পিচ ফিচারটি সাপোর্ট করছে না।');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const script = `আল্লাহ তায়ালার পবিত্র নাম: ${item.arabic}। বাংলায় উচ্চারণ: ${item.transliterationBn}। অর্থ: ${item.meaningBn}। প্রমাণিত ফজিলত ও গুরুত্ব: ${item.virtueBn}। আজকের বাস্তব আমল: ${item.lifeApplicationTaskBn || 'এই নামের জিকির ও অনুধাবন করুন।'}`;

  const utterance = new SpeechSynthesisUtterance(script);
  utterance.lang = 'bn-BD';
  utterance.rate = 0.9; // Smooth slow reading speed
  utterance.pitch = 1.0;

  if (synthVoice) {
    utterance.voice = synthVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopAsmaulHusnaAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
