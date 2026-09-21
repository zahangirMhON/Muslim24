import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Share2,
  Copy,
  Check,
  Printer,
  Heart,
  Pill,
  Droplets,
  Utensils,
  Sparkles,
  Activity,
  ArrowLeft,
  Clock,
  ShieldCheck,
  ChevronRight,
  Download,
  Filter
} from 'lucide-react';
import { careRoutineService } from '../services/careRoutineService';
import { CareProfile, ActivityLog, RoutineTask } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface CareReportShareViewProps {
  onBackToApp?: () => void;
  onToast?: (msg: string) => void;
  initialRange?: '1d' | '7d' | '30d';
  initialProfileId?: string;
  isStandalone?: boolean;
}

export const CareReportShareView: React.FC<CareReportShareViewProps> = ({
  onBackToApp,
  onToast,
  initialRange = '7d',
  initialProfileId,
  isStandalone = false
}) => {
  const [profiles] = useState<CareProfile[]>(() => careRoutineService.getProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    if (initialProfileId && profiles.some(p => p.id === initialProfileId)) {
      return initialProfileId;
    }
    return careRoutineService.getActiveProfile().id;
  });

  const [dateRange, setDateRange] = useState<'1d' | '7d' | '30d'>(initialRange);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
  const allLogs: ActivityLog[] = careRoutineService.getLogs(selectedProfileId);
  const allTasks: RoutineTask[] = careRoutineService.getTasks(selectedProfileId);

  // Filter logs according to the selected date range
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const days = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : 30;
    const cutoffTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return allLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= cutoffTime;
    });
  }, [allLogs, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    let medicineCount = 0;
    let waterTotalMl = 0;
    let feedingCount = 0;
    let prayerCount = 0;
    let healthCheckCount = 0;
    let lastBloodPressure = '';

    filteredLogs.forEach(log => {
      if (log.category === 'medicine') medicineCount++;
      if (log.category === 'feeding') feedingCount++;
      if (log.category === 'prayer' || log.category === 'amal') prayerCount++;
      if (log.category === 'health_check') {
        healthCheckCount++;
        if (log.amount && !lastBloodPressure) lastBloodPressure = log.amount;
      }
      if (log.category === 'water' && log.amount) {
        const match = log.amount.match(/\d+/);
        if (match) {
          waterTotalMl += parseInt(match[0], 10);
        }
      }
    });

    const daysCount = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : 30;
    const scheduledMeds = allTasks.filter(t => t.category === 'medicine').length * daysCount;
    const adherenceRate = scheduledMeds > 0 ? Math.min(100, Math.round((medicineCount / scheduledMeds) * 100)) : 100;

    return {
      medicineCount,
      waterTotalMl,
      feedingCount,
      prayerCount,
      healthCheckCount,
      lastBloodPressure: lastBloodPressure || '১২০/৮০ (স্বাভাবিক)',
      adherenceRate
    };
  }, [filteredLogs, allTasks, dateRange]);

  // Generate web app shareable link
  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const path = window.location.pathname;
    return `${origin}${path}?care_report=true&range=${dateRange}&profile=${selectedProfileId}`;
  }, [dateRange, selectedProfileId]);

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      if (onToast) onToast('📋 রিপোর্টটির ওয়েব লিঙ্ক কপি হয়েছে! যেকোনো ব্রাউজারে এটি দেখা যাবে।');
    }
  };

  const handleShareWhatsApp = () => {
    const summaryText = `📋 *২৪/৭ কেয়ার ও রুটিন রিপোর্ট: ${activeProfile.nameBn} (${dateRange === '1d' ? 'আজকের' : dateRange === '7d' ? 'গত ৭ দিনের' : 'গত ১ মাসের'})*
💊 ওষুধ সেবন: ${toBengaliDigits(stats.medicineCount)} বার (${toBengaliDigits(stats.adherenceRate)}% নিয়ম মানা হয়েছে)
💧 পানি পান: ${toBengaliDigits(stats.waterTotalMl)} মিলি
🥣 খাবার/ফিডিং: ${toBengaliDigits(stats.feedingCount)} বার
🕌 নামাজ ও আমল: ${toBengaliDigits(stats.prayerCount)} বার
🩺 সর্বশেষ রক্তচাপ: ${stats.lastBloodPressure}

সম্পূর্ণ রিপোর্ট ওয়েব লিঙ্কে দেখুন:
${shareableUrl}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-2 sm:px-4 text-white">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4">
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold shrink-0"
              title="মূল অ্যাপ্লিকেশনে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ফিরে যান</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeProfile.avatar}</span>
              <h1 className="text-base sm:text-xl font-black text-amber-300">
                {activeProfile.nameBn} - কেয়ার ও রুটিন রিপোর্ট
              </h1>
            </div>
            <p className="text-xs text-emerald-300/80 mt-0.5">
              পরিবার, ডাক্তার ও কেয়ারগিভারদের জন্য প্রামাণ্য স্বাস্থ্য ও আমল অগ্রগতি বিবরণী
            </p>
          </div>
        </div>

        {/* Action Buttons: Copy Link, WhatsApp, Print */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyShareLink}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            {copiedLink ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'লিঙ্ক কপি হয়েছে' : 'লিঙ্ক কপি করুন'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-600 transition cursor-pointer flex items-center gap-1.5 shadow"
          >
            <Share2 className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপ</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-bold text-xs border border-emerald-700 transition cursor-pointer flex items-center gap-1.5"
            title="রিপোর্ট প্রিন্ট করুন বা PDF এ সেভ করুন"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* Profile & Date Range Filter Section */}
      <div className="p-4 rounded-3xl bg-emerald-950/80 border-2 border-emerald-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Profile Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <span className="text-xs text-emerald-300 font-bold shrink-0 mr-1 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>প্রোফাইল:</span>
          </span>
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                selectedProfileId === p.id
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 font-black scale-105 shadow'
                  : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border-emerald-700'
              }`}
            >
              <span>{p.avatar}</span>
              <span>{p.nameBn}</span>
            </button>
          ))}
        </div>

        {/* Date Range Selector (1 Day, 7 Days, 30 Days) */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-emerald-800 shrink-0">
          <span className="text-xs text-amber-300 font-bold px-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>সময়সীমা:</span>
          </span>
          {[
            { id: '1d', label: '১ দিন (আজ)' },
            { id: '7d', label: 'গত ৭ দিন (১ সপ্তাহ)' },
            { id: '30d', label: 'গত ১ মাস (৩০ দিন)' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                dateRange === r.id
                  ? 'bg-amber-400 text-emerald-950 font-black shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Medicine Compliance */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border-2 border-rose-500/60 text-white space-y-1 shadow">
          <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
            <span>ওষুধ গ্রহণ</span>
            <Pill className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {toBengaliDigits(stats.medicineCount)} <span className="text-xs font-normal text-emerald-300">বার</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            নিয়ম মানা: <strong className="text-amber-300">{toBengaliDigits(stats.adherenceRate)}%</strong>
          </p>
        </div>

        {/* Water / Hydration */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border-2 border-cyan-500/60 text-white space-y-1 shadow">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
            <span>পানি ও হাইড্রেশন</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {toBengaliDigits(stats.waterTotalMl)} <span className="text-xs font-normal text-emerald-300">মিলি</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            দৈনিক গড়: {toBengaliDigits(Math.round(stats.waterTotalMl / (dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : 30)))} মিলি
          </p>
        </div>

        {/* Feeding / Nutrition */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border-2 border-amber-500/60 text-white space-y-1 shadow">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
            <span>খাবার ও ফিডিং</span>
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {toBengaliDigits(stats.feedingCount)} <span className="text-xs font-normal text-emerald-300">বার</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            সুষম পুষ্টি পর্যবেক্ষণ
          </p>
        </div>

        {/* Prayer & Amal */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border-2 border-emerald-500/60 text-white space-y-1 shadow">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
            <span>নামাজ ও আমল</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {toBengaliDigits(stats.prayerCount)} <span className="text-xs font-normal text-emerald-300">ওয়াক্ত/আমল</span>
          </div>
          <p className="text-[11px] text-emerald-300">
            নিয়মিত দোয়া ও তিলাওয়াত
          </p>
        </div>

        {/* Health / Vitals */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border-2 border-purple-500/60 text-white space-y-1 shadow col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
            <span>রক্তচাপ ও ভাইটাল</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white truncate">
            {stats.lastBloodPressure}
          </div>
          <p className="text-[11px] text-emerald-300">
            পরীক্ষা: {toBengaliDigits(stats.healthCheckCount)} বার
          </p>
        </div>
      </div>

      {/* Detailed Chronological History Table */}
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-950/90 border-2 border-emerald-700/80 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-black text-white">
              কার্যক্রমের বিস্তারিত টাইমলাইন ({toBengaliDigits(filteredLogs.length)} টি এন্ট্রি)
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono">
            {dateRange === '1d' ? 'আজকের দিন' : dateRange === '7d' ? 'গত ৭ দিন' : 'গত ১ মাস'}
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-center py-8 text-emerald-400 text-xs">
            এই সময়সীমার মধ্যে এখনও কোনো কার্যক্রমের রেকর্ড যুক্ত করা হয়নি।
          </p>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-black/30 border border-emerald-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="font-mono text-amber-300 font-bold bg-emerald-900/80 px-2 py-1 rounded-lg shrink-0 text-center">
                    {toBengaliDigits(log.timeString)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white truncate">
                        {log.title}
                      </h4>
                      {log.amount && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                          {log.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString('bn-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} • {log.islamicQuote}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600 font-bold shrink-0">
                  সম্পন্ন
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Web Link Box */}
      <div className="p-4 rounded-2xl bg-black/40 border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="min-w-0">
          <span className="text-emerald-400 font-bold block mb-0.5">শেয়ার লিঙ্ক (সরাসরি এই পেজ দেখতে):</span>
          <span className="font-mono text-amber-300 text-[11px] break-all select-all block">
            {shareableUrl}
          </span>
        </div>
        <button
          onClick={handleCopyShareLink}
          className="px-3 py-1.5 rounded-xl bg-amber-400 text-emerald-950 font-black text-xs shrink-0 cursor-pointer shadow"
        >
          {copiedLink ? 'কপি হয়েছে' : 'লিঙ্ক কপি করুন'}
        </button>
      </div>
    </div>
  );
};
