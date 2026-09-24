import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Moon,
  Sun,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  HeartHandshake,
  ArrowRight,
  Compass,
  Star,
  Info,
  ShieldCheck,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { toBengaliDigits, toBengaliOrdinal } from '../utils/bengaliUtils';
import {
  CalendarDayDetails,
  getDetailedCalendarDayInfo
} from '../data/calendarEventsData';
import { getHijriYearCycleStats } from '../utils/hijriCalendarData';
import { InteractiveKeywordBadge } from './InteractiveKeywordBadge';
import { launchDhikrInTasbih } from '../utils/haptics';
import { TripleYearCycleProgressChart } from './TripleYearCycleProgressChart';
import { ContinuousAmalsAndProhibitionsSection } from './ContinuousAmalsAndProhibitionsSection';

interface UnifiedDayLifeConnectionModalProps {
  selectedDate: Date | null;
  dayDetails?: CalendarDayDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string, elementId?: string) => void;
}

export const UnifiedDayLifeConnectionModal: React.FC<UnifiedDayLifeConnectionModalProps> = ({
  selectedDate,
  dayDetails,
  isOpen,
  onClose,
  onNavigateTab
}) => {
  // Current active date
  const targetDate = selectedDate || (dayDetails ? new Date(dayDetails.gregorianYear, dayDetails.gregorianMonth, dayDetails.gregorianDay) : new Date());
  const info: CalendarDayDetails = dayDetails || getDetailedCalendarDayInfo(targetDate);
  const cycleStats = getHijriYearCycleStats(targetDate);
  const weekDayNamesBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const dayNameBn = weekDayNamesBn[info.dayOfWeek] || '';

  // Today live action counters
  const [istighfarCount, setIstighfarCount] = useState<number>(() => {
    const saved = localStorage.getItem(`amal_istighfar_${info.gregorianDateStr}`);
    return saved ? parseInt(saved, 10) : 33;
  });

  const [duroodCount, setDuroodCount] = useState<number>(() => {
    const saved = localStorage.getItem(`amal_durood_${info.gregorianDateStr}`);
    return saved ? parseInt(saved, 10) : 33;
  });

  const [quranAyahRead, setQuranAyahRead] = useState<number>(() => {
    const saved = localStorage.getItem(`amal_quran_${info.gregorianDateStr}`);
    return saved ? parseInt(saved, 10) : 10;
  });

  const [isSadaqahDone, setIsSadaqahDone] = useState<boolean>(() => {
    return localStorage.getItem(`amal_sadaqah_${info.gregorianDateStr}`) === 'true';
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem(`amal_istighfar_${info.gregorianDateStr}`, istighfarCount.toString());
  }, [istighfarCount, info.gregorianDateStr]);

  useEffect(() => {
    localStorage.setItem(`amal_durood_${info.gregorianDateStr}`, duroodCount.toString());
  }, [duroodCount, info.gregorianDateStr]);

  useEffect(() => {
    localStorage.setItem(`amal_quran_${info.gregorianDateStr}`, quranAyahRead.toString());
  }, [quranAyahRead, info.gregorianDateStr]);

  useEffect(() => {
    localStorage.setItem(`amal_sadaqah_${info.gregorianDateStr}`, isSadaqahDone ? 'true' : 'false');
  }, [isSadaqahDone, info.gregorianDateStr]);

  if (!isOpen) return null;

  // Determine moon phase details
  const hijriDayNumber = info.hijriDay;
  let moonPhaseNameBn = 'নতুন চাঁদ ও শুক্লপক্ষ';
  let moonIcon = '🌒';
  let isFullMoonAyyamEBeez = false;

  if (hijriDayNumber === 1 || hijriDayNumber === 30 || hijriDayNumber === 29) {
    moonPhaseNameBn = 'নতুন চাঁদ (হিলাল / Crescent Moon)';
    moonIcon = '🌙';
  } else if (hijriDayNumber >= 12 && hijriDayNumber <= 16) {
    moonPhaseNameBn = 'পূর্ণ চাঁদ (Full Moon - আইয়ামে বীজ)';
    moonIcon = '🌕';
    isFullMoonAyyamEBeez = true;
  } else if (hijriDayNumber < 12) {
    moonPhaseNameBn = `ক্রমবর্ধমান চাঁদ (চাঁদের বয়স: ${toBengaliDigits(hijriDayNumber)} দিন)`;
    moonIcon = '🌓';
  } else {
    moonPhaseNameBn = `ক্ষীয়মাণ চাঁদ (চাঁদের বয়স: ${toBengaliDigits(hijriDayNumber)} দিন)`;
    moonIcon = '🌔';
  }

  // Recommended Surah for this day
  const isFriday = info.isFriday;
  const recommendedSurah = isFriday
    ? {
        nameBn: 'সূরা আল-কাহাফ',
        surahKey: 'surah_al_kahf',
        ayahCountBn: '১১০টি আয়াত',
        whyAllahCommanded: 'দাজ্জালের ফিতনা থেকে মুক্তির মহাকবচ এবং এক জুমা থেকে অপর জুমা পর্যন্ত আলোর বিচ্ছুরণ।',
        howToRecite: 'শুক্রবার সূর্য ডোবার পূর্বে সম্পূর্ণ সূরা অথবা অন্তত প্রথম ও শেষ ১০ আয়াত পাঠ করা।',
        targetGoalBn: '১ পূর্ণ খতম অথবা ১০ আয়াত'
      }
    : hijriDayNumber === 1 || hijriDayNumber === 15
    ? {
        nameBn: 'সূরা আল-বাকারা ও সূরা মুলক',
        surahKey: 'surah_al_mulk',
        ayahCountBn: '৩০টি আয়াত ও ২৮৬ আয়াত',
        whyAllahCommanded: 'শয়তানের অনিষ্ট দূরীকরণ, কবরের আযাব থেকে নিষ্কৃতি এবং গৃহের বরকত বৃদ্ধি।',
        howToRecite: 'প্রতি রাতে ঘুমানোর পূর্বে একাগ্রচিত্তে অর্থসহ তিলাওয়াত।',
        targetGoalBn: 'দৈনিক ৩০ আয়াত'
      }
    : {
        nameBn: 'সূরা আল-মুলক ও সূরা আল-ফাতিহা',
        surahKey: 'surah_al_mulk',
        ayahCountBn: '৭ আয়াত ও ৩০ আয়াত',
        whyAllahCommanded: 'রবের সাথে সরাসরি সংযোগ ও কবরের প্রশ্নোত্তর সহজ করার সুসংবাদ।',
        howToRecite: 'ফরজ নামাজের পর এবং ঘুমানোর পূর্বে নিয়মিত তিলাওয়াত।',
        targetGoalBn: '১০টি আয়াত তিলাওয়াত'
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border-2 border-amber-400 text-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Decorative Glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Sleek Slim Sticky Header Bar (Only ~48px - never blocks content) */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-emerald-800/80 bg-black/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0">{moonIcon}</span>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-amber-300 truncate">
                তারিখের পূর্ণাঙ্গ ইসলামিক জ্ঞান ও বিবরণ
              </h3>
              <p className="text-[10px] text-emerald-300/90 truncate hidden sm:block">
                {info.gregorianDateStr} • হিজরি ও বাংলা সন সংযোগ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-rose-900 border border-white/20 hover:border-rose-400 text-gray-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition text-xs font-bold shrink-0 shadow"
            title="উইন্ডো বন্ধ করুন"
          >
            <X className="w-4 h-4" />
            <span>বন্ধ করুন</span>
          </button>
        </div>

        {/* Scrollable Content Container: Everything flows naturally, 100% readable on mobile */}
        <div className="p-3.5 sm:p-5 overflow-y-auto custom-scrollbar flex-1 relative z-10 space-y-4 text-xs sm:text-sm overscroll-contain touch-pan-y">
          
          {/* Header Card inside scrollable area (never sticks or covers screen) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-emerald-800/90 space-y-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {info.isSunnahFastingDay && (
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400 font-bold flex items-center gap-1">
                  🌿 সুন্নাত রোজা
                </span>
              )}
              {isFullMoonAyyamEBeez && (
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-200 border border-amber-400/60 font-bold animate-pulse">
                  🌕 শুভ্র পূর্ণ চাঁদ ও আইয়ামে বীজ
                </span>
              )}
              {isFriday && (
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                  🕌 পবিত্র জুমু'আ বার
                </span>
              )}
              {info.isGovtHoliday && (
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold">
                  🇧🇩 {info.govtHolidayTitle}
                </span>
              )}
            </div>

            <div className="text-base sm:text-xl font-black text-amber-200">
              {info.gregorianDateStr}
            </div>

            {/* Triple Calendar Strip + Lunar Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-amber-400/50 flex items-center justify-between">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <span>🌙</span>
                  <span>হিজরি তারিখ:</span>
                </span>
                <span className="font-semibold text-amber-100">{info.hijriDateStr}</span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-emerald-500/50 flex items-center justify-between">
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <span>🌾</span>
                  <span>বাংলা সন:</span>
                </span>
                <span className="font-semibold text-emerald-100">{info.bengaliDateStr}</span>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xl bg-black/50 border border-teal-500/50 flex items-center justify-between">
                <span className="text-teal-300 font-bold flex items-center gap-1">
                  <span>{moonIcon}</span>
                  <span>চাঁদের দশা:</span>
                </span>
                <span className="font-semibold text-teal-100 truncate">{moonPhaseNameBn}</span>
              </div>
            </div>

            {/* Triple Calendar 354/365 Days Cycle Progress */}
            <div className="pt-1">
              <TripleYearCycleProgressChart currentDate={targetDate} />
            </div>
          </div>

          {/* Motivational Banner inside scrollable area */}
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-900/50 to-teal-900/40 p-3 rounded-xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">
                "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ • اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" — হে আল্লাহ! একমাত্র আপনারই দাসত্ব করি এবং আপনারই সহজ সরল পথের সন্ধান চাই
              </span>
            </div>
            <InteractiveKeywordBadge keywordId="siratul_mustaqim" customLabel="সিরাতুল মুস্তাকিম" />
          </div>
          
          {/* Section 1: সালাত ও ইবাদতের সময়সূচি কানেকশন */}
          <div className="p-4 rounded-2xl bg-black/50 border border-emerald-700/80 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕌</span>
                <h4 className="text-xs sm:text-sm font-black text-amber-300">
                  আজকের সালাত ও ইবাদতের সময়সূচি ও করণীয় ওয়াক্ত
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <InteractiveKeywordBadge keywordId="tahajjud" customLabel="তাহাজ্জুদ" />
                <InteractiveKeywordBadge keywordId="taqwa" customLabel="তাকওয়া" />
              </div>
            </div>

            <p className="text-emerald-100/90 leading-relaxed text-xs">
              ৫ ওয়াক্ত ফরয সালাত জামাতের সাথে আদায় করা ঈমানের পরিচয়। আজ বিশেষত রাতের শেষ তৃতীয়াংশে <strong className="text-amber-300">তাহাজ্জুদ</strong> এবং সূর্যোদয়ের ২০ মিনিট পর <strong className="text-teal-300">ইশরাক ও চাশত</strong> সালাতের মাধ্যমে সারাদিনের বরকত নিশ্চিত করুন।
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800">
                <div className="text-[10px] text-emerald-300 font-bold">ফজর</div>
                <div className="text-xs font-mono font-black text-white">ভোর ৪:২৮</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800">
                <div className="text-[10px] text-emerald-300 font-bold">জোহর</div>
                <div className="text-xs font-mono font-black text-white">দুপুর ১২:০১</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800">
                <div className="text-[10px] text-emerald-300 font-bold">আসর</div>
                <div className="text-xs font-mono font-black text-white">বিকাল ৩:২৯</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800">
                <div className="text-[10px] text-emerald-300 font-bold">মাগরিব</div>
                <div className="text-xs font-mono font-black text-white">সন্ধ্যা ৬:০৩</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-800">
                <div className="text-[10px] text-emerald-300 font-bold">ইশা ও বিতর</div>
                <div className="text-xs font-mono font-black text-white">রাত ৭:১৮</div>
              </div>
            </div>
          </div>

          {/* Section 2: কুরআন তিলাওয়াত ও নির্দিষ্ট সূরার সংযোগ */}
          <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/70 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300">
                    আজকের কুরআন তিলাওয়াত ও সংযোগ: {recommendedSurah.nameBn}
                  </h4>
                  <span className="text-[10px] text-emerald-300 font-medium">
                    লক্ষ্যমাত্রা: {recommendedSurah.targetGoalBn} • ({recommendedSurah.ayahCountBn})
                  </span>
                </div>
              </div>
              <InteractiveKeywordBadge keywordId={recommendedSurah.surahKey} customLabel="সূরার হিকমত" />
            </div>

            {/* Why Allah Commanded & How to Recite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <span>💡</span>
                  <span>কেন আল্লাহ তিলাওয়াত করতে বলেছেন?</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  {recommendedSurah.whyAllahCommanded}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-1">
                <span className="font-bold text-teal-300 flex items-center gap-1">
                  <span>📜</span>
                  <span>কীভাবে ও কখন তিলাওয়াত করবেন?</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  {recommendedSurah.howToRecite}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-300">
                আজকের তিলাওয়াত সম্পন্ন করেছেন?
              </span>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateTab) onNavigateTab('quran');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <span>কুরআন সেকশনে তিলাওয়াত করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section 3: আজকের আমল কাউন্টার ও ১ বছরের পুণ্য সঞ্চয় ট্র্যাকার */}
          <div className="p-4 rounded-2xl bg-emerald-950/70 border-2 border-emerald-500/70 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📿</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300">
                    আজকের আমল কাউন্টার ও আরবি ১ বছরের পুণ্য সঞ্চয়
                  </h4>
                  <span className="text-[10px] text-emerald-200">
                    লাইভ কাউন্টারে ক্লিক করে আজকের আমল বাড়ান ও রেকর্ড রাখুন
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <InteractiveKeywordBadge keywordId="istighfar" customLabel="ইসতিগফার" />
                <InteractiveKeywordBadge keywordId="sadaqah" customLabel="সাদাকাহ" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              
              {/* Istighfar Counter */}
              <div className="p-3 rounded-xl bg-black/60 border border-emerald-700/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-200">ইসতিগফার</span>
                  <span className="text-[10px] text-gray-400 font-mono">লক্ষ্য: ১০০</span>
                </div>
                <div className="text-xl font-black text-center font-mono text-amber-300">
                  {toBengaliDigits(istighfarCount)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setIstighfarCount(Math.max(0, istighfarCount - 1))}
                    className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setIstighfarCount(istighfarCount + 10)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    +১০
                  </button>
                </div>
              </div>

              {/* Durood Counter */}
              <div className="p-3 rounded-xl bg-black/60 border border-emerald-700/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-200">দরূদ শরীফ</span>
                  <span className="text-[10px] text-gray-400 font-mono">লক্ষ্য: ১০০</span>
                </div>
                <div className="text-xl font-black text-center font-mono text-teal-300">
                  {toBengaliDigits(duroodCount)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setDuroodCount(Math.max(0, duroodCount - 1))}
                    className="w-7 h-7 rounded-lg bg-teal-900 hover:bg-teal-800 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setDuroodCount(duroodCount + 10)}
                    className="px-2.5 py-1 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    +১০
                  </button>
                </div>
              </div>

              {/* Quran Ayah Counter */}
              <div className="p-3 rounded-xl bg-black/60 border border-emerald-700/80 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-200">কুরআন তিলাওয়াত</span>
                  <span className="text-[10px] text-gray-400 font-mono">লক্ষ্য: ১০ আয়াত</span>
                </div>
                <div className="text-xl font-black text-center font-mono text-amber-300">
                  {toBengaliDigits(quranAyahRead)} আয়াত
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setQuranAyahRead(Math.max(0, quranAyahRead - 1))}
                    className="w-7 h-7 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setQuranAyahRead(quranAyahRead + 5)}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    +৫
                  </button>
                </div>
              </div>

              {/* Sadaqah Checkbox */}
              <div
                onClick={() => setIsSadaqahDone(!isSadaqahDone)}
                className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                  isSadaqahDone
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                    : 'bg-black/60 border-emerald-700/80 text-gray-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">আজকের সাদাকাহ</span>
                  <CheckCircle2 className={`w-4 h-4 ${isSadaqahDone ? 'text-amber-400' : 'text-gray-500'}`} />
                </div>
                <div className="text-xs font-medium text-center py-2">
                  {isSadaqahDone ? 'আলহামদুলিল্লাহ সম্পন্ন হয়েছে!' : 'কিছু দান বা ভালো কাজ করুন'}
                </div>
                <div className="text-[10px] text-center text-amber-300 font-bold">
                  {isSadaqahDone ? '✓ রেকর্ড সংরক্ষিত' : 'ক্লিক করে টিক দিন'}
                </div>
              </div>

            </div>

          </div>

          {/* Continuous Amals & Prohibitions Section (সাপ্তাহিক, বিশেষ দিন ও দৈনিক নির্দিষ্ট ক্ষণের আমল এবং ৩টি নিষিদ্ধ সময় ও স্বভাবগত পাপ) */}
          <ContinuousAmalsAndProhibitionsSection />

          {/* Section 4: জ্ঞান অন্বেষণ - মুসলিম হিসেবে যা জানা প্রয়োজন */}
          <div className="p-4 rounded-2xl bg-black/50 border border-emerald-700/80 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h4 className="text-xs sm:text-sm font-black text-amber-300">
                  জ্ঞান অন্বেষণ: {info.dailyKnowledgeForMuslim.title}
                </h4>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold shadow-sm">
                {info.dailyKnowledgeForMuslim.category}
              </span>
            </div>

            {/* Core Message & Practical Action Highlight */}
            <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-700/60 space-y-1.5 text-xs">
              <div className="text-emerald-100 font-medium leading-relaxed">
                {info.dailyKnowledgeForMuslim.essentialLesson}
              </div>
              <div className="text-amber-200 font-semibold border-t border-emerald-800/60 pt-1.5 leading-relaxed">
                <strong>ব্যবহারিক আমল ও করণীয়:</strong> {info.dailyKnowledgeForMuslim.practicalAction}
              </div>
            </div>

            {/* 4 Pillars Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-900 flex items-center justify-center text-[10px] font-bold">১</span>
                  <span>বিষয়টি কী? (What it is)</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  {info.dailyKnowledgeForMuslim.essentialLesson}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-900 flex items-center justify-center text-[10px] font-bold">২</span>
                  <span>কেন আল্লাহ করতে বলেছেন? (Wisdom)</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  আল্লাহ তাআলা চান মানুষ যেন দুনিয়ার মোহে নিজের আসল পরিচয় না হারিয়ে ফেলে। তাকওয়া, তাওহীদ ও আত্মশুদ্ধির মাধ্যমেই অন্তরে আল্লাহর সন্তুষ্টি ও আখেরাতের মুক্তি অর্জিত হয়।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-1">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-teal-950 flex items-center justify-center text-[10px] font-bold">৩</span>
                  <span>কীভাবে আমল করবেন? (Sunnah Practice)</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  {info.dailyKnowledgeForMuslim.practicalAction}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-1">
                <span className="font-bold text-yellow-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-yellow-950 flex items-center justify-center text-[10px] font-bold">৪</span>
                  <span>প্রতিদান ও সুফল (Rewards)</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed">
                  দুনিয়াতে আত্মিক প্রশান্তি, পেরেশানি থেকে মুক্তি এবং আখেরাতে জান্নাতুল ফিরদাউসের চিরস্থায়ী নেয়ামত।
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: কুরআনের নির্দেশনা ও আয়াত */}
          {info.quranReference && (
            <div className="p-4 rounded-2xl bg-black/50 border border-teal-600/70 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-teal-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h4 className="text-xs sm:text-sm font-black text-teal-300">
                    কুরআনের নির্দেশনা ও আয়াত ({info.quranReference.surahName}: {toBengaliDigits(info.quranReference.ayahNumber)})
                  </h4>
                </div>
                <InteractiveKeywordBadge keywordId="taqwa" customLabel="কুরআনী হেদায়াত" />
              </div>

              {info.quranReference.verseAr && (
                <div className="text-right font-serif text-base sm:text-lg text-amber-200 leading-loose py-1" dir="rtl">
                  {info.quranReference.verseAr}
                </div>
              )}

              <p className="text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed italic bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/50">
                "{info.quranReference.verseBn}"
              </p>

              <div className="text-emerald-200/90 text-xs bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                <strong className="text-amber-300">তাফসীর ও শিক্ষা: </strong>
                {info.quranReference.explanationBn}
              </div>
            </div>
          )}

          {/* Section 6: সহীহ হাদিসের দলিল */}
          {info.hadithReference && (
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/70 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-amber-800/80 pb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <h4 className="text-xs sm:text-sm font-black text-amber-300">
                    সহীহ হাদিসের দলিল ({info.hadithReference.bookBn}: {toBengaliDigits(info.hadithReference.hadithNo)})
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold">
                  {info.hadithReference.authenticityGrade}
                </span>
              </div>

              <div className="text-amber-200/90 text-xs font-semibold">
                {info.hadithReference.narratorBn} থেকে বর্ণিত, রাসূলুল্লাহ ﷺ বলেছেন:
              </div>

              <div className="text-emerald-100 text-xs sm:text-sm leading-relaxed bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 font-medium">
                {info.hadithReference.textBn}
              </div>
            </div>
          )}

          {/* Section 7: আজকের পালনীয় বিশেষ সুন্নাত ও নেক আমলসমূহ */}
          {info.recommendedAmals && info.recommendedAmals.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/80 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 border-b border-emerald-800/80 pb-2">
                <span className="text-xl">✅</span>
                <h4 className="text-xs sm:text-sm font-black text-amber-300">
                  আজকের পালনীয় বিশেষ সুন্নাত ও নেক আমলসমূহ:
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {info.recommendedAmals.map((amal, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-emerald-800/60 text-emerald-100 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{amal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 8: নবী-রাসূল ও সাহাবায়ে কেরামের ঐতিহাসিক পটভূমি */}
          {info.propheticMilestone && (
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-600/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-300 font-bold border-b border-emerald-800/80 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>নবী ও রাসূলগণের সিরাত: {info.propheticMilestone.prophetName} — {info.propheticMilestone.eventTitle}</span>
                </span>
              </div>
              <p className="text-emerald-100/90 leading-relaxed">
                {info.propheticMilestone.historicalDetail}
              </p>
              <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700 text-amber-200">
                <strong>শিক্ষা ও গভীর তাৎপর্য: </strong> {info.propheticMilestone.lessonBn}
              </div>
            </div>
          )}

          {/* Section 9: আজকের মাসনূন দোয়া ও তাসবিহে শুরু/বন্ধ করার অপশন */}
          {info.masnoonDua && (
            <div className="p-4 rounded-2xl bg-amber-400/10 border-2 border-amber-400/50 space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-300 flex-wrap gap-1">
                <span className="text-sm">🤲 {info.masnoonDua.titleBn}</span>
                <span className="text-[10px] text-amber-200/90 bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/30">
                  {info.masnoonDua.sourceBn}
                </span>
              </div>

              <div className="text-right font-serif text-base sm:text-lg text-amber-100 leading-relaxed py-1" dir="rtl">
                {info.masnoonDua.arabicText}
              </div>

              <p className="text-amber-200/90 text-xs italic bg-black/30 p-2 rounded-lg">
                উচ্চারণ: {info.masnoonDua.transliterationBn}
              </p>

              <p className="text-emerald-100 text-xs leading-relaxed bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800/40">
                অর্থ: {info.masnoonDua.meaningBn}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => {
                    launchDhikrInTasbih({
                      titleBn: info.masnoonDua!.titleBn,
                      arabicText: info.masnoonDua!.arabicText,
                      transliterationBn: info.masnoonDua!.transliterationBn,
                      translationBn: info.masnoonDua!.meaningBn,
                      targetCount: 33
                    });
                    onClose();
                    if (onNavigateTab) onNavigateTab('dhikr');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>তাসবিহ কাউন্টারে শুরু করুন</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer border border-emerald-700/60"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>বন্ধ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Bottom Guidance & Actions inside scrollable container */}
          <div className="p-3.5 sm:p-4 bg-black/60 rounded-2xl border border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-[11px] text-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>যে শব্দে জানতে চান, সেই ক্লিকযোগ্য ব্যাজে চাপ দিয়ে গভীর জ্ঞান অন্বেষণ করুন।</span>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-200 text-xs font-bold transition border border-emerald-700 cursor-pointer text-center"
            >
              উইন্ডো বন্ধ করুন
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
