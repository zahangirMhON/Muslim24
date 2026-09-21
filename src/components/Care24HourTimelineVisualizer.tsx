import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Pill,
  Droplets,
  Utensils,
  Moon,
  Activity,
  Heart,
  ChevronRight
} from 'lucide-react';
import { RoutineTask, TaskCategory } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface FreeSlot {
  startMinutes: number;
  endMinutes: number;
  startTimeFormatted: string;
  endTimeFormatted: string;
  durationMinutes: number;
  durationLabelBn: string;
}

interface Care24HourTimelineVisualizerProps {
  tasks: RoutineTask[];
  onSelectFreeSlot?: (startTime: string, durationMinutes: number) => void;
  onSelectTask?: (task: RoutineTask) => void;
}

const CATEGORY_COLORS: Record<TaskCategory, { bg: string; border: string; text: string }> = {
  medicine: { bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-100' },
  water: { bg: 'bg-sky-500', border: 'border-sky-400', text: 'text-sky-100' },
  feeding: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-100' },
  prayer: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-100' },
  amal: { bg: 'bg-teal-500', border: 'border-teal-400', text: 'text-teal-100' },
  personal_care: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-100' },
  health_check: { bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-100' },
  exercise: { bg: 'bg-lime-500', border: 'border-lime-400', text: 'text-lime-100' },
  custom: { bg: 'bg-slate-500', border: 'border-slate-400', text: 'text-slate-100' }
};

export const Care24HourTimelineVisualizer: React.FC<Care24HourTimelineVisualizerProps> = ({
  tasks,
  onSelectFreeSlot,
  onSelectTask
}) => {
  const [nowDate, setNowDate] = useState<Date>(new Date());

  // Update current time every 10 seconds
  useEffect(() => {
    const updateTime = () => setNowDate(new Date());
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
  const currentPercent = Math.min(100, Math.max(0, (currentMinutes / 1440) * 100));

  const currentHourFormatted = String(nowDate.getHours()).padStart(2, '0');
  const currentMinFormatted = String(nowDate.getMinutes()).padStart(2, '0');
  const currentTimeBn = `${toBengaliDigits(currentHourFormatted)}:${toBengaliDigits(currentMinFormatted)}`;

  // Convert tasks to schedule intervals with midnight crossover support
  const scheduledIntervals = useMemo(() => {
    const list: Array<{
      task: RoutineTask;
      startMin: number;
      endMin: number;
      duration: number;
      leftPercent: number;
      widthPercent: number;
      uniqueKey: string;
    }> = [];

    tasks.forEach((task, idx) => {
      const [hStr, mStr] = task.scheduledTime.split(':');
      const startMin = parseInt(hStr || '0', 10) * 60 + parseInt(mStr || '0', 10);
      const duration = task.durationMinutes || 30;
      const rawEndMin = startMin + duration;

      if (rawEndMin > 1440) {
        // Crosses midnight (e.g. night sleep 23:00 to 06:00)
        // Segment 1: startMin to 1440 (23:00 to 24:00)
        const dur1 = 1440 - startMin;
        list.push({
          task,
          startMin,
          endMin: 1440,
          duration: dur1,
          leftPercent: (startMin / 1440) * 100,
          widthPercent: Math.max(0.8, (dur1 / 1440) * 100),
          uniqueKey: `${task.id}-seg1-${idx}`
        });

        // Segment 2: 0 to rawEndMin - 1440 (00:00 to 06:00)
        const dur2 = Math.min(1440, rawEndMin - 1440);
        list.push({
          task,
          startMin: 0,
          endMin: dur2,
          duration: dur2,
          leftPercent: 0,
          widthPercent: Math.max(0.8, (dur2 / 1440) * 100),
          uniqueKey: `${task.id}-seg2-${idx}`
        });
      } else {
        list.push({
          task,
          startMin,
          endMin: rawEndMin,
          duration,
          leftPercent: (startMin / 1440) * 100,
          widthPercent: Math.max(0.8, (duration / 1440) * 100),
          uniqueKey: `${task.id}-${idx}`
        });
      }
    });

    return list.sort((a, b) => a.startMin - b.startMin);
  }, [tasks]);

  // Compute Free Slots across the 24 hours (1440 minutes)
  const freeSlots = useMemo(() => {
    const slots: FreeSlot[] = [];
    if (scheduledIntervals.length === 0) {
      slots.push({
        startMinutes: 0,
        endMinutes: 1440,
        startTimeFormatted: '00:00',
        endTimeFormatted: '24:00',
        durationMinutes: 1440,
        durationLabelBn: '২৪ ঘণ্টা'
      });
      return slots;
    }

    let cursor = 0;
    for (const interval of scheduledIntervals) {
      if (interval.startMin > cursor + 15) { // at least 15 min gap
        const duration = interval.startMin - cursor;
        const startH = String(Math.floor(cursor / 60)).padStart(2, '0');
        const startM = String(cursor % 60).padStart(2, '0');
        const endH = String(Math.floor(interval.startMin / 60)).padStart(2, '0');
        const endM = String(interval.startMin % 60).padStart(2, '0');

        const hours = Math.floor(duration / 60);
        const mins = duration % 60;
        const durStr = hours > 0 ? `${toBengaliDigits(hours)} ঘণ্টা ${mins > 0 ? `${toBengaliDigits(mins)} মি.` : ''}` : `${toBengaliDigits(mins)} মিনিট`;

        slots.push({
          startMinutes: cursor,
          endMinutes: interval.startMin,
          startTimeFormatted: `${startH}:${startM}`,
          endTimeFormatted: `${endH}:${endM}`,
          durationMinutes: duration,
          durationLabelBn: durStr
        });
      }
      cursor = Math.max(cursor, interval.endMin);
    }

    if (cursor < 1440 - 15) {
      const duration = 1440 - cursor;
      const startH = String(Math.floor(cursor / 60)).padStart(2, '0');
      const startM = String(cursor % 60).padStart(2, '0');
      const hours = Math.floor(duration / 60);
      const mins = duration % 60;
      const durStr = hours > 0 ? `${toBengaliDigits(hours)} ঘণ্টা ${mins > 0 ? `${toBengaliDigits(mins)} মি.` : ''}` : `${toBengaliDigits(mins)} মিনিট`;

      slots.push({
        startMinutes: cursor,
        endMinutes: 1440,
        startTimeFormatted: `${startH}:${startM}`,
        endTimeFormatted: '24:00',
        durationMinutes: duration,
        durationLabelBn: durStr
      });
    }

    return slots;
  }, [scheduledIntervals]);

  // Booked vs Free metrics
  const totalBookedMinutes = useMemo(() => {
    let booked = 0;
    for (const interval of scheduledIntervals) {
      booked += interval.duration;
    }
    return Math.min(1440, booked);
  }, [scheduledIntervals]);

  const totalFreeMinutes = Math.max(0, 1440 - totalBookedMinutes);
  const bookedHours = Math.floor(totalBookedMinutes / 60);
  const bookedRemainingMins = totalBookedMinutes % 60;
  const freeHours = Math.floor(totalFreeMinutes / 60);
  const freeRemainingMins = totalFreeMinutes % 60;

  // Find active task right now
  const currentActiveTask = useMemo(() => {
    return scheduledIntervals.find(
      i => currentMinutes >= i.startMin && currentMinutes < i.endMin
    )?.task;
  }, [scheduledIntervals, currentMinutes]);

  // Find next upcoming task
  const nextUpcomingTask = useMemo(() => {
    return scheduledIntervals.find(i => i.startMin > currentMinutes)?.task;
  }, [scheduledIntervals, currentMinutes]);

  return (
    <div className="rounded-2xl bg-slate-900 border border-emerald-600/40 p-3.5 sm:p-5 text-white space-y-4 shadow-xl backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-2">
              <span>২৪ ঘণ্টার রুটিন ও ফাঁকা সময় ভিজ্যুয়ালাইজার</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600/60 text-emerald-300 font-bold">
                লাইভ ট্র্যাকিং
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              কোন কাজটি কখন চলবে, ব্যাপ্তি কতটুকু এবং সারাদিনের ফাঁকা সময়
            </p>
          </div>
        </div>

        {/* Current Time Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>বর্তমান সময়: {currentTimeBn}</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Visual Bar Graphic */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 px-0.5">
          <span>০০:০০ (রাত)</span>
          <span>০৬:০০ (সকাল)</span>
          <span>১২:০০ (দুপুর)</span>
          <span>১৮:০০ (সন্ধ্যা)</span>
          <span>২৪:০০ (রাত)</span>
        </div>

        {/* Timeline Bar */}
        <div className="relative h-7 sm:h-8 bg-slate-950 rounded-xl border border-slate-700 overflow-hidden shadow-inner">
          {/* Hour grid markers */}
          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none divide-x divide-slate-800/80" />

          {/* Scheduled intervals */}
          {scheduledIntervals.map((item, idx) => {
            const catColors = CATEGORY_COLORS[item.task.category] || CATEGORY_COLORS.custom;
            const isFinished = item.task.status === 'completed';
            const isActive = currentActiveTask?.id === item.task.id;

            return (
              <button
                key={item.uniqueKey || `${item.task.id}-${idx}`}
                type="button"
                onClick={() => onSelectTask?.(item.task)}
                title={`${item.task.title} (${item.task.scheduledTime}, ${item.duration} মিনিট)`}
                style={{
                  left: `${item.leftPercent}%`,
                  width: `${item.widthPercent}%`
                }}
                className={`absolute top-0 bottom-0 transition hover:brightness-125 focus:outline-none cursor-pointer border-r border-slate-900/40 ${
                  isActive
                    ? 'ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-950 z-20 ' + catColors.bg
                    : isFinished
                    ? 'opacity-70 ' + catColors.bg
                    : catColors.bg
                }`}
              />
            );
          })}

          {/* Current Time Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] z-30 pointer-events-none transition-all duration-500"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full -ml-[3px] -mt-1 shadow ring-2 ring-slate-950" />
          </div>
        </div>

        {/* Needle Label */}
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block shadow-sm" />
            <span className="font-medium text-amber-300">বর্তমান অবস্থান ({currentTimeBn})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>সালাত</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>ওষুধ</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>খাবার</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>আমল</span>
            </span>
          </div>
        </div>
      </div>

      {/* Booked vs Free Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>শিডিউল বুকড</span>
          </span>
          <p className="font-bold text-sm sm:text-base text-emerald-300 font-mono">
            {toBengaliDigits(bookedHours)} ঘণ্টা {bookedRemainingMins > 0 ? `${toBengaliDigits(bookedRemainingMins)} মি.` : ''}
          </p>
          <p className="text-[10px] text-slate-400">
            মোট {toBengaliDigits(tasks.length)}টি কাজ নির্ধারিত
          </p>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ফাঁকা সময় বাকি</span>
          </span>
          <p className="font-bold text-sm sm:text-base text-amber-300 font-mono">
            {toBengaliDigits(freeHours)} ঘণ্টা {freeRemainingMins > 0 ? `${toBengaliDigits(freeRemainingMins)} মি.` : ''}
          </p>
          <p className="text-[10px] text-slate-400">
            {toBengaliDigits(freeSlots.length)}টি ফাঁকা অবকাশ স্লট
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>বর্তমান স্ট্যাটাস</span>
          </span>
          {currentActiveTask ? (
            <div>
              <p className="font-bold text-xs sm:text-sm text-sky-300 truncate">
                {currentActiveTask.title}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">চলমান রয়েছে • {toBengaliDigits(currentActiveTask.durationMinutes || 30)} মিনিট</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-xs text-amber-200">বর্তমানে কোনো কাজ নেই</p>
              <p className="text-[10px] text-slate-400">
                {nextUpcomingTask ? `পরবর্তী: ${nextUpcomingTask.title} (${toBengaliDigits(nextUpcomingTask.scheduledTime)})` : 'সারাদিনের রুটিন সমাপ্ত'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Free Slots Quick Suggestions */}
      {freeSlots.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span>২৪ ঘণ্টার ফাঁকা সময় ও নতুন কাজ যুক্ত করার স্লট:</span>
            </span>
            <span className="text-[10px] text-emerald-400">ক্লিক করে সহজে যুক্ত করুন</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
            {freeSlots.slice(0, 6).map((slot, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between gap-2 transition text-xs"
              >
                <div className="min-w-0">
                  <p className="font-mono font-bold text-amber-300 text-[11px]">
                    {toBengaliDigits(slot.startTimeFormatted)} - {toBengaliDigits(slot.endTimeFormatted)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    ফাঁকা সময়: {slot.durationLabelBn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectFreeSlot?.(slot.startTimeFormatted, Math.min(60, slot.durationMinutes))}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 cursor-pointer shadow transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>কাজ যুক্ত করুন</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
