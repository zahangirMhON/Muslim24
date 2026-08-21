import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  BookOpen,
  Volume2,
  HelpCircle,
  ExternalLink,
  Flame,
  Star,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';
import { getTodaySpecialAmalSuggestions, SpecialAmalItem, DaySuggestionsPayload } from '../utils/specialDaySuggestions';
import { loadDayAmalState, toggleAmalCompletion, getTodayDateString, DayAmalState } from '../services/amalTrackerService';
import { launchDhikrInTasbih } from '../utils/haptics';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface SpecialDayAmalSuggestionsProps {
  onOpenJumuahDetails?: () => void;
  className?: string;
}

export const SpecialDayAmalSuggestions: React.FC<SpecialDayAmalSuggestionsProps> = ({
  onOpenJumuahDetails,
  className = ''
}) => {
  const [data, setData] = useState<DaySuggestionsPayload>(() => getTodaySpecialAmalSuggestions());
  const [dayState, setDayState] = useState<DayAmalState>(() => loadDayAmalState(getTodayDateString()));
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const refreshState = () => {
    setData(getTodaySpecialAmalSuggestions());
    setDayState(loadDayAmalState(getTodayDateString()));
  };

  useEffect(() => {
    refreshState();
    const handleAmalUpdated = () => refreshState();
    window.addEventListener('islamic-amal-updated', handleAmalUpdated);
    return () => {
      window.removeEventListener('islamic-amal-updated', handleAmalUpdated);
    };
  }, []);

  const handleToggle = (item: SpecialAmalItem) => {
    toggleAmalCompletion(item.id, item.category, item.titleBn);
    refreshState();
  };

  const handleLaunchTasbih = (item: SpecialAmalItem) => {
    if (!item.arabicText) return;
    launchDhikrInTasbih({
      id: item.id,
      titleBn: item.titleBn,
      arabicText: item.arabicText,
      transliterationBn: item.transliterationBn || '',
      translationBn: item.meaningBn || '',
      targetCount: item.targetCount || 100,
      recommendedTimeBn: item.recommendedTimeBn,
      referenceBn: item.hadithSourceBn
    });
  };

  const handleOpenSurah = (surahNum?: number) => {
    if (!surahNum) return;
    const event = new CustomEvent('open-surah-modal', {
      detail: { surahNumber: surahNum }
    });
    window.dispatchEvent(event);
  };

  // Progress metrics calculation
  const totalSuggested = data.items.length;
  const completedSuggested = data.items.filter(item => dayState.items[item.id]?.isCompleted).length;
  const progressPercent = totalSuggested > 0 ? Math.round((completedSuggested / totalSuggested) * 100) : 0;

  return (
    <div
      id="special-day-amal-suggestions-section"
      className={`rounded-2xl bg-gradient-to-br ${data.bannerBgClass} border ${data.bannerBorderClass} p-4 sm:p-6 text-white shadow-xl backdrop-blur-md transition-all ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center text-2xl shadow-lg shrink-0">
            {data.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-amber-300 tracking-tight">
                {data.dayHeadingBn}
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-200 border border-amber-400/30">
                {data.hijriDateInfoBn}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5 line-clamp-2">
              {data.daySubHeadingBn}
            </p>
          </div>
        </div>

        {/* Real-time Progress Pill */}
        <div className="flex items-center gap-3 bg-black/30 px-3.5 py-2 rounded-xl border border-white/10 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>আজকের বিশেষ অগ্রগতি:</span>
            </div>
            <div className="text-sm font-bold text-white">
              {toBengaliDigits(completedSuggested)} / {toBengaliDigits(totalSuggested)} টি সম্পন্ন ({toBengaliDigits(progressPercent)}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-950/80 border-2 border-amber-400/80 flex items-center justify-center font-black text-xs text-amber-300 shadow-inner">
            {toBengaliDigits(progressPercent)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
        <div
          className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Suggestion Cards Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {data.items.map((item) => {
          const isDone = !!dayState.items[item.id]?.isCompleted;
          const isExpanded = expandedItemId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all p-3.5 sm:p-4 flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/60 border-emerald-500/50 shadow-sm'
                  : 'bg-black/35 hover:bg-black/45 border-white/10'
              }`}
            >
              {/* Top Row: Badge, Title & Checkbox */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        item.badgeColor === 'amber'
                          ? 'bg-amber-400 text-slate-950'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-400 text-slate-950'
                          : item.badgeColor === 'teal'
                          ? 'bg-teal-400 text-slate-950'
                          : 'bg-purple-400 text-slate-950'
                      }`}
                    >
                      {item.badgeBn}
                    </span>
                    {item.recommendedTimeBn && (
                      <span className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-300" />
                        <span className="truncate max-w-[140px] sm:max-w-[200px]">{item.recommendedTimeBn}</span>
                      </span>
                    )}
                  </div>

                  {/* Completion Status Toggle Button */}
                  <button
                    onClick={() => handleToggle(item)}
                    className={`shrink-0 p-1.5 rounded-lg transition flex items-center gap-1.5 text-xs font-bold ${
                      isDone
                        ? 'bg-emerald-400 text-slate-950 shadow'
                        : 'bg-white/10 hover:bg-white/20 text-emerald-200 border border-white/15'
                    }`}
                    title={isDone ? 'সম্পন্ন হয়েছে (আনচেক করতে ক্লিক করুন)' : 'সম্পন্ন চিহ্নিত করুন'}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span className="text-[11px]">সম্পন্ন ✓</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-emerald-300" />
                        <span className="text-[11px]">সম্পন্ন করুন</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title and Subtitle */}
                <h4 className={`text-sm sm:text-base font-bold mt-2 ${isDone ? 'text-emerald-100 line-through opacity-80' : 'text-white'}`}>
                  {item.titleBn}
                </h4>
                <p className="text-xs text-emerald-200/80 mt-0.5 leading-relaxed">
                  {item.subtitleBn}
                </p>

                {/* Arabic snippet if present */}
                {item.arabicText && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-black/40 border border-white/5 font-arabic text-base text-amber-200 text-right leading-loose select-all">
                    {item.arabicText}
                  </div>
                )}
              </div>

              {/* Action Buttons & Expanded Details Trigger */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Tasbih 1-Click Action */}
                  {item.actionType === 'tasbih' && item.arabicText && (
                    <button
                      onClick={() => handleLaunchTasbih(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>📿</span>
                      <span>তসবিহে পড়ুন ({toBengaliDigits(item.targetCount || 100)} বার)</span>
                    </button>
                  )}

                  {/* Quran Reader Action */}
                  {item.actionType === 'quran' && (
                    <button
                      onClick={() => handleOpenSurah(item.surahNumber || 18)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>সূরা আল-কাহাফ পড়ুন</span>
                    </button>
                  )}

                  {/* Prayer sequence action */}
                  {item.actionType === 'prayer' && onOpenJumuahDetails && (
                    <button
                      onClick={onOpenJumuahDetails}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>🕌</span>
                      <span>১৪ রাকাত বিবরণ ও ট্র্যাকার</span>
                    </button>
                  )}
                </div>

                {/* Hadith / Virtue Details Accordion Button */}
                <button
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition ml-auto"
                >
                  <span>{isExpanded ? 'বিবরণ সংক্ষেপ' : 'হাদিস ও ফজিলত'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Expandable Hadith / Virtue Drawer */}
              {isExpanded && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-xs text-emerald-100 space-y-2 animate-fadeIn">
                  {item.meaningBn && (
                    <div>
                      <span className="font-bold text-amber-300">অর্থ: </span>
                      <span>{item.meaningBn}</span>
                    </div>
                  )}
                  {item.transliterationBn && (
                    <div>
                      <span className="font-bold text-teal-300">উচ্চারণ: </span>
                      <span>{item.transliterationBn}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-amber-300">ফজিলত ও মাহাত্ম্য: </span>
                    <span className="leading-relaxed">{item.virtueBn}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300/80 font-medium pt-1 border-t border-emerald-500/20">
                    📖 রেফারেন্স: {item.hadithSourceBn}
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
