import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Flame,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Ban,
  HeartHandshake,
  Search,
  Plus,
  RotateCcw
} from 'lucide-react';
import {
  ALL_PROHIBITED_DEEDS,
  ALL_CONTINUOUS_AMALS,
  ProhibitedDeedItem,
  ContinuousAmalItem
} from '../utils/hijriCalendarData';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface ContinuousAmalsAndProhibitionsSectionProps {
  className?: string;
  defaultTab?: 'amals' | 'prohibitions';
}

export const ContinuousAmalsAndProhibitionsSection: React.FC<ContinuousAmalsAndProhibitionsSectionProps> = ({
  className = '',
  defaultTab = 'amals'
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'amals' | 'prohibitions'>(defaultTab);

  // Amals State
  const [amalCategory, setAmalCategory] = useState<string>('all');
  const [amalSearch, setAmalSearch] = useState<string>('');
  const [expandedAmalId, setExpandedAmalId] = useState<string | null>(null);

  // Prohibitions State
  const [prohibitionCategory, setProhibitionCategory] = useState<string>('all');
  const [prohibitionSearch, setProhibitionSearch] = useState<string>('');
  const [expandedProhibitionId, setExpandedProhibitionId] = useState<string | null>(null);

  // Interactive Live Counts for Continuous Amals saved in localStorage
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('islamic_continuous_amal_counts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const incrementCount = (id: string, maxTarget: number) => {
    setCompletedCounts((prev) => {
      const current = prev[id] || 0;
      const next = current + 1;
      const updated = { ...prev, [id]: next };
      try {
        localStorage.setItem('islamic_continuous_amal_counts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const resetCount = (id: string) => {
    setCompletedCounts((prev) => {
      const updated = { ...prev, [id]: 0 };
      try {
        localStorage.setItem('islamic_continuous_amal_counts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Filtered Amals
  const filteredAmals = ALL_CONTINUOUS_AMALS.filter((amal) => {
    const matchesCategory =
      amalCategory === 'all'
        ? true
        : amalCategory === 'weekly'
        ? amal.scope === 'weekly'
        : amalCategory === 'special_day'
        ? amal.scope === 'special_day'
        : amalCategory === 'daily_time_block'
        ? amal.scope === 'daily_time_block'
        : true;

    const matchesSearch =
      amal.titleBn.toLowerCase().includes(amalSearch.toLowerCase()) ||
      amal.significanceBn.toLowerCase().includes(amalSearch.toLowerCase()) ||
      amal.timeSlotBn.toLowerCase().includes(amalSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Filtered Prohibitions
  const filteredProhibitions = ALL_PROHIBITED_DEEDS.filter((item) => {
    const matchesCategory =
      prohibitionCategory === 'all'
        ? true
        : prohibitionCategory === 'prayer_time'
        ? item.category === 'prayer_time'
        : prohibitionCategory === 'fasting_day'
        ? item.category === 'fasting_day'
        : prohibitionCategory === 'habitual_sin'
        ? item.category === 'habitual_sin'
        : prohibitionCategory === 'social_action'
        ? item.category === 'social_action'
        : true;

    const matchesSearch =
      item.titleBn.toLowerCase().includes(prohibitionSearch.toLowerCase()) ||
      item.hadithOrQuranQuoteBn.toLowerCase().includes(prohibitionSearch.toLowerCase()) ||
      item.authenticReferenceBn.toLowerCase().includes(prohibitionSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white p-4 sm:p-6 shadow-2xl relative overflow-hidden space-y-6 ${className}`}>
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Main Tabs */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-2xl font-black text-amber-300">
                আমল ও বর্জনীয় নির্দেশিকা (কুরআন ও সহীহ সুন্নাহ)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black uppercase">
                সহীহ দলিলভিত্তিক
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
              সাপ্তাহিক, বিশেষ দিন ও দৈনিক নির্দিষ্ট ক্ষণের আমলসমূহ এবং ৩টি নিষিদ্ধ সময় ও স্বভাবগত পাপ বর্জনের বিধান
            </p>
          </div>
        </div>

        {/* Master Navigation Pill Switch */}
        <div className="bg-black/60 border border-white/15 p-1 rounded-2xl flex items-center gap-1 self-stretch sm:self-auto shrink-0 shadow-inner">
          <button
            onClick={() => setActiveMainTab('amals')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMainTab === 'amals'
                ? 'bg-emerald-500 text-slate-950 font-black shadow ring-1 ring-emerald-300'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>করণীয় আমল ও লাইভ কাউন্টার</span>
          </button>
          <button
            onClick={() => setActiveMainTab('prohibitions')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeMainTab === 'prohibitions'
                ? 'bg-rose-500 text-white font-black shadow ring-1 ring-rose-300'
                : 'text-rose-200 hover:text-white hover:bg-rose-950/50'
            }`}
          >
            <Ban className="w-4 h-4 text-rose-300" />
            <span>নিষিদ্ধ ও স্বভাবগত বর্জনীয়</span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 1. CONTINUOUS AMALS SECTION (করণীয় আমল ও লাইভ কাউন্টার)          */}
      {/* ================================================================= */}
      {activeMainTab === 'amals' && (
        <div className="relative z-10 space-y-4 animate-fade-in">
          
          {/* Subheader & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: 'সকল আমল' },
                { id: 'weekly', label: '📅 সাপ্তাহিক আমল (সোম/বৃহঃ ও জুমা)' },
                { id: 'special_day', label: '🌕 আইয়ামে বীজ ও বিশেষ দিন' },
                { id: 'daily_time_block', label: '⏰ দৈনিক নির্দিষ্ট ক্ষণ (তাহাজ্জুদ/চাশত)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setAmalCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    amalCategory === cat.id
                      ? 'bg-amber-400 text-slate-950 shadow font-black ring-1 ring-amber-300'
                      : 'bg-black/50 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60 shrink-0">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={amalSearch}
                onChange={(e) => setAmalSearch(e.target.value)}
                placeholder="আমল বা দোয়া খুঁজুন..."
                className="w-full bg-black/60 pl-9 pr-3 py-1.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Amals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAmals.map((amal) => {
              const count = completedCounts[amal.id] || 0;
              const isTargetReached = count >= amal.targetCount;
              const isExpanded = expandedAmalId === amal.id;

              return (
                <div
                  key={amal.id}
                  className={`rounded-2xl border transition-all duration-300 p-4 space-y-3 relative overflow-hidden ${
                    isTargetReached
                      ? 'bg-emerald-950/90 border-emerald-400 ring-1 ring-emerald-300/60 shadow-lg'
                      : 'bg-black/50 border-emerald-800/80 hover:border-amber-400/50'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                        {amal.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-900 text-emerald-200 font-bold border border-emerald-700">
                            {amal.timeSlotBn}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white mt-0.5">
                          {amal.titleBn}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold shrink-0">
                      {amal.scopeLabelBn}
                    </span>
                  </div>

                  {/* Significance Quote */}
                  <p className="text-xs text-emerald-100/90 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                    {amal.significanceBn}
                  </p>

                  {/* Interactive Live Counter Row */}
                  <div className="p-3 rounded-xl bg-black/60 border border-emerald-700/60 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] text-gray-400 block">
                        আমল অগ্রগতি (লক্ষ্য: {toBengaliDigits(amal.targetCount)} বার):
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-xl font-black font-mono ${isTargetReached ? 'text-emerald-400 animate-pulse' : 'text-amber-300'}`}>
                          {toBengaliDigits(count)}
                        </span>
                        <span className="text-xs text-gray-400">
                          / {toBengaliDigits(amal.targetCount)} সম্পন্ন
                        </span>
                        {isTargetReached && (
                          <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 ml-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>আলহামদুলিল্লাহ পূর্ণ!</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {count > 0 && (
                        <button
                          onClick={() => resetCount(amal.id)}
                          title="রিসেট করুন"
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => incrementCount(amal.id, amal.targetCount)}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition flex items-center gap-1 shadow cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>১ যোগ করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Accordion Toggle for Deep Knowledge (৪ স্তম্ভ জ্ঞান) */}
                  <div className="pt-1">
                    <button
                      onClick={() => setExpandedAmalId(isExpanded ? null : amal.id)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-[11px] font-bold text-amber-200 flex items-center justify-between border border-emerald-800/80 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>কেন ও কীভাবে করবেন এবং সহীহ হাদিস সনদ</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-black/70 border border-emerald-700/60 space-y-2 text-xs animate-fade-in">
                        {/* Why Allah & Rasul commanded */}
                        <div className="space-y-0.5">
                          <strong className="text-amber-300 block">কেন আল্লাহ ও রাসূল ﷺ নির্দেশ দিয়েছেন:</strong>
                          <p className="text-emerald-100/90 leading-relaxed">{amal.whyDoItBn}</p>
                        </div>

                        {/* How to practice */}
                        <div className="space-y-0.5">
                          <strong className="text-teal-300 block">কীভাবে আমলটি করবেন:</strong>
                          <p className="text-emerald-100/90 leading-relaxed">{amal.howToPracticeBn}</p>
                        </div>

                        {/* Verified Hadith Reference */}
                        <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                          <span className="text-amber-200 font-mono">দলিল: {amal.hadithReferenceBn}</span>
                          <span className="text-emerald-300 font-bold">সহীহ সূত্র সংরক্ষিত</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================================================================= */}
      {/* 2. PROHIBITED DEEDS SECTION (নিষিদ্ধ ও স্বভাবগত বর্জনীয় আমল)      */}
      {/* ================================================================= */}
      {activeMainTab === 'prohibitions' && (
        <div className="relative z-10 space-y-4 animate-fade-in">
          
          {/* Subheader & Warning Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-black to-red-950 border-2 border-rose-500/60 space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-rose-300 font-black text-sm">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
              <span>শরীয়তের নিষিদ্ধ সীমা ও স্বভাবগত ধ্বংসাত্মক পাপ থেকে আত্মরক্ষা:</span>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed">
              ইসলাম কেবল কী করতে হবে তা শেখায়নি, বরং কোন কোন সময়ে সালাত ও রোজা রাখা নিষিদ্ধ এবং কোন স্বভাবগত বদভ্যাস ও কবিরা গুনাহ বান্দার সকল নেক আমল ধ্বংস করে দেয় তাও সহীহ হাদিস ও কুরআনের মাধ্যমে পরিষ্কার করেছে।
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: 'all', label: 'সকল বর্জনীয় বিধান' },
                { id: 'prayer_time', label: '⏰ ৩টি নিষিদ্ধ সালাতের সময়' },
                { id: 'fasting_day', label: '🚫 ৫টি নিষিদ্ধ রোজার দিন' },
                { id: 'habitual_sin', label: '⚠️ স্বভাবগত কবিরা গুনাহ (গীবত/অহংকার)' },
                { id: 'social_action', label: '🕌 জুমার খুতবা ও মসজিদ শিষ্টাচার' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setProhibitionCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    prohibitionCategory === cat.id
                      ? 'bg-rose-500 text-white shadow font-black ring-1 ring-rose-300'
                      : 'bg-black/50 text-rose-200 hover:bg-rose-950 border border-rose-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60 shrink-0">
              <Search className="w-4 h-4 text-rose-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={prohibitionSearch}
                onChange={(e) => setProhibitionSearch(e.target.value)}
                placeholder="নিষিদ্ধ বিধান খুঁজুন..."
                className="w-full bg-black/60 pl-9 pr-3 py-1.5 rounded-xl border border-rose-800 text-white text-xs focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* Prohibitions Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProhibitions.map((item) => {
              const isExpanded = expandedProhibitionId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-rose-800/80 bg-black/60 hover:border-rose-500/80 transition-all p-4 space-y-3 relative overflow-hidden shadow-lg"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-rose-950/60 border border-rose-800 shrink-0">
                        {item.icon}
                      </span>
                      <div>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-900/80 text-rose-200 font-bold border border-rose-700">
                          {item.categoryLabelBn}
                        </span>
                        <h4 className="text-sm font-black text-rose-200 mt-0.5">
                          {item.titleBn}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-600 text-white font-black uppercase shrink-0 shadow">
                      {item.prohibitionLevel}
                    </span>
                  </div>

                  {/* Condition / Time Range */}
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-100">
                    <strong className="text-rose-300">সময় বা অবস্থা:</strong> {item.timeOrConditionBn}
                  </div>

                  {/* Quran / Hadith Quote */}
                  <div className="space-y-1 bg-black/40 p-3 rounded-xl border border-white/5 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>কুরআন ও সহীহ হাদিসের সতর্কতা:</span>
                    </div>
                    <p className="text-emerald-100 leading-relaxed italic">
                      "{item.hadithOrQuranQuoteBn}"
                    </p>
                    <span className="text-[10px] text-amber-300/80 block font-mono">
                      সূত্র: {item.authenticReferenceBn}
                    </span>
                  </div>

                  {/* Dropdown for Grave Consequence & Repentance */}
                  <div className="pt-1">
                    <button
                      onClick={() => setExpandedProhibitionId(isExpanded ? null : item.id)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-[11px] font-bold text-rose-200 flex items-center justify-between border border-rose-800 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>ভয়াবহ পরিণতি ও নিস্তারের খাঁটি উপায়</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-black/80 border border-rose-800/80 space-y-2 text-xs animate-fade-in">
                        <div className="space-y-0.5">
                          <strong className="text-rose-400 block">ভয়াবহ আখিরাতের পরিণতি:</strong>
                          <p className="text-gray-200 leading-relaxed">{item.graveConsequenceBn}</p>
                        </div>

                        <div className="space-y-0.5 pt-1 border-t border-white/10">
                          <strong className="text-emerald-300 block">বাঁচার উপায় ও করণীয় তওবা:</strong>
                          <p className="text-emerald-100 leading-relaxed">{item.remedyAndRepentanceBn}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
