import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Plus,
  Play,
  Volume2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Folder,
  Radio
} from 'lucide-react';
import {
  playlistManager,
  FolderScheduleInfo,
  FreeTimeSlot,
  PlayableTrack
} from '../services/audioPlaylistManager';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface ScheduleTimelineVisualizerProps {
  selectedFolderId?: string;
  onPlayTrack?: (track: PlayableTrack) => void;
  onCreatePlaylistForSlot?: (start: string, end: string) => void;
  compact?: boolean;
}

export const ScheduleTimelineVisualizer: React.FC<ScheduleTimelineVisualizerProps> = ({
  selectedFolderId = 'schedule_radio',
  onPlayTrack,
  onCreatePlaylistForSlot,
  compact = false
}) => {
  const [nowDate, setNowDate] = useState<Date>(new Date());
  const [freeSlots, setFreeSlots] = useState<FreeTimeSlot[]>([]);
  const [folderInfo, setFolderInfo] = useState<FolderScheduleInfo | null>(null);

  // Update time every 10 seconds for real-time progress
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setNowDate(now);
      setFreeSlots(playlistManager.get24HourFreeTimeSlots());
      if (selectedFolderId) {
        setFolderInfo(playlistManager.getFolderScheduleInfo(selectedFolderId, now));
      }
    };

    update();
    const timer = setInterval(update, 10000);
    const unsub = playlistManager.subscribe(update);

    return () => {
      clearInterval(timer);
      unsub();
    };
  }, [selectedFolderId]);

  const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
  const currentPercent = Math.min(100, Math.max(0, (currentMinutes / 1440) * 100));

  const currentHourFormatted = String(nowDate.getHours()).padStart(2, '0');
  const currentMinFormatted = String(nowDate.getMinutes()).padStart(2, '0');
  const currentTimeBn = `${toBengaliDigits(currentHourFormatted)}:${toBengaliDigits(currentMinFormatted)}`;

  // Calculate total booked minutes
  const totalFreeMinutes = freeSlots.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalBookedMinutes = Math.max(0, 1440 - totalFreeMinutes);
  const bookedHours = Math.floor(totalBookedMinutes / 60);
  const freeHours = Math.floor(totalFreeMinutes / 60);

  return (
    <div className="rounded-2xl bg-emerald-950/80 border border-amber-400/50 p-3.5 sm:p-5 text-white space-y-4 shadow-xl backdrop-blur-md">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300">
            <Clock className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2">
              <span>২৪ ঘণ্টার অডিও শিডিউল ও ফাঁকা সময় ভিজ্যুয়ালাইজার</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-700 text-emerald-200">
                লাইভ ট্র্যাকিং
              </span>
            </h4>
            <p className="text-[11px] text-emerald-200/80">
              কোন অডিও কতক্ষণ চলবে, কখন শেষ হবে এবং সারা দিনের ফাঁকা স্লট
            </p>
          </div>
        </div>

        {/* Current Time Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-2.5 py-1 rounded-xl bg-amber-400 text-emerald-950 font-black text-xs shadow flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>বর্তমান সময়: {currentTimeBn}</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Visual Bar Graphic */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-300">
          <span>০০:০০ (রাত)</span>
          <span>০৬:০০ (সকাল)</span>
          <span>১২:০০ (দুপুর)</span>
          <span>১৮:০০ (সন্ধ্যা)</span>
          <span>২৪:০০ (রাত)</span>
        </div>

        <div className="relative h-6 sm:h-7 bg-emerald-900/80 rounded-xl border border-emerald-700 overflow-hidden shadow-inner flex">
          {/* Radio scheduled intervals simulation */}
          <div className="h-full bg-emerald-600/50 border-r border-emerald-500/40" style={{ width: '16.6%' }} title="তাহাজ্জুদ ও ফজর (০০:০০ - ০৪:০০)" />
          <div className="h-full bg-amber-500/40 border-r border-amber-400/40" style={{ width: '10.4%' }} title="ফজর পরবর্তী কুরআন (০৪:০০ - ০৬:৩০)" />
          <div className="h-full bg-teal-500/40 border-r border-teal-400/40" style={{ width: '14.5%' }} title="সকালের আজকার ও দুহা (০৬:৩০ - ১০:০০)" />
          <div className="h-full bg-cyan-500/40 border-r border-cyan-400/40" style={{ width: '8.3%' }} title="সূরা রহমান (১০:০০ - ১২:০০)" />
          <div className="h-full bg-emerald-500/40 border-r border-emerald-400/40" style={{ width: '14.5%' }} title="জোহর ও রুকাইয়াহ (১২:০০ - ১৫:৩০)" />
          <div className="h-full bg-indigo-500/40 border-r border-indigo-400/40" style={{ width: '8.3%' }} title="আসর ও হাদিস (১৫:৩০ - ১৭:৩০)" />
          <div className="h-full bg-amber-600/40 border-r border-amber-400/40" style={{ width: '8.3%' }} title="মাগরিব ও আজকার (১৭:৩০ - ১৯:৩০)" />
          <div className="h-full bg-teal-600/40 border-r border-teal-400/40" style={{ width: '19.1%' }} title="এশা ও ঘুম (১৯:৩০ - ২৪:০০)" />

          {/* Current Dynamic Time Indicator Needle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-300 shadow-[0_0_12px_#fbbf24] z-20 transition-all duration-500 flex items-center justify-center pointer-events-none"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-emerald-950 -top-1 absolute shadow animate-bounce" />
          </div>
        </div>

        {/* Legend / Metrics */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-emerald-200/90 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              শিডিউল বুকড: {toBengaliDigits(bookedHours)} ঘণ্টা
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              ফাঁকা সময় বাকি: {toBengaliDigits(freeHours)} ঘণ্টা
            </span>
          </div>

          <span className="text-amber-300 font-bold">
            📍 লাল/হলুদ নির্দেশক বর্তমান অবস্থান
          </span>
        </div>
      </div>

      {/* Selected Folder's Real-time Progress & Status */}
      {folderInfo && (
        <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-300" />
              <span className="font-black text-xs sm:text-sm text-amber-200">
                ফোল্ডার প্রগ্রেস: {folderInfo.folderTitleBn}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">
                {folderInfo.formattedRangeBn}
              </span>
            </div>

            {/* Live Playing or Status Badge */}
            {folderInfo.isCurrentlyActive ? (
              <div className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>লাইভ চলছে: {folderInfo.timeRemainingBn}</span>
              </div>
            ) : folderInfo.hasSchedule ? (
              <div className="text-[11px] text-emerald-300/80 font-medium">
                ⏳ শিডিউল সময়: {folderInfo.formattedRangeBn}
              </div>
            ) : (
              <div className="text-[11px] text-teal-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>যেকোনো সময় প্লে উপযোগী (উন্মুক্ত ফোল্ডার)</span>
              </div>
            )}
          </div>

          {/* Active Track Banner if Running */}
          {folderInfo.isCurrentlyActive && folderInfo.activeTrackTitle && (
            <div className="p-2.5 rounded-lg bg-emerald-900/60 border border-emerald-700/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold text-white truncate">
                  এখন যা চলছে: {folderInfo.activeTrackTitle}
                </span>
              </div>
              <span className="text-[11px] text-amber-300 font-mono shrink-0">
                সমাপ্তি: {toBengaliDigits(folderInfo.finishTime || '')}
              </span>
            </div>
          )}

          {/* Folder Coverage Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-emerald-300">
              <span>২৪ ঘণ্টার মধ্যে কভারেজ</span>
              <span className="font-bold text-amber-300">{toBengaliDigits(folderInfo.coveragePercent)}%</span>
            </div>
            <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, folderInfo.coveragePercent)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 24-Hour Free Time Slots Section (২৪ ঘণ্টার ফাঁকা সময় কত টা থেকে কত টা) */}
      <div className="space-y-2 pt-1 border-t border-emerald-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-amber-300">
              🕒 ২৪ ঘণ্টার ফাঁকা সময় (Unscheduled Free Slots):
            </span>
            <span className="text-[10px] text-emerald-300">
              ({toBengaliDigits(freeSlots.length)} টি ফাঁকা স্লট পাওয়া গেছে)
            </span>
          </div>

          <span className="text-[10px] text-emerald-200/80 hidden sm:inline">
            যেকোনো ফাঁকা স্লটে নতুন প্লেলিস্ট সেট করুন
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {freeSlots.slice(0, 6).map((slot) => (
            <div
              key={slot.id}
              className="p-2.5 rounded-xl bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-between gap-2 hover:border-amber-400/60 transition"
            >
              <div className="min-w-0">
                <div className="font-bold text-white text-xs font-mono">
                  {slot.rangeBn}
                </div>
                <div className="text-[10px] text-emerald-300">
                  ফাঁকা সময়: {slot.durationLabelBn}
                </div>
              </div>

              <button
                onClick={() => onCreatePlaylistForSlot?.(slot.start, slot.end)}
                className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 text-[10px] font-black flex items-center gap-1 transition shadow cursor-pointer shrink-0"
                title="এই সময়ে নতুন প্লেলিস্ট সেট করুন"
              >
                <Plus className="w-3 h-3" />
                <span>প্লেলিস্ট বানান</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
