import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  BarChart2,
  CalendarDays,
  Check,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  getDayOverview,
  getWeeklyAmalTrend,
  getMonthlyAmalTrend,
  toggleAmalCompletion,
  DayOverview,
  ChartDataPoint,
  AmalRecord
} from '../services/amalTrackerService';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { launchDhikrInTasbih } from '../utils/haptics';

interface AmalProgressAnalyticsProps {
  onCloseParentModal?: () => void;
}

export const AmalProgressAnalytics: React.FC<AmalProgressAnalyticsProps> = ({
  onCloseParentModal
}) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [dayOverview, setDayOverview] = useState<DayOverview>(() => getDayOverview());
  const [weeklyData, setWeeklyData] = useState<ChartDataPoint[]>(() => getWeeklyAmalTrend(7));
  const [monthlyData, setMonthlyData] = useState<ChartDataPoint[]>(() => getMonthlyAmalTrend(30));
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const refreshData = () => {
    setDayOverview(getDayOverview());
    setWeeklyData(getWeeklyAmalTrend(7));
    setMonthlyData(getMonthlyAmalTrend(30));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('islamic-amal-updated', handleUpdate);
    return () => window.removeEventListener('islamic-amal-updated', handleUpdate);
  }, []);

  const handleToggleItem = (id: string, category: any, titleBn: string) => {
    toggleAmalCompletion(id, category, titleBn);
    refreshData();
  };

  // Weekly calculations
  const weeklyAvgPercent = Math.round(
    weeklyData.reduce((sum, d) => sum + d.percent, 0) / (weeklyData.length || 1)
  );
  const bestDay = weeklyData.reduce((max, d) => (d.percent > max.percent ? d : max), weeklyData[0] || { shortDayBn: '-', percent: 0 });
  const totalWeeklyDhikr = weeklyData.reduce((sum, d) => sum + d.dhikrCount, 0);

  // Monthly calculations
  const monthlyAvgPercent = Math.round(
    monthlyData.reduce((sum, d) => sum + d.percent, 0) / (monthlyData.length || 1)
  );

  // Filtered lists for Today View
  const filteredCompleted = activeCategoryFilter === 'all'
    ? dayOverview.completedList
    : dayOverview.completedList.filter(item => item.category === activeCategoryFilter);

  const filteredRemaining = activeCategoryFilter === 'all'
    ? dayOverview.remainingList
    : dayOverview.remainingList.filter(item => item.category === activeCategoryFilter);

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Top Time-Range Switcher & Refresh Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-amber-200">
              সার্বিক আমল অগ্রগতি ও গ্রাফিক্যাল বিশ্লেষণ
            </h3>
            <p className="text-xs text-emerald-200/80">
              নামাজ, দোয়া, জিকির ও কুরআনের আজকের প্রগ্রেস এবং দিন/সপ্তাহ/মাসের ধারাবাহিকতা
            </p>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              timeRange === 'day'
                ? 'bg-amber-400 text-slate-950 font-black shadow'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>আজকের দিন</span>
          </button>

          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              timeRange === 'week'
                ? 'bg-amber-400 text-slate-950 font-black shadow'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>এই সপ্তাহ</span>
          </button>

          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              timeRange === 'month'
                ? 'bg-amber-400 text-slate-950 font-black shadow'
                : 'text-emerald-200 hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>এই মাস (৩০ দিন)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TODAY'S PROGRESS VIEW (আজকের প্রগ্রেস ও বাকি আছে কতটুকু) */}
      {/* ========================================================================= */}
      {timeRange === 'day' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Main Hero Card with Circular Gauge & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Circular Gauge Card */}
            <div className="bg-gradient-to-br from-emerald-900/90 via-emerald-950 to-teal-950 p-4 sm:p-5 rounded-2xl border border-amber-400/50 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>আজকের সামগ্রিক আমল প্রগ্রেস</span>
              </div>

              {/* SVG Circular Progress */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-emerald-950/80"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="transition-all duration-700 ease-out"
                    stroke="url(#progressGrad)"
                    strokeWidth="8.5"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(2 * Math.PI * 40) - (dayOverview.percent / 100) * (2 * Math.PI * 40)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                    {toBengaliDigits(dayOverview.percent)}%
                  </span>
                  <span className="text-[10px] text-emerald-200 font-semibold mt-0.5">
                    {dayOverview.percent === 100 ? 'মাশাআল্লাহ সম্পূর্ণ!' : 'সম্পন্ন হয়েছে'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-300/90 mt-1">
                আজকের তারিখ: <strong className="text-amber-200">{dayOverview.dayNameBn}, {dayOverview.dateBn}</strong>
              </div>
            </div>

            {/* Quick Metrics (Completed, Remaining, Dhikr Count, Streak) */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-3">
              
              <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-500/50 flex flex-col justify-between shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-300 font-bold">সম্পন্ন আমল</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-emerald-300 font-mono">
                    {toBengaliDigits(dayOverview.completedTasks)} <span className="text-xs text-emerald-200 font-normal">/ {toBengaliDigits(dayOverview.totalTasks)} টি</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">সালাত, দোয়া ও জিকির সম্পন্ন</p>
                </div>
              </div>

              <div className="bg-amber-950/40 p-3.5 rounded-2xl border border-amber-500/50 flex flex-col justify-between shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-bold">বাকি আছে</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-amber-300 font-mono">
                    {toBengaliDigits(dayOverview.remainingTasks)} <span className="text-xs text-amber-200 font-normal">টি আমল</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">আজকে আরও যা আদায় করতে হবে</p>
                </div>
              </div>

              <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-teal-500/40 flex flex-col justify-between shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-teal-300 font-bold">আজকের পঠিত জিকির</span>
                  <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-teal-300 font-mono">
                    {toBengaliDigits(dayOverview.totalDhikrCount || 0)} <span className="text-xs text-teal-200 font-normal">বার</span>
                  </div>
                  <p className="text-[11px] text-teal-300/80 mt-0.5">তসবিহ ও দোয়া পাঠের গণনা</p>
                </div>
              </div>

              <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-amber-400/40 flex flex-col justify-between shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-bold">ধারাবাহিক স্ট্রিক</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Flame className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-black text-amber-300 font-mono">
                    {toBengaliDigits(Math.max(1, dayOverview.completedTasks >= 3 ? 3 : 1))} <span className="text-xs text-amber-200 font-normal">দিন</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">দৈনিক ইবাদত চালিয়ে যান</p>
                </div>
              </div>

            </div>

          </div>

          {/* Category Progress Bars */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/80 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-2">
              <span>📊 ক্যাটাগরিভিত্তিক আজকের অগ্রগতি:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dayOverview.categories.map((cat) => (
                <div key={cat.category} className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-200 font-bold flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.nameBn}</span>
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      {toBengaliDigits(cat.completed)}/{toBengaliDigits(cat.total)} ({toBengaliDigits(cat.percent)}%)
                    </span>
                  </div>
                  <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden border border-emerald-800">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Pills for Tasks */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer border ${
                activeCategoryFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                  : 'bg-emerald-950 text-emerald-200 border-emerald-800 hover:border-amber-400/50'
              }`}
            >
              সকল আমল ({toBengaliDigits(dayOverview.totalTasks)})
            </button>
            {dayOverview.categories.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategoryFilter(cat.category)}
                className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer border flex items-center gap-1 ${
                  activeCategoryFilter === cat.category
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                    : 'bg-emerald-950 text-emerald-200 border-emerald-800 hover:border-amber-400/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn} ({toBengaliDigits(cat.total)})</span>
              </button>
            ))}
          </div>

          {/* TWO COLUMNS: COMPLETED vs REMAINING AMALS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Column 1: আজকের সম্পন্ন আমলসমূহ (Completed Amals) */}
            <div className="bg-emerald-950/90 rounded-2xl p-4 border border-emerald-600/70 space-y-3 shadow">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <h4 className="font-extrabold text-sm sm:text-base text-emerald-300">
                    আজকের সম্পন্ন আমল ({toBengaliDigits(filteredCompleted.length)} টি)
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  আলহামদুলিল্লাহ
                </span>
              </div>

              {filteredCompleted.length === 0 ? (
                <div className="p-6 text-center text-xs text-emerald-300/70 bg-black/30 rounded-xl border border-dashed border-emerald-800">
                  এখনো কোনো আমল সম্পন্ন হিসেবে মার্ক করা হয়নি। ডানের তালিকা থেকে অথবা নামাজ/দোয়া/তসবিহ পেজ থেকে পড়ে সম্পন্ন করুন!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredCompleted.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/40 flex items-start justify-between gap-2.5 hover:bg-emerald-900/60 transition"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleItem(item.id, item.category, item.titleBn)}
                          className="mt-0.5 p-1 rounded-lg bg-emerald-400 text-slate-950 font-black cursor-pointer shrink-0"
                          title="আন-চেক করুন"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-emerald-100 line-through opacity-90">
                            {item.titleBn}
                          </div>
                          {item.recommendedTimeBn && (
                            <p className="text-[10px] text-emerald-300/80">
                              {item.recommendedTimeBn}
                            </p>
                          )}
                          {item.completedAt && (
                            <span className="text-[10px] text-teal-300 font-mono inline-block">
                              🕒 সম্পন্ন হয়েছে: {item.completedAt}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 shrink-0 font-semibold">
                        {item.categoryNameBn}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: আজকে যা যা বাকি আছে (Remaining Amals to be Done) */}
            <div className="bg-emerald-950/90 rounded-2xl p-4 border border-amber-400/60 space-y-3 shadow">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-700/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
                  <h4 className="font-extrabold text-sm sm:text-base text-amber-200">
                    আজকে বাকি আমলসমূহ ({toBengaliDigits(filteredRemaining.length)} টি)
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                  বাকি আছে
                </span>
              </div>

              {filteredRemaining.length === 0 ? (
                <div className="p-6 text-center text-xs text-amber-300 bg-amber-400/10 rounded-xl border border-amber-400/30 font-bold space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto text-amber-400" />
                  <p>মাশাআল্লাহ! আজকের সকল নির্ধারিত আমল সফলভাবে সম্পন্ন হয়েছে!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredRemaining.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-black/40 border border-amber-400/30 hover:border-amber-400/70 flex items-start justify-between gap-2.5 transition group"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleToggleItem(item.id, item.category, item.titleBn)}
                          className="mt-0.5 p-1 rounded-lg bg-emerald-950 border border-amber-400/60 hover:bg-amber-400 hover:text-slate-950 text-amber-300 transition cursor-pointer shrink-0"
                          title="পড়েছি / সম্পন্ন হিসেবে মার্ক করুন"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <div className="space-y-1">
                          <div className="font-bold text-xs text-amber-100 group-hover:text-amber-200">
                            {item.titleBn}
                          </div>
                          {item.recommendedTimeBn && (
                            <p className="text-[10px] text-amber-200/80 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-300 shrink-0" />
                              <span>{item.recommendedTimeBn}</span>
                            </p>
                          )}
                          {item.virtueBn && (
                            <p className="text-[10px] text-emerald-200/90 italic">
                              💡 {item.virtueBn}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleItem(item.id, item.category, item.titleBn)}
                          className="px-2 py-1 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[10px] hover:bg-amber-300 transition cursor-pointer shadow"
                        >
                          পড়েছি ✓
                        </button>
                        {item.category === 'dhikr' && (
                          <button
                            onClick={() => {
                              launchDhikrInTasbih({
                                titleBn: item.titleBn,
                                arabicText: item.arabicText || '',
                                transliterationBn: item.titleBn,
                                translationBn: item.virtueBn || '',
                                targetCount: item.targetCount || 100
                              });
                              if (onCloseParentModal) onCloseParentModal();
                            }}
                            className="text-[10px] text-teal-300 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                          >
                            <span>তসবিহ 📿</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. WEEKLY GRAPH VIEW (সাপ্তাহিক গ্রাফ ও পর্যালোচনা - ৭ দিন) */}
      {/* ========================================================================= */}
      {timeRange === 'week' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Summary Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-emerald-600/60 text-center space-y-1">
              <span className="text-xs text-emerald-300 font-bold block">সাপ্তাহিক গড় অগ্রগতি</span>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {toBengaliDigits(weeklyAvgPercent)}%
              </div>
              <span className="text-[10px] text-emerald-200/80 block">গত ৭ দিনের গড় আমল সম্পন্ন</span>
            </div>

            <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-amber-400/60 text-center space-y-1">
              <span className="text-xs text-amber-300 font-bold block">সপ্তাহের সেরা দিন</span>
              <div className="text-xl font-black text-white">
                {bestDay.shortDayBn} ({toBengaliDigits(bestDay.percent)}%)
              </div>
              <span className="text-[10px] text-amber-200/80 block">সর্বাধিক আমল সম্পাদিত দিন</span>
            </div>

            <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-teal-500/50 text-center space-y-1">
              <span className="text-xs text-teal-300 font-bold block">সপ্তাহে মোট জিকির গণনা</span>
              <div className="text-2xl font-black text-teal-300 font-mono">
                {toBengaliDigits(totalWeeklyDhikr)} বার
              </div>
              <span className="text-[10px] text-teal-200/80 block">সপ্তাহজুড়ে তসবিহ ও দোয়া পাঠ</span>
            </div>
          </div>

          {/* Weekly Interactive Bar Chart */}
          <div className="bg-emerald-950/90 p-4 rounded-2xl border border-emerald-700/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-700/60">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span>গত ৭ দিনের আমল প্রগ্রেস বার গ্রাফ (%)</span>
              </h4>
              <span className="text-[11px] text-emerald-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
                টার্গেট: ৮০% - ১০০%
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                  <XAxis
                    dataKey="shortDayBn"
                    stroke="#a7f3d0"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a7f3d0"
                    fontSize={11}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${toBengaliDigits(val)}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as ChartDataPoint;
                        return (
                          <div className="bg-slate-950 p-3 rounded-xl border border-amber-400 shadow-2xl text-xs space-y-1 text-emerald-100">
                            <p className="font-bold text-amber-300">{data.labelBn} ({data.shortDayBn})</p>
                            <p>প্রগ্রেস: <strong className="text-amber-200">{toBengaliDigits(data.percent)}%</strong></p>
                            <p>সম্পন্ন আমল: <strong>{toBengaliDigits(data.completedCount)} / {toBengaliDigits(data.totalCount)} টি</strong></p>
                            <p>জিকির ও তসবিহ: <strong className="text-teal-300">{toBengaliDigits(data.dhikrCount)} বার</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="percent"
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  >
                    {weeklyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.percent >= 80 ? '#34d399' : entry.percent >= 50 ? '#fbbf24' : '#f87171'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs pt-1 border-t border-emerald-800">
              <span className="flex items-center gap-1 text-emerald-300">
                <span className="w-3 h-3 rounded bg-emerald-400"></span>
                <span>৮০% - ১০০% (উত্তম)</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <span className="w-3 h-3 rounded bg-amber-400"></span>
                <span>৫০% - ৭৯% (চলনশীল)</span>
              </span>
              <span className="flex items-center gap-1 text-rose-300">
                <span className="w-3 h-3 rounded bg-rose-400"></span>
                <span>৫০% এর নিচে</span>
              </span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MONTHLY GRAPH VIEW (মাসিক গ্রাফ ও ট্রেন্ড - ৩০ দিন) */}
      {/* ========================================================================= */}
      {timeRange === 'month' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Monthly Insight Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 p-4 rounded-2xl border border-amber-400/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">মাসিক ধারাবাহিকতা ও সামগ্রিক পর্যালোচনা</span>
              <h4 className="text-lg font-black text-white">
                মাসের গড় আমল প্রগ্রেস: <span className="text-amber-300 font-mono">{toBengaliDigits(monthlyAvgPercent)}%</span>
              </h4>
              <p className="text-xs text-emerald-200/90">
                গত ৩০ দিনে আপনার ইবাদত, সালাত ও দোয়ার ধারাবাহিক অগ্রগতির রেখাচিত্র
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" />
                <span>ধারাবাহিক মুমিন ট্র্যাকার</span>
              </div>
            </div>
          </div>

          {/* Monthly Area Trend Chart */}
          <div className="bg-emerald-950/90 p-4 rounded-2xl border border-emerald-700/80 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-700/60">
              <h4 className="font-extrabold text-sm sm:text-base text-amber-200 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-300" />
                <span>গত ৩০ দিনের আমল ধারাবাহিকতা কার্ভ (Area Graph)</span>
              </h4>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="monthAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
                  <XAxis
                    dataKey="labelBn"
                    stroke="#a7f3d0"
                    fontSize={10}
                    interval={4}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a7f3d0"
                    fontSize={11}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${toBengaliDigits(val)}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as ChartDataPoint;
                        return (
                          <div className="bg-slate-950 p-3 rounded-xl border border-amber-400 shadow-2xl text-xs space-y-1 text-emerald-100">
                            <p className="font-bold text-amber-300">{data.labelBn} ({data.shortDayBn})</p>
                            <p>প্রগ্রেস: <strong className="text-amber-200">{toBengaliDigits(data.percent)}%</strong></p>
                            <p>সম্পন্ন আমল: <strong>{toBengaliDigits(data.completedCount)} / {toBengaliDigits(data.totalCount)} টি</strong></p>
                            <p>জিকির ও তসবিহ: <strong className="text-teal-300">{toBengaliDigits(data.dhikrCount)} বার</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percent"
                    stroke="#fbbf24"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#monthAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Bottom Guidance & Cloud Sync Confirmation */}
      <div className="bg-black/40 p-3.5 rounded-2xl border border-emerald-700/60 flex items-start gap-2.5 text-xs text-emerald-200">
        <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold text-amber-200">সার্বক্ষণিক ক্লাউড সিঙ্ক ও অটোমেটিক ট্র্যাকিং: </span>
          <span>
            তসবিহ, নামাজ বা দোয়ার কার্ড থেকে যেকোনো আমল পড়া বা সম্পন্ন করা মাত্রই তা স্বয়ংক্রিয়ভাবে এখানে গণনা ও চার্টে রিয়েল-টাইমে আপডেট হয়। গুগল অ্যাকাউন্টে লগইন থাকলে ডিভাইস পরিবর্তনের পরও ডেটা সংরক্ষিত থাকে।
          </span>
        </div>
      </div>

    </div>
  );
};
