import React, { useState, useMemo } from 'react';
import {
  Plus,
  Clock,
  Pill,
  Droplets,
  Utensils,
  Moon,
  Sparkles,
  Activity,
  Heart,
  Bell,
  Check,
  AlertCircle,
  Volume2
} from 'lucide-react';
import { RoutineTask, TaskCategory, TaskPriority, AlarmToneType } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface CareQuickDailyTaskAdderProps {
  existingTasks: RoutineTask[];
  onAddTask: (task: RoutineTask) => void;
  defaultStartTime?: string;
  defaultDuration?: number;
}

interface PresetOption {
  title: string;
  category: TaskCategory;
  durationMinutes: number;
  amountOrDose?: string;
  icon: string;
  voiceText: string;
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    title: 'পানি পান ও রিহাইড্রেশন',
    category: 'water',
    durationMinutes: 10,
    amountOrDose: '১৫০ মিলি পরিষ্কার পানি',
    icon: '💧',
    voiceText: 'বিসমিল্লাহ। এখন পানি পান ও রিহাইড্রেশনের সময় হয়েছে।'
  },
  {
    title: 'নির্ধারিত ওষুধ সেবন',
    category: 'medicine',
    durationMinutes: 15,
    amountOrDose: '১টি ওষুধ / ক্যাপসুল',
    icon: '💊',
    voiceText: 'বিসমিল্লাহ। এখন নির্ধারিত ওষুধ সেবনের সময় হয়েছে।'
  },
  {
    title: 'পুষ্টিকর খাবার গ্রহণ',
    category: 'feeding',
    durationMinutes: 30,
    amountOrDose: '১ বাটি পুষ্টিকর খাবার',
    icon: '🥣',
    voiceText: 'বিসমিল্লাহ। খাবারের সময় হয়েছে, আল্লাহুম্মা বারিক লানা।'
  },
  {
    title: 'ওয়াক্তিয়া সালাত ও জামায়াত',
    category: 'prayer',
    durationMinutes: 30,
    icon: '🕌',
    voiceText: 'আসসালামু আলাইকুম। এখন ওয়াক্তিয়া সালাত আদায়ের সময় হয়েছে।'
  },
  {
    title: 'কুরআন তিলাওয়াত ও জিকির',
    category: 'amal',
    durationMinutes: 40,
    icon: '📿',
    voiceText: 'বিসমিল্লাহ। কুরআন তিলাওয়াত ও মাসনুন জিকিরের সময় হয়েছে।'
  },
  {
    title: 'হালকা হাঁটা ও শারীরিক ব্যায়াম',
    category: 'exercise',
    durationMinutes: 30,
    icon: '🚶‍♂️',
    voiceText: 'এখন হালকা হাঁটা ও শারীরিক ব্যায়ামের সময় হয়েছে।'
  },
  {
    title: 'বিশ্রাম ও ঘুম',
    category: 'personal_care',
    durationMinutes: 60,
    icon: '😴',
    voiceText: 'বিসমিল্লাহ। আরামদায়ক বিশ্রাম ও ঘুমের প্রস্তুতি নিন।'
  }
];

export const CareQuickDailyTaskAdder: React.FC<CareQuickDailyTaskAdderProps> = ({
  existingTasks,
  onAddTask,
  defaultStartTime,
  defaultDuration
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('medicine');
  const [scheduledTime, setScheduledTime] = useState(() => {
    if (defaultStartTime) return defaultStartTime;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(Math.ceil(now.getMinutes() / 15) * 15 % 60).padStart(2, '0');
    return `${h}:${m}`;
  });
  const [durationMinutes, setDurationMinutes] = useState<number>(defaultDuration || 30);
  const [amountOrDose, setAmountOrDose] = useState('');
  const [isMustDo, setIsMustDo] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [voiceText, setVoiceText] = useState('');

  // Apply preset
  const handleSelectPreset = (preset: PresetOption) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setDurationMinutes(preset.durationMinutes);
    setAmountOrDose(preset.amountOrDose || '');
    setVoiceText(preset.voiceText);
  };

  // Duplicate check
  const duplicateMatch = useMemo(() => {
    if (!title.trim() || !scheduledTime.trim()) return null;
    const norm = title.trim().toLowerCase().replace(/\s+/g, ' ');
    return existingTasks.find(
      t => t.scheduledTime.trim() === scheduledTime.trim() &&
           t.title.trim().toLowerCase().replace(/\s+/g, ' ') === norm
    );
  }, [existingTasks, title, scheduledTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: RoutineTask = {
      id: duplicateMatch ? duplicateMatch.id : `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      profileId: existingTasks[0]?.profileId || 'self',
      title: title.trim(),
      category,
      priority: isMustDo ? 'critical' : 'normal',
      isMustDo,
      isFavorite: true,
      scheduledTime,
      durationMinutes,
      status: 'pending',
      amountOrDose: amountOrDose.trim() || undefined,
      alarmEnabled,
      alarmTone: 'bengali_voice',
      repeatDaily: true,
      voiceAnnouncementText: voiceText.trim() || `বিসমিল্লাহ। এখন ${title.trim()}-এর নির্ধারিত সময় হয়েছে।`
    };

    onAddTask(newTask);

    // Reset fields
    setTitle('');
    setAmountOrDose('');
    setVoiceText('');
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-white shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              প্রতিদিনের নতুন কাজ সহজে যুক্ত করুন
            </h4>
            <p className="text-[11px] text-slate-400">
              ডুপ্লিকেট এন্ট্রি প্রতিরোধ সহ তাৎক্ষণিক শিডিউল সমন্বয়
            </p>
          </div>
        </div>
      </div>

      {/* Quick Preset Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400">দ্রুত প্রি-সেট নির্বাচন:</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_OPTIONS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-400/40 text-[11px] flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{p.icon}</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              বিষয়ের নাম / কাজের বিবরণ:
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="যেমন: সকালের ওষুধ, জোহর সালাত, ইত্যাদি"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              ক্যাটেগরি:
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="medicine">💊 ওষুধ</option>
              <option value="water">💧 পানি পান</option>
              <option value="feeding">🥣 পুষ্টিকর খাবার</option>
              <option value="prayer">🕌 নামাজ ও সালাত</option>
              <option value="amal">📿 কুরআন ও আমল</option>
              <option value="personal_care">❤️ পরিচর্যা ও গোসল</option>
              <option value="health_check">🩺 স্বাস্থ্য পরীক্ষা</option>
              <option value="exercise">🚶‍♂️ ব্যায়াম ও হাঁটা</option>
              <option value="custom">⏱️ অন্যান্য কাজ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Scheduled Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              শুরুর সময়:
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              required
              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              ব্যাপ্তি (মিনিট):
            </label>
            <select
              value={durationMinutes}
              onChange={e => setDurationMinutes(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value={10}>১০ মিনিট</option>
              <option value={15}>১৫ মিনিট</option>
              <option value={20}>২০ মিনিট</option>
              <option value={30}>৩০ মিনিট</option>
              <option value={45}>৪৫ মিনিট</option>
              <option value={60}>১ ঘণ্টা (৬০ মি.)</option>
              <option value={90}>১.৫ ঘণ্টা (৯০ মি.)</option>
              <option value={120}>২ ঘণ্টা (১২০ মি.)</option>
              <option value={180}>৩ ঘণ্টা (১৮০ মি.)</option>
            </select>
          </div>

          {/* Dose / Amount */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              মাত্রা / পরিমাণ:
            </label>
            <input
              type="text"
              value={amountOrDose}
              onChange={e => setAmountOrDose(e.target.value)}
              placeholder="যেমন: ১টি ক্যাপসুল"
              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Alarm & Voice Options */}
        <div className="flex items-center gap-4 text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={alarmEnabled}
              onChange={e => setAlarmEnabled(e.target.checked)}
              className="rounded accent-amber-400 w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>বাংলা ভয়েস এলার্ম চালু</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={isMustDo}
              onChange={e => setIsMustDo(e.target.checked)}
              className="rounded accent-emerald-400 w-4 h-4 cursor-pointer"
            />
            <span>অবশ্যই করণীয় (Must-Do)</span>
          </label>
        </div>

        {/* Duplicate Warning / Resolution Notice */}
        {duplicateMatch && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>সতর্কতা:</strong> {toBengaliDigits(scheduledTime)}-এ "{duplicateMatch.title}" ইতিমধ্যে বিদ্যমান। যুক্ত করলে এটি স্বয়ংক্রিয়ভাবে আপডেট হবে, কোনো ডুপ্লিকেট এন্ট্রি তৈরি হবে না।
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{duplicateMatch ? 'রুটিনের কাজটি আপডেট করুন' : '+ সহজে রুটিনে যুক্ত করুন'}</span>
        </button>
      </form>
    </div>
  );
};
