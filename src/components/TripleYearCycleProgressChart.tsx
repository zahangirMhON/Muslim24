import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Flame,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Hourglass,
  Moon,
  Sun,
  Compass
} from 'lucide-react';
import {
  getTripleYearProgressSummary,
  TripleYearProgressSummary,
  CalendarCycleStats
} from '../utils/hijriCalendarData';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface TripleYearCycleProgressChartProps {
  currentDate?: Date;
  className?: string;
  onOpenDayModal?: () => void;
}

export const TripleYearCycleProgressChart: React.FC<TripleYearCycleProgressChartProps> = ({
  currentDate = new Date(),
  className = '',
  onOpenDayModal
}) => {
  const [viewMode, setViewMode] = useState<'unified' | 'detailed'>('unified');
  const summary: TripleYearProgressSummary = getTripleYearProgressSummary(currentDate);

  const cycles: CalendarCycleStats[] = [
    summary.hijri,
    summary.gregorian,
    summary.bengali
  ];

  return (
    <div className={`rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white p-4 sm:p-6 shadow-2xl relative overflow-hidden space-y-6 ${className}`}>
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shrink-0">
            <Hourglass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-2xl font-black text-amber-300 tracking-wide">
                চলতি ৩ বর্ষচক্রের লাইভ দিন গণনা ও প্রগ্রেস চার্ট
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black uppercase shadow">
                ১-১০০% লাইভ স্কেল
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
              হিজরি (৩৫৪ দিন), ইংরেজি (৩৬৫ দিন) ও বাংলা (৩৬৫ দিন)—আজকের অবস্থান, অগ্রগতি ও বাকি দিনের তুলনামূলক চিত্র
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="bg-black/60 border border-emerald-700/60 p-1 rounded-2xl flex items-center gap-1 self-stretch sm:self-auto shrink-0 shadow-inner">
          <button
            onClick={() => setViewMode('unified')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'unified'
                ? 'bg-amber-400 text-slate-950 shadow font-black ring-1 ring-amber-300'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>একত্রে তুলনামূলক চার্ট</span>
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === 'detailed'
                ? 'bg-amber-400 text-slate-950 shadow font-black ring-1 ring-amber-300'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-900/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>আলাদা ৩ বর্ষপঞ্জিকা</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* MODE 1: UNIFIED COMPARATIVE PROGRESS BAR & CHART VIEW             */}
      {/* ----------------------------------------------------------------- */}
      {viewMode === 'unified' && (
        <div className="relative z-10 space-y-4 animate-fade-in">
          
          {/* Synchronized Multi-Tiered Progress Bar Chart */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-amber-400/40 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="text-xs sm:text-sm font-black text-amber-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>আজকের সাপেক্ষে ৩টি বর্ষচক্রের অতিক্রান্ত শতাংশ (১-১০০ স্কেল):</span>
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                চন্দ্র ও সৌর পরিক্রমার সমান্তরাল তুলনা
              </span>
            </div>

            {/* Bars List */}
            <div className="space-y-4">
              {cycles.map((cycle) => {
                const isHijri = cycle.calendarType === 'hijri';
                const isGregorian = cycle.calendarType === 'gregorian';

                return (
                  <div key={cycle.calendarType} className="space-y-1.5">
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {isHijri ? '🌙' : isGregorian ? '☀️' : '🌾'}
                        </span>
                        <strong className="text-white font-bold">
                          {cycle.titleBn}
                        </strong>
                        <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${cycle.badgeBg}`}>
                          {cycle.badgeText}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-300">
                          বর্তমান দিন: <strong className="text-amber-300 font-mono">{toBengaliDigits(cycle.currentDay)}</strong>/{toBengaliDigits(cycle.totalDays)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-emerald-300 font-bold font-mono">
                          {toBengaliDigits(cycle.progressPercent)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative w-full h-4 sm:h-5 rounded-full bg-black/80 border border-white/15 overflow-hidden p-0.5 shadow-inner">
                      {/* Gradient Fill */}
                      <div
                        className={`h-full rounded-full transition-all duration-1000 relative shadow-lg ${
                          isHijri
                            ? 'bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-300'
                            : isGregorian
                            ? 'bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-300'
                            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-300'
                        }`}
                        style={{ width: `${Math.max(3, cycle.progressPercent)}%` }}
                      >
                        {/* Glow Pin on Right Edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full shadow-lg animate-pulse" />
                      </div>

                      {/* Percentage Tag inside Bar */}
                      <span className="absolute inset-0 flex items-center justify-end pr-3 text-[10px] sm:text-xs font-black text-white/90 drop-shadow">
                        বাকি {toBengaliDigits(cycle.remainingDays)} দিন
                      </span>
                    </div>

                    {/* Footer Subtext */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5 px-1">
                      <span>{cycle.seasonOrPhaseBn}</span>
                      <span className="text-amber-300/90 font-medium">{cycle.currentDateFormattedBn}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lunar-Solar Gap Insight Box */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-black to-emerald-950/70 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl p-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40">
                  ⚖️
                </span>
                <div>
                  <h5 className="font-bold text-amber-300">
                    চন্দ্র ও সৌর বর্ষের {toBengaliDigits(summary.lunarSolarGapDays)} দিনের অলৌকিক পার্থক্য:
                  </h5>
                  <p className="text-[11px] text-emerald-200">
                    হিজরি বছর ৩৫৪ দিন এবং ইংরেজি বছর ৩৬৫ দিন হওয়ায় প্রতি বছর প্রায় ১১ দিন এগিয়ে আসে। ফলে মুসলিমদের রোজা ও হজ সকল ঋতুতে পালিত হয়—যা আল্লাহর অপরিসীম প্রজ্ঞা।
                  </p>
                </div>
              </div>

              {onOpenDayModal && (
                <button
                  onClick={onOpenDayModal}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 transition shadow cursor-pointer flex items-center gap-1"
                >
                  <span>আজকের পূর্ণ আমল</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODE 2: INDIVIDUAL 3-CALENDAR DETAILED CARDS VIEW                */}
      {/* ----------------------------------------------------------------- */}
      {viewMode === 'detailed' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {cycles.map((cycle) => {
            const isHijri = cycle.calendarType === 'hijri';
            const isGregorian = cycle.calendarType === 'gregorian';

            return (
              <div
                key={cycle.calendarType}
                className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${cycle.themeGradient} border-2 ${cycle.borderColor} shadow-xl flex flex-col justify-between space-y-4`}
              >
                {/* Top Badge & Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10 shadow">
                      {isHijri ? '🌙' : isGregorian ? '☀️' : '🌾'}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow ${cycle.badgeBg}`}>
                      {cycle.badgeText}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-white">
                      {cycle.titleBn}
                    </h4>
                    <span className="text-xs text-amber-300 font-mono font-bold block mt-0.5">
                      {cycle.yearLabelBn}
                    </span>
                  </div>
                </div>

                {/* Progress Ring / Gauge Area */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
                      {toBengaliDigits(cycle.currentDay)}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      / {toBengaliDigits(cycle.totalDays)} দিন
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHijri
                          ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                          : isGregorian
                          ? 'bg-gradient-to-r from-sky-400 to-cyan-400'
                          : 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      }`}
                      style={{ width: `${cycle.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-emerald-200">
                    <span>অগ্রগতি: <strong className="text-amber-300 font-mono">{toBengaliDigits(cycle.progressPercent)}%</strong></span>
                    <span>বাকি: <strong className="text-white font-mono">{toBengaliDigits(cycle.remainingDays)}</strong> দিন</span>
                  </div>
                </div>

                {/* Significance & Current Date */}
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] text-gray-300 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                    {cycle.cycleSignificanceBn}
                  </div>
                  <div className="text-[11px] font-bold text-amber-300 pt-1 text-center">
                    {cycle.currentDateFormattedBn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 3. SPIRITUAL REFLECTION: LIFE AS AKHIRAH EXAM GROUND              */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-black to-emerald-950/90 border border-amber-400/50 space-y-3 shadow-xl">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-amber-300">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>দুনিয়ার পরীক্ষাক্ষেত্র ও আখেরাতের শস্যক্ষেত্র (الدُّنْيَا مَزْرَعَةُ الآخِرَةِ):</span>
        </div>

        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed pl-3 border-l-2 border-amber-400 font-sans">
          {summary.akhiraReflectionBn}
        </p>

        <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>আল্লাহর হুকুম — সূরা আল-মুলক (আয়াত: ২):</span>
          </div>
          <p className="text-xs font-serif text-amber-100 italic">
            "الَّذِي خَلَقَ المَوْتَ وَالحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا"
          </p>
          <p className="text-[11px] text-emerald-200">
            "যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, যাতে তোমাদের পরীক্ষা করেন যে কে তোমাদের মধ্যে আমলের দিক থেকে সর্বোত্তম।" অতএব ক্যালেন্ডারের প্রতিটি অতিক্রান্ত দিন যেন আল্লাহর সন্তুষ্টি ও মাগফিরাতের পাথেয় হয়।
          </p>
        </div>
      </div>

    </div>
  );
};
