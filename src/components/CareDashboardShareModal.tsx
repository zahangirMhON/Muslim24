import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  MessageCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Wifi,
  BatteryCharging,
  Battery,
  Layers,
  Sparkles,
  Pill,
  Droplets,
  Utensils,
  Moon,
  Info,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { RoutineTask, CareProfile, ActivityLog, TaskCategory } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { getLocalTodayString, formatBengaliDateHuman } from '../services/careRoutineService';

interface CareDashboardShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: CareProfile;
  tasks: RoutineTask[];
  logs: ActivityLog[];
  selectedDate?: string;
  onToast?: (msg: string) => void;
}

const CATEGORY_NAMES: Record<TaskCategory, string> = {
  prayer: 'সালাত',
  medicine: 'ওষুধ',
  water: 'পানি পান',
  feeding: 'খাবার',
  exercise: 'ব্যায়াম',
  amal: 'আমল',
  personal_care: 'পরিচর্যা',
  health_check: 'স্বাস্থ্য',
  custom: 'অন্যান্য'
};

const CATEGORY_ICONS: Record<TaskCategory, React.ReactNode> = {
  medicine: <Pill className="w-3.5 h-3.5 text-rose-400" />,
  water: <Droplets className="w-3.5 h-3.5 text-sky-400" />,
  feeding: <Utensils className="w-3.5 h-3.5 text-amber-400" />,
  prayer: <Moon className="w-3.5 h-3.5 text-emerald-400" />,
  amal: <Sparkles className="w-3.5 h-3.5 text-teal-400" />,
  personal_care: <Heart className="w-3.5 h-3.5 text-purple-400" />,
  exercise: <Activity className="w-3.5 h-3.5 text-lime-400" />,
  health_check: <Activity className="w-3.5 h-3.5 text-indigo-400" />,
  custom: <Clock className="w-3.5 h-3.5 text-slate-400" />
};

export const CareDashboardShareModal: React.FC<CareDashboardShareModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  tasks,
  logs,
  selectedDate,
  onToast
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'text'>('visual');
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'missed' | 'pending'>('all');

  // Device & System Details
  const [deviceModel, setDeviceModel] = useState<string>('ডিভাইস');
  const [screenRes, setScreenRes] = useState<string>('');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    // Detect device and OS details
    const ua = navigator.userAgent;
    let os = 'ডিভাইস';
    if (/android/i.test(ua)) os = 'অ্যান্ড্রয়েড মোবাইল';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'আইওএস (iPhone/iPad)';
    else if (/windows/i.test(ua)) os = 'উইন্ডোজ পিসি';
    else if (/macintosh|mac os x/i.test(ua)) os = 'ম্যাক ওএস (MacBook/iMac)';
    else if (/linux/i.test(ua)) os = 'লিনাক্স সিস্টেম';
    setDeviceModel(os);

    if (typeof window !== 'undefined' && window.screen) {
      setScreenRes(`${window.screen.width}x${window.screen.height}`);
    }

    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
      if ('getBattery' in navigator) {
        (navigator as any).getBattery?.().then((battery: any) => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(!!battery.charging);
        }).catch(() => {});
      }
    }
  }, [isOpen]);

  // Current Time in Minutes & Selected Date
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayStr = getLocalTodayString();
  const effectiveDate = selectedDate || todayStr;
  const isDateToday = effectiveDate === todayStr;
  const isDatePast = effectiveDate < todayStr;

  const dateFormatted = formatBengaliDateHuman(effectiveDate);
  const timeFormatted = `${toBengaliDigits(String(now.getHours()).padStart(2, '0'))}:${toBengaliDigits(String(now.getMinutes()).padStart(2, '0'))}`;

  // Analyze Tasks: Completed vs Missed vs Pending
  const analyzedTasks = useMemo(() => {
    return tasks.map(t => {
      const [h, m] = t.scheduledTime.split(':').map(Number);
      const scheduledMinutes = (h || 0) * 60 + (m || 0);
      const isPastSlot = isDatePast ? true : isDateToday ? currentMinutes > scheduledMinutes + (t.durationMinutes || 30) : false;
      const isCompleted = t.status === 'completed';
      const isMissed = !isCompleted && isPastSlot;
      const isPending = !isCompleted && !isPastSlot;

      return {
        ...t,
        isCompleted,
        isMissed,
        isPending,
        scheduledMinutes
      };
    });
  }, [tasks, currentMinutes, isDatePast, isDateToday]);

  const totalTasks = analyzedTasks.length;
  const completedTasks = analyzedTasks.filter(t => t.isCompleted);
  const missedTasks = analyzedTasks.filter(t => t.isMissed);
  const pendingTasks = analyzedTasks.filter(t => t.isPending);

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const missedPercent = totalTasks > 0 ? Math.round((missedTasks.length / totalTasks) * 100) : 0;
  const pendingPercent = totalTasks > 0 ? Math.round((pendingTasks.length / totalTasks) * 100) : 0;

  // Booked & Free Time
  const totalBookedMinutes = tasks.reduce((sum, t) => sum + (t.durationMinutes || 30), 0);
  const bookedHours = Math.floor(totalBookedMinutes / 60);
  const bookedMins = totalBookedMinutes % 60;
  const totalFreeMinutes = Math.max(0, 1440 - totalBookedMinutes);
  const freeHours = Math.floor(totalFreeMinutes / 60);
  const freeMins = totalFreeMinutes % 60;

  // Recharts Donut Data
  const donutData = useMemo(() => {
    const data = [];
    if (completedTasks.length > 0) {
      data.push({ name: 'সম্পন্ন', value: completedTasks.length, color: '#10b981' });
    }
    if (missedTasks.length > 0) {
      data.push({ name: 'ছুটে গেছে', value: missedTasks.length, color: '#f43f5e' });
    }
    if (pendingTasks.length > 0) {
      data.push({ name: 'অপেক্ষমাণ', value: pendingTasks.length, color: '#38bdf8' });
    }
    if (data.length === 0) {
      data.push({ name: 'কোনো কাজ নেই', value: 1, color: '#334155' });
    }
    return data;
  }, [completedTasks.length, missedTasks.length, pendingTasks.length]);

  // Recharts Category Bar Data
  const categoryBarData = useMemo(() => {
    const categories: TaskCategory[] = ['prayer', 'medicine', 'water', 'feeding', 'exercise', 'amal', 'personal_care'];
    return categories.map(cat => {
      const catTasks = analyzedTasks.filter(t => t.category === cat);
      const catCompleted = catTasks.filter(t => t.isCompleted).length;
      return {
        categoryBn: CATEGORY_NAMES[cat] || cat,
        মোট: catTasks.length,
        সম্পন্ন: catCompleted
      };
    }).filter(d => d.মোট > 0);
  }, [analyzedTasks]);

  // Filtered Task List
  const displayedTasks = useMemo(() => {
    if (filterType === 'completed') return completedTasks;
    if (filterType === 'missed') return missedTasks;
    if (filterType === 'pending') return pendingTasks;
    return analyzedTasks;
  }, [filterType, completedTasks, missedTasks, pendingTasks, analyzedTasks]);

  // Generate Clean Formatted Text Share
  const shareText = useMemo(() => {
    const batteryText = batteryLevel !== null
      ? `\n🔋 ব্যাটারি স্ট্যাটাস: ${toBengaliDigits(batteryLevel)}% (${isCharging ? 'চার্জিং হচ্ছে' : 'ব্যাটারি ব্যাকআপ'})`
      : '';

    return `📱 [${activeProfile.nameBn} - ড্যাশবোর্ড অগ্রগতি ও রুটিন রিপোর্ট]
📅 তারিখ: ${dateFormatted}
⏰ বর্তমান সময়: ${timeFormatted}
📲 ডিভাইস তথ্য: ${deviceModel} • স্ক্রিন: ${screenRes} • নেটওয়ার্ক: ${isOnline ? 'অনলাইন' : 'অফলাইন'}${batteryText}

📊 সার্বিক অগ্রগতি বিশ্লেষণ:
• সম্পন্ন কাজের হার: ${toBengaliDigits(progressPercent)}% (${toBengaliDigits(completedTasks.length)}/${toBengaliDigits(totalTasks)} টি কাজ সম্পন্ন)
• ছুটে যাওয়া বা বাকি কাজ: ${toBengaliDigits(missedTasks.length)}টি (${toBengaliDigits(missedPercent)}%)
• আসন্ন বা অপেক্ষমাণ কাজ: ${toBengaliDigits(pendingTasks.length)}টি (${toBengaliDigits(pendingPercent)}%)
• ২৪ ঘণ্টায় নির্ধারিত সময়: ${toBengaliDigits(bookedHours)} ঘণ্টা ${bookedMins > 0 ? `${toBengaliDigits(bookedMins)} মি.` : ''}
• সারাদিনের ফাঁকা সময়: ${toBengaliDigits(freeHours)} ঘণ্টা ${freeMins > 0 ? `${toBengaliDigits(freeMins)} মি.` : ''}

✅ সম্পন্ন কাজসমূহ (${toBengaliDigits(completedTasks.length)}টি):
${completedTasks.length > 0 ? completedTasks.map(t => `  ✓ [${toBengaliDigits(t.scheduledTime)}] ${t.title}${t.amountOrDose ? ` (${t.amountOrDose})` : ''}`).join('\n') : '  (আজ এখনও কোনো কাজ সম্পন্ন হিসেবে চিহ্নিত হয়নি)'}

⚠️ ছুটে যাওয়া বা না করা কাজ (${toBengaliDigits(missedTasks.length)}টি):
${missedTasks.length > 0 ? missedTasks.map(t => `  ✗ [${toBengaliDigits(t.scheduledTime)}] ${t.title}${t.amountOrDose ? ` (${t.amountOrDose})` : ''} - সময় উত্তীর্ণ`).join('\n') : '  (আলহামদুলিল্লাহ কোনো কাজ ছুটে যায়নি)'}

⏳ আসন্ন কাজসমূহ (${toBengaliDigits(pendingTasks.length)}টি):
${pendingTasks.length > 0 ? pendingTasks.slice(0, 5).map(t => `  • [${toBengaliDigits(t.scheduledTime)}] ${t.title}${t.amountOrDose ? ` (${t.amountOrDose})` : ''}`).join('\n') : '  (সারাদিনের সকল শিডিউল সমাপ্ত হয়েছে)'}

🤲 আজকের বার্তা ও দোয়া:
‘হে আল্লাহ! আমাদের সময় ও আমলে বরকত দিন এবং নিয়মিত সুন্নাত পালনে তাওফিক দিন।’`;
  }, [
    activeProfile.nameBn,
    dateFormatted,
    timeFormatted,
    deviceModel,
    screenRes,
    isOnline,
    batteryLevel,
    isCharging,
    progressPercent,
    completedTasks,
    totalTasks,
    missedTasks,
    missedPercent,
    pendingTasks,
    pendingPercent,
    bookedHours,
    bookedMins,
    freeHours,
    freeMins
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    onToast?.('ডিভাইসের তথ্যসহ ড্যাশবোর্ড রিপোর্ট সফলভাবে কপি করা হয়েছে!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    try {
      const encoded = encodeURIComponent(shareText);
      const win = window.open(`https://wa.me/?text=${encoded}`, '_blank');
      if (!win) {
        handleCopy();
      }
    } catch (e) {
      handleCopy();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeProfile.nameBn} - ড্যাশবোর্ড রিপোর্ট`,
          text: shareText
        });
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white">
                  ডিভাইসের তথ্যসহ ড্যাশবোর্ড রিপোর্ট
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  {activeProfile.nameBn}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                সম্পন্ন ও ছুটে যাওয়া কাজের গ্রাফ ও বিস্তারিত গোছানো রিপোর্ট
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device & System Info Card (Header Strip) */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{deviceModel}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>স্ক্রিন: {screenRes || 'স্বাভাবিক'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Wifi className={`w-3.5 h-3.5 shrink-0 ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span>{isOnline ? 'অনলাইন সক্রিয়' : 'অফলাইন'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            {isCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span>
              {batteryLevel !== null ? `${toBengaliDigits(batteryLevel)}% ${isCharging ? 'চার্জিং' : ''}` : 'ব্যাটারি সক্রিয়'}
            </span>
          </div>
        </div>

        {/* View Mode Switcher (Visual Charts vs Text Report) */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-slate-800/80 bg-slate-900">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>গ্রাফ ও কার্ড রিপোর্ট</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>টেক্সট সামারি</span>
            </button>
          </div>

          <div className="text-[11px] text-amber-300 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {activeTab === 'visual' ? (
            <>
              {/* 1. Interactive Donut Chart & Progress Stats */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Recharts Donut */}
                <div className="sm:col-span-5 h-44 flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        innerRadius={45}
                        outerRadius={68}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center percentage label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-emerald-300 font-mono">
                      {toBengaliDigits(progressPercent)}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">অগ্রগতি</span>
                  </div>
                </div>

                {/* Key Metrics Breakdown */}
                <div className="sm:col-span-7 space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="flex items-center gap-2 text-emerald-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>সম্পন্ন কাজ:</span>
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {toBengaliDigits(completedTasks.length)} / {toBengaliDigits(totalTasks)} টি
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="flex items-center gap-2 text-rose-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>ছুটে যাওয়া বা না করা কাজ:</span>
                    </span>
                    <span className="font-mono font-bold text-rose-300 text-sm">
                      {toBengaliDigits(missedTasks.length)} টি ({toBengaliDigits(missedPercent)}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="flex items-center gap-2 text-sky-300 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <span>আসন্ন বা অপেক্ষমাণ:</span>
                    </span>
                    <span className="font-mono font-bold text-sky-300 text-sm">
                      {toBengaliDigits(pendingTasks.length)} টি
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 px-1">
                    <span>শিডিউল বুকড: {toBengaliDigits(bookedHours)} ঘণ্টা {toBengaliDigits(bookedMins)} মি.</span>
                    <span>ফাঁকা সময়: {toBengaliDigits(freeHours)} ঘণ্টা {toBengaliDigits(freeMins)} মি.</span>
                  </div>
                </div>
              </div>

              {/* 2. Category Performance Bar Chart (Recharts) */}
              {categoryBarData.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>ক্যাটাগরি ভিত্তিক সম্পন্ন বনাম মোট শিডিউল</span>
                  </span>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="categoryBn" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="মোট" fill="#334155" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="সম্পন্ন" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* 3. Detailed Organized Task Cards Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs text-slate-200 flex items-center gap-1.5">
                    <span>কাজের বিস্তারিত তালিকা ও বর্তমান স্থিতি:</span>
                  </h4>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {[
                      { id: 'all', label: `সকল (${toBengaliDigits(totalTasks)})` },
                      { id: 'completed', label: `সম্পন্ন (${toBengaliDigits(completedTasks.length)})` },
                      { id: 'missed', label: `ছুটে গেছে (${toBengaliDigits(missedTasks.length)})` },
                      { id: 'pending', label: `আসন্ন (${toBengaliDigits(pendingTasks.length)})` }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFilterType(f.id as any)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer whitespace-nowrap ${
                          filterType === f.id
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {displayedTasks.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                      কোনো কাজ পাওয়া যায়নি।
                    </div>
                  ) : (
                    displayedTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                          task.isCompleted
                            ? 'bg-slate-950/80 border-emerald-500/30'
                            : task.isMissed
                            ? 'bg-rose-950/20 border-rose-500/40'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                            {CATEGORY_ICONS[task.category] || <Clock className="w-3.5 h-3.5 text-slate-400" />}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs truncate">
                                {task.title}
                              </span>
                              {task.amountOrDose && (
                                <span className="text-[10px] text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800 shrink-0">
                                  {task.amountOrDose}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>নির্ধারিত সময়: <strong className="text-amber-300 font-mono">{toBengaliDigits(task.scheduledTime)}</strong></span>
                              {task.actualCompletedTime && (
                                <span className="text-emerald-400">
                                  • সম্পন্ন: <strong className="font-mono">{toBengaliDigits(task.actualCompletedTime)}</strong>
                                </span>
                              )}
                              <span>• {toBengaliDigits(task.durationMinutes || 30)} মিনিট</span>
                            </div>

                            {task.notes && (
                              <p className="text-[10px] text-slate-400 italic line-clamp-1">
                                {task.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 self-end sm:self-center">
                          {task.isCompleted ? (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>সম্পন্ন</span>
                            </span>
                          ) : task.isMissed ? (
                            <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[10px] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>ছুটে গেছে / হয়নি</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-sky-300 font-bold text-[10px] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>আসন্ন ওয়াক্ত</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Text Report Preview */
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>শেয়ারের জন্য টেক্সট প্রিভিউ (এক ক্লিকে কপি করুন):</span>
              </span>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
                {shareText}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 font-medium">
            {dateFormatted}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে ✓' : 'রিপোর্ট কপি করুন'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপ</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
            >
              <Share2 className="w-4 h-4" />
              <span>শেয়ার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
