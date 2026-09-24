import { BDLocation, CalendarDates } from '../types';

// Convert digits to Bengali numbers
export function toBengaliDigits(input: number | string): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit, 10)]);
}

// Convert ordinal number to Bengali ordinal string (১ম, ২য়, ৩য়, ৪র্থ, ৫ম...)
export function toBengaliOrdinal(num: number): string {
  const ordinals = ['', '১ম', '২য়', '৩য়', '৪র্থ', '৫ম', '৬ষ্ঠ', '৭ম', '৮ম', '৯ম', '১০ম', '১১তম', '১২তম'];
  return ordinals[num] || `${toBengaliDigits(num)}তম`;
}

// Enriched Month Detailed Info Interface
export interface MonthDetailedInfo {
  index: number; // 0-11
  monthNum: number; // 1-12
  nameBn: string;
  ordinalBn: string; // '১ম মাস', '২য় মাস'
  fractionBn: string; // '১/১২', '২/১২'
  labelWithNumber: string; // '১. মুহররম (১ম মাস [১/১২])'
  shortBadgeBn: string; // '[১/১২]'
}

// Bengali Months
export const BENGALI_MONTHS = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

// Bengali Months Detailed with 1-12 month numbers & ordinals
export const BENGALI_MONTHS_DETAILED: MonthDetailedInfo[] = [
  { index: 0, monthNum: 1, nameBn: 'বৈশাখ', ordinalBn: '১ম মাস', fractionBn: '১/১২', labelWithNumber: 'বৈশাখ(১)', shortBadgeBn: '(১)' },
  { index: 1, monthNum: 2, nameBn: 'জ্যৈষ্ঠ', ordinalBn: '২য় মাস', fractionBn: '২/১২', labelWithNumber: 'জ্যৈষ্ঠ(২)', shortBadgeBn: '(২)' },
  { index: 2, monthNum: 3, nameBn: 'আষাঢ়', ordinalBn: '৩য় মাস', fractionBn: '৩/১২', labelWithNumber: 'আষাঢ়(৩)', shortBadgeBn: '(৩)' },
  { index: 3, monthNum: 4, nameBn: 'শ্রাবণ', ordinalBn: '৪র্থ মাস', fractionBn: '৪/১২', labelWithNumber: 'শ্রাবণ(৪)', shortBadgeBn: '(৪)' },
  { index: 4, monthNum: 5, nameBn: 'ভাদ্র', ordinalBn: '৫ম মাস', fractionBn: '৫/১২', labelWithNumber: 'ভাদ্র(৫)', shortBadgeBn: '(৫)' },
  { index: 5, monthNum: 6, nameBn: 'আশ্বিন', ordinalBn: '৬ষ্ঠ মাস', fractionBn: '৬/১২', labelWithNumber: 'আশ্বিন(৬)', shortBadgeBn: '(৬)' },
  { index: 6, monthNum: 7, nameBn: 'কার্তিক', ordinalBn: '৭ম মাস', fractionBn: '৭/১২', labelWithNumber: 'কার্তিক(৭)', shortBadgeBn: '(৭)' },
  { index: 7, monthNum: 8, nameBn: 'অগ্রহায়ণ', ordinalBn: '৮ম মাস', fractionBn: '৮/১২', labelWithNumber: 'অগ্রহায়ণ(৮)', shortBadgeBn: '(৮)' },
  { index: 8, monthNum: 9, nameBn: 'পৌষ', ordinalBn: '৯ম মাস', fractionBn: '৯/১২', labelWithNumber: 'পৌষ(৯)', shortBadgeBn: '(৯)' },
  { index: 9, monthNum: 10, nameBn: 'মাঘ', ordinalBn: '১০ম মাস', fractionBn: '১০/১২', labelWithNumber: 'মাঘ(১০)', shortBadgeBn: '(১০)' },
  { index: 10, monthNum: 11, nameBn: 'ফাল্গুন', ordinalBn: '১১তম মাস', fractionBn: '১১/১২', labelWithNumber: 'ফাল্গুন(১১)', shortBadgeBn: '(১১)' },
  { index: 11, monthNum: 12, nameBn: 'চৈত্র', ordinalBn: '১২তম মাস', fractionBn: '১২/১২', labelWithNumber: 'চৈত্র(১২)', shortBadgeBn: '(১২)' }
];

// Hijri Months in Bengali
export const HIJRI_MONTHS_BN = [
  'মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানী', 'জমাদিউল আউয়াল', 'জমাদিউস সানী',
  'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জুলক্বাদ', 'জুলহিজ্জাহ'
];

// Hijri Months Detailed with 1-12 month numbers & ordinals
export const HIJRI_MONTHS_DETAILED: MonthDetailedInfo[] = [
  { index: 0, monthNum: 1, nameBn: 'মুহররম', ordinalBn: '১ম মাস', fractionBn: '১/১২', labelWithNumber: 'মুহররম(১)', shortBadgeBn: '(১)' },
  { index: 1, monthNum: 2, nameBn: 'সফর', ordinalBn: '২য় মাস', fractionBn: '২/১২', labelWithNumber: 'সফর(২)', shortBadgeBn: '(২)' },
  { index: 2, monthNum: 3, nameBn: 'রবিউল আউয়াল', ordinalBn: '৩য় মাস', fractionBn: '৩/১২', labelWithNumber: 'রবিউল আউয়াল(৩)', shortBadgeBn: '(৩)' },
  { index: 3, monthNum: 4, nameBn: 'রবিউস সানী', ordinalBn: '৪র্থ মাস', fractionBn: '৪/১২', labelWithNumber: 'রবিউস সানী(৪)', shortBadgeBn: '(৪)' },
  { index: 4, monthNum: 5, nameBn: 'জমাদিউল আউয়াল', ordinalBn: '৫ম মাস', fractionBn: '৫/১২', labelWithNumber: 'জমাদিউল আউয়াল(৫)', shortBadgeBn: '(৫)' },
  { index: 5, monthNum: 6, nameBn: 'জমাদিউস সানী', ordinalBn: '৬ষ্ঠ মাস', fractionBn: '৬/১২', labelWithNumber: 'জমাদিউস সানী(৬)', shortBadgeBn: '(৬)' },
  { index: 6, monthNum: 7, nameBn: 'রজব', ordinalBn: '৭ম মাস', fractionBn: '৭/১২', labelWithNumber: 'রজব(৭)', shortBadgeBn: '(৭)' },
  { index: 7, monthNum: 8, nameBn: 'শাবান', ordinalBn: '৮ম মাস', fractionBn: '৮/১২', labelWithNumber: 'শাবান(৮)', shortBadgeBn: '(৮)' },
  { index: 8, monthNum: 9, nameBn: 'রমজান', ordinalBn: '৯ম মাস', fractionBn: '৯/১২', labelWithNumber: 'রমজান(৯)', shortBadgeBn: '(৯)' },
  { index: 9, monthNum: 10, nameBn: 'শাওয়াল', ordinalBn: '১০ম মাস', fractionBn: '১০/১২', labelWithNumber: 'শাওয়াল(১০)', shortBadgeBn: '(১০)' },
  { index: 10, monthNum: 11, nameBn: 'জুলক্বাদ', ordinalBn: '১১তম মাস', fractionBn: '১১/১২', labelWithNumber: 'জুলক্বাদ(১১)', shortBadgeBn: '(১১)' },
  { index: 11, monthNum: 12, nameBn: 'জুলহিজ্জাহ', ordinalBn: '১২তম মাস', fractionBn: '১২/১২', labelWithNumber: 'জুলহিজ্জাহ(১২)', shortBadgeBn: '(১২)' }
];

// Gregorian Month names in Bengali
export const GREGORIAN_MONTHS_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

// Gregorian Months Detailed with 1-12 month numbers & ordinals
export const GREGORIAN_MONTHS_DETAILED: MonthDetailedInfo[] = [
  { index: 0, monthNum: 1, nameBn: 'জানুয়ারি', ordinalBn: '১ম মাস', fractionBn: '১/১২', labelWithNumber: 'জানুয়ারি(১)', shortBadgeBn: '(১)' },
  { index: 1, monthNum: 2, nameBn: 'ফেব্রুয়ারি', ordinalBn: '২য় মাস', fractionBn: '২/১২', labelWithNumber: 'ফেব্রুয়ারি(২)', shortBadgeBn: '(২)' },
  { index: 2, monthNum: 3, nameBn: 'মার্চ', ordinalBn: '৩য় মাস', fractionBn: '৩/১২', labelWithNumber: 'মার্চ(৩)', shortBadgeBn: '(৩)' },
  { index: 3, monthNum: 4, nameBn: 'এপ্রিল', ordinalBn: '৪র্থ মাস', fractionBn: '৪/১২', labelWithNumber: 'এপ্রিল(৪)', shortBadgeBn: '(৪)' },
  { index: 4, monthNum: 5, nameBn: 'মে', ordinalBn: '৫ম মাস', fractionBn: '৫/১২', labelWithNumber: 'মে(৫)', shortBadgeBn: '(৫)' },
  { index: 5, monthNum: 6, nameBn: 'জুন', ordinalBn: '৬ষ্ঠ মাস', fractionBn: '৬/১২', labelWithNumber: 'জুন(৬)', shortBadgeBn: '(৬)' },
  { index: 6, monthNum: 7, nameBn: 'জুলাই', ordinalBn: '৭ম মাস', fractionBn: '৭/১২', labelWithNumber: 'জুলাই(৭)', shortBadgeBn: '(৭)' },
  { index: 7, monthNum: 8, nameBn: 'আগস্ট', ordinalBn: '৮ম মাস', fractionBn: '৮/১২', labelWithNumber: 'আগস্ট(৮)', shortBadgeBn: '(৮)' },
  { index: 8, monthNum: 9, nameBn: 'সেপ্টেম্বর', ordinalBn: '৯ম মাস', fractionBn: '৯/১২', labelWithNumber: 'সেপ্টেম্বর(৯)', shortBadgeBn: '(৯)' },
  { index: 9, monthNum: 10, nameBn: 'অক্টোবর', ordinalBn: '১০ম মাস', fractionBn: '১০/১২', labelWithNumber: 'অক্টোবর(১০)', shortBadgeBn: '(১০)' },
  { index: 10, monthNum: 11, nameBn: 'নভেম্বর', ordinalBn: '১১তম মাস', fractionBn: '১১/১২', labelWithNumber: 'নভেম্বর(১১)', shortBadgeBn: '(১১)' },
  { index: 11, monthNum: 12, nameBn: 'ডিসেম্বর', ordinalBn: '১২তম মাস', fractionBn: '১২/১২', labelWithNumber: 'ডিসেম্বর(১২)', shortBadgeBn: '(১২)' }
];

// Days in Bengali
export const DAYS_BN = [
  'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
];

/**
 * Format month name with ordinal indicator and number (e.g. "সেপ্টেম্বর(৯)")
 */
export function formatMonthWithNumber(
  monthIndex: number,
  system: 'hijri' | 'gregorian' | 'bengali',
  _style: 'compact' | 'bracket' | 'full' = 'compact'
): string {
  const list = system === 'hijri' ? HIJRI_MONTHS_DETAILED : system === 'gregorian' ? GREGORIAN_MONTHS_DETAILED : BENGALI_MONTHS_DETAILED;
  const item = list[monthIndex] || list[0];
  return `${item.nameBn}(${toBengaliDigits(item.monthNum)})`;
}

// Approximate Hijri month day lengths
const HIJRI_MONTH_LENGTHS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

/**
 * Calculate matching equivalent Gregorian and Bengali dates for any given Hijri date
 * Always includes month names and 1-12 month numbers
 */
export function getEquivalentDatesForHijri(hijriDay: number, hijriMonthIndex: number, hijriYear: number = 1448) {
  let dayOfYear = hijriDay;
  for (let m = 0; m < hijriMonthIndex; m++) {
    dayOfYear += HIJRI_MONTH_LENGTHS[m];
  }
  // Base calibration: July 27, 2026 is 12 Muharram 1448 (dayOfYear = 12)
  const diffDays = dayOfYear - 12 + (hijriYear - 1448) * 354;
  const targetDate = new Date(2026, 6, 27);
  targetDate.setDate(targetDate.getDate() + diffDays);

  const gDay = targetDate.getDate();
  const gMonth = targetDate.getMonth();
  const gYear = targetDate.getFullYear();
  const gDayOfWeek = targetDate.getDay();
  const gMonthInfo = GREGORIAN_MONTHS_DETAILED[gMonth];

  const gFormatted = `${toBengaliDigits(gDay)} ${gMonthInfo.nameBn}(${toBengaliDigits(gMonthInfo.monthNum)}) ${toBengaliDigits(gYear)}`;
  const gShort = `${toBengaliDigits(gDay)} ${gMonthInfo.nameBn}(${toBengaliDigits(gMonthInfo.monthNum)})`;

  // Bengali calculation (Base: July 27, 2026 is 12 Srabon 1433 Bangabdo, Srabon index 3)
  let bDay = 12 + diffDays;
  let bMonth = 3;
  let bYear = 1433;
  while (bDay > 31) {
    bDay -= 31;
    bMonth++;
    if (bMonth >= 12) {
      bMonth = 0;
      bYear++;
    }
  }
  while (bDay < 1) {
    bDay += 30;
    bMonth--;
    if (bMonth < 0) {
      bMonth = 11;
      bYear--;
    }
  }
  const bMonthInfo = BENGALI_MONTHS_DETAILED[bMonth];
  const bFormatted = `${toBengaliDigits(bDay)} ${bMonthInfo.nameBn}(${toBengaliDigits(bMonthInfo.monthNum)}) ${toBengaliDigits(bYear)} বঙ্গাব্দ`;
  const bShort = `${toBengaliDigits(bDay)} ${bMonthInfo.nameBn}(${toBengaliDigits(bMonthInfo.monthNum)})`;

  const hMonthInfo = HIJRI_MONTHS_DETAILED[hijriMonthIndex];
  const hFormatted = `${toBengaliDigits(hijriDay)} ${hMonthInfo.nameBn}(${toBengaliDigits(hMonthInfo.monthNum)}) ${toBengaliDigits(hijriYear)} হিজরি`;
  const hShort = `${toBengaliDigits(hijriDay)} ${hMonthInfo.nameBn}(${toBengaliDigits(hMonthInfo.monthNum)})`;

  return {
    targetDate,
    dayOfWeekNameBn: DAYS_BN[gDayOfWeek],
    hijri: {
      day: hijriDay,
      monthIndex: hijriMonthIndex,
      monthNum: hijriMonthIndex + 1,
      monthNameBn: hMonthInfo.nameBn,
      monthOrdinalBn: hMonthInfo.ordinalBn,
      monthFractionBn: hMonthInfo.fractionBn,
      formatted: hFormatted,
      short: hShort,
      year: hijriYear
    },
    gregorian: {
      day: gDay,
      monthIndex: gMonth,
      monthNum: gMonth + 1,
      monthNameBn: gMonthInfo.nameBn,
      monthOrdinalBn: gMonthInfo.ordinalBn,
      monthFractionBn: gMonthInfo.fractionBn,
      formatted: gFormatted,
      short: gShort,
      year: gYear
    },
    bengali: {
      day: bDay,
      monthIndex: bMonth,
      monthNum: bMonth + 1,
      monthNameBn: bMonthInfo.nameBn,
      monthOrdinalBn: bMonthInfo.ordinalBn,
      monthFractionBn: bMonthInfo.fractionBn,
      formatted: bFormatted,
      short: bShort,
      year: bYear
    },
    equivalentSummaryBn: `সম্ভাব্য ইংরেজি: ${gShort} • সম্ভাব্য বাংলা: ${bShort}`
  };
}

/**
 * Calculate Triple Calendar Dates with numeric practice format & day name
 */
export function getTripleCalendarDates(date: Date = new Date()): CalendarDates {
  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed (0=Jan, 6=July)
  const year = date.getFullYear();
  const dayOfWeek = date.getDay();

  const dayPad = day < 10 ? `0${day}` : `${day}`;
  const monthNum = month + 1;
  const monthPad = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;

  // Gregorian Formatted
  const gMonthInfo = GREGORIAN_MONTHS_DETAILED[month];
  const gregorianDayName = DAYS_BN[dayOfWeek];
  const gregorianFormatted = `${toBengaliDigits(day)} ${gMonthInfo.nameBn}(${toBengaliDigits(gMonthInfo.monthNum)}) ${toBengaliDigits(year)}, ${gregorianDayName}`;
  const gregorianNumeric = `${toBengaliDigits(dayPad)}/${toBengaliDigits(monthPad)}/${toBengaliDigits(year)}`;
  const gregorianMonthPractice = `${gMonthInfo.nameBn}(${toBengaliDigits(gMonthInfo.monthNum)})`;

  // Hijri Calculation (Calibrated for 2026 July 27 -> 12 Muharram 1448)
  const baseGregorianTime = new Date(2026, 6, 27).getTime(); // July 27 2026
  const diffDays = Math.floor((date.getTime() - baseGregorianTime) / (1000 * 60 * 60 * 24));
  
  let hijriDay = 12 + diffDays;
  let hijriMonth = 0; // Muharram
  let hijriYear = 1448;

  while (hijriDay > 30) {
    hijriDay -= 30;
    hijriMonth++;
    if (hijriMonth >= 12) {
      hijriMonth = 0;
      hijriYear++;
    }
  }
  while (hijriDay < 1) {
    hijriDay += 29;
    hijriMonth--;
    if (hijriMonth < 0) {
      hijriMonth = 11;
      hijriYear--;
    }
  }

  const hDayPad = hijriDay < 10 ? `0${hijriDay}` : `${hijriDay}`;
  const hMonthNum = hijriMonth + 1;
  const hMonthPad = hMonthNum < 10 ? `0${hMonthNum}` : `${hMonthNum}`;
  const hMonthInfo = HIJRI_MONTHS_DETAILED[hijriMonth];

  const hijriFormatted = `${toBengaliDigits(hijriDay)} ${hMonthInfo.nameBn}(${toBengaliDigits(hMonthInfo.monthNum)}) ${toBengaliDigits(hijriYear)} হিজরি`;
  const hijriNumeric = `${toBengaliDigits(hDayPad)}/${toBengaliDigits(hMonthPad)}/${toBengaliDigits(hijriYear)}`;
  const hijriMonthPractice = `${hMonthInfo.nameBn}(${toBengaliDigits(hMonthInfo.monthNum)})`;

  // Bengali Calendar Calculation (Calibrated for 2026 July 27 -> 12 Srabon 1433 Bangabdo)
  let bengaliDay = 12 + diffDays;
  let bengaliMonth = 3; // Srabon (Index 3: Baishakh 0, Joishtha 1, Ashar 2, Srabon 3)
  let bengaliYear = 1433;

  while (bengaliDay > 31) {
    bengaliDay -= 31;
    bengaliMonth++;
    if (bengaliMonth >= 12) {
      bengaliMonth = 0;
      bengaliYear++;
    }
  }
  while (bengaliDay < 1) {
    bengaliDay += 30;
    bengaliMonth--;
    if (bengaliMonth < 0) {
      bengaliMonth = 11;
      bengaliYear--;
    }
  }

  const bDayPad = bengaliDay < 10 ? `0${bengaliDay}` : `${bengaliDay}`;
  const bMonthNum = bengaliMonth + 1;
  const bMonthPad = bMonthNum < 10 ? `0${bMonthNum}` : `${bMonthNum}`;
  const bMonthInfo = BENGALI_MONTHS_DETAILED[bengaliMonth];

  const bengaliFormatted = `${toBengaliDigits(bengaliDay)} ${bMonthInfo.nameBn}(${toBengaliDigits(bMonthInfo.monthNum)}) ${toBengaliDigits(bengaliYear)} বঙ্গাব্দ`;
  const bengaliNumeric = `${toBengaliDigits(bDayPad)}/${toBengaliDigits(bMonthPad)}/${toBengaliDigits(bengaliYear)}`;
  const bengaliMonthPractice = `${bMonthInfo.nameBn}(${toBengaliDigits(bMonthInfo.monthNum)})`;

  return {
    gregorianFormatted,
    gregorianNumeric,
    gregorianMonthPractice,
    gregorianDayName,

    hijriFormatted,
    hijriNumeric,
    hijriMonthPractice,

    bengaliFormatted,
    bengaliNumeric,
    bengaliMonthPractice
  };
}

/**
 * All 64 Districts of Bangladesh by 8 Divisions (including Kushtia, Chuadanga, Meherpur, etc.)
 */
export const BANGLADESH_LOCATIONS: BDLocation[] = [
  // --- Khulna Division (খুলনা বিভাগ) ---
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Kushtia', districtBn: 'কুষ্টিয়া', upazilaBn: 'সদর, কুমারখালী, ভেড়ামারা, মিরপুর, খোকসা, দৌলতপুর', lat: 23.9013, lng: 89.1204 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Khulna', districtBn: 'খুলনা', upazilaBn: 'সদর, রূপসা, ফুলতলা, ডুমুরিয়া, বটিয়াঘাটা, পাইকগাছা', lat: 22.8456, lng: 89.5403 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Meherpur', districtBn: 'মেহেরপুর', upazilaBn: 'সদর, মুজিবনগর, গাংনী', lat: 23.7622, lng: 88.6318 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Chuadanga', districtBn: 'চুয়াডাঙ্গা', upazilaBn: 'সদর, আলমডাঙ্গা, দামুড়হুদা, জীবননগর', lat: 23.6402, lng: 88.8418 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Jhenaidah', districtBn: 'ঝিনাইদহ', upazilaBn: 'সদর, শৈলকুপা, হরিণাকুণ্ডু, কালীগঞ্জ, কোটচাঁদপুর, মহেশপুর', lat: 23.5450, lng: 89.1726 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Magura', districtBn: 'মাগুরা', upazilaBn: 'সদর, শ্রীপুর, শালিখা, মোহাম্মাদপুর', lat: 23.4873, lng: 89.4199 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Jashore', districtBn: 'যশোর', upazilaBn: 'সদর, চৌগাছা, ঝিকরগাছা, শার্শা, মনিরামপুর, কেশবপুর', lat: 23.1664, lng: 89.2081 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Narail', districtBn: 'নড়াইল', upazilaBn: 'সদর, লোহাগড়া, কালিয়া', lat: 23.1725, lng: 89.5126 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Bagerhat', districtBn: 'বাগেরহাট', upazilaBn: 'সদর, ফকিরহাট, মোল্লাহাট, রামপাল, মোংলা', lat: 22.6516, lng: 89.7859 },
  { division: 'Khulna', divisionBn: 'খুলনা', district: 'Satkhira', districtBn: 'সাতক্ষীরা', upazilaBn: 'সদর, কলারোয়া, তালা, দেবহাটা, কালিগঞ্জ, শ্যামনগর', lat: 22.7185, lng: 89.0705 },

  // --- Dhaka Division (ঢাকা বিভাগ) ---
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Dhaka', districtBn: 'ঢাকা', upazilaBn: 'ধানমন্ডি, মিরপুর, গুলশান, উত্তরা, সাভার, কেরানীগঞ্জ', lat: 23.8103, lng: 90.4125 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Gazipur', districtBn: 'গাজীপুর', upazilaBn: 'সদর, টঙ্গী, কালিয়াকৈর, শ্রীপুর, কাপাসিয়া', lat: 24.0023, lng: 90.4261 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Narayanganj', districtBn: 'নারায়ণগঞ্জ', upazilaBn: 'সদর, সোনারগাঁও, রূপগঞ্জ, আড়াইহাজার, বন্দর', lat: 23.6238, lng: 90.5000 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Faridpur', districtBn: 'ফরিদপুর', upazilaBn: 'সদর, বোয়ালমারী, আলফাডাঙ্গা, নগরকান্দা, ভাঙ্গা', lat: 23.6071, lng: 89.8425 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Tangail', districtBn: 'টাঙ্গাইল', upazilaBn: 'সদর, মির্জাপুর, দেলদুয়ার, কালিহাতী, ঘাটাইল', lat: 24.2513, lng: 89.9167 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Manikganj', districtBn: 'মানিকগঞ্জ', upazilaBn: 'সদর, সিংগাইর, সাটুরিয়া, ঘিওরে, শিবালয়', lat: 23.8644, lng: 89.9997 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Munshiganj', districtBn: 'মুন্সীগঞ্জ', upazilaBn: 'সদর, টঙ্গিবাড়ী, সিরাজদিখান, লৌহজং, শ্রীনগর', lat: 23.5422, lng: 90.5305 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Rajbari', districtBn: 'রাজবাড়ী', upazilaBn: 'সদর, পাংশা, কালুখালী, বালিয়াকান্দি, গোয়ালন্দ', lat: 23.7574, lng: 89.6444 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Gopalganj', districtBn: 'গোপালগঞ্জ', upazilaBn: 'সদর, টুঙ্গিপাড়া, কোটালিপাড়া, মুকসুদপুর, কাশিয়ানী', lat: 23.0050, lng: 89.8266 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Madaripur', districtBn: 'মাদারীপুর', upazilaBn: 'সদর, শিবচর, কালকিনি, রাজৈর', lat: 23.1641, lng: 90.1897 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Shariatpur', districtBn: 'শরীয়তপুর', upazilaBn: 'সদর, জাজিরা, নড়িয়া, ভেদরগঞ্জ, ডামুড্যা', lat: 23.2423, lng: 90.4348 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Kishoreganj', districtBn: 'কিশোরগঞ্জ', upazilaBn: 'সদর, ভৈরব, করিমগঞ্জ, তাড়াইল, বাজিতপুর', lat: 24.4449, lng: 90.7766 },
  { division: 'Dhaka', divisionBn: 'ঢাকা', district: 'Narsingdi', districtBn: 'নরসিংদী', upazilaBn: 'সদর, পলাশ, শিবপুর, মনোহরদী, রায়পুরা, বেলাব', lat: 23.9193, lng: 90.7206 },

  // --- Chattogram Division (চট্টগ্রাম বিভাগ) ---
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Chattogram', districtBn: 'চট্টগ্রাম', upazilaBn: 'পাহাড়তলী, পটিয়া, হাটহাজারী, রাউজান, রাঙ্গুনিয়া, সীতাকুণ্ড', lat: 22.3569, lng: 91.7832 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Cox\'s Bazar', districtBn: 'কক্সবাজার', upazilaBn: 'সদর, টেকনাফ, উখিয়া, রামুর, চকরিয়া', lat: 21.4272, lng: 92.0058 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Cumilla', districtBn: 'কুমিল্লা', upazilaBn: 'সদর, দাউদকান্দি, চান্দিনা, লাকসাম, চৌদ্দগ্রাম', lat: 23.4607, lng: 91.1809 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Noakhali', districtBn: 'নোয়াখালী', upazilaBn: 'সদর, বেগমগঞ্জ, সেনবাগ, চাটখিল, কোম্পানীগঞ্জ', lat: 22.8696, lng: 91.0994 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Feni', districtBn: 'ফেনী', upazilaBn: 'সদর, দাগনভূঞা, সোনাগাজী, ছাগলনাইয়া, পরশুরাম', lat: 23.0159, lng: 91.3976 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Lakshmipur', districtBn: 'লক্ষ্মীপুর', upazilaBn: 'সদর, রায়পুর, রামগঞ্জ, রামগতি, কমলনগর', lat: 22.9425, lng: 90.8411 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Chandpur', districtBn: 'চাঁদপুর', upazilaBn: 'সদর, হাজীগঞ্জ, শাহরাস্তি, মতলব উত্তর, মতলব দক্ষিণ', lat: 23.2321, lng: 90.6631 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Brahmanbaria', districtBn: 'ব্রাহ্মণবাড়িয়া', upazilaBn: 'সদর, কসবা, নবীনগর, আশুগঞ্জ, সরাইল', lat: 23.9571, lng: 91.1119 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Rangamati', districtBn: 'রাঙ্গামাটি', upazilaBn: 'সদর, কাপ্তাই, কাউখালী, লংগদু, বাঘাইছড়ি', lat: 22.6533, lng: 92.1789 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Bandarban', districtBn: 'বান্দরবান', upazilaBn: 'সদর, রোয়াংছড়ি, রুমা, থানচি, লামা', lat: 22.1953, lng: 92.2184 },
  { division: 'Chattogram', divisionBn: 'চট্টগ্রাম', district: 'Khagrachhari', districtBn: 'খাগড়াছড়ি', upazilaBn: 'সদর, দীঘিনালা, পানছড়ি, মাটিরাঙ্গা, রামগড়', lat: 23.1193, lng: 91.9847 },

  // --- Rajshahi Division (রাজশাহী বিভাগ) ---
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Rajshahi', districtBn: 'রাজশাহী', upazilaBn: 'সদর, গোদাগাড়ী, তানোর, বাঘমারা, চারঘাট, বাঘা', lat: 24.3745, lng: 88.6042 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Bogra', districtBn: 'বগুড়া', upazilaBn: 'সদর, শেরপুর, শিবগঞ্জ, গাবতলী, সোনাতলা, ধুনট', lat: 24.8481, lng: 89.3730 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Pabna', districtBn: 'পাবনা', upazilaBn: 'সদর, ঈশ্বরদী, আটঘোরিয়া, চাটমোহর, বেড়া, সাঁথিয়া', lat: 24.0108, lng: 89.2500 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Natore', districtBn: 'নাটোর', upazilaBn: 'সদর, সিংড়া, বড়াইগ্রাম, গুরুদাসপুর, লালপুর', lat: 24.4206, lng: 88.9804 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Naogaon', districtBn: 'নওগাঁ', upazilaBn: 'সদর, বদলগাছী, মহাদেবপুর, মান্দা, ধামইরহাট, সাপাহার', lat: 24.8103, lng: 88.9414 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Chapainawabganj', districtBn: 'চাঁপাইনবাবগঞ্জ', upazilaBn: 'সদর, শিবগঞ্জ, গোমস্তাপুর, নাচোল, ভোলাহাট', lat: 24.5965, lng: 88.2775 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Joypurhat', districtBn: 'জয়পুরহাট', upazilaBn: 'সদর, পাঁচবিবি, আক্কেলপুর, ক্ষেতলাল, কালাই', lat: 25.1017, lng: 89.0270 },
  { division: 'Rajshahi', divisionBn: 'রাজশাহী', district: 'Sirajganj', districtBn: 'সিরাজগঞ্জ', upazilaBn: 'সদর, উল্লাপাড়া, শাহজাদপুর, কাজীপুর, তাড়াশ, রায়গঞ্জ', lat: 24.4534, lng: 89.7008 },

  // --- Sylhet Division (সিলেট বিভাগ) ---
  { division: 'Sylhet', divisionBn: 'সিলেট', district: 'Sylhet', districtBn: 'সিলেট', upazilaBn: 'সদর, জকিগঞ্জ, গোলাপগঞ্জ, বিয়ানীবাজার, কানাইঘাট, কোম্পানীগঞ্জ', lat: 24.8949, lng: 91.8687 },
  { division: 'Sylhet', divisionBn: 'সিলেট', district: 'Moulvibazar', districtBn: 'মৌলভীবাজার', upazilaBn: 'সদর, শ্রীমঙ্গল, কমলগঞ্জ, কুলাউড়া, বড়লেখা', lat: 24.4829, lng: 91.7774 },
  { division: 'Sylhet', divisionBn: 'সিলেট', district: 'Habiganj', districtBn: 'হবিগঞ্জ', upazilaBn: 'সদর, মাধবপুর, চুনারুঘাট, বাহুবল, নবীগঞ্জ', lat: 24.3749, lng: 91.4155 },
  { division: 'Sylhet', divisionBn: 'সিলেট', district: 'Sunamganj', districtBn: 'সুনামগঞ্জ', upazilaBn: 'সদর, ছাতক, জগন্নাথপুর, দোয়ারাবাজার, তাহিরপুর', lat: 25.0658, lng: 91.3950 },

  // --- Barishal Division (বরিশাল বিভাগ) ---
  { division: 'Barishal', divisionBn: 'বরিশাল', district: 'Barishal', districtBn: 'বরিশাল', upazilaBn: 'সদর, বাকেরগঞ্জ, বাবুগঞ্জ, উজিরপুর, গৌরনদী, আগৈলঝাড়া', lat: 22.7010, lng: 90.3535 },
  { division: 'Barishal', divisionBn: 'বরিশাল', district: 'Bhola', districtBn: 'ভোলা', upazilaBn: 'সদর, দৌলতখান, বোরহানউদ্দিন, লালমোহন, চরফ্যাশন', lat: 22.6859, lng: 90.6482 },
  { division: 'Barishal', divisionBn: 'বরিশাল', district: 'Patuakhali', districtBn: 'পটুয়াখালী', upazilaBn: 'সদর, গলাচিপা, বাউফল, মির্জাগঞ্জ, কলাপাড়া, কুয়াকাটা', lat: 22.3596, lng: 90.3298 },
  { division: 'Barishal', divisionBn: 'বরিশাল', district: 'Barguna', districtBn: 'বরগুনা', upazilaBn: 'সদর, আমতলী, পাথরঘাটা, বেতাগী, বামনা', lat: 22.1557, lng: 90.1258 },
  { division: 'Barishal', divisionBn: 'বরিশাল', district: 'Pirojpur', districtBn: 'পিরোজপুর', upazilaBn: 'সদর, মঠবাড়িয়া, ভাণ্ডারিয়া, নাজিরপুর, নেছারাবাদ', lat: 22.5841, lng: 89.9720 },
  { division: 'Barishal', divisionBn: 'বরিশাল', district: 'Jhalokati', districtBn: 'ঝালকাঠি', upazilaBn: 'সদর, নলছিটি, রাজাপুর, কাঁঠালিয়া', lat: 22.6406, lng: 90.1987 },

  // --- Rangpur Division (রংপুর বিভাগ) ---
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Rangpur', districtBn: 'রংপুর', upazilaBn: 'সদর, বদরগঞ্জ, পীরগঞ্জ, পীরগাছা, কাউনিয়া, মিঠাপুকুর', lat: 25.7439, lng: 89.2752 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Dinajpur', districtBn: 'দিনাজপুর', upazilaBn: 'সদর, ফুলবাড়ী, বীরগঞ্জ, বিরামপুর, পার্বতীপুর, হাকিমপুর', lat: 25.6279, lng: 88.6332 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Gaibandha', districtBn: 'গাইবান্ধা', upazilaBn: 'সদর, গোবিন্দগঞ্জ, সুন্দরগঞ্জ, পলাশবাড়ী, সাদুল্লাপুর', lat: 25.3287, lng: 89.5403 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Kurigram', districtBn: 'কুড়িগ্রাম', upazilaBn: 'সদর, উলিপুর, নাগেশ্বরী, ভুরুঙ্গামারী, চিলমারী', lat: 25.8054, lng: 89.6361 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Lalmonirhat', districtBn: 'লালমনিরহাট', upazilaBn: 'সদর, পাটগ্রাম, হাতিবান্ধা, কালীগঞ্জ, আদিতমারী', lat: 25.9165, lng: 89.4532 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Nilphamari', districtBn: 'নীলফামারী', upazilaBn: 'সদর, সৈয়দপুর, ডোমার, ডিমলা, জলঢাকা', lat: 25.9318, lng: 88.8560 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Panchagarh', districtBn: 'পঞ্চগড়', upazilaBn: 'সদর, তেঁতুলিয়া, বোদা, দেবীগঞ্জ, আটোয়ারী', lat: 26.3411, lng: 88.5541 },
  { division: 'Rangpur', divisionBn: 'রংপুর', district: 'Thakurgaon', districtBn: 'ঠাকুরগাঁও', upazilaBn: 'সদর, পীরগঞ্জ, রানীশংকৈল, বালিয়াডাঙ্গী, হরিপুর', lat: 26.0336, lng: 88.4616 },

  // --- Mymensingh Division (ময়মনসিংহ বিভাগ) ---
  { division: 'Mymensingh', divisionBn: 'ময়মনসিংহ', district: 'Mymensingh', districtBn: 'ময়মনসিংহ', upazilaBn: 'সদর, মুক্তাগাছা, ত্রিশাল, গফরগাঁও, ফুলবাড়িয়া, ঈশ্বরগঞ্জ', lat: 24.7471, lng: 90.4203 },
  { division: 'Mymensingh', divisionBn: 'ময়মনসিংহ', district: 'Jamalpur', districtBn: 'জামালপুর', upazilaBn: 'সদর, সরিষাবাড়ী, মেলান্দহ, ইসলামপুর, দেওয়ানগঞ্জ', lat: 24.9375, lng: 89.9375 },
  { division: 'Mymensingh', divisionBn: 'ময়মনসিংহ', district: 'Netrokona', districtBn: 'নেত্রকোণা', upazilaBn: 'সদর, পূর্বধলা, মোহনগঞ্জ, দুর্গাপুর, কলমাকান্দা', lat: 24.8709, lng: 90.7279 },
  { division: 'Mymensingh', divisionBn: 'ময়মনসিংহ', district: 'Sherpur', districtBn: 'শেরপুর', upazilaBn: 'সদর, নকলা, নালিতাবাড়ী, ঝিনাইগাতী, শ্রীবরদী', lat: 25.0204, lng: 90.0153 }
];

