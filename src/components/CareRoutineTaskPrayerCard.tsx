import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Pill,
  Droplets,
  Utensils,
  Moon,
  Activity,
  Heart,
  ChevronDown,
  ChevronUp,
  Volume2,
  Bell,
  BellOff,
  Sparkles,
  Trash2,
  Edit3,
  Play,
  RotateCcw,
  Check,
  Star
} from 'lucide-react';
import { RoutineTask, TaskCategory } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface CareRoutineTaskPrayerCardProps {
  task: RoutineTask;
  currentTimeMinutes: number;
  onComplete: (taskId: string) => void;
  onUncomplete?: (taskId: string) => void;
  onStart: (taskId: string) => void;
  onToggleAlarm: (task: RoutineTask) => void;
  onEdit: (task: RoutineTask) => void;
  onDelete: (taskId: string) => void;
}

const CATEGORY_ICONS: Record<TaskCategory, { icon: React.ReactNode; labelBn: string; color: string; bg: string }> = {
  medicine: {
    icon: <Pill className="w-4 h-4 text-rose-400" />,
    labelBn: 'ওষুধ',
    color: 'text-rose-400',
    bg: 'bg-rose-500/15 border-rose-500/30'
  },
  water: {
    icon: <Droplets className="w-4 h-4 text-sky-400" />,
    labelBn: 'পানি পান',
    color: 'text-sky-400',
    bg: 'bg-sky-500/15 border-sky-500/30'
  },
  feeding: {
    icon: <Utensils className="w-4 h-4 text-amber-400" />,
    labelBn: 'খাবার',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15 border-amber-500/30'
  },
  prayer: {
    icon: <Moon className="w-4 h-4 text-emerald-400" />,
    labelBn: 'সালাত ও নামাজ',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30'
  },
  amal: {
    icon: <Sparkles className="w-4 h-4 text-teal-400" />,
    labelBn: 'আমল ও জিকির',
    color: 'text-teal-400',
    bg: 'bg-teal-500/15 border-teal-500/30'
  },
  personal_care: {
    icon: <Heart className="w-4 h-4 text-purple-400" />,
    labelBn: 'পরিচর্যা ও বিশ্রাম',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15 border-purple-500/30'
  },
  health_check: {
    icon: <Activity className="w-4 h-4 text-indigo-400" />,
    labelBn: 'স্বাস্থ্য পরীক্ষা',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15 border-indigo-500/30'
  },
  exercise: {
    icon: <Activity className="w-4 h-4 text-lime-400" />,
    labelBn: 'ব্যায়াম ও হাঁটা',
    color: 'text-lime-400',
    bg: 'bg-lime-500/15 border-lime-500/30'
  },
  custom: {
    icon: <Clock className="w-4 h-4 text-slate-400" />,
    labelBn: 'অন্যান্য কাজ',
    color: 'text-slate-400',
    bg: 'bg-slate-500/15 border-slate-500/30'
  }
};

const ISLAMIC_SUGGESTIONS: Record<TaskCategory, { advice: string; dhikrs: string[] }> = {
  medicine: {
    advice: 'রোগ মুক্তি একমাত্র আল্লাহর হাতে। ওষুধ গ্রহণের সময় ‘বিসমিল্লাহ’ এবং আরোগ্য কামনায় ‘আল্লাহুশ শাফী’ স্মরণ করুন।',
    dhikrs: ['আল্লাহুশ শাফী (আল্লাহই আরোগ্যকারী)', 'বিসমিল্লাহির রাহমানির রাহিম', 'লা বা’সা তুহুরুন ইনশাআল্লাহ']
  },
  water: {
    advice: 'সুন্নাত অনুযায়ী বসে, ডান হাতে ৩ ঢোকে পানি পান করুন। শুরুতে ‘বিসমিল্লাহ’ এবং শেষে ‘আলহামদুলিল্লাহ’ বলুন।',
    dhikrs: ['বিসমিল্লাহ (শুরুতে)', 'আলহামদুলিল্লাহ (শেষে)', 'সুবহানাল্লাহ']
  },
  feeding: {
    advice: 'খাবারের শুরুতে দোয়া পাঠ এবং পরিমিত আহার উত্তম সুন্নাত। আল্লাহর নিয়ামতের শুকরিয়া আদায় করুন।',
    dhikrs: ['আল্লাহুম্মা বারিক লানা ফিমা রাজাকতানা', 'বিসমিল্লাহি ওয়া আলা বারাকাতিল্লাহ', 'আলহামদুলিল্লাহিল্লাজি আতআমানা...']
  },
  prayer: {
    advice: 'ওয়াক্তমতো একাগ্রতার সাথে সালাত আদায় জান্নাতের চাবিকাঠি। সালাম ফিরিয়ে ৩ বার ইস্তিগফার ও আয়াতুল কুরসি পাঠ করুন।',
    dhikrs: ['আস্তাগফিরুল্লাহ (৩ বার)', 'আয়াতুল কুরসি পাঠ', 'আল্লাহুম্মা আনতাস সালাম...']
  },
  amal: {
    advice: 'নিয়মিত ছোট আমল আল্লাহর কাছে সর্বাধিক প্রিয়। অন্তরকে জিকিরে সতেজ রাখুন।',
    dhikrs: ['সুবহানাল্লাহি ওয়া বিহামদিহি', 'লা ইলাহা ইল্লাল্লাহ', 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ']
  },
  personal_care: {
    advice: 'পবিত্রতা ও পরিচ্ছন্নতা ঈমানের অঙ্গ। শরীরের হক আদায় করা ও বিশ্রাম নেওয়াও সুন্নাহর অন্তর্ভুক্ত।',
    dhikrs: ['আল্লাহুম্মা বিসমিকা আমুতু ওয়া আহইয়া', 'আলহামদুলিল্লাহিল্লাজি আহইয়ানা...', 'সুবহানাল্লাহ']
  },
  health_check: {
    advice: 'স্বাস্থ্য আল্লাহর অমূল্য আমানত। রোগ নির্ণয় ও সতর্ক থাকা নবীজির সুন্নাত।',
    dhikrs: ['হাসবুনাল্লাহু ওয়া নি’মাল ওয়াকিল', 'ইয়া হাইয়্যু ইয়া কাইয়্যুম', 'আল্লাহু আকবার']
  },
  exercise: {
    advice: 'শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে আল্লাহর কাছে অধিক প্রিয়। শরীরকে সুস্থ ও কর্মক্ষম রাখুন।',
    dhikrs: ['লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ', 'সুবহানাল্লাহিল আজিম', 'আলহামদুলিল্লাহ']
  },
  custom: {
    advice: 'যে কোনো ভালো কাজের শুরুতে ‘বিসমিল্লাহ’ বলে শুরু করলে তাতে আল্লাহর বিশেষ বরকত আসে।',
    dhikrs: ['বিসমিল্লাহ', 'তাওয়াক্কালতু আলাল্লাহ', 'রাব্বি যিদনি ইলমা']
  }
};

export const CareRoutineTaskPrayerCard: React.FC<CareRoutineTaskPrayerCardProps> = ({
  task,
  currentTimeMinutes,
  onComplete,
  onUncomplete,
  onStart,
  onToggleAlarm,
  onEdit,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Time calculations
  const [hStr, mStr] = task.scheduledTime.split(':');
  const startMinutes = parseInt(hStr || '0', 10) * 60 + parseInt(mStr || '0', 10);
  const duration = task.durationMinutes || 30;
  const endMinutes = Math.min(1440, startMinutes + duration);

  const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
  const endM = String(endMinutes % 60).padStart(2, '0');
  const endTimeStr = `${endH}:${endM}`;

  // Check if this task is currently active right now
  const isActiveNow = currentTimeMinutes >= startMinutes && currentTimeMinutes < endMinutes;
  const isPast = currentTimeMinutes >= endMinutes;
  const isCompleted = task.status === 'completed';

  const categoryMeta = CATEGORY_ICONS[task.category] || CATEGORY_ICONS.custom;
  const suggestions = ISLAMIC_SUGGESTIONS[task.category] || ISLAMIC_SUGGESTIONS.custom;

  // Speak clear Bengali Voice
  const handleTestVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('আপনার ডিভাইসে স্পিচ সিন্থেসিস সমর্থন করছে না।');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);

      // Play soft chime
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }

      const voiceText = task.voiceAnnouncementText || `বিসমিল্লাহ। এখন ${task.title}-এর নির্ধারিত সময় হয়েছে। অনুগ্রহ করে প্রস্তুতি নিন।`;
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BD'));
      if (bnVoice) {
        utterance.voice = bnVoice;
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden shadow-md ${
        isCompleted
          ? 'bg-emerald-950/20 border-emerald-800/40 opacity-90'
          : isActiveNow
          ? 'bg-slate-900 border-amber-400/80 shadow-amber-950/40 ring-2 ring-amber-400/30'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header Row */}
      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          {/* Category Icon & Title */}
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 ${categoryMeta.bg}`}>
              {categoryMeta.icon}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className={`text-sm sm:text-base font-bold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                  {task.title}
                </h4>
                {task.isMustDo && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                    <span>অবশ্যই করণীয়</span>
                  </span>
                )}
              </div>

              {/* Amount / Dose Pill */}
              {task.amountOrDose && (
                <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                  পরিমাণ / ডোজ: <span className="font-bold text-amber-300">{task.amountOrDose}</span>
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex items-center gap-1.5">
            {isActiveNow && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
                <span>চলমান ওয়াক্ত</span>
              </span>
            )}

            {isCompleted ? (
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>সম্পন্ন ✓</span>
                </span>
                {onUncomplete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUncomplete(task.id);
                    }}
                    title="ভুলে সম্পন্ন দিয়েছেন? অসম্পন্ন করুন (Undo)"
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 text-[10px] transition cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span className="text-[9px] font-bold hidden sm:inline">আনডু</span>
                  </button>
                )}
              </div>
            ) : isPast && !isActiveNow ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-medium">
                অপেক্ষমাণ
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium">
                আসন্ন
              </span>
            )}
          </div>
        </div>

        {/* 5-Waqt Prayer Style Time Box: শুরু, শেষ, ব্যাপ্তি */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-2.5 sm:p-3 grid grid-cols-3 divide-x divide-slate-800 text-center text-xs">
          <div className="px-1.5">
            <span className="text-[10px] text-slate-400 block">শুরুর সময়</span>
            <span className="font-mono font-bold text-amber-300 text-sm sm:text-base">
              {toBengaliDigits(task.scheduledTime)}
            </span>
          </div>

          <div className="px-1.5">
            <span className="text-[10px] text-slate-400 block">শেষের সময়</span>
            <span className="font-mono font-bold text-teal-300 text-sm sm:text-base">
              {toBengaliDigits(endTimeStr)}
            </span>
          </div>

          <div className="px-1.5">
            <span className="text-[10px] text-slate-400 block">মোট ব্যাপ্তি</span>
            <span className="font-bold text-emerald-300 text-sm sm:text-base">
              {toBengaliDigits(duration)} মিনিট
            </span>
          </div>
        </div>

        {/* One-Click Action & Expand Bar */}
        <div className="flex items-center gap-2 pt-1">
          {/* Complete / Undo Button */}
          {isCompleted ? (
            <button
              type="button"
              onClick={() => onUncomplete ? onUncomplete(task.id) : onComplete(task.id)}
              className="flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40"
              title="ভুলে সম্পন্ন দিয়েছেন? অসম্পন্ন অবস্থায় ফিরিয়ে নিন"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>পূর্বাবস্থায় ফেরান (Undo / অসম্পন্ন)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(task.id)}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                isActiveNow
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black ring-2 ring-amber-300/60 shadow-md'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>সম্পন্ন করেছি ✓</span>
            </button>
          )}

          {/* Bengali Voice Test Button */}
          <button
            type="button"
            onClick={handleTestVoice}
            title="বাংলা ভয়েস এলার্ম ঘোষণা শুনুন"
            className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-bold text-[11px]">ভয়েস</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(task)}
            title="এই শিডিউলটি সম্পাদনা করুন"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-teal-200 border border-slate-700 transition cursor-pointer flex items-center gap-1"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline font-bold text-[11px]">এডিট</span>
          </button>

          {/* Alarm Toggle */}
          <button
            type="button"
            onClick={() => onToggleAlarm(task)}
            title={task.alarmEnabled ? 'এলার্ম সক্রিয় আছে' : 'এলার্ম নিষ্ক্রিয় আছে'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              task.alarmEnabled
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            {task.alarmEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>

          {/* Dropdown Toggle Chevron */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            aria-label="বিস্তারিত তথ্য ড্রপডাউন"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion Expandable Detailed Info */}
      {isExpanded && (
        <div className="border-t border-slate-800 bg-slate-950/60 p-3.5 sm:p-4 space-y-3 text-xs">
          {/* Islamic Advice & Spiritual Guidance */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ইসলামিক আদব ও আমলযোগ্য শব্দ (সাজেশন):</span>
            </div>
            <p className="text-emerald-200/90 text-[11px] leading-relaxed">
              {suggestions.advice}
            </p>

            {/* Dhikr Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestions.dhikrs.map((dhikr, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-[10px] font-medium"
                >
                  🤲 {dhikr}
                </span>
              ))}
            </div>
          </div>

          {/* Custom Bengali Announcement Script */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>এলার্মের বাংলা ভয়েস টেক্সট:</span>
            </span>
            <p className="text-slate-300 text-[11px] font-medium">
              "{task.voiceAnnouncementText || `বিসমিল্লাহ। এখন ${task.title}-এর নির্ধারিত সময় হয়েছে।`}"
            </p>
          </div>

          {/* Notes if present */}
          {task.notes && (
            <div className="p-2 rounded-lg bg-slate-900/60 text-slate-300 text-[11px]">
              <span className="font-bold text-slate-400">বিশেষ নোট: </span>
              {task.notes}
            </div>
          )}

          {/* Action Row inside Dropdown */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400">
              ক্যাটেগরি: <strong className="text-slate-300">{categoryMeta.labelBn}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="px-2.5 py-1 rounded-lg bg-teal-950/60 hover:bg-teal-900/80 border border-teal-700/60 text-teal-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>সম্পাদনা করুন</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
