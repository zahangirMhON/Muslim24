export type Language = 'bn' | 'en' | 'ar';

export interface CalendarDates {
  gregorianFormatted: string; // e.g. "২৭ জুলাই ২০২৬, সোমবার"
  gregorianNumeric: string;   // e.g. "২৭/০৭/২০২৬"
  gregorianMonthPractice: string; // e.g. "৭ম মাস (জুলাই)"
  gregorianDayName: string;   // e.g. "সোমবার"

  hijriFormatted: string;     // e.g. "১২ মুহররম ১৪৪৮ হিজরি"
  hijriNumeric: string;       // e.g. "১২/০১/১৪৪৮"
  hijriMonthPractice: string; // e.g. "১ম মাস (মুহররম)"

  bengaliFormatted: string;   // e.g. "১২ শ্রাবণ ১৪৩৩ বঙ্গাব্দ"
  bengaliNumeric: string;     // e.g. "১২/০৪/১৪৩৩"
  bengaliMonthPractice: string; // e.g. "৪র্থ মাস (শ্রাবণ)"
}

export interface PrayerRakatBreakdown {
  farz: number;
  sunnahMuakkadah: number;
  sunnahGhairMuakkadah: number;
  nafl: number;
  witr: number;
  totalRakat: number;
  detailsBn: string;
}

export interface PrayerTimeItem {
  key: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'sehri' | 'iftar' | 'tahajjud' | 'ishraq' | 'awwabin' | 'sunset';
  nameBn: string;
  nameEn: string;
  nameAr: string;
  timeString: string; // 12-hour format e.g. "04:15 AM"
  timestamp: number; // unix time today
  iconName: string;
  prayerCategory?: 'farz' | 'nafel' | 'sun_event';
  azanTimeString?: string;
  jamaatTimeString?: string;
  rakatBreakdown?: PrayerRakatBreakdown;
  startTimeString?: string;
  endTimeString?: string;
  durationStringBn?: string;
  recommendedTimeBn?: string;
  forbiddenTimeNoteBn?: string;
  significanceBn?: string;
}

export interface BDLocation {
  division: string;
  divisionBn: string;
  district: string;
  districtBn: string;
  upazilaBn?: string;
  lat: number;
  lng: number;
}

export interface AsmaulHusnaItem {
  id: number;
  arabicName: string;
  nameAr?: string;
  transliterationBn: string;
  transliterationEn: string;
  meaningBn: string;
  meaningEn: string;
  fajilatBn: string;       // সেকশনে ফযীলত
  virtueBn?: string;      // Alias
  hedayetBn: string;       // সেকশনে হেদায়েত ও আল্লাহর সাহায্য পাওয়ার দিকনির্দেশনা
  guidanceBn?: string;    // Alias
  referenceBn: string;    // কুরআন বা সহীহ হাদিসের রেফারেন্স
  recommendedCount?: number;
  completedCount?: number;
}

export interface QuranVerse {
  id: number;
  surahNumber: number;
  surahNameBn: string;
  surahNameAr: string;
  ayahNumber: number;
  arabicText: string;
  bengaliPronunciation?: string;
  bengaliTranslation: string;
  englishTranslation: string;
  audioUrl?: string;
  isRead?: boolean;
}

export interface AzkarItem {
  id: string;
  category: 'morning' | 'evening' | 'post_prayer' | 'daily' | 'asmaul_husna' | 'custom';
  titleBn: string;
  titleEn: string;
  arabicText: string;
  transliterationBn: string;
  translationBn: string;
  referenceBn: string;
  targetCount: number;
  completedCount: number;
  isCompleted?: boolean;
  isCustom?: boolean;
}

export interface QuizQuestion {
  id: number;
  categoryBn: string;
  categoryEn: string;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctAnswerIndex: number;
  explanationBn: string;
  explanationEn: string;
  sahihReferenceBn: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  detectedLanguage?: string;
}

export interface SurahItem {
  number: number;
  nameAr: string;
  nameBn: string;
  nameEn: string;
  meaningBn: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeBn: string;
  audioUrl: string;
  reciterNameBn: string;
}

export interface MonthlySignificanceInfo {
  monthIndexHijri: number;
  monthNameBn: string;
  hijriYear: number;
  bengaliMonthName: string;
  gregorianMonthName: string;
  historicalEventsBn: string[];
  keyVirtuesBn: string[];
  recommendedAmalBn: string[];
  specialDaysBn: { date: string; titleBn: string; descriptionBn: string }[];
}

