import React, { useState, useEffect } from 'react';
import {
  Clock,
  Bell,
  BellOff,
  MapPin,
  Info,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertTriangle,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Droplets,
  ShieldCheck,
  Flame,
  Calendar,
  Award,
  ArrowRight,
  BarChart2,
  TrendingUp,
  Check
} from 'lucide-react';
import { Language, PrayerTimeItem } from '../types';
import { getCurrentMonthlySignificance, getNextPrayerInfo, getDetailedPrayerState, ALL_PRAYER_DUAS, PrayerDuaAmal, JUMUAH_14_RAKAT_SEQUENCE, JumuahRakatStep } from '../utils/prayerTimes';
import { translations } from '../locales/translations';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { NafelPrayersSection } from './NafelPrayersSection';
import { SpecialDayAmalSuggestions } from './SpecialDayAmalSuggestions';
import { launchDhikrInTasbih } from '../utils/haptics';
import {
  toggleAmalCompletion,
  getDayOverview,
  openUserProfileProgressTab,
  promptAmalLoginModal,
  loadDayAmalState,
  DayOverview
} from '../services/amalTrackerService';

interface PrayerCardProps {
  schedule: PrayerTimeItem[];
  lang: Language;
  locationName: string;
  onOpenSettings: () => void;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({
  schedule,
  lang,
  locationName,
  onOpenSettings
}) => {
  const t = translations[lang];
  const [alarmEnabled, setAlarmEnabled] = useState<Record<string, boolean>>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  });

  const [expandedPrayerKey, setExpandedPrayerKey] = useState<string | null>('dhuhr');
  const [showMonthlySignificance, setShowMonthlySignificance] = useState<boolean>(false);
  const [showJumuahDetails, setShowJumuahDetails] = useState<boolean>(false);
  const [showPrayerDuas, setShowPrayerDuas] = useState<boolean>(false);
  const [showNafelSection, setShowNafelSection] = useState<boolean>(false);
  const [activeJumuahTab, setActiveJumuahTab] = useState<'breakdown' | 'tracker' | 'sunnahs' | 'faq'>('breakdown');
  const [dayAmalOverview, setDayAmalOverview] = useState<DayOverview>(() => getDayOverview());
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>(() => {
    const state = loadDayAmalState(new Date().toISOString().split('T')[0]);
    return {
      fajr: state.items['amal-salah-fajr']?.isCompleted || false,
      dhuhr: state.items['amal-salah-dhuhr']?.isCompleted || false,
      asr: state.items['amal-salah-asr']?.isCompleted || false,
      maghrib: state.items['amal-salah-maghrib']?.isCompleted || false,
      isha: state.items['amal-salah-isha']?.isCompleted || false,
    };
  });

  const [completedJumuahSteps, setCompletedJumuahSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('jumuah_completed_steps_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const handleAmalUpdate = () => {
      const state = loadDayAmalState(new Date().toISOString().split('T')[0]);
      setCompletedPrayers({
        fajr: state.items['amal-salah-fajr']?.isCompleted || false,
        dhuhr: state.items['amal-salah-dhuhr']?.isCompleted || false,
        asr: state.items['amal-salah-asr']?.isCompleted || false,
        maghrib: state.items['amal-salah-maghrib']?.isCompleted || false,
        isha: state.items['amal-salah-isha']?.isCompleted || false,
      });
      setDayAmalOverview(getDayOverview());
    };

    window.addEventListener('islamic-amal-updated', handleAmalUpdate);
    return () => {
      window.removeEventListener('islamic-amal-updated', handleAmalUpdate);
    };
  }, []);

  const isTodayFriday = new Date().getDay() === 5;

  const handlePrayerToggle = (prayerKey: string, prayerNameBn: string) => {
    const amalId = `amal-salah-${prayerKey}`;
    const effectiveTitle = isTodayFriday && prayerKey === 'dhuhr' ? 'জুমু\'আ সালাত (ফরজ ও সুন্নাতসহ)' : `${prayerNameBn} সালাত`;
    
    promptAmalLoginModal(`${effectiveTitle} আদায়`, () => {
      const newStatus = toggleAmalCompletion(amalId, 'prayer', effectiveTitle);
      setCompletedPrayers(prev => ({
        ...prev,
        [prayerKey]: newStatus
      }));

      // If Friday Dhuhr/Jumuah is toggled, also sync Farz 2-rakat step in Jumuah sequence
      if (prayerKey === 'dhuhr' && isTodayFriday) {
        setCompletedJumuahSteps(prev => {
          const next = { ...prev, jum_step_3: newStatus };
          try {
            localStorage.setItem('jumuah_completed_steps_v1', JSON.stringify(next));
          } catch (e) {
            console.error(e);
          }
          return next;
        });
      }

      setDayAmalOverview(getDayOverview());
    });
  };

  const toggleJumuahStep = (stepId: string) => {
    setCompletedJumuahSteps(prev => {
      const next = { ...prev, [stepId]: !prev[stepId] };
      try {
        localStorage.setItem('jumuah_completed_steps_v1', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }

      // If Farz 2-rakat step is toggled in Jumuah tracker, sync with main dhuhr prayer
      if (stepId === 'jum_step_3') {
        const farzDone = !!next[stepId];
        setCompletedPrayers(p => ({ ...p, dhuhr: farzDone }));
        toggleAmalCompletion('amal-salah-dhuhr', 'prayer', 'জুমু\'আ সালাত (ফরজ ও সুন্নাতসহ)');
      }

      return next;
    });
  };

  const completedRakatCount = JUMUAH_14_RAKAT_SEQUENCE.reduce((sum, item) => {
    return sum + (completedJumuahSteps[item.id] ? item.rakatCount : 0);
  }, 0);
  const [detailedState, setDetailedState] = useState(() => getDetailedPrayerState(schedule));
  const [duaCategoryTab, setDuaCategoryTab] = useState<'pre' | 'in_prayer' | 'post'>('pre');
  const [activeDuaId, setActiveDuaId] = useState<string>('azan_dua');
  const [countdownMode, setCountdownMode] = useState<'current_end' | 'next_start'>('current_end');
  const [dismissPreReminder, setDismissPreReminder] = useState<boolean>(false);

  const monthlyData = getCurrentMonthlySignificance();

  useEffect(() => {
    const timer = setInterval(() => {
      setDetailedState(getDetailedPrayerState(schedule));
    }, 1000);
    return () => clearInterval(timer);
  }, [schedule]);

  const toggleAlarm = (key: string) => {
    setAlarmEnabled(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPrayerIcon = (key: string) => {
    switch (key) {
      case 'fajr':
      case 'sehri':
        return <Sunrise className="w-4 h-4 text-amber-300" />;
      case 'sunrise':
      case 'dhuhr':
      case 'ishraq':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'asr':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'maghrib':
      case 'sunset':
      case 'iftar':
        return <Sunset className="w-4 h-4 text-rose-400" />;
      case 'isha':
      case 'tahajjud':
      case 'awwabin':
        return <Moon className="w-4 h-4 text-indigo-300" />;
      default:
        return <Clock className="w-4 h-4 text-emerald-300" />;
    }
  };

  const currentPrayerName = lang === 'bn' ? detailedState.currentPrayer.nameBn : detailedState.currentPrayer.nameEn;
  const nextPrayerName = lang === 'bn' ? detailedState.nextPrayer.nameBn : detailedState.nextPrayer.nameEn;

  // Separate schedule items into categories
  const farzPrayers = schedule.filter(p => p.prayerCategory === 'farz' || ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(p.key));
  const nafelPrayers = schedule.filter(p => p.prayerCategory === 'nafel' || ['tahajjud', 'ishraq', 'awwabin'].includes(p.key));
  const sunEvents = schedule.filter(p => p.prayerCategory === 'sun_event' || ['sunrise', 'sunset', 'sehri', 'iftar'].includes(p.key));

  // Circular progress calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius; // ~326.7
  const progressOffset = circumference - (detailedState.currentProgressPercent / 100) * circumference;

  // Filter Duas by active category
  const filteredDuas = ALL_PRAYER_DUAS.filter(d => d.category === duaCategoryTab);
  const selectedDua = ALL_PRAYER_DUAS.find(d => d.id === activeDuaId) || filteredDuas[0] || ALL_PRAYER_DUAS[0];

  return (
    <div 
      className={`bg-gradient-to-br ${detailedState.theme.gradientClass} text-white rounded-2xl p-4 sm:p-5 shadow-2xl border ${detailedState.theme.cardBorderClass} relative overflow-hidden space-y-5 transition-all duration-700`}
      style={{ backgroundImage: detailedState.theme.bgStyle }}
    >
      
      {/* Dynamic Time-of-Day Environment Badge */}
      <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-base">{detailedState.theme.skyIcon}</span>
          <span className="font-bold text-amber-200">{detailedState.theme.themeNameBn}</span>
        </div>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-200 hover:text-amber-300 transition cursor-pointer"
        >
          <MapPin className="w-3 h-3 text-amber-300" />
          <span>{locationName}</span>
        </button>
      </div>

      {/* Live Prayer & Amal Tracking Banner (দৈনিক সালাত ও আমল ট্র্যাকিং এবং দিকনির্দেশনা) */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400/60 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg shadow-md shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-amber-200">
                  আজকের সালাত ও আমল ট্র্যাকিং
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                  লাইভ সিঙ্ক
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                সালাত আদায়ের পর নিচের <strong>'আদায় করেছি ✓'</strong> বাটনে ক্লিক করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => openUserProfileProgressTab()}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>📊 অগ্রগতি ও গ্রাফ দেখুন ↗</span>
            </button>
          </div>
        </div>

        {/* Progress bar for today's tasks */}
        <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-emerald-200">
              আজকের সর্বমোট আমল অগ্রগতি: <strong className="text-amber-300">{toBengaliDigits(dayAmalOverview.percent)}%</strong>
            </span>
            <span className="text-teal-200 font-semibold">
              {toBengaliDigits(dayAmalOverview.completedTasks)} টি সম্পন্ন • {toBengaliDigits(dayAmalOverview.remainingTasks)} টি বাকি
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-400 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(8, dayAmalOverview.percent))}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-emerald-300/80 pt-0.5">
            <span>💡 দিন, সপ্তাহ ও মাসের বিস্তারিত গ্রাফ দেখতে উপরের 👤 প্রোফাইল ➔ 'অগ্রগতি' ট্যাবে যান।</span>
            <button
              type="button"
              onClick={() => openUserProfileProgressTab()}
              className="text-amber-300 hover:underline font-bold"
            >
              গ্রাফ দেখুন ↗
            </button>
          </div>
        </div>
      </div>

      {/* Pre-reminder Warning Banner (১০ মিনিট সতর্কবার্তা) */}
      {detailedState.isPreReminderActive && !dismissPreReminder && (
        <div className="bg-gradient-to-r from-amber-500/30 via-rose-900/80 to-amber-500/30 border border-amber-400/80 rounded-xl p-3 shadow-lg flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-amber-400 text-slate-950 font-black text-sm shrink-0">
              ⚠️
            </div>
            <div>
              <div className="font-extrabold text-amber-200 text-xs sm:text-sm">
                {detailedState.preReminderType === 'ending_soon'
                  ? `ওয়াক্ত শেষের সতর্কতা! ${currentPrayerName} এর সময় শেষ হতে মাত্র ${toBengaliDigits(detailedState.preReminderMinutesLeft)} মিনিট বাকি!`
                  : `নামাজের প্রস্তুতির সময়! পরবর্তী ${nextPrayerName} শুরু হতে মাত্র ${toBengaliDigits(detailedState.preReminderMinutesLeft)} মিনিট বাকি!`}
              </div>
              <div className="text-[11px] text-amber-100/90 mt-0.5">
                অজু সম্পন্ন করে জামায়াত বা সময়মতো সালাত আদায়ের প্রস্তুতি নিন।
              </div>
            </div>
          </div>
          <button
            onClick={() => setDismissPreReminder(true)}
            className="text-xs font-bold text-amber-300 hover:text-white px-2 py-1 rounded bg-black/40 border border-amber-400/40 shrink-0 cursor-pointer"
          >
            ঠিক আছে
          </button>
        </div>
      )}

      {/* MAIN HERO: CIRCULAR PROGRESS COUNTDOWN & WAQT vs JAMAAT COMPARISON */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shadow-inner flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Current Prayer Overview */}
        <div className="space-y-3 text-center sm:text-left w-full lg:w-1/3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>চলতি নামাজ ওয়াক্ত</span>
            </div>
            {isTodayFriday && detailedState.currentPrayer.key === 'dhuhr' && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow">
                <span>🕌</span>
                <span>আজ পবিত্র জুমু'আ বার</span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              {getPrayerIcon(detailedState.currentPrayer.key)}
              <span>{isTodayFriday && detailedState.currentPrayer.key === 'dhuhr' ? 'জুমু\'আ সালাত' : `${currentPrayerName} সালাত`}</span>
            </h2>
            <p className="text-xs text-amber-200/90 mt-1">
              ওয়াক্ত অতিবাহিত: <span className="font-bold text-amber-300">{toBengaliDigits(detailedState.currentProgressPercent)}%</span>
            </p>
          </div>

          {/* Waqt & Jamaat Badges */}
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-emerald-200 flex items-center gap-1">
                <span>📣 আজান/শুরু:</span>
              </span>
              <span className="font-bold text-amber-300 font-mono text-sm">{detailedState.currentPrayer.azanTimeString}</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
              <span className="text-teal-200 flex items-center gap-1">
                <span>🕌 {isTodayFriday && detailedState.currentPrayer.key === 'dhuhr' ? 'জুমার জামায়াত ও খুতবা:' : 'মসজিদে জামায়াত:'}</span>
              </span>
              <span className="font-bold text-teal-200 font-mono text-sm">{detailedState.currentPrayer.jamaatTimeString}</span>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
              <span className="text-rose-300 flex items-center gap-1">
                <span>⏱️ ওয়াক্ত শেষ:</span>
              </span>
              <span className="font-bold text-rose-300 font-mono text-sm">{detailedState.currentPrayer.endTimeString || 'পরবর্তী ওয়াক্ত'}</span>
            </div>
          </div>

          {/* One-Click Action Button for Current Waqt / Jumuah in Hero */}
          <div>
            <button
              type="button"
              onClick={() => handlePrayerToggle(detailedState.currentPrayer.key, isTodayFriday && detailedState.currentPrayer.key === 'dhuhr' ? 'জুমু\'আ' : currentPrayerName)}
              className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                completedPrayers[detailedState.currentPrayer.key]
                  ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300/60 shadow-emerald-950/50'
                  : isTodayFriday && detailedState.currentPrayer.key === 'dhuhr'
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300/60'
                  : 'bg-white/10 hover:bg-amber-400/20 text-emerald-200 hover:text-amber-200 border border-white/20'
              }`}
            >
              {completedPrayers[detailedState.currentPrayer.key] ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950 fill-emerald-200" />
                  <span>{isTodayFriday && detailedState.currentPrayer.key === 'dhuhr' ? 'জুমু\'আ সালাত আদায় সম্পন্ন হয়েছে ✓' : `${currentPrayerName} সালাত আদায় সম্পন্ন হয়েছে ✓`}</span>
                </>
              ) : (
                <>
                  <span>🕌</span>
                  <span>{isTodayFriday && detailedState.currentPrayer.key === 'dhuhr' ? 'আমি জুম্মার নামাজ পড়েছি ✓ (ট্র্যাকিং করুন)' : `${currentPrayerName} সালাত আদায় করেছি ✓`}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center: Circular Progress Bar Timer */}
        <div className="flex flex-col items-center justify-center relative shrink-0">
          
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background track circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-white/10"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Gradient stroke circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="transition-all duration-1000 ease-linear"
                stroke="url(#timerGradient)"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center p-2">
              <span className="text-[10px] text-amber-200/90 font-bold uppercase tracking-wider">
                {countdownMode === 'current_end' ? 'চলতি ওয়াক্ত শেষ হতে' : 'পরবর্তী ওয়াক্ত শুরু হতে'}
              </span>

              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight my-0.5">
                {countdownMode === 'current_end' ? (
                  `${toBengaliDigits(String(detailedState.currentRemainingHours).padStart(2, '0'))}:${toBengaliDigits(String(detailedState.currentRemainingMinutes).padStart(2, '0'))}:${toBengaliDigits(String(detailedState.currentRemainingSeconds).padStart(2, '0'))}`
                ) : (
                  `${toBengaliDigits(String(detailedState.nextRemainingHours).padStart(2, '0'))}:${toBengaliDigits(String(detailedState.nextRemainingMinutes).padStart(2, '0'))}:${toBengaliDigits(String(detailedState.nextRemainingSeconds).padStart(2, '0'))}`
                )}
              </div>

              <span className="text-[10px] font-semibold text-emerald-200 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                {countdownMode === 'current_end' ? 'অবশিষ্ট সময়' : 'কাউন্টডাউন'}
              </span>
            </div>
          </div>

          {/* Mode Switch Button */}
          <div className="flex items-center gap-1 mt-3 bg-black/40 p-1 rounded-xl border border-white/10 text-[11px]">
            <button
              onClick={() => setCountdownMode('current_end')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                countdownMode === 'current_end' ? 'bg-amber-400 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
              }`}
            >
              ⏱️ বর্তমান ওয়াক্ত শেষ
            </button>
            <button
              onClick={() => setCountdownMode('next_start')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                countdownMode === 'next_start' ? 'bg-amber-400 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
              }`}
            >
              🕌 পরবর্তী ওয়াক্ত শুরু
            </button>
          </div>

        </div>

        {/* Right Side: Next Prayer Overview */}
        <div className="space-y-3 text-center sm:text-right w-full lg:w-1/3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/40 text-teal-200 text-xs font-bold">
            <span>পরবর্তী নামাজ ওয়াক্ত</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-end gap-2">
              <span>{nextPrayerName}</span>
              {getPrayerIcon(detailedState.nextPrayer.key)}
            </h3>
            <p className="text-xs text-teal-200/90 mt-1">
              শুরু হতে বাকি: <span className="font-bold text-amber-300">{detailedState.nextRemainingFormattedBn}</span>
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-teal-200">আযান/ওয়াক্ত শুরু:</span>
              <span className="font-bold text-amber-300 font-mono">{detailedState.nextPrayer.azanTimeString}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-1">
              <span className="text-emerald-200">মসজিদে জামায়াত:</span>
              <span className="font-bold text-teal-200 font-mono">{detailedState.nextPrayer.jamaatTimeString}</span>
            </div>
          </div>
        </div>

      </div>

      {/* SPECIAL DAY / MONTH AMAL & DHIKR SUGGESTIONS (বিশেষ দিন ও মাসের আমল ও জিকির প্রগ্রেস) */}
      <SpecialDayAmalSuggestions onOpenJumuahDetails={() => setShowJumuahDetails(true)} />

      {/* SPECIAL SECTION: JUMU'AH (জুমু'আ) 14 RAKAT BREAKDOWN & COMPREHENSIVE SUNNAH SYSTEM */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-2xl p-4 sm:p-5 border-2 border-amber-400/60 shadow-2xl space-y-4">
        
        {/* Header Toggle */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowJumuahDetails(!showJumuahDetails)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl shadow-lg shrink-0">
              🕌
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-200">
                  পবিত্র জুমু'আর পূর্ণাঙ্গ ১৪ রাকাত ও সহীহ আমল গাইড
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black tracking-wide">
                  ১৪ রাকাত ধারাবাহিক বিশ্লেষণ
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                ফরজের আগে কত রাকাত, মূল ফরজ এবং ফরজের পরের সুন্নাত-নফলের সহীহ দলীল ও ট্র্যাকার
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-bold text-amber-300 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-400/30">
              সম্পন্ন: {toBengaliDigits(completedRakatCount)} / ১৪ রাকাত
            </span>
            <button className="text-amber-300 hover:text-amber-100 p-2 rounded-xl bg-black/40 border border-white/10 cursor-pointer">
              {showJumuahDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showJumuahDetails && (
          <div className="pt-3 border-t border-white/10 space-y-4 text-xs animate-fade-in">
            
            {/* Quick Summary Pill Row: Before Farz, Farz, After Farz */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-teal-950/80 p-3 rounded-xl border border-teal-500/40 text-center space-y-1">
                <span className="text-[11px] font-bold text-teal-300 block">১. ফরজের পূর্বে (মোট ৬ রাকাত)</span>
                <div className="text-base font-black text-amber-300">২ রাকাত + ৪ রাকাত</div>
                <span className="text-[10px] text-teal-100/80 block">তাহিয়্যাতুল মসজিদ + কাবলাল জুমা</span>
              </div>

              <div className="bg-amber-950/80 p-3 rounded-xl border border-amber-500/60 text-center space-y-1 ring-1 ring-amber-400/40">
                <span className="text-[11px] font-bold text-amber-300 block">২. জুমার মূল ফরজ (২ রাকাত)</span>
                <div className="text-xl font-black text-white">২ রাকাত জামায়াতে</div>
                <span className="text-[10px] text-amber-200/90 block">ফরজে আইন (খুতবা শোনার পর)</span>
              </div>

              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/40 text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 block">৩. ফরজের পরে (মোট ৬ রাকাত)</span>
                <div className="text-base font-black text-amber-300">৪ রাকাত + ২ রাকাত</div>
                <span className="text-[10px] text-emerald-100/80 block">বা'দাল জুমা + সুন্নাত/নফল</span>
              </div>
            </div>

            {/* Navigation Tabs for Jumuah Module */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              <button
                onClick={() => setActiveJumuahTab('breakdown')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                  activeJumuahTab === 'breakdown'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                    : 'bg-black/40 text-emerald-200 border-white/10 hover:border-amber-400/40'
                }`}
              >
                📜 ১৪ রাকাতের বিস্তারিত ধাপ
              </button>

              <button
                onClick={() => setActiveJumuahTab('tracker')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                  activeJumuahTab === 'tracker'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                    : 'bg-black/40 text-emerald-200 border-white/10 hover:border-amber-400/40'
                }`}
              >
                ✅ জুমার সালাত ট্র্যাকার ({toBengaliDigits(completedRakatCount)}/১৪)
              </button>

              <button
                onClick={() => setActiveJumuahTab('sunnahs')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                  activeJumuahTab === 'sunnahs'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                    : 'bg-black/40 text-emerald-200 border-white/10 hover:border-amber-400/40'
                }`}
              >
                ✨ জুমার ৫টি সুন্নাত ও বিশেষ দোয়া
              </button>

              <button
                onClick={() => setActiveJumuahTab('faq')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                  activeJumuahTab === 'faq'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                    : 'bg-black/40 text-emerald-200 border-white/10 hover:border-amber-400/40'
                }`}
              >
                💡 শরয়ী মাসআলা ও হাদিসের দলীল
              </button>
            </div>

            {/* TAB 1: DETAILED 14-RAKAT BREAKDOWN */}
            {activeJumuahTab === 'breakdown' && (
              <div className="space-y-3">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-emerald-100 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    জুমার সালাতে মূল ফরজ হলো <strong className="text-amber-300">২ রাকাত</strong>, যা জামায়াতের সাথে ইমামের পেছনে আদায় করতে হয়। এর পূর্বে ও পরে মিলিয়ে পূর্ণাঙ্গ আমল হিসেবে <strong className="text-amber-300">১৪ রাকাত</strong> সালাত আদায়ের সহীহ তারতীব নিম্নে উল্লেখ করা হলো:
                  </p>
                </div>

                <div className="space-y-3">
                  {JUMUAH_14_RAKAT_SEQUENCE.map((step, idx) => {
                    const isCompleted = completedJumuahSteps[step.id] || false;
                    return (
                      <div
                        key={step.id}
                        className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                          step.phase === 'farz'
                            ? 'bg-amber-950/40 border-amber-400/70 ring-1 ring-amber-400/40'
                            : 'bg-black/40 border-white/10 hover:border-emerald-500/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
                              {toBengaliDigits(idx + 1)}
                            </span>
                            <div>
                              <div className="text-sm font-bold text-amber-200 flex items-center gap-2">
                                <span>{step.nameBn}</span>
                                <span className="text-xs font-serif text-amber-300/80 font-normal">({step.nameAr})</span>
                              </div>
                              <span className="text-[10px] text-teal-300 font-semibold">{step.phaseTitleBn}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                              step.phase === 'farz'
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-emerald-800/80 text-emerald-100 border border-emerald-600/50'
                            }`}>
                              {step.statusType}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-black/60 text-amber-300 font-mono font-bold text-xs border border-amber-400/30">
                              {toBengaliDigits(step.rakatCount)} রাকাত
                            </span>
                          </div>
                        </div>

                        {/* Timing & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <span className="font-semibold text-amber-300 block mb-0.5">⏱️ কখন পড়তে হবে:</span>
                            <p className="text-emerald-100/90">{step.timingBn}</p>
                          </div>
                          <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <span className="font-semibold text-teal-300 block mb-0.5">🎯 নিয়তের নিয়ম:</span>
                            <p className="text-emerald-100/90">{step.niyyatGuideBn}</p>
                          </div>
                        </div>

                        {/* Hadith Proof Reference */}
                        <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/40 text-[11px] text-emerald-200">
                          <span className="font-bold text-amber-300">📖 সহীহ হাদীসের প্রমাণ: </span>
                          <span>{step.hadithReferenceBn}</span>
                        </div>

                        {/* Quick Toggle Done */}
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => toggleJumuahStep(step.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow'
                                : 'bg-black/50 text-emerald-300 border border-white/10 hover:border-amber-400'
                            }`}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-emerald-400'}`} />
                            <span>{isCompleted ? 'আদায় সম্পন্ন হয়েছে ✓' : 'আদায় সম্পন্ন চিহ্নিত করুন'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: LIVE INTERACTIVE RAKAT TRACKER */}
            {activeJumuahTab === 'tracker' && (
              <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-emerald-900/60 to-amber-900/60 p-3 rounded-xl border border-amber-400/40">
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">আজকের জুমু'আর সালাত আদায় ট্র্যাকার</h4>
                    <p className="text-xs text-emerald-200">
                      মোট ১৪ রাকাতের মধ্যে আপনার সম্পন্নকৃত রাকাত সংখ্যা চিহ্নিত করুন
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-amber-300 font-mono">
                      {toBengaliDigits(completedRakatCount)} / ১৪ রাকাত
                    </div>
                    <span className="text-[10px] text-emerald-300 font-semibold">
                      {completedRakatCount === 14 ? '🎉 মাশাআল্লাহ! সম্পূর্ণ ১৪ রাকাত সম্পন্ন!' : 'অগ্রগতি ট্র্যাকিং চলছে'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 transition-all duration-500"
                      style={{ width: `${(completedRakatCount / 14) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {JUMUAH_14_RAKAT_SEQUENCE.map(step => {
                    const isDone = completedJumuahSteps[step.id] || false;
                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleJumuahStep(step.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isDone
                            ? 'bg-emerald-900/60 border-emerald-400 text-white shadow'
                            : 'bg-black/40 border-white/10 hover:border-amber-400/50 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}}
                            className="w-4 h-4 text-amber-400 rounded accent-amber-400"
                          />
                          <div>
                            <div className="font-bold text-xs text-amber-100">{step.nameBn}</div>
                            <span className="text-[10px] text-emerald-300">{step.statusType}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-amber-300 shrink-0">
                          {toBengaliDigits(step.rakatCount)} রাকাত
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Reset Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setCompletedJumuahSteps({});
                      try {
                        localStorage.removeItem('jumuah_completed_steps_v1');
                      } catch (e) {}
                    }}
                    className="text-[11px] text-rose-300 hover:text-rose-200 font-semibold underline cursor-pointer"
                  >
                    ট্র্যাকার রিসেট করুন
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: 5 GREAT SUNNAHS & SPECIAL HOUR */}
            {activeJumuahTab === 'sunnahs' && (
              <div className="space-y-3">
                {/* 5 Great Sunnahs */}
                <div className="bg-black/40 p-3.5 rounded-xl border border-amber-400/30 space-y-2.5">
                  <p className="font-bold text-amber-200 flex items-center gap-1.5 text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>জুমু'আর দিনের ৫টি বিশেষ গুরুত্বপূর্ণ সুন্নাত আমল:</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-100/90 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                      <span className="text-amber-300 font-bold block">১. গোসল ও সুগন্ধি:</span>
                      <p>উত্তমরূপে গোসল করা, পরিষ্কার-পরিচ্ছন্ন পোশাক পরিধান করা এবং সুগন্ধি বা আতর ব্যবহার করা (সহীহ বুখারী: ৮৮৩)।</p>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                      <span className="text-amber-300 font-bold block">২. আউয়াল ওয়াক্তে মসজিদে গমন:</span>
                      <p>সূর্য হেলে পড়ার পর বিলম্ব না করে প্রথম কাতারে বসার নিয়তে পায়ে হেঁটে মসজিদে যাওয়া (সহীহ মুসলিম: ৮৫৫)।</p>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                      <span className="text-amber-300 font-bold block">৩. মেসওয়াক ও পরিচ্ছন্নতা:</span>
                      <p>মেসওয়াক করা, নখ কাটা ও শারীরিক পরিচ্ছন্নতা নিশ্চিত করা মাসনূন।</p>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                      <span className="text-amber-300 font-bold block">৪. সূরা আল-কাহফ তেলাওয়াত:</span>
                      <p>জুমার দিনে সূরা আল-কাহফ তেলাওয়াত করলে এক জুমা থেকে পরবর্তী জুমা পর্যন্ত নূর প্রজ্বলিত থাকে (সহীহ আল-জামে': ৬৪৭০)।</p>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 sm:col-span-2 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-amber-300 font-bold block">৫. অধিক পরিমাণে দরূদ শরীফ পাঠ (বিশেষত ৮০ বার):</span>
                        <button
                          onClick={() => {
                            launchDhikrInTasbih({
                              id: 'jumuah-durood-80',
                              titleBn: 'জুমু\'আর বিশেষ দরূদ শরীফ (৮০ বার)',
                              arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَى آلِهِ وَسَلِّمْ تَسْلِيمًا',
                              transliterationBn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিনিন নাবিয়্যিল উম্মিয়্যি ওয়া আলা আলিহি ওয়া সাল্লিম তাসলিমা',
                              translationBn: 'হে আল্লাহ! নিরক্ষর নবী মুহাম্মদ (সা.) এবং তাঁর পরিবারের প্রতি শান্তি ও রহমত বর্ষণ করুন। (জুমুআর দিনে আসরের পর ৮০ বার পাঠে ৮০ বছরের গুনাহ ক্ষমা ও সওয়াব লাভ হয়)',
                              targetCount: 80,
                              recommendedTimeBn: 'জুমুআর দিন আসরের নামাজের পর'
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-400 text-emerald-950 font-bold text-[11px] hover:bg-amber-300 transition flex items-center gap-1 shadow cursor-pointer shrink-0"
                        >
                          <span>📿 ১-ক্লিকে ৮০ বার দরূদ পড়ুন</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <p>রাসূলুল্লাহ (সা.) ইরশاد করেছেন: "তোমরা জুমার দিনে আমার ওপর অধিক পরিমাণে দরূদ পাঠ করো, কেননা তোমাদের দরূদ আমার নিকট পেশ করা হয়" (সুনান আবু দাউদ: ১০৪৭)। বিশেষত আসরের পর ৮০ বার দরূদ পাঠে ৮০ বছরের গুনাহ মাফ ও ৮০ বছরের নফল ইবাদতের সওয়াব লাভ হয়।</p>
                    </div>
                  </div>
                </div>

                {/* Golden Hour: Saat-ul-Ijabah */}
                <div className="bg-gradient-to-r from-amber-950/70 to-emerald-950/70 p-3.5 rounded-xl border border-amber-400/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤲</span>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-300">
                      জুমার দিনের দোয়া কবুলের বিশেষ মুহূর্ত (সা'আতুল ইজাবাহ):
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    রাসূলুল্লাহ (সা.) ইরশাদ করেন: "জুমার দিনে এমন একটি মুহূর্ত রয়েছে, কোনো মুসলিম বান্দা যদি সে সময় সালাতরত অবস্থায় আল্লাহর কাছে কিছু প্রার্থনা করে, তবে আল্লাহ তাকে তা দান করেন" (সহীহ বুখারী: ৯৩৫, সহীহ মুসলিম: ৮৫২)।
                  </p>
                  <div className="bg-black/50 p-2 rounded-lg border border-amber-400/30 text-[11px] text-amber-200 font-semibold">
                    💡 সর্বাধিক শক্তিশালী মত অনুযায়ী, এই সময়টি হলো <span className="text-amber-300 underline font-bold">জুমার দিন আসরের নামাজের পর থেকে সূর্যাস্ত (মাগরিব) পর্যন্ত</span>। তাই এ সময়ে বেশি বেশি দোয়া ও মুনাজাত করা উচিত।
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHARI'AH FAQ & EVIDENCE */}
            {activeJumuahTab === 'faq' && (
              <div className="space-y-2.5">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1 text-xs">
                  <h5 className="font-bold text-amber-300">❓ জুমার নামাজে মোট কত রাকাত পড়তে হয়?</h5>
                  <p className="text-emerald-100/90 leading-relaxed">
                    জুমার ফরজে আইন সালাত হলো <strong>২ রাকাত</strong>। তবে সুন্নাতে মুয়াক্কাদাহ ও নফলসহ পূর্ণাঙ্গ আমল হলো <strong>১৪ রাকাত</strong> (২ রাকাত তাহিয়্যাতুল মসজিদ + ৪ রাকাত কাবলাল জুমা + ২ রাকাত ফরজ + ৪ রাকাত বা'দাল জুমা + ২ রাকাত সুন্নাত + ২ রাকাত নফল)।
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1 text-xs">
                  <h5 className="font-bold text-amber-300">❓ খুতবা চলাকালীন কথা বলা বা কাউকে চুপ করতে বলার হুকুম কী?</h5>
                  <p className="text-emerald-100/90 leading-relaxed">
                    খুতবা চলাকালীন কথা বলা, মোবাইল ব্যবহার করা বা অন্য কাউকে 'চুপ করো' বলাও নিষিদ্ধ। রাসূলুল্লাহ (সা.) বলেছেন: "জুমার দিন খুতবার সময় যদি তুমি তোমার সঙ্গীকে বলো 'চুপ থাকো', তবে তুমি অনর্থক কাজ করলে (জুমার সওয়াব নষ্ট করলে)" (সহীহ বুখারী: ৯৩৪)।
                  </p>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1 text-xs">
                  <h5 className="font-bold text-amber-300">❓ কেউ যদি জুমার ফরজ নামাজ মিস করে তবে কী করবে?</h5>
                  <p className="text-emerald-100/90 leading-relaxed">
                    কেউ যদি ওজরের কারণে জুমার জামায়াত না পায়, তবে সে একা একা জুমার নামাজ পড়তে পারবে না; বরং তাকে সাধারণ নিয়মে ৪ রাকাত জোহরের ফরজ সালাত আদায় করতে হবে।
                  </p>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ENHANCED PRAYER-SPECIFIC DHIKR & DUA SYSTEM (পূর্ববর্তী, চলাকালীন ও পরবর্তী আমল) */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPrayerDuas(!showPrayerDuas)}
          className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              📿
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-amber-200">
                নামাজের প্রস্তুতিলগ্ন, চলাকালীন ও পরবর্তী আমল ও দোয়া
              </h4>
              <p className="text-[11px] text-emerald-200/80">
                আরবি আয়াত, সঠিক বাংলা উচ্চারণ (উচ্চারণসহ) ও নির্ভরযোগ্য অর্থ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold shrink-0 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span>{showPrayerDuas ? 'আড়াল করুন' : 'বিস্তারিত দেখুন'}</span>
            {showPrayerDuas ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showPrayerDuas && (
          <div className="p-4 pt-0 space-y-3 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-2 pt-3 border-b border-white/10">
              {/* Category Selector Tabs */}
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[11px] w-full md:w-auto">
                <button
                  onClick={() => {
                    setDuaCategoryTab('pre');
                    setActiveDuaId('azan_dua');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex-1 md:flex-initial ${
                    duaCategoryTab === 'pre' ? 'bg-amber-400 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  🤲 ১. পূর্ববর্তী আমল
                </button>
                <button
                  onClick={() => {
                    setDuaCategoryTab('in_prayer');
                    setActiveDuaId('sana_dua');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex-1 md:flex-initial ${
                    duaCategoryTab === 'in_prayer' ? 'bg-amber-400 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  🕌 ২. নামাজ চলাকালীন
                </button>
                <button
                  onClick={() => {
                    setDuaCategoryTab('post');
                    setActiveDuaId('istighfar_3x');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex-1 md:flex-initial ${
                    duaCategoryTab === 'post' ? 'bg-amber-400 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  📿 ৩. নামাজ পরবর্তী
                </button>
              </div>
            </div>

            {/* Individual Item Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
              {filteredDuas.map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDuaId(d.id)}
                  className={`px-3 py-1.2 rounded-lg font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                    activeDuaId === d.id
                      ? 'bg-emerald-500 text-white border-emerald-300 shadow'
                      : 'bg-black/40 text-emerald-200 border-white/10 hover:border-amber-400/50'
                  }`}
                >
                  {d.titleBn}
                </button>
              ))}
            </div>

            {/* Selected Dua Card Content */}
            {selectedDua && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-sm sm:text-base flex items-center gap-1.5">
                    <span>📌 {selectedDua.titleBn}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-800/80 px-2.5 py-0.5 rounded-full text-emerald-200 border border-emerald-600/50 font-bold">
                    সুন্নাত ও মাসনূন আমল
                  </span>
                </div>

                {selectedDua.arabicText && (
                  <div className="bg-black/50 p-3.5 rounded-xl text-right font-serif text-lg sm:text-xl text-amber-200 leading-relaxed tracking-wide border border-amber-400/30 my-1 shadow-inner">
                    {selectedDua.arabicText}
                  </div>
                )}

                {selectedDua.transliterationBn && (
                  <div className="bg-black/30 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-100">
                    <span className="font-bold text-amber-300 block mb-0.5">🗣️ উচ্চারণ (বাংলা ট্রান্সলিটারেশন):</span>
                    <p className="text-xs italic leading-relaxed">{selectedDua.transliterationBn}</p>
                  </div>
                )}

                <div className="bg-black/20 p-2.5 rounded-lg border border-white/10 text-emerald-50">
                  <span className="font-bold text-teal-300 block mb-0.5">📖 অর্থ (বাংলা অনুবাদ):</span>
                  <p className="text-xs leading-relaxed">{selectedDua.meaningBn}</p>
                </div>

                {selectedDua.virtueBn && (
                  <div className="bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/30 text-amber-200 text-[11px] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">বিশেষ ফজিলত ও হাদিসের দলীল: </span>
                      <span className="text-amber-100/90">{selectedDua.virtueBn}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 1: 5 OBLIGATORY FARZ PRAYERS (৫ ওয়াক্তের ফরজ নামাজ) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              🕌
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-200">
                ৫ ওয়াক্তের ফরজ সালাত (আজান, জামায়াত ও সময়সীমা)
              </h3>
              <p className="text-xs text-emerald-300/80">
                প্রতিটি ফরজ সালাতের আযান, জামায়াত শুরুর সময় ও ওয়াক্তের ব্যাপ্তিকাল
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {farzPrayers.map((item) => {
            const isNext = item.key === detailedState.nextPrayer.key;
            const isCurrent = item.key === detailedState.currentPrayer.key;
            const isAlarmOn = alarmEnabled[item.key] ?? false;
            const isExpanded = expandedPrayerKey === item.key;
            const displayName = lang === 'bn' ? item.nameBn : lang === 'ar' ? item.nameAr : item.nameEn;
            const rakat = item.rakatBreakdown;

            return (
              <div
                key={item.key}
                className={`p-3.5 rounded-xl border transition relative flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/25 border-amber-400 shadow-lg ring-2 ring-amber-400/50'
                    : isNext
                    ? 'bg-teal-500/20 border-teal-400/80 shadow-md ring-1 ring-teal-400/30'
                    : 'bg-black/30 border-white/10 hover:border-emerald-500'
                }`}
                onClick={() => setExpandedPrayerKey(isExpanded ? null : item.key)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-200">
                      {getPrayerIcon(item.key)}
                      <span>{displayName} (ফরজ)</span>
                      {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                          চলতি ওয়াক্ত
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAlarm(item.key);
                        }}
                        className="text-emerald-400 hover:text-amber-300 p-1.5 rounded-md bg-black/40 border border-white/10 transition cursor-pointer"
                        title={isAlarmOn ? 'আজান রিমাইন্ডার চালু আছে' : 'আজান রিমাইন্ডার বন্ধ আছে'}
                      >
                        {isAlarmOn ? (
                          <Bell className="w-3.5 h-3.5 text-amber-300" />
                        ) : (
                          <BellOff className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </button>

                      <span className="text-emerald-300 text-xs">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Azan, Jamaat & Waqt Duration Details */}
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/10 space-y-1 mb-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-medium">📣 আজানের সময়:</span>
                      <span className="font-mono font-bold text-amber-300">{item.azanTimeString}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-medium">🕌 মসজিদে জামায়াত:</span>
                      <span className="font-mono font-bold text-teal-200">{item.jamaatTimeString}</span>
                    </div>
                    {item.endTimeString && (
                      <div className="flex justify-between items-center text-[11px] pt-1 border-t border-white/10">
                        <span className="text-emerald-400">⏱️ ওয়াক্তের ব্যাপ্তি:</span>
                        <span className="font-semibold text-emerald-200">
                          {item.timeString} - {item.endTimeString}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rakat Badge Summary */}
                  {rakat && (
                    <div className="flex flex-wrap items-center gap-1 text-[11px] font-semibold">
                      <span className="px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-100 border border-emerald-600/50">
                        ফরজ: {rakat.farz}
                      </span>
                      {rakat.sunnahMuakkadah > 0 && (
                        <span className="px-2 py-0.5 rounded bg-teal-800/80 text-teal-100 border border-teal-600/50">
                          সুন্নাত: {rakat.sunnahMuakkadah}
                        </span>
                      )}
                      {rakat.witr > 0 && (
                        <span className="px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700/50">
                          বিতর: {rakat.witr}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-black text-amber-300 font-bold ml-auto border border-amber-500/30">
                        মোট {rakat.totalRakat} রাকাত
                      </span>
                    </div>
                  )}

                  {/* Interactive Prayer Tracking Button */}
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrayerToggle(item.key, displayName);
                      }}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        completedPrayers[item.key]
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-300/40'
                          : 'bg-white/10 hover:bg-amber-400/20 text-emerald-200 hover:text-amber-200 border border-white/15'
                      }`}
                    >
                      {completedPrayers[item.key] ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-slate-950 fill-emerald-200" />
                          <span>আদায় সম্পন্ন হয়েছে ✓</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400/60" />
                          <span>পড়েছি / আদায় করেছি</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Prayer Breakdown Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-emerald-100 space-y-2 bg-black/60 p-2.5 rounded-lg animate-fade-in">
                    {rakat && (
                      <div className="bg-black/40 p-2 rounded border border-white/10">
                        <p className="font-bold text-amber-300 mb-0.5">📌 রাকাতের বিস্তারিত বিবরণ:</p>
                        <p className="text-emerald-50">{rakat.detailsBn}</p>
                      </div>
                    )}

                    {item.recommendedTimeBn && (
                      <div className="text-emerald-200">
                        <span className="font-semibold text-teal-300">উত্তম সময়: </span>
                        <span>{item.recommendedTimeBn}</span>
                      </div>
                    )}

                    {item.significanceBn && (
                      <div className="text-amber-200/90 italic">
                        <span className="font-semibold text-amber-300">ফজিলত: </span>
                        <span>{item.significanceBn}</span>
                      </div>
                    )}

                    {item.forbiddenTimeNoteBn && (
                      <div className="text-rose-300 bg-rose-950/60 p-2 rounded border border-rose-800/50 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">সতর্কতা/মাকরূহ সময়: </span>
                          <span>{item.forbiddenTimeNoteBn}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: SUNRISE, SUNSET & FASTING TIMES (সূর্যোদয়, সূর্যাস্ত ও সেহরি-ইফতার) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              🌅
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-200">
                সূর্যোদয়, সূর্যাস্ত ও সিয়ামের সময়সূচী (সেহরি ও ইফতার)
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sunEvents.map((item) => (
            <div key={item.key} className="bg-black/30 p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getPrayerIcon(item.key)}
                <div>
                  <div className="text-xs font-bold text-amber-200">{item.nameBn}</div>
                  <div className="text-xs text-emerald-300">{item.recommendedTimeBn || 'গুরুত্বপূর্ণ সময়'}</div>
                </div>
              </div>
              <div className="text-sm font-extrabold text-amber-300 font-mono">
                {item.timeString}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: COMPREHENSIVE NAFEL PRAYERS & AMAL TRACKER */}
      <div className="pt-2">
        <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-teal-500/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowNafelSection(!showNafelSection)}
            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-400/20 text-teal-300">
                🌟
              </span>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-teal-200">
                  নফল সালাতের পূর্ণাঙ্গ গাইড ও আমল ট্র্যাকার (তাহাজ্জুদ, ইশরাক, চাশত, আওয়াবীন)
                </h4>
                <p className="text-[11px] text-emerald-200/80">
                  রাকাতের হিসাব, পড়ার সর্বোত্তম সময়, নিয়ত ও আমল ট্র্যাকিং
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-teal-300 font-bold shrink-0 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <span>{showNafelSection ? 'আড়াল করুন' : 'বিস্তারিত গাইড দেখুন'}</span>
              {showNafelSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showNafelSection && (
            <div className="p-4 pt-0 border-t border-teal-500/20 animate-fade-in">
              <NafelPrayersSection lang={lang} />
            </div>
          )}
        </div>
      </div>

      {/* Monthly Context & Significance Collapsible Section */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl border border-amber-500/40 p-3.5">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowMonthlySignificance(!showMonthlySignificance)}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-300" />
            <h4 className="text-xs sm:text-sm font-bold text-amber-200">
              চলতি হিজরি মাস: {monthlyData.monthNameBn} ({monthlyData.hijriYear} হিজরি)
            </h4>
          </div>
          <button className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1 cursor-pointer">
            <span>{showMonthlySignificance ? 'আড়াল করুন' : 'বিস্তারিত ফজিলত'}</span>
            {showMonthlySignificance ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showMonthlySignificance && (
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-emerald-100 space-y-3 animate-fade-in">
            <div>
              <p className="font-bold text-amber-300 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>মাসের ঐতিহাসিক তাৎপর্য ও ঘটনাপ্রবাহ:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-emerald-100/90 pl-1">
                {monthlyData.historicalEventsBn.map((event, idx) => (
                  <li key={idx}>{event}</li>
                ))}
              </ul>
            </div>

            <div className="bg-black/40 p-2.5 rounded-lg border border-white/10">
              <p className="font-bold text-teal-300 mb-1">প্রস্তাবিত আমলসমূহ:</p>
              <ul className="list-disc list-inside space-y-0.5 text-emerald-200">
                {monthlyData.recommendedAmalBn.map((amal, idx) => (
                  <li key={idx}>{amal}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

