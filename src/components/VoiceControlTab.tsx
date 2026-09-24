import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Mic,
  Play,
  Square,
  Sliders,
  Check,
  Sparkles,
  Info,
  RotateCcw,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import {
  pronunciationVoiceService,
  ReciterOption,
  VoiceSettings
} from '../services/pronunciationVoiceService';
import { PlayableTrack, playlistManager } from '../services/audioPlaylistManager';
import { extractSurahNumber } from '../utils/audioResolver';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface VoiceControlTabProps {
  activeTrack: PlayableTrack | null;
  onReciterChanged?: (reciter: ReciterOption) => void;
  onToast?: (msg: string) => void;
}

export const VoiceControlTab: React.FC<VoiceControlTabProps> = ({
  activeTrack,
  onReciterChanged,
  onToast
}) => {
  const [settings, setSettings] = useState<VoiceSettings>(() =>
    pronunciationVoiceService.getSettings()
  );
  const [reciters] = useState<ReciterOption[]>(() =>
    pronunciationVoiceService.getReciters()
  );
  const [activeReciter, setActiveReciter] = useState<ReciterOption>(() =>
    pronunciationVoiceService.getActiveReciter()
  );
  const [voices, setVoices] = useState<{
    arabicVoices: SpeechSynthesisVoice[];
    bengaliVoices: SpeechSynthesisVoice[];
    allVoices: SpeechSynthesisVoice[];
  }>({ arabicVoices: [], bengaliVoices: [], allVoices: [] });

  const [isTtsSpeaking, setIsTtsSpeaking] = useState<boolean>(false);
  const [speakingType, setSpeakingType] = useState<'ar' | 'bn' | 'both' | null>(null);

  // Sync settings and voices on mount
  useEffect(() => {
    const updateVoices = () => {
      setVoices(pronunciationVoiceService.getAvailableVoices());
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    const unsub = pronunciationVoiceService.subscribe(() => {
      setSettings(pronunciationVoiceService.getSettings());
      setActiveReciter(pronunciationVoiceService.getActiveReciter());
    });

    return () => {
      unsub();
      pronunciationVoiceService.stopSpeech();
    };
  }, []);

  // Handle Reciter Change
  const handleSelectReciter = (reciter: ReciterOption) => {
    pronunciationVoiceService.setActiveReciter(reciter.id);
    setActiveReciter(reciter);

    // If active track is a Surah, dynamically update track audio URL to this reciter's stream!
    if (activeTrack) {
      const surahNum = extractSurahNumber(activeTrack.title) || extractSurahNumber(activeTrack.audioUrl);
      if (surahNum !== null && surahNum >= 1 && surahNum <= 114) {
        const newUrl = reciter.getUrl(surahNum);
        const updatedTrack: PlayableTrack = {
          ...activeTrack,
          audioUrl: newUrl,
          backupUrl: reciter.backupUrl ? reciter.backupUrl(surahNum) : activeTrack.backupUrl,
          reciterOrScholar: reciter.nameBn
        };
        playlistManager.setActiveTrack(updatedTrack);
      }
    }

    if (onReciterChanged) {
      onReciterChanged(reciter);
    }
    if (onToast) {
      onToast(`🎙️ ক্বারী পরিবর্তন: ${reciter.nameBn} নির্বাচিত হয়েছে`);
    }
  };

  // Speed and Pitch change
  const handleSpeedChange = (rate: number) => {
    pronunciationVoiceService.updateSettings({ speechRate: rate });
    if (onToast) {
      onToast(`⚡ উচ্চারণের গতি ${toBengaliDigits(rate)}x নির্ধারণ করা হয়েছে`);
    }
  };

  const handlePitchChange = (pitch: number) => {
    pronunciationVoiceService.updateSettings({ speechPitch: pitch });
  };

  const handleArabicVoiceChange = (uri: string) => {
    pronunciationVoiceService.updateSettings({ arabicVoiceUri: uri });
    if (onToast) {
      onToast('🎙️ আরবি টেক্সট-টু-স্পিচ ভয়েস সফলভাবে সংরক্ষিত');
    }
  };

  const handleBengaliVoiceChange = (uri: string) => {
    pronunciationVoiceService.updateSettings({ bengaliVoiceUri: uri });
    if (onToast) {
      onToast('🎙️ বাংলা টেক্সট-টু-স্পিচ ভয়েস সফলভাবে সংরক্ষিত');
    }
  };

  // TTS Speech handlers
  const handleSpeakArabic = () => {
    if (!activeTrack?.arabicText) {
      if (onToast) onToast('⚠️ কোনো আরবি টেক্সট পাওয়া যায়নি');
      return;
    }
    pronunciationVoiceService.stopSpeech();
    setIsTtsSpeaking(true);
    setSpeakingType('ar');

    pronunciationVoiceService.speakArabic(activeTrack.arabicText, () => {
      setIsTtsSpeaking(false);
      setSpeakingType(null);
    });
  };

  const handleSpeakBengali = () => {
    const textToSpeak = activeTrack?.translationBn || activeTrack?.transliterationBn;
    if (!textToSpeak) {
      if (onToast) onToast('⚠️ কোনো বাংলা টেক্সট পাওয়া যায়নি');
      return;
    }
    pronunciationVoiceService.stopSpeech();
    setIsTtsSpeaking(true);
    setSpeakingType('bn');

    pronunciationVoiceService.speakBengali(textToSpeak, () => {
      setIsTtsSpeaking(false);
      setSpeakingType(null);
    });
  };

  const handleSpeakBilingual = () => {
    if (!activeTrack?.arabicText) {
      if (onToast) onToast('⚠️ কোনো আরবি টেক্সট পাওয়া যায়নি');
      return;
    }
    const bengali = activeTrack.translationBn || activeTrack.transliterationBn || '';
    pronunciationVoiceService.stopSpeech();
    setIsTtsSpeaking(true);
    setSpeakingType('both');

    pronunciationVoiceService.speakBilingual(activeTrack.arabicText, bengali, {
      onEnd: () => {
        setIsTtsSpeaking(false);
        setSpeakingType(null);
      }
    });
  };

  const handleStopSpeech = () => {
    pronunciationVoiceService.stopSpeech();
    setIsTtsSpeaking(false);
    setSpeakingType(null);
    if (onToast) onToast('উচ্চারণ সহায়িকা থামানো হয়েছে');
  };

  const handleResetSettings = () => {
    pronunciationVoiceService.resetDefaults();
    if (onToast) onToast('ভয়েস ও উচ্চারণ সেটিংস ডিফল্ট করা হয়েছে');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Top Banner: Linguistic Error Solution Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>তাজবীদ ও উচ্চারণ সহায়িকা কন্ট্রোল প্যানেল (TTS & Reciters)</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          অডিও এবং টেক্সট-টু-স্পিচ এর ভাষাগত জটিলতা ও উচ্চারণের অস্পষ্টতা দূর করতে নিচের ক্বারী ও ভয়েস ইঞ্জিন থেকে আপনার পছন্দের সুর ও সহায়ক গতি নির্বাচন করুন।
        </p>
      </div>

      {/* SECTION 1: PREFERRED RECITER SELECTION (ক্বারী নির্বাচন) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-black text-amber-200">
              পছন্দের বিশ্বখ্যাত ক্বারী ও তিলাওয়াত নির্বাচন (৬ জন প্রধান ক্বারী)
            </h2>
          </div>
          <span className="text-xs text-emerald-300 font-medium hidden sm:inline">
            সরাসরি অডিও স্ট্রিমে কার্যকর হয়
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reciters.map(reciter => {
            const isSelected = activeReciter.id === reciter.id;
            return (
              <button
                key={reciter.id}
                onClick={() => handleSelectReciter(reciter)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-900 to-teal-950 border-amber-400 shadow-xl scale-[1.02]'
                    : 'bg-emerald-950/60 border-emerald-800/80 hover:border-emerald-600 hover:bg-emerald-900/40 text-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 border border-emerald-600">
                      {reciter.badge}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        <span>সক্রিয়</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-white">
                    {reciter.nameBn}
                  </h3>
                  <p className="text-[11px] text-emerald-300">
                    {reciter.nameEn}
                  </p>

                  <p className="text-xs text-emerald-300/80 mt-1.5 line-clamp-2">
                    {reciter.subtitleBn}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[10px] text-emerald-400">
                  <span>উৎস: {reciter.country}</span>
                  <span className="text-amber-400/90 font-mono">128 kbps MP3</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE PRONUNCIATION TTS CONTROLS (টেক্সট-টু-স্পিচ উচ্চারণ সহায়িকা) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/90 border-2 border-emerald-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-black text-amber-200">
              টেক্সট-টু-স্পিচ (TTS) বহু-উচ্চারণ কন্ট্রোল ও গতি নিয়ন্ত্রণ
            </h2>
          </div>

          <button
            onClick={handleResetSettings}
            className="text-xs text-emerald-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            title="ডিফল্ট সেটিংস"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট</span>
          </button>
        </div>

        {/* Speed presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-200">
              উচ্চারণ সহায়িকা গতি (মাখরাজ শেখার জন্য ধীর গতি সুপারিশকৃত):
            </span>
            <span className="text-amber-300 font-mono font-bold">
              {toBengaliDigits(settings.speechRate)}x
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { rate: 0.7, label: '০.৭x (শিক্ষানবিশ)' },
              { rate: 0.85, label: '০.৮৫x (তাজবীদ)' },
              { rate: 1.0, label: '১.০x (স্বাভাবিক)' },
              { rate: 1.25, label: '১.২৫x (দ্রুত)' }
            ].map(item => (
              <button
                key={item.rate}
                onClick={() => handleSpeedChange(item.rate)}
                className={`py-2 px-1.5 rounded-xl text-center text-xs font-bold transition cursor-pointer border ${
                  settings.speechRate === item.rate
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow font-black'
                    : 'bg-emerald-900/60 border-emerald-700/80 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pitch slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-200">ভয়েসের স্বর / পিচ (Voice Pitch):</span>
            <span className="text-amber-300 font-mono font-bold">
              {settings.speechPitch === 0.9 ? 'গম্ভীর (০.৯)' : settings.speechPitch === 1.1 ? 'কোমল (১.১)' : 'স্বাভাবিক (১.০)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-400">গম্ভীর</span>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.1"
              value={settings.speechPitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-emerald-700"
            />
            <span className="text-[11px] text-emerald-400">কোমল</span>
          </div>
        </div>

        {/* Voice Selection Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-emerald-800/80">
          
          {/* Arabic Voice Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 block">
              আরবি টেক্সট-টু-স্পিচ ভয়েস নির্বাচন ({voices.arabicVoices.length} টি পাওয়া গেছে):
            </label>
            <select
              value={settings.arabicVoiceUri || ''}
              onChange={(e) => handleArabicVoiceChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-xs text-emerald-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">ডিফল্ট আরবি সিস্টেম ভয়েস (স্বয়ংক্রিয়)</option>
              {voices.arabicVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
              {voices.arabicVoices.length === 0 && (
                <option disabled value="none">
                  ব্রাউজারে ডেডিকেটেড আরবি ভয়েস নেই (ডিফল্ট ব্যবহৃত হবে)
                </option>
              )}
            </select>
          </div>

          {/* Bengali Voice Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 block">
              বাংলা টেক্সট-টু-স্পিচ ভয়েস নির্বাচন ({voices.bengaliVoices.length} টি পাওয়া গেছে):
            </label>
            <select
              value={settings.bengaliVoiceUri || ''}
              onChange={(e) => handleBengaliVoiceChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-xs text-emerald-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="">ডিফল্ট বাংলা সিস্টেম ভয়েস (স্বয়ংক্রিয়)</option>
              {voices.bengaliVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
              {voices.bengaliVoices.length === 0 && (
                <option disabled value="none">
                  ব্রাউজারে ডেডিকেটেড বাংলা ভয়েস নেই (ডিফল্ট ব্যবহৃত হবে)
                </option>
              )}
            </select>
          </div>

        </div>

        {/* TTS Action Test Buttons */}
        <div className="pt-3 border-t border-emerald-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-200">
              বর্তমান অডিও এর উচ্চারণ টেস্ট করুন:
            </span>
            {isTtsSpeaking && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-black text-[10px] animate-pulse">
                🎙️ {speakingType === 'ar' ? 'আরবি বলা হচ্ছে' : speakingType === 'bn' ? 'বাংলা বলা হচ্ছে' : 'দ্বৈত পাঠ চলমান'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSpeakArabic}
              disabled={!activeTrack?.arabicText}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>আরবি উচ্চারণ শুনুন</span>
            </button>

            <button
              onClick={handleSpeakBengali}
              disabled={!activeTrack?.translationBn && !activeTrack?.transliterationBn}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current text-emerald-300" />
              <span>বাংলা অর্থ ও উচ্চারণ শুনুন</span>
            </button>

            <button
              onClick={handleSpeakBilingual}
              disabled={!activeTrack?.arabicText}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-950" />
              <span>দ্বৈত সহায়িকা (আরবি + বাংলা)</span>
            </button>

            {isTtsSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>উচ্চারণ থামান</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Helpful Tips Box */}
      <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800 text-xs text-emerald-200/90 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-300">
          <Info className="w-4 h-4" />
          <span>তাজবীদ নির্দেশিকা ও উচ্চারণগত জটিলতা সমাধান:</span>
        </div>
        <p>
          • কোনো আয়াতে উচ্চারণের জটিলতা থাকলে <strong>০.৮৫x তাজবীদ গতি</strong> ব্যবহার করুন। এটি প্রতিটি মাখরাজের স্থান স্পষ্টভাবে উপলব্ধি করতে সাহায্য করে।
        </p>
        <p>
          • ক্বারী পরিবর্তন করলে সমগ্র কুরআন ও রুটিনের সংশ্লিষ্ট সকল সূরায় সেই ক্বারীর বিশুদ্ধ রেকর্ড স্বয়ংক্রিয়ভাবে বেজে উঠবে।
        </p>
      </div>

    </div>
  );
};
