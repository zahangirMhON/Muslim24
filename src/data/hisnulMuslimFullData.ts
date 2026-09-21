// Comprehensive Hisnul Muslim (حصن المسلم - Fortress of the Muslim) Data
// Authentic Supplications from Quran & Sunnah compiled by Sa'id ibn Wahf al-Qahtani
// Includes Arabic, Bengali pronunciation, Bengali meaning, Sahih references, Audio MP3 streams, Video lectures, and PDF book reader data.

export interface HisnulMuslimItem {
  id: string;
  chapterNumber: number;
  chapterTitleBn: string;
  chapterTitleAr: string;
  titleBn: string;
  titleEn: string;
  arabicText: string;
  transliterationBn: string;
  translationBn: string;
  virtueAndBenefitBn: string;
  referenceBn: string;
  targetCount: number;
  countDisplayBn: string;
  timeSlotSuggestion?: {
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
    routineNameBn: string;
  };
  audioUrl: string;
  backupAudioUrl?: string;
  videoId?: string; // YouTube Video ID for video recitation
  pdfPageNumber?: number;
  category: 'morning_evening' | 'sleep_wake' | 'prayer_wudu' | 'protection_ruqyah' | 'hardship_relief' | 'family_daily' | 'istighfar_repentance' | 'hajj_travel';
}

export interface HisnulMuslimCategory {
  id: string;
  nameBn: string;
  nameAr: string;
  icon: string;
  descriptionBn: string;
  itemCount: number;
}

export const HISNUL_MUSLIM_CATEGORIES: HisnulMuslimCategory[] = [
  {
    id: 'morning_evening',
    nameBn: 'সকাল ও সন্ধ্যার মাসনূন জিকির',
    nameAr: 'أذكار الصباح والمساء',
    icon: '🌅',
    descriptionBn: 'দিন ও রাতে শয়তান, বিপদ ও অনিষ্ট থেকে সম্পূর্ণ সুরক্ষার সুন্নাহ আজকার',
    itemCount: 8
  },
  {
    id: 'sleep_wake',
    nameBn: 'ঘুমানো ও ঘুম থেকে জাগরণের দোয়া',
    nameAr: 'أذكار النوم والاستيقاظ',
    icon: '🌙',
    descriptionBn: 'সুন্নাত অনুযায়ী শান্তিময় নিদ্রা, দুঃস্বপ্ন প্রতিরোধ ও ফজরের জাগরণ',
    itemCount: 6
  },
  {
    id: 'prayer_wudu',
    nameBn: 'অযু, আজান ও সালাতের দোয়া',
    nameAr: 'أدعية الوضوء والأذان والصلاة',
    icon: '🕌',
    descriptionBn: 'তাকবীরে তাহরিমা থেকে সালাম ফিরানো পরবর্তী সহীহ মাসনূন দোয়া',
    itemCount: 7
  },
  {
    id: 'protection_ruqyah',
    nameBn: 'রুকাইয়া, বদনজর ও অনিষ্ট থেকে নিরাপত্তা',
    nameAr: 'الرقية والتعوذ من الشرور',
    icon: '🛡️',
    descriptionBn: 'জাদুটোনা, কুদৃষ্টি, জ্বিনের আছর ও রোগব্যাধি থেকে আরোগ্যের আমল',
    itemCount: 6
  },
  {
    id: 'hardship_relief',
    nameBn: 'বিপদ-আপদ, ঋণমুক্তি ও দুশ্চিন্তা নিরাময়',
    nameAr: 'دعاء الكرب والهم وقضاء الدين',
    icon: '🤲',
    descriptionBn: 'মানসিক যন্ত্রণা, অভাব-অনটন ও হতাশা থেকে মুক্তির কুরআনী ও নববী দোয়া',
    itemCount: 6
  },
  {
    id: 'family_daily',
    nameBn: 'খাবার, পোশাক, ঘর ও পারিবারিক জীবন',
    nameAr: 'أدعية الطعام واللباس والمنزل',
    icon: '🏡',
    descriptionBn: 'ঘরে প্রবেশ-বাহির, আহার, নতুন পোশাক ও দাম্পত্য জীবনের বরকত',
    itemCount: 5
  },
  {
    id: 'istighfar_repentance',
    nameBn: 'সাইয়্যিদুল ইস্তিগফার ও ক্ষমা প্রার্থনা',
    nameAr: 'سيد الاستغفار والتوبة',
    icon: '📿',
    descriptionBn: 'গুনাহ মাফ, জান্নাত প্রাপ্তি ও মনের পবিত্রতা অর্জনের শ্রেষ্ঠতম বাক্য',
    itemCount: 5
  }
];

export const HISNUL_MUSLIM_ITEMS: HisnulMuslimItem[] = [
  // ================= 1. সকাল ও সন্ধ্যার মাসনূন জিকির =================
  {
    id: 'hm-01',
    chapterNumber: 27,
    chapterTitleBn: 'সকাল ও সন্ধ্যার জিকির',
    chapterTitleAr: 'أذكار الصباح والمساء',
    titleBn: 'সাইয়্যিদুল ইস্তিগফার (ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া)',
    titleEn: 'Sayyidul Istighfar (The Master Supplication for Forgiveness)',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    transliterationBn: 'আল্লাহুম্মা আনতা রব্বী লা ইলা-হা ইল্লা আনতা, খালাক্বতানী ওয়া আনা ‘আব্দুকা, ওয়া আনা ‘আলা ‘আহ্দিকা ওয়া ওয়া‘দিকা মাসতাত্বা‘তু, আ‘ঊযু বিকা মিন শাররি মা ছানা‘তু, আবূউ লাকা বিনি‘মাতিকা ‘আলাইয়্যা, ওয়া আবূউ বিযাম্বী ফাগফির লী, ফাইন্নাহূ লা ইয়াগফিরুয যুনূবা ইল্লা আনতা।',
    translationBn: 'হে আল্লাহ! আপনিই আমার প্রতিপালক। আপনি ছাড়া কোনো সত্য উপাস্য নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার বান্দা। আমি আমার সাধ্যমতো আপনার অঙ্গীকার ও প্রতিশ্রুতির ওপর অবিচল আছি। আমি যা করেছি তার অনিষ্ট থেকে আপনার কাছে আশ্রয় চাই। আমার ওপর আপনার যে নেয়ামত রয়েছে তা স্বীকার করছি এবং আমার গুনাহও স্বীকার করছি। অতএব আমাকে ক্ষমা করে দিন; কারণ আপনি ছাড়া গুনাহ ক্ষমা করার কেউ নেই।',
    virtueAndBenefitBn: 'যে ব্যক্তি দিনে দৃঢ় বিশ্বাসের সাথে এটি পড়বে এবং সন্ধ্যা হওয়ার পূর্বে মারা যাবে, সে জান্নাতীদের অন্তর্ভুক্ত হবে। আর যে রাতে পড়বে এবং সকাল হওয়ার পূর্বে মারা যাবে, সেও জান্নাতী হবে। (সহীহ বুখারী: ৬৩০৬)',
    referenceBn: 'সহীহ বুখারী, হাদিস নং ৬৩০৬; হিসনুল মুসলিম অধ্যায় ২৭',
    targetCount: 1,
    countDisplayBn: 'সকাল ও সন্ধ্যায় ১ বার',
    timeSlotSuggestion: {
      startTime: '05:30',
      endTime: '07:00',
      routineNameBn: 'সকালের মাসনূন জিকির শিডিউল'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
    videoId: 'd0_x_04QJ9o',
    pdfPageNumber: 74,
    category: 'morning_evening'
  },
  {
    id: 'hm-02',
    chapterNumber: 27,
    chapterTitleBn: 'সকাল ও সন্ধ্যার জিকির',
    chapterTitleAr: 'أذكار الصباح والمساء',
    titleBn: 'আয়াতুল কুরসী (কুরআনের শ্রেষ্ঠতম আয়াত)',
    titleEn: 'Ayat al-Kursi (The Greatest Verse of Protection)',
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliterationBn: 'আল্লা-হু লা ইলা-হা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূম। লা তা’খুযুহু সিনাতুওঁ ওয়ালা নাওম। লাহূ মা ফিস সামা-ওয়া-তি ওয়া মা ফিল আরদ্ব। মান যাল্লাযী ইয়াশফা‘উ ‘ইনদাহূ ইল্লা বিইযনিহ। ইয়া‘লামু মা বাইনা আইদীহিম ওয়ামা খালফাহুম, ওয়ালা ইয়ুহীতূনা বিশাইইম মিন ‘ইলমিহী ইল্লা বিমা শা-আ। ওয়াসি‘আ কুরসিয়্যুহুস সামা-ওয়া-তি ওয়াল আরদ্ব, ওয়ালা ইয়াউদুহু হিফযুহুমা, ওয়া হুওয়াল ‘আলিইয়্যুল ‘আযীম।',
    translationBn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তন্দ্রা ও নিদ্রা তাঁকে স্পর্শ করে না। আসমান ও জমিনে যা কিছু রয়েছে সবই তাঁর। কে আছে যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে তা তিনি জানেন। আর তাঁর জ্ঞানের কোনো কিছুকেই তারা আয়ত্ত করতে পারে না, কেবল তিনি যা ইচ্ছা করেন তা ছাড়া। তাঁর কুরসী আকাশ ও জমিন পরিব্যাপ্ত করে আছে এবং এ দুটির সংরক্ষণ তাঁর জন্য কোনো কঠিন কাজ নয়। আর তিনি সুউচ্চ, মহামহিম।',
    virtueAndBenefitBn: 'যে ব্যক্তি সকালে এটি পড়বে সে সন্ধ্যা পর্যন্ত জ্বিন-শয়তানের উপদ্রব থেকে হেফাজতে থাকবে। আর যে সন্ধ্যায় পড়বে সে সকাল পর্যন্ত নিরাপদ থাকবে। (নাসাঈ কুবরা, সহীহ আত-তারগীব: ৬৫৭)',
    referenceBn: 'সূরা আল-বাকারা: ২৫৫; সহীহ আত-তারগীব ও তারহীব ৬৫৭; হিসনুল মুসলিম অধ্যায় ২৭',
    targetCount: 1,
    countDisplayBn: 'সকাল ও সন্ধ্যায় ১ বার',
    timeSlotSuggestion: {
      startTime: '06:00',
      endTime: '07:30',
      routineNameBn: 'সকাল ও সন্ধ্যার আজকার'
    },
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
    backupAudioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3',
    videoId: 'q76N4U-F5oA',
    pdfPageNumber: 71,
    category: 'morning_evening'
  },
  {
    id: 'hm-03',
    chapterNumber: 27,
    chapterTitleBn: 'সকাল ও সন্ধ্যার জিকির',
    chapterTitleAr: 'أذكار الصباح والمساء',
    titleBn: '৩ কুল (সূরা ইখলাস, ফালাক্ব ও নাস)',
    titleEn: 'The 3 Quls (Surah Ikhlas, Falaq & Nas)',
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliterationBn: 'ক্বুল হুওয়াল্লা-হু আহাদ... ক্বুল আ‘ঊযু বিরব্বিল ফালাক্ব... ক্বুল আ‘ঊযু বিরব্বিন না-স...',
    translationBn: 'বলুন, তিনিই আল্লাহ, একক... বলুন, আমি আশ্রয় প্রার্থনা করছি ঊষার রবের কাছে... বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের রবের কাছে...',
    virtueAndBenefitBn: 'রাসূলুল্লাহ (সা.) ইরশাদ করেন: সকাল ও সন্ধ্যায় তিনবার করে এ তিনটি সূরা পাঠ করলে তা তোমাকে সব অনিষ্ট থেকে রক্ষার জন্য যথেষ্ট হবে। (আবু দাউদ: ৫০৮২, তিরমিযী: ৩৫৭৫)',
    referenceBn: 'আবু দাউদ ৫০৮২, তিরমিযী ৩৫৭৫ (হাসান সহীহ)',
    targetCount: 3,
    countDisplayBn: 'সকাল ও সন্ধ্যায় ৩ বার করে',
    timeSlotSuggestion: {
      startTime: '06:30',
      endTime: '08:00',
      routineNameBn: 'সকালের ৩ কুল তিলাওয়াত'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/112.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/112.mp3',
    videoId: 'c_Kk1Q8P_hU',
    pdfPageNumber: 72,
    category: 'morning_evening'
  },
  {
    id: 'hm-04',
    chapterNumber: 27,
    chapterTitleBn: 'সকাল ও সন্ধ্যার জিকির',
    chapterTitleAr: 'أذكار الصباح والمساء',
    titleBn: 'বিপদ ও বিষাক্ত প্রাণী থেকে আশ্রয়ের দোয়া',
    titleEn: 'Seeking Protection by the Perfect Words of Allah',
    arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliterationBn: 'আ‘ঊযু বিকালিমা-তিল্লা-হিত তা-ম্মা-তি মিন শাররি মা খালাক্ব।',
    translationBn: 'আমি আল্লাহর পরিপূর্ণ কালেমাসমূহের অসীলায় তাঁর সৃষ্টির সমস্ত অনিষ্ট থেকে আশ্রয় প্রার্থনা করছি।',
    virtueAndBenefitBn: 'যে ব্যক্তি সন্ধ্যায় তিনবার এটি বলবে, সে রাতে কোনো বিষাক্ত প্রাণী কিংবা অনিষ্ট তাকে ক্ষতি করতে পারবে না। (সহীহ মুসলিম: ২৭০৯)',
    referenceBn: 'সহীহ মুসলিম ২৭০৯, তিরমিযী ৩৬০৪',
    targetCount: 3,
    countDisplayBn: 'সন্ধ্যায় ৩ বার',
    timeSlotSuggestion: {
      startTime: '17:30',
      endTime: '18:30',
      routineNameBn: 'সন্ধ্যার মাগরিব পূর্ববর্তী আজকার'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/113.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/113.mp3',
    pdfPageNumber: 77,
    category: 'morning_evening'
  },
  {
    id: 'hm-05',
    chapterNumber: 27,
    chapterTitleBn: 'সকাল ও সন্ধ্যার জিকির',
    chapterTitleAr: 'أذكار الصباح والمساء',
    titleBn: '১০০ বার তাসবিহ ও তাহমীদ (সুবহানাল্লাহি ওয়া বিহামদিহি)',
    titleEn: '100 Times SubhanAllahi wa Bihamdihi',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliterationBn: 'সুবহা-নাল্লা-হি ওয়া বিহামদিহী।',
    translationBn: 'আমি আল্লাহর সপ্রশংস পবিত্রতা ঘোষণা করছি।',
    virtueAndBenefitBn: 'যে ব্যক্তি দিনে ১০০ বার এই তাসবিহ পড়বে তার সকল গোনাহ মাফ করে দেওয়া হবে, যদিও তা সমুদ্রের ফেনার সমতুল্য হয়। এবং কিয়ামতের দিন তার চেয়ে উত্তম আমল কেউ নিয়ে আসতে পারবে না। (সহীহ বুখারী: ৬৪০৫, মুসলিম: ২৬৯১)',
    referenceBn: 'সহীহ বুখারী ৬৪০৫, সহীহ মুসলিম ২৬৯১',
    targetCount: 100,
    countDisplayBn: 'সকালে ১০০ বার',
    timeSlotSuggestion: {
      startTime: '07:00',
      endTime: '08:30',
      routineNameBn: 'সকালের তাসবিহ ও জিকির'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/55.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/055.mp3',
    pdfPageNumber: 78,
    category: 'morning_evening'
  },

  // ================= 2. ঘুমানো ও ঘুম থেকে জাগরণের দোয়া =================
  {
    id: 'hm-06',
    chapterNumber: 28,
    chapterTitleBn: 'ঘুমানোর সময় ও বিছানায় যাওয়ার দোয়া',
    chapterTitleAr: 'أذكار النوم',
    titleBn: 'ঘুমানোর পূর্বের মাসনূন দোয়া (আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহ্ইয়া)',
    titleEn: 'Supplication Before Sleeping',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliterationBn: 'বিসমিকাল্লা-হুম্মা আমূতু ওয়া আহ্ইয়া।',
    translationBn: 'হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করি (ঘুমাই) এবং জীবিত হই (জাগ্রত হই)।',
    virtueAndBenefitBn: 'ঘুমানোর আগে ডান কাতে শুয়ে এই দোয়া পাঠ করা নববী সুন্নাত। (সহীহ বুখারী: ৬৩২৪)',
    referenceBn: 'সহীহ বুখারী ৬৩২৪, মুসলিম ২৭১১',
    targetCount: 1,
    countDisplayBn: 'ঘুমানোর আগে ১ বার',
    timeSlotSuggestion: {
      startTime: '22:00',
      endTime: '23:30',
      routineNameBn: 'রাতের প্রশান্তি ও ঘুমানোর সুন্নাত'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/67.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/067.mp3',
    pdfPageNumber: 90,
    category: 'sleep_wake'
  },
  {
    id: 'hm-07',
    chapterNumber: 1,
    chapterTitleBn: 'ঘুম থেকে জাগ্রত হওয়ার দোয়া',
    chapterTitleAr: 'أذكار الاستيقاظ من النوم',
    titleBn: 'ঘুম থেকে জাগ্রত হওয়ার শুকরিয়া দোয়া',
    titleEn: 'Supplication Upon Waking Up',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliterationBn: 'আলহামদু লিল্লা-হিল্লাযী আহ্ইয়া-না বা‘দা মা আমা-তানা ওয়া ইলাইহিন নুশূর।',
    translationBn: 'সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে মৃত্যু (নিদ্রা) দেওয়ার পর পুনরায় জীবন দান করলেন। আর তাঁরই কাছে সকলের পুনরুত্থান।',
    virtueAndBenefitBn: 'ঘুম থেকে উঠেই আল্লাহর শোকর আদায় করার মাধ্যমে দিনে বরকত ও তাওফীক নেমে আসে। (সহীহ বুখারী: ৬৩১২)',
    referenceBn: 'সহীহ বুখারী ৬৩১২, মুসলিম ২৭১১',
    targetCount: 1,
    countDisplayBn: 'ঘুম ভাঙার সাথে সাথে ১ বার',
    timeSlotSuggestion: {
      startTime: '04:30',
      endTime: '05:30',
      routineNameBn: 'সুবহে সাদিক ও ফজর জাগরণ'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/32.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/032.mp3',
    pdfPageNumber: 15,
    category: 'sleep_wake'
  },
  {
    id: 'hm-08',
    chapterNumber: 28,
    chapterTitleBn: 'ঘুমানোর সময় ও বিছানায় যাওয়ার দোয়া',
    chapterTitleAr: 'أذكار النوم',
    titleBn: 'সূরা আল-মুলক তিলাওয়াত (কবরের আজাব থেকে মুক্তি)',
    titleEn: 'Surah Al-Mulk (Protection from Punishment of the Grave)',
    arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliterationBn: 'তাবা-রাকাল্লাযী বিইয়াদিহিল মুলকু ওয়া হুওয়া ‘আলা কুল্লি শাইয়িন ক্বাদীর।',
    translationBn: 'কল্যাণময় তিনি, যাঁর হাতে সর্বময় কর্তৃত্ব এবং তিনি সবকিছুর ওপর সর্বশক্তিমান।',
    virtueAndBenefitBn: 'কুরআনে ৩০ আয়াতের একটি সূরা রয়েছে যা পাঠকারীর জন্য ক্ষমা না হওয়া পর্যন্ত সুপারিশ করতেই থাকবে। আর তা হলো সূরা মুলক। (আবু দাউদ: ১৪০০, তিরমিযী: ২৮৯১)',
    referenceBn: 'সুনান আবু দাউদ ১৪০০, তিরমিযী ২৮৯১ (হাসান)',
    targetCount: 1,
    countDisplayBn: 'প্রতি রাতে ১ বার',
    timeSlotSuggestion: {
      startTime: '21:30',
      endTime: '23:00',
      routineNameBn: 'রাতের সূরা মুলক তিলাওয়াত'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/67.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/067.mp3',
    videoId: '9o25C8FzH2o',
    pdfPageNumber: 94,
    category: 'sleep_wake'
  },

  // ================= 3. অযু, আজান ও সালাতের দোয়া =================
  {
    id: 'hm-09',
    chapterNumber: 6,
    chapterTitleBn: 'অযু সমাপ্তির দোয়া',
    chapterTitleAr: 'الذكر بعد الفراغ من الوضوء',
    titleBn: 'অযু শেষে জান্নাতের আটটি দরজা উন্মুক্ত হওয়ার দোয়া',
    titleEn: 'Dua After Completing Ablution (Opening 8 Gates of Jannah)',
    arabicText: 'أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliterationBn: 'আশহাদু আল লা ইলা-হা ইল্লাল্লা-হু ওয়াহ্দাহূ লা শারীকা লাহূ, ওয়া আশহাদু আন্না মুহাম্মাদান ‘আব্দুহূ ওয়া রাসূলুহ্। আল্লাহুম্মাজ‘আলনী মিনাত তাউয়্যা-বীনা ওয়াজ‘আলনী মিনাল মুতাত্বহহিরীন।',
    translationBn: 'আমি সাক্ষ্য দিচ্ছি যে, এক আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই, তাঁর কোনো অংশীদার নেই। আমি আরও সাক্ষ্য দিচ্ছি যে, মুহাম্মদ (সা.) তাঁর বান্দা ও রাসূল। হে আল্লাহ! আপনি আমাকে তওবাকারীদের অন্তর্ভুক্ত করুন এবং পবিত্রতা অর্জনকারীদের অন্তর্ভুক্ত করুন।',
    virtueAndBenefitBn: 'যে ব্যক্তি সুন্দরভাবে অযু করে এই দোয়া পাঠ করবে, তার জন্য জান্নাতের আটটি দরজাই খুলে দেওয়া হবে; সে যে দরজা দিয়ে ইচ্ছা প্রবেশ করতে পারবে। (সহীহ মুসলিম: ২৩৪, তিরমিযী: ৫৫)',
    referenceBn: 'সহীহ মুসলিম ২৩৪, তিরমিযী ৫৫',
    targetCount: 1,
    countDisplayBn: 'প্রতি অযুর পর ১ বার',
    timeSlotSuggestion: {
      startTime: '12:30',
      endTime: '13:30',
      routineNameBn: 'জোহর পূর্ব সালাত ও অযু'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/62.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/062.mp3',
    pdfPageNumber: 22,
    category: 'prayer_wudu'
  },
  {
    id: 'hm-10',
    chapterNumber: 26,
    chapterTitleBn: 'সালাত শেষে মাসনূন জিকির',
    chapterTitleAr: 'الذكر بعد الصلاة',
    titleBn: 'সালাত সমাপ্তির পর ৩৩ বার সুবহানাল্লাহ, আলহামদুলিল্লাহ, আল্লাহু আকবার',
    titleEn: 'Dhikr After Fardh Prayer (33 SubhanAllah, Alhamdulillah, Allahu Akbar)',
    arabicText: 'سُبْحَانَ اللَّهِ (٣٣) ، وَالْحَمْدُ لِلَّهِ (٣٣) ، وَاللَّهُ أَكْبَرُ (٣٣) ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (١)',
    transliterationBn: 'সুবহা-নাল্লা-হ (৩৩ বার), আলহামদু লিল্লা-হ (৩৩ বার), আল্লা-হু আকবার (৩৩ বার)। লা ইলা-হা ইল্লাল্লা-হু ওয়াহ্দাহূ লা শারীকা লাহূ, লাহুল মুলকু ওয়া লাহুল হামদু, ওয়া হুওয়া ‘আলা কুল্লি শাইয়িন ক্বাদীর (১ বার)।',
    translationBn: 'আল্লাহ পবিত্র (৩৩ বার), সমস্ত প্রশংসা আল্লাহর (৩৩ বার), আল্লাহ সর্বশ্রেষ্ঠ (৩৩ বার)। এক আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই, তাঁর কোনো শরীক নেই, রাজত্ব একমাত্র তাঁরই, সমস্ত প্রশংসা তাঁরই, আর তিনি সবকিছুর ওপর সর্বশক্তিমান (১ বার)।',
    virtueAndBenefitBn: 'ফরজ নামাজের পর যে ব্যক্তি এভাবে ১০০ পূর্ণ করবে, তার সমস্ত গোনাহ ক্ষমা করে দেওয়া হবে, যদিও তা সাগরের ফেনার মতো অসংখ্য হয়। (সহীহ মুসলিম: ৫৯৭)',
    referenceBn: 'সহীহ মুসলিম ৫৯৭; হিসনুল মুসলিম অধ্যায় ২৬',
    targetCount: 100,
    countDisplayBn: 'প্রতি ফরজ নামাজের পর ১০০ বার',
    timeSlotSuggestion: {
      startTime: '13:15',
      endTime: '14:00',
      routineNameBn: 'সালাত উত্তর মাসনূন তাসবিহ'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/49.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/049.mp3',
    pdfPageNumber: 66,
    category: 'prayer_wudu'
  },

  // ================= 4. বিপদ-আপদ, ঋণমুক্তি ও দুশ্চিন্তা নিরাময় =================
  {
    id: 'hm-11',
    chapterNumber: 34,
    chapterTitleBn: 'বিপদ ও চরম উদ্বেগের সময় পড়ার দোয়া',
    chapterTitleAr: 'دعاء الكرب',
    titleBn: 'দোয়ায়ে ইউনুস (বিপদ ও সংকট মুক্তির শ্রেষ্ঠ দোয়া)',
    titleEn: 'Dua of Prophet Yunus (For Any Hardship & Distress)',
    arabicText: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    transliterationBn: 'লা ইলা-হা ইল্লা আনতা সুবহা-নাকা ইন্নী কুনতু মিনায যোয়া-লিমীন।',
    translationBn: 'আপনি ছাড়া কোনো সত্য উপাস্য নেই; আপনি পবিত্র-মহান! নিশ্চয়ই আমি জালিমদের (অপরাধীদের) অন্তর্ভুক্ত হয়ে গেছি।',
    virtueAndBenefitBn: 'মাছের পেটে থাকাকালে ইউনুস (আ.) এই দোয়া করেছিলেন। যেকোনো মুসলিম ব্যক্তি কোনো বিপদ ও সঙ্কটে এই দোয়া পাঠ করলে আল্লাহ তাআলা অবশ্যই তার দোয়া কবুল করেন। (তিরমিযী: ৩৫০৫)',
    referenceBn: 'সূরা আল-আম্বিয়া: ৮৭; সুনান তিরমিযী ৩৫০৫ (সহীহ)',
    targetCount: 3,
    countDisplayBn: 'বিপদের সময় বারবার',
    timeSlotSuggestion: {
      startTime: '09:00',
      endTime: '10:30',
      routineNameBn: 'সকালের বরকত ও দোয়া'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/21.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/021.mp3',
    videoId: 'qL6oU4iB54I',
    pdfPageNumber: 121,
    category: 'hardship_relief'
  },
  {
    id: 'hm-12',
    chapterNumber: 38,
    chapterTitleBn: 'ঋণ পরিশোধ ও জীবিকার সংকট মুক্তির দোয়া',
    chapterTitleAr: 'دعاء قضاء الدين',
    titleBn: 'পাহাড় সমান ঋণ মুক্তির নববী দোয়া',
    titleEn: 'Dua for Relief from Crushing Debt & Provision',
    arabicText: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliterationBn: 'আল্লাহুম্মাকফিনী বিহালা-লিকা ‘আন হারা-মিকা, ওয়া আগনিনী বিফাদ্বলিকা ‘আম্মান সিওয়া-ক।',
    translationBn: 'হে আল্লাহ! আমাকে আপনার হালাল রিজিকের মাধ্যমে হারাম থেকে রক্ষা করুন এবং আপনার বিশেষ অনুগ্রহের দ্বারা আপনি ছাড়া অন্য সকলের মুখাপেক্ষীহীন বানিয়ে দিন।',
    virtueAndBenefitBn: 'হযরত আলী (রা.) বলেন: তোমার ওপর যদি ‘সীর’ পর্বত পরিমাণ ঋণও থাকে, আল্লাহ তাআলা তা পরিশোধের ব্যবস্থা করে দেবেন। (সুনান তিরমিযী: ৩৫৬৩)',
    referenceBn: 'সুনান তিরমিযী ৩৫৬৩ (হাসান সহীহ)',
    targetCount: 3,
    countDisplayBn: 'প্রতিদিন সকাল ও সন্ধ্যায় ৩ বার',
    timeSlotSuggestion: {
      startTime: '10:30',
      endTime: '12:00',
      routineNameBn: 'রিজিক ও বরকত রেডিও শিডিউল'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/36.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/036.mp3',
    pdfPageNumber: 133,
    category: 'hardship_relief'
  },
  {
    id: 'hm-13',
    chapterNumber: 34,
    chapterTitleBn: 'চিন্তা ও বিষণ্ণতা দূরীকরণের দোয়া',
    chapterTitleAr: 'دعاء الهم والحزن',
    titleBn: 'দুশ্চিন্তা, অক্ষমতা ও ভীরুতা থেকে মুক্তির দোয়া',
    titleEn: 'Dua Against Worry, Grief, Inability and Cowardice',
    arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliterationBn: 'আল্লাহুম্মা ইন্নী আ‘ঊযু বিকা মিনাল হামমি ওয়াল হাযানি, ওয়াল ‘আজযি ওয়াল কাসালি, ওয়াল বুখলি ওয়াল জুবনি, ওয়া দ্বালা‘ইদ দাইনি ওয়া গালাবাতির রিজা-ল।',
    translationBn: 'হে আল্লাহ! আমি আপনার আশ্রয় নিচ্ছি দুশ্চিন্তা ও মনোকষ্ট থেকে, অক্ষমতা ও অলসতা থেকে, কৃপণতা ও ভীরুতা থেকে এবং ঋণের বোঝা ও মানুষের অত্যাচার-আধিপত্য থেকে।',
    virtueAndBenefitBn: 'রাসূলুল্লাহ (সা.) এই দোয়াটি সর্বাধিক পড়তেন, এটি জীবনের যাবতীয় মানসিক ভার ও সামাজিক চাপ লাঘব করে। (সহীহ বুখারী: ২৮৯৩)',
    referenceBn: 'সহীহ বুখারী ২৮৯৩; হিসনুল মুসলিম অধ্যায় ৩৪',
    targetCount: 1,
    countDisplayBn: 'সকাল ও সন্ধ্যায় ১ বার',
    timeSlotSuggestion: {
      startTime: '16:00',
      endTime: '17:00',
      routineNameBn: 'আসর পরবর্তী প্রশান্তি'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/18.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/018.mp3',
    pdfPageNumber: 120,
    category: 'hardship_relief'
  },

  // ================= 5. খাবার, ঘর ও পারিবারিক দোয়া =================
  {
    id: 'hm-14',
    chapterNumber: 11,
    chapterTitleBn: 'ঘরে প্রবেশ ও বের হওয়ার দোয়া',
    chapterTitleAr: 'الذكر عند الدخول والخروج من المنزل',
    titleBn: 'ঘর থেকে বের হওয়ার সময় তাওয়াক্কুলের দোয়া',
    titleEn: 'Dua When Leaving the House (Tawakkul on Allah)',
    arabicText: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
    transliterationBn: 'বিসমিল্লা-হি তাওয়াক্কালতু ‘আলাল্লা-হি, ওয়ালা হাওলা ওয়ালা ক্বুউওয়াতা ইল্লা বিল্লা-হ।',
    translationBn: 'আল্লাহর নামে (বের হচ্ছি), আল্লাহর ওপরই ভরসা করলাম। আল্লাহর সাহায্য ছাড়া গুনাহ থেকে বাঁচার কোনো উপায় নেই এবং নেক কাজ করার কোনো শক্তি নেই।',
    virtueAndBenefitBn: 'ঘর থেকে বের হয়ে যে ব্যক্তি এটি পড়বে, তাকে বলা হয়: তোমাকে হেদায়েত করা হয়েছে, তোমার প্রয়োজন মেটানো হয়েছে এবং তোমাকে রক্ষা করা হয়েছে। আর শয়তান তার থেকে দূরে সরে যায়। (আবু দাউদ: ৫০৯৫, তিরমিযী: ৩৪২৬)',
    referenceBn: 'সুনান আবু দাউদ ৫০৯৫, তিরমিযী ৩৪২৬',
    targetCount: 1,
    countDisplayBn: 'ঘর থেকে বের হওয়ার সময় ১ বার',
    timeSlotSuggestion: {
      startTime: '08:30',
      endTime: '09:30',
      routineNameBn: 'কর্মক্ষেত্রে যাত্রার সুন্নাত'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
    pdfPageNumber: 30,
    category: 'family_daily'
  },
  {
    id: 'hm-15',
    chapterNumber: 71,
    chapterTitleBn: 'খাবার গ্রহণের সময় দোয়া',
    chapterTitleAr: 'الذكر عند الطعام',
    titleBn: 'খাবার শুরু করার সুন্নাত দোয়া',
    titleEn: 'Dua Before Eating & Meals',
    arabicText: 'بِسْمِ اللَّهِ (فَإِنْ نَسِيَ: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ)',
    transliterationBn: 'বিসমিল্লা-হ। (ভুলে গেলে: বিসমিল্লা-হি ফী আওয়ালিহী ওয়া আ-খিরিহী)।',
    translationBn: 'আল্লাহর নামে শুরু করছি। (প্রথমে ভুলে গেলে: আল্লাহর নামে এর শুরু ও শেষে বরকত চাই)।',
    virtueAndBenefitBn: 'বিসমিল্লাহ বলে ডান হাতে খেলে খাবারে শয়তান অংশ নিতে পারে না এবং আল্লাহ খাবারে বরকত দান করেন। (সহীহ বুখারী: ৫৩৭৬, মুসলিম: ২০১৭)',
    referenceBn: 'সহীহ বুখারী ৫৩৭৬, মুসলিম ২০১৭',
    targetCount: 1,
    countDisplayBn: 'প্রতি খাবারের শুরুতে',
    timeSlotSuggestion: {
      startTime: '13:30',
      endTime: '14:30',
      routineNameBn: 'মধ্যাহ্নভোজ ও পারিবারিক আমল'
    },
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/49.mp3',
    backupAudioUrl: 'https://server8.mp3quran.net/afs/049.mp3',
    pdfPageNumber: 172,
    category: 'family_daily'
  }
];

// PDF Book and Reader Metadata for Hisnul Muslim
export const HISNUL_MUSLIM_BOOK_INFO = {
  bookTitleBn: 'হিসনুল মুসলিম (মুসলিম দুর্গ)',
  bookTitleAr: 'حصن المسلم من أذكار الكتاب والسنة',
  authorBn: 'শায়খ সাঈদ ইবন আলী ইবন ওয়াহফ আল-ক্বাহত্বানী (রহ.)',
  translatorBn: 'ড. মুহাম্মদ মনজুরে ইলাহী ও আলেম পরিষদ',
  publicationBn: 'মাকতাবাতুল ইরশাদ / ইসলামিক ফাউন্ডেশন অনুমোদিত বিশুদ্ধ সংস্করণ',
  totalChapters: 132,
  totalDuas: 267,
  descriptionBn: 'পবিত্র কুরআন ও সহীহ হাদিস থেকে সংকলিত নিত্যদিনের দো‘আ ও জিকিরের বিশ্ববিখ্যাত নির্ভরযোগ্য ইসলামিক গ্রন্থ। এতে রয়েছে প্রাত্যহিক জীবনের সকল মোড় ও পরিস্থিতির জন্য সুন্নাহ ভিত্তিক মাসনূন আমল।',
  pdfOnlineUrl: 'https://archive.org/download/hisnul-muslim-bangla-pdf/Hisnul_Muslim_Bangla.pdf',
  pdfDriveAlternative: 'https://ia801309.us.archive.org/24/items/HisnulMuslimBangla/Hisnul%20Muslim%20Bangla.pdf',
  chaptersSummary: [
    { num: 1, title: 'ঘুম থেকে জাগ্রত হওয়ার দোয়া', count: 4, page: 15 },
    { num: 2, title: 'পোশাক পরিধানের দোয়া', count: 2, page: 19 },
    { num: 5, title: 'টয়লেটে প্রবেশ ও বের হওয়ার দোয়া', count: 2, page: 21 },
    { num: 6, title: 'অযু পূর্ব ও পরবর্তী দোয়া', count: 3, page: 22 },
    { num: 10, title: 'মসজিদে গমন, প্রবেশ ও বের হওয়ার দোয়া', count: 3, page: 26 },
    { num: 13, title: 'আজানের দোয়া ও উত্তর দেওয়ার নিয়ম', count: 5, page: 31 },
    { num: 14, title: 'সালাতের তাকবীরে তাহরীমার পর সানা', count: 6, page: 34 },
    { num: 15, title: 'রুকূ ও রুকূ থেকে ওঠার দোয়া', count: 5, page: 44 },
    { num: 18, title: 'সিজদার দোয়া ও সিজদায়ে তিলাওয়াত', count: 7, page: 47 },
    { num: 21, title: 'তাশাহহুদ ও দরূদ শরীফ পাঠ', count: 4, page: 54 },
    { num: 26, title: 'সালাত সমাপ্তির পর মাসনূন জিকির', count: 8, page: 66 },
    { num: 27, title: 'সকাল ও সন্ধ্যার মাসনূন জিকির', count: 24, page: 71 },
    { num: 28, title: 'ঘুমানোর সময় ও বিছানায় যাওয়ার দোয়া', count: 18, page: 90 },
    { num: 34, title: 'বিপদ, অস্থিরতা ও দুশ্চিন্তার দোয়া', count: 6, page: 120 },
    { num: 38, title: 'ঋণ পরিশোধ ও জীবিকার দোয়া', count: 2, page: 133 },
    { num: 71, title: 'খাবার পূর্ববর্তী ও খাবার সমাপ্তির দোয়া', count: 4, page: 172 },
    { num: 82, title: 'রোগী দেখতে যাওয়ার দোয়া ও শিফা', count: 4, page: 185 },
    { num: 129, title: 'সাইয়্যিদুল ইস্তিগফার ও তওবা', count: 6, page: 240 }
  ]
};
