import { toBengaliDigits } from './bengaliUtils';

export interface HijriSpecialDay {
  id: string;
  titleBn: string;
  arabicTitle?: string;
  monthIndex: number; // 0 = Muharram, 1 = Safar, ..., 11 = Dhul Hijjah
  monthNameBn: string;
  dayOfMonth: number; // 1 to 30
  endDayOfMonth?: number; // For multi-day periods like 8-12 Dhul Hijjah
  category: 'sacred_month' | 'eid' | 'fasting' | 'night' | 'history' | 'sunnah';
  categoryLabelBn: string;
  categoryColor: 'amber' | 'emerald' | 'teal' | 'rose' | 'indigo' | 'purple';
  icon: string;
  significanceBn: string;
  historicalContextBn: string;
  sahabaProphetContextBn?: string;
  recommendedAmalsBn: string[];
  prohibitedActionsBn?: string[];
  hadithReference?: {
    bookBn: string;
    hadithNo: string;
    authenticityGrade: string;
    textBn: string;
  };
  quranReference?: {
    surahNameBn: string;
    ayahNo: string;
    verseAr?: string;
    verseBn: string;
  };
  associatedDuaBn?: {
    arabic: string;
    transliteration: string;
    meaning: string;
  };
  priorityRank: number; // 1 = highest
}

export const HIJRI_MONTH_METADATA = [
  { index: 0, nameBn: 'মুহররম', isSacred: true, daysCount: 30, meaning: 'নিষিদ্ধ ও সম্মানিত মাস' },
  { index: 1, nameBn: 'সফর', isSacred: false, daysCount: 29, meaning: 'শূন্য বা প্রস্থানকাল' },
  { index: 2, nameBn: 'রবিউল আউয়াল', isSacred: false, daysCount: 30, meaning: 'বসন্তের প্রথম মাস' },
  { index: 3, nameBn: 'রবিউস সানী', isSacred: false, daysCount: 29, meaning: 'বসন্তের দ্বিতীয় মাস' },
  { index: 4, nameBn: 'জমাদিউল আউয়াল', isSacred: false, daysCount: 30, meaning: 'শীতের প্রথম মাস' },
  { index: 5, nameBn: 'জমাদিউস সানী', isSacred: false, daysCount: 29, meaning: 'শীতের দ্বিতীয় মাস' },
  { index: 6, nameBn: 'রজব', isSacred: true, daysCount: 30, meaning: 'সম্মানিত ও মহান মাস' },
  { index: 7, nameBn: 'শাবান', isSacred: false, daysCount: 29, meaning: 'শাখা-প্রশাখা বিস্তারের মাস' },
  { index: 8, nameBn: 'রমজান', isSacred: false, daysCount: 30, meaning: 'দগ্ধ বা জ্বালিয়ে পুড়িয়ে খাঁটি করার মাস' },
  { index: 9, nameBn: 'শাওয়াল', isSacred: false, daysCount: 29, meaning: 'উত্তোলিত হওয়ার মাস' },
  { index: 10, nameBn: 'জুলক্বাদ', isSacred: true, daysCount: 30, meaning: 'বিশ্রামের সম্মানিত মাস' },
  { index: 11, nameBn: 'জুলহিজ্জাহ', isSacred: true, daysCount: 29, meaning: 'পবিত্র হজের মাস' },
];

export const ALL_HIJRI_SPECIAL_DAYS: HijriSpecialDay[] = [
  // 1. Muharram
  {
    id: 'muharram_1_new_year',
    titleBn: 'পবিত্র হিজরি নববর্ষ (১লা মুহররম)',
    arabicTitle: 'رَأْسُ السَّنَةِ الهِجْرِيَّة',
    monthIndex: 0,
    monthNameBn: 'মুহররম',
    dayOfMonth: 1,
    category: 'sacred_month',
    categoryLabelBn: 'হিজরি নববর্ষ',
    categoryColor: 'amber',
    icon: '✨',
    significanceBn: 'ইসলামিক বর্ষপঞ্জির প্রথম দিন এবং সম্মানিত ৪টি হারাম মাসের অন্যতম। হিজরতের ঐতিহাসিক চেতনা ও আত্মত্যাগের নতুন সূচনা।',
    historicalContextBn: 'খলিফাতুল মুসলিমীন হযরত উমর ইবনুল খাত্তাব (রা.) সাহাবায়ে কেরামের পরামর্শক্রমে নবীজি ﷺ-এর ঐতিহাসিক মক্কা থেকে মদীনায় হিজরতের বছরকে ভিত্তি করে হিজরি সন গণনা শুরু করেন।',
    sahabaProphetContextBn: 'সাহাবীগণ নতুন বছর ও নতুন চাঁদ দেখলে নিরাপত্তা, ঈমান ও শয়তানের প্ররোচনা থেকে সুরক্ষার জন্য বিশেষ দোয়া পাঠ করতেন।',
    recommendedAmalsBn: [
      'নতুন চাঁদ ও নতুন হিজরি বছরের সুন্নাহ দোয়া পাঠ',
      'বিগত এক বছরের গুনাহের জন্য খাঁটি তওবা ও ইস্তিগফার',
      'নতুন হিজরি বছরের জন্য নেক আমল ও কুরআন তিলাওয়াতের সংকল্প',
      'মুহররম মাসের নফল রোজা রাখা (রমজানের পর শ্রেষ্ঠ রোজা)'
    ],
    associatedDuaBn: {
      arabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالأَمْنِ وَالإِيمَانِ وَالسَّلامَةِ وَالإِسْلامِ رَبِّي وَرَبُّكَ اللَّهُ',
      transliteration: 'আল্লাহুম্মা আহিল্লাহু ‘আলাইনা বিল-আমনি ওয়াল ঈমান, ওয়াস-সালামাতি ওয়াল ইসলাম, রাব্বী ওয়া রাব্বুকাল্লাহ।',
      meaning: 'হে আল্লাহ! এই চাঁদকে আমাদের জন্য শান্তি, ঈমান, নিরাপত্তা ও ইসলামের সাথে উদিত করুন। [হে চাঁদ!] আমার ও তোমার রব এক আল্লাহ।'
    },
    priorityRank: 1
  },
  {
    id: 'muharram_9_10_ashura',
    titleBn: 'পবিত্র আশুরা ও তাসূ’আ (৯ ও ১০ মুহররম)',
    arabicTitle: 'يَوْمُ عَاشُورَاء',
    monthIndex: 0,
    monthNameBn: 'মুহররম',
    dayOfMonth: 10,
    endDayOfMonth: 10,
    category: 'fasting',
    categoryLabelBn: 'সুন্নাহ রোজা ও শাহাদাত',
    categoryColor: 'rose',
    icon: '📿',
    significanceBn: 'ইসলামের ইতিহাসে হক ও ইনসাফের মহাবিজয়। মূসা (আ.)-এর নাজাত এবং কারবালার প্রান্তরে ইমাম হুসাইন (রা.)-এর ঐতিহাসিক শাহাদাত।',
    historicalContextBn: 'এ দিনে মহান আল্লাহ বনী ইসরাঈলকে ফেরাউনের দাসত্ব থেকে লোহিত সাগর বিভক্ত করে অলৌকিক মুক্তি দেন। পরবর্তীতে ৬১ হিজরিতে কারবালায় নবী দৌহিত্র হযরত হুসাইন (রা.) ও তাঁর সাথীগণ সত্যের জন্য শহীদ হন।',
    sahabaProphetContextBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "আশুরার দিনের রোজার ব্যাপারে আমি আল্লাহর কাছে আশাবাদী যে, তিনি এর মাধ্যমে বিগত এক বছরের গুনাহ ক্ষমা করে দেবেন।" (সহীহ মুসলিম: ১১৬২)। ইহুদিদের বিপরীত করতে তিনি ৯ ও ১০ মুহররম রোজা রাখার নির্দেশ দেন।',
    recommendedAmalsBn: [
      '৯ ও ১০ মুহররম (অথবা ১০ ও ১১ মুহররম) নফল সিয়াম পালন',
      'অহংকার ও জুলুমের বিরুদ্ধে সত্যের ওপর অবিচল থাকার শপথ',
      'পরিবার-পরিজনের খাবারে প্রশস্ততা ও দান-সদকাহ',
      'কারবালার শহীদানদের জন্য মাগফিরাত ও দোয়া'
    ],
    priorityRank: 2
  },

  // 2. Safar
  {
    id: 'safar_last_wednesday',
    titleBn: 'আখেরী চাহার শোম্বা (সফর মাসের শেষ বুধবার)',
    arabicTitle: 'آخِر أَرْبِعَاء مِنْ صَفَر',
    monthIndex: 1,
    monthNameBn: 'সফর',
    dayOfMonth: 27,
    category: 'sunnah',
    categoryLabelBn: 'শোকরানা ও দরূদ',
    categoryColor: 'teal',
    icon: '🌿',
    significanceBn: 'নবীজি ﷺ-এর সাময়িক রোগমুক্তি ও স্বাস্থ্য পুনরুদ্ধারের স্মরণে সাহাবায়ে কেরামের শোকরানা ও আনন্দ প্রকাশের ঐতিহাসিক দিন।',
    historicalContextBn: 'ওফাতের পূর্বে সফর মাসের শেষ বুধবারে রাসূলুল্লাহ ﷺ সাময়িক সুস্থতা অনুভব করে গোসল করেন এবং মসজিদে এসে সালাতে ইমামতি করেন। সাহাবায়ে কেরাম কৃতজ্ঞতায় অকাতরে দান-সদকাহ করেন।',
    recommendedAmalsBn: [
      'আল্লাহর নিয়ামতের জন্য শুকরিয়া আদায় ও নফল নামাজ',
      'নবীজি ﷺ-এর প্রতি বেশি বেশি দরূদ শরীফ পাঠ',
      'অসুস্থ ব্যক্তিদের আরোগ্যের জন্য দোয়া ও সদকাহ দেওয়া'
    ],
    priorityRank: 8
  },

  // 3. Rabi' al-Awwal
  {
    id: 'rabiul_awwal_12_milad',
    titleBn: 'পবিত্র ঈদে মিলাদুন্নবী ﷺ ও সীরাতুন্নবী মাহফিল (১২ রবিউল আউয়াল)',
    arabicTitle: 'المَوْلِدُ النَّبَوِي الشَّرِيف',
    monthIndex: 2,
    monthNameBn: 'রবিউল আউয়াল',
    dayOfMonth: 12,
    category: 'history',
    categoryLabelBn: 'রাহমাতুল্লিল আলামিন',
    categoryColor: 'emerald',
    icon: '🕌',
    significanceBn: 'সর্বকালের সর্বশ্রেষ্ঠ মহামানব, রাহমাতুল্লিল আলামীন হযরত মুহাম্মদ ﷺ-এর শুভ বেলাদত ও দুনিয়াতে শুভাগমনের স্মৃতিবিজড়িত পবিত্র দিন।',
    historicalContextBn: 'عام الفيل (হস্তী বর্ষে) ৫৭০ খ্রিস্টাব্দের ১২ই রবিউল আউয়াল সোমবার মক্কার কুরাইশ বংশে নবীজি ﷺ জন্মগ্রহণ করেন। আবার এ দিনেই তিনি ৬৩ বছর বয়সে রফীকে আলার ডাকে সাড়া দিয়ে ওফাত লাভ করেন।',
    sahabaProphetContextBn: 'রাসূলুল্লাহ ﷺ-কে সোমবারের রোজা সম্পর্কে জিজ্ঞেস করা হলে তিনি বলেন: "এ দিনে আমি জন্মগ্রহণ করেছি এবং এ দিনেই আমার ওপর কুরআন অবতীর্ণ হয়েছে।" (সহীহ মুসলিম: ১১৬২)।',
    recommendedAmalsBn: [
      'নবীজি ﷺ-এর সিরাত ও মহান চরিত্রের গভীর অধ্যয়ন',
      'অবিরাম দরূদ ও সালাম পাঠ (সালাতুত তাসলীম)',
      'গরিব-অসহায়দের খাদ্যদান ও বস্ত্র বিতরণ',
      'সুন্নাহ মোতাবেক জীবন পরিচালনার অঙ্গীকার'
    ],
    associatedDuaBn: {
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
      transliteration: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিউঁ ওয়া আলা আলি মুহাম্মাদ, কামা সাল্লাইতা আলা ইবরাহীমা ওয়া আলা আলি ইবরাহীম, ইন্নাকা হামীদুম মাজীদ।',
      meaning: 'হে আল্লাহ! হযরত মুহাম্মদ ﷺ এবং তাঁর বংশধরের ওপর রহমত বর্ষণ করুন, যেমন আপনি হযরত ইব্রাহিম (আ.) ও তাঁর বংশধরের ওপর রহমত বর্ষণ করেছিলেন।'
    },
    priorityRank: 3
  },

  // 4. Rabi' al-Thani
  {
    id: 'rabi_thani_11_yajdaham',
    titleBn: 'ফাতেহা-ই-ইয়াজদাহম (১১ রবিউস সানী)',
    arabicTitle: 'فَاتِحَة يَازْدَهُم',
    monthIndex: 3,
    monthNameBn: 'রবিউস সানী',
    dayOfMonth: 11,
    category: 'history',
    categoryLabelBn: 'ওলী-আউলিয়া স্মরণ',
    categoryColor: 'indigo',
    icon: '📖',
    significanceBn: 'কাদেরিয়া তরীকার প্রবর্তক, গাউসুল আজম হযরত বড়পীর আব্দুল কাদের জিলানী (রহ.)-এর ওফাত ও ইসালে সাওয়াব দিবস।',
    historicalContextBn: '৫৬১ হিজরির ১১ই রবিউস সানী বাগদাদের এই মহান আধ্যাত্মিক সাধক ও সংস্কারক ইহধাম ত্যাগ করেন। তিনি মুসলিম উম্মাহকে শিরক ও বিদআত মুক্ত খাঁটি তাওহীদের দীক্ষা দিয়েছেন।',
    recommendedAmalsBn: [
      'কুরআন খতম ও নেক আমলের ইসালে সাওয়াব',
      'তাকওয়া ও আধ্যাত্মিক আত্মশুদ্ধির আলোচনা',
      'দুস্থ মানুষদের মাঝে খাদ্য বিতরণ'
    ],
    priorityRank: 10
  },

  // 5. Rajab
  {
    id: 'rajab_1_sacred',
    titleBn: 'পবিত্র রজব মাসের সূচনা (সম্মানিত ৪ হারাম মাসের ১টি)',
    arabicTitle: 'غُرَّةُ شَهْرِ رَجَب المُحَرَّم',
    monthIndex: 6,
    monthNameBn: 'রজব',
    dayOfMonth: 1,
    category: 'sacred_month',
    categoryLabelBn: 'হারাম মাস ও প্রস্তুতি',
    categoryColor: 'purple',
    icon: '🌙',
    significanceBn: 'পবিত্র হারাম ৪টি মাসের একটি। এ মাস থেকে মাহে রমজানের আগাম প্রস্তুতি ও দোয়ার ধারা শুরু হয়।',
    historicalContextBn: 'জাহেলিয়াতের যুগেও আরবরা এ মাসে সবধরনের যুদ্ধ-বিগ্রহ ও রক্তপাত বন্ধ রাখত। ইসলাম এ মাসের পবিত্রতাকে আরো সমুন্নত করেছে।',
    sahabaProphetContextBn: 'রজব চাঁদ উঠলে নবীজি ﷺ দোয়া করতেন: "আল্লাহুম্মা বারিক লানা ফী রাজাবা ওয়া শাবান, ওয়া বাল্লিগনা রামাদান।"',
    recommendedAmalsBn: [
      'রজব ও শাবানের বরকত এবং রমজান পাওয়ার বিশেষ দোয়া',
      'অধিক পরিমাণে তাওবা ও নফল রোজা রাখা',
      'গুনাহ থেকে কঠোরভাবে বেঁচে থাকা'
    ],
    associatedDuaBn: {
      arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبَ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
      transliteration: 'আল্লাহুম্মা বারিক লানা ফী রাজাবা ওয়া শা‘বান, ওয়া বাল্লিগনা রামাদান।',
      meaning: 'হে আল্লাহ! রজব ও শাবান মাসে আমাদের জন্য বরকত দান করুন এবং আমাদের রমজান পর্যন্ত পৌঁছে দিন।'
    },
    priorityRank: 6
  },
  {
    id: 'rajab_27_shab_e_meraj',
    titleBn: 'পবিত্র শবে মেরাজ — লাইলাতুল মি’রাজ (২৭ রজব)',
    arabicTitle: 'إِسْرَاءُ وَالمِعْرَاج',
    monthIndex: 6,
    monthNameBn: 'রজব',
    dayOfMonth: 27,
    category: 'night',
    categoryLabelBn: 'মহিমান্বিত ঊর্ধ্বগমন',
    categoryColor: 'indigo',
    icon: '🌌',
    significanceBn: 'নবীজি ﷺ-এর সশরীরে আসমানি ঊর্ধ্বগমন, সিদরাতুল মুনতাহা অতিক্রম করে আল্লাহর দিদার লাভ এবং উম্মতের জন্য ৫ ওয়াক্ত নামাজের উপহার।',
    historicalContextBn: 'নবুওয়াতের ১০ম বর্ষে "আমুল হুজন" (শোকের বছর)-এ আল্লাহ তাঁর প্রিয় হাবীবকে সান্ত্বনা দিতে মসজিদে হারাম থেকে বাইতুল মুকাদ্দাস এবং সেখান থেকে সপ্তাকাশ পরিভ্রমণ করান।',
    sahabaProphetContextBn: 'হযরত আবু বকর (রা.) কোনো দ্বিধা ছাড়াই এই মিরাজের ঘটনাকে বিশ্বাস করে "সিদ্দিক" (পরম সত্যবাদী) উপাধিতে ভূষিত হন।',
    recommendedAmalsBn: [
      'গভীর রাতে তাহাজ্জুদ ও নফল সালাত আদায়',
      'পাঁচ ওয়াক্ত নামাজ সময়মতো খুশু-খুজুর সাথে পড়ার দৃঢ় সংকল্প',
      'সূরা বাকারার শেষ দুই আয়াত এবং দরূদ শরীফ পাঠ',
      'পরের দিন নফল রোজা রাখা'
    ],
    priorityRank: 4
  },

  // 6. Sha'ban
  {
    id: 'shaban_15_shab_e_barat',
    titleBn: 'পবিত্র শবে বরাত — লাইলাতুল বারাত (১৫ শাবান)',
    arabicTitle: 'لَيْلَةُ النِّصْفِ مِنْ شَعْبَان',
    monthIndex: 7,
    monthNameBn: 'শাবান',
    dayOfMonth: 15,
    category: 'night',
    categoryLabelBn: 'ক্ষমা ও মাগফিরাত',
    categoryColor: 'teal',
    icon: '✨',
    significanceBn: 'ভাগ্য রজনী ও ক্ষমা প্রার্থনার বরকতময় রাত। আল্লাহ তাআলা অসংখ্য বান্দাকে ক্ষমা ঘোষণা করেন এবং রহমতের দুয়ার উন্মুক্ত করেন।',
    historicalContextBn: 'এ রাতে মহান আল্লাহ বনু কালব গোত্রের ভেড়া-বকরির লোমের চেয়েও অধিক সংখ্যক গুনাহগার বান্দাকে ক্ষমা করেন (মুশরিক ও হিংসুক ব্যতীত)।',
    sahabaProphetContextBn: 'উম্মুল মুমিনীন হযরত আয়েশা (রা.) বলেন: রাসূলুল্লাহ ﷺ এ রাতে দীর্ঘ সেজদায় পড়ে কাঁদতেন এবং জান্নাতুল বাক্বী কবরস্থানে গিয়ে দোয়া করতেন।',
    recommendedAmalsBn: [
      'রাত জেগে নফল সালাত, তিলাওয়াত ও কান্নাকাটি',
      'হৃদয় থেকে সকল হিংসা-বিদ্বেষ ও শত্রুতা দূর করা',
      'পরদিন (১৫ শাবান) নফল সিয়াম পালন',
      'পিতামাতা ও পূর্বসূরিদের মাগফিরাতের জন্য কবর জিয়ারত'
    ],
    priorityRank: 5
  },

  // 7. Ramadan
  {
    id: 'ramadan_1_start',
    titleBn: 'পবিত্র মাহে রমজানুল মোবারক সূচনা (১লা রমজান)',
    arabicTitle: 'غُرَّةُ شَهْرِ رَمَضَانَ المُبَارَك',
    monthIndex: 8,
    monthNameBn: 'রমজান',
    dayOfMonth: 1,
    category: 'fasting',
    categoryLabelBn: 'ফরজ সিয়াম ও রহমত',
    categoryColor: 'amber',
    icon: '🌙',
    significanceBn: 'ইসলামের পঞ্চস্তম্ভের অন্যতম ফরজ সিয়াম সাধনার পবিত্র মাস। জান্নাতের সকল দরজা খুলে দেওয়া হয় এবং শয়তানকে শৃঙ্খলাবদ্ধ করা হয়।',
    historicalContextBn: 'এ পবিত্র মাসেই লওহে মাহফুজ থেকে বাইতুল ইজ্জতে এবং সেখান থেকে জিবরীল (আ.)-এর মাধ্যমে নবীজি ﷺ-এর ওপর কুরআন অবতীর্ণ শুরু হয়।',
    sahabaProphetContextBn: 'সাহাবায়ে কেরাম ৬ মাস আগে থেকেই রমজান পাওয়ার দোয়া করতেন এবং রমজান আসলে দানশীলতায় বাতাসকেও হার মানাতেন।',
    recommendedAmalsBn: [
      'তারাবিহর সালাত জামাতে আদায় করা',
      'প্রতিদিন অর্থসহ কুরআন তিলাওয়াত ও খতম',
      'সাহরি ও ইফতার সুন্নাত নিয়মে পালন ও রোজাদারকে ইফতার করানো',
      'অধিক পরিমাণে সাদাকাহ ও আত্মশুদ্ধি'
    ],
    priorityRank: 1
  },
  {
    id: 'ramadan_17_badr',
    titleBn: 'ঐতিহাসিক বদর দিবস (১৭ রমজান — ইয়াউমুল ফুরকান)',
    arabicTitle: 'غَزْوَةُ بَدْرٍ الكُبْرَى',
    monthIndex: 8,
    monthNameBn: 'রমজান',
    dayOfMonth: 17,
    category: 'history',
    categoryLabelBn: 'হক ও বাতিলের ফয়সালা',
    categoryColor: 'rose',
    icon: '⚔️',
    significanceBn: 'ইসলামের প্রথম সশস্ত্র যুদ্ধ এবং সত্য ও মিথ্যার চূড়ান্ত বিজয়ের মহিমান্বিত দিন। ৩১৩ জন নিরস্ত্র সাহাবীর সাহায্যে ফেরেশতা প্রেরণ।',
    historicalContextBn: '২য় হিজরির ১৭ই রমজান বদর প্রান্তরে মাত্র ৩১৩ জন মুজাহিদ কাফেরদের ১,০০০ সুসজ্জিত বাহিনীর ওপর অবিস্মরণীয় ঐতিহাসিক বিজয় লাভ করেন।',
    sahabaProphetContextBn: 'হযরত আলী (রা.), হামজা (রা.) সহ বদরী সাহাবাদের ঈমানী দৃঢ়তা। বদরী সাহাবীদের ব্যাপারে আল্লাহ ঘোষণা করেন: "তোমরা যা ইচ্ছা করো, আমি তোমাদের ক্ষমা করে দিয়েছি।"',
    recommendedAmalsBn: [
      'বদরী সাহাবাদের জীবনী ও ত্যাগের ইতিহাস আলোচনা',
      'আল্লাহর প্রতি তাওয়াক্কুল ও দ্বীনের ওপর অবিচল থাকার দোয়া',
      'উম্মাহর ঐক্য ও ইনসাফ প্রতিষ্ঠার সংকল্প'
    ],
    priorityRank: 6
  },
  {
    id: 'ramadan_20_fath_makkah',
    titleBn: 'ঐতিহাসিক মক্কা বিজয় (২০ রমজান — ফাতহে মক্কা)',
    arabicTitle: 'فَتْحُ مَكَّة',
    monthIndex: 8,
    monthNameBn: 'রমজান',
    dayOfMonth: 20,
    category: 'history',
    categoryLabelBn: 'তাওহীদ পুনঃপ্রতিষ্ঠা',
    categoryColor: 'emerald',
    icon: '🚩',
    significanceBn: 'বিনা রক্তপাতে মক্কা বিজয়, কাবাগৃহ থেকে ৩৬০টি মূর্তি অপসারণ এবং কুরাইশদের জন্য ঐতিহাসিক সাধারণ ক্ষমা ঘোষণা।',
    historicalContextBn: '৮ম হিজরির ২০শে রমজান ১০,০০০ সাহাবীকে নিয়ে রাসূল ﷺ মক্কায় প্রবেশ করেন। তিনি বিনম্রভাবে উটের পিঠে মাথা নিচু করে সিজদাবনত অবস্থায় কাবায় প্রবেশ করেন।',
    sahabaProphetContextBn: 'হযরত বেলাল (রা.) কাবার ছাদে উঠে বিজয়ের সুমধুর আযান দেন এবং তাওহীদের পতাকা উড্ডীন করেন।',
    recommendedAmalsBn: [
      'শুকরিয়ার সেজদা ও নফল নামাজ',
      'শত্রুদের প্রতিও ক্ষমা ও উদারতা প্রদর্শনের শিক্ষা চর্চা',
      'কাবা শরীফের মর্যাদার ওপর আলোচনা'
    ],
    priorityRank: 7
  },
  {
    id: 'ramadan_27_laylatul_qadr',
    titleBn: 'পবিত্র লাইলাতুল কদর — শবে কদর (রমজানের শেষ দশক, সম্ভাব্য ২৭ রমজান)',
    arabicTitle: 'لَيْلَةُ القَدْر',
    monthIndex: 8,
    monthNameBn: 'রমজান',
    dayOfMonth: 27,
    category: 'night',
    categoryLabelBn: 'হাজার মাসের চেয়ে শ্রেষ্ঠ',
    categoryColor: 'amber',
    icon: '✨',
    significanceBn: 'হাজার মাসের (৮৩ বছর ৪ মাস) চেয়েও শ্রেষ্ঠতম রজনী। এ রাতে ফেরেশতা ও জিবরীল (আ.) জমিনে শান্তিময় রহমত নিয়ে আগমন করেন।',
    historicalContextBn: 'কুরআনে স্বতন্ত্র সূরা "আল-কদর" নাজিল হয়েছে। রাসূল ﷺ শেষ দশকের বিজোড় রাতগুলোতে (২১, ২৩, ২৫, ২৭, ২৯) কদর তালাশ করার নির্দেশ দিয়েছেন।',
    sahabaProphetContextBn: 'রাসূলুল্লাহ ﷺ শেষ দশকে কোমর বেঁধে ইবাদতে নামতেন এবং মসজিদে ইতেকাফে কান্নাকাটি করতেন। আয়েশা (রা.)-কে ক্ষমার দোয়া শিখিয়ে দেন।',
    recommendedAmalsBn: [
      'সারা রাত জাগ্রত থেকে নফল নামাজ, তাহাজ্জুদ ও তিলাওয়াত',
      'কদরের বিশেষ দোয়া পাঠ: "আল্লাহুম্মা ইন্নাকা আফুউন তুহিব্বুল আফওয়া ফাফউ আন্নি"',
      'মসজিদে শেষ দশকে ইতিকাফ পালন',
      'অশ্রুসিক্ত মোনাজাত ও গুনাহের ক্ষমা প্রার্থনা'
    ],
    associatedDuaBn: {
      arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
      transliteration: 'আল্লাহুম্মা ইন্নাকা ‘আফুউন তুহিব্বুল ‘আফওয়া ফাফউ ‘আন্নী।',
      meaning: 'হে আল্লাহ! আপনি পরম ক্ষমাশীল, ক্ষমা করা পছন্দ করেন; অতএব আমাকে ক্ষমা করে দিন।'
    },
    priorityRank: 1
  },
  {
    id: 'ramadan_last_friday_jumatul_wida',
    titleBn: 'জুমাতুল বিদা (রমজান মাসের বিদায়ী জুমু’আ)',
    arabicTitle: 'جُمُعَةُ الوَدَاع',
    monthIndex: 8,
    monthNameBn: 'রমজান',
    dayOfMonth: 29,
    category: 'night',
    categoryLabelBn: 'রমজানের শেষ জুমা',
    categoryColor: 'teal',
    icon: '🕌',
    significanceBn: 'পবিত্র রমজান মাসের শেষ শুক্রবার। সিয়াম সাধনার মাস বিদায়ের অন্তিম মুহূর্তে এক বিশেষ আত্মিক আবহ ও অশ্রুভেজা তাওবার ক্ষণ।',
    historicalContextBn: 'রমজানের শ্রেষ্ঠত্ব ও জুমার দিনের মাহাত্ম্য একত্রিত হয়ে এ দিনটিকে বিশেষ তাৎপর্যপূর্ণ করে তোলে।',
    recommendedAmalsBn: [
      'আগে আগে জুমার মসজিদে উপস্থিত হওয়া',
      'রমজান মাসে কোনো ভুলত্রুটি হলে তার জন্য চূড়ান্ত ইস্তিগফার',
      'ফিলিস্তিন ও সমগ্র নির্যাতিত মুসলিম উম্মাহর জন্য সম্মিলিত দোয়া'
    ],
    priorityRank: 5
  },

  // 8. Shawwal
  {
    id: 'shawwal_1_eid_ul_fitr',
    titleBn: 'পবিত্র ঈদুল ফিতর (১লা শাওয়াল — রোজার ঈদ)',
    arabicTitle: 'عِيدُ الفِطْرِ المُبَارَك',
    monthIndex: 9,
    monthNameBn: 'শাওয়াল',
    dayOfMonth: 1,
    category: 'eid',
    categoryLabelBn: 'আনন্দ ও পুরস্কার',
    categoryColor: 'emerald',
    icon: '🎉',
    significanceBn: 'এক মাস সিয়াম সাধনা ও তারাবিহর পর মহান রবের পক্ষ থেকে বান্দাদের জন্য পুরস্কার ও আনন্দের পবিত্র দিন। এদিন রোজা রাখা হারাম।',
    historicalContextBn: '২য় হিজরিতে বদর যুদ্ধের বিজয়ের পর মুসলিম উম্মাহ প্রথম ঈদুল ফিতর উদযাপন করেন।',
    sahabaProphetContextBn: 'সাহাবীগণ ঈদের দিন একে অপরের সাথে দেখা হলে বলতেন: "তাক্বাব্বালাল্লাহু মিন্না ওয়া মিনকুম" (আল্লাহ আমাদের ও আপনার ইবাদত কবুল করুন)।',
    recommendedAmalsBn: [
      'ঈদের সালাতে যাওয়ার পূর্বে সাদাকাতুল ফিতর আদায় করা',
      'গোসল, সুগন্ধি মেখে সর্বোত্তম পরিচ্ছন্ন পোশাক পরিধান',
      'ঈদগাহে যাওয়ার সময় তাকবীর পাঠ ও মিষ্টিমুখ করে বের হওয়া',
      'আত্মীয়-স্বজন, এতিম ও দরিদ্র প্রতিবেশীদের খোঁজখবর নেওয়া'
    ],
    associatedDuaBn: {
      arabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
      transliteration: 'তাক্বাব্বালাল্লাহু মিন্না ওয়া মিনকুম।',
      meaning: 'আল্লাহ আমাদের ও আপনার সকল নেক আমল কবুল করুন।'
    },
    priorityRank: 1
  },
  {
    id: 'shawwal_six_fasts',
    titleBn: 'শাওয়াল মাসের ৬ রোজা (সারা বছর রোজার সওয়াব)',
    arabicTitle: 'صِيَامُ سِتٍّ مِنْ شَوَّال',
    monthIndex: 9,
    monthNameBn: 'শাওয়াল',
    dayOfMonth: 2,
    endDayOfMonth: 30,
    category: 'fasting',
    categoryLabelBn: 'সারা বছরের সওয়াব',
    categoryColor: 'teal',
    icon: '🤍',
    significanceBn: 'রমজানের পর শাওয়াল মাসে যেকোনো ৬টি নফল রোজা রাখলে মহান আল্লাহ পূর্ণ এক বছর রোজা রাখার সমান সওয়াব দান করেন।',
    historicalContextBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "যে ব্যক্তি রমজানের রোজা রাখল, অতঃপর তার সাথে সাথে শাওয়ালের ছয়টি রোজা রাখল, সে যেন সারা বছরই রোজা রাখল।" (সহীহ মুসলিম: ১১৬৪)।',
    recommendedAmalsBn: [
      'শাওয়াল মাসের মধ্যে ধারাবাহিকভাবে বা পৃথক পৃথকভাবে ৬টি রোজা রাখা',
      'রমজানের কাজা রোজা থাকলে তা আগে আদায় করে নেওয়া উত্তম'
    ],
    priorityRank: 4
  },

  // 9. Dhul Qi'dah
  {
    id: 'dhul_qidah_sacred',
    titleBn: 'পবিত্র জিলকদ মাস (সম্মানিত ৪ হারাম মাসের ১টি ও হজের প্রস্তুতি)',
    arabicTitle: 'غُرَّةُ ذِي القَعْدَةِ الحَرَام',
    monthIndex: 10,
    monthNameBn: 'জুলক্বাদ',
    dayOfMonth: 1,
    category: 'sacred_month',
    categoryLabelBn: 'হারাম মাস ও হজের সূচনা',
    categoryColor: 'purple',
    icon: '🕋',
    significanceBn: 'সম্মানিত ৪টি হারাম মাসের ৩য় মাস। বিশ্ব মুসলিম এ মাস থেকেই বাইতুল্লাহর উদ্দেশ্যে পবিত্র হজ্বের সফর শুরু করে।',
    historicalContextBn: '৬ষ্ঠ হিজরির জিলকদ মাসে ঐতিহাসিক হুদায়বিয়ার সন্ধি ও বায়আতে রিদওয়ান অনুষ্ঠিত হয়েছিল, যাকে আল্লাহ "ফাতহুম মুবীন" (সুস্পষ্ট বিজয়) আখ্যা দিয়েছেন।',
    recommendedAmalsBn: [
      'হজের আত্মিক নিয়ত ও তালবিয়া পাঠ',
      'সকল প্রকার লড়াই, কলহ ও পাপকর্ম থেকে নিজেকে মুক্ত রাখা',
      'আইয়ামে বীজের (১৩, ১৪, ১৫) নফল রোজা'
    ],
    priorityRank: 7
  },

  // 10. Dhul Hijjah
  {
    id: 'dhul_hijjah_first_ten_days',
    titleBn: 'পবিত্র জিলহজের প্রথম দশক (বছরের শ্রেষ্ঠ ১০ দিন)',
    arabicTitle: 'عَشْرُ ذِي الحِجَّة',
    monthIndex: 11,
    monthNameBn: 'জুলহিজ্জাহ',
    dayOfMonth: 1,
    endDayOfMonth: 10,
    category: 'sacred_month',
    categoryLabelBn: 'বছরের শ্রেষ্ঠ ১০ দিন',
    categoryColor: 'amber',
    icon: '⭐',
    significanceBn: 'আল্লাহর কাছে বছরের শ্রেষ্ঠ ও সর্বাধিক প্রিয় ১০ দিন। আল্লাহ তাআলা স্বয়ং সূরা ফজরে এই ১০ রাতের কসম খেয়েছেন।',
    historicalContextBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "এ দশ দিনের নেক আমলের চেয়ে আল্লাহর কাছে অধিক প্রিয় আর কোনো দিনের আমল নেই।" (সহীহ বুখারী: ৯৬৯)।',
    recommendedAmalsBn: [
      '১ থেকে ৯ জিলহজ নফল সিয়াম পালন করা',
      'বেশি বেশি তাহলীল (লা ইলাহা ইল্লাল্লাহ), তাকবীর (আল্লাহু আকবার) ও তাহমীদ (আলহামদুলিল্লাহ) পাঠ',
      'যাঁরা কুরবানি করবেন, তাঁদের চুল ও নখ না কেটে রাখা (মুস্তাহাব)',
      'অসহায়দের দান ও তাওবা'
    ],
    priorityRank: 1
  },
  {
    id: 'dhul_hijjah_9_arafah',
    titleBn: 'পবিত্র ইয়াউমে আরাফাহ — আরাফার দিন (৯ জিলহজ)',
    arabicTitle: 'يَوْمُ عَرَفَة',
    monthIndex: 11,
    monthNameBn: 'জুলহিজ্জাহ',
    dayOfMonth: 9,
    category: 'fasting',
    categoryLabelBn: 'হজের মূল দিন ও মাগফিরাত',
    categoryColor: 'rose',
    icon: '🕋',
    significanceBn: 'হজের প্রধান দিন এবং অ-হাজীদের জন্য বিগত এক বছর ও আগামী এক বছরের গুনাহ মাফের সুবর্ণ সুযোগ। জাহান্নাম থেকে সর্বাধিক মুক্তির দিন।',
    historicalContextBn: '১০ম হিজরির ৯ জিলহজ আরাফাতের ময়দানে সোয়া লাখ সাহাবীর সামনে নবীজি ﷺ তাঁর কালজয়ী "বিদায় হজের ভাষণ" দেন এবং ইসলামের পূর্ণতা ঘোষিত হয়।',
    sahabaProphetContextBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "আরাফার দিনের রোজার ব্যাপারে আমি আল্লাহর কাছে আশাবাদী যে, তিনি এর দ্বারা বিগত বছর ও আগামী বছরের গুনাহ ক্ষমা করে দেবেন।" (সহীহ মুসলিম: ১১৬২)।',
    recommendedAmalsBn: [
      'অ-হাজীদের জন্য আরাফার দিনে নফল রোজা রাখা',
      'আরাফার শ্রেষ্ঠ দোয়া পাঠ: "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু..."',
      '৯ জিলহজ ফজর থেকে তাকবীরে তাশরিক শুরু করা',
      'আল্লাহর দরবারে কান্না ও দোয়ায় মশগুল থাকা'
    ],
    associatedDuaBn: {
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      transliteration: 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ওয়া হুওয়া ‘আলা কুল্লি শাইয়িন ক্বাদীর।',
      meaning: 'একমাত্র আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই, তাঁর কোনো শরিক নেই। রাজত্ব একমাত্র তাঁরই এবং সমস্ত প্রশংসা একমাত্র তাঁরই। আর তিনি সবকিছুর ওপর সর্বশক্তিমান।'
    },
    priorityRank: 1
  },
  {
    id: 'dhul_hijjah_10_eid_ul_adha',
    titleBn: 'পবিত্র ঈদুল আজহা — কুরবানির ঈদ (১০ জিলহজ)',
    arabicTitle: 'عِيدُ الأَضْحَى المُبَارَك',
    monthIndex: 11,
    monthNameBn: 'জুলহিজ্জাহ',
    dayOfMonth: 10,
    category: 'eid',
    categoryLabelBn: 'ত্যাগের মহোৎসব ও কুরবানি',
    categoryColor: 'amber',
    icon: '🐑',
    significanceBn: 'হযরত ইব্রাহিম (আ.) ও হযরত ইসমাইল (আ.)-এর মহান আত্মত্যাগের স্মরণে পশু কুরবানি ও ঈদের সালাত। ত্যাগের মাধ্যমে আল্লাহর নৈকট্য লাভ।',
    historicalContextBn: 'আল্লাহ তাআলা ইব্রাহিম (আ.)-কে তাঁর প্রিয় পুত্র ইসমাইল (আ.)-কে কুরবানির নির্দেশ দিয়ে পরীক্ষা করেন। পরীক্ষায় উত্তীর্ণ হলে আল্লাহ জান্নাত থেকে দুম্বা জবেহ করার ব্যবস্থা করেন।',
    recommendedAmalsBn: [
      'ঈদের সালাতের পূর্বে কিছু না খেয়ে সালাত আদায় এবং কুরবানির গোশত দিয়ে প্রথম আহার',
      'ফরজ সালাতের পর তাকবীরে তাশরিক পাঠ',
      'সুন্নাহ মোতাবেক সামর্থ্যবান ব্যক্তির পশু কুরবানি আদায়',
      'কুরবানির গোশত গরিব, আত্মীয় ও প্রতিবেশীদের মাঝে বণ্টন'
    ],
    priorityRank: 1
  },
  {
    id: 'dhul_hijjah_tashreeq_days',
    titleBn: 'আইয়ামে তাশরিক (১১, ১২ ও ১৩ জিলহজ)',
    arabicTitle: 'أَيَّامُ التَّشْرِيق',
    monthIndex: 11,
    monthNameBn: 'জুলহিজ্জাহ',
    dayOfMonth: 11,
    endDayOfMonth: 13,
    category: 'sunnah',
    categoryLabelBn: 'তাকবীরে তাশরিক ও জিকির',
    categoryColor: 'emerald',
    icon: '🔊',
    significanceBn: 'খাবার-দাবার ও আল্লাহর প্রশংসার দিন। ১৩ জিলহজ আসর পর্যন্ত প্রত্যেক ফরজ সালাতের পর পুরুষদের উচ্চস্বরে ও নারীদের নিম্নস্বরে তাকবীরে তাশরিক পাঠ ওয়াজিব।',
    historicalContextBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "আইয়ামে তাশরিক হলো পানাহার ও আল্লাহর জিকিরের দিন।" (সহীহ মুসলিম)। এ দিনগুলোতে রোজা রাখা সম্পূর্ণ নিষিদ্ধ।',
    recommendedAmalsBn: [
      'প্রতি ফরজ নামাজের পর তাকবীরে তাশরিক পাঠ:',
      '"আল্লাহু আকবার, আল্লাহু আকবার, লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার, আল্লাহু আকবার ওয়া লিল্লাহিল হামদ"',
      'কুরবানির দিন হিসেবে পশু জবেহ চালিয়ে যাওয়া',
      'আল্লাহর নিয়ামতের শুকরিয়া আদায়'
    ],
    priorityRank: 3
  },
  {
    id: 'dhul_hijjah_year_end_muhasabah',
    titleBn: 'হিজরি বছরের সমাপনী দিন ও মুহাসাবাহ (২৯/৩০ জিলহজ)',
    arabicTitle: 'خَاتِمَةُ السَّنَةِ الهِجْرِيَّة',
    monthIndex: 11,
    monthNameBn: 'জুলহিজ্জাহ',
    dayOfMonth: 29,
    endDayOfMonth: 30,
    category: 'sacred_month',
    categoryLabelBn: 'বছরের সমাপনী ও হিসাব',
    categoryColor: 'purple',
    icon: '⌛',
    significanceBn: 'একটি পূর্ণ ইসলামিক হিজরি বর্ষের বিদায়ক্ষণ। বিগত এক বছরের আমল ও জীবনের হিসাব নেওয়ার চরম আত্মিক মুহূর্ত।',
    historicalContextBn: 'খলিফাতুল মুসলিমীন হযরত উমর (রা.) বলতেন: "হিসাব দেওয়ার আগেই নিজের হিসাব করো, ওজন করার আগেই নিজের আমল ওজন করো।"',
    recommendedAmalsBn: [
      'বিগত ১ বছরের জীবনের হিসাব-নিকাশ (মুহাসাবাহ)',
      'কাজা নামাজ ও ওয়াজিব আদায়ের শপথ',
      'সবাইকে ক্ষমা করে দেওয়া ও ক্ষমা চাওয়া',
      'নতুন বছরে ঈমান ও আমলে উন্নতি করার শপথ'
    ],
    priorityRank: 2
  }
];

/**
 * Accurately calculate Hijri date details and remaining time for current Gregorian date
 * Calibrated precisely with bengaliUtils.ts:
 * July 27, 2026 = 12 Muharram 1448
 * 1 Muharram 1448 = July 16, 2026
 */
const BASE_GREGORIAN_JULY_16_2026 = new Date(2026, 6, 16, 0, 0, 0, 0); // 1 Muharram 1448
const BASE_HIJRI_YEAR = 1448;

export function getHijriCalendarDetails(now: Date = new Date()) {
  const diffTime = now.getTime() - BASE_GREGORIAN_JULY_16_2026.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Determine current Hijri year, month, and day
  let hYear = BASE_HIJRI_YEAR;
  let remainingDays = diffDays;

  // Standard Hijri year is ~354 days
  // 6 months of 30 days and 6 months of 29 days
  const MONTH_DAYS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const DAYS_IN_YEAR = 354;

  if (remainingDays >= 0) {
    while (remainingDays >= DAYS_IN_YEAR) {
      remainingDays -= DAYS_IN_YEAR;
      hYear++;
    }
  } else {
    while (remainingDays < 0) {
      remainingDays += DAYS_IN_YEAR;
      hYear--;
    }
  }

  let hMonth = 0;
  for (let m = 0; m < 12; m++) {
    if (remainingDays < MONTH_DAYS[m]) {
      hMonth = m;
      break;
    }
    remainingDays -= MONTH_DAYS[m];
  }
  const hDay = remainingDays + 1; // 1-indexed

  // Total day of current Hijri Year (1 to 354)
  let dayOfYear = 0;
  for (let m = 0; m < hMonth; m++) {
    dayOfYear += MONTH_DAYS[m];
  }
  dayOfYear += hDay;

  // Days left to complete this Hijri year and start the new year (1 Muharram of next year)
  const daysLeftToNewYear = DAYS_IN_YEAR - dayOfYear;
  const yearProgressPercent = Math.min(100, Math.max(0, Math.round((dayOfYear / DAYS_IN_YEAR) * 100)));

  // Target date for next 1st Muharram (New Hijri Year Start)
  const nextNewYearDate = new Date(now.getTime() + daysLeftToNewYear * 24 * 60 * 60 * 1000);
  nextNewYearDate.setHours(0, 0, 0, 0);

  return {
    hYear,
    hMonth,
    hDay,
    dayOfYear,
    daysLeftToNewYear,
    yearProgressPercent,
    nextNewYearDate,
    nextNewYearNumber: hYear + 1,
    monthNameBn: HIJRI_MONTH_METADATA[hMonth].nameBn
  };
}

/**
 * Alias for getHijriCalendarDetails to support Hijri year cycle calculations
 */
export const getHijriYearCycleStats = getHijriCalendarDetails;

/**
 * Calculates accurate countdown details for a specific Hijri milestone
 */
export function calculateMilestoneCountdown(
  milestone: HijriSpecialDay,
  now: Date = new Date()
) {
  const currentHijri = getHijriCalendarDetails(now);
  const MONTH_DAYS = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const DAYS_IN_YEAR = 354;

  // Day of year for this milestone
  let milestoneDayOfYear = 0;
  for (let m = 0; m < milestone.monthIndex; m++) {
    milestoneDayOfYear += MONTH_DAYS[m];
  }
  milestoneDayOfYear += milestone.dayOfMonth;

  let daysRemaining = milestoneDayOfYear - currentHijri.dayOfYear;
  let targetYear = currentHijri.hYear;
  let isToday = false;

  // Check if it's multi-day or single day
  if (milestone.endDayOfMonth && milestone.monthIndex === currentHijri.hMonth) {
    if (currentHijri.hDay >= milestone.dayOfMonth && currentHijri.hDay <= milestone.endDayOfMonth) {
      isToday = true;
      daysRemaining = 0;
    }
  } else if (milestone.monthIndex === currentHijri.hMonth && milestone.dayOfMonth === currentHijri.hDay) {
    isToday = true;
    daysRemaining = 0;
  }

  // If milestone already passed this year, the next occurrence is in the next Hijri year
  let isPassedThisYear = false;
  if (daysRemaining < 0 && !isToday) {
    isPassedThisYear = true;
    daysRemaining += DAYS_IN_YEAR;
    targetYear = currentHijri.hYear + 1;
  }

  // Approximate Gregorian date
  const targetDate = new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000);

  // Time remaining precision
  const msRemaining = Math.max(0, targetDate.getTime() - now.getTime());
  const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);

  // 1-Year progress position (0 to 100%)
  const yearPositionPercent = Math.round((milestoneDayOfYear / DAYS_IN_YEAR) * 100);

  return {
    targetYear,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    isToday,
    isPassedThisYear,
    targetDate,
    milestoneDayOfYear,
    yearPositionPercent
  };
}

/**
 * 8 Key Spiritual Resolutions for the New Hijri Year
 */
export const NEW_HIJRI_YEAR_RESOLUTIONS = [
  {
    id: 'res-salat-jamaat',
    titleBn: '৫ ওয়াক্ত সালাত জামাতে তাকবীরে উলার সাথে আদায়ের শপথ',
    subtitleBn: 'আল্লাহর কাছে সবচেয়ে প্রিয় আমল সময়মতো নামাজ আদায় করা',
    icon: '🕌'
  },
  {
    id: 'res-quran-daily',
    titleBn: 'প্রতিদিন অর্থ ও তাফসীরসহ ন্যূনতম ১০ আয়াত তিলাওয়াত',
    subtitleBn: 'কুরআনকে জীবনের পথপ্রদর্শক ও আত্মিক শক্তির উৎস বানানো',
    icon: '📖'
  },
  {
    id: 'res-muharram-fasting',
    titleBn: 'মুহররমের আশুরা ও নফল সিয়াম পালনের প্রস্তুতি',
    subtitleBn: 'রমজানের পর সবচেয়ে মর্যাদাপূর্ণ সিয়াম সাধনা',
    icon: '🌙'
  },
  {
    id: 'res-muhasabah-tawbah',
    titleBn: 'বিগত ১ বছরের গুনাহের জন্য খাঁটি তওবা ও আত্মপর্যালোচনা',
    subtitleBn: 'উমর (রা.)-এর বাণী: হিসাব নেওয়ার আগেই নিজের হিসাব নাও',
    icon: '🤲'
  },
  {
    id: 'res-parents-relatives',
    titleBn: 'পিতা-মাতার খেদমত ও আত্মীয়তার সম্পর্ক সুদৃঢ় করা',
    subtitleBn: 'রিজিকে বরকত ও দীর্ঘ নেক হায়াতের অন্যতম মাধ্যম',
    icon: '🤍'
  },
  {
    id: 'res-halal-earning',
    titleBn: 'হারাম বর্জন ও শতভাগ হালাল উপার্জনের ওপর অবিচল থাকা',
    subtitleBn: 'ইবাদত ও দোয়া কবুল হওয়ার প্রধানতম পূর্বশর্ত',
    icon: '⚖️'
  },
  {
    id: 'res-charity-sadaqah',
    titleBn: 'নিয়মিত গোপন দান-সদকাহ ও দুস্থদের পাশে দাঁড়ানো',
    subtitleBn: 'সাদাকাহ অপমৃত্যু রোধ করে এবং রবের ক্রোধ নিভিয়ে দেয়',
    icon: '🎁'
  },
  {
    id: 'res-tongue-guard',
    titleBn: 'গিবত, পরনিন্দা ও সোশ্যাল মিডিয়ায় অনর্থক সময় অপচয় বর্জন',
    subtitleBn: 'মুত্তাকীর পরিচয়: জবান ও হাত থেকে অন্য মুসলমান নিরাপদ থাকে',
    icon: '🛡️'
  }
];

/**
 * Multi-Calendar Year Cycle Progress Data Types
 */
export interface CalendarCycleStats {
  calendarType: 'hijri' | 'gregorian' | 'bengali';
  titleBn: string;
  yearNumber: number;
  yearLabelBn: string;
  currentDay: number;
  totalDays: number;
  remainingDays: number;
  progressPercent: number;
  seasonOrPhaseBn: string;
  cycleSignificanceBn: string;
  themeGradient: string;
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  currentDateFormattedBn: string;
}

export interface TripleYearProgressSummary {
  hijri: CalendarCycleStats;
  gregorian: CalendarCycleStats;
  bengali: CalendarCycleStats;
  lunarSolarGapDays: number; // ~11 days difference per solar year
  akhiraReflectionBn: string;
  examGroundConceptBn: string;
}

/**
 * Calculate full triple year cycle stats for today or any specific date
 */
export function getTripleYearProgressSummary(now: Date = new Date()): TripleYearProgressSummary {
  // 1. Hijri (৩৫৪ দিন - চন্দ্র বর্ষপঞ্জি)
  const hijriDetails = getHijriCalendarDetails(now);
  const hijriStats: CalendarCycleStats = {
    calendarType: 'hijri',
    titleBn: 'ইসলামিক হিজরি সন (চন্দ্র বর্ষচক্র)',
    yearNumber: hijriDetails.hYear,
    yearLabelBn: `${toBengaliDigits(hijriDetails.hYear)} হিজরি`,
    currentDay: hijriDetails.dayOfYear,
    totalDays: 354,
    remainingDays: hijriDetails.daysLeftToNewYear,
    progressPercent: hijriDetails.yearProgressPercent,
    seasonOrPhaseBn: `মাস: ${hijriDetails.monthNameBn} (${toBengaliDigits(hijriDetails.hDay)} তারিখ)`,
    cycleSignificanceBn: 'পবিত্র চন্দ্র হিসাবের ৩৫৪ দিন; রোজা, হজ ও সম্মানিত ৪ হারাম মাসের সঠিক ইবাদত কাল',
    themeGradient: 'from-amber-950 via-emerald-950 to-teal-950',
    themeColor: 'amber',
    badgeBg: 'bg-amber-400 text-slate-950',
    badgeText: '৩৫৪ দিন চন্দ্রচক্র',
    borderColor: 'border-amber-400/80',
    currentDateFormattedBn: `${toBengaliDigits(hijriDetails.hDay)} ${hijriDetails.monthNameBn} ${toBengaliDigits(hijriDetails.hYear)} হিজরি`
  };

  // 2. Gregorian (৩৬৫/৩৬৬ দিন - সৌর আন্তর্জাতিক সন)
  const gYear = now.getFullYear();
  const isLeapYear = (gYear % 4 === 0 && gYear % 100 !== 0) || (gYear % 400 === 0);
  const totalGregorianDays = isLeapYear ? 366 : 365;
  const startOfYear = new Date(gYear, 0, 1);
  const elapsedGregorianDays = Math.min(
    totalGregorianDays,
    Math.max(1, Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  );
  const remainingGregorianDays = Math.max(0, totalGregorianDays - elapsedGregorianDays);
  const gregorianProgressPercent = Math.min(100, Math.max(0, Math.round((elapsedGregorianDays / totalGregorianDays) * 100)));

  const gregorianMonthNames = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const gregorianStats: CalendarCycleStats = {
    calendarType: 'gregorian',
    titleBn: 'ইংরেজি গ্রেগরীয় সন (আন্তর্জাতিক সৌরচক্র)',
    yearNumber: gYear,
    yearLabelBn: `${toBengaliDigits(gYear)} খ্রিষ্টাব্দ`,
    currentDay: elapsedGregorianDays,
    totalDays: totalGregorianDays,
    remainingDays: remainingGregorianDays,
    progressPercent: gregorianProgressPercent,
    seasonOrPhaseBn: `মাস: ${gregorianMonthNames[now.getMonth()]} (${toBengaliDigits(now.getDate())} তারিখ)`,
    cycleSignificanceBn: 'দুনিয়াবি কর্মপরিকল্পনা, কর্মঘণ্টা ও আন্তর্জাতিক হিসাবের ৩৬৫ দিনের সৌর পরিক্রমা',
    themeGradient: 'from-sky-950 via-teal-950 to-slate-950',
    themeColor: 'sky',
    badgeBg: 'bg-sky-400 text-slate-950',
    badgeText: `${toBengaliDigits(totalGregorianDays)} দিন সৌরচক্র`,
    borderColor: 'border-sky-400/80',
    currentDateFormattedBn: `${toBengaliDigits(now.getDate())} ${gregorianMonthNames[now.getMonth()]} ${toBengaliDigits(gYear)} খ্রি.`
  };

  // 3. Bengali (বঙ্গাব্দ - ৩৬৫ দিন সৌর ঋতুচক্র)
  // Bengali year starts on April 14 (Pohela Baishakh)
  let bStart = new Date(gYear, 3, 14); // 14 April
  let bYear = gYear - 593;
  if (now.getTime() < bStart.getTime()) {
    bStart = new Date(gYear - 1, 3, 14);
    bYear = gYear - 594;
  }
  const totalBengaliDays = 365;
  const elapsedBengaliDays = Math.min(
    totalBengaliDays,
    Math.max(1, Math.floor((now.getTime() - bStart.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  );
  const remainingBengaliDays = Math.max(0, totalBengaliDays - elapsedBengaliDays);
  const bengaliProgressPercent = Math.min(100, Math.max(0, Math.round((elapsedBengaliDays / totalBengaliDays) * 100)));

  const bengaliStats: CalendarCycleStats = {
    calendarType: 'bengali',
    titleBn: 'ঐতিহ্যবাহী বাংলা সন (ফসলি ও ঋতুচক্র)',
    yearNumber: bYear,
    yearLabelBn: `${toBengaliDigits(bYear)} বঙ্গাব্দ`,
    currentDay: elapsedBengaliDays,
    totalDays: totalBengaliDays,
    remainingDays: remainingBengaliDays,
    progressPercent: bengaliProgressPercent,
    seasonOrPhaseBn: `পহেলা বৈশাখ থেকে গণনা • দিন: ${toBengaliDigits(elapsedBengaliDays)}/${toBengaliDigits(totalBengaliDays)}`,
    cycleSignificanceBn: 'বাংলার প্রকৃতি, কৃষিকাজ, ষড়ঋতু ও ঐতিহ্যবাহী সাংস্কৃতিক হিসাবের ৩৬৫ দিন',
    themeGradient: 'from-emerald-950 via-green-950 to-teal-950',
    themeColor: 'emerald',
    badgeBg: 'bg-emerald-400 text-slate-950',
    badgeText: '৩৬৫ দিন বঙ্গাব্দ',
    borderColor: 'border-emerald-400/80',
    currentDateFormattedBn: `দিন: ${toBengaliDigits(elapsedBengaliDays)} • ${toBengaliDigits(bYear)} বঙ্গাব্দ`
  };

  return {
    hijri: hijriStats,
    gregorian: gregorianStats,
    bengali: bengaliStats,
    lunarSolarGapDays: totalGregorianDays - 354, // typically 11 days (or 12 in leap year)
    akhiraReflectionBn: 'দুনিয়া মুমিনের স্থায়ী আবাস নয়, বরং চিরন্তন আখেরাতের পরীক্ষাগার ও শস্যক্ষেত্র (الدُّنْيَا مَزْرَعَةُ الآخِرَةِ)। তিনটি বর্ষচক্রের প্রতিটি ক্ষয়প্রাপ্ত দিন মানে আমাদের নির্ধারিত হায়াত থেকে একটি দিন চিরতরে ফুরিয়ে গেল।',
    examGroundConceptBn: 'আল্লাহ তাআলা সূরা আল-মুলকে ঘোষণা করেছেন: "যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, যাতে তোমাদের পরীক্ষা করেন যে কে তোমাদের মধ্যে আমলের দিক থেকে উত্তম।" (সূরা মুলক: ২)। এই তিনটি বর্ষপঞ্জির দিনগণনা কেবল সময়ের সংখ্যা নয়, বরং মহান রবের সন্তুষ্টি অর্জনের এক একটি সুবর্ণ সুযোগ।'
  };
}

/**
 * --------------------------------------------------------------------------
 * Prohibited and Discouraged Deeds Guidelines (নিষিদ্ধ ও স্বভাবগত বর্জনকৃত আমল)
 * --------------------------------------------------------------------------
 */
export interface ProhibitedDeedItem {
  id: string;
  category: 'prayer_time' | 'fasting_day' | 'habitual_sin' | 'social_action';
  categoryLabelBn: string;
  titleBn: string;
  arabicPhrase?: string;
  prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)' | 'মাকরূহে তাহরীমী' | 'মাকরূহে তানযীহী' | 'কবিরা গুনাহ';
  timeOrConditionBn: string;
  authenticReferenceBn: string;
  hadithOrQuranQuoteBn: string;
  graveConsequenceBn: string;
  remedyAndRepentanceBn: string;
  icon: string;
}

export const ALL_PROHIBITED_DEEDS: ProhibitedDeedItem[] = [
  // 1. Forbidden Prayer Times (৩টি নিষিদ্ধ নামাজের সময়)
  {
    id: 'forbidden_time_sunrise',
    category: 'prayer_time',
    categoryLabelBn: 'নিষিদ্ধ সালাতের সময়',
    titleBn: '১. সূর্যোদয়ের সময় (সূর্য ওঠা থেকে এক বর্শা পরিমাণ ওপরে না ওঠা পর্যন্ত)',
    arabicPhrase: 'وَقْتُ طُلُوعِ الشَّمْس',
    prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)',
    timeOrConditionBn: 'সূর্য উদিত হওয়া শুরু থেকে প্রায় ১৫-২০ মিনিট পর্যন্ত (যতক্ষণ না রোদের তীব্রতা ছড়িয়ে পড়ে)',
    authenticReferenceBn: 'সহীহ মুসলিম: ৮৩১; তিরমিযী: ১৫৮; আবু দাউদ: ৩১৯০',
    hadithOrQuranQuoteBn: 'উকবা ইবন আমের জুহানী (রা.) বলেন: "তিনটি এমন সময় রয়েছে যাতে রাসূলুল্লাহ ﷺ আমাদের সালাত আদায় করতে কিংবা আমাদের মৃতদের দাফন করতে নিষেধ করেছেন: সূর্যোদয়ের সময় যতক্ষণ না তা ওপরে ওঠে..."',
    graveConsequenceBn: 'এ সময়ে সূর্য শয়তানের দুই শিংয়ের মাঝ দিয়ে উদিত হয় এবং মুশরিকরা সূর্যকে সেজদা করে। এ সময়ে নামাজ আদায় করলে তা বাতিল বলে গণ্য হয়।',
    remedyAndRepentanceBn: 'সূর্যোদয়ের ১৫-২০ মিনিট পর যখন সূর্য উজ্জ্বল হয় তখন ইশরাকের নামাজ পড়ার সুযোগ তৈরি হয়। কোনো ফরজ নামাজ কাজা হয়ে থাকলে সূর্যোদয় শেষ হওয়া পর্যন্ত অপেক্ষা করে তবেই পড়তে হবে।',
    icon: '🌅'
  },
  {
    id: 'forbidden_time_zenith',
    category: 'prayer_time',
    categoryLabelBn: 'নিষিদ্ধ সালাতের সময়',
    titleBn: '২. ঠিক দ্বিপ্রহরের সময় (সূর্য মধ্যাকাশে খাড়া থাকা থেকে হেলে যাওয়ার পূর্ব পর্যন্ত)',
    arabicPhrase: 'وَقْتُ الزَّوَال / قَائِمُ الظَّهِيرَة',
    prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)',
    timeOrConditionBn: 'দুপুরের ঠিক মধ্যভাগে সূর্য যখন মাথার ঠিক ওপরে স্থির থাকে (জাওয়ালের পূর্বের আনুমানিক ৫-১০ মিনিট)',
    authenticReferenceBn: 'সহীহ মুসলিম: ৮৩১',
    hadithOrQuranQuoteBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "...এবং ঠিক দ্বিপ্রহরের সময় যতক্ষণ না সূর্য পশ্চিমাকাশে হেলে যায়।" হাদীস শরীফে এসেছে এ সময়ে জাহান্নামের আগুনকে অতিরিক্ত উত্তপ্ত ও প্রজ্বলিত করা হয়।',
    graveConsequenceBn: 'জাহান্নামের উত্তাপের এ সময়ে সেজদা করা নিষেধ। জুমার দিন ছাড়া অন্য দিনে এই সময়ে নফল নামাজ পড়াও নিষেধ।',
    remedyAndRepentanceBn: 'সূর্য সামান্য পশ্চিমে হেলে গেলেই যোহরের ওয়াক্ত প্রবেশ করে এবং তখন নামাজ বৈধ ও ফরজ হয়। এ সময়টুকুতে ইস্তিগফার ও জিকিরে অতিবাহিত করা উত্তম।',
    icon: '☀️'
  },
  {
    id: 'forbidden_time_sunset',
    category: 'prayer_time',
    categoryLabelBn: 'নিষিদ্ধ সালাতের সময়',
    titleBn: '৩. সূর্যাস্তের সময় (সূর্য হলুদ বর্ণ ধারণ ও অস্ত যাওয়ার সময়)',
    arabicPhrase: 'وَقْتُ غُرُوبِ الشَّمْس',
    prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)',
    timeOrConditionBn: 'সূর্য যখন ডুবতে শুরু করে এবং দিগন্তে রক্তিম আলো ছড়িয়ে পূর্ণ অস্তমিত না হওয়া পর্যন্ত (মাগরিবের ঠিক পূর্বের ১০-১৫ মিনিট)',
    authenticReferenceBn: 'সহীহ বুখারী: ৫৮১; সহীহ মুসলিম: ৮৩১',
    hadithOrQuranQuoteBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "...এবং যখন সূর্য অস্তমিত হতে থাকে যতক্ষণ না তা পুরোপুরি ডুবে যায়।" (তবে ওই দিনের আসর পড়তে দেরি হলে কাজা এড়াতে কেবল আসরের ফরজ আদায় করা যাবে)।',
    graveConsequenceBn: 'সূর্যপূজকদের উপাসনার সময়ের সাথে সাদৃশ্য থাকায় এবং শয়তানের শিংয়ের মাঝ দিয়ে অস্ত যাওয়ায় এ সময় সকল নফল সালাত হারাম।',
    remedyAndRepentanceBn: 'মাগরিবের আযান ও সূর্যাস্ত সম্পূর্ণ হওয়া মাত্রই মাগরিবের ফরজ নামাজ আদায় করতে হবে। সূর্যাস্তের পূর্বে শুধু তাসবিহ, তওবা ও দোয়ায় মশগুল থাকুন।',
    icon: '🌇'
  },

  // 2. Forbidden Fasting Days (৫টি নিষিদ্ধ সিয়ামের দিন)
  {
    id: 'forbidden_fast_eid_fitr',
    category: 'fasting_day',
    categoryLabelBn: 'নিষিদ্ধ সিয়াম',
    titleBn: '১. ঈদুল ফিতরের দিন (১লা শাওয়াল)',
    arabicPhrase: 'يَوْمُ عِيدِ الفِطْر',
    prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)',
    timeOrConditionBn: 'ঈদুল ফিতরের দিন রোজা রাখা সম্পূর্ণ হারাম এবং এ দিনে রোজা রাখলে তা গুনাহের কারণ হয়',
    authenticReferenceBn: 'সহীহ বুখারী: ১৯৯০; সহীহ মুসলিম: ১১৪০',
    hadithOrQuranQuoteBn: 'হযরত উমর (রা.) ও আবু সাঈদ খুদরী (রা.) থেকে বর্ণিত: "রাসূলুল্লাহ ﷺ দুই ঈদের দিন রোজা রাখতে কঠোরভাবে নিষেধ করেছেন—ঈদুল ফিতরের দিন যা তোমাদের রোজার পর ইফতারের দিন, এবং ঈদুল আজহার দিন।"',
    graveConsequenceBn: 'আল্লাহর দেয়া মেহমানদারী ও নিয়ামতকে অস্বীকার করার শামিল। ফরজ সিয়ামের পর আনন্দ ও শুকরিয়া আদায়ের আদেশকে অমান্য করা হয়।',
    remedyAndRepentanceBn: 'সকাল বেলা মিষ্টিমুখ করে ঈদগাহে যাওয়া এবং শুকরিয়ার সাথে আনন্দ উপভোগ করা। শাওয়ালের ৬ রোজা ২রা শাওয়াল থেকে রাখা যাবে।',
    icon: '🎉'
  },
  {
    id: 'forbidden_fast_eid_adha',
    category: 'fasting_day',
    categoryLabelBn: 'নিষিদ্ধ সিয়াম',
    titleBn: '২. ঈদুল আজহার দিন (১০ই জিলহজ)',
    arabicPhrase: 'يَوْمُ عِيدِ الأَضْحَى',
    prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)',
    timeOrConditionBn: 'কুরবানির ঈদের দিন রোজা রাখা সম্পূর্ণরূপে হারাম',
    authenticReferenceBn: 'সহীহ বুখারী: ১৯৯০; সহীহ মুসলিম: ১১৪০',
    hadithOrQuranQuoteBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "ঈদুল আজহার দিনে তোমরা তোমাদের কুরবানির পশুর গোশত থেকে ভক্ষণ করবে।"',
    graveConsequenceBn: 'কুরবানির গোশত খাওয়া আল্লাহর মেহমানদারী। এ দিনে রোজা রাখলে আল্লাহর বিধানের অবাধ্যতা হয়।',
    remedyAndRepentanceBn: 'ঈদের সালাতের পর প্রথম খাদ্য হিসেবে কুরবানির গোশত গ্রহণ করা এবং শোকরানা আদায় করা।',
    icon: '🐑'
  },
  {
    id: 'forbidden_fast_tashreeq',
    category: 'fasting_day',
    categoryLabelBn: 'নিষিদ্ধ সিয়াম',
    titleBn: '৩. আইয়ামে তাশরিকের ৩ দিন (১১, ১২ ও ১৩ জিলহজ)',
    arabicPhrase: 'أَيَّامُ التَّشْرِيق',
    prohibitionLevel: 'হারাম (সম্পূর্ণ নিষিদ্ধ)',
    timeOrConditionBn: 'জিলহজ মাসের ১১, ১২ এবং ১৩ তারিখ রোজা রাখা সর্বসম্মতভাবে নিষিদ্ধ',
    authenticReferenceBn: 'সহীহ মুসলিম: ১১৪১',
    hadithOrQuranQuoteBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "আইয়ামে তাশরিক হলো পানাহার এবং মহান আল্লাহর জিকিরের দিন।"',
    graveConsequenceBn: 'আল্লাহর মেহমানদারী অস্বীকার করা এবং শরীয়তের সুনির্দিষ্ট নির্দেশ লঙ্ঘন করা।',
    remedyAndRepentanceBn: 'প্রতি ফরজ সালাতের পর উচ্চৈঃস্বরে তাকবীরে তাশরিক পাঠ করা এবং দান-সদকাহ ও আত্মীয়দের আতিথেয়তায় অংশ নেওয়া।',
    icon: '🥩'
  },

  // 3. Habitual Sins & Soul Poisons (স্বভাবগত কবিরা গুনাহ ও বর্জনীয় পাপ)
  {
    id: 'forbidden_sin_gheebat',
    category: 'habitual_sin',
    categoryLabelBn: 'স্বভাবগত পাপ ও ধ্বংসকারী কর্ম',
    titleBn: 'গীবত ও পরনিন্দা (মৃত ভাইয়ের গোশত খাওয়ার সমতুল্য)',
    arabicPhrase: 'الغِيبَةُ وَالنَّمِيمَة',
    prohibitionLevel: 'কবিরা গুনাহ',
    timeOrConditionBn: 'কারো অনুপস্থিতিতে তার এমন কোনো দোষ বা অপ্রিয় কথা আলোচনা করা যা সে শুনলে কষ্ট পাবে',
    authenticReferenceBn: 'সূরা আল-হুজুরাত: ১২; সহীহ মুসলিম: ২৫৮৯',
    hadithOrQuranQuoteBn: 'মহান আল্লাহ বলেন: "তোমাদের কেউ কি তার মৃত ভাইয়ের গোশত খাওয়া পছন্দ করবে? তোমরা তো তা অপছন্দ করো! অতএব আল্লাহকে ভয় করো।" (হুজুরাত: ১২)। রাসূল ﷺ বলেন: "গীবত হলো তোমার ভাইয়ের এমন আলোচনা করা যা সে অপছন্দ করে।"',
    graveConsequenceBn: 'হাশরের ময়দানে নিজের নেক আমল অন্যকে দিয়ে দিতে হবে এবং অন্যের পাপের বোঝা নিজের কাঁধে চাপিয়ে জাহান্নামে নিক্ষিপ্ত হতে হবে।',
    remedyAndRepentanceBn: 'অবিলম্বে জবান সংযত করা, যার গীবত করা হয়েছে তার জন্য মাগফিরাতের দোয়া করা এবং সম্ভব হলে তার কাছে ক্ষমা চেয়ে নেওয়া।',
    icon: '🚫'
  },
  {
    id: 'forbidden_sin_arrogance',
    category: 'habitual_sin',
    categoryLabelBn: 'স্বভাবগত পাপ ও ধ্বংসকারী কর্ম',
    titleBn: 'অহংকার ও আত্মম্ভরিতা (ইবলিসের প্রথম পাপ)',
    arabicPhrase: 'الكِبْرُ وَالبَطَر',
    prohibitionLevel: 'কবিরা গুনাহ',
    timeOrConditionBn: 'নিজেকে অন্যের চেয়ে শ্রেষ্ঠ মনে করা এবং সত্য জেনেও তা প্রত্যাখ্যান করা',
    authenticReferenceBn: 'সহীহ মুসলিম: ৯১; সূরা আল-ইসরা: ৩৭',
    hadithOrQuranQuoteBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "যার অন্তরে অণু পরিমাণ অহংকার থাকবে, সে কস্মিনকালেও জান্নাতে প্রবেশ করতে পারবে না।" সাহাবীগণ জিজ্ঞেস করলেন, মানুষ তো সুন্দর পোশাক ও জুতো পছন্দ করে? নবীজি ﷺ বললেন: "আল্লাহ সুন্দর, তিনি সৌন্দর্য পছন্দ করেন। অহংকার হলো সত্যকে প্রত্যাখ্যান করা এবং মানুষকে তুচ্ছজ্ঞান করা।"',
    graveConsequenceBn: 'কেয়ামতের দিন অহংকারীদের পিপীলিকার মতো ক্ষুদ্র করে পদদলিত করা হবে এবং জাহান্নামের "বুলাস" নামক বিশেষ কারাগারে শাস্তি দেওয়া হবে।',
    remedyAndRepentanceBn: 'নিজের নশ্বরতা ও মাটির সৃষ্টি স্মরণ করা, ছোট-বড় সবাইকে আগে সালাম দেওয়া এবং বিনম্র আচরণ চর্চা করা।',
    icon: '🚷'
  },
  {
    id: 'forbidden_sin_waste',
    category: 'habitual_sin',
    categoryLabelBn: 'স্বভাবগত পাপ ও ধ্বংসকারী কর্ম',
    titleBn: 'অপচয় ও অপব্যয় (শয়তানের ভ্রাতৃত্ব)',
    arabicPhrase: 'الإِسْرَافُ وَالتَّبْذِير',
    prohibitionLevel: 'মাকরূহে তাহরীমী',
    timeOrConditionBn: 'খাদ্য, পানি, বিদ্যুৎ, অর্থ কিংবা অমূল্য সময়ের অপচয় ও অনর্থক ব্যয়',
    authenticReferenceBn: 'সূরা আল-ইসরা: ২৬-২৭; সূরা আল-আ’রাফ: ৩১',
    hadithOrQuranQuoteBn: 'মহান আল্লাহ বলেন: "নিশ্চয় অপচয়কারীরা শয়তানের ভাই, আর শয়তান তার রবের প্রতি অত্যন্ত অকৃতজ্ঞ।" (ইসরা: ২৭)। রাসূল ﷺ অজু করার সময়ও অতিরিক্ত পানি অপচয় করতে নিষেধ করেছেন, এমনকি প্রবাহিত নদীতে থাকলেও।',
    graveConsequenceBn: 'রিজিকে বরকত কমে যায়, দারিদ্র্য নেমে আসে এবং হাশরের মাঠে প্রতিটি কণা সম্পদের হিসাব দিতে হবে।',
    remedyAndRepentanceBn: 'প্লেটের খাবার অপচয় না করে পূর্ণ শেষ করা, পানির কল পরিমিত রাখা এবং অর্থ ব্যয়ে মিতব্যয়ী হওয়া।',
    icon: '💧'
  },
  {
    id: 'forbidden_sin_jumuah_talk',
    category: 'social_action',
    categoryLabelBn: 'মসজিদ ও সমাজের শিষ্টাচার',
    titleBn: 'জুমার খুতবার সময় কথা বলা বা মোবাইল ব্যবহার',
    arabicPhrase: 'اللَّغْوُ أَثْنَاءَ الخُطْبَة',
    prohibitionLevel: 'মাকরূহে তাহরীমী',
    timeOrConditionBn: 'ইমাম সাহেব যখন জুমার খুতবা দিচ্ছেন তখন যেকোনো ধরনের কথাবার্তা, ইশারা বা মোবাইল চালানো',
    authenticReferenceBn: 'সহীহ বুখারী: ৯৩৪; সহীহ মুসলিম: ৮৫১',
    hadithOrQuranQuoteBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "জুমার দিনে ইমামের খুতবারত অবস্থায় যদি তুমি তোমার সাথীকে বলো \'চুপ থাকো\', তবে তুমিও একটি অনর্থক কাজ করলে।" অন্য বর্ণনায়: তার জুমার সওয়াব বরবাদ হয়ে যায়।',
    graveConsequenceBn: 'জুমার জমার বিশেষ সাওয়াব ও মাগফিরাত নষ্ট হয়ে যায় এবং নামাজটি সাধারণ যোহরের মতো হয়ে পড়ে।',
    remedyAndRepentanceBn: 'খুতবার শুরু থেকে শেষ পর্যন্ত গভীর মনোযোগ সহকারে খুতবা শোনা এবং মোবাইল সাইলেন্ট বা বন্ধ রাখা।',
    icon: '📵'
  }
];

/**
 * --------------------------------------------------------------------------
 * Continuous Amals & Supplications Data (সাপ্তাহিক, বিশেষ দিন ও দৈনিক নির্দিষ্ট ক্ষণ)
 * --------------------------------------------------------------------------
 */
export interface ContinuousAmalItem {
  id: string;
  scope: 'weekly' | 'special_day' | 'daily_time_block';
  scopeLabelBn: string;
  timeSlotBn: string;
  titleBn: string;
  arabicPhrase?: string;
  targetCount: number;
  significanceBn: string;
  hadithReferenceBn: string;
  whyDoItBn: string;
  howToPracticeBn: string;
  icon: string;
}

export const ALL_CONTINUOUS_AMALS: ContinuousAmalItem[] = [
  // Weekly Amals (সাপ্তাহিক আমল)
  {
    id: 'amal_mon_thu_fast',
    scope: 'weekly',
    scopeLabelBn: 'সাপ্তাহিক আমল',
    timeSlotBn: 'প্রতি সোমবার ও বৃহস্পতিবার',
    titleBn: 'সোমবার ও বৃহস্পতিবারের সুন্নাত সিয়াম',
    arabicPhrase: 'صِيَامُ الإِثْنَيْنِ وَالخَمِيس',
    targetCount: 2,
    significanceBn: 'সপ্তাহের এ দুই দিন বান্দার আমলনামা আল্লাহর দরবারে পেশ করা হয়।',
    hadithReferenceBn: 'তিরমিযী: ৭৪৭; সহীহ মুসলিম: ১১৬২',
    whyDoItBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "সোমবার ও বৃহস্পতিবার আল্লাহর দরবারে আমল পেশ করা হয়; অতএব আমি পছন্দ করি যে রোজাদার অবস্থায় আমার আমল আল্লাহর সামনে পেশ করা হোক।"',
    howToPracticeBn: 'রবিবার ও বুধবার দিবাগত রাতে সাহরি খেয়ে সুন্নাত সিয়ামের নিয়ত করুন। আসর ও মাগরিবে দোয়ায় মশগুল থাকুন।',
    icon: '🌙'
  },
  {
    id: 'amal_jumuah_kahf_darood',
    scope: 'weekly',
    scopeLabelBn: 'সাপ্তাহিক আমল',
    timeSlotBn: 'পবিত্র জুমু’আ বার (শুক্রবার)',
    titleBn: 'সূরা আল-কাহাফ তিলাওয়াত ও ৮০ বার দরূদ শরীফ',
    arabicPhrase: 'سُورَة الكَهْفِ وَالصَّلَاةُ عَلَى النَّبِي',
    targetCount: 80,
    significanceBn: 'দাজ্জালের ফিতনা থেকে সুরক্ষা এবং দুই জুমার মধ্যবর্তী সময় নূরে আলোকিত থাকা।',
    hadithReferenceBn: 'সহীহুল জামে: ৬৪৭০; বায়হাকী: ৫৯৯৫',
    whyDoItBn: 'রাসূলুল্লাহ ﷺ বলেছেন: "যে ব্যক্তি জুমার দিন সূরা কাহাফ তিলাওয়াত করবে, তার জন্য এক জুমা থেকে অপর জুমা পর্যন্ত একটি বিশেষ নূর চমকাতে থাকবে।"',
    howToPracticeBn: 'জুমার দিন সূর্যাস্তের পূর্বে সূরা কাহাফ তিলাওয়াত সম্পন্ন করুন এবং আসরের পর ৮০ বার দরূদে ইব্রাহিম পাঠ করুন।',
    icon: '🕌'
  },
  {
    id: 'amal_ayyam_beed',
    scope: 'special_day',
    scopeLabelBn: 'বিশেষ চন্দ্রদিন',
    timeSlotBn: 'প্রতি আরবি মাসের ১৩, ১৪ ও ১৫ তারিখ',
    titleBn: 'আইয়ামে বীজের ৩টি সুন্নাহ সিয়াম (পূর্ণিমার রোজা)',
    arabicPhrase: 'صِيَامُ أَيَّامِ البِيض',
    targetCount: 3,
    significanceBn: 'প্রতি মাসের ৩টি রোজা সারা বছর রোজা রাখার সমতুল্য সওয়াব এনে দেয়।',
    hadithReferenceBn: 'সহীহ বুখারী: ১৯৮১; সহীহ মুসলিম: ১১৫৯',
    whyDoItBn: 'হযরত আবু হুরায়রা (রা.) বলেন: আমার প্রিয়তম নবীজি ﷺ আমাকে মৃত্যুর পূর্ব পর্যন্ত তিনটি বিষয়ের অসিয়ত করেছেন—প্রতি মাসে তিন দিন রোজা রাখা, চাশতের নামাজ পড়া এবং ঘুমানোর আগে বিতর পড়া।',
    howToPracticeBn: 'হিজরি মাসের ১২ তারিখ সন্ধ্যায় চাঁদের হিসাব দেখে সাহরির প্রস্তুতি নিন এবং ১৩, ১৪ ও ১৫ তারিখে সিয়াম পালন করুন।',
    icon: '🌕'
  },

  // Daily Time Blocks (দৈনিক নির্দিষ্ট ক্ষণের আমল)
  {
    id: 'amal_tahajjud_dawn',
    scope: 'daily_time_block',
    scopeLabelBn: 'দৈনিক নির্দিষ্ট ক্ষণ',
    timeSlotBn: 'রাতের শেষ তৃতীয়াংশ (ভোর / তাহাজ্জুদ)',
    titleBn: 'সালাতুত তাহাজ্জুদ ও সায়্যিদুল ইস্তিগফার',
    arabicPhrase: 'صَلَاةُ التَّهَجُّدِ وَالاسْتِغْفَار',
    targetCount: 8,
    significanceBn: 'রব সবচেয়ে নিকটবর্তী হন এবং বান্দার সকল মনের আশা ও তওবা কবুল করেন।',
    hadithReferenceBn: 'সহীহ বুখারী: ১১৪৫; সহীহ মুসলিম: ৭৫৮',
    whyDoItBn: 'মহান রব রাতের শেষ প্রহরে প্রথম আসমানে নেমে এসে ঘোষণা করেন: "কে আছো আমাকে ডাকবে, আমি তার ডাকে সাড়া দেব? কে আছো ক্ষমা চাইবে, আমি তাকে ক্ষমা করে দেব?"',
    howToPracticeBn: 'ফজরের আযানের ৩০-৪৫ মিনিট আগে উঠে ওজু করে ২ রাকাত করে ন্যূনতম ৪ থেকে ৮ রাকাত তাহাজ্জুদ আদায় করুন এবং সিজদায় কান্নাকাটি করুন।',
    icon: '🌌'
  },
  {
    id: 'amal_morning_dhikr',
    scope: 'daily_time_block',
    scopeLabelBn: 'দৈনিক নির্দিষ্ট ক্ষণ',
    timeSlotBn: 'ফজর পরবর্তী সকাল (সূর্যোদয়ের পূর্ব পর্যন্ত)',
    titleBn: 'সকালের মাসনূন দোয়া ও আয়াতুল কুরসি',
    arabicPhrase: 'أَذْكَارُ الصَّبَاحِ وَآيَةُ الكُرْسِي',
    targetCount: 33,
    significanceBn: 'সারাদিনের সকল ক্ষতি, জাদু-টোনা ও শয়তানের আক্রমণ থেকে আল্লাহর প্রত্যক্ষ সুরক্ষা।',
    hadithReferenceBn: 'তিরমিযী: ৩৩৮৮; নাসাঈ: ৯৯২৮',
    whyDoItBn: 'ফরজ নামাজের পর আয়াতুল কুরসি পাঠকারী এবং সকালের দোয়া পালনকারীর জান্নাতে প্রবেশে কেবল মৃত্যুই বাধা থাকে।',
    howToPracticeBn: 'ফজর শেষ করে জায়নামাজে বসে "সুবহানাল্লাহ" ৩৩ বার, "আলহামদুলিল্লাহ" ৩৩ বার, "আল্লাহু আকবার" ৩৪ বার এবং মাসনূন সকালের হেফাজতের দোয়া পড়ুন।',
    icon: '🌅'
  },
  {
    id: 'amal_chasht_duha',
    scope: 'daily_time_block',
    scopeLabelBn: 'দৈনিক নির্দিষ্ট ক্ষণ',
    timeSlotBn: 'সকাল ৯টা থেকে ১১টা (চাশত / সালাতুদ দুহা)',
    titleBn: 'সালাতুদ দুহা (শরীরের ৩৬০টি জোড়ের সাদাকাহ)',
    arabicPhrase: 'صَلَاةُ الضُّحَى',
    targetCount: 4,
    significanceBn: 'মানবদেহের ৩৬০টি অস্থির প্রতিটির পক্ষ থেকে প্রতিদিনের সাদাকাহ আদায় হয়ে যায়।',
    hadithReferenceBn: 'সহীহ মুসলিম: ৭২০',
    whyDoItBn: 'নবীজি ﷺ বলেছেন: "তোমাদের প্রত্যেকে যখন সকালে ওঠে তখন তার প্রতিটি জোড়ের পক্ষ থেকে একটি সাদাকাহ দেয়া আবশ্যক হয়ে যায়... আর দুপুরের পূর্বের দুই রাকাত চাশতের নামাজ এর সবকিছুর জন্য যথেষ্ট হয়ে যায়।"',
    howToPracticeBn: 'সূর্য যখন আকাশে বেশ ওপরে ওঠে তখন ২ অথবা ৪ রাকাত নফল নামাজ আদায় করুন।',
    icon: '☀️'
  },
  {
    id: 'amal_evening_maghrib',
    scope: 'daily_time_block',
    scopeLabelBn: 'দৈনিক নির্দিষ্ট ক্ষণ',
    timeSlotBn: 'সূর্যাস্ত ও মাগরিবের পর',
    titleBn: 'সন্ধ্যার হিফজ দোয়া ও সূরা আল-হাশরের শেষ তিন আয়াত',
    arabicPhrase: 'أَذْكَارُ المَسَاءِ وَخَوَاتِيمُ سُورَة الحَشْر',
    targetCount: 3,
    significanceBn: '৭০,০০০ ফেরেশতা সারা রাত ওই বান্দার জন্য মাগফিরাতের দোয়া করতে থাকে।',
    hadithReferenceBn: 'তিরমিযী: ২৯২২; আবু দাউদ: ৫০৮৮',
    whyDoItBn: '"আউজু বিকালিমাতিল্লাহিত তাম্মাতি মিন শাররি মা খালাক্ব" ৩ বার পড়লে ওই রাতে কোনো বিষাক্ত প্রাণী ক্ষতি করতে পারে না।',
    howToPracticeBn: 'মাগরিবের পর ৩ কুল (ইখলাস, ফালাক, নাস) ৩ বার করে পাঠ করুন এবং সন্ধ্যায় আল্লাহর বড়ত্ব স্মরণ করুন।',
    icon: '🌇'
  },
  {
    id: 'amal_sleep_mulk',
    scope: 'daily_time_block',
    scopeLabelBn: 'দৈনিক নির্দিষ্ট ক্ষণ',
    timeSlotBn: 'রাত্রে ঘুমানোর পূর্বে',
    titleBn: 'সূরা আল-মুলক তিলাওয়াত ও অজুর সাথে শয়ন',
    arabicPhrase: 'سُورَة المُلْكِ وَالنَّوْمُ عَلَى طَهَارَة',
    targetCount: 1,
    significanceBn: 'কবরের কঠিন আজাব থেকে মুক্তি এবং জান্নাত লাভ না হওয়া পর্যন্ত এই সূরা আল্লাহর কাছে সুপারিশ করবে।',
    hadithReferenceBn: 'তিরমিযী: ২৮৯১; সহীহুল জামে: ৩৬৪৪',
    whyDoItBn: 'রাসূলুল্লাহ ﷺ সূরা মুলক তিলাওয়াত না করে রাতে কখনো ঘুমাতেন না। এটি কবরের আজাব প্রতিরোধকারী ঢাল।',
    howToPracticeBn: 'বিছানায় যাওয়ার পূর্বে ওজু করুন, বিছানা তিনবার ঝেড়ে নিন, সূরা আল-মুলক তিলাওয়াত করুন এবং সুন্নাত শয়ন দোয়া পড়ে ডান কাত হয়ে শুয়ে পড়ুন।',
    icon: '🌙'
  }
];

