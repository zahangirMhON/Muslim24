import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Pill,
  Droplets,
  Utensils,
  Moon,
  Sparkles,
  Heart,
  Activity,
  Trash2,
  Check,
  Bell,
  Volume2,
  Star,
  AlertCircle
} from 'lucide-react';
import { RoutineTask, TaskCategory, TaskPriority, AlarmToneType } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface CareTaskEditModalProps {
  task: RoutineTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: RoutineTask) => void;
  onDelete: (taskId: string) => void;
}

const CATEGORY_OPTIONS: { id: TaskCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'medicine', label: '💊 ওষুধ', icon: <Pill className="w-3.5 h-3.5 text-rose-400" /> },
  { id: 'water', label: '💧 পানি পান', icon: <Droplets className="w-3.5 h-3.5 text-sky-400" /> },
  { id: 'feeding', label: '🥣 খাবার / ফিডিং', icon: <Utensils className="w-3.5 h-3.5 text-amber-400" /> },
  { id: 'prayer', label: '🕌 সালাত ও নামাজ', icon: <Moon className="w-3.5 h-3.5 text-emerald-400" /> },
  { id: 'amal', label: '📿 আমল ও জিকির', icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" /> },
  { id: 'personal_care', label: '💜 পরিচর্যা ও ঘুম/বিশ্রাম', icon: <Heart className="w-3.5 h-3.5 text-purple-400" /> },
  { id: 'health_check', label: '🩺 স্বাস্থ্য পরীক্ষা', icon: <Activity className="w-3.5 h-3.5 text-indigo-400" /> },
  { id: 'exercise', label: '🏃 ব্যায়াম ও থেরাপি', icon: <Activity className="w-3.5 h-3.5 text-lime-400" /> },
  { id: 'custom', label: '⏰ অন্যান্য', icon: <Clock className="w-3.5 h-3.5 text-slate-400" /> }
];

export const CareTaskEditModal: React.FC<CareTaskEditModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('custom');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [amountOrDose, setAmountOrDose] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('important');
  const [isMustDo, setIsMustDo] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmTone, setAlarmTone] = useState<AlarmToneType>('bengali_voice');
  const [voiceAnnouncementText, setVoiceAnnouncementText] = useState('');
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'custom');
      setScheduledTime(task.scheduledTime || '08:00');
      setDurationMinutes(task.durationMinutes || 30);
      setAmountOrDose(task.amountOrDose || '');
      setPriority(task.priority || 'important');
      setIsMustDo(task.isMustDo ?? true);
      setAlarmEnabled(task.alarmEnabled ?? true);
      setAlarmTone(task.alarmTone || 'bengali_voice');
      setVoiceAnnouncementText(task.voiceAnnouncementText || '');
      setNotes(task.notes || '');
      setShowDeleteConfirm(false);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedTask: RoutineTask = {
      ...task,
      title: title.trim(),
      category,
      scheduledTime,
      durationMinutes: Math.max(5, durationMinutes),
      amountOrDose: amountOrDose.trim() || undefined,
      priority,
      isMustDo,
      alarmEnabled,
      alarmTone,
      voiceAnnouncementText: voiceAnnouncementText.trim() || `বিসমিল্লাহ। এখন ${title.trim()}-এর নির্ধারিত সময় হয়েছে।`,
      notes: notes.trim() || undefined
    };

    onSave(updatedTask);
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-emerald-600/70 p-4 sm:p-6 text-white shadow-2xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-amber-300">
                রুটিন ও শিডিউল সম্পাদনা (Edit Task)
              </h3>
              <p className="text-[11px] text-slate-400">
                সময়, ব্যাপ্তি, মাত্রা ও এলার্ম পরিবর্তন করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              কাজের নাম / শিরোনাম <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="যেমন: সকালে খালি পেটে কুসুম গরম পানি পান"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              ক্যাটাগরি
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
            >
              {CATEGORY_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time & Duration Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>শুরুর সময় (HH:mm)</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                মোট ব্যাপ্তি (মিনিট)
              </label>
              <input
                type="number"
                min={5}
                max={720}
                step={5}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-teal-300 font-bold text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ঘুমের জন্য সাধারণত ৪২০-৪৮০ মিনিট (৭-৮ ঘণ্টা)
              </span>
            </div>
          </div>

          {/* Amount / Dose & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                পরিমাণ বা ডোজ (যদি থাকে)
              </label>
              <input
                type="text"
                value={amountOrDose}
                onChange={e => setAmountOrDose(e.target.value)}
                placeholder="যেমন: ৫০০ মিলি, ১টি ক্যাপসুল"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                অগ্রাধিকার (Priority)
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="critical" className="bg-slate-900 text-rose-400">🔴 অতীব জরুরি (Critical)</option>
                <option value="important" className="bg-slate-900 text-amber-400">🟡 গুরুত্বপূর্ণ (Important)</option>
                <option value="normal" className="bg-slate-900 text-slate-300">⚪ সাধারণ (Normal)</option>
              </select>
            </div>
          </div>

          {/* Must Do & Alarm Toggles */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${isMustDo ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <span className="font-bold text-slate-200 block">অবশ্যই করণীয় (Must-Do)</span>
                  <span className="text-[10px] text-slate-400">দৈনিক অগ্রগতির স্কোরে যুক্ত থাকবে</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isMustDo}
                onChange={e => setIsMustDo(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
            </label>

            <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className={`w-4 h-4 ${alarmEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="font-bold text-slate-200">স্মার্ট এলার্ম সক্রিয়</span>
              </div>
              <input
                type="checkbox"
                checked={alarmEnabled}
                onChange={e => setAlarmEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Voice text & Notes */}
          <div>
            <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>বাংলা ভয়েস এলার্ম ঘোষণা টেক্সট</span>
            </label>
            <input
              type="text"
              value={voiceAnnouncementText}
              onChange={e => setVoiceAnnouncementText(e.target.value)}
              placeholder="যেমন: বিসমিল্লাহ। এখন পানি পানের সময় হয়েছে।"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              অতিরিক্ত নোট / প্রেসক্রিপশন নির্দেশিকা
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="খাওয়ার নিয়ম বা বিশেষ নির্দেশনা..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Delete Confirmation Warning */}
          {showDeleteConfirm && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-white space-y-2">
              <p className="text-xs font-bold text-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>আপনি কি নিশ্চিত যে এই রুটিন কাজটি পুরোপুরি মুছে ফেলতে চান?</span>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  না, বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white text-xs cursor-pointer"
                >
                  হ্যাঁ, মুছে ফেলুন
                </button>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>শিডিউল মুছুন</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
