import React, { useState, useMemo } from 'react';
import {
  Activity,
  Clock,
  Sparkles,
  Droplets,
  Pill,
  Utensils,
  Moon,
  Heart,
  Trash2,
  CheckCircle2,
  Filter,
  RefreshCw,
  Check
} from 'lucide-react';
import { ActivityLog, TaskCategory } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface CareActivityHistoryLogProps {
  logs: ActivityLog[];
  onCleanDuplicates: () => void;
  onClearAllLogs: () => void;
  onDeleteLog: (logId: string) => void;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  medicine: {
    label: 'ওষুধ',
    icon: <Pill className="w-3.5 h-3.5 text-rose-400" />,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30'
  },
  water: {
    label: 'পানি পান',
    icon: <Droplets className="w-3.5 h-3.5 text-sky-400" />,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/30'
  },
  feeding: {
    label: 'খাবার / পুষ্টি',
    icon: <Utensils className="w-3.5 h-3.5 text-amber-400" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30'
  },
  prayer: {
    label: 'নামাজ',
    icon: <Moon className="w-3.5 h-3.5 text-emerald-400" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30'
  },
  amal: {
    label: 'আমল',
    icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" />,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/30'
  },
  personal_care: {
    label: 'পরিচর্যা ও ঘুম',
    icon: <Heart className="w-3.5 h-3.5 text-purple-400" />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30'
  },
  health_check: {
    label: 'পরীক্ষা',
    icon: <Activity className="w-3.5 h-3.5 text-indigo-400" />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30'
  },
  custom: {
    label: 'অন্যান্য',
    icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/30'
  }
};

export const CareActivityHistoryLog: React.FC<CareActivityHistoryLogProps> = ({
  logs,
  onCleanDuplicates,
  onClearAllLogs,
  onDeleteLog
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Normalize log item for pristine scannability
  const normalizedLogs = useMemo(() => {
    return logs.map(log => {
      let displayTitle = log.title.trim();

      // Clean ugly "(২০০ মিলি তরল পুষ্টি)" or "(১৫০ মিলি)" titles
      if (displayTitle.startsWith('(') && displayTitle.endsWith(')')) {
        const inner = displayTitle.slice(1, -1);
        if (log.category === 'water' || inner.includes('পানি')) {
          displayTitle = 'পর্যাপ্ত পানি পান';
        } else if (log.category === 'feeding' || inner.includes('পুষ্টি') || inner.includes('খাবার')) {
          displayTitle = 'পুষ্টিকর খাবার / তরল পুষ্টি গ্রহণ';
        } else if (log.category === 'medicine' || inner.includes('ট্যাবলেট') || inner.includes('ক্যাপসুল')) {
          displayTitle = 'নির্ধারিত ওষুধ সেবন';
        } else {
          displayTitle = `রুটিন কার্যক্রম — ${inner}`;
        }
      }

      // Remove repetitive suffix "সম্পন্ন হয়েছে" from title to keep it concise
      displayTitle = displayTitle.replace(/\s*সম্পন্ন হয়েছে/gi, '').replace(/\s*সম্পন্ন হয়েছে/gi, '').trim();

      return {
        ...log,
        cleanTitle: displayTitle
      };
    });
  }, [logs]);

  // Aggregate stats from logs
  const stats = useMemo(() => {
    let waterMl = 0;
    let medicineCount = 0;
    let feedingCount = 0;
    let prayerCount = 0;

    for (const log of logs) {
      if (log.category === 'water') {
        const match = log.amount?.match(/(\d+|[০-৯]+)/);
        if (match) {
          const eng = match[1]
            .replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());
          waterMl += parseInt(eng, 10) || 150;
        } else {
          waterMl += 200;
        }
      } else if (log.category === 'medicine') {
        medicineCount++;
      } else if (log.category === 'feeding') {
        feedingCount++;
      } else if (log.category === 'prayer' || log.category === 'amal') {
        prayerCount++;
      }
    }

    return { waterMl, medicineCount, feedingCount, prayerCount };
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    if (activeCategoryFilter === 'all') return normalizedLogs;
    return normalizedLogs.filter(l => l.category === activeCategoryFilter);
  }, [normalizedLogs, activeCategoryFilter]);

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 space-y-4 shadow-xl">
      {/* 1. Header with Title and Global Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-2">
              <span>আজকের কার্যক্রমের ইতিহাস (Activity History Log)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono font-bold">
                {toBengaliDigits(logs.length)} টি লগ
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              প্রিসাইজ ও গোছানো টাইমলাইন • ডুপ্লিকেট মুক্ত রিয়েল-টাইম ট্র্যাকিং
            </p>
          </div>
        </div>

        {/* Clean Duplicates & Reset Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={onCleanDuplicates}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
            title="একই সময়ের কোনো ডুপ্লিকেট লগ থাকলে সরান"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>🧹 ডুপ্লিকেট ক্লিন</span>
          </button>

          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 text-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1"
              title="আজকের সকল লগ পরিষ্কার করুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>লগ খালি করুন</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-rose-950 border border-rose-600 p-1 rounded-xl">
              <span className="text-[11px] text-rose-200 px-1 font-bold">নিশ্চিত?</span>
              <button
                onClick={() => {
                  onClearAllLogs();
                  setShowClearConfirm(false);
                }}
                className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
              >
                হ্যাঁ
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
              >
                না
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Today's Clean Aggregate Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300 font-medium">মোট পানি:</span>
          </div>
          <span className="font-mono font-black text-sky-300">
            {toBengaliDigits(stats.waterMl)} মিলি
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-rose-400" />
            <span className="text-slate-300 font-medium">ওষুধ:</span>
          </div>
          <span className="font-mono font-black text-rose-300">
            {toBengaliDigits(stats.medicineCount)} বার
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-medium">খাবার:</span>
          </div>
          <span className="font-mono font-black text-amber-300">
            {toBengaliDigits(stats.feedingCount)} বার
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">নামাজ/আমল:</span>
          </div>
          <span className="font-mono font-black text-emerald-300">
            {toBengaliDigits(stats.prayerCount)} ওয়াক্ত
          </span>
        </div>
      </div>

      {/* 3. Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
        <span className="text-slate-400 text-[11px] font-bold shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" />
          <span>ফিল্টার:</span>
        </span>

        {[
          { id: 'all', label: 'সব লগ' },
          { id: 'medicine', label: '💊 ওষুধ' },
          { id: 'water', label: '💧 পানি' },
          { id: 'feeding', label: '🥣 খাবার' },
          { id: 'prayer', label: '🕌 নামাজ' },
          { id: 'personal_care', label: '💜 পরিচর্যা' },
          { id: 'health_check', label: '🩺 পরীক্ষা' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 border text-xs ${
              activeCategoryFilter === cat.id
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Organized, Precise Activity List */}
      {filteredLogs.length === 0 ? (
        <div className="p-8 text-center text-slate-400 space-y-2 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <Activity className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs font-bold text-slate-300">এই ফিল্টারে কোনো কার্যক্রম পাওয়া যায়নি</p>
          <p className="text-[11px]">দৈনিক রুটিন সম্পন্ন করলে স্বয়ংক্রিয়ভাবে এখানে সুন্দরভাবে সংরক্ষিত হবে।</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filteredLogs.map(log => {
            const meta = CATEGORY_META[log.category] || CATEGORY_META.custom;
            return (
              <div
                key={log.id}
                className="p-2.5 sm:p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
              >
                {/* Left: Time & Icon & Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Time Badge */}
                  <span className="font-mono font-bold text-amber-300 text-xs bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{toBengaliDigits(log.timeString)}</span>
                  </span>

                  {/* Category Icon Badge */}
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${meta.bg}`}>
                    {meta.icon}
                  </div>

                  {/* Title & Amount Pill */}
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white truncate text-xs sm:text-sm">
                      {log.cleanTitle}
                    </span>

                    {log.amount && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[10px] font-mono font-bold shrink-0">
                        {toBengaliDigits(log.amount)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Status Tag & Delete Icon */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{log.action === 'started' ? 'শুরু' : 'সম্পন্ন ✓'}</span>
                  </span>

                  {/* Individual Delete Log Button */}
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    title="এই লগটি মুছুন"
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Clean Spiritual Reminder Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-800/50 flex items-center gap-2.5 text-xs text-emerald-300/90">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-[11px] italic leading-relaxed">
          <strong>আল্লাহর সন্তুষ্টি ও বরকত:</strong> আপনার প্রতিটি পরিচর্যা ও ভালো কাজ একটি উত্তম আমল। আল্লাহ আপনার শ্রমকে কবুল করুন ও আরোগ্য দান করুন।
        </p>
      </div>
    </div>
  );
};
