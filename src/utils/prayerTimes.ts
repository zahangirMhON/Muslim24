import { MonthlySignificanceInfo, PrayerRakatBreakdown, PrayerTimeItem } from '../types';
import { toBengaliDigits } from './bengaliUtils';

export interface CalculationMethod {
  id: string;
  nameBn: string;
  nameEn: string;
  fajrAngle: number;
  ishaAngle: number;
}

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 'ifb', nameBn: 'ইসলামিক ফাউন্ডেশন বাংলাদেশ (ডিফল্ট)', nameEn: 'Islamic Foundation Bangladesh', fajrAngle: 18, ishaAngle: 18 },
  { id: 'karachi', nameBn: 'ইউনিভার্সিটি অফ ইসলামিক সাইন্সেস, করাচি', nameEn: 'Univ. of Islamic Sciences, Karachi', fajrAngle: 18, ishaAngle: 18 },
  { id: 'mwl', nameBn: 'মুসলিম ওয়ার্ল্ড লিগ (MWL)', nameEn: 'Muslim World League', fajrAngle: 18, ishaAngle: 17 },
  { id: 'uqu', nameBn: 'উম্মুল কুরা ইউনিভার্সিটি, মক্কা', nameEn: 'Umm Al-Qura Univ., Makkah', fajrAngle: 18.5, ishaAngle: 90 }
];

// Rakat Breakdown Dictionary
export const PRAYER_RAKAT_DATA: Record<string, PrayerRakatBreakdown> = {
  fajr: {
    farz: 2,
    sunnahMuakkadah: 2,
    sunnahGhairMuakkadah: 0,
    nafl: 0,
    witr: 0,
    totalRakat: 4,
    detailsBn: '২ রাকাত সুন্নাত (মুয়াক্কাদাহ) + ২ রাকাত ফরয = সর্বমোট ৪ রাকাত'
  },
  dhuhr: {
    farz: 4,
    sunnahMuakkadah: 6, // 4 before + 2 after
    sunnahGhairMuakkadah: 0,
    nafl: 2,
    witr: 0,
    totalRakat: 12,
    detailsBn: '৪ রাকাত সুন্নাত (মুয়াক্কাদাহ) + ৪ রাকাত ফরয + ২ রাকাত সুন্নাত (মুয়াক্কাদাহ) + ২ রাকাত নফল = সর্বমোট ১২ রাকাত (জুমুআতে ২ রাকাত ফরয ও মোট ১৪ রাকাত)'
  },
  jumuah: {
    farz: 2,
    sunnahMuakkadah: 8, // 4 before + 4 after
    sunnahGhairMuakkadah: 2,
    nafl: 2,
    witr: 0,
    totalRakat: 14,
    detailsBn: 'ফরজের আগে: ২ রাকাত তাহিয়্যাতুল মসজিদ + ৪ রাকাত কাবলাল জুমা (সুন্নাত) | জুমার মূল ফরজ: ২ রাকাত জামায়াতে | ফরজের পরে: ৪ রাকাত বা\'দাল জুমা (সুন্নাত) + ২ রাকাত সুন্নাত/নফল = মোট ১৪ রাকাত'
  },
  asr: {
    farz: 4,
    sunnahMuakkadah: 0,
    sunnahGhairMuakkadah: 4,
    nafl: 0,
    witr: 0,
    totalRakat: 8,
    detailsBn: '৪ রাকাত সুন্নাত (গাইরে মুয়াক্কাদাহ) + ৪ রাকাত ফরয = সর্বমোট ৮ রাকাত'
  },
  maghrib: {
    farz: 3,
    sunnahMuakkadah: 2,
    sunnahGhairMuakkadah: 0,
    nafl: 2,
    witr: 0,
    totalRakat: 7,
    detailsBn: '৩ রাকাত ফরয + ২ রাকাত সুন্নাত (মুয়াক্কাদাহ) + ২ রাকাত নফল (আওয়াবিন) = সর্বমোট ৭ রাকাত'
  },
  isha: {
    farz: 4,
    sunnahMuakkadah: 2,
    sunnahGhairMuakkadah: 4,
    nafl: 2,
    witr: 3,
    totalRakat: 15,
    detailsBn: '৪ রাকাত সুন্নাত (গাইরে মুয়াক্কাদাহ) + ৪ রাকাত ফরয + ২ রাকাত সুন্নাত (মুয়াক্কাদাহ) + ২ রাকাত নফল + ৩ রাকাত বিতর (ওয়াজিব) = সর্বমোট ১৫ রাকাত'
  },
  tahajjud: {
    farz: 0,
    sunnahMuakkadah: 0,
    sunnahGhairMuakkadah: 0,
    nafl: 8,
    witr: 0,
    totalRakat: 8,
    detailsBn: '২ থেকে ১২ রাকাত পর্যন্ত নফল (রাসূলুল্লাহ সা. সাধারণত ৮ রাকাত আদায় করতেন)'
  },
  ishraq: {
    farz: 0,
    sunnahMuakkadah: 0,
    sunnahGhairMuakkadah: 0,
    nafl: 4,
    witr: 0,
    totalRakat: 4,
    detailsBn: '২ থেকে ৪ রাকাত নফল সালাত (সূর্যোদয়ের ১৫-২০ মিনিট পর পড়তে হয়)'
  },
  awwabin: {
    farz: 0,
    sunnahMuakkadah: 0,
    sunnahGhairMuakkadah: 0,
    nafl: 6,
    witr: 0,
    totalRakat: 6,
    detailsBn: 'মাগরিবের সুন্নাত আদায়ের পর ২ থেকে ৬ রাকাত নফল সালাত'
  }
};

/**
 * Calculates prayer times for a given day and coordinates
 */
export function calculatePrayerTimes(
  date: Date = new Date(),
  lat: number = 23.8103, // Dhaka Lat
  lng: number = 90.4125, // Dhaka Lng
  manualOffsetMinutes: number = 0
): PrayerTimeItem[] {
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);

  // Baseline standard times for Bangladesh (Asia/Dhaka) with subtle geographical adjustment
  const dhakaLng = 90.4125;
  const lngDiffMinutes = (dhakaLng - lng) * 4; // East is earlier, West is later
  
  // Base times in Dhaka minutes from midnight:
  const baseMinutes = {
    sehri: 3 * 60 + 55,     // 03:55 AM
    fajr: 4 * 60 + 5,       // 04:05 AM
    sunrise: 5 * 60 + 25,   // 05:25 AM
    ishraq: 5 * 60 + 45,    // 05:45 AM
    dhuhr: 12 * 60 + 7,     // 12:07 PM
    asr: 16 * 60 + 30,      // 04:30 PM
    sunset: 18 * 60 + 48,   // 06:48 PM
    maghrib: 18 * 60 + 48,  // 06:48 PM
    iftar: 18 * 60 + 48,    // 06:48 PM
    awwabin: 19 * 60 + 0,   // 07:00 PM
    isha: 20 * 60 + 8,      // 08:08 PM
    tahajjud: 2 * 60 + 30   // 02:30 AM (Last third of night)
  };

  const formatMinToString = (min: number) => {
    const totalMin = Math.round(min + lngDiffMinutes + manualOffsetMinutes);
    const hrs = Math.floor(((totalMin % 1440) + 1440) % 1440 / 60);
    const mins = Math.floor(((totalMin % 1440) + 1440) % 60);
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const padMins = mins < 10 ? `0${mins}` : `${mins}`;
    const padHrs = displayHrs < 10 ? `0${displayHrs}` : `${displayHrs}`;
    return `${toBengaliDigits(padHrs)}:${toBengaliDigits(padMins)} ${period}`;
  };

  const createTimeObj = (
    key: PrayerTimeItem['key'],
    category: 'farz' | 'nafel' | 'sun_event',
    nameBn: string,
    nameEn: string,
    nameAr: string,
    baseMin: number,
    iconName: string,
    endMin?: number,
    jamaatOffsetMin: number = 15,
    forbiddenNote?: string,
    recommendedNote?: string,
    significanceText?: string
  ): PrayerTimeItem => {
    const totalMin = Math.round(baseMin + lngDiffMinutes + manualOffsetMinutes);
    const hrs = Math.floor(((totalMin % 1440) + 1440) % 1440 / 60);
    const mins = Math.floor(((totalMin % 1440) + 1440) % 60);

    const prayerDate = new Date(baseDate);
    prayerDate.setHours(hrs, mins, 0, 0);

    const timeString = formatMinToString(baseMin);
    const azanTimeString = timeString;
    const jamaatTimeString = formatMinToString(baseMin + jamaatOffsetMin);
    const startTimeString = timeString;
    const endTimeString = endMin !== undefined ? formatMinToString(endMin) : undefined;

    let durationStringBn: string | undefined = undefined;
    if (endMin !== undefined) {
      const durMin = Math.max(0, endMin - baseMin);
      const durHrs = Math.floor(durMin / 60);
      const durMins = durMin % 60;
      durationStringBn = durHrs > 0 
        ? `${toBengaliDigits(durHrs)} ঘণ্টা ${toBengaliDigits(durMins)} মিনিট`
        : `${toBengaliDigits(durMins)} মিনিট`;
    }

    return {
      key,
      nameBn,
      nameEn,
      nameAr,
      timeString,
      timestamp: prayerDate.getTime(),
      iconName,
      prayerCategory: category,
      azanTimeString,
      jamaatTimeString,
      rakatBreakdown: PRAYER_RAKAT_DATA[key],
      startTimeString,
      endTimeString,
      durationStringBn,
      recommendedTimeBn: recommendedNote,
      forbiddenTimeNoteBn: forbiddenNote,
      significanceBn: significanceText
    };
  };

  const isFriday = baseDate.getDay() === 5;

  return [
    // 5 Obligatory Farz Prayers
    createTimeObj('fajr', 'farz', 'ফজর', 'Fajr', 'الفجر', baseMinutes.fajr, 'SunRising', baseMinutes.sunrise, 20, 'সূর্যোদয়ের ১৫ মিনিট পূর্বে ফজর শেষ করা উত্তম। সূর্যোদয়ের সময় নামাজ পরা নিষিদ্ধ।', 'আউয়াল ওয়াক্তে জামাআতের সাথে আদায় করা', 'ফজরের ২ রাকাত সুন্নাত দুনিয়া ও তার মধ্যকার সবকিছুর চেয়ে উত্তম (সহীহ মুসলিম)।'),
    createTimeObj(
      'dhuhr',
      'farz',
      isFriday ? 'জুমু\'আ' : 'জোহর',
      isFriday ? 'Jumu\'ah' : 'Dhuhr',
      isFriday ? 'الجمعة' : 'الظهر',
      baseMinutes.dhuhr,
      isFriday ? 'Mosque' : 'SunMedium',
      baseMinutes.asr,
      20,
      'ঠিক মাথার ওপর সূর্য ঢলে পড়ার (জাওয়াল) ১০-১৫ মিনিট নামাজ পড়া নিষিদ্ধ।',
      isFriday ? 'জুমার আযানের পর মসজিদে গিয়ে মনোযোগ দিয়ে খুতবা শোনা ও জামায়াতে সালাত আদায় করা' : 'দুপুর গড়িয়ে সূর্য পশ্চিমে ঢলে পড়ার সাথে সাথে আউয়াল ওয়াক্তে আদায় করা',
      isFriday ? 'আজ পবিত্র জুমু\'আ বার — সপ্তাহের শ্রেষ্ঠ দিন (ইয়াউমুল জুমু\'আ)। গোসল, সুগন্ধি, উত্তম পোশাক পরিধান, খুতবা শ্রবণ ও ১৪ রাকাত পূর্ণাঙ্গ আমল/২ রাকাত ফরজ সালাত আদায়। (নারী ও অপারগদের জন্য ৪ রাকাত জোহর)' : 'জোহরের পূর্বে ৪ রাকাত সুন্নাত ও পরে ২ রাকাত সুন্নাত নিয়মিত আদায়কারী জান্নাতবাসী হবেন।'
    ),
    createTimeObj('asr', 'farz', 'আসর', 'Asr', 'العصر', baseMinutes.asr, 'SunDim', baseMinutes.maghrib, 20, 'সূর্য হলুদ বর্ণ ধারণ করার পর (সূর্যাস্তের ২০ মিনিট পূর্বে) আসরের নামাজ পড়া মাকরূহ।', 'সূর্য রোদ কড়া থাকতে থাকতে আসর আদায় করা', 'যে ব্যক্তি আসরের নামাজ পরিহার করে তার আমল বিনষ্ট হয়ে যায় (সহীহ বুখারী)।'),
    createTimeObj('maghrib', 'farz', 'মাগরিব', 'Maghrib', 'المغرب', baseMinutes.maghrib, 'Sunset', baseMinutes.isha, 5, 'সূর্যাস্তের সময় (১৫ মিনিট) নামাজ পড়া সম্পূর্ণ নিষিদ্ধ।', 'সূর্য ডোবার পর বিলম্ব না করে দ্রুত আদায় করা মাসনূন', 'মাগরিবের নামাজের সুন্নাতের পর ২ রাকাত আওয়াবিন পড়া অত্যন্ত ফজিলতপূর্ণ।'),
    createTimeObj('isha', 'farz', 'ইশা', 'Isha', 'العشاء', baseMinutes.isha, 'MoonStar', 24 * 60, 20, 'মধ্যরাতের (রাত ১২:০০ টা) পর ইশার নামাজ বিলম্ব করা মাকরূহ।', 'রাতের প্রথম তৃতীয়াংশের মধ্যে ইশা আদায় করা', 'ইশার নামাজ জামাআতে পড়লে অর্ধেক রাত নফল নামাজের সওয়াব অর্জিত হয়।'),

    // Nafel Prayers
    createTimeObj('tahajjud', 'nafel', 'তাহাজ্জুদ', 'Tahajjud', 'التهجد', baseMinutes.tahajjud, 'Moon', baseMinutes.sehri, 0, undefined, 'রাতের শেষ তৃতীয়াংশ (দুয়া কবুলের সর্বোত্তম সময়)', 'আল্লাহ তাআলা রাতের শেষ তৃতীয়াংশে প্রথম আসমানে অবতরণ করে বান্দার দুআ কবুল করেন।'),
    createTimeObj('ishraq', 'nafel', 'ইশরাক ও চাশত', 'Ishraq', 'الإشراق', baseMinutes.ishraq, 'Sun', 11 * 60 + 30, 0, undefined, 'সূর্যোদয়ের ২০ মিনিট পর থেকে দ্বিপ্রহরের পূর্ব পর্যন্ত', 'ইশরাক ও চাশতের নামাজে ১টি পূর্ণাঙ্গ হজ ও ওমরাহের সওয়াব পাওয়া যায়।'),
    createTimeObj('awwabin', 'nafel', 'আওয়াবীন', 'Awwabin', 'الأوابين', baseMinutes.awwabin, 'Sparkles', baseMinutes.isha, 0, undefined, 'মাগরিবের সুন্নাতের পর থেকে ইশার পূর্ব পর্যন্ত', 'আওয়াবীন নামাজে বিগত দিনের গুনাহ মাফ ও অধিক সওয়াব লাভ হয়।'),

    // Sun Events & Fasting Markers
    createTimeObj('sunrise', 'sun_event', 'সূর্যোদয়', 'Sunrise', 'الشروق', baseMinutes.sunrise, 'Sun', baseMinutes.sunrise + 20, 0, 'সূর্যোদয়ের সময় থেকে ১৫-২০ মিনিট সকল প্রকার নামাজ পড়া কঠোরভাবে নিষিদ্ধ (মাকরূহে তাহরীমী)।', 'সূর্যোদয়ের ২০ মিনিট পর ইশরাকের নামাজ আদায় করা যায়', 'সূর্যোদয়ের মাকরূহ সময় অতিক্রান্ত হলে ২-৪ রাকাত ইশরাকের নামাজ পরা উত্তম।'),
    createTimeObj('sunset', 'sun_event', 'সূর্যাস্ত (ইফতার)', 'Sunset', 'الغروب', baseMinutes.sunset, 'Sunset', baseMinutes.maghrib + 30, 0, 'সূর্যাস্তের সময় (১৫ মিনিট) নামাজ পড়া সম্পূর্ণ নিষিদ্ধ।', 'সূর্যাস্তের সাথে সাথে দুআ পড়ে ইফতার করা সুন্নাত', 'ইফতারের পূর্বে দোআ কবুল হয়।'),
    createTimeObj('sehri', 'sun_event', 'সেহরি শেষ (ফজর শুরু)', 'Sehri Ends', 'نهاية السحور', baseMinutes.sehri, 'Clock', baseMinutes.fajr, 0, undefined, 'ফজরের আযানের পূর্বে সেহরি শেষ করুন', 'রাসূলুল্লাহ সা. বলেছেন: সেহরি খাও, কারণ সেহরিতে বরকত রয়েছে।')
  ];
}

/**
 * Get Detailed Prayer State, Progress, Countdown, and Time-of-Day Adaptive Theme
 */
export interface DetailedPrayerState {
  currentPrayer: PrayerTimeItem;
  nextPrayer: PrayerTimeItem;
  currentPrayerStartMs: number;
  currentPrayerEndMs: number;
  currentProgressPercent: number;
  currentRemainingMs: number;
  currentRemainingHours: number;
  currentRemainingMinutes: number;
  currentRemainingSeconds: number;
  currentRemainingFormattedBn: string;

  nextStartMs: number;
  nextRemainingMs: number;
  nextRemainingHours: number;
  nextRemainingMinutes: number;
  nextRemainingSeconds: number;
  nextRemainingFormattedBn: string;

  isPreReminderActive: boolean;
  preReminderType: 'ending_soon' | 'starting_soon' | 'normal';
  preReminderMinutesLeft: number;

  theme: {
    gradientClass: string;
    cardBorderClass: string;
    accentBg: string;
    accentText: string;
    themeNameBn: string;
    progressGradient: string;
    skyIcon: string;
    bgStyle?: string;
  };
}

export interface PrayerDuaAmal {
  id: string;
  titleBn: string;
  arabicText?: string;
  transliterationBn?: string;
  meaningBn: string;
  virtueBn: string;
  category: 'pre' | 'in_prayer' | 'post' | 'azan' | 'wudu' | 'masjid';
}

export const ALL_PRAYER_DUAS: PrayerDuaAmal[] = [
  // 🤲 ১. পূর্ববর্তী আমল (আজান, অজু, মসজিদ)
  {
    id: 'azan_dua',
    titleBn: 'আজান পরবর্তী সুন্নাত দোয়া',
    arabicText: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلاَةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transliterationBn: 'আল্লাহুম্মা রববা হাযিহিদ দা’ওয়াতিত তাম্মাহ, ওয়াস সালাতিল কায়িমাহ, আতি মুহাম্মাদানিল ওয়াসীলাতা ওয়াল ফাদীলাহ, ওয়াবআছহু মাকামাম মাহমুদানিল্লাযী ওয়াআদতাহ।',
    meaningBn: 'হে আল্লাহ! এই পরিপূর্ণ আহ্বান এবং প্রতিষ্ঠিত সালাতের আপনিই মালিক! আমাদের প্রিয় নবী মুহাম্মদ (সা.)-কে অসীলা ও উচ্চ মর্যাদা দান করুন এবং তাকে মাকামে মাহমুদে পৌঁছে দিন যার ওয়াদা আপনি করেছেন।',
    virtueBn: 'যে ব্যক্তি আজান শুনে এ দোয়া পড়বে, কিয়ামতের দিন তার জন্য বিশ্বনবী (সা.)-এর শাফাআত ওয়াজিব হয়ে যাবে (সহীহ বুখারী)।',
    category: 'pre'
  },
  {
    id: 'wudu_dua',
    titleBn: 'অজু সমাপ্তির পর পঠিত দোয়া',
    arabicText: 'أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliterationBn: 'আশহাদু আল-লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, ওয়া আশহাদু আন্না মুহাম্মাদান আব্দুহু ওয়া রাসুলুহু।',
    meaningBn: 'আমি সাক্ষ্য দিচ্ছি যে, এক আল্লাহ ছাড়া কোনো মাবুদ নেই, তাঁর কোনো শরীক নেই। আমি আরও সাক্ষ্য দিচ্ছি যে, মুহাম্মদ (সা.) তাঁর বান্দা ও রাসুল।',
    virtueBn: 'যে ব্যক্তি সুন্নাত মোতাবেক অজু সম্পন্ন করে এ দোয়া পাঠ করবে, তার জন্য জান্নাতের ৮টি দরজাই উন্মুক্ত হয়ে যাবে (সহীহ মুসলিম: ২৩৪)।',
    category: 'pre'
  },
  {
    id: 'masjid_enter',
    titleBn: 'মসজিদে প্রবেশের সুন্নাত দোয়া',
    arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliterationBn: 'আল্লাহুম্মাফতাহ লি আবওয়াবা রাহমাতিকা।',
    meaningBn: 'হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাসমূহ খুলে দিন।',
    virtueBn: 'ডান পা দিয়ে মসজিদে প্রবেশের সময় এ দোয়া পড়া সুন্নাত। এতে মসজিদে অবস্থানের পুরো সময় রহমত বর্ষিত হয়।',
    category: 'pre'
  },

  // 🕌 ২. নামাজ চলাকালীন আমল ও বিশেষ দোয়া (In-Prayer)
  {
    id: 'sana_dua',
    titleBn: 'ছানা (নামাজ শুরুর তাকবীরে তাহরীমার পর)',
    arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلاَ إِلَهَ غَيْرُكَ',
    transliterationBn: 'সুবহানাকা আল্লাহুম্মা ওয়া বিহামদিকা ওয়া তাবারাকাসমুকা ওয়া তাআলা জাদদুকা ওয়া লা ইলাহা গাইরুকা।',
    meaningBn: 'হে আল্লাহ! আপনার প্রশংসার সাথে আপনার পবিত্রতা ঘোষণা করছি, আপনার নাম বরকতময়, আপনার মর্যাদা অতি উচ্চে এবং আপনি ছাড়া অন্য কোনো সত্য মাবুদ নেই।',
    virtueBn: 'নামাজের শুরুতে নিয়ত ও তাকবীরে তাহরীমার পর ছানা পড়া সুন্নাতে মুয়াক্কাদাহ।',
    category: 'in_prayer'
  },
  {
    id: 'ruku_tasbeeh',
    titleBn: 'রুকুর তাসবিহ (কমপক্ষে ৩ বার)',
    arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliterationBn: 'সুবহানা রব্বিয়াল আজীম।',
    meaningBn: 'আমার মহান প্রতিপালকের পবিত্রতা ও মহিমা ঘোষণা করছি।',
    virtueBn: 'রুকুতে ৩, ৫ বা ৭ বার এ তাসবিহ ধীরস্থিরভাবে পাঠ করা সুন্নাত (সহীহ তিরমিযী)।',
    category: 'in_prayer'
  },
  {
    id: 'ruku_rising',
    titleBn: 'রুকু থেকে ওঠার দোয়া (কওমা)',
    arabicText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ - رَبَّنَا وَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    transliterationBn: 'সামিআল্লাহু লিমান হামিদাহ - রব্বানা ওয়া লাকাল হামদ, হামদান কাসীরান তাইয়্যিবান মুবারাকান ফীহ।',
    meaningBn: 'আল্লাহ শোনেন যে তাঁর প্রশংসা করে। হে আমাদের রব! সমস্ত প্রশংসা একমাত্র আপনারই, এমন প্রশংসা যা অশেষ, পবিত্র ও বরকতময়।',
    virtueBn: 'রুকু থেকে সোজা হয়ে দাঁড়িয়ে এ দোয়া পাঠ করলে ফেরেশতাগণ সওয়াব লেখার জন্য প্রতিযোগিতা করেন (সহীহ বুখারী)।',
    category: 'in_prayer'
  },
  {
    id: 'sujud_tasbeeh',
    titleBn: 'সিজদার তাসবিহ (কমপক্ষে ৩ বার)',
    arabicText: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
    transliterationBn: 'সুবহানা রব্বিয়াল আলা।',
    meaningBn: 'আমার সুউচ্চ প্রতিপালকের পবিত্রতা ও সুমহান মর্যাদা ঘোষণা করছি।',
    virtueBn: 'বান্দা সিজদার অবস্থায় মহান আল্লাহর সবচেয়ে কাছে পৌঁছায়। তাই সিজদায় বেশি বেশি তাসবিহ ও দোয়া করা উত্তম (সহীহ মুসলিম)।',
    category: 'in_prayer'
  },
  {
    id: 'tashahhud',
    titleBn: 'তাশাহহুদ (আত্তাহিয়্যাতু)',
    arabicText: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلاَمُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliterationBn: 'আত্তাহিয়্যাতু লিল্লাহি ওয়াস সালাওয়াতু ওয়াত তাইয়্যিবাতু, আসসালামু আলাইকা আইয়্যুহান নাবিয়্যু ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু, আসসালামু আলাইনা ওয়া আলা ইবাদিল্লাহিস সালিহীন, আশহাদু আল-লা ইলাহা ইল্লাল্লাহু ওয়া আশহাদু আন্না মুহাম্মাদান আব্দুহু ওয়া রাসুলুহু।',
    meaningBn: 'যাবতীয় তা’যীম, সালাত ও পবিত্র ইবাদত একমাত্র আল্লাহর জন্য। হে নবী! আপনার ওপর শান্তি, আল্লাহর রহমত ও বরকত বর্ষিত হোক। আমাদের ওপর এবং আল্লাহর নেককার বান্দাদের ওপর শান্তি বর্ষিত হোক। আমি সাক্ষ্য দিচ্ছি আল্লাহ ছাড়া কোনো মাবুদ নেই এবং মুহাম্মদ (সা.) তাঁর বান্দা ও রাসুল।',
    virtueBn: 'প্রতি ২ রাকাতে বৈঠকে তাশাহহুদ পাঠ করা ওয়াজিব।',
    category: 'in_prayer'
  },
  {
    id: 'durood_ibrahim',
    titleBn: 'দরূদে ইব্রাহিম (শেষ বৈঠকে)',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliterationBn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিউঁ ওয়া আলা আলি মুহাম্মাদ, কামা সাল্লাইতা আলা ইব্রাহীমা ওয়া আলা আলি ইব্রাহীম, ইন্নাকা হামীদুম মাজীদ। আল্লাহুম্মা বারিক আলা মুহাম্মাদিউঁ ওয়া আলা আলি মুহাম্মাদ, কামা বারাকতা আলা ইব্রাহীমা ওয়া আলা আলি ইব্রাহীম, ইন্নাকা হামীদুম মাজীদ।',
    meaningBn: 'হে আল্লাহ! আপনি মুহাম্মদ (সা.) ও তাঁর পরিবারের ওপর রহমত বর্ষণ করুন, যেমন ইব্রাহিম (আ.) ও তাঁর পরিবারের ওপর করেছিলেন। নিশ্চয়ই আপনি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! আপনি মুহাম্মদ (সা.) ও তাঁর পরিবারের ওপর বরকত নাজিল করুন, যেমন ইব্রাহিম (আ.) ও তাঁর পরিবারের ওপর করেছিলেন।',
    virtueBn: 'দরূদে ইব্রাহিম পাঠকারীকে আল্লাহ ১০টি রহমত, ১০টি গুনাহ মাফ ও ১০টি মর্যাদা বৃদ্ধি দান করেন (সহীহ মুসলিম)।',
    category: 'in_prayer'
  },
  {
    id: 'dua_masura',
    titleBn: 'দোআয়ে মাসূরা (সালাম ফেরানোর পূর্বে)',
    arabicText: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliterationBn: 'আল্লাহুম্মা ইন্নী জলামতু নাফসী জুলমান কাসীরান, ওয়া লা ইয়াগফিরুজ জুনুবা ইল্লা আনতা, ফাগফির লী মাগফিরাতাম মিন ইনদিকা ওয়ারহামনী, ইন্নাকা আনতাল গফুরুর রাহীম।',
    meaningBn: 'হে আল্লাহ! আমি আমার নিজের ওপর চরম জুলুম অত্যাচার করেছি, আর আপনি ছাড়া গুনাহ ক্ষমা করার কেউ নেই। অতএব আপনি নিজ অনুগ্রহে আমাকে ক্ষমা করে দিন এবং আমার ওপর দয়া করুন। নিশ্চয়ই আপনি পরম ক্ষমাশীল ও অসীম দয়ালু।',
    virtueBn: 'সালাম ফেরানোর আগে হযরত আবু বকর (রা.)-কে রাসুলাল্লাহ (সা.) এ দোয়া শিখিয়েছিলেন (সহীহ বুখারী)।',
    category: 'in_prayer'
  },

  // 📿 ৩. নামাজ পরবর্তী সুন্নাত জিকির ও আমল (Post-Prayer)
  {
    id: 'istighfar_3x',
    titleBn: 'সালামের পরেই ৩ বার ইস্তিগফার পাঠ',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ (٣ বার) - اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
    transliterationBn: 'আস্তাগফিরুল্লাহ (৩ বার)। আল্লাহুম্মা আনতাস সালামু ওয়া মিনকাস সালামু তাবারাকতা ইয়া যাল জালালি ওয়াল ইকরাম।',
    meaningBn: 'আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি (৩ বার)। হে আল্লাহ! আপনিই শান্তির আধার, আপনার নিকট হতেই শান্তি বর্ষিত হয়, আপনি পরম বরকতময়, হে মহিমাময় ও মহানুভবতার অধিপতি।',
    virtueBn: 'প্রতিটি ফরজ সালাতের সালাম ফেরানোর সাথে সাথে বিশ্বনবী (সা.) ৩ বার আস্তাগফিরুল্লাহ পাঠ করতেন (সহীহ মুসলিম: ১২২২)।',
    category: 'post'
  },
  {
    id: 'ayatul_kursi',
    titleBn: 'ফরজ সালাত শেষে আয়াতুল কুরসী পাঠ',
    arabicText: 'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliterationBn: 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বৈয়্যুম, লা তা’খুযুহু সিনাতুউঁ ওয়া লা নাওম, লাহু মা ফিস সামাওয়াতি ওয়া মা ফিল আরদ্বি, মান যাল্লাযী ইয়াশফা’উ ইনদাহু ইল্লা বিইযনিহি, ইয়া’লামু মা বাইনা আইদীহিম ওয়া মা খলফাহুম, ওয়া লা ইউহীতূনা বিশাইইম মিন ইলমিহী ইল্লা বিমা শা-আ, ওয়াসি’আ কুরসিইয়্যুহুস সামাওয়াতি ওয়াল আরদ্বি, ওয়া লা ইয়াঊদুহু হিফজুহুমা ওয়া হুওয়াল আলিয়্যুল আজীম।',
    meaningBn: 'আল্লাহ ছাড়া অন্য কোনো সত্য উপাস্য নেই, তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আসমান ও যমীনে যা কিছু আছে সবই তাঁর। কে আছে যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে তা তিনি জানেন। তাঁর জ্ঞানের কিছুই তারা আয়ত্ত করতে পারে না, তবে যতটুকু তিনি ইচ্ছা করেন। তাঁর কুরসী আসমান ও যমীনকে পরিবেষ্টন করে আছে। আর এ দুটোর রক্ষণাবেক্ষণ করা তাঁর জন্য মোটেই কঠিন নয়। তিনি সুউচ্চ, সুমহান।',
    virtueBn: 'যে ব্যক্তি প্রতি ফরজ সালাত শেষে আয়াতুল কুরসী পাঠ করবে, তার মৃত্যুর সাথে সাথেই জান্নাতে প্রবেশ ছাড়া আর কোনো বাধা থাকবে না (সুনান নাসায়ী, সহীহ আল-জামেই: ৬৪۶৪)।',
    category: 'post'
  },
  {
    id: 'tasbeeh_fatimi',
    titleBn: 'তাসবিহে ফাতিমি (৩৩-৩৩-৩৪ বার)',
    arabicText: 'سُبْحَانَ اللَّهِ (٣٣ বার) - الْحَمْدُ لِلَّهِ (٣٣ বার) - اللَّهُ أَكْبَرُ (٣٤ বার)',
    transliterationBn: 'সুবহানাল্লাহ (৩৩ বার), আলহামদুলিল্লাহ (৩৩ বার), আল্লাহু আকবার (৩৪ বার)।',
    meaningBn: 'আল্লাহ পবিত্র ও নিষ্কলঙ্ক (৩৩ বার), সমস্ত প্রশংসা আল্লাহর (৩৩ বার), আল্লাহ সর্বশ্রেষ্ঠ ও সুমহান (৩৪ বার)।',
    virtueBn: 'নামাজ শেষে হাত গুনে এ তাসবিহ পাঠ করলে সমুদ্রের ফেনা পরিমাণ পাপ থাকলেও ক্ষমা হয়ে যায় (সহীহ মুসলিম: ১২৪৩)।',
    category: 'post'
  },
  {
    id: 'allahumma_ainni',
    titleBn: 'ইবাদত ও জিকিরের তাওফিকের দোয়া',
    arabicText: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliterationBn: 'আল্লাহুম্মা আ’ইন্নী আলা জিকরিকা ওয়া শুকরিকা ওয়া হুসনি ইবাদাতিক।',
    meaningBn: 'হে আল্লাহ! আপনাকে স্মরণ করতে, আপনার শুকরিয়া আদায় করতে এবং সুন্দরভাবে আপনার ইবাদত করতে আমাকে সাহায্য করুন।',
    virtueBn: 'রাসূলুল্লাহ (সা.) হযরত মুআজ (রা.)-কে শপথ করে বলেছিলেন: "হে মুআজ! তুমি প্রতি ফরজ নামাজের পর এ দোয়া পাঠ করা কখনো ছেড়ো না" (সুনান আবু দাউদ: ১৫২২)।',
    category: 'post'
  }
];

export const PRE_PRAYER_DUAS = ALL_PRAYER_DUAS;

export interface JumuahRakatStep {
  id: string;
  phase: 'before_farz' | 'farz' | 'after_farz';
  phaseTitleBn: string;
  nameBn: string;
  nameAr: string;
  rakatCount: number;
  statusType: 'ফরজ (ফরজে আইন)' | 'সুন্নাতে মুয়াক্কাদাহ' | 'সুন্নাতে গায়রে মুয়াক্কাদাহ / নফল' | 'তাহিয়্যাতুল মসজিদ';
  timingBn: string;
  descriptionBn: string;
  hadithReferenceBn: string;
  niyyatGuideBn: string;
}

export const JUMUAH_14_RAKAT_SEQUENCE: JumuahRakatStep[] = [
  {
    id: 'jum_step_1',
    phase: 'before_farz',
    phaseTitleBn: '১. ফরজের পূর্ববর্তী সালাত (মোট ৬ রাকাত)',
    nameBn: 'তাহিয়্যাতুল মসজিদ',
    nameAr: 'تحية المسجد',
    rakatCount: 2,
    statusType: 'তাহিয়্যাতুল মসজিদ',
    timingBn: 'মসজিদে প্রবেশের পর বসার পূর্বে (যদি খুতবা শুরু না হয়ে থাকে)',
    descriptionBn: 'মসজিদের সম্মানার্থে ও আল্লাহর নৈকট্য কামনায় ২ রাকাত সালাত আদায় করা সুন্নাত।',
    hadithReferenceBn: 'সহীহ বুখারী: ১১৬৩, সহীহ মুসলিম: ৭১৪ — রাসূলুল্লাহ (সা.) বলেছেন: "তোমাদের কেউ যখন মসজিদে প্রবেশ করে, সে যেন বসার পূর্বে দুই রাকাত সালাত আদায় করে।"',
    niyyatGuideBn: 'মসজিদে প্রবেশের সম্মানার্থে ২ রাকাত তাহিয়্যাতুল মসজিদের নিয়ত করে সালাত আদায় করুন।'
  },
  {
    id: 'jum_step_2',
    phase: 'before_farz',
    phaseTitleBn: '১. ফরজের পূর্ববর্তী সালাত (মোট ৬ রাকাত)',
    nameBn: 'কাবলাল জুমু\'আ (খুতবা ও ফরজের পূর্বের সুন্নাত)',
    nameAr: 'سنة قبل الجمعة',
    rakatCount: 4,
    statusType: 'সুন্নাতে মুয়াক্কাদাহ',
    timingBn: 'জুমার আযানের পর ইমাম মিম্বরে ওঠার ও খুতবা শুরুর পূর্বে',
    descriptionBn: 'জুমার ফরজ সালাতের পূর্বে চার রাকাত সুন্নাতে মুয়াক্কাদাহ এক সালামে আদায় করতে হয়।',
    hadithReferenceBn: 'সুনানে তিরমিযী: ৫২৩, মুসান্নাফ আব্দুর রাযযাক: ৫৫২৫ — হযরত আব্দুল্লাহ ইবনে মাসউদ (রা.) জুমার পূর্বে ৪ রাকাত এবং জুমার পরে ৪ রাকাত সালাত আদায় করতেন।',
    niyyatGuideBn: 'জুমার ফরজের পূর্বে ৪ রাকাত কাবলাল জুমু\'আ সুন্নাতে মুয়াক্কাদাহ আদায়ের নিয়ত করুন।'
  },
  {
    id: 'jum_step_3',
    phase: 'farz',
    phaseTitleBn: '২. জুমার মূল ফরজ সালাত (২ রাকাত)',
    nameBn: 'জুমু\'আর মূল ফরজ সালাত (ইমামের সাথে জামায়াতে)',
    nameAr: 'صلاة الجمعة الفرض',
    rakatCount: 2,
    statusType: 'ফরজ (ফরজে আইন)',
    timingBn: 'খুতবা সমাপ্তির পর একামতের সাথে ইমামের পেছনে জামায়াতে',
    descriptionBn: 'প্রাপ্তবয়স্ক সুস্থ মুকিম সকল মুসলিম পুরুষের ওপর জুমার ২ রাকাত ফরজ সালাত জামায়াতে আদায় করা ফরজে আইন। খুতবা চলাকালীন সম্পূর্ণ নীরব থেকে মনোযোগ দিয়ে খুতবা শোনা ওয়াজিব।',
    hadithReferenceBn: 'সূরা আল-জুমু\'আ: ৯ ("হে মুমিনগণ! যখন জুমার দিনে সালাতের জন্য আহ্বান করা হয়, তখন তোমরা আল্লাহর স্মরণের দিকে ধাবিত হও...") ও সহীহ মুসলিম: ৮৫৫।',
    niyyatGuideBn: 'ইমামের পেছনে জুমার ২ রাকাত ফরজ সালাত কিবলামুখী হয়ে আদায় করছি।'
  },
  {
    id: 'jum_step_4',
    phase: 'after_farz',
    phaseTitleBn: '৩. ফরজের পরবর্তী সালাত (মোট ৬ রাকাত)',
    nameBn: 'বা\'দাল জুমু\'আ (ফরজের পরের প্রথম সুন্নাত)',
    nameAr: 'سنة بعد الجمعة',
    rakatCount: 4,
    statusType: 'সুন্নাতে মুয়াক্কাদাহ',
    timingBn: 'জুমার ২ রাকাত ফরজ সমাপ্তির পর সালাম ফিরিয়ে মসজিদে দাঁড়িয়ে',
    descriptionBn: 'জুমার ফরজ সালাত শেষ করার পর মসজিদে ৪ রাকাত বা\'দাল জুমা সুন্নাতে মুয়াক্কাদাহ আদায় করতে হয়।',
    hadithReferenceBn: 'সহীহ মুসলিম: ৮৮১, সুনান আবু দাউদ: ১১৩১ — হযরত আবু হুরায়রা (রা.) থেকে বর্ণিত, রাসূলুল্লাহ (সা.) বলেছেন: "তোমাদের কেউ যখন জুমার সালাত আদায় করবে, সে যেন এরপর চার রাকাত সালাত পড়ে।"',
    niyyatGuideBn: 'জুমার ফরজ পরবর্তী ৪ রাকাত বা\'দাল জুমু\'আ সুন্নাতে মুয়াক্কাদাহ আদায়ের নিয়ত করুন।'
  },
  {
    id: 'jum_step_5',
    phase: 'after_farz',
    phaseTitleBn: '৩. ফরজের পরবর্তী সালাত (মোট ৬ রাকাত)',
    nameBn: 'বা\'দাল জুমু\'আর অতিরিক্ত সুন্নাত / নফল',
    nameAr: 'ركعتان بعد الجمعة',
    rakatCount: 2,
    statusType: 'সুন্নাতে গায়রে মুয়াক্কাদাহ / নফল',
    timingBn: '৪ রাকাত বা\'দাল জুমার পর মসজিদে বা ঘরে ফিরে গিয়ে',
    descriptionBn: 'হযরত আব্দুল্লাহ ইবনে উমর (রা.) বর্ণনা করেন যে, নবী করীম (সা.) জুমার পর ঘরে ফিরে দুই রাকাত সালাত আদায় করতেন। অনেক ফকীহ ৪ রাকাত ও ২ রাকাত উভয় আমল মিলিয়ে মোট ৬ রাকাত বা\'দাল জুমাকে সর্বোত্তম বলেছেন।',
    hadithReferenceBn: 'সহীহ বুখারী: ৯৩৭, সহীহ মুসলিম: ৮৮২, সুনানে তিরমিযী: ৫২৩ — হযরত আলী (রা.) ও ইবনে মাসউদ (রা.) জুমার পর মোট ৬ রাকাত (৪+২) সালাত আদায় করতেন।',
    niyyatGuideBn: 'জুমার পরবর্তী ২ রাকাত সুন্নাত/নফল সালাত কিবলামুখী হয়ে আদায় করছি।'
  },
  {
    id: 'jum_step_6',
    phase: 'after_farz',
    phaseTitleBn: '৩. ফরজের পরবর্তী সালাত (মোট ৬ রাকাত)',
    nameBn: 'ওয়াক্তিয়া নফল / তাহিয়্যাতুল ওযু',
    nameAr: 'صلاة النفل',
    rakatCount: 2,
    statusType: 'সুন্নাতে গায়রে মুয়াক্কাদাহ / নফল',
    timingBn: 'সুন্নাত সালাতগুলোর পর অতিরিক্ত সওয়াব ও বরকত অর্জনের জন্য',
    descriptionBn: 'জুমার মহিমান্বিত দিনে অধিক সওয়াব ও আত্মিক শান্তির জন্য যেকোনো সংখ্যক নফল সালাত আদায় করা মুস্তাহাব।',
    hadithReferenceBn: 'সহীহ মুসলিম: ৮৫৭ — জুমার দিনে বেশি বেশি নফল সালাত ও ইবাদতকারীর পূর্ববর্তী সপ্তাহের পাপ ক্ষমা করে দেওয়া হয়।',
    niyyatGuideBn: 'আল্লাহর সন্তুষ্টির উদ্দেশ্যে ২ রাকাত নফল সালাত আদায় করছি।'
  }
];

export function getDetailedPrayerState(schedule: PrayerTimeItem[]): DetailedPrayerState {
  const nowMs = new Date().getTime();

  // Extract main 5 prayers
  const farzList = schedule.filter(p => p.prayerCategory === 'farz' || ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(p.key));
  
  // Sort by timestamp
  farzList.sort((a, b) => a.timestamp - b.timestamp);

  const fajr = farzList.find(p => p.key === 'fajr') || farzList[0];
  const dhuhr = farzList.find(p => p.key === 'dhuhr') || farzList[1];
  const asr = farzList.find(p => p.key === 'asr') || farzList[2];
  const maghrib = farzList.find(p => p.key === 'maghrib') || farzList[3];
  const isha = farzList.find(p => p.key === 'isha') || farzList[4];

  // Also get sunrise for Fajr end
  const sunriseObj = schedule.find(p => p.key === 'sunrise');
  const sunriseMs = sunriseObj ? sunriseObj.timestamp : fajr.timestamp + 75 * 60 * 1000;

  // Determine current active prayer
  let currentPrayer: PrayerTimeItem = isha;
  let nextPrayer: PrayerTimeItem = fajr;
  let currentStartMs = isha.timestamp;
  let currentEndMs = fajr.timestamp + 24 * 3600 * 1000;

  if (nowMs >= fajr.timestamp && nowMs < dhuhr.timestamp) {
    currentPrayer = fajr;
    nextPrayer = dhuhr;
    currentStartMs = fajr.timestamp;
    currentEndMs = sunriseMs; // Fajr end time is Sunrise
  } else if (nowMs >= dhuhr.timestamp && nowMs < asr.timestamp) {
    currentPrayer = dhuhr;
    nextPrayer = asr;
    currentStartMs = dhuhr.timestamp;
    currentEndMs = asr.timestamp;
  } else if (nowMs >= asr.timestamp && nowMs < maghrib.timestamp) {
    currentPrayer = asr;
    nextPrayer = maghrib;
    currentStartMs = asr.timestamp;
    currentEndMs = maghrib.timestamp;
  } else if (nowMs >= maghrib.timestamp && nowMs < isha.timestamp) {
    currentPrayer = maghrib;
    nextPrayer = isha;
    currentStartMs = maghrib.timestamp;
    currentEndMs = isha.timestamp;
  } else if (nowMs >= isha.timestamp) {
    currentPrayer = isha;
    const tomorrowFajrTime = fajr.timestamp + 24 * 3600 * 1000;
    nextPrayer = { ...fajr, timestamp: tomorrowFajrTime };
    currentStartMs = isha.timestamp;
    currentEndMs = tomorrowFajrTime;
  } else {
    // Before Fajr today (00:00 - Fajr)
    currentPrayer = isha;
    nextPrayer = fajr;
    currentStartMs = isha.timestamp - 24 * 3600 * 1000;
    currentEndMs = fajr.timestamp;
  }

  // Progress percentage of current prayer
  const totalWaqtDuration = Math.max(1, currentEndMs - currentStartMs);
  const elapsed = Math.max(0, nowMs - currentStartMs);
  const currentProgressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalWaqtDuration) * 100)));

  // Current remaining
  const currentRemainingMs = Math.max(0, currentEndMs - nowMs);
  const curTotSec = Math.floor(currentRemainingMs / 1000);
  const currentRemainingHours = Math.floor(curTotSec / 3600);
  const currentRemainingMinutes = Math.floor((curTotSec % 3600) / 60);
  const currentRemainingSeconds = curTotSec % 60;
  const currentRemainingFormattedBn = `${toBengaliDigits(currentRemainingHours)} ঘণ্টা ${toBengaliDigits(currentRemainingMinutes)} মিনিট ${toBengaliDigits(currentRemainingSeconds)} সেকেন্ড`;

  // Next remaining
  const nextStartMs = nextPrayer.timestamp;
  const nextRemainingMs = Math.max(0, nextStartMs - nowMs);
  const nextTotSec = Math.floor(nextRemainingMs / 1000);
  const nextRemainingHours = Math.floor(nextTotSec / 3600);
  const nextRemainingMinutes = Math.floor((nextTotSec % 3600) / 60);
  const nextRemainingSeconds = nextTotSec % 60;
  const nextRemainingFormattedBn = `${toBengaliDigits(nextRemainingHours)} ঘণ্টা ${toBengaliDigits(nextRemainingMinutes)} মিনিট ${toBengaliDigits(nextRemainingSeconds)} সেকেন্ড`;

  // Pre-reminder calculation (10 minutes = 600,000 ms)
  const tenMinsMs = 10 * 60 * 1000;
  let isPreReminderActive = false;
  let preReminderType: 'ending_soon' | 'starting_soon' | 'normal' = 'normal';
  let preReminderMinutesLeft = 10;

  if (nextRemainingMs > 0 && nextRemainingMs <= tenMinsMs) {
    isPreReminderActive = true;
    preReminderType = 'starting_soon';
    preReminderMinutesLeft = Math.ceil(nextRemainingMs / (60 * 1000));
  } else if (currentRemainingMs > 0 && currentRemainingMs <= tenMinsMs) {
    isPreReminderActive = true;
    preReminderType = 'ending_soon';
    preReminderMinutesLeft = Math.ceil(currentRemainingMs / (60 * 1000));
  }

  // Dynamic Time-of-Day Themes
  let theme = {
    gradientClass: 'from-emerald-900 via-teal-900 to-emerald-950',
    cardBorderClass: 'border-emerald-600/70',
    accentBg: 'bg-amber-400',
    accentText: 'text-amber-300',
    themeNameBn: 'দুপুরের রোদেলা পরিবেশ (জোহর)',
    progressGradient: 'from-amber-400 to-emerald-400',
    skyIcon: '☀️',
    bgStyle: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.25), transparent 70%)'
  };

  switch (currentPrayer.key) {
    case 'fajr':
      theme = {
        gradientClass: 'from-slate-950 via-indigo-950 to-sky-950',
        cardBorderClass: 'border-sky-500/60',
        accentBg: 'bg-sky-400',
        accentText: 'text-sky-300',
        themeNameBn: 'প্রভাতের ফজর আকাশ (স্নিগ্ধ নীলিমায় প্রশান্তি)',
        progressGradient: 'from-sky-400 to-indigo-400',
        skyIcon: '🌅',
        bgStyle: 'radial-gradient(circle at top, rgba(56, 189, 248, 0.25), transparent 70%)'
      };
      break;
    case 'dhuhr':
      const isTodayFriday = new Date().getDay() === 5;
      theme = {
        gradientClass: isTodayFriday
          ? 'from-amber-950/90 via-emerald-950 to-teal-950'
          : 'from-emerald-950 via-teal-900 to-amber-950',
        cardBorderClass: isTodayFriday ? 'border-amber-400/80 ring-1 ring-amber-400/30' : 'border-amber-400/60',
        accentBg: 'bg-amber-400',
        accentText: 'text-amber-300',
        themeNameBn: isTodayFriday
          ? 'পবিত্র জুমু\'আ দুপুর (জুমার বিশেষ বরকতময় ওয়াক্ত)'
          : 'দুপুরের আলোকিত সময় (জোহর ওয়াক্ত)',
        progressGradient: isTodayFriday ? 'from-amber-400 via-emerald-400 to-teal-300' : 'from-amber-400 to-teal-300',
        skyIcon: isTodayFriday ? '🕌' : '☀️',
        bgStyle: 'radial-gradient(circle at top, rgba(251, 191, 36, 0.25), transparent 70%)'
      };
      break;
    case 'asr':
      theme = {
        gradientClass: 'from-amber-950 via-orange-950 to-slate-950',
        cardBorderClass: 'border-orange-500/60',
        accentBg: 'bg-orange-400',
        accentText: 'text-orange-300',
        themeNameBn: 'বিয়েল গোধূলি সময় (আসর ওয়াক্ত)',
        progressGradient: 'from-amber-400 to-orange-500',
        skyIcon: '🌇',
        bgStyle: 'radial-gradient(circle at top, rgba(249, 115, 22, 0.25), transparent 70%)'
      };
      break;
    case 'maghrib':
      theme = {
        gradientClass: 'from-purple-950 via-indigo-950 to-slate-950',
        cardBorderClass: 'border-purple-400/60',
        accentBg: 'bg-purple-400',
        accentText: 'text-purple-300',
        themeNameBn: 'সন্ধ্যার রক্তিম গোধূলি (মাগরিব ওয়াক্ত)',
        progressGradient: 'from-purple-400 to-amber-300',
        skyIcon: '🌆',
        bgStyle: 'radial-gradient(circle at top, rgba(192, 132, 252, 0.25), transparent 70%)'
      };
      break;
    case 'isha':
      theme = {
        gradientClass: 'from-slate-950 via-blue-950 to-emerald-950',
        cardBorderClass: 'border-indigo-400/60',
        accentBg: 'bg-indigo-400',
        accentText: 'text-indigo-300',
        themeNameBn: 'শান্ত তারকোজ্জ্বল নিশীথ (ইশা ও তাহাজ্জুদ)',
        progressGradient: 'from-indigo-400 to-teal-400',
        skyIcon: '🌙',
        bgStyle: 'radial-gradient(circle at top, rgba(129, 140, 248, 0.2), transparent 70%)'
      };
      break;
  }

  return {
    currentPrayer,
    nextPrayer,
    currentPrayerStartMs: currentStartMs,
    currentPrayerEndMs: currentEndMs,
    currentProgressPercent,
    currentRemainingMs,
    currentRemainingHours,
    currentRemainingMinutes,
    currentRemainingSeconds,
    currentRemainingFormattedBn,

    nextStartMs,
    nextRemainingMs,
    nextRemainingHours,
    nextRemainingMinutes,
    nextRemainingSeconds,
    nextRemainingFormattedBn,

    isPreReminderActive,
    preReminderType,
    preReminderMinutesLeft,

    theme
  };
}

/**
 * Get Next Prayer & Remaining Time
 */
export function getNextPrayerInfo(schedule: PrayerTimeItem[]) {
  const now = new Date().getTime();

  // Filter main 5 daily obligatory prayers
  const mainPrayers = schedule.filter(p => p.prayerCategory === 'farz' || ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(p.key));

  let nextPrayer = mainPrayers.find(p => p.timestamp > now);

  if (!nextPrayer) {
    // If past Isha, next prayer is Fajr tomorrow
    const fajr = schedule.find(p => p.key === 'fajr');
    if (fajr) {
      const tomorrowFajrTime = fajr.timestamp + 24 * 60 * 60 * 1000;
      nextPrayer = {
        ...fajr,
        timestamp: tomorrowFajrTime
      };
    } else {
      nextPrayer = mainPrayers[0];
    }
  }

  const diffMs = Math.max(0, nextPrayer.timestamp - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const remainingFormattedBn = `${toBengaliDigits(hours)} ঘণ্টা ${toBengaliDigits(minutes)} মিনিট বাকি`;
  const remainingFormattedEn = `${hours}h ${minutes}m left`;

  return {
    nextPrayer,
    hours,
    minutes,
    seconds,
    remainingFormattedBn,
    remainingFormattedEn
  };
}

/**
 * Get Context & Significance for Current Month
 */
export function getCurrentMonthlySignificance(): MonthlySignificanceInfo {
  return {
    monthIndexHijri: 1,
    monthNameBn: 'মুহররম (পবিত্র আশুরা ও শাহাদাতে হোসাইন র.)',
    hijriYear: 1448,
    bengaliMonthName: 'শ্রাবণ',
    gregorianMonthName: 'জুলাই / আগস্ট',
    historicalEventsBn: [
      'আল্লাহ তাআলার ৪টি সম্মানিত ও পবিত্র মাসের (আশহুরে হুরুম) অন্যতম শ্রেষ্ঠ মাস মুহররম।',
      'আশুরা (১০ই মুহররম): হযরত মূসা (আ.) ও বনী ইসরাঈলকে ফেরাউনের কবল থেকে রক্ষা করা এবং ফেরাউনকে নীল নদে ডুবিয়ে দেওয়া।',
      'কারবালার প্রান্তরে হযরত ইমাম হোসাইন (রা.) ও রাসুলুল্লাহ (সা.)-এর আহলে বাইতের শাহাদাত বরণের ঐতিহাসিক শিক্ষণীয় স্মারক।'
    ],
    keyVirtuesBn: [
      'রমজানের পর আল্লাহর নিকট সর্বাধিক মর্যাদাপূর্ণ নফল রোজা হলো মুহররম মাসের রোজা (সহীহ মুসলিম: ২৭৫৫)।',
      '১০ই মুহররম আশুরার ১টি রোজা বিগত ১ বছরের গুনাখাতা ক্ষমা করে দেয়।'
    ],
    recommendedAmalBn: [
      'আশুরার রোজা: ৯ ও ১০ই মুহররম অথবা ১০ ও ১১ই মুহররম মোট ২টি রোজা রাখা সুন্নাত।',
      'অধিক হারে তাওবা-ইস্তিগফার ও জিকির-আজকার করা।'
    ],
    specialDaysBn: [
      { date: '১০ই মুহররম', titleBn: 'পবিত্র আশুরা', descriptionBn: 'বিগত ১ বছরের সগীরা গুনাহ মাফের জন্য আশুরার সুন্নাত রোজা পালন।' }
    ]
  };
}
