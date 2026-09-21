import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, RotateCcw } from 'lucide-react';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { getLocalTodayString, getOffsetDateString, formatBengaliDateHuman } from '../services/careRoutineService';

interface CareRoutineDateNavigatorProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onShiftDate: (offset: number) => void;
  stats: {
    total: number;
    completed: number;
    missed: number;
    pending: number;
    percent: number;
    isPast: boolean;
    isToday: boolean;
    isFuture: boolean;
  };
}

export const CareRoutineDateNavigator: React.FC<CareRoutineDateNavigatorProps> = ({
  selectedDate,
  onSelectDate,
  onShiftDate,
  stats
}) => {
  const todayStr = getLocalTodayString();
  const yesterdayStr = getOffsetDateString(-1, todayStr);
  const dayBeforeYesterdayStr = getOffsetDateString(-2, todayStr);

  const formattedDate = formatBengaliDateHuman(selectedDate);

  let dateBadgeText = 'আজকের লাইভ রুটিন';
  let dateBadgeColor = 'bg-emerald-950 border-emerald-500 text-emerald-300';

  if (selectedDate === yesterdayStr) {
    dateBadgeText = 'গতকালকের সংরক্ষিত রুটিন ইতিহাস';
    dateBadgeColor = 'bg-amber-950 border-amber-500 text-amber-300';
  } else if (stats.isPast) {
    dateBadgeText = 'পূর্ববর্তী তারিখের সংরক্ষিত ইতিহাস';
    dateBadgeColor = 'bg-indigo-950 border-indigo-500 text-indigo-300';
  } else if (stats.isFuture) {
    dateBadgeText = 'ভবিষ্যতের শিডিউল ও পরিকল্পনা';
    dateBadgeColor = 'bg-sky-950 border-sky-500 text-sky-300';
  }

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border-2 border-emerald-700/80 shadow-xl backdrop-blur-md space-y-4">
      {/* Top Bar: Date Title, Navigation Arrows, and Quick Jump Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white">
                {formattedDate}
              </h2>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${dateBadgeColor}`}>
                {dateBadgeText}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              তারিখ অনুযায়ী সম্পন্ন কাজ, ছুটে যাওয়া কাজ ও সার্বিক রুটিন ট্র্যাকিং
            </p>
          </div>
        </div>

        {/* Date Stepper Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => onShiftDate(-1)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow"
            title="পূর্ববর্তী দিন"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">পূর্ববর্তী দিন</span>
          </button>

          <button
            onClick={() => onSelectDate(todayStr)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border shadow flex items-center gap-1.5 ${
              selectedDate === todayStr
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <span>আজ</span>
            {selectedDate === todayStr && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
          </button>

          <button
            onClick={() => onShiftDate(1)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow"
            title="পরবর্তী দিন"
          >
            <span className="hidden sm:inline">পরবর্তী দিন</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Date Picker Input */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  onSelectDate(e.target.value);
                }
              }}
              className="bg-slate-950 text-slate-200 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 font-mono cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Quick Date Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">দ্রুত নির্বাচন:</span>
        {[
          { id: todayStr, label: 'আজ (Today)' },
          { id: yesterdayStr, label: 'গতকাল (Yesterday)' },
          { id: dayBeforeYesterdayStr, label: 'গত পরশু' },
          { id: getOffsetDateString(1, todayStr), label: 'আগামীকাল' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => onSelectDate(item.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
              selectedDate === item.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Date-Specific Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-300">সম্পন্ন কাজ</span>
          </div>
          <span className="text-xs font-black text-emerald-300 font-mono">
            {toBengaliDigits(stats.completed)}টি
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-xs text-slate-300">ছুটে যাওয়া কাজ</span>
          </div>
          <span className="text-xs font-black text-rose-400 font-mono">
            {toBengaliDigits(stats.missed)}টি
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-xs text-slate-300">বাকি / অপেক্ষমাণ</span>
          </div>
          <span className="text-xs font-black text-sky-400 font-mono">
            {toBengaliDigits(stats.pending)}টি
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs text-slate-300">অগ্রগতি</span>
          </div>
          <span className="text-xs font-black text-amber-300 font-mono">
            %{toBengaliDigits(stats.percent)}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
        <div
          className="bg-emerald-500 h-full transition-all duration-500"
          style={{ width: `${stats.percent}%` }}
        />
        {stats.isPast && stats.missed > 0 && (
          <div
            className="bg-rose-500 h-full transition-all duration-500"
            style={{ width: `${Math.round((stats.missed / Math.max(1, stats.total)) * 100)}%` }}
          />
        )}
      </div>

      {/* Informational Banner for Past Dates */}
      {stats.isPast && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              📅 আপনি <strong>{formattedDate}</strong>-এর সংরক্ষিত রুটিন ইতিহাস দেখছেন। কালকের সম্পন্ন কাজগুলো সেই তারিখেই সংরক্ষিত আছে এবং আজকের তালিকায় দেখাচ্ছে না।
            </span>
          </div>
          <button
            onClick={() => onSelectDate(todayStr)}
            className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 transition cursor-pointer shadow flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>আজকের রুটিনে যান</span>
          </button>
        </div>
      )}
    </div>
  );
};
