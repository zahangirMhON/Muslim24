import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Moon,
  ShieldCheck,
  Radio,
  Plus,
  Play,
  Pause,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Clock
} from 'lucide-react';
import { SUGGESTION_CATEGORIES_CATALOG, SuggestionCategoryItem } from '../data/spiritualDhikrData';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface Props {
  onPlayItem: (title: string, audioUrl: string, youtubeUrl?: string) => void;
  onSelectSuggestionForSchedule: (suggestion: {
    title: string;
    scholar: string;
    startTime: string;
    endTime: string;
    category: string;
    audioUrl: string;
    youtubeUrl?: string;
    arabicVerse?: string;
    bengaliMeaning?: string;
  }) => void;
  currentlyPlayingUrl?: string;
  isPlaying?: boolean;
}

export const MediaCategorySuggestions: React.FC<Props> = ({
  onPlayItem,
  onSelectSuggestionForSchedule,
  currentlyPlayingUrl,
  isPlaying
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('sug-quran-recitation');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const currentCategory = SUGGESTION_CATEGORIES_CATALOG.find(c => c.id === selectedCatId) || SUGGESTION_CATEGORIES_CATALOG[0];

  // Filter sample items if search query is active
  const filteredSamples = searchQuery.trim() === ''
    ? currentCategory.sampleItems
    : currentCategory.sampleItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.scholar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fadhilatShortBn.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div id="media-category-suggestions" className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-emerald-500/60 rounded-2xl p-4 sm:p-6 text-white space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300 text-lg">💡</span>
            <h3 className="font-black text-amber-200 text-lg sm:text-2xl">
              ১-ক্লিক সার্চ ক্যাটাগরি সাজেস্ট ও আইডিয়া ব্যাংক (কি কি যুক্ত করবেন?)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            ২৪/৭ সম্প্রচারে কি কি সুন্দর অডিও, সূরা, হাদিস ও জিকির যুক্ত করা যায় তার ধারণা ও সাজেশন্স। পছন্দমতো যেকোনো আইটেমে ১-ক্লিকেই শিডিউলে যুক্ত বা সরাসরি শুনুন!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="আইডিয়া বা কারী খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-emerald-900/90 border border-emerald-700 text-xs text-white placeholder-emerald-400 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {SUGGESTION_CATEGORIES_CATALOG.map(cat => {
          const isSelected = selectedCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => { setSelectedCatId(cat.id); setSearchQuery(''); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md font-black scale-102'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700/80'
              }`}
            >
              <span>{cat.categoryTagBn}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                isSelected ? 'bg-emerald-950 text-amber-300' : 'bg-emerald-950/80 text-emerald-300'
              }`}>
                {toBengaliDigits(cat.sampleItems.length)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Highlights & Ideas Checklist */}
      <div className="bg-emerald-900/80 p-4 rounded-2xl border border-emerald-700/80 space-y-3 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800 pb-2">
          <h4 className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{currentCategory.categoryTagBn} — বিষয়ভিত্তিক তাৎপর্য ও ধারণা</span>
          </h4>
          <span className="text-xs text-emerald-300 font-semibold">
            ক্যাটাগরি: {currentCategory.categoryName}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          {currentCategory.descriptionBn}
        </p>

        {/* Ideas To Include Bullet List */}
        <div className="bg-emerald-950/90 p-3 rounded-xl border border-emerald-800 space-y-2 text-xs">
          <strong className="text-amber-300 block">💡 এই ক্যাটাগরিতে যে বিষয়গুলো যুক্ত করা উত্তম:</strong>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentCategory.ideasToIncludeBn.map((idea, idx) => (
              <div key={idx} className="flex items-start gap-2 text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{idea}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Items Ready for 1-Click Addition Grid */}
      <div className="space-y-3">
        <h4 className="font-bold text-emerald-100 text-sm flex items-center justify-between">
          <span>রেডিমেড সাজেস্টেড অডিও তালিকা (১-ক্লিকে যুক্ত বা শুনুন):</span>
          <span className="text-xs text-amber-300 font-mono">
            {toBengaliDigits(filteredSamples.length)} টি আইটেম
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSamples.map((item, idx) => {
            const isPlayingThis = currentlyPlayingUrl === item.audioUrl && !!isPlaying;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isPlayingThis
                    ? 'bg-emerald-900/95 border-amber-400 shadow-2xl ring-2 ring-amber-400/50'
                    : 'bg-emerald-950/80 border-emerald-800 hover:bg-emerald-900/90 hover:border-emerald-600 shadow-lg'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top info */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-900 text-amber-300 text-[11px] font-bold border border-emerald-700">
                      {currentCategory.categoryTagBn}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.suggestedStartTime} - {item.suggestedEndTime}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h5 className="font-black text-amber-100 text-sm sm:text-base leading-snug">
                    {item.title}
                  </h5>

                  {/* Scholar */}
                  <p className="text-xs text-emerald-300 font-semibold">
                    🎙️ {item.scholar}
                  </p>

                  {/* Fadhilat */}
                  <div className="p-2 rounded-xl bg-teal-950/70 border border-teal-800/60 text-[11px] text-teal-200">
                    <strong className="text-amber-300">ফজিলত: </strong>{item.fadhilatShortBn}
                  </div>

                  {/* Arabic sample if available */}
                  {item.arabicSample && (
                    <div className="bg-emerald-950 p-2.5 rounded-xl border border-emerald-800 text-right space-y-1">
                      <div className="text-sm font-arabic font-bold text-amber-200 leading-normal" dir="rtl">
                        {item.arabicSample}
                      </div>
                      {item.bengaliMeaning && (
                        <p className="text-[11px] text-left text-emerald-200 italic">
                          <strong>অর্থ: </strong>{item.bengaliMeaning}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(`${item.title}\n${item.scholar}\nফজিলত: ${item.fadhilatShortBn}`, `sug-${idx}`)}
                      className="p-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 text-xs font-bold transition cursor-pointer"
                      title="বিবরণ কপি করুন"
                    >
                      {copiedId === `sug-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {/* 1-Click Add to Schedule */}
                    <button
                      onClick={() => onSelectSuggestionForSchedule({
                        title: item.title,
                        scholar: item.scholar,
                        startTime: item.suggestedStartTime,
                        endTime: item.suggestedEndTime,
                        category: currentCategory.categoryName,
                        audioUrl: item.audioUrl,
                        youtubeUrl: item.youtubeUrl,
                        arabicVerse: item.arabicSample,
                        bengaliMeaning: item.bengaliMeaning
                      })}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-emerald-950 border border-amber-400/40 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      title="১-ক্লিকে ২৪/৭ শিডিউলে সেট করুন"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>শিডিউলে যুক্ত</span>
                    </button>
                  </div>

                  {/* Play Button */}
                  <button
                    onClick={() => onPlayItem(item.title, item.audioUrl, item.youtubeUrl)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow cursor-pointer ${
                      isPlayingThis
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>চলছে...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>শুনুন</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
