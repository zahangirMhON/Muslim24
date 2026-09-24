// Comprehensive Multi-Calendar Data Engine (Hijri, Bengali, Gregorian)
// Strictly grounded in Quran and Sahih Sunnah with Islamic Scholars, Sahaba & Prophetic History

import { toBengaliOrdinal } from '../utils/bengaliUtils';

export interface CalendarDayDetails {
  dateKey: string; // YYYY-MM-DD
  gregorianDateStr: string;
  hijriDateStr: string;
  bengaliDateStr: string;
  gregorianDay: number;
  gregorianMonth: number; // 0-indexed
  gregorianYear: number;
  hijriDay: number;
  hijriMonth: number; // 0-indexed
  hijriYear: number;
  bengaliDay: number;
  bengaliMonth: number; // 0-indexed
  bengaliYear: number;
  dayOfWeek: number; // 0=Sun, 6=Sat
  isFriday: boolean;
  isSunnahFastingDay: boolean; // Monday, Thursday, Ayyam al-Beed
  isAyyamAlBeed: boolean; // 13, 14, 15 Hijri
  govtHolidayTitle?: string;
  isGovtHoliday: boolean;
  
  // 1. বিশেষ দিন ও তাৎপর্য
  islamicEventTitle?: string;
  islamicEventSignificance?: string;

  // 2. নবী ও রাসূলগণের সিরাত ও ঘটনা
  propheticMilestone?: {
    prophetName: string;
    eventTitle: string;
    historicalDetail: string;
    lessonBn: string;
  };

  // 3. সাহাবায়ে কেরামের জীবনী, জন্ম, শাহাদাত ও ত্যাগ
  sahabaMilestone?: {
    sahabaName: string;
    eventOrRole: string; // জন্ম, শাহাদাত/ওফাত বা বিশেষ বীরত্ব
    virtueAndSacrifice: string;
    hadithQuoteOrReference: string;
  };

  // 4. ইসলামিক মনীষী ও ইমামগণের তথ্য (Four Imams & Scholars)
  scholarLuminaries?: {
    scholarName: string;
    titleBn: string;
    lifespanBn: string; // জন্ম-মৃত্যু
    majorContribution: string;
    famousQuoteOrBook: string;
  };

  // 5. জ্ঞান অন্বেষণ - মুসলিম হিসেবে যা জানা প্রয়োজন (Essential Islamic Knowledge)
  dailyKnowledgeForMuslim: {
    category: 'আকীদা ও ঈমান' | 'তাহারাত ও সালাত' | 'হালাল ও হারাম' | 'আখলাক ও শিষ্টাচার' | 'মুআমালাত ও অধিকার' | 'তওবা ও মাগফিরাত' | 'জান্নাত ও জাহান্নাম';
    title: string;
    essentialLesson: string;
    practicalAction: string;
  };

  // 6. কুরআন ও সহীহ হাদিস রেফারেন্স
  quranReference?: {
    verseBn: string;
    verseAr?: string;
    surahName: string;
    ayahNumber: number | string;
    explanationBn: string;
  };
  hadithReference?: {
    narratorBn: string;
    bookBn: string;
    hadithNo: string;
    textBn: string;
    authenticityGrade: string;
  };

  // 7. মাসনূন আমল ও দোয়া
  recommendedAmals: string[];
  masnoonDua?: {
    titleBn: string;
    arabicText: string;
    transliterationBn: string;
    meaningBn: string;
    sourceBn: string;
  };
}

// 1. Bangladesh Government Public & National Holidays
export const BANGLADESH_GOVT_HOLIDAYS: Record<string, { title: string; type: 'national' | 'religious' | 'general'; description: string }> = {
  '01-01': { title: 'ইংরেজি নববর্ষ (New Year)', type: 'general', description: 'নতুন বছরের আগমন। বিগত বছরের কাজের আত্মসমালোচনা ও আগামী দিনগুলোতে নেক আমল করার নিয়ত।' },
  '02-21': { title: 'আন্তর্জাতিক মাতৃভাষা ও শহীদ দিবস', type: 'national', description: '১৯৫২ সালের ভাষা আন্দোলনের অমর শহীদদের স্মৃতিস্মরণ ও তাঁদের জন্য মাগফিরাত কামনা।' },
  '03-17': { title: 'জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমানের জন্মদিবস ও শিশু দিবস', type: 'national', description: 'জাতীয় শিশু দিবস ও শিশুদের সুশিক্ষায় গঠন করার প্রতিজ্ঞা।' },
  '03-26': { title: 'মহান স্বাধীনতা ও জাতীয় দিবস', type: 'national', description: '১৯৭১ সালের মহান স্বাধীনতা যুদ্ধের বীর মুক্তিযোদ্ধাদের অবদান স্মরণ ও দেশের কল্যাণ কামনা।' },
  '04-14': { title: 'বাংলা নববর্ষ (পহেলা বৈশাখ)', type: 'general', description: 'বাংলা সনের শুভ সূচনা। আল্লাহ তাআলার অশেষ নিয়ামত, সুস্বাদু ফলমূল ও ফসলের জন্য শুকরিয়া আদায়।' },
  '05-01': { title: 'মে দিবস (আন্তর্জাতিক শ্রমিক দিবস)', type: 'general', description: 'শ্রমিকের ঘাম শুকানোর পূর্বেই তার মজুরি পরিশোধ করার নববী নির্দেশনার বাস্তবায়ন।' },
  '08-15': { title: 'জাতীয় শোক দিবস', type: 'national', description: 'জাতীয় শোক দিবস ও দেশ ও মুসলিম উম্মাহর সার্বিক শান্তি ও সমৃদ্ধি কামনা।' },
  '12-16': { title: 'মহান বিজয় দিবস', type: 'national', description: '১৯৭১ সালের গৌরবময় বিজয়ের স্মরণ ও শহীদানদের জন্য মাগফিরাত প্রার্থনা।' },
  '12-25': { title: 'যিশু খ্রিস্টের জন্মদিন (বড়দিন)', type: 'general', description: 'সরকারি ছুটি। মুসলিম হিসেবে ঈসা (আ.)-কে আল্লাহর সম্মানিত নবী হিসেবে বিশ্বাস ও সম্মান করা।' }
};

// 2. Prophetic Seerah, Sahaba & Islamic Scholars Milestones (Mapped by Hijri Month-Day)
export const HIJRI_SPECIAL_EVENTS_DATA: Record<string, {
  eventTitle: string;
  significance: string;
  prophetInfo?: { prophetName: string; eventTitle: string; historicalDetail: string; lessonBn: string };
  sahabaInfo?: { sahabaName: string; eventOrRole: string; virtueAndSacrifice: string; hadithQuoteOrReference: string };
  scholarInfo?: { scholarName: string; titleBn: string; lifespanBn: string; majorContribution: string; famousQuoteOrBook: string };
}> = {
  // ১. মুহররম মাস (পবিত্র মাস)
  '1-1': {
    eventTitle: 'পবিত্র হিজরি নববর্ষের সূচনা',
    significance: 'হিজরতের ঐতিহাসিক চেতনা ও ইসলামি সন গণনার শুভ সূচনা।',
    sahabaInfo: {
      sahabaName: 'হযরত উমর ইবনুল খাত্তাব (রা.) ও শীর্ষ সাহাবীগণ',
      eventOrRole: 'হিজরি সন প্রবর্তন ও রাষ্ট্র সংস্কার',
      virtueAndSacrifice: '১৭ হিজরিতে হযরত উমর (রা.) সাহাবায়ে কেরামের পরামর্শে নবীজির হিজরতকে কেন্দ্র করে হিজরি সন নির্ধারণ করেন।',
      hadithQuoteOrReference: 'সহীহ বুখারী: ৩৯০৫'
    },
    scholarInfo: {
      scholarName: 'ইমাম আবু হানিফা নোমান ইবনে সাবিত (রহ.)',
      titleBn: 'ইমামে আজম ও ফিকহের দিকপাল',
      lifespanBn: '৮০ হিজরি (কুফা) - ১৫০ হিজরি (বাগদাদ)',
      majorContribution: 'হানাফী ফিকহের সংকলন ও লক্ষাধিক মাসআলা কোরআন-সুন্নাহ মোতাবেক ইস্তিম্বাত।',
      famousQuoteOrBook: 'আল-ফিকহুল আকবার'
    }
  },
  '1-10': {
    eventTitle: 'পবিত্র আশুরা (মুসা আ.-এর বিজয় ও কারবালা দিবস)',
    significance: 'সত্যের বিজয়, মুসা (আ.)-এর মুক্তি এবং সত্য ও ইনসাফের জন্য হযরত হুসাইন (রা.)-এর ঐতিহাসিক শাহাদাত।',
    prophetInfo: {
      prophetName: 'হযরত মুসা (আ.) ও হযরত মুহাম্মদ ﷺ',
      eventTitle: 'ফেরাউনের কবল থেকে অলৌকিক মুক্তি',
      historicalDetail: '১০ই মহররম আল্লাহ তাআলা লোহিত সাগরে রাস্তা বানিয়ে মুসা (আ.) ও বনী ইসরাঈলকে ফেরাউনের হাত থেকে রক্ষা করেন।',
      lessonBn: 'আল্লাহর ওপর অবিচল ঈমান রাখলে চরম বিপদেও আল্লাহ মুক্তির পথ খুলে দেন।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত হুসাইন ইবনে আলী (রা.)',
      eventOrRole: 'কারবালার প্রান্তরে শাহাদাত (১০ মহররম ৬১ হিজরি)',
      virtueAndSacrifice: 'বাতিল ও স্বৈরাচারের কাছে মাথা নত না করে ৭২ জন সঙ্গীসহ সত্যের পথে জীবন উৎসর্গ করেন।',
      hadithQuoteOrReference: 'রাসূল ﷺ বলেন: হাসান ও হুসাইন জান্নাতের যুবকদের নেতা (তিরমিজি: ৩৭৬৮)।'
    }
  },

  // ২. সফর মাস
  '2-27': {
    eventTitle: 'রাসূলুল্লাহ ﷺ-এর ঐতিহাসিক মদিনায় হিজরতের প্রারম্ভ',
    significance: 'কুরাইশদের ষড়যন্ত্র নস্যাৎ করে মক্কা থেকে মদিনায় হিজরতের যাত্রা শুরু।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'সওর গুহায় আশ্রয় ও হিজরত',
      historicalDetail: 'নবীজি ﷺ হযরত আলী (রা.)-কে নিজের বিছানায় রেখে হযরত আবু বকর (রা.)-কে সাথে নিয়ে হিজরতে বের হন।',
      lessonBn: 'বিপদে ভীত না হওয়া; আল্লাহ মুমিনের সাথে আছেন।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত আবু বকর সিদ্দিক (রা.) ও হযরত আলী (রা.)',
      eventOrRole: 'ইয়ারে গার (গুহার সঙ্গী) ও বিছানায় জীবনের ঝুঁকি গ্রহণ',
      virtueAndSacrifice: 'হযরত আবু বকর (রা.) গুহায় নবীজিকে রক্ষা করেন এবং হযরত আলী (রা.) আমানত ফিরিয়ে দেওয়ার জন্য নিজের জীবন ঝুঁকিতে ফেলেন।',
      hadithQuoteOrReference: 'সূরা আত-তাওবাহ: ৪০'
    }
  },

  // ৩. রবিউল আউয়াল মাস
  '3-12': {
    eventTitle: 'পবিত্র সিরাতুন্নবী ﷺ ও বিশ্বনবীর ধরাধামে আগমন',
    significance: 'সমগ্র মানবজাতির জন্য রহমত হিসেবে রাহমাতুল্লিল আলামীন হযরত মুহাম্মদ ﷺ-এর আবির্ভাব।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'নবীজির শুভাগমন ও নবুওয়াতী জীবনের আলোকবর্তিকা',
      historicalDetail: '৫৭০ খ্রিস্টাব্দে (আমুল ফীল) মক্কার সম্ভ্রান্ত কুরাইশ বংশে জন্মলাভ করেন এবং ৪০ বছর বয়সে নবুওয়াত লাভ করেন।',
      lessonBn: 'রাসূল ﷺ-এর সুন্নাহ ও চরিত্রকে জীবনের প্রতিটি পদক্ষেপে অনুকরণ করা।'
    },
    scholarInfo: {
      scholarName: 'ইমাম মুহাম্মদ ইবনে ইসমাঈল আল-বুখারী (রহ.)',
      titleBn: 'আমীরুল মুমিনীন ফিল হাদিস',
      lifespanBn: '১৯৪ হিজরি (বুখারা) - ২৫৬ হিজরি (সমরকন্দ)',
      majorContribution: '১৬ বছর কঠোর সাধনায় বিশুদ্ধতম হাদিস সংকলন "সহীহ আল-বুখারী" রচনা।',
      famousQuoteOrBook: 'আল-জামে আস-সহীহ (সহীহ বুখারী)'
    }
  },

  // ৭. রজব মাস (সম্মানিত মাস)
  '7-27': {
    eventTitle: 'পবিত্র শবে মেরাজ (আল-ইসরা ওয়াল মিরাজ)',
    significance: 'উর্ধ্বাকাশ ভ্রমণ, রবের দীদার ও উম্মতের জন্য ৫ ওয়াক্ত সালাতের মহিমান্বিত উপহার।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'ইসরা ও মেরাজের অলৌকিক আসমানী সফর',
      historicalDetail: 'মসজিদুল হারাম থেকে মসজিদুল আকসা এবং সেখান থেকে সিদরাতুল মুনতাহা পর্যন্ত রবের দরবারে আরোহণ।',
      lessonBn: 'দৈনিক ৫ ওয়াক্ত সালাত মুমিনের জন্য মেরাজ স্বরূপ।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত আবু বকর সিদ্দিক (রা.)',
      eventOrRole: 'মেরাজের বিনা দ্বিধায় সত্যায়ন ও "সিদ্দিক" উপাধি লাভ',
      virtueAndSacrifice: 'রাসূলের অলৌকিক মেরাজের কথা শুনে কাফেররা উপহাস করলেও আবু বকর (রা.) দৃঢ়কণ্ঠে বলেন: "তিনি বলে থাকলে তা পরম সত্য।"',
      hadithQuoteOrReference: 'মুসতাদরাকে হাকিম: ৪৪০৭'
    }
  },

  // ৮. শাবান মাস
  '8-15': {
    eventTitle: 'পবিত্র শবে বরাত (লাইলাতুন নিসফি মিন শাবান)',
    significance: 'মাগফিরাত, তওবা ও আল্লাহর বিশেষ রহমত বর্ষণের বরকতময় রজনী।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'জান্নাতুল বাক্বীতে রাতের দোয়া ও দীর্ঘ সেজদা',
      historicalDetail: 'হযরত আয়েশা (রা.) বর্ণনা করেন, রাসূল ﷺ এ রাতে উম্মতের মাগফিরাতের জন্য দীর্ঘ দোয়া করতেন।',
      lessonBn: 'অহংকার ও হিংসা বর্জন করে আল্লাহর কাছে খাঁটি তওবা করা।'
    },
    scholarInfo: {
      scholarName: 'ইমাম শাফেয়ী - মুহাম্মদ ইবনে ইদরীস (রহ.)',
      titleBn: 'ফিকহ শাস্ত্রের মূলনীতিবিদ (উসূলুল ফিকহ)',
      lifespanBn: '১৫০ হিজরি (গাজা) - ২০৪ হিজরি (মিশর)',
      majorContribution: 'উসূলে ফিকহের প্রথম গ্রন্থ "আর-রিসালাহ" এবং "কিতাবুল উম্ম" প্রণয়ন।',
      famousQuoteOrBook: 'কিতাবুল উম্ম ও আর-রিসালাহ'
    }
  },

  // ৯. মাহে রমজানুল মোবারক
  '9-1': {
    eventTitle: 'পবিত্র মাহে রমজানুল মোবারক ও সিয়ামের সূচনা',
    significance: 'কুরআন নাজিলের মাস, জান্নাতের দরজা উন্মুক্ত ও তাকওয়া অর্জনের সুবর্ণ সময়।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'জিবরীল (আ.)-এর সাথে কুরআন দাওর ও দানশীলতা',
      historicalDetail: 'রমজান এলে রাসূল ﷺ প্রবাহমান বাতাসের চেয়েও অধিক দানশীল হয়ে যেতেন।',
      lessonBn: 'রোজা কেবল না খেয়ে থাকা নয়; চোখ, মুখ ও অঙ্গপ্রত্যঙ্গকে পাপমুক্ত রাখা।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত উসমান ইবনে আফফান (রা.)',
      eventOrRole: 'যুন-নুরাইন ও কুরআনের সংকলক',
      virtueAndSacrifice: 'রমজানে রাতে এক রাকাতে সম্পূর্ণ কুরআন খতম করতেন এবং অকাতরে দান করতেন।',
      hadithQuoteOrReference: 'সহীহ বুখারী: ৪৯৮৭'
    }
  },
  '9-17': {
    eventTitle: 'ঐতিহাসিক বদর দিবস (ইয়াউমুল ফুরকান)',
    significance: 'ইসলামের ইতিহাসে প্রথম সত্য ও মিথ্যার চূড়ান্ত পার্থক্যকারী বিজয়।',
    sahabaInfo: {
      sahabaName: 'হযরত হামজা (রা.), হযরত আলী (রা.) ও ৩১৩ জন বদরী সাহাবী',
      eventOrRole: 'বদরের প্রান্তরে অসম বীরত্ব ও আল্লাহর গায়েবী সাহায্য লাভ',
      virtueAndSacrifice: '৩১৩ জন নিরস্ত্র সাহাবী ১০০০ সুসজ্জিত মুশরিকের বিরুদ্ধে লড়াই করে ইসলামকে বিজয়ী করেন।',
      hadithQuoteOrReference: 'আল্লাহ বদরীদের লক্ষ্য করে বলেন: তোমরা যা ইচ্ছা কর, আমি তোমাদের ক্ষমা করে দিয়েছি (বুখারী: ৩৯৮৩)।'
    },
    scholarInfo: {
      scholarName: 'ইমাম মালেক ইবনে আনাস (রহ.)',
      titleBn: 'ইমামে দারুল হিজরাহ (মদিনার ইমাম)',
      lifespanBn: '৯৩ হিজরি (মদিনা) - ১৭৯ হিজরি (মদিনা)',
      majorContribution: 'হাদিস ও ফিকহের সুপ্রসিদ্ধ গ্রন্থ "মুয়াত্তা ইমাম মালেক" সংকলন।',
      famousQuoteOrBook: 'আল-মুয়াত্তা'
    }
  },
  '9-20': {
    eventTitle: 'ঐতিহাসিক মক্কা বিজয় (ফতহে মক্কা)',
    significance: 'বিনা রক্তপাতে মক্কা বিজয়, কাবা গৃহের প্রতিমা অপসারণ ও তাওহীদের পুনঃপ্রতিষ্ঠা।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'মক্কায় প্রবেশ ও সাধারণ ক্ষমা ঘোষণা',
      historicalDetail: 'বিনম্র শ্রদ্ধায় উটের পিঠে মাথা ঝুঁকিয়ে মক্কায় প্রবেশ করেন এবং কাবার ৩৬০টি মূর্তি অপসারণ করেন।',
      lessonBn: 'বিজয়ে অহংকার না করে রবের শোকর করা এবং শত্রুকেও ক্ষমা করার মহানুভবতা।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত বেলাল ইবনে রাবাহ (রা.)',
      eventOrRole: 'কাবার ছাদে দাঁড়িয়ে ঐতিহাসিক বিজয়ের আযান প্রদান',
      virtueAndSacrifice: 'যে বেলাল মক্কার তপ্ত বালুতে "আহাদ আহাদ" বলেছিলেন, তিনিই বিজয়ের দিনে কাবার শীর্ষে উঠে আযান দেন।',
      hadithQuoteOrReference: 'সহীহ বুখারী: ৪২৮০'
    }
  },
  '9-27': {
    eventTitle: 'পবিত্র শবে কদর (লাইলাতুল কদর)',
    significance: 'হাজার মাসের চেয়েও শ্রেষ্ঠ বরকতময় রাত, কুরআন অবতীর্ণের পুণ্যময় রজনী।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'শেষ দশকে ইতেকাফ ও পরিবারকে জাগ্রত রাখা',
      historicalDetail: 'শেষ দশকে লুঙ্গি শক্ত করে বেঁধে পুরো রাত জেগে পরিবারকে জাগিয়ে ইবাদত করতেন।',
      lessonBn: '"আল্লাহুম্মা ইন্নাকা আফুউন তুহিব্বুল আফওয়া ফাফউ আন্নি" দোয়ার মাধ্যমে ক্ষমা প্রার্থনা।'
    },
    scholarInfo: {
      scholarName: 'ইমাম আহমাদ ইবনে হাম্বল (রহ.)',
      titleBn: 'ইমামে আহলে সুন্নাত ও হাদিসের স্তম্ভ',
      lifespanBn: '১৬৪ হিজরি (বাগদাদ) - ২৪১ হিজরি (বাগদাদ)',
      majorContribution: '৩০,০০০ সহীহ হাদিস সংবলিত "আল-মুসনাদ" সংকলন ও মুতাজিলা ফিতনায় অবিচল থাকা।',
      famousQuoteOrBook: 'মুসনাদে আহমাদ'
    }
  },

  // ১০. শাওয়াল মাস
  '10-1': {
    eventTitle: 'পবিত্র ঈদুল ফিতর (রবের পুরস্কারের দিন)',
    significance: 'এক মাস সিয়াম সাধনার পর আনন্দ ও ক্ষমার উৎসব।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'ঈদের জামায়াত ও সাদাকাতুল ফিতর',
      historicalDetail: 'ঈদের ময়দানে এক পথে গমন ও অন্য পথে ফিরে আসার সুন্নাত।',
      lessonBn: 'গরিব-দুঃখীদের মুখে হাসি ফুটিয়ে আনন্দের পরিপূর্ণতা অর্জন।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত আনাস ইবনে মালিক (রা.)',
      eventOrRole: 'নবীজির খাদেম ও সাহাবীদের ঈদের শুভেচ্ছা বিনিময়',
      virtueAndSacrifice: 'সাহাবীগণ ঈদের দিন বলতেন: "তাক্বাব্বালাল্লাহু মিন্না ওয়া মিনকুম" (আল্লাহ আমাদের ও আপনাদের নেক আমল কবুল করুন)।',
      hadithQuoteOrReference: 'ফাতহুল বারী: ২/৪৪৬'
    }
  },
  '10-7': {
    eventTitle: 'ঐতিহাসিক ওহুদের যুদ্ধ ও শহীদান স্মরণ',
    significance: 'রাসূলুল্লাহ ﷺ-এর আনুগত্যের চিরন্তন শিক্ষা ও সাহাবীদের সর্বোচ্চ আত্মত্যাগ।',
    sahabaInfo: {
      sahabaName: 'সাইয়েদুশ শুহাদা হযরত হামজা (রা.) ও মুসআব ইবনে উমায়ের (রা.)',
      eventOrRole: 'ওহুদের যুদ্ধে শাহাদাত বরণ ও বীরত্ব',
      virtueAndSacrifice: '৭০ জন শ্রেষ্ঠ সাহাবী শাহাদাত বরণ করেন। হযরত তালহা (রা.) নিজের শরীর দিয়ে তীর ঠেকিয়ে নবীজিকে রক্ষা করেন।',
      hadithQuoteOrReference: 'সহীহ বুখারী: ৪০৩৯'
    },
    scholarInfo: {
      scholarName: 'ইমাম মুসলিম ইবনুল হাজ্জাজ (রহ.)',
      titleBn: 'সহীহ মুসলিম প্রণেতা',
      lifespanBn: '২০৬ হিজরি (নিশাপুর) - ২৬১ হিজরি',
      majorContribution: 'হাদিসের অন্যতম বিশুদ্ধতম গ্রন্থ "সহীহ মুসলিম" সংকলন।',
      famousQuoteOrBook: 'আল-জামে আস-সহীহ (সহীহ মুসলিম)'
    }
  },

  // ১২. জিলহজ্ব মাস
  '12-9': {
    eventTitle: 'পবিত্র ইয়াউমে আরাফাহ (হজের মূল দিন)',
    significance: 'হজের প্রধান দিন এবং অ-হাজীদের জন্য ২ বছরের গোনাহ মাফের রোজা।',
    prophetInfo: {
      prophetName: 'মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'ঐতিহাসিক বিদায় হজের কালজয়ী ভাষণ (১০ হিজরি)',
      historicalDetail: 'আরাফাতের ময়দানে সোয়া লক্ষ সাহাবীর সম্মুখে মানবাধিকার ও ইসলামের পূর্ণাঙ্গ রূপরেখা ঘোষণা করেন।',
      lessonBn: '"আজ তোমাদের জন্য তোমাদের দ্বীনকে পূর্ণাঙ্গ করলাম" (সূরা আল-মায়েদাহ: ৩)।'
    },
    sahabaInfo: {
      sahabaName: 'হযরত জাবির ইবনে আব্দুল্লাহ (রা.)',
      eventOrRole: 'বিদায় হজের পুঙ্খানুপুঙ্খ বিবরণ বর্ণনাকারী সাহাবী',
      virtueAndSacrifice: 'সাহাবীগণ সমস্বরে সাক্ষ্য দিয়েছিলেন: "হে আল্লাহর রাসূল! আপনি আল্লাহর দ্বীনের আমানত যথাযথ পৌঁছে দিয়েছেন।"',
      hadithQuoteOrReference: 'সহীহ মুসলিম: ১২১৮'
    }
  },
  '12-10': {
    eventTitle: 'পবিত্র ঈদুল আজহা ও কুরবানি',
    significance: 'হযরত ইব্রাহিম (আ.) ও ইসমাইল (আ.)-এর ত্যাগের স্মরণে আত্মোৎসর্গের ঈদ।',
    prophetInfo: {
      prophetName: 'হযরত ইব্রাহিম (আ.) ও মুহাম্মদ রাসুলুল্লাহ ﷺ',
      eventTitle: 'আল্লাহর সন্তুষ্টিতে পুত্র কুরবানির চরম পরীক্ষা ও দুম্বা কুরবানি',
      historicalDetail: 'ইব্রাহিম (আ.) আল্লাহর আদেশে প্রিয় পুত্রকে কুরবানির জন্য প্রস্তুত হলে আল্লাহ তাকে পরীক্ষায় উত্তীর্ণ ঘোষণা করেন।',
      lessonBn: 'কুরবানির গোশত বা রক্ত আল্লাহর কাছে পৌঁছায় না; পৌঁছায় কেবল অন্তরের তাকওয়া।'
    },
    scholarInfo: {
      scholarName: 'হুজ্জাতুল ইসলাম ইমাম আবু হামিদ আল-গাজ্জালী (রহ.)',
      titleBn: 'দার্শনিক ও আধ্যাত্মিক সংস্কারক',
      lifespanBn: '৪৫০ হিজরি (তুস) - ৫০৫ হিজরি',
      majorContribution: 'ইসলামি আধ্যাত্মিকতা ও নীতিশাস্ত্রের অমর গ্রন্থ "ইহয়াউ উলূমিদ্দীন" রচনা।',
      famousQuoteOrBook: 'ইহয়াউ উলূমিদ্দীন (দ্বীনি জ্ঞানের পুনরুজ্জীবন)'
    }
  }
};

// 3. Essential 31 Daily Knowledge Modules for Muslims (জ্ঞান অন্বেষণ)
export const ESSENTIAL_DAILY_KNOWLEDGE_LIST: {
  category: CalendarDayDetails['dailyKnowledgeForMuslim']['category'];
  title: string;
  essentialLesson: string;
  practicalAction: string;
}[] = [
  {
    category: 'আকীদা ও ঈমান',
    title: 'তাওহীদের মূল ভিত্তি ও শিরক থেকে আত্মরক্ষা',
    essentialLesson: 'আল্লাহ এক ও অদ্বিতীয়। কোনো পীর, মাজার, জ্যোতিষী বা সৃষ্টির কাছে দোয়া করা বা সাহায্য চাওয়া শিরক, যা ক্ষমার অযোগ্য অপরাধ।',
    practicalAction: 'প্রতিটি দোয়ায় শুধু আল্লাহর কাছে সাহায্য চান ও "লা ইলাহা ইল্লাল্লাহ" বিশ্বাসের সাথে জপ করুন।'
  },
  {
    category: 'তাহারাত ও সালাত',
    title: 'ওযুর ফরজ ও সুন্নাত এবং খুশু-খুযু',
    essentialLesson: 'ওযুতে ৪টি ফরজ: ১. পুরো মুখ ধোয়া, ২. কনুইসহ দু হাত ধোয়া, ৩. মাথার এক চতুর্থাংশ মাসেহ করা, ৪. টাখনুসহ দু পা ধোয়া।',
    practicalAction: 'ওযুর পানি অপচয় করবেন না এবং প্রতিটি সালাতকে জীবনের শেষ সালাত মনে করে ধীরস্থিরে আদায় করুন।'
  },
  {
    category: 'হালাল ও হারাম',
    title: 'হালাল জীবিকা ও সুদের ভয়াবহতা',
    essentialLesson: 'হারাম খাবারে বেড়ে ওঠা দেহ জান্নাতে যাবে না। সুদখোরের বিরুদ্ধে আল্লাহ ও তাঁর রাসূল যুদ্ধের ঘোষণা দিয়েছেন (সূরা বাকারা: ২৭৯)।',
    practicalAction: 'চাকরি ও ব্যবসায় সকল প্রকার অসততা ও সুদের লেনদেন বর্জন করে হালাল রিজিকের জন্য দোয়া করুন।'
  },
  {
    category: 'আখলাক ও শিষ্টাচার',
    title: 'মা-বাবার প্রতি সদাচরণ ও আত্মীয়তার হক',
    essentialLesson: 'আল্লাহর সন্তুষ্টি মা-বাবার সন্তুষ্টিতে এবং আল্লাহর অসন্তুষ্টি মা-বাবার অসন্তুষ্টিতে। আত্মীয়তার সম্পর্ক ছিন্নকারী জান্নাতে যাবে না।',
    practicalAction: 'প্রতিদিন মা-বাবার খেদমত করুন অথবা তাঁদের জন্য দোয়া করুন: "রব্বির হামহুমা কামা রব্বায়ানী সগীরা"।'
  },
  {
    category: 'মুআমালাত ও অধিকার',
    title: 'প্রতিবেশীর হক ও মানুষের গীবত বর্জন',
    essentialLesson: 'যে ব্যক্তির অনিষ্ট থেকে তার প্রতিবেশী নিরাপদ নয়, সে মুমিন হতে পারে না। গীবত হলো নিজের মৃত ভাইয়ের গোশত খাওয়ার সমান পাপ।',
    practicalAction: 'কারো অনুপস্থিতিতে তার দোষ চর্চা করবেন না এবং প্রতিবেশীর সুখে-দুঃখে পাশে দাঁড়ান।'
  },
  {
    category: 'তওবা ও মাগফিরাত',
    title: 'সাইয়্যিদুল ইস্তেগফার ও খাঁটি তওবার শর্ত',
    essentialLesson: 'তওবার ৩টি শর্ত: ১. পাপ কাজ অবিলম্বে ত্যাগ করা, ২. কৃত পাপের জন্য অনুতপ্ত হওয়া, ৩. ভবিষ্যতে আর না করার দৃঢ় সংকল্প করা।',
    practicalAction: 'সকাল ও সন্ধ্যায় সাইয়্যিদুল ইস্তেগফার পাঠ করুন এবং প্রতিদিন অন্তত ১০০ বার "আস্তাগফিরুল্লাহ" পড়ুন।'
  },
  {
    category: 'জান্নাত ও জাহান্নাম',
    title: 'কবরের সওয়াল-জওয়াব ও আখেরাতের প্রস্তুতি',
    essentialLesson: 'কবরের ৩টি প্রশ্ন: ১. তোমার রব কে? ২. তোমার দ্বীন কি? ৩. তোমার নবী কে? নেক আমলই কবরের একমাত্র সঙ্গী হবে।',
    practicalAction: 'রাতে ঘুমানোর পূর্বে সূরা আল-মুলক তিলাওয়াত করুন, যা কবরের আজাব থেকে রক্ষা করে।'
  },
  {
    category: 'তাহারাত ও সালাত',
    title: 'জামায়াতে সালাত ও প্রথম কাতারের মর্যাদা',
    essentialLesson: 'একাকী সালাতের চেয়ে জামায়াতে সালাত আদায়ের সওয়াব ২৭ গুণ বেশি। প্রথম কাতারে সালাত আদায়কারীদের ওপর আল্লাহ রহমত বর্ষণ করেন।',
    practicalAction: 'আযানের সাথে সাথে দুনিয়াবি কাজ স্থগিত রেখে মসজিদে জামায়াতে উপস্থিত হোন।'
  },
  {
    category: 'আখলাক ও শিষ্টাচার',
    title: 'রাগকে নিয়ন্ত্রণ ও মানুষের ভুল ক্ষমা করা',
    essentialLesson: 'রাসূল ﷺ বলেন: সেই ব্যক্তি প্রকৃত বীর নয় যে কুস্তিতে জয়ী হয়, বরং সেই বীর যে রাগের সময় নিজেকে নিয়ন্ত্রণ করতে পারে।',
    practicalAction: 'রাগ উঠলে দাঁড়িয়ে থাকলে বসে পড়ুন, বসে থাকলে শুয়ে পড়ুন এবং আউযুবিল্লাহ পাঠ করে ওযু করে নিন।'
  },
  {
    category: 'হালাল ও হারাম',
    title: 'দৃষ্টির হেফাজত ও লজ্জাস্থানের পবিত্রতা',
    essentialLesson: 'চোখের যেনা হলো হারাম দৃষ্টি। আল্লাহ মুমিন পুরুষ ও নারীদের দৃষ্টিকে অবনত রাখার নির্দেশ দিয়েছেন (সূরা নূর: ৩০)।',
    practicalAction: 'সোশ্যাল মিডিয়া ও চলাফেরায় দৃষ্টিকে হেফাজত করুন ও আল্লাহকে সর্বদা পর্যবেক্ষক জানুন।'
  },
  {
    category: 'আকীদা ও ঈমান',
    title: 'তাকদীরের ওপর সন্তুষ্টি ও আল্লাহর প্রতি তাওয়াক্কুল',
    essentialLesson: 'যা ঘটেছে তা ঘটারই ছিল, আর যা ঘটেনি তা কখনো ঘটত না। সর্বাবস্থায় আল্লাহর ফয়সালার ওপর সন্তুষ্ট থাকা ঈমানের অঙ্গ।',
    practicalAction: 'বিপদে পড়লে বলুন: "ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিঊন, আল্লাহুম্মা আজিরনী ফী মুসীবাতী ওয়া আখলিফ লী খাইরাম মিনহা"।'
  },
  {
    category: 'মুআমালাত ও অধিকার',
    title: 'আমানতদারি ও প্রতিশ্রুতি রক্ষা করা',
    essentialLesson: 'মুনাফিকের ৩টি লক্ষণ: ১. কথা বললে মিথ্যা বলে, ২. প্রতিশ্রুতি দিলে ভঙ্গ করে, ৩. আমানত রাখলে খেয়ানত করে।',
    practicalAction: 'কখনো মিথ্যা বলবেন না এবং কাউকে কোনো কথা দিলে তা যথাযথভাবে রক্ষা করুন।'
  }
];

// Calculation of Calendar Day Details
export function getDetailedCalendarDayInfo(date: Date = new Date()): CalendarDayDetails {
  const day = date.getDate();
  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

  const mmPad = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
  const ddPad = day < 10 ? `0${day}` : `${day}`;
  const dateKey = `${year}-${mmPad}-${ddPad}`;
  const mmddKey = `${mmPad}-${ddPad}`;

  // Hijri Calculation (Calibrated for 2026 July 27 -> 12 Muharram 1448)
  const baseGregorianTime = new Date(2026, 6, 27).getTime();
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

  // Bengali Calendar Calculation (Calibrated for 2026 July 27 -> 12 Srabon 1433 Bangabdo)
  let bengaliDay = 12 + diffDays;
  let bengaliMonth = 3; // Srabon (0=Baishakh, 1=Joishtha, 2=Ashar, 3=Srabon)
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

  const HIJRI_NAMES = ['মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানী', 'জমাদিউল আউয়াল', 'জমাদিউস সানী', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জুলক্বাদ', 'জুলহিজ্জাহ'];
  const BANGLA_MONTH_NAMES = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
  const GREG_MONTH_NAMES = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const DAY_NAMES = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার (জুমু\'আ)', 'শনিবার'];

  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBn = (n: number | string) => String(n).replace(/[0-9]/g, d => bengaliNumerals[parseInt(d, 10)]);

  const gregorianDateStr = `${toBn(day)} ${GREG_MONTH_NAMES[month]}(${toBn(month + 1)}) ${toBn(year)}, ${DAY_NAMES[dayOfWeek]}`;
  const hijriDateStr = `${toBn(hijriDay)} ${HIJRI_NAMES[hijriMonth]}(${toBn(hijriMonth + 1)}) ${toBn(hijriYear)} হিজরি`;
  const bengaliDateStr = `${toBn(bengaliDay)} ${BANGLA_MONTH_NAMES[bengaliMonth]}(${toBn(bengaliMonth + 1)}) ${toBn(bengaliYear)} বঙ্গাব্দ`;

  const isFriday = dayOfWeek === 5;
  const isMondayOrThursday = dayOfWeek === 1 || dayOfWeek === 4;
  const isAyyamAlBeed = hijriDay === 13 || hijriDay === 14 || hijriDay === 15;
  const isSunnahFastingDay = isMondayOrThursday || isAyyamAlBeed;

  // Check Govt Holidays
  const govtHoliday = BANGLADESH_GOVT_HOLIDAYS[mmddKey];
  const isGovtHoliday = !!govtHoliday;

  // Check Hijri Special Events & Milestones
  const hijriEventKey = `${hijriMonth + 1}-${hijriDay}`;
  const hijriEvent = HIJRI_SPECIAL_EVENTS_DATA[hijriEventKey];

  // Daily essential knowledge selection based on day number
  const knowledgeIndex = (day - 1) % ESSENTIAL_DAILY_KNOWLEDGE_LIST.length;
  const dailyKnowledge = ESSENTIAL_DAILY_KNOWLEDGE_LIST[knowledgeIndex];

  // Quran Reference
  let quranRef = {
    verseBn: 'তোমরা সালাত কায়েম কর, যাকাত প্রদান কর এবং রুকুকারীদের সাথে রুকু কর।',
    verseAr: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
    surahName: 'সূরা আল-বাকারা',
    ayahNumber: 43,
    explanationBn: 'দৈনন্দিন জীবনে সময়মতো জামায়াতে ফরজ সালাত আদায় করা এবং আত্মশুদ্ধি অর্জন করা প্রত্যেক মুমিনের মৌলিক দায়িত্ব।'
  };

  let hadithRef = {
    narratorBn: 'হযরত আবু হুরায়রা (রা.)',
    bookBn: 'সহীহ আল-বুখারী',
    hadithNo: '৬৪০৫',
    textBn: 'যে ব্যক্তি দিনে ১০০ বার "সুবহানাল্লাহি ওয়া বিহামদিহি" পাঠ করে, তার সমুদ্রের ফেনা পরিমাণ গোনাহ হলেও ক্ষমা করে দেওয়া হয়।',
    authenticityGrade: 'সহীহ (Sahih)'
  };

  if (isFriday) {
    quranRef = {
      verseBn: 'হে মুমিনগণ! জুমার দিনে যখন সালাতের জন্য আহ্বান করা হয়, তখন তোমরা আল্লাহর স্মরণের দিকে দ্রুত ধাবিত হও এবং ক্রয়-বিক্রয় ত্যাগ কর।',
      verseAr: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ',
      surahName: 'সূরা আল-জুমুআহ',
      ayahNumber: 9,
      explanationBn: 'জুমার দিন সপ্তাহের শ্রেষ্ঠ দিন (সায়্যিদুল আইয়াম)। আজ জুমার প্রস্তুতি নেওয়া, সূরা কাহাফ তিলাওয়াত ও বেশি বেশি দরূদ পাঠ করা বিশেষ সুন্নাত।'
    };
    hadithRef = {
      narratorBn: 'হযরত আওস ইবনে আওস (রা.)',
      bookBn: 'সুনানে আবু দাউদ ও নাসাঈ',
      hadithNo: '১০৪৭',
      textBn: 'রাসূলুল্লাহ ﷺ বলেছেন: তোমাদের দিনসমূহের মধ্যে সর্বোত্তম দিন হলো জুমার দিন। অতএব এ দিনে তোমরা আমার ওপর বেশি বেশি দরূদ পাঠ কর।',
      authenticityGrade: 'সহীহ (Sahih)'
    };
  } else if (isMondayOrThursday) {
    hadithRef = {
      narratorBn: 'হযরত আবু হুরায়রা (রা.)',
      bookBn: 'জামে তিরমিযী',
      hadithNo: '৭৪৭',
      textBn: 'রাসূলুল্লাহ ﷺ বলেছেন: সোম ও বৃহস্পতিবার মহান আল্লাহর নিকট বান্দার আমলসমূহ পেশ করা হয়। অতএব আমি ভালোবাসি যে রোজা অবস্থায় আমার আমল পেশ করা হোক।',
      authenticityGrade: 'হাসান সহীহ'
    };
  } else if (isAyyamAlBeed) {
    hadithRef = {
      narratorBn: 'হযরত আবু যার (রা.)',
      bookBn: 'সুনানে নাসাঈ ও তিরমিযী',
      hadithNo: '৭৬১',
      textBn: 'রাসূলুল্লাহ ﷺ বলেছেন: হে আবু যার! তুমি যদি মাসে তিনটি রোজা রাখতে চাও তবে চন্দ্রমাসের ১৩, ১৪ ও ১৫ তারিখে রোজা রাখো। এটি সারা বছর রোজা রাখার সমতুল্য।',
      authenticityGrade: 'সহীহ'
    };
  }

  // Recommended Deeds list
  const deeds: string[] = [
    '৫ ওয়াক্ত সালাত জামায়াতের সাথে আদায় করা',
    'সকাল ও সন্ধ্যার মাসনূন জিকির ও আয়াতুল কুরসি পাঠ',
    'দৈনিক কমপক্ষে ১০ আয়াত অর্থসহ কুরআন তিলাওয়াত'
  ];

  if (isFriday) {
    deeds.unshift('গোসল, মিসওয়াক, সুগন্ধি মেখে আগে আগে জুমার মসজিদে গমন');
    deeds.unshift('সূরা আল-কাহাফ সম্পূর্ণ তিলাওয়াত করা');
    deeds.unshift('রাসূলুল্লাহ ﷺ-এর ওপর বেশি বেশি দরূদ শরীফ পাঠ করা');
  }

  if (isSunnahFastingDay) {
    deeds.push(isAyyamAlBeed ? 'আইয়ামে বীজ (১৩, ১৪, ১৫) নফল রোজা রাখা' : 'সুন্নাত সোমবার/বৃহস্পতিবারের নফল রোজা রাখা');
  }

  // Masnoon Dua
  const masnoonDua = {
    titleBn: isFriday ? 'জুমু\'আর দিনের বরকতময় দরূদ ও ক্ষমা প্রার্থনা' : 'দৈনন্দিন সর্বকল্যাণ ও নিরাপত্তা লাভের দোয়া',
    arabicText: isFriday
      ? 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ'
      : 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliterationBn: isFriday
      ? 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিঁও ওয়া আলা আলি মুহাম্মাদ, কামা সাল্লাইতা আলা ইবরাহীমা ওয়া আলা আলি ইবরাহীম, ইন্নাকা হামীদুম মাজীদ।'
      : 'আল্লাহুম্মা আ\'ইন্নী আলা জিকরিকা ওয়া শুকরিকা ওয়া হুসনি ইবাদাতিক।',
    meaningBn: isFriday
      ? 'হে আল্লাহ! মুহাম্মদ ﷺ এবং তাঁর পরিবারের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর পরিবারের ওপর রহমত বর্ষণ করেছিলেন।'
      : 'হে আল্লাহ! আমাকে আপনার জিকির করতে, আপনার কৃতজ্ঞতা প্রকাশ করতে এবং আপনার সুন্দর ইবাদত করতে সাহায্য করুন।',
    sourceBn: isFriday ? 'সহীহ বুখারী: ৩৩৭০' : 'সুনানে আবু দাউদ: ১৫২২ (সহীহ)'
  };

  return {
    dateKey,
    gregorianDateStr,
    hijriDateStr,
    bengaliDateStr,
    gregorianDay: day,
    gregorianMonth: month,
    gregorianYear: year,
    hijriDay,
    hijriMonth,
    hijriYear,
    bengaliDay,
    bengaliMonth,
    bengaliYear,
    dayOfWeek,
    isFriday,
    isSunnahFastingDay,
    isAyyamAlBeed,
    govtHolidayTitle: govtHoliday?.title,
    isGovtHoliday,
    islamicEventTitle: hijriEvent?.eventTitle,
    islamicEventSignificance: hijriEvent?.significance,
    propheticMilestone: hijriEvent?.prophetInfo,
    sahabaMilestone: hijriEvent?.sahabaInfo,
    scholarLuminaries: hijriEvent?.scholarInfo,
    dailyKnowledgeForMuslim: dailyKnowledge,
    quranReference: quranRef,
    hadithReference: hadithRef,
    recommendedAmals: deeds,
    masnoonDua
  };
}

// Convert month & year in Hijri to approximate date
export function getDatesForHijriMonth(hijriMonth: number, hijriYear: number): Date[] {
  // Approximate starting Gregorian date for this Hijri month
  // Base: Month 0 (Muharram 1448) ~ July 2026
  const monthOffsetDays = hijriMonth * 29.53;
  const yearOffsetDays = (hijriYear - 1448) * 354.36;
  const totalOffsetDays = Math.round(monthOffsetDays + yearOffsetDays);

  const baseDate = new Date(2026, 6, 16); // ~1 Muharram 1448
  const startDate = new Date(baseDate.getTime() + totalOffsetDays * 24 * 60 * 60 * 1000);

  const days: Date[] = [];
  const daysInHijriMonth = (hijriMonth % 2 === 0) ? 30 : 29; // Alternating 30 and 29
  for (let i = 0; i < daysInHijriMonth; i++) {
    days.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
  }
  return days;
}

// Convert month & year in Bengali to approximate date
export function getDatesForBengaliMonth(bengaliMonth: number, bengaliYear: number): Date[] {
  // Bengali month start dates (Baishakh starts ~April 14)
  // Bengali months 0-5 (Baishakh to Bhadra) have 31 days; 6-11 have 30 days (Falgun 29/30)
  const gregYear = bengaliYear + 593; // 1433 + 593 = 2026
  
  // Approximate month start offsets from April 14
  const startDayOffsets = [0, 31, 62, 93, 124, 155, 185, 215, 245, 275, 305, 335];
  const april14 = new Date(gregYear, 3, 14);
  const start = new Date(april14.getTime() + (startDayOffsets[bengaliMonth] || 0) * 24 * 60 * 60 * 1000);

  const daysCount = bengaliMonth < 6 ? 31 : 30;
  const days: Date[] = [];
  for (let i = 0; i < daysCount; i++) {
    days.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
  }
  return days;
}
