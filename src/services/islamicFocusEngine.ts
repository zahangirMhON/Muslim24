export interface DailyFocusData {
  theme: string;
  themeEnglish: string;
  quranVerse: {
    arabic: string;
    bengali: string;
    reference: string;
  };
  sahihHadith: {
    bengali: string;
    source: string;
    reference: string;
    authenticity: 'Sahih Bukhari' | 'Sahih Muslim' | 'Sunan An-Nasa\'i' | 'Sunan Abu Dawud';
  };
  dua: {
    arabic: string;
    transliteration: string;
    bengali: string;
    reference: string;
  };
  dhikr: {
    title: string;
    count: number;
    virtue: string;
  };
  suggestedAmal: string[];
  islamicLesson: string;
  historicalContext: string;
  reflection: string;
}

export interface HijriMonthData {
  id: string;
  nameArabic: string;
  nameBengali: string;
  meaning: string;
  importance: string;
  authenticVirtues: string[];
  quranReferences: string[];
  hadithReferences: string[];
  recommendedActs: string[];
  fastingGuidance: string;
  importantDates: { date: string; title: string; type: string }[];
  commonMisconceptions: string[];
  authenticityNotes: string;
  monthlyActionPlan: string[];
}

export interface IslamicHistoryItem {
  id: string;
  title: string;
  hijriYear: string;
  gregorianDate: string;
  category: 'Seerah' | 'Prophets' | 'Sahabah' | 'Islamic Civilization' | 'Major Event';
  summary: string;
  detailedStory: string;
  sources: string[];
  authenticityLevel: 'VERIFIED_SAHIH' | 'AUTHENTIC_HISTORICAL' | 'SCHOLARLY_ACCEPTED';
}

export const HIJRI_MONTHS_DB: HijriMonthData[] = [
  {
    id: 'muharram',
    nameArabic: 'ٱلْمُحَرَّم',
    nameBengali: 'মহররম (Muharram)',
    meaning: 'সম্মানিত ও পবিত্র মাস',
    importance: 'আল্লাহর সম্মানিত চার মাসের একটি। এর মধ্যে আশুরা (১০ই মহররম) অন্তর্ভুক্ত।',
    authenticVirtues: [
      'রমজানের পর সবচেয়ে উত্তম রোজা হলো মহররম মাসের রোজা (সহীহ মুসলিম)।',
      'আশুরার দিনের রোজা পূর্ববর্তী এক বছরের গুনাহ খাতা মোচন করে।'
    ],
    quranReferences: ['সূরা আত-তাওবাহ: ৩৬ (চারটি সম্মানিত মাস)'],
    hadithReferences: ['সহীহ মুসলিম: ১১৬৩', 'সহীহ বুখারী: ২০০২'],
    recommendedActs: ['আশুরার দিনে রোজা রাখা (৯ম ও ১০ম অথবা ১০ম ও ১১ই মহররম)', 'বেশি বেশি নফল সালাত ও তাওবা করা'],
    fastingGuidance: '১০ই মহররম এর সাথে ৯ম অথবা ১১ই মহররম মিলিয়ে ২টি রোজা রাখা সুন্নাত।',
    importantDates: [
      { date: '১০ই মহররম', title: 'পবিত্র আশুরা ও মূসা (আঃ) এর মুক্তি লাভ', type: 'RECOMMENDED_FASTING' }
    ],
    commonMisconceptions: [
      'মহররম মানেই কেবল কারবালার মাতম বা শোক প্রকাশ - এটি কোনো শরয়ী আমল নয়।',
      'আশুরার দিনে খিচুড়ি রান্না বা বিশেষ সুনির্দিষ্ট রান্নার সওয়াবের হাদিস ভিত্তিহীন।'
    ],
    authenticityNotes: 'আশুরার রোজার ফযীলত সহীহ সূত্রে প্রমাণিত। মাতম ও নোহা করা ইসলামে সম্পূর্ণ নিষিদ্ধ।',
    monthlyActionPlan: ['৯ ও ১০ই মহররম রোজা পালনের প্রস্তুতি', 'কুরআন ও তাওবায় সময় কাটানো']
  },
  {
    id: 'safar',
    nameArabic: 'صَفَر',
    nameBengali: 'সফর (Safar)',
    meaning: 'শূন্য বা খালি হওয়া',
    importance: 'ইসলামের ২য় হিজরি মাস। জাহেলী যুগের সফর মাস সংক্রান্ত যাবতীয় কুসংস্কার বাতিল ঘোষণা করা হয়েছে।',
    authenticVirtues: [
      'সফর মাসে কোনো অমঙ্গল, কুলক্ষণ বা বিপদ-আপদের বিশেষ প্রভাব নেই (সহীহ বুখারী)।'
    ],
    quranReferences: ['সূরা আত-তাওবাহ: ৩৭'],
    hadithReferences: ['সহীহ বুখারী: ৫৭০৭ ("সফর মাসে কোনো অশুভ নেই")'],
    recommendedActs: ['নিয়মিত পাঁচ ওয়াক্ত সালাত ও আইয়ামে বীজ এর রোজা (১৩, ১৪, ১৫ই সফর)'],
    fastingGuidance: 'সফর মাসের জন্য আলাদা কোনো খাস রোজা নেই, সাধারণ আইয়ামে বীজ রোজা রাখা সুন্নাত।',
    importantDates: [
      { date: '১৩, ১৪, ১৫ই সফর', title: 'আইয়ামে বীজ এর সুন্নাত রোজা', type: 'SUNNAH_FASTING' }
    ],
    commonMisconceptions: [
      'আখেরি চাহার সোম্বা বা সফর মাসের শেষ বুধবার সুনির্দিষ্ট ইবাদতের দিন মানা - এর কোনো সহীহ ভিত্তি নেই।',
      'সফর মাসকে অশুভ বা বিয়ের জন্য অকল্যাণকর মনে করা জাহেলী কুসংস্কার।'
    ],
    authenticityNotes: 'রাসূলুল্লাহ (সাঃ) স্পষ্ট বলেছেন সফর মাসে কোনো কুলক্ষণ নেই।',
    monthlyActionPlan: ['জাহেলী কুসংস্কার থেকে দূরে থাকা', 'দৈনিক সুন্নাত আমল বজায় রাখা']
  },
  {
    id: 'rabi-al-awwal',
    nameArabic: 'رَبِيع ٱلْأَوَّل',
    nameBengali: 'রবিউল আউয়াল (Rabi\' al-Awwal)',
    meaning: 'প্রথম বসন্ত',
    importance: 'যে মাসে বিশ্বনবী মুহাম্মাদ (সাঃ) জন্মগ্রহণ করেন এবং এ মাসেই তিনি ইন্তেকাল করেন।',
    authenticVirtues: [
      'নবীজী (সাঃ) এর ওপর বেশি বেশি দরুদ ও সালাম প্রেরণ করা প্রতিদিনের সুন্নাত।',
      'প্রতি সোমবার রোজা রাখা সুন্নাত, কারণ এ দিনে নবীজী (সাঃ) জন্মগ্রহণ করেন ও ওহী লাভ করেন (সহীহ মুসলিম)।'
    ],
    quranReferences: ['সূরা আল-আহযাব: ৫৬ (দরুদ পাঠের নির্দেশ)'],
    hadithReferences: ['সহীহ মুসলিম: ১১৬২ (সোমবারে রোজার কারণ)'],
    recommendedActs: ['প্রতি সোমবার সুন্নাত রোজা রাখা', 'নবীজী (সাঃ) এর সীরাত পাঠ করা'],
    fastingGuidance: 'প্রতি সোমবার ও আইয়ামে বীজ এর রোজা রাখা মাসনুন।',
    importantDates: [
      { date: '১২ই রবিউল আউয়াল', title: 'রাসূলুল্লাহ (সাঃ) এর জন্ম ও ইন্তেকাল সম্পর্কিত ঐতিহাসিক স্মৃতি', type: 'HISTORICAL' }
    ],
    commonMisconceptions: [
      'নির্দিষ্ট তারিখে কেক কাটা বা জাঁকজমকপূর্ণ শোভাযাত্রাকে ইবাদত মনে করা শরীয়তসম্মত নয়।'
    ],
    authenticityNotes: 'নবীজী (সাঃ) এর সীরাত অনুসরণই তাঁর প্রতি ভালোবাসার প্রধান মানদণ্ড।',
    monthlyActionPlan: ['সীরাতুন নবী (সাঃ) এর নির্ভরযোগ্য বই পড়া', 'সুন্নাতের ওপর দৃঢ় থাকা']
  },
  {
    id: 'ramadan',
    nameArabic: 'رَمَضَان',
    nameBengali: 'রমজান (Ramadan)',
    meaning: 'প্রচণ্ড দাহ বা আত্মশুদ্ধির মাস',
    importance: 'কুরআন নাজিলের পবিত্র মাস। ইসলামের অন্যতম ফরজ রুকন সিয়াম সাধনার মাস।',
    authenticVirtues: [
      'রমজানের রোজা ও তারাবীহ পালন পূর্ববর্তী সমস্ত গুনাহ মাফ করে দেয় (সহীহ বুখারী)।',
      'লাইলাতুল কদর হাজার মাসের চেয়ে শ্রেষ্ঠ।'
    ],
    quranReferences: ['সূরা আল-বাকারা: ১৮৫ (কুরআন নাজিলের মাস)', 'সূরা আল-কদর: ১-৫'],
    hadithReferences: ['সহীহ বুখারী: ৩৮', 'সহীহ মুসলিম: ৭৬০'],
    recommendedActs: ['ফরজ রোজা', 'কিয়ামুল লাইল (তারাবীহ)', 'কুরআন তিলাওয়াত', 'দান-সদকা', 'ইতিকাফ'],
    fastingGuidance: 'পুরো মাস ফরজ রোজা রাখা ইসলামের রুকন। সুহুর গ্রহণ ও দ্রুত ইফতার করা সুন্নাত।',
    importantDates: [
      { date: '১ম রমজান', title: 'পবিত্র রমজানুল মোবারকের সূচনা', type: 'OBLIGATORY_FASTING' },
      { date: '১৭ই রমজান', title: 'ঐতিহাসিক বদর যুদ্ধ বিজয়', type: 'HISTORICAL' },
      { date: 'শেষ ১০ দিন', title: 'লাইলাতুল কদর অনুসন্ধান ও ইতিকাফ', type: 'NIGHT_WORSHIP' }
    ],
    commonMisconceptions: [
      'সেহরি না খেলে রোজা হবে না মনে করা - সেহরি সুন্নাত ও বরকতময়, ফরজ নয়।',
      'রোজার নিয়ত মুখে আরবিতে মুখে উচ্চারণ করা বাধ্যবাধকতা নয়, নিয়ত মনের ইচ্ছা।'
    ],
    authenticityNotes: 'রমজানের প্রতিটি মুহূর্ত ইবাদত ও আত্মশুদ্ধির সুবর্ণ সুযোগ।',
    monthlyActionPlan: ['কুরআন খতমের পরিকল্পনা', 'শেষ ১০ রাতে শব-ই-কদর তালাশ']
  }
];

export const ISLAMIC_HISTORY_DB: IslamicHistoryItem[] = [
  {
    id: 'hist-badr',
    title: 'ঐতিহাসিক বদর যুদ্ধ ও হকের বিজয়',
    hijriYear: '২ হিজরী, ১৭ই রমজান',
    gregorianDate: '৬২৪ খ্রিষ্টাব্দ',
    category: 'Major Event',
    summary: 'ইসলামের ইতিহাসের প্রথম প্রধান নিষ্পত্তিমূলক যুদ্ধ যেখানে ৩১৩ জন নিরস্ত্র মুসলিম ১০০০ জন সশস্ত্র কুরাইশকে পরাস্ত করে।',
    detailedStory: 'রমজান মাসের ১৭ তারিখে মদিনা থেকে ৮০ কিমি দূরে বদর প্রান্তরে এই যুদ্ধ সংঘটিত হয়। আল্লাহ তাআলা ফেরেশতা পাঠিয়ে মুসলিমদের সাহায্য করেন। এটি সত্য ও মিথ্যার পার্থক্যকারী যুদ্ধ (ইয়াউমুল ফুরকান)।',
    sources: ['সূরা আল-আনফাল', 'সহীহ বুখারী: ৩৯৮৬', 'আর-রাহীকুল মাখতুম'],
    authenticityLevel: 'VERIFIED_SAHIH'
  },
  {
    id: 'hist-makkah-conquest',
    title: 'মক্কা বিজয় ও ক্ষমা ও করুণার মহা দৃষ্টান্ত',
    hijriYear: '৮ হিজরী, ২০শে রমজান',
    gregorianDate: '৬৩০ খ্রিষ্টাব্দ',
    category: 'Seerah',
    summary: 'রক্তপাতহীনভাবে মক্কা বিজয় এবং কাবার ৩৬০টি মূর্তি অপসারণ করে তাওহীদ প্রতিষ্ঠা।',
    detailedStory: 'কুরাইশরা হুদায়বিয়ার চুক্তি ভঙ্গ করলে রাসূলুল্লাহ (সাঃ) ১০,০০০ সাহাবীকে নিয়ে মক্কা অভিমুখে যাত্রা করেন। বিজয়ের পর তিনি চিরশত্রুদের সাধারণ ক্ষমা ঘোষণা করেন।',
    sources: ['সহীহ বুখারী: ৪২৮০', 'সহীহ মুসলিম: ১৭৮০'],
    authenticityLevel: 'VERIFIED_SAHIH'
  }
];

export class IslamicFocusEngine {
  public getTodayFocus(): DailyFocusData {
    return {
      theme: 'সবর ও শোকর (ধৈর্য ও কৃতজ্ঞতা)',
      themeEnglish: 'Patience & Gratitude',
      quranVerse: {
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        bengali: 'হে মুমিনগণ! তোমরা ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো। নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।',
        reference: 'সূরা আল-বাকারা (২:১৫৩)'
      },
      sahihHadith: {
        bengali: 'মুমিনের বিষয়টি কতই না চমৎকার! তার প্রতিটি কাজই তার জন্য কল্যাণকর। ভালো কিছু হলে সে শোকর করে, ফলে তা তার জন্য কল্যাণ হয়; আর বিপদে পড়লে সে সবর করে, ফলে তাও তার জন্য কল্যাণ হয়।',
        source: 'সহীহ মুসলিম',
        reference: 'হাদিস নম্বর: ২৯৯৯',
        authenticity: 'Sahih Muslim'
      },
      dua: {
        arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
        transliteration: 'Rabbana afrigh alayna sabran wa thabbit aqdamana wansurna alal qawmil kafireen.',
        bengali: 'হে আমাদের রব! আমাদের ওপর ধৈর্য বর্ষণ করুন, আমাদের কদমসমূহ দৃঢ় রাখুন এবং কাফের সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।',
        reference: 'সূরা আল-বাকারা (২:২৫০)'
      },
      dhikr: {
        title: 'লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ',
        count: 100,
        virtue: 'জান্নাতের অন্যতম ধনভান্ডার (সহীহ বুখারী: ৬৩৮৪)'
      },
      suggestedAmal: [
        'আজ বিপদ বা কষ্টের মুখে রাগ সংবরণ করে ইন্নালিল্লাহ পাঠ করা',
        'আল্লাহর প্রদত্ত প্রতিটি নিয়ামতের জন্য অনুচ্চস্বরে আলহামদুলিল্লাহ বলা',
        'ফজরের পর ও এশার পর সুন্নাত দুআসমূহ সম্পন্ন করা'
      ],
      islamicLesson: 'ধৈর্য কেবল দুঃখের সময়ে নয়, পাপ থেকে বেঁচে থাকা এবং আনুগত্য বজায় রাখার ক্ষেত্রেও সমান গুরুত্বপূর্ণ।',
      historicalContext: 'রাসূলুল্লাহ (সাঃ) মক্কী জীবনে সর্বোচ্চ ধৈর্য ধারণ করে তাওহীদের দাওয়াত প্রচার করেছেন।',
      reflection: 'আজকের জীবনে যা কিছু হারিয়েছে তার বদলে আল্লাহর ওপর পূর্ণ আস্থা রাখুন।'
    };
  }

  public getHijriMonthData(monthId: string): HijriMonthData {
    const found = HIJRI_MONTHS_DB.find(m => m.id === monthId);
    return found || HIJRI_MONTHS_DB[0];
  }

  public getAllHijriMonths(): HijriMonthData[] {
    return HIJRI_MONTHS_DB;
  }

  public getHistoryItems(): IslamicHistoryItem[] {
    return ISLAMIC_HISTORY_DB;
  }
}
