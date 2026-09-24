import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
  Info,
  Flame,
  Star,
  Compass,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  ALL_HIJRI_SPECIAL_DAYS,
  HijriSpecialDay,
  HIJRI_MONTH_METADATA,
  NEW_HIJRI_YEAR_RESOLUTIONS,
  getHijriCalendarDetails,
  calculateMilestoneCountdown
} from '../utils/hijriCalendarData';
import { toBengaliDigits, toBengaliOrdinal, getEquivalentDatesForHijri } from '../utils/bengaliUtils';
import { TripleYearCycleProgressChart } from './TripleYearCycleProgressChart';
import { ContinuousAmalsAndProhibitionsSection } from './ContinuousAmalsAndProhibitionsSection';

interface HijriYearSpecialDaysCountdownProps {
  className?: string;
  onOpenAmalTracker?: () => void;
}

export const HijriYearSpecialDaysCountdown: React.FC<HijriYearSpecialDaysCountdownProps> = ({
  className = '',
  onOpenAmalTracker
}) => {
  // Master Section Subtab
  const [activeSectionTab, setActiveSectionTab] = useState<'special_days' | 'amals_guide' | 'resolutions'>('special_days');

  // Live ticking state (updates every second for real-time countdown)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hijriDetails = getHijriCalendarDetails(currentTime);

  // Time remaining to Next New Year (1 Muharram)
  const msToNewYear = Math.max(0, hijriDetails.nextNewYearDate.getTime() - currentTime.getTime());
  const newYearDays = Math.floor(msToNewYear / (1000 * 60 * 60 * 24));
  const newYearHours = Math.floor((msToNewYear % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const newYearMinutes = Math.floor((msToNewYear % (1000 * 60 * 60)) / (1000 * 60));
  const newYearSeconds = Math.floor((msToNewYear % (1000 * 60)) / 1000);

  // UI Navigation & Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrepMessage, setShowPrepMessage] = useState<boolean>(true);
  const [selectedDayDetails, setSelectedDayDetails] = useState<HijriSpecialDay | null>(null);

  // User Resolutions checklist stored in localStorage
  const [checkedResolutions, setCheckedResolutions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('hijri_new_year_resolutions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleResolution = (id: string) => {
    setCheckedResolutions(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('hijri_new_year_resolutions', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Audio speech synthesis for New Year Dua
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const playNewMoonDuaAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    const textToSpeak = 'আল্লাহুম্মা আহিল্লাহু ‘আলাইনা বিল-আমনি ওয়াল ঈমান, ওয়াস-সালামাতি ওয়াল ইসলাম, রাব্বী ওয়া রাব্বুকাল্লাহ।';
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.88;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn('Speech synthesis not supported:', e);
      setIsPlayingAudio(false);
    }
  };

  // Filtered and Sorted list of days
  const filteredDays = ALL_HIJRI_SPECIAL_DAYS.filter(day => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'upcoming'
        ? calculateMilestoneCountdown(day, currentTime).daysRemaining <= 60
        : activeCategory === 'sacred'
        ? day.category === 'sacred_month'
        : activeCategory === 'eid'
        ? day.category === 'eid'
        : activeCategory === 'fasting'
        ? day.category === 'fasting'
        : activeCategory === 'night'
        ? day.category === 'night'
        : true;

    const matchesSearch =
      day.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.monthNameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.significanceBn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort by days remaining (closest first)
  const sortedDays = [...filteredDays].sort((a, b) => {
    const remA = calculateMilestoneCountdown(a, currentTime).daysRemaining;
    const remB = calculateMilestoneCountdown(b, currentTime).daysRemaining;
    return remA - remB;
  });

  // Count how many resolutions are checked
  const completedResolutionsCount = Object.values(checkedResolutions).filter(Boolean).length;

  return (
    <section className={`rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-white p-4 sm:p-6 shadow-2xl relative overflow-hidden space-y-6 ${className}`}>
      
      {/* Decorative Islamic Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* ----------------------------------------------------------------- */}
      {/* 1. MASTER HEADER & CURRENT HIJRI STATUS BANNER                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 border-b border-emerald-800/80 pb-5 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-amber-300 tracking-wide">
                  হিজরি বর্ষপঞ্জির বিশেষ দিনসমূহ ও ১ বছরের লাইভ কাউন্টার
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase shadow">
                  Islamic Days & Year Cycle
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
                আরবি বছরের প্রতিটি গুরুত্বপূর্ণ দিনের কাউন্টডাউন এবং আবার নতুন বছর শুরু করতে আগাম প্রস্তুতি ও হিসাব-নিকাশ
              </p>
            </div>
          </div>

          {/* Current Hijri Date Indicator */}
          <div className="bg-black/50 border border-amber-400/40 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2.5 self-start md:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-[10px] text-gray-400 block">বর্তমান আরবি হিজরি দিন</span>
              <span className="text-amber-300 font-bold font-mono">
                {toBengaliDigits(hijriDetails.hDay)} {hijriDetails.monthNameBn} {toBengaliDigits(hijriDetails.hYear)} হিজরি
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 1.5. TRIPLE YEAR CYCLE PROGRESS CHART (৩৫৪ দিন হিজরি, ৩৬৫ দিন ইংরেজি ও বাংলা) */}
      {/* ----------------------------------------------------------------- */}
      <TripleYearCycleProgressChart
        currentDate={currentTime}
        onOpenDayModal={onOpenAmalTracker}
      />

      {/* ----------------------------------------------------------------- */}
      {/* MASTER SECTION SUBTAB SWITCHER                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 border-b border-emerald-800/80 pb-3">
        <button
          onClick={() => setActiveSectionTab('special_days')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
            activeSectionTab === 'special_days'
              ? 'bg-amber-400 text-slate-950 shadow-lg ring-2 ring-amber-300'
              : 'bg-black/50 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
          }`}
        >
          <span>📅 ১৭+ প্রধান দিবস ও ১ বছরের কাউন্টডাউন</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('amals_guide')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
            activeSectionTab === 'amals_guide'
              ? 'bg-emerald-400 text-slate-950 shadow-lg ring-2 ring-emerald-300'
              : 'bg-black/50 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
          }`}
        >
          <span>🛡️ করণীয় আমল, লাইভ কাউন্টার ও বর্জনীয় নির্দেশিকা</span>
        </button>

        <button
          onClick={() => setActiveSectionTab('resolutions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
            activeSectionTab === 'resolutions'
              ? 'bg-teal-400 text-slate-950 shadow-lg ring-2 ring-teal-300'
              : 'bg-black/50 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
          }`}
        >
          <span>✨ নতুন হিজরি বর্ষের ৮টি সংকল্প ও প্রস্তুতি</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TAB 2: CONTINUOUS AMALS & PROHIBITIONS SECTION                   */}
      {/* ----------------------------------------------------------------- */}
      {activeSectionTab === 'amals_guide' && (
        <div className="relative z-10 animate-fade-in">
          <ContinuousAmalsAndProhibitionsSection />
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 3: RESOLUTIONS CHECKLIST & ADVANCE NEW YEAR PREPARATION      */}
      {/* ----------------------------------------------------------------- */}
      {activeSectionTab === 'resolutions' && (
        <div className="relative z-10 space-y-4 animate-fade-in">
          <div className="bg-gradient-to-r from-amber-950/90 via-emerald-950 to-slate-950 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow">
                    আগাম বার্তা ও কাউন্টিং
                  </span>
                  <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>নতুন হিজরি বর্ষ শুরু করার প্রস্তুতি</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-black text-white">
                  নতুন হিজরি বর্ষ <span className="text-amber-300">{toBengaliDigits(hijriDetails.nextNewYearNumber)}</span> শুরু হতে আর বাকি:
                </h3>
                <p className="text-xs text-emerald-200/90">
                  চলতি {toBengaliDigits(hijriDetails.hYear)} হিজরির {toBengaliDigits(hijriDetails.dayOfYear)} দিন অতিক্রান্ত • ১লা মুহররম নতুন বছর আগমনের শুভযাত্রা
                </p>
              </div>

              {/* Master 4-Box Countdown Timer */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
                <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
                  <span className="text-lg sm:text-2xl font-black text-amber-300 font-mono block leading-none">
                    {toBengaliDigits(newYearDays)}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">দিন</span>
                </div>
                <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
                  <span className="text-lg sm:text-2xl font-black text-emerald-300 font-mono block leading-none">
                    {toBengaliDigits(newYearHours)}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">ঘণ্টা</span>
                </div>
                <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
                  <span className="text-lg sm:text-2xl font-black text-teal-300 font-mono block leading-none">
                    {toBengaliDigits(newYearMinutes)}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">মিনিট</span>
                </div>
                <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
                  <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono block leading-none animate-pulse">
                    {toBengaliDigits(newYearSeconds)}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">সেকেন্ড</span>
                </div>
              </div>
            </div>

            {/* Resolutions Checklist */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>নতুন হিজরি বর্ষের ৮টি আত্মিক সংকল্প (মুহাসাবাহ):</span>
                </span>
                <span className="text-xs text-emerald-300 font-mono font-bold">
                  {toBengaliDigits(completedResolutionsCount)} / {toBengaliDigits(NEW_HIJRI_YEAR_RESOLUTIONS.length)} গৃহীত
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {NEW_HIJRI_YEAR_RESOLUTIONS.map((res) => {
                  const isChecked = !!checkedResolutions[res.id];
                  return (
                    <div
                      key={res.id}
                      onClick={() => toggleResolution(res.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 select-none ${
                        isChecked
                          ? 'bg-emerald-900/60 border-emerald-400/80 shadow'
                          : 'bg-black/40 border-white/10 hover:border-amber-400/40'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                        isChecked ? 'bg-emerald-400 text-slate-950 font-bold' : 'border border-gray-500'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <h5 className={`text-xs font-bold leading-snug ${isChecked ? 'text-amber-200 line-through opacity-85' : 'text-white'}`}>
                          {res.icon} {res.titleBn}
                        </h5>
                        <p className="text-[10px] text-gray-300 leading-tight">
                          {res.subtitleBn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 1: ALL 17+ MAJOR SPECIAL DAYS & 1-YEAR COUNTDOWN               */}
      {/* ----------------------------------------------------------------- */}
      {activeSectionTab === 'special_days' && (
        <div className="space-y-5 animate-fade-in">

      {/* ----------------------------------------------------------------- */}
      {/* 2. NEW HIJRI YEAR ADVANCE COUNTDOWN & SOUL PREPARATION MODULE     */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 bg-gradient-to-r from-amber-950/90 via-emerald-950 to-slate-950 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow">
                আগাম বার্তা ও কাউন্টিং
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>নতুন হিজরি বর্ষ শুরু করার প্রস্তুতি</span>
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-black text-white">
              নতুন হিজরি বর্ষ <span className="text-amber-300">{toBengaliDigits(hijriDetails.nextNewYearNumber)}</span> শুরু হতে আর বাকি:
            </h3>
            <p className="text-xs text-emerald-200/90">
              চলতি {toBengaliDigits(hijriDetails.hYear)} হিজরির {toBengaliDigits(hijriDetails.dayOfYear)} দিন অতিক্রান্ত • ১লা মুহররম নতুন বছর আগমনের শুভযাত্রা
            </p>
          </div>

          {/* Master 4-Box Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full lg:w-auto shrink-0">
            <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
              <span className="text-lg sm:text-2xl font-black text-amber-300 font-mono block leading-none">
                {toBengaliDigits(newYearDays)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">দিন</span>
            </div>
            <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
              <span className="text-lg sm:text-2xl font-black text-emerald-300 font-mono block leading-none">
                {toBengaliDigits(newYearHours)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">ঘণ্টা</span>
            </div>
            <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
              <span className="text-lg sm:text-2xl font-black text-teal-300 font-mono block leading-none">
                {toBengaliDigits(newYearMinutes)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">মিনিট</span>
            </div>
            <div className="bg-black/70 border border-amber-400/60 rounded-xl p-2 sm:p-2.5 text-center shadow-lg min-w-[65px] sm:min-w-[76px]">
              <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono block leading-none animate-pulse">
                {toBengaliDigits(newYearSeconds)}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-bold mt-1 block">সেকেন্ড</span>
            </div>
          </div>
        </div>

        {/* 1-Year Cycle Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <span>চলতি {toBengaliDigits(hijriDetails.hYear)} হিজরি বর্ষচক্রের অগ্রগতি:</span>
              <strong className="text-amber-300 font-mono">{toBengaliDigits(hijriDetails.yearProgressPercent)}%</strong>
            </span>
            <span className="text-gray-300 text-[11px]">
              বাকি <strong>{toBengaliDigits(hijriDetails.daysLeftToNewYear)}</strong> দিন (মোট ৩৫৪ দিন)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-700 shadow-md"
              style={{ width: `${hijriDetails.yearProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Toggleable Advance Preparation Guidance (প্রস্তুতির আগাম বার্তা) */}
        <div className="pt-2">
          <button
            onClick={() => setShowPrepMessage(!showPrepMessage)}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 border border-amber-400/40 text-xs sm:text-sm font-bold text-amber-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>📖 নতুন বছর শুরু করতে আত্মিক প্রস্তুতির আগাম বার্তা ও সংকল্প চেকলিস্ট</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                {toBengaliDigits(completedResolutionsCount)}/৮ পূর্ণ
              </span>
            </div>
            {showPrepMessage ? <ChevronUp className="w-4 h-4 text-amber-300" /> : <ChevronDown className="w-4 h-4 text-amber-300" />}
          </button>

          {showPrepMessage && (
            <div className="mt-3 p-4 rounded-xl bg-black/60 border border-emerald-700/60 space-y-4 animate-fade-in">
              
              {/* Soul Reflection Quote by Hazrat Umar (RA) */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-black to-emerald-950/80 border border-amber-400/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>খলিফাতুল মুসলিমীন হযরত উমর ইবনুল খাত্তাব (রা.)-এর ঐতিহাসিক উপদেশ:</span>
                </div>
                <p className="text-xs sm:text-sm font-serif italic text-emerald-100 leading-relaxed pl-2 border-l-2 border-amber-400">
                  "حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَزِنُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُوزَنُوا"
                  <br />
                  <span className="text-xs text-amber-200 font-sans not-italic block mt-1">
                    "হে মুমিনগণ! তোমাদের হিসাব নেওয়ার আগেই তোমরা নিজেদের জীবনের হিসাব নাও; এবং তোমাদের আমল পরিমাপ করার আগেই নিজেদের আমল ওজন করো।"
                  </span>
                </p>
              </div>

              {/* Sunnah New Moon Dua Card */}
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-teal-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>নতুন চাঁদ ও হিজরি নববর্ষের সুন্নাহ দোয়া (তিরমিযী: ৩৪৫১)</span>
                  </span>
                  <button
                    onClick={playNewMoonDuaAudio}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
                    <span>{isPlayingAudio ? 'থামুন' : 'অডিও শুনুন'}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base font-serif text-amber-100 text-center py-1 tracking-wide">
                  اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالأَمْنِ وَالإِيمَانِ وَالسَّلامَةِ وَالإِسْلامِ رَبِّي وَرَبُّكَ اللَّهُ
                </p>
                <div className="text-xs text-emerald-200/90 leading-relaxed space-y-0.5">
                  <p><strong className="text-amber-300">উচ্চারণ:</strong> আল্লাহুম্মা আহিল্লাহু ‘আলাইনা বিল-আমনি ওয়াল ঈমান, ওয়াস-সালামাতি ওয়াল ইসলাম, রাব্বী ওয়া রাব্বুকাল্লাহ।</p>
                  <p><strong className="text-amber-300">অর্থ:</strong> হে আল্লাহ! এই চাঁদকে আমাদের জন্য শান্তি, ঈমান, নিরাপত্তা ও ইসলামের সাথে উদিত করুন। [হে চাঁদ!] আমার ও তোমার রব এক আল্লাহ।</p>
                </div>
              </div>

              {/* 8 Spiritual Resolutions Checklist */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>নতুন হিজরি বর্ষের ৮টি আত্মিক প্রস্তুতি ও দ্বীনি সংকল্প:</span>
                  </span>
                  <span className="text-[11px] text-emerald-200">
                    সংকল্পগুলো টিক দিয়ে সংরক্ষণ করুন
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {NEW_HIJRI_YEAR_RESOLUTIONS.map(res => {
                    const isChecked = !!checkedResolutions[res.id];
                    return (
                      <div
                        key={res.id}
                        onClick={() => toggleResolution(res.id)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 select-none ${
                          isChecked
                            ? 'bg-emerald-900/60 border-emerald-400/80 shadow'
                            : 'bg-black/40 border-white/10 hover:border-amber-400/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition ${
                          isChecked ? 'bg-emerald-400 text-slate-950 font-bold' : 'border border-gray-500'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <h5 className={`text-xs font-bold leading-snug ${isChecked ? 'text-amber-200 line-through opacity-85' : 'text-white'}`}>
                            {res.icon} {res.titleBn}
                          </h5>
                          <p className="text-[10px] text-gray-300 leading-tight">
                            {res.subtitleBn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. FILTER TABS & SEARCH FOR SPECIAL DAYS                           */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 space-y-3">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: 'all', label: 'সকল বিশেষ দিন' },
              { id: 'upcoming', label: '⏳ আসন্ন দিনসমূহ' },
              { id: 'sacred', label: '🌙 ৪ হারাম মাস' },
              { id: 'eid', label: '🎉 ঈদ ও উৎসব' },
              { id: 'fasting', label: '🌾 সুন্নাহ সিয়াম' },
              { id: 'night', label: '✨ বরকতময় রজনী' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                    : 'bg-black/50 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="দিন বা মাস লিখে খুঁজুন..."
              className="w-full bg-black/60 pl-9 pr-3 py-1.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between text-xs text-emerald-200/90 px-1">
          <span>
            প্রদর্শিত হচ্ছে: <strong className="text-amber-300">{toBengaliDigits(sortedDays.length)}</strong> টি বিশেষ দিন ও ১ বছরের কাউন্টার
          </span>
          <span className="text-[11px] text-gray-400">
            প্রতিটি কার্ডে লাইভ বাকি দিন, ঘণ্টা ও মিনিট প্রদর্শিত
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. GRID OF SPECIAL DAYS WITH 1-YEAR COUNTDOWNS                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDays.map(day => {
          const countdown = calculateMilestoneCountdown(day, currentTime);
          const isNearby = countdown.daysRemaining <= 15 && !countdown.isToday;

          return (
            <div
              key={day.id}
              className={`rounded-2xl border transition-all duration-300 p-4 flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                countdown.isToday
                  ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 border-emerald-400 ring-2 ring-emerald-300 shadow-xl shadow-emerald-500/20'
                  : isNearby
                  ? 'bg-gradient-to-br from-amber-950/80 via-emerald-950 to-slate-950 border-amber-400/80 shadow-lg'
                  : 'bg-black/50 border-emerald-800/80 hover:border-amber-400/50 hover:bg-emerald-950/60'
              }`}
            >
              {/* Top Row: Icon, Title & Badge */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                      {day.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-amber-200 transition line-clamp-1">
                        {day.titleBn}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[11px] text-emerald-300 font-mono font-bold">
                          {toBengaliDigits(day.dayOfMonth)} {day.monthNameBn}({toBengaliDigits(day.monthIndex + 1)})
                          {day.endDayOfMonth ? ` - ${toBengaliDigits(day.endDayOfMonth)} ${day.monthNameBn}(${toBengaliDigits(day.monthIndex + 1)})` : ''}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 uppercase tracking-wide">
                          🗓️ {day.monthNameBn}({toBengaliDigits(day.monthIndex + 1)})
                        </span>
                      </div>
                      {(() => {
                        const equiv = getEquivalentDatesForHijri(day.dayOfMonth, day.monthIndex);
                        return (
                          <div className="text-[10px] text-gray-300 flex items-center gap-1.5 flex-wrap pt-0.5">
                            <span className="text-blue-300 font-medium">📅 {equiv.gregorian.short}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-amber-200 font-medium">🌾 {equiv.bengali.short}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 shadow-sm ${
                    day.categoryColor === 'amber'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : day.categoryColor === 'rose'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : day.categoryColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : day.categoryColor === 'purple'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}>
                    {day.categoryLabelBn}
                  </span>
                </div>

                {/* 1-Year Countdown Box */}
                <div className={`p-2.5 rounded-xl border text-center ${
                  countdown.isToday
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black animate-pulse'
                    : isNearby
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-200'
                    : countdown.isPassedThisYear
                    ? 'bg-black/60 border-white/10 text-gray-300'
                    : 'bg-emerald-950/90 border-emerald-700/60 text-emerald-200'
                }`}>
                  {countdown.isToday ? (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black">
                      <Sparkles className="w-4 h-4" />
                      <span>🎉 আজকেই এই মহিমান্বিত দিন! মোবারকবাদ!</span>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-gray-400 block mb-0.5">
                        {countdown.isPassedThisYear
                          ? `চলতি বছর অতিক্রান্ত • ${toBengaliDigits(countdown.targetYear)} হিজরির জন্য বাকি:`
                          : 'আসন্ন দিনটির ১ বছরের কাউন্টডাউন:'}
                      </div>
                      <div className="text-xs sm:text-sm font-black font-mono tracking-wide flex items-center justify-center gap-1.5">
                        <span className="text-amber-300">{toBengaliDigits(countdown.daysRemaining)} দিন</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-emerald-300">{toBengaliDigits(countdown.hoursRemaining)} ঘণ্টা</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-teal-300">{toBengaliDigits(countdown.minutesRemaining)} মিনিট</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 1-Year Cycle Position Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>১ বছর চক্রে অবস্থান: {toBengaliDigits(countdown.milestoneDayOfYear)}/৩৫৪ দিন</span>
                    <span className="font-mono text-amber-300">{toBengaliDigits(countdown.yearPositionPercent)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-amber-400"
                      style={{ width: `${countdown.yearPositionPercent}%` }}
                    />
                  </div>
                </div>

                {/* Significance Summary */}
                <p className="text-[11px] text-emerald-100/90 leading-relaxed line-clamp-2">
                  {day.significanceBn}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">
                  {day.recommendedAmalsBn.length} টি সুন্নাহ আমল
                </span>
                <button
                  onClick={() => setSelectedDayDetails(day)}
                  className="px-3 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-emerald-600"
                >
                  <span>বিস্তারিত ও আমল</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 5. MODAL: DETAILED VIEW OF SELECTED ISLAMIC DAY                   */}
      {/* ----------------------------------------------------------------- */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-emerald-950 border-2 border-amber-400/80 text-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-black/40 border border-white/10">
                  {selectedDayDetails.icon}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-300">
                    {selectedDayDetails.titleBn}
                  </h3>
                  <span className="text-xs text-emerald-200 font-mono font-medium">
                    {selectedDayDetails.dayOfMonth} {selectedDayDetails.monthNameBn}
                    {selectedDayDetails.arabicTitle ? ` • ${selectedDayDetails.arabicTitle}` : ''}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDayDetails(null)}
                className="w-8 h-8 rounded-full bg-black/40 border border-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Triple Calendar Equivalent Dates Showcase for this Special Day */}
            {(() => {
              const equiv = getEquivalentDatesForHijri(selectedDayDetails.dayOfMonth, selectedDayDetails.monthIndex);
              return (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 border border-amber-400/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>৩ সনের সমতুল্য তারিখ ও মাস পরিচিতি (১২ মাস অনুযায়ী গণনা):</span>
                    </span>
                    <span className="text-[11px] text-emerald-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      {equiv.dayOfWeekNameBn}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* Hijri */}
                    <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 space-y-1">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🌙 হিজরি তারিখ</div>
                      <div className="font-black text-white text-sm">
                        {toBengaliDigits(selectedDayDetails.dayOfMonth)} {equiv.hijri.monthNameBn}
                        {selectedDayDetails.endDayOfMonth ? ` - ${toBengaliDigits(selectedDayDetails.endDayOfMonth)} ${equiv.hijri.monthNameBn}` : ''}
                      </div>
                      <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                        <span>{equiv.hijri.monthOrdinalBn} মাস</span>
                        <span className="bg-amber-400/20 px-1.5 py-0.2 rounded font-mono text-[10px]">[{equiv.hijri.monthFractionBn}]</span>
                      </div>
                    </div>

                    {/* Gregorian */}
                    <div className="p-2.5 rounded-xl bg-blue-900/30 border border-blue-500/30 space-y-1">
                      <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">📅 সম্ভাব্য ইংরেজি তারিখ</div>
                      <div className="font-black text-white text-sm">
                        {toBengaliDigits(equiv.gregorian.day)} {equiv.gregorian.monthNameBn} {toBengaliDigits(equiv.gregorian.year)}
                      </div>
                      <div className="text-[11px] text-blue-200 font-bold flex items-center gap-1">
                        <span>{equiv.gregorian.monthOrdinalBn} মাস</span>
                        <span className="bg-blue-400/20 px-1.5 py-0.2 rounded font-mono text-[10px]">[{equiv.gregorian.monthFractionBn}]</span>
                      </div>
                    </div>

                    {/* Bengali */}
                    <div className="p-2.5 rounded-xl bg-amber-900/30 border border-amber-500/30 space-y-1">
                      <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">🌾 সম্ভাব্য বাংলা তারিখ</div>
                      <div className="font-black text-white text-sm">
                        {toBengaliDigits(equiv.bengali.day)} {equiv.bengali.monthNameBn} {toBengaliDigits(equiv.bengali.year)}
                      </div>
                      <div className="text-[11px] text-amber-200 font-bold flex items-center gap-1">
                        <span>{equiv.bengali.monthOrdinalBn} মাস</span>
                        <span className="bg-amber-400/20 px-1.5 py-0.2 rounded font-mono text-[10px]">[{equiv.bengali.monthFractionBn}]</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Countdown Badge in Modal */}
            {(() => {
              const cd = calculateMilestoneCountdown(selectedDayDetails, currentTime);
              return (
                <div className="p-3 rounded-xl bg-black/50 border border-amber-400/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>১ বছরের অবশিষ্ট সময়:</span>
                  </div>
                  <div className="font-mono font-black text-emerald-300">
                    {cd.isToday
                      ? 'আজকেই এই দিন!'
                      : `${toBengaliDigits(cd.daysRemaining)} দিন ${toBengaliDigits(cd.hoursRemaining)} ঘণ্টা ${toBengaliDigits(cd.minutesRemaining)} মিনিট বাকি`}
                  </div>
                </div>
              );
            })()}

            {/* Significance */}
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-300">মূল তাৎপর্য ও ফযিলত:</h5>
              <p className="text-xs text-emerald-100 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                {selectedDayDetails.significanceBn}
              </p>
            </div>

            {/* Historical Context */}
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-amber-300">ঐতিহাসিক প্রেক্ষাপট:</h5>
              <p className="text-xs text-emerald-200/90 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                {selectedDayDetails.historicalContextBn}
              </p>
            </div>

            {/* Sahaba & Prophet Context */}
            {selectedDayDetails.sahabaProphetContextBn && (
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-amber-300">নবীজি ﷺ ও সাহাবীদের ভূমিকা:</h5>
                <p className="text-xs text-emerald-200/90 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                  {selectedDayDetails.sahabaProphetContextBn}
                </p>
              </div>
            )}

            {/* Quran Verse (if available) */}
            {selectedDayDetails.quranReference && (
              <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>কুরআনের ঘোষণা — {selectedDayDetails.quranReference.surahNameBn} (আয়াত {selectedDayDetails.quranReference.ayahNo}):</span>
                </div>
                {selectedDayDetails.quranReference.verseAr && (
                  <p className="text-xs font-serif text-amber-100 italic py-0.5">
                    {selectedDayDetails.quranReference.verseAr}
                  </p>
                )}
                <p className="text-xs text-emerald-100 leading-relaxed">
                  "{selectedDayDetails.quranReference.verseBn}"
                </p>
              </div>
            )}

            {/* Hadith Reference (if available) */}
            {selectedDayDetails.hadithReference && (
              <div className="p-3 rounded-xl bg-black/50 border border-amber-400/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>সহীহ হাদীসের সনদ ও বাণী:</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700 font-bold">
                    {selectedDayDetails.hadithReference.authenticityGrade}
                  </span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed italic">
                  "{selectedDayDetails.hadithReference.textBn}"
                </p>
                <div className="text-[10px] text-gray-400 font-mono pt-1">
                  সূত্র: {selectedDayDetails.hadithReference.bookBn} (হাদিস নং: {selectedDayDetails.hadithReference.hadithNo})
                </div>
              </div>
            )}

            {/* Prohibited Actions on this day (if available) */}
            {selectedDayDetails.prohibitedActionsBn && selectedDayDetails.prohibitedActionsBn.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-1.5">
                <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>এই দিনে যা বর্জনীয় ও নিষিদ্ধ:</span>
                </h5>
                <div className="space-y-1">
                  {selectedDayDetails.prohibitedActionsBn.map((item, idx) => (
                    <div key={idx} className="text-xs text-rose-100 flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Amals */}
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>করণীয় সুন্নাত ও নফল আমলসমূহ:</span>
              </h5>
              <div className="space-y-1.5">
                {selectedDayDetails.recommendedAmalsBn.map((amal, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-800 text-xs text-emerald-100 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{amal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Dua */}
            {selectedDayDetails.associatedDuaBn && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-amber-400/40 space-y-1.5 text-center">
                <span className="text-[11px] font-bold text-amber-300 block">এই দিনের বিশেষ দোয়া:</span>
                <p className="text-sm font-serif text-amber-100 py-1">
                  {selectedDayDetails.associatedDuaBn.arabic}
                </p>
                <p className="text-xs text-emerald-200 text-left">
                  <strong className="text-amber-300">উচ্চারণ:</strong> {selectedDayDetails.associatedDuaBn.transliteration}
                </p>
                <p className="text-xs text-emerald-200 text-left">
                  <strong className="text-amber-300">অর্থ:</strong> {selectedDayDetails.associatedDuaBn.meaning}
                </p>
              </div>
            )}

            {/* Modal Close & Connect Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              {onOpenAmalTracker ? (
                <button
                  onClick={() => {
                    setSelectedDayDetails(null);
                    onOpenAmalTracker();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 font-bold text-xs cursor-pointer border border-emerald-600 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>আজকের পূর্ণ আমল ও কানেকশন</span>
                </button>
              ) : <div />}

              <button
                onClick={() => setSelectedDayDetails(null)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-lg transition"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
