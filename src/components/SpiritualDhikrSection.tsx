import React, { useState } from 'react';
import {
  Play,
  Pause,
  Heart,
  Volume2,
  Copy,
  Check,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { SPIRITUAL_DHIKR_COLLECTION, SpiritualDhikrItem } from '../data/spiritualDhikrData';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface Props {
  onPlayDhikr: (title: string, audioUrl: string, youtubeUrl?: string) => void;
  onAddToSchedule: (dhikr: SpiritualDhikrItem) => void;
  currentlyPlayingUrl?: string;
  isPlaying?: boolean;
}

export const SpiritualDhikrSection: React.FC<Props> = ({
  onPlayDhikr,
  onAddToSchedule,
  currentlyPlayingUrl,
  isPlaying
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (dhikr: SpiritualDhikrItem) => {
    if (!('speechSynthesis' in window)) {
      alert('দুঃখিত, আপনার ব্রাউজারে ভয়েস অডিও সাপোর্ট নেই।');
      return;
    }
    if (speakingId === dhikr.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const text = `${dhikr.bengaliTitle}। উচ্চারণ: ${dhikr.bengaliPronunciation}। অর্থ: ${dhikr.bengaliMeaning}। নগণ্য বান্দার আকুতি: ${dhikr.servantReflectionBn}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(dhikr.id);
    window.speechSynthesis.speak(utterance);
  };

  const filteredItems = selectedFilter === 'all'
    ? SPIRITUAL_DHIKR_COLLECTION
    : SPIRITUAL_DHIKR_COLLECTION.filter(item => item.category === selectedFilter);

  const uniqueCategories = ['all', ...Array.from(new Set(SPIRITUAL_DHIKR_COLLECTION.map(i => i.category)))];

  return (
    <div id="spiritual-dhikr-section" className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-6 text-white space-y-6 shadow-2xl">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300 text-lg">🤲</span>
            <h3 className="font-black text-amber-200 text-lg sm:text-2xl">
              তাসবীহ, শুকরিয়া ও আল্লাহু আকবার — নগণ্য বান্দার আকুতি ও অডিও তিলাওয়াত
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            সুবহানাল্লাহ, আলহামদুলিল্লাহ্, আল্লাহু আকবার ও সাইয়্যিদুল ইস্তিগফারের ফজিলত, অর্থ এবং নগণ্য বান্দা হিসেবে আল্লাহর দরবারে আত্মসমর্পণের ভাবনাসহ সরাসরি অডিও শুনুন।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-900/90 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1.5 shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>মোট {toBengaliDigits(SPIRITUAL_DHIKR_COLLECTION.length)} টি প্রধান আমল</span>
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {uniqueCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedFilter === cat
                ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md font-black'
                : 'bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 border-emerald-700/80'
            }`}
          >
            {cat === 'all' ? 'সকল জিকির ও শুকরিয়া' : cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(dhikr => {
          const isItemPlaying = currentlyPlayingUrl === dhikr.audioUrl && !!isPlaying;
          const isThisSpeaking = speakingId === dhikr.id;

          return (
            <div
              key={dhikr.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
                isItemPlaying
                  ? 'bg-emerald-900/95 border-amber-400 shadow-2xl ring-2 ring-amber-400/50'
                  : 'bg-emerald-950/75 border-emerald-800/80 hover:bg-emerald-900/80 hover:border-emerald-600 shadow-lg'
              }`}
            >
              <div className="space-y-3">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${dhikr.colorTheme.badgeBg} ${dhikr.colorTheme.badgeText} ${dhikr.colorTheme.border}`}>
                    {dhikr.category}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {dhikr.recommendedTime}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="font-black text-amber-100 text-base sm:text-lg">
                    {dhikr.bengaliTitle}
                  </h4>
                </div>

                {/* Arabic Calligraphy Banner */}
                <div className="bg-emerald-950/90 p-3 rounded-xl border border-emerald-700/60 text-right space-y-1.5 shadow-inner">
                  <div className="text-xl sm:text-2xl font-bold text-amber-200 font-arabic leading-relaxed" dir="rtl">
                    {dhikr.arabicText}
                  </div>
                  <div className="text-left text-xs text-amber-300 font-semibold italic border-t border-emerald-800/80 pt-1.5">
                    <strong>উচ্চারণ: </strong>{dhikr.bengaliPronunciation}
                  </div>
                </div>

                {/* Bengali Meaning */}
                <div className="bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800 text-xs text-emerald-100 space-y-1">
                  <strong className="text-amber-300">বাংলা অর্থ: </strong>
                  <span className="leading-relaxed">{dhikr.bengaliMeaning}</span>
                </div>

                {/* Servant's Reflection (নগণ্য বান্দার আকুতি) */}
                <div className="bg-amber-400/10 p-3 rounded-xl border border-amber-400/30 text-xs text-amber-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span>নগণ্য বান্দার আকুতি ও ধ্যান:</span>
                  </div>
                  <p className="italic text-emerald-100/95 leading-relaxed">
                    "{dhikr.servantReflectionBn}"
                  </p>
                </div>

                {/* Fadhilat Box */}
                <div className="bg-teal-950/70 p-2.5 rounded-xl border border-teal-800/60 text-[11px] text-teal-200 space-y-1">
                  <strong className="text-amber-300">✨ ফজিলত: </strong>
                  <span className="leading-relaxed">{dhikr.fadhilatDescriptionBn}</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Voice Button */}
                  <button
                    onClick={() => handleSpeak(dhikr)}
                    className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      isThisSpeaking
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                        : 'bg-emerald-900 hover:bg-emerald-800 text-amber-300 border-emerald-700'
                    }`}
                    title="বাংলায় উচ্চারণ ও অর্থ শুনুন"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(`${dhikr.bengaliTitle}\n${dhikr.arabicText}\n${dhikr.bengaliPronunciation}\n${dhikr.bengaliMeaning}\n\nনগণ্য বান্দার আকুতি: ${dhikr.servantReflectionBn}\n\nফজিলত: ${dhikr.fadhilatDescriptionBn}`, dhikr.id)}
                    className="p-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 text-xs font-bold transition cursor-pointer"
                    title="সম্পূর্ণ বিবরণ কপি করুন"
                  >
                    {copiedId === dhikr.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Add to 24/7 Schedule Button */}
                  <button
                    onClick={() => onAddToSchedule(dhikr)}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="২৪/৭ শিডিউলে যোগ করুন"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>শিডিউলে যুক্ত করুন</span>
                  </button>
                </div>

                {/* Direct Play Button */}
                <button
                  onClick={() => onPlayDhikr(dhikr.bengaliTitle, dhikr.audioUrl, dhikr.youtubeUrl)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-lg cursor-pointer ${
                    isItemPlaying
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-400 hover:bg-amber-300 text-emerald-950 hover:scale-102'
                  }`}
                >
                  {isItemPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>চলছে...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>তিলাওয়াত শুনুন</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Alhamdulillah Peace Footer Banner */}
      <div className="bg-emerald-900/60 border border-amber-400/40 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>আল্লাহর শুকরিয়া: </strong>প্রতিটি শ্বাস-প্রশ্বাসে "আলহামদুলিল্লাহ" ও "সুবহানাল্লাহ" জারি রাখলে অন্তরে অপার্থিব প্রশান্তি বিরাজ করে।
          </span>
        </div>
        <span className="font-arabic text-base text-amber-300 font-bold shrink-0 hidden sm:inline" dir="rtl">
          الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
        </span>
      </div>

    </div>
  );
};
