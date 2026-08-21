import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
  ShieldCheck,
  RotateCcw,
  Sun,
  Moon,
  Compass,
  ArrowRight,
  Flame,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { NAFEL_PRAYERS_DATA, NafelPrayerDetail } from '../data/nafelPrayersData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { launchDhikrInTasbih } from '../utils/haptics';
import { toggleAmalCompletion, getTodayAmalCompletion, promptAmalLoginModal } from '../utils/amalTrackerService';

interface NafelPrayersSectionProps {
  lang?: string;
}

export const NafelPrayersSection: React.FC<NafelPrayersSectionProps> = () => {
  // Track multiple expanded cards so details show directly inside the clicked card
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    tahajjud: true // Expand first one by default
  });
  
  const [completedAmal, setCompletedAmal] = useState<Record<string, boolean>>(() => {
    return getTodayAmalCompletion();
  });

  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'occasional'>('all');

  useEffect(() => {
    const handleStorageChange = () => {
      setCompletedAmal(getTodayAmalCompletion());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('amal-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('amal-updated', handleStorageChange);
    };
  }, []);

  const handleToggleAmal = (id: string, prayerName: string) => {
    const updated = toggleAmalCompletion(`nafel_${id}`);
    setCompletedAmal(updated);
    // Prompt login modal if user is not logged in
    promptAmalLoginModal();
  };

  const toggleCardExpand = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    NAFEL_PRAYERS_DATA.forEach(p => {
      allExpanded[p.id] = true;
    });
    setExpandedCards(allExpanded);
  };

  const collapseAll = () => {
    setExpandedCards({});
  };

  const filteredPrayers = NAFEL_PRAYERS_DATA.filter(p => {
    if (activeTab === 'daily') return p.category === 'daily_mustahab';
    if (activeTab === 'occasional') return p.category === 'occasional_sunnah' || p.category === 'special_night';
    return true;
  });

  const totalCompleted = NAFEL_PRAYERS_DATA.filter(p => !!completedAmal[`nafel_${p.id}`]).length;
  const isAllExpanded = filteredPrayers.every(p => expandedCards[p.id]);

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 rounded-2xl border-2 border-amber-400/40 p-4 sm:p-6 text-white space-y-5 shadow-2xl">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner text-amber-300">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-2xl font-black text-amber-200">
                নফল সালাতের পূর্ণাঙ্গ গাইড ও আমল ট্র্যাকার
              </h3>
              <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                সহীহ হাদিস ভিত্তিক
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5">
              তাহাজ্জুদ, ইশরাক, চাশত, আওয়াবীন, সালাতুত তাসবীহ ও অন্যান্য নফল সালাতের পূর্ণাঙ্গ নিয়ম, নিয়ত, মাসনূন দোআ ও ফজিলত।
            </p>
          </div>
        </div>

        {/* Daily Amal Score Badge */}
        <div className="flex items-center gap-2 bg-emerald-900/80 px-4 py-2 rounded-xl border border-amber-400/40 shrink-0 shadow">
          <Award className="w-5 h-5 text-amber-300" />
          <div className="text-right">
            <span className="text-[11px] text-emerald-200 block">আজকের নফল সালাত:</span>
            <span className="text-sm font-black text-amber-300 font-mono">
              {toBengaliDigits(totalCompleted)} / {toBengaliDigits(NAFEL_PRAYERS_DATA.length)} সম্পন্ন
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Expand All Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-900/60 p-2 rounded-xl border border-emerald-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-amber-400 text-emerald-950 shadow' : 'text-emerald-200 hover:text-white'
            }`}
          >
            🌟 সকল নফল সালাত ({toBengaliDigits(NAFEL_PRAYERS_DATA.length)})
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'daily' ? 'bg-amber-400 text-emerald-950 shadow' : 'text-emerald-200 hover:text-white'
            }`}
          >
            ☀️ দৈনিক মুস্তাহাব (৪টি)
          </button>
          <button
            onClick={() => setActiveTab('occasional')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'occasional' ? 'bg-amber-400 text-emerald-950 shadow' : 'text-emerald-200 hover:text-white'
            }`}
          >
            🕌 বিশেষ সালাত (৩টি)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={isAllExpanded ? collapseAll : expandAll}
            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-amber-300 font-bold border border-emerald-700/80 transition flex items-center gap-1.5 cursor-pointer shadow"
          >
            {isAllExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>সবগুলো সংক্ষেপ করুন</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>সবগুলোর বিস্তারিত একসাথে দেখুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid / Accordion of Nafl Prayer Cards with In-Place Full Details */}
      <div className="space-y-4">
        {filteredPrayers.map((prayer) => {
          const isDone = !!completedAmal[`nafel_${prayer.id}`];
          const isExpanded = !!expandedCards[prayer.id];

          return (
            <div
              key={prayer.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isDone
                  ? 'bg-emerald-900/60 border-emerald-500/60 shadow-md'
                  : isExpanded
                  ? 'bg-emerald-900/80 border-amber-400/70 shadow-xl ring-1 ring-amber-400/40'
                  : 'bg-emerald-950/70 border-emerald-800/80 hover:border-emerald-700 hover:bg-emerald-900/40'
              }`}
            >
              {/* Card Header (Click to expand in place) */}
              <div
                onClick={() => toggleCardExpand(prayer.id)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/80 flex items-center justify-center text-xl shrink-0">
                    {prayer.id === 'tahajjud' ? (
                      <Moon className="w-5 h-5 text-cyan-300" />
                    ) : prayer.id === 'ishraq' || prayer.id === 'chasht_duha' ? (
                      <Sun className="w-5 h-5 text-amber-300" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-emerald-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-base sm:text-lg text-amber-100">
                        {prayer.nameBn}
                      </h4>
                      <span className="text-sm font-arabic font-bold text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60">
                        {prayer.nameAr}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 font-semibold">
                        {prayer.hadithSourceBn.split(',')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                      {prayer.significanceBn}
                    </p>
                  </div>
                </div>

                {/* Quick Info & Action Controls */}
                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-amber-300 block">
                      {toBengaliDigits(prayer.rakatCountNum)} রাকাত
                    </span>
                    <span className="text-[11px] text-emerald-300">
                      {prayer.bestTimeBn}
                    </span>
                  </div>

                  {/* Checklist Completion Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAmal(prayer.id, prayer.nameBn);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-emerald-950 border border-emerald-700 hover:border-amber-400 text-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-slate-950' : 'text-emerald-400'}`} />
                    <span>{isDone ? 'সম্পন্ন ✓' : 'পড়েছি?'}</span>
                  </button>

                  {/* Expand / Collapse Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardExpand(prayer.id);
                    }}
                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-300 transition"
                    title={isExpanded ? 'সংক্ষেপ করুন' : 'বিস্তারিত দেখুন'}
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* IN-PLACE EXPANDED FULL DETAILS CONTAINER */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-emerald-800/80 bg-emerald-950/90 space-y-5 animate-in fade-in duration-200">
                  
                  {/* Detailed Meta Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-700/60 text-xs">
                    <div>
                      <strong className="text-amber-300 block mb-0.5">রাকাত সংখ্যা:</strong>
                      <span className="text-white font-medium">{prayer.rakatCountBn}</span>
                    </div>
                    <div>
                      <strong className="text-amber-300 block mb-0.5">ওয়াক্ত ও সময়সীমা:</strong>
                      <span className="text-white font-medium">{prayer.timeRangeBn}</span>
                    </div>
                    <div>
                      <strong className="text-amber-300 block mb-0.5">সর্বোত্তম মুহূর্ত:</strong>
                      <span className="text-white font-medium">{prayer.bestTimeBn}</span>
                    </div>
                  </div>

                  {/* 1. Niyyat Section */}
                  <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/60 space-y-2">
                    <h5 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-300" />
                      <span>সালাতের পূর্ণ নিয়ত:</span>
                    </h5>
                    
                    <div className="p-3 bg-emerald-950/90 rounded-lg border border-emerald-800 text-right">
                      <p className="font-arabic text-amber-200 text-base sm:text-lg font-bold leading-loose" dir="rtl">
                        {prayer.niyyatArabic}
                      </p>
                    </div>

                    <div className="text-xs space-y-1 text-emerald-200">
                      <p><strong className="text-amber-300">বাংলা উচ্চারণ:</strong> {prayer.niyyatTransliterationBn}</p>
                      <p><strong className="text-amber-300">বাংলা অর্থ:</strong> {prayer.niyyatMeaningBn}</p>
                    </div>
                  </div>

                  {/* 2. Step-by-Step Rules (নিয়ম ও তারতীব) */}
                  <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/60 space-y-2.5">
                    <h5 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>ধাপে ধাপে আদায়ের বিস্তারিত নিয়ম:</span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-emerald-100">
                      {prayer.stepByStepRulesBn.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/30">
                            {toBengaliDigits(idx + 1)}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Masnoon Duas (রাসূলুল্লাহ সা. এর পঠিত দোআ) */}
                  {prayer.specialDuaArabic && (
                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-400/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-amber-300" />
                          <span>বিশেষ মাসনূন দোআ (রাসুলুল্লাহ সা. পঠিত):</span>
                        </h5>
                        <button
                          onClick={() => launchDhikrInTasbih({
                            titleBn: prayer.nameBn,
                            arabicText: prayer.specialDuaArabic || '',
                            transliterationBn: prayer.specialDuaTransliterationBn || '',
                            translationBn: prayer.specialDuaMeaningBn || '',
                            targetCount: 33
                          })}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-[11px] transition flex items-center gap-1 shadow cursor-pointer"
                        >
                          <span>📿 তসবিহে পড়ুন</span>
                        </button>
                      </div>

                      <div className="p-3 bg-emerald-950/90 rounded-lg border border-amber-400/20 text-right">
                        <p className="font-arabic text-amber-100 text-base sm:text-lg font-bold leading-loose" dir="rtl">
                          {prayer.specialDuaArabic}
                        </p>
                      </div>

                      <div className="text-xs space-y-1 text-emerald-200">
                        {prayer.specialDuaTransliterationBn && (
                          <p><strong className="text-amber-300">উচ্চারণ:</strong> {prayer.specialDuaTransliterationBn}</p>
                        )}
                        {prayer.specialDuaMeaningBn && (
                          <p><strong className="text-amber-300">অর্থ:</strong> {prayer.specialDuaMeaningBn}</p>
                        )}
                        {prayer.specialDuaSourceBn && (
                          <p className="text-[11px] text-emerald-300/80"><strong className="text-amber-300">সূত্র:</strong> {prayer.specialDuaSourceBn}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Virtues & Hadith Highlights (সহীহ হাদিসের ফজিলত) */}
                  <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/60 space-y-2">
                    <h5 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>সহীহ হাদিসের আলোকে বিশেষ ফজিলত ও তাৎপর্য:</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-100">
                      {prayer.virtueHighlights.map((v, vIdx) => (
                        <li key={vIdx} className="flex items-start gap-2">
                          <span className="text-amber-300 shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 5. Bottom Action Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => handleToggleAmal(prayer.id, prayer.nameBn)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-lg ${
                        isDone
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                          : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{isDone ? 'আজকের আমল সম্পন্ন হয়েছে ✓' : 'আজকের এই সালাতের আমল সম্পন্ন করুন'}</span>
                    </button>

                    <button
                      onClick={() => toggleCardExpand(prayer.id)}
                      className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
                    >
                      সংক্ষেপ করুন ▲
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
