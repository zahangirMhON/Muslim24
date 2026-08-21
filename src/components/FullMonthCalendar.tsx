import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Info,
  X,
  Star,
  CheckCircle2,
  CalendarDays,
  List,
  Grid,
  Sun,
  Moon,
  Compass,
  Award,
  ShieldCheck,
  Flame,
  HelpCircle,
  GraduationCap,
  Landmark,
  UserCheck
} from 'lucide-react';
import { toBengaliDigits, toBengaliOrdinal } from '../utils/bengaliUtils';
import {
  getDetailedCalendarDayInfo,
  CalendarDayDetails,
  getDatesForHijriMonth,
  getDatesForBengaliMonth
} from '../data/calendarEventsData';
import { launchDhikrInTasbih } from '../utils/haptics';

interface FullMonthCalendarProps {
  onSelectDate?: (date: Date) => void;
}

type CalendarSystem = 'hijri' | 'bengali' | 'gregorian';

export const FullMonthCalendar: React.FC<FullMonthCalendarProps> = ({ onSelectDate }) => {
  // Calendar System Tab State: 'hijri' | 'bengali' | 'gregorian'
  const [activeSystem, setActiveSystem] = useState<CalendarSystem>('hijri');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDayDetails, setSelectedDayDetails] = useState<CalendarDayDetails | null>(null);

  // Today reference
  const today = new Date();
  const currentTodayInfo = getDetailedCalendarDayInfo(today);

  // Month navigation states per calendar system
  // 1. Gregorian
  const [gregDate, setGregDate] = useState<Date>(new Date());
  
  // 2. Hijri: 0-11 month index, year 1448
  const [hijriMonth, setHijriMonth] = useState<number>(currentTodayInfo.hijriMonth);
  const [hijriYear, setHijriYear] = useState<number>(currentTodayInfo.hijriYear);

  // 3. Bengali: 0-11 month index, year 1433
  const [bengaliMonth, setBengaliMonth] = useState<number>(currentTodayInfo.bengaliMonth);
  const [bengaliYear, setBengaliYear] = useState<number>(currentTodayInfo.bengaliYear);

  const HIJRI_MONTH_NAMES_BN = [
    '১. মুহররম (পবিত্র মাস)', '২. সফর', '৩. রবিউল আউয়াল (সিরাতুন্নবী ﷺ)', '৪. রবিউস সানী',
    '৫. জমাদিউল আউয়াল', '৬. জমাদিউস সানী', '৭. রজব (সম্মানিত মাস ও মিরাজ)', '৮. শাবান (শবে বরাত)',
    '৯. রমজানুল মোবারক (সিয়াম ও কদর)', '১০. শাওয়াল (ঈদুল ফিতর)', '১১. জুলক্বাদ (পবিত্র মাস)', '১২. জুলহিজ্জাহ (হজ ও কুরবানি)'
  ];

  const HIJRI_MONTH_SHORT_BN = [
    'মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানী',
    'জমাদিউল আউয়াল', 'জমাদিউস সানী', 'রজব', 'শাবান',
    'রমজান', 'শাওয়াল', 'জুলক্বাদ', 'জুলহিজ্জাহ'
  ];

  const BENGALI_MONTH_NAMES_BN = [
    '১. বৈশাখ (গ্রীষ্মকাল)', '২. জ্যৈষ্ঠ (মধু মাস)', '৩. আষাঢ় (বর্ষাকাল)', '৪. শ্রাবণ (বর্ষাকাল)',
    '৫. ভাদ্র (শরৎকাল)', '৬. আশ্বিন (শরৎকাল)', '৭. কার্তিক (হেমন্তকাল)', '৮. অগ্রহায়ণ (নবান্ন)',
    '৯. পৌষ (শীতকাল)', '১০. মাঘ (তীব্র শীতকাল)', '১১. ফাল্গুন (বসন্তকাল)', '১২. চৈত্র (বসন্তকাল)'
  ];

  const BENGALI_MONTH_SHORT_BN = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ',
    'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ',
    'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];

  const GREG_MONTHS_BN = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const WEEK_DAYS_BN = [
    { name: 'রবি', full: 'রবিবার' },
    { name: 'সোম', full: 'সোমবার' },
    { name: 'মঙ্গল', full: 'মঙ্গলবার' },
    { name: 'বুধ', full: 'বুধবার' },
    { name: 'বৃহঃ', full: 'বৃহস্পতিবার' },
    { name: 'শুক্র', full: 'শুক্রবার' },
    { name: 'শনি', full: 'শনিবার' }
  ];

  // System month navigation handlers
  const handlePrev = () => {
    if (activeSystem === 'hijri') {
      if (hijriMonth === 0) {
        setHijriMonth(11);
        setHijriYear(hijriYear - 1);
      } else {
        setHijriMonth(hijriMonth - 1);
      }
    } else if (activeSystem === 'bengali') {
      if (bengaliMonth === 0) {
        setBengaliMonth(11);
        setBengaliYear(bengaliYear - 1);
      } else {
        setBengaliMonth(bengaliMonth - 1);
      }
    } else {
      setGregDate(new Date(gregDate.getFullYear(), gregDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (activeSystem === 'hijri') {
      if (hijriMonth === 11) {
        setHijriMonth(0);
        setHijriYear(hijriYear + 1);
      } else {
        setHijriMonth(hijriMonth + 1);
      }
    } else if (activeSystem === 'bengali') {
      if (bengaliMonth === 11) {
        setBengaliMonth(0);
        setBengaliYear(bengaliYear + 1);
      } else {
        setBengaliMonth(bengaliMonth + 1);
      }
    } else {
      setGregDate(new Date(gregDate.getFullYear(), gregDate.getMonth() + 1, 1));
    }
  };

  const handleResetToCurrent = () => {
    setGregDate(new Date());
    setHijriMonth(currentTodayInfo.hijriMonth);
    setHijriYear(currentTodayInfo.hijriYear);
    setBengaliMonth(currentTodayInfo.bengaliMonth);
    setBengaliYear(currentTodayInfo.bengaliYear);
  };

  // Get active month's days list
  let currentMonthDates: Date[] = [];
  let currentMonthTitle = '';
  let currentMonthSubtitle = '';

  if (activeSystem === 'hijri') {
    currentMonthDates = getDatesForHijriMonth(hijriMonth, hijriYear);
    currentMonthTitle = `${HIJRI_MONTH_NAMES_BN[hijriMonth]} • ${toBengaliDigits(hijriYear)} হিজরি`;
    currentMonthSubtitle = `ইসলামিক হিজরি সন, বিশেষ তাৎপর্য, ঐতিহাসিক বদর/ওহুদ/কারবালা ও নবী-সাহাবীদের সিরাত`;
  } else if (activeSystem === 'bengali') {
    currentMonthDates = getDatesForBengaliMonth(bengaliMonth, bengaliYear);
    currentMonthTitle = `${BENGALI_MONTH_NAMES_BN[bengaliMonth]} • ${toBengaliDigits(bengaliYear)} বঙ্গাব্দ`;
    currentMonthSubtitle = `বাংলা পঞ্জিকা, ঋতুচক্র, কৃষি ও প্রকৃতির নিয়ামতের শুকরিয়া এবং বাংলাদেশি প্রেক্ষাপট`;
  } else {
    const y = gregDate.getFullYear();
    const m = gregDate.getMonth();
    const daysCount = new Date(y, m + 1, 0).getDate();
    currentMonthDates = Array.from({ length: daysCount }, (_, i) => new Date(y, m, i + 1));
    currentMonthTitle = `${GREG_MONTHS_BN[m]} • ${toBengaliDigits(y)} খ্রিস্টাব্দ`;
    currentMonthSubtitle = `আন্তর্জাতিক ক্যালেন্ডার, বাংলাদেশের সরকারি ও জাতীয় ছুটির দিন এবং দৈনিক আমল`;
  }

  // Calculate day cells with week-day alignment for grid view
  const firstDate = currentMonthDates[0] || new Date();
  const startDayOfWeek = firstDate.getDay(); // 0=Sun
  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (const d of currentMonthDates) {
    calendarCells.push(d);
  }

  const handleCellClick = (d: Date) => {
    const details = getDetailedCalendarDayInfo(d);
    setSelectedDayDetails(details);
    if (onSelectDate) onSelectDate(d);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-2xl border border-emerald-700/60 p-3.5 sm:p-5 shadow-2xl space-y-4 text-emerald-50 relative overflow-hidden">
      
      {/* 1. SEPARATE CALENDAR SYSTEM TABS (আরবি আলাদা, বাংলা আলাদা, ইংরেজি আলাদা) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3.5">
        
        {/* Navigation Tabs for Hijri, Bengali, Gregorian */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-emerald-700/50 overflow-x-auto scrollbar-none">
          
          <button
            onClick={() => setActiveSystem('hijri')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSystem === 'hijri'
                ? 'bg-amber-400 text-emerald-950 shadow-md ring-1 ring-amber-300'
                : 'text-amber-200/90 hover:bg-emerald-800/60'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-500 fill-current" />
            <span>🌙 হিজরি/আরবি পঞ্জিকা</span>
          </button>

          <button
            onClick={() => setActiveSystem('bengali')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSystem === 'bengali'
                ? 'bg-amber-400 text-emerald-950 shadow-md ring-1 ring-amber-300'
                : 'text-emerald-200/90 hover:bg-emerald-800/60'
            }`}
          >
            <Sun className="w-4 h-4 text-emerald-400" />
            <span>🌾 বাংলা সন ও পঞ্জিকা</span>
          </button>

          <button
            onClick={() => setActiveSystem('gregorian')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSystem === 'gregorian'
                ? 'bg-amber-400 text-emerald-950 shadow-md ring-1 ring-amber-300'
                : 'text-teal-200/90 hover:bg-emerald-800/60'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-teal-400" />
            <span>📅 ইংরেজি ক্যালেন্ডার</span>
          </button>

        </div>

        {/* View Mode Toggle: Grid vs List */}
        <div className="flex items-center justify-end gap-1.5">
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-emerald-700/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
              title="গ্রিড ক্যালেন্ডার ভিউ"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">গ্রিড</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'list'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
              title="দিনপঞ্জিকা ও আমলের তালিকা"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">তালিকা</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. ACTIVE CALENDAR MONTH NAVIGATOR BANNER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-black/40 p-3 sm:p-4 rounded-2xl border border-emerald-700/50">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {activeSystem === 'hijri' ? '🌙' : activeSystem === 'bengali' ? '🌾' : '📅'}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300">
                {currentMonthTitle}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {currentMonthSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Previous / Next Month Controls */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition cursor-pointer active:scale-95 shadow-sm"
            title="পূর্ববর্তী মাস"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetToCurrent}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition cursor-pointer shadow active:scale-95"
          >
            চলতি মাসে ফিরুন
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition cursor-pointer active:scale-95 shadow-sm"
            title="পরবর্তী মাস"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 3. LEGEND & BADGE EXPLANATION */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-200/90 bg-black/30 p-2 sm:p-2.5 rounded-xl border border-white/5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block ring-1 ring-amber-300" />
            <span>আজকের দিন</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>জুমু'আ বার</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block animate-pulse" />
            <span>ঐতিহাসিক ঘটনা / নবী-সাহাবী সিরাত</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
            <span>সুন্নাত রোজা (সোম/বৃহঃ/আইয়ামে বীজ)</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>সরকারি ছুটি</span>
          </span>
        </div>

        <span className="text-[10px] text-emerald-300/80 italic hidden lg:inline">
          * তারিখে ক্লিক করে নবী-সাহাবী, মনীষী, জ্ঞান অন্বেষণ ও হাদিস দেখুন
        </span>
      </div>

      {/* 4. MAIN DISPLAY (GRID OR LIST) */}
      {viewMode === 'grid' ? (
        <div className="space-y-1.5">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs py-1 text-emerald-300">
            {WEEK_DAYS_BN.map((day, idx) => (
              <div
                key={idx}
                className={`py-1.5 rounded-xl border border-transparent ${
                  idx === 5
                    ? 'text-amber-300 bg-amber-400/15 border-amber-400/30 font-black'
                    : idx === 1 || idx === 4
                    ? 'text-teal-200 bg-teal-900/20'
                    : 'bg-black/20'
                }`}
              >
                <span>{day.name}</span>
                <span className="hidden sm:inline text-[10px] text-emerald-300/70 block font-normal">
                  {day.full.replace('বার', '')}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarCells.map((cellDate, idx) => {
              if (!cellDate) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[72px] sm:min-h-[86px] rounded-xl bg-black/10 border border-transparent opacity-20 pointer-events-none"
                  />
                );
              }

              const dayInfo = getDetailedCalendarDayInfo(cellDate);
              const isToday =
                today.getFullYear() === cellDate.getFullYear() &&
                today.getMonth() === cellDate.getMonth() &&
                today.getDate() === cellDate.getDate();

              // Primary Day Number based on active system
              let primaryDayNumber = '';
              let secondaryLine1 = '';
              let secondaryLine2 = '';

              if (activeSystem === 'hijri') {
                primaryDayNumber = toBengaliDigits(dayInfo.hijriDay);
                secondaryLine1 = `📅 ${toBengaliDigits(dayInfo.gregorianDay)} ${GREG_MONTHS_BN[dayInfo.gregorianMonth].substring(0, 4)}`;
                secondaryLine2 = `🌾 ${toBengaliDigits(dayInfo.bengaliDay)} ${BENGALI_MONTH_SHORT_BN[dayInfo.bengaliMonth]}`;
              } else if (activeSystem === 'bengali') {
                primaryDayNumber = toBengaliDigits(dayInfo.bengaliDay);
                secondaryLine1 = `📅 ${toBengaliDigits(dayInfo.gregorianDay)} ${GREG_MONTHS_BN[dayInfo.gregorianMonth].substring(0, 4)}`;
                secondaryLine2 = `🌙 ${toBengaliDigits(dayInfo.hijriDay)} ${HIJRI_MONTH_SHORT_BN[dayInfo.hijriMonth]}`;
              } else {
                primaryDayNumber = toBengaliDigits(dayInfo.gregorianDay);
                secondaryLine1 = `🌙 ${toBengaliDigits(dayInfo.hijriDay)} ${HIJRI_MONTH_SHORT_BN[dayInfo.hijriMonth]}`;
                secondaryLine2 = `🌾 ${toBengaliDigits(dayInfo.bengaliDay)} ${BENGALI_MONTH_SHORT_BN[dayInfo.bengaliMonth]}`;
              }

              return (
                <button
                  key={dayInfo.dateKey}
                  onClick={() => handleCellClick(cellDate)}
                  className={`min-h-[72px] sm:min-h-[86px] p-1.5 sm:p-2 rounded-xl border transition-all text-left flex flex-col justify-between relative group cursor-pointer active:scale-97 ${
                    isToday
                      ? 'bg-gradient-to-br from-amber-400/25 to-amber-600/20 border-amber-400 ring-2 ring-amber-400/70 shadow-lg shadow-amber-500/10'
                      : dayInfo.isFriday
                      ? 'bg-emerald-900/60 border-emerald-600/60 hover:border-amber-400 hover:bg-emerald-850'
                      : dayInfo.isGovtHoliday
                      ? 'bg-rose-950/40 border-rose-700/50 hover:border-rose-400'
                      : 'bg-black/35 border-emerald-700/30 hover:border-amber-400/50 hover:bg-black/55'
                  }`}
                >
                  {/* Top Row: Primary Day Number + Badges */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-black text-xs sm:text-sm leading-none ${
                        isToday
                          ? 'text-amber-300 font-mono scale-105'
                          : dayInfo.isFriday
                          ? 'text-emerald-200'
                          : 'text-emerald-100'
                      }`}
                    >
                      {primaryDayNumber}
                    </span>

                    <div className="flex items-center gap-0.5">
                      {dayInfo.isGovtHoliday && (
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500 shrink-0"
                          title={`সরকারি ছুটি: ${dayInfo.govtHolidayTitle}`}
                        />
                      )}
                      {dayInfo.islamicEventTitle && (
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-pulse shrink-0"
                          title={`ঐতিহাসিক ইসলামিক দিন: ${dayInfo.islamicEventTitle}`}
                        />
                      )}
                      {dayInfo.isSunnahFastingDay && !dayInfo.isFriday && (
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-400 shrink-0"
                          title={dayInfo.isAyyamAlBeed ? 'আইয়ামে বীজ রোজা' : 'সুন্নাত রোজা'}
                        />
                      )}
                    </div>
                  </div>

                  {/* Middle Row: First Secondary Date */}
                  <div className="text-[10px] sm:text-[11px] font-semibold text-amber-200/90 truncate leading-tight mt-0.5">
                    {secondaryLine1}
                  </div>

                  {/* Bottom Row: Second Secondary Date or Special Tag */}
                  <div className="text-[9px] sm:text-[10px] text-emerald-300/80 truncate leading-none mt-auto pt-1 border-t border-white/5 w-full">
                    {dayInfo.govtHolidayTitle ? (
                      <span className="text-rose-300 font-bold truncate block">
                        🇧🇩 {dayInfo.govtHolidayTitle.substring(0, 7)}..
                      </span>
                    ) : dayInfo.islamicEventTitle ? (
                      <span className="text-amber-300 font-bold truncate block">
                        ⭐ {dayInfo.islamicEventTitle.substring(0, 7)}..
                      </span>
                    ) : (
                      <span>{secondaryLine2}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW: Detailed day-by-day breakdown with knowledge, prophetic history & deeds */
        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
          {currentMonthDates.map((cellDate) => {
            const dayInfo = getDetailedCalendarDayInfo(cellDate);
            return (
              <div
                key={dayInfo.dateKey}
                onClick={() => handleCellClick(cellDate)}
                className="bg-black/40 hover:bg-black/60 p-3.5 rounded-2xl border border-emerald-700/40 hover:border-amber-400 transition cursor-pointer space-y-2.5"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-emerald-950 font-black text-xs">
                      🌙 {dayInfo.hijriDateStr}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-800 text-emerald-100 font-semibold text-xs">
                      🌾 {dayInfo.bengaliDateStr}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-teal-900/80 text-teal-200 text-xs">
                      📅 {dayInfo.gregorianDateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {dayInfo.isGovtHoliday && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                        🇧🇩 সরকারি ছুটি
                      </span>
                    )}
                    {dayInfo.isFriday && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                        🕌 জুমু'আ
                      </span>
                    )}
                  </div>
                </div>

                {/* Body: Events, Sahaba, Scholar & Knowledge snippet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {/* Left: Prophetic / Sahaba / Scholar info */}
                  <div className="space-y-1.5">
                    {dayInfo.islamicEventTitle && (
                      <div className="text-amber-300 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{dayInfo.islamicEventTitle}</span>
                      </div>
                    )}
                    {dayInfo.sahabaMilestone && (
                      <div className="text-emerald-200 leading-relaxed bg-black/30 p-2 rounded-xl border border-white/5">
                        <strong className="text-amber-300">সাহাবী জীবনী ও ত্যাগ: </strong>
                        {dayInfo.sahabaMilestone.sahabaName} — {dayInfo.sahabaMilestone.virtueAndSacrifice}
                      </div>
                    )}
                    {dayInfo.scholarLuminaries && (
                      <div className="text-emerald-200 leading-relaxed bg-black/30 p-2 rounded-xl border border-white/5">
                        <strong className="text-amber-300">ইসলামিক মনীষী: </strong>
                        {dayInfo.scholarLuminaries.scholarName} ({dayInfo.scholarLuminaries.titleBn})
                      </div>
                    )}
                  </div>

                  {/* Right: Essential Daily Knowledge (জ্ঞান অন্বেষণ) */}
                  <div className="bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/30 space-y-1">
                    <div className="text-amber-300 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                        <span>জ্ঞান অন্বেষণ: {dayInfo.dailyKnowledgeForMuslim.title}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200">
                        {dayInfo.dailyKnowledgeForMuslim.category}
                      </span>
                    </div>
                    <p className="text-emerald-100 text-[11px] leading-relaxed">
                      {dayInfo.dailyKnowledgeForMuslim.essentialLesson}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                  <span className="text-emerald-300/80 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>আমল: {dayInfo.recommendedAmals[0]}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(cellDate);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-800/90 hover:bg-amber-400 hover:text-emerald-950 text-emerald-200 font-bold transition border border-emerald-600/40"
                  >
                    সম্পূর্ণ বিবরণ ও দোয়া →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. COMPREHENSIVE DAY DETAILS MODAL (নবী, সাহাবী, মনীষী, জ্ঞান অন্বেষণ, কুরআন-হাদিস ও দোয়া) */}
      {selectedDayDetails && createPortal(
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setSelectedDayDetails(null)}
        >
          <div
            className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-400/80 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 text-emerald-50 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDayDetails(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-emerald-300 hover:text-amber-300 hover:bg-black/80 transition cursor-pointer border border-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-amber-400/40 pb-3 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-xs font-black">
                  তারিখের পূর্ণাঙ্গ ইসলামিক জ্ঞান ও বিবরণ
                </span>
                {selectedDayDetails.isGovtHoliday && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    🇧🇩 সরকারি ছুটি
                  </span>
                )}
                {selectedDayDetails.isFriday && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    🕌 পবিত্র জুমু'আ বার
                  </span>
                )}
                {selectedDayDetails.isSunnahFastingDay && (
                  <span className="px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold">
                    🌿 সুন্নাত রোজা
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-black text-amber-300">
                {selectedDayDetails.gregorianDateStr}
              </h3>

              {/* Multi-Calendar Triple Date Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="bg-black/40 p-2.5 rounded-xl border border-amber-400/40 flex items-center gap-2 text-xs">
                  <span className="text-amber-400 font-bold">🌙 হিজরি তারিখ:</span>
                  <span className="text-amber-100 font-semibold">{selectedDayDetails.hijriDateStr}</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-emerald-500/40 flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 font-bold">🌾 বাংলা সন:</span>
                  <span className="text-emerald-100 font-semibold">{selectedDayDetails.bengaliDateStr}</span>
                </div>
              </div>
            </div>

            {/* 1. Essential Daily Islamic Knowledge (জ্ঞান অন্বেষণ - মুসলিম হিসেবে যা জানা আবশ্যক) */}
            <div className="bg-gradient-to-r from-amber-400/20 to-amber-500/10 p-4 rounded-2xl border-2 border-amber-400/60 space-y-2 text-xs">
              <div className="flex items-center justify-between font-black text-amber-300 text-sm sm:text-base">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <span>জ্ঞান অন্বেষণ: {selectedDayDetails.dailyKnowledgeForMuslim.title}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold">
                  {selectedDayDetails.dailyKnowledgeForMuslim.category}
                </span>
              </div>
              <p className="text-emerald-50 leading-relaxed font-medium">
                {selectedDayDetails.dailyKnowledgeForMuslim.essentialLesson}
              </p>
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 text-amber-200">
                <strong>ব্যবহারিক আমল ও করণীয়: </strong>
                {selectedDayDetails.dailyKnowledgeForMuslim.practicalAction}
              </div>
            </div>

            {/* 2. Prophetic Seerah & Milestones (নবী ও রাসূলগণের সিরাত ও ঘটনা) */}
            {selectedDayDetails.propheticMilestone && (
              <div className="bg-emerald-950/70 p-3.5 rounded-xl border border-emerald-600/50 space-y-1.5 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>নবীর সিরাত: {selectedDayDetails.propheticMilestone.prophetName} — {selectedDayDetails.propheticMilestone.eventTitle}</span>
                </div>
                <p className="text-emerald-100 leading-relaxed">
                  {selectedDayDetails.propheticMilestone.historicalDetail}
                </p>
                <p className="text-emerald-300 text-[11px]">
                  <strong>শিক্ষা ও তাৎপর্য: </strong> {selectedDayDetails.propheticMilestone.lessonBn}
                </p>
              </div>
            )}

            {/* 3. Sahaba Milestones (সাহাবায়ে কেরামের জীবনী, জন্ম, শাহাদাত ও ত্যাগ) */}
            {selectedDayDetails.sahabaMilestone && (
              <div className="bg-black/40 p-3.5 rounded-xl border border-emerald-600/50 space-y-1.5 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>সাহাবা জীবনী ও ত্যাগ: {selectedDayDetails.sahabaMilestone.sahabaName}</span>
                </div>
                <p className="text-emerald-100 leading-relaxed">
                  {selectedDayDetails.sahabaMilestone.virtueAndSacrifice}
                </p>
                <p className="text-amber-200/90 text-[11px] italic">
                  দলিল/হাদিস সূত্র: {selectedDayDetails.sahabaMilestone.hadithQuoteOrReference}
                </p>
              </div>
            )}

            {/* 4. Islamic Scholars & Four Imams (ইসলামিক মনীষী ও চার ইমামের অবদান) */}
            {selectedDayDetails.scholarLuminaries && (
              <div className="bg-black/40 p-3.5 rounded-xl border border-teal-600/50 space-y-1.5 text-xs">
                <div className="font-bold text-teal-300 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-teal-400" />
                    <span>ইসলামিক মনীষী: {selectedDayDetails.scholarLuminaries.scholarName}</span>
                  </span>
                  <span className="text-[10px] text-teal-200">
                    জীবনকাল: {selectedDayDetails.scholarLuminaries.lifespanBn}
                  </span>
                </div>
                <p className="text-emerald-100 leading-relaxed">
                  <strong>ইসলামে অবদান: </strong> {selectedDayDetails.scholarLuminaries.majorContribution}
                </p>
                <p className="text-teal-200 text-[11px]">
                  <strong>প্রধান গ্রন্থ/উদ্ধৃতি: </strong> {selectedDayDetails.scholarLuminaries.famousQuoteOrBook}
                </p>
              </div>
            )}

            {/* 5. Government Holiday Info (সরকারি ছুটি ও জাতীয় দিবস) */}
            {selectedDayDetails.isGovtHoliday && selectedDayDetails.govtHolidayTitle && (
              <div className="bg-rose-950/60 p-3.5 rounded-xl border border-rose-700/60 space-y-1 text-xs">
                <div className="font-bold text-rose-300 flex items-center gap-1.5 text-sm">
                  <span>🇧🇩 সরকারি ও জাতীয় ছুটি:</span>
                  <span>{selectedDayDetails.govtHolidayTitle}</span>
                </div>
                <p className="text-rose-100/90 leading-relaxed">
                  উক্ত দিনে বাংলাদেশের সরকারি প্রতিষ্ঠান, শিক্ষাপ্রতিষ্ঠান ও ব্যাংক বন্ধ থাকবে। ইসলামী শরীয়তের নির্দেশনা অনুযায়ী এই দিনে দেশ, জাতি ও মুসলিম উম্মাহর সার্বিক কল্যাণ কামনায় সচেষ্ট থাকা উত্তম।
                </p>
              </div>
            )}

            {/* 6. Quran Reference */}
            {selectedDayDetails.quranReference && (
              <div className="bg-black/40 p-3.5 rounded-xl border border-emerald-600/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>কুরআনের নির্দেশনা ও আয়াত ({selectedDayDetails.quranReference.surahName}: {toBengaliDigits(selectedDayDetails.quranReference.ayahNumber)})</span>
                  </span>
                </div>

                {selectedDayDetails.quranReference.verseAr && (
                  <div className="text-right font-serif text-base sm:text-lg text-amber-100 leading-relaxed py-1">
                    {selectedDayDetails.quranReference.verseAr}
                  </div>
                )}

                <p className="text-emerald-100 font-medium italic">
                  "{selectedDayDetails.quranReference.verseBn}"
                </p>

                <p className="text-emerald-300/90 text-[11px] pt-1 border-t border-white/10">
                  <strong>তাফসীর ও শিক্ষা: </strong> {selectedDayDetails.quranReference.explanationBn}
                </p>
              </div>
            )}

            {/* 7. Sahih Hadith Reference */}
            {selectedDayDetails.hadithReference && (
              <div className="bg-black/40 p-3.5 rounded-xl border border-teal-600/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-300">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-teal-400" />
                    <span>সহীহ হাদিসের দলিল ({selectedDayDetails.hadithReference.bookBn}: {toBengaliDigits(selectedDayDetails.hadithReference.hadithNo)})</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900 text-teal-200 border border-teal-600">
                    {selectedDayDetails.hadithReference.authenticityGrade}
                  </span>
                </div>

                <p className="text-emerald-100 font-medium">
                  {selectedDayDetails.hadithReference.narratorBn} থেকে বর্ণিত, {selectedDayDetails.hadithReference.textBn}
                </p>
              </div>
            )}

            {/* 8. Recommended Sunnah Deeds */}
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/10 space-y-2 text-xs">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>আজকের পালনীয় বিশেষ সুন্নাত ও নেক আমলসমূহ:</span>
              </h4>

              <ul className="space-y-1.5 pl-1">
                {selectedDayDetails.recommendedAmals.map((amal, i) => (
                  <li key={i} className="flex items-start gap-2 text-emerald-100">
                    <span className="text-amber-400 font-bold shrink-0">✓</span>
                    <span>{amal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 9. Masnoon Dua & Direct Tasbih Launch */}
            {selectedDayDetails.masnoonDua && (
              <div className="bg-amber-400/10 p-3.5 rounded-xl border border-amber-400/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-300">
                  <span>🤲 {selectedDayDetails.masnoonDua.titleBn}</span>
                  <span className="text-[10px] text-amber-200/80">{selectedDayDetails.masnoonDua.sourceBn}</span>
                </div>

                <div className="text-right font-serif text-base sm:text-lg text-amber-100 leading-relaxed py-1">
                  {selectedDayDetails.masnoonDua.arabicText}
                </div>

                <p className="text-amber-200/90 text-xs italic">
                  উচ্চারণ: {selectedDayDetails.masnoonDua.transliterationBn}
                </p>

                <p className="text-emerald-100 text-xs">
                  অর্থ: {selectedDayDetails.masnoonDua.meaningBn}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      launchDhikrInTasbih({
                        titleBn: selectedDayDetails.masnoonDua!.titleBn,
                        arabicText: selectedDayDetails.masnoonDua!.arabicText,
                        transliterationBn: selectedDayDetails.masnoonDua!.transliterationBn,
                        translationBn: selectedDayDetails.masnoonDua!.meaningBn,
                        targetCount: 33
                      });
                      setSelectedDayDetails(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>তাসবিহ কাউন্টারে শুরু করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
