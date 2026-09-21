import React, { useEffect, useState } from 'react';
import { Bell, Check, Clock, X, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { smartAlarmService } from '../services/smartAlarmService';
import { careRoutineService } from '../services/careRoutineService';
import { SmartAlarmItem } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

export const AlarmRingingOverlay: React.FC = () => {
  const [activeAlarm, setActiveAlarm] = useState<SmartAlarmItem | null>(null);

  useEffect(() => {
    const unsub = smartAlarmService.onAlarmRinging((alarm) => {
      setActiveAlarm(alarm);
    });

    return () => unsub();
  }, []);

  if (!activeAlarm) return null;

  const handleDismiss = () => {
    smartAlarmService.dismissActiveAlarm();
    setActiveAlarm(null);
  };

  const handleSnooze = (minutes: number = 5) => {
    smartAlarmService.snoozeActiveAlarm(minutes);
    setActiveAlarm(null);
  };

  const handleMarkComplete = () => {
    if (activeAlarm.taskId) {
      careRoutineService.completeTask(activeAlarm.taskId);
    } else {
      // Log generic complete
      careRoutineService.executeParsedInput(
        careRoutineService.parseNaturalLanguageInput(`${activeAlarm.title} শেষ`)
      );
    }
    smartAlarmService.dismissActiveAlarm();
    setActiveAlarm(null);
  };

  return (
    <div
      id="alarm-ringing-overlay"
      className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="w-full max-w-md bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400 rounded-3xl p-6 text-white shadow-2xl text-center relative overflow-hidden">
        {/* Glowing Background Pulse */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

        {/* Ringing Bell Icon with Animated Waves */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mb-4 text-amber-300 shadow-xl">
          <Bell className="w-10 h-10 animate-bounce text-amber-400" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs mb-3 shadow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>স্মার্ট এলার্ম বাজছে • {toBengaliDigits(activeAlarm.timeString)}</span>
        </div>

        {/* Alarm Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
          {activeAlarm.title}
        </h2>

        {/* Voice or Audio Announcement Text */}
        <p className="text-sm text-emerald-200 bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/80 mb-4 leading-relaxed font-medium">
          {activeAlarm.voiceText || `বিসমিল্লাহ। এখন ${activeAlarm.title}-এর সময় হয়েছে।`}
        </p>

        {activeAlarm.folderTitleBn && (
          <div className="text-xs text-amber-300 font-bold mb-4 flex items-center justify-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>অডিও ফোল্ডার: {activeAlarm.folderTitleBn}</span>
          </div>
        )}

        {/* Big Action Buttons */}
        <div className="space-y-3">
          {/* PRIMARY: MARK COMPLETE & TRIGGER NEXT ACTION */}
          <button
            onClick={handleMarkComplete}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-base transition shadow-xl cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>কাজটি সম্পন্ন করেছি (পরবর্তী কাজ শুরু)</span>
          </button>

          {/* SNOOZE 5 MINUTES */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleSnooze(5)}
              className="py-3 px-3 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-bold text-xs border border-emerald-700 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>৫ মিনিট স্নুজ</span>
            </button>

            {/* DISMISS */}
            <button
              onClick={handleDismiss}
              className="py-3 px-3 rounded-2xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-bold text-xs border border-rose-500/60 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>বন্ধ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
