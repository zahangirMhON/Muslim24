export interface QuickDuaItem {
  id: string;
  contextCategory: 
    | 'waking_morning' 
    | 'sleep_night' 
    | 'food_drink' 
    | 'home_exit' 
    | 'vehicle_travel' 
    | 'restroom_wudu' 
    | 'masjid_prayer' 
    | 'dress_appearance' 
    | 'study_knowledge' 
    | 'work_wealth' 
    | 'distress_healing' 
    | 'anger_manners' 
    | 'nature_weather' 
    | 'family_social';
  contextCategoryBn: string;
  contextCategoryIcon: string;
  titleBn: string;
  titleEn: string;
  contextOccasionBn: string; // কোন পরিস্থিতিতে পড়বেন
  arabicText: string;
  pronunciationBn: string;
  translationBn: string;
  sahihReferenceBn: string;
  virtueShortBn: string; // সংক্ষিপ্ত ফজিলত
  recommendedCount: number; // যেমন ১ বার, ৩ বার, ৭ বার, ৩৩ বার
  searchTags: string[]; // Search keywords in BN & EN
  audioQuery?: string;
}

export interface QuickDuaCategoryMeta {
  id: QuickDuaItem['contextCategory'] | 'all';
  labelBn: string;
  labelEn: string;
  icon: string;
  badgeCount?: number;
  descriptionBn: string;
}

export const QUICK_DUA_CATEGORIES: QuickDuaCategoryMeta[] = [
  {
    id: 'all',
    labelBn: 'সকল দোয়া',
    labelEn: 'All Duas',
    icon: '✨',
    descriptionBn: 'দৈনন্দিন জীবনের সকল সুন্নতি ও জরুরি দোয়া'
  },
  {
    id: 'waking_morning',
    labelBn: 'জাগরণ ও সকাল',
    labelEn: 'Waking & Morning',
    icon: '🌅',
    descriptionBn: 'ঘুম ভাঙলে ও সকালের প্রয়োজনীয় দোয়া'
  },
  {
    id: 'sleep_night',
    labelBn: 'ঘুমানো ও রাত',
    labelEn: 'Sleep & Night',
    icon: '🌙',
    descriptionBn: 'শোয়ার পূর্বে, দুঃস্বপ্ন দেখলে ও রাতের আমল'
  },
  {
    id: 'food_drink',
    labelBn: 'খাবার ও পানীয়',
    labelEn: 'Food & Drink',
    icon: '🍽️',
    descriptionBn: 'খাবার শুরু, শেষ, দুধ পান ও মেহমানের দোয়া'
  },
  {
    id: 'home_exit',
    labelBn: 'ঘর ও বাহির',
    labelEn: 'Home & Exit',
    icon: '🚪',
    descriptionBn: 'ঘরে প্রবেশ, ঘর থেকে বের হওয়া ও নিরাপত্তা'
  },
  {
    id: 'vehicle_travel',
    labelBn: 'যানবাহন ও সফর',
    labelEn: 'Travel & Vehicle',
    icon: '🚗',
    descriptionBn: 'গাড়ি/যানবাহনে চড়া, নৌ-বিমানে ওঠা ও সফরের দোয়া'
  },
  {
    id: 'restroom_wudu',
    labelBn: 'টয়লেট ও ওজু',
    labelEn: 'Restroom & Wudu',
    icon: '💧',
    descriptionBn: 'টয়লেটে প্রবেশ/বের হওয়া, ওজুর শুরু ও সমাপ্তির দোয়া'
  },
  {
    id: 'masjid_prayer',
    labelBn: 'মসজিদ ও নামাজ',
    labelEn: 'Masjid & Prayer',
    icon: '🕌',
    descriptionBn: 'মসজিদে প্রবেশ, বের হওয়া ও নামাজের পরের দোআ'
  },
  {
    id: 'dress_appearance',
    labelBn: 'পোশাক ও রূপচর্চা',
    labelEn: 'Dress & Mirror',
    icon: '👕',
    descriptionBn: 'নতুন পোশাক পরিধান, কাপড় খোলা ও আয়না দেখা'
  },
  {
    id: 'study_knowledge',
    labelBn: 'পড়াশোনা ও জ্ঞান',
    labelEn: 'Study & Exam',
    icon: '📚',
    descriptionBn: 'পড়ালেখা, মেধা ও স্মরণশক্তি বৃদ্ধির দোয়া'
  },
  {
    id: 'work_wealth',
    labelBn: 'কাজ, রিযিক ও ঋণ',
    labelEn: 'Work & Wealth',
    icon: '💼',
    descriptionBn: 'হালাল জীবিকা, ঋণমুক্তি ও বাজারে প্রবেশের দোয়া'
  },
  {
    id: 'distress_healing',
    labelBn: 'রোগ ও শেফা',
    labelEn: 'Health & Cure',
    icon: '🛡️',
    descriptionBn: 'অসুস্থতা, ব্যথা-বেদনা, মানসিক কষ্ট ও বিপদমুক্তি'
  },
  {
    id: 'anger_manners',
    labelBn: 'রাগ, ক্ষমা ও আচরণ',
    labelEn: 'Anger & Manners',
    icon: '🤝',
    descriptionBn: 'রাগ নিয়ন্ত্রণ, সালাম, হাঁচি ও ধন্যবাদ জ্ঞাপন'
  },
  {
    id: 'nature_weather',
    labelBn: 'বৃষ্টি ও আবহাওয়া',
    labelEn: 'Nature & Weather',
    icon: '⛈️',
    descriptionBn: 'বৃষ্টি বর্ষণ, মেঘের গর্জন, ঝড়-তুফান ও নতুন চাঁদ'
  },
  {
    id: 'family_social',
    labelBn: 'পিতামাতা ও পরিবার',
    labelEn: 'Family & Social',
    icon: '👨‍👩‍👧',
    descriptionBn: 'পিতামাতার মাগফিরাত, সন্তান ও দাম্পত্য সুখের দোয়া'
  }
];

export const QUICK_DUAS_DATA: QuickDuaItem[] = [
  // ================= 1. WAKING & MORNING =================
  {
    id: 'qd-wake-1',
    contextCategory: 'waking_morning',
    contextCategoryBn: 'জাগরণ ও সকাল',
    contextCategoryIcon: '🌅',
    titleBn: 'ঘুম থেকে জাগ্রত হওয়ার দোয়া',
    titleEn: 'Upon Waking Up',
    contextOccasionBn: 'ঘুম ভাঙার সাথে সাথে বিছানায় বসে পাঠ করবেন',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    pronunciationBn: 'আলহামদু লিল্লাহিল্লাজি আহ্ইয়ানা বা’দা মা আমাতানা ওয়া ইলাইহিন নুশূর।',
    translationBn: 'যাবতীয় প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত্যুর (নিদ্রার) পর পুনরায় জীবিত করলেন এবং তাঁরই নিকট সবার পুনরুত্থান।',
    sahihReferenceBn: 'সহীহ বুখারী: ৬৩১২, সহীহ মুসলিম: ২৭১১',
    virtueShortBn: 'নতুন দিনের জন্য শুকরিয়া আদায় হয় এবং শয়তানের প্রথম গিঁট খুলে যায়।',
    recommendedCount: 1,
    searchTags: ['ঘুম', 'জাগরণ', 'সকাল', 'wake', 'waking', 'morning', 'sleep', 'uthano']
  },
  {
    id: 'qd-wake-2',
    contextCategory: 'waking_morning',
    contextCategoryBn: 'জাগরণ ও সকাল',
    contextCategoryIcon: '🌅',
    titleBn: 'সুস্থ শরীরে জেগে ওঠার কৃতজ্ঞতা',
    titleEn: 'Gratitude for Healthy Awakening',
    contextOccasionBn: 'সকালে বিছানা ছেড়ে ওঠার মুহূর্তে',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ',
    pronunciationBn: 'আলহামদু লিল্লাহিল্লাজি আফানী ফী জাসাদী, ওয়া রাদ্দা আলাইয়্যা রূহী, ওয়া আযিনা লী বিযিকরিহী।',
    translationBn: 'সকল প্রশংসা আল্লাহর জন্য, যিনি আমার শরীরে সুস্থতা দিয়েছেন, আমার রূহ ফিরিয়ে দিয়েছেন এবং আমাকে তাঁর স্মরণের অনুমতি দিয়েছেন।',
    sahihReferenceBn: 'জামে তিরমিযী: ৩৪০১ (হাসান)',
    virtueShortBn: 'দেহের প্রতিটি অঙ্গের সুস্থতার কৃতজ্ঞতা প্রকাশ ও দিনের শুরুতে যিকিরের তাওফিক।',
    recommendedCount: 1,
    searchTags: ['সুস্থ', 'শরীর', 'সকাল', 'স্বাস্থ্য', 'health', 'body', 'gratitude']
  },
  {
    id: 'qd-wake-3',
    contextCategory: 'waking_morning',
    contextCategoryBn: 'জাগরণ ও সকাল',
    contextCategoryIcon: '🌅',
    titleBn: 'সকালের সাইয়্যিদুল ইস্তিগফার (জান্নাত লাভের শ্রেষ্ঠ দোয়া)',
    titleEn: 'Sayyidul Istighfar in Morning',
    contextOccasionBn: 'সকালে ফজরের পর অন্তত ১ বার দৃঢ় বিশ্বাসের সাথে',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    pronunciationBn: 'আল্লাহুম্মা আনতা রব্বী লা ইলাহা ইল্লা আনতা, খালাক্বতানী ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া’দিকা মাসতাত্বা’তু, আউজু বিকা মিন শাররি মা সানা’তু, আবূউ লাকা বিনি’মাতিকা আলাইয়্যা, ওয়া আবূউ লাকা বিজাম্বী ফাগফির লী, ফাইন্নাহু লা ইয়াগফিরুজ জুনূবা ইল্লা আনতা।',
    translationBn: 'হে আল্লাহ! আপনি আমার প্রতিপালক, আপনি ছাড়া সত্য কোনো উপাস্য নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার বান্দা...',
    sahihReferenceBn: 'সহীহ বুখারী: ৬৩০৬',
    virtueShortBn: 'সকালে পড়ে ওই দিন মারা গেলে নিশ্চিত জান্নাতী।',
    recommendedCount: 1,
    searchTags: ['ইস্তিগফার', 'ক্ষমা', 'সকাল', 'sayyidul', 'istighfar', 'forgiveness', 'jannat']
  },

  // ================= 2. SLEEP & NIGHT =================
  {
    id: 'qd-sleep-1',
    contextCategory: 'sleep_night',
    contextCategoryBn: 'ঘুমানো ও রাত',
    contextCategoryIcon: '🌙',
    titleBn: 'ঘুমানোর সময় পড়ার দোয়া',
    titleEn: 'Dua Before Sleeping',
    contextOccasionBn: 'রাতে বিছানায় শুয়ে ডান কাতে পাঠ করবেন',
    arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    pronunciationBn: 'বিসমিকাল্লাহুম্মা আমূতু ওয়া আহ্ইয়া।',
    translationBn: 'হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ (নিদ্রা গ্রহণ) করছি এবং জীবিত (জাগ্রত) হব।',
    sahihReferenceBn: 'সহীহ বুখারী: ৬৩২৪, সহীহ মুসলিম: ২৭১১',
    virtueShortBn: 'আল্লাহর হেফাজতে নিদ্রা ও সুন্নাত পালন।',
    recommendedCount: 1,
    searchTags: ['ঘুম', 'রাত', 'শোয়ার', 'ঘুমানো', 'sleep', 'night', 'bed', 'soya']
  },
  {
    id: 'qd-sleep-2',
    contextCategory: 'sleep_night',
    contextCategoryBn: 'ঘুমানো ও রাত',
    contextCategoryIcon: '🌙',
    titleBn: 'ঘুমের ঘোরে ভয় বা দুঃস্বপ্ন দেখলে',
    titleEn: 'Upon Bad Dream or Fear in Sleep',
    contextOccasionBn: 'খারাপ স্বপ্ন দেখে ঘুম ভাঙলে বাম দিকে ৩ বার থুতু ফেলে পাঠ করবেন',
    arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ',
    pronunciationBn: 'আউজু বিকালিমা-তিল্লাহিত তা-ম্মা-তি মিন গদ্বাবিহী ওয়া ইক্বাবিহী ওয়া শাররি ইবাদিহী, ওয়া মিন হামাযাতিশ শায়াত্বীনি ওয়া আঁই ইয়াহ্দুরূন।',
    translationBn: 'আমি আল্লাহর পরিপূর্ণ বাণীসমূহের উসিলায় আশ্রয় চাই তাঁর ক্রোধ, শাস্তি, বান্দাদের অনিষ্ট এবং শয়তানের কুমন্ত্রণা ও উপস্থিতি থেকে।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৩৮৯৩, জামে তিরমিযী: ৩৫২৮ (হাসান)',
    virtueShortBn: 'দুঃস্বপ্ন ও ভীতির ক্ষতি থেকে ১০০% নিরাপত্তা।',
    recommendedCount: 1,
    searchTags: ['স্বপ্ন', 'দুঃস্বপ্ন', 'ভয়', 'খারাপ', 'dream', 'bad dream', 'fear', 'nightmare']
  },
  {
    id: 'qd-sleep-3',
    contextCategory: 'sleep_night',
    contextCategoryBn: 'ঘুমানো ও রাত',
    contextCategoryIcon: '🌙',
    titleBn: 'রাতে ঘুম না আসলে বা অস্থিরতায়',
    titleEn: 'Dua for Insomnia / Restlessness',
    contextOccasionBn: 'বিছানায় ছটফট করলে বা ঘুম না আসলে',
    arabicText: 'اللَّهُمَّ غَارَتِ النُّجُومُ وَهَدَأَتِ الْعُيُونُ وَأَنْتَ حَيٌّ قَيُّومٌ لَا تَأْخُذُكَ سِنَةٌ وَلَا نَوْمٌ، يَا حَيُّ يَا قَيُّومُ أَهْدِئْ لَيْلِي وَأَنِمْ عَيْنِي',
    pronunciationBn: 'আল্লাহুম্মা গ-রাতিন নুজূমু ওয়া হাদাআতিল উয়ূন, ওয়া আনতা হাইয়্যুন ক্বাইয়্যূম, লা তা’খুযুকা সিনাতুঁও ওয়ালা নাওম, ইয়া হাইয়্যু ইয়া ক্বাইয়্যূমু আহদি’ লাইলী ওয়া আনিম আইনী।',
    translationBn: 'হে আল্লাহ! তারকারাজি অস্তমিত হয়েছে এবং মানুষের চোখ শান্ত হয়েছে; আর আপনি চিরঞ্জীব ও চিরস্থায়ী, তন্দ্রা বা নিদ্রা আপনাকে স্পর্শ করে না। হে চিরঞ্জীব! আমার রাতকে শান্তিময় করুন এবং আমার চোখে ঘুম দিন।',
    sahihReferenceBn: 'ইবনে সুননী: ৭৪৯, তাবারানী (মুজামুল কাবীর)',
    virtueShortBn: 'মনের অস্থিরতা দূর হয়ে গভীর প্রশান্তির ঘুম আসে।',
    recommendedCount: 1,
    searchTags: ['ঘুম না আসলে', 'অনিদ্রা', 'অস্থিরতা', 'insomnia', 'restless', 'night sleep']
  },

  // ================= 3. FOOD & DRINK =================
  {
    id: 'qd-food-1',
    contextCategory: 'food_drink',
    contextCategoryBn: 'খাবার ও পানীয়',
    contextCategoryIcon: '🍽️',
    titleBn: 'খাবার শুরু করার দোয়া',
    titleEn: 'Before Eating Food',
    contextOccasionBn: 'ডান হাতে খাবার গ্রহণের শুরুতে',
    arabicText: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    pronunciationBn: 'বিসমিল্লাহি ওয়া আলা বারাকাতিল্লাহ।',
    translationBn: 'আল্লাহর নামে এবং আল্লাহর বরকতের ওপর শুরু করছি।',
    sahihReferenceBn: 'সহীহ বুখারী: ৫৩৭৬, মুসতাদরাকে হাকেম',
    virtueShortBn: 'খাবারে বরকত আসে এবং শয়তান খাবারে অংশ নিতে পারে না।',
    recommendedCount: 1,
    searchTags: ['খাবার', 'খাওয়া', 'শুরু', 'পানাহার', 'food', 'eating', 'bismillah', 'khabar']
  },
  {
    id: 'qd-food-2',
    contextCategory: 'food_drink',
    contextCategoryBn: 'খাবার ও পানীয়',
    contextCategoryIcon: '🍽️',
    titleBn: 'খাবারের শুরুতে বিসমিল্লাহ বলতে ভুলে গেলে',
    titleEn: 'If Forgot Bismillah at Start',
    contextOccasionBn: 'খাওয়ার মাঝখানে স্মরণ হওয়া মাত্রই পাঠ করবেন',
    arabicText: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
    pronunciationBn: 'বিসমিল্লাহি আওওয়ালাহু ওয়া আখিরাহু।',
    translationBn: 'আল্লাহর নামে এর শুরুতে এবং এর শেষে।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৩৭৬৭, জামে তিরমিযী: ১৮৫৮ (সহীহ)',
    virtueShortBn: 'শয়তান যেটুকু খেয়েছে তা বমি করে ফেলে দেয়।',
    recommendedCount: 1,
    searchTags: ['ভুলে গেলে', 'খাবার ভুল', 'forgot', 'food forgot', 'bismillah awwalahu']
  },
  {
    id: 'qd-food-3',
    contextCategory: 'food_drink',
    contextCategoryBn: 'খাবার ও পানীয়',
    contextCategoryIcon: '🍽️',
    titleBn: 'খাবার শেষ করার শোকরিয়া দোয়া',
    titleEn: 'After Finishing Meal',
    contextOccasionBn: 'খাবার শেষ করে হাত ধোয়ার পূর্বে',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    pronunciationBn: 'আলহামদু লিল্লাহিল্লাজি আত্আমানী হাযা ওয়া রাযাক্বানীহি মিন গাইরি হাওলিম মিন্নী ওয়ালা কুওয়াহ্।',
    translationBn: 'সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাকে এটি আহার করালেন এবং আমার কোনো সামর্থ্য ও শক্তি ছাড়াই রিযিক দান করলেন।',
    sahihReferenceBn: 'জামে তিরমিযী: ৩৪৫৮, সুনান আবু দাউদ: ৪০২৩ (হাসান)',
    virtueShortBn: 'পূর্বের সমস্ত সগীরা গুনাহ ক্ষমা করে দেওয়া হয়।',
    recommendedCount: 1,
    searchTags: ['খাবার শেষ', 'শোকরিয়া', 'ক্ষমা', 'after eating', 'meal finish', 'food gratitude']
  },
  {
    id: 'qd-food-4',
    contextCategory: 'food_drink',
    contextCategoryBn: 'খাবার ও পানীয়',
    contextCategoryIcon: '🍽️',
    titleBn: 'দুধ পান করার দোয়া',
    titleEn: 'Dua When Drinking Milk',
    contextOccasionBn: 'দুধ পান করার সময়',
    arabicText: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
    pronunciationBn: 'আল্লাহুম্মা বারিক লানা ফীহি ওয়া যিদনা মিনহু।',
    translationBn: 'হে আল্লাহ! এতে আমাদের বরকত দান করুন এবং তা আমাদের জন্য বাড়িয়ে দিন।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৩৭৩০, জামে তিরমিযী: ৩৪৫৫',
    virtueShortBn: 'দুধ খাদ্য ও পানীয় উভয়টির অভাব পূরণ করে।',
    recommendedCount: 1,
    searchTags: ['দুধ', 'পানীয়', 'milk', 'drink', 'beverage', 'dudh']
  },
  {
    id: 'qd-food-5',
    contextCategory: 'food_drink',
    contextCategoryBn: 'খাবার ও পানীয়',
    contextCategoryIcon: '🍽️',
    titleBn: 'মেহমান কর্তৃক মেজবানের জন্য দোয়া',
    titleEn: 'Guest Dua for the Host',
    contextOccasionBn: 'কারও বাড়িতে দাওয়াত খাওয়ার পর',
    arabicText: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',
    pronunciationBn: 'আল্লাহুম্মা বারিক লাহুম ফীমা রাযাক্বতাহুম, ওয়াগফির লাহুম ওয়ারহামহুম।',
    translationBn: 'হে আল্লাহ! আপনি তাদের যে রিযিক দিয়েছেন তাতে বরকত দিন, তাদের ক্ষমা করুন এবং তাদের ওপর দয়া করুন।',
    sahihReferenceBn: 'সহীহ মুসলিম: ২০৪২',
    virtueShortBn: 'মেজবানের রিযিকে বরকত নাজিল হয় এবং সন্তুষ্টি লাভ হয়।',
    recommendedCount: 1,
    searchTags: ['মেহমান', 'দাওয়াত', 'মেজবান', 'guest', 'host', 'dawat', 'invitation']
  },

  // ================= 4. HOME & EXIT =================
  {
    id: 'qd-home-1',
    contextCategory: 'home_exit',
    contextCategoryBn: 'ঘর ও বাহির',
    contextCategoryIcon: '🚪',
    titleBn: 'ঘর থেকে বের হওয়ার দোয়া (পূর্ণ নিরাপত্তা)',
    titleEn: 'When Leaving the House',
    contextOccasionBn: 'ঘর বা অফিস থেকে বের হয়ে কদম ফেলার মুহূর্তে',
    arabicText: 'بِسْمِ اللَّهِ ، تَوَكَّلْتُ عَلَى اللَّهِ ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    pronunciationBn: 'বিসমিল্লাহি তাওয়াক্কালতু আলাল্লাহ, লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ।',
    translationBn: 'আল্লাহর নামে (বের হচ্ছি), আল্লাহর ওপরই আমি ভরসা করলাম। আল্লাহর সাহায্য ছাড়া কোনো উপায় নেই এবং কোনো শক্তি নেই।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৫০৯৫, জামে তিরমিযী: ৩৪২৬ (সহীহ)',
    virtueShortBn: 'ফেরেশতারা ঘোষণা দেন: তুমি হেদায়েত পেয়েছ, সংরক্ষিত হয়েছ এবং শয়তান দূরে সরে যায়।',
    recommendedCount: 1,
    searchTags: ['ঘর থেকে বের', 'বাহির', 'বের হওয়া', 'leaving house', 'exit', 'protection', 'ghor']
  },
  {
    id: 'qd-home-2',
    contextCategory: 'home_exit',
    contextCategoryBn: 'ঘর ও বাহির',
    contextCategoryIcon: '🚪',
    titleBn: 'ঘরে প্রবেশের দোয়া ও সালাম',
    titleEn: 'When Entering the House',
    contextOccasionBn: 'বাইরে থেকে ঘরে ফিরে দরজায় প্রবেশের মুহূর্তে',
    arabicText: 'بِسْمِ اللَّهِ وَلَجْنَا ، وَبِسْمِ اللَّهِ خَرَجْنَا ، وَعَلَى رَبِّنَا تَوَكَّلْنَا (ثُمَّ يُسَلِّمُ)',
    pronunciationBn: 'বিসমিল্লাহি ওয়ালাজনা, ওয়া বিসমিল্লাহি খারাজনা, ওয়া আলা রব্বিনা তাওয়াক্কালনা। (অতঃপর ঘরের সবাইকে সালাম দিন: আসসালামু আলাইকুম)।',
    translationBn: 'আল্লাহর নামে আমরা প্রবেশ করলাম, আল্লাহর নামে আমরা বের হয়েছিলাম এবং আমাদের রবের ওপরই ভরসা করলাম।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৫০৯৬, সহীহ মুসলিম: ২০১৮',
    virtueShortBn: 'শয়তান ঘরে রাত্রিযাপন বা খাবার গ্রহণের সুযোগ পায় না; সংসারে শান্তি বজায় থাকে।',
    recommendedCount: 1,
    searchTags: ['ঘরে প্রবেশ', 'ঘর', 'সালাম', 'enter home', 'entering house', 'ghore probesh']
  },

  // ================= 5. VEHICLE & TRAVEL =================
  {
    id: 'qd-veh-1',
    contextCategory: 'vehicle_travel',
    contextCategoryBn: 'যানবাহন ও সফর',
    contextCategoryIcon: '🚗',
    titleBn: 'যানবাহনে চড়ার দোয়া (গাড়ি, বাস, ট্রেন, বাইক)',
    titleEn: 'Dua When Boarding a Vehicle',
    contextOccasionBn: 'গাড়ি, মোটরসাইকেল, বাস বা যেকোনো বাহনে আসন গ্রহণের পর',
    arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    pronunciationBn: 'সুবহানাল্লাজি সাখখারা লানা হাযা ওয়া মা কুন্না লাহূ মুক্বরিনীন, ওয়া ইন্না ইলা রব্বিনা লামুনক্বালিবূন।',
    translationBn: 'পবিত্র ও মহান সেই সত্তা যিনি এটিকে আমাদের বশীভূত করে দিয়েছেন, অথচ আমরা একে বশীভূত করতে সক্ষম ছিলাম না। এবং আমরা আমাদের রবের দিকেই প্রত্যাবর্তনকারী।',
    sahihReferenceBn: 'সূরা আয-যুখরুফ: ১৩-১৪, সহীহ মুসলিম: ১৩৪২',
    virtueShortBn: 'সড়ক দুর্ঘটনা ও পথিমধ্যে যাবতীয় বিপদ থেকে আল্লাহর কুদরতী সুরক্ষা।',
    recommendedCount: 1,
    searchTags: ['গাড়ি', 'যানবাহন', 'বাইক', 'বাস', 'vehicle', 'car', 'bike', 'bus', 'travel']
  },
  {
    id: 'qd-veh-2',
    contextCategory: 'vehicle_travel',
    contextCategoryBn: 'যানবাহন ও সফর',
    contextCategoryIcon: '🚗',
    titleBn: 'দূর সফরে বের হওয়ার পূর্ণ দোয়া',
    titleEn: 'Dua for Safe Journey / Travel',
    contextOccasionBn: 'দূরবর্তী ভ্রমণের উদ্দেশ্যে রওয়ানা দেওয়ার সময়',
    arabicText: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
    pronunciationBn: 'আল্লাহুম্মা ইন্না নাসআলুকা ফী সাফারিনা হাযাল বিররা ওয়াত তাক্বওয়া, ওয়া মিনাল আমালি মা তারদ্বা। আল্লাহুম্মা হাওউইন আলাইনা সাফারানা হাযা ওয়াত্বওই আন্না বু’দাহু।',
    translationBn: 'হে আল্লাহ! আমাদের এই সফরে আপনার নিকট নেক কাজ ও তাকওয়া প্রার্থনা করছি এবং এমন আমল যা আপনি পছন্দ করেন। হে আল্লাহ! আমাদের এই সফরকে সহজ করে দিন এবং এর দূরত্ব কমিয়ে দিন।',
    sahihReferenceBn: 'সহীহ মুসলিম: ১৩৪২',
    virtueShortBn: 'সফর আরামদায়ক হয়, পরিবারের সুরক্ষায় আল্লাহ জিম্মাদার হন।',
    recommendedCount: 1,
    searchTags: ['সফর', 'ভ্রমণ', 'জার্নি', 'journey', 'travel', 'trip', 'shofor']
  },
  {
    id: 'qd-veh-3',
    contextCategory: 'vehicle_travel',
    contextCategoryBn: 'যানবাহন ও সফর',
    contextCategoryIcon: '🚗',
    titleBn: 'সফর থেকে ফিরে আসার দোয়া',
    titleEn: 'Dua When Returning from Journey',
    contextOccasionBn: 'সফর শেষে নিজ এলাকা বা ঘরে ফেরার পথে',
    arabicText: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    pronunciationBn: 'আইবূনা তা-ইবূনা আবিদূনা লি-রব্বিনা হা-মিদূন।',
    translationBn: 'আমরা প্রত্যাবর্তনকারী, তওবাকারী, ইবাদতকারী এবং আমাদের রবের প্রশংসাকারী।',
    sahihReferenceBn: 'সহীহ বুখারী: ১৭৯৯, সহীহ মুসলিম: ১৩৪২',
    virtueShortBn: 'সফরের ক্লান্তি মাফ হয়ে আল্লাহর শুকরিয়ায় জীবন পরিচালিত হয়।',
    recommendedCount: 1,
    searchTags: ['সফর সমাপ্তি', 'ফেরা', 'return journey', 'back home']
  },

  // ================= 6. RESTROOM & WUDU =================
  {
    id: 'qd-rest-1',
    contextCategory: 'restroom_wudu',
    contextCategoryBn: 'টয়লেট ও ওজু',
    contextCategoryIcon: '💧',
    titleBn: 'টয়লেটে প্রবেশের দোয়া (বাম পা দিয়ে)',
    titleEn: 'Before Entering the Restroom',
    contextOccasionBn: 'টয়লেট বা বাথরুমে বাম পা দিয়ে প্রবেশের পূর্বে দরজার বাইরে',
    arabicText: 'بِسْمِ اللَّهِ ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    pronunciationBn: 'বিসমিল্লাহি, আল্লাহুম্মা ইন্নী আউজু বিকা মিনাল খুবুসি ওয়াল খাবা-ইস।',
    translationBn: 'আল্লাহর নামে। হে আল্লাহ! আমি আপনার কাছে অপবিত্র পুরুষ ও নারী জিন/শয়তানদের অনিষ্ট থেকে আশ্রয় চাই।',
    sahihReferenceBn: 'সহীহ বুখারী: ১৪২, সহীহ মুসলিম: ৩৭৫',
    virtueShortBn: 'মানুষের সতর ও জিনদের চোখের মাঝে পর্দা সৃষ্টি হয় এবং শয়তানের অনিষ্ট থেকে হেফাজত থাকে।',
    recommendedCount: 1,
    searchTags: ['টয়লেট', 'বাথরুম', 'পায়খানা', 'প্রবেশ', 'toilet', 'restroom', 'bathroom', 'wudu']
  },
  {
    id: 'qd-rest-2',
    contextCategory: 'restroom_wudu',
    contextCategoryBn: 'টয়লেট ও ওজু',
    contextCategoryIcon: '💧',
    titleBn: 'টয়লেট থেকে বের হওয়ার দোয়া (ডান পা দিয়ে)',
    titleEn: 'After Leaving the Restroom',
    contextOccasionBn: 'টয়লেট থেকে ডান পা দিয়ে বের হওয়ার পর',
    arabicText: 'غُفْرَانَكَ ، الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي',
    pronunciationBn: 'গুফরা-নাক। আলহামদু লিল্লাহিল্লাজি আযহাবা আন্নিল আযা ওয়া আফানী।',
    translationBn: '(হে আল্লাহ!) আমি আপনার ক্ষমা প্রার্থনা করছি। সকল প্রশংসা আল্লাহর জন্য, যিনি আমার থেকে কষ্টদায়ক বস্তু দূর করেছেন এবং আমাকে সুস্থতা দান করেছেন।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৩০, জামে তিরমিযী: ৭, সুনান ইবনে মাজাহ: ৩০০',
    virtueShortBn: 'পবিত্রতা অর্জনের শুকরিয়া ও আল্লাহর ক্ষমা লাভ।',
    recommendedCount: 1,
    searchTags: ['টয়লেট বের হওয়া', 'গুফরানাকা', 'toilet exit', 'bathroom out', 'gufranaka']
  },
  {
    id: 'qd-rest-3',
    contextCategory: 'restroom_wudu',
    contextCategoryBn: 'টয়লেট ও ওজু',
    contextCategoryIcon: '💧',
    titleBn: 'ওজু সমাপ্তির পর জান্নাতের ৮ দরজা খোলার দোয়া',
    titleEn: 'Dua After Completing Wudu',
    contextOccasionBn: 'ওজু শেষ করার সাথে সাথে পাঠ করবেন',
    arabicText: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    pronunciationBn: 'আশহাদু আল লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসূলুহু। আল্লাহুম্মাজ আলনী মিনাত তাওয়াবীন, ওয়াজ আলনী মিনাল মুতাত্বহহিরীন।',
    translationBn: 'আমি সাক্ষ্য দিচ্ছি আল্লাহ ছাড়া সত্য কোনো উপাস্য নেই, তিনি একক, তাঁর শরিক নেই। এবং মুহাম্মদ (সা.) তাঁর বান্দা ও রাসূল। হে আল্লাহ! আমাকে তওবাকারী ও পবিত্রতা অর্জনকারীদের অন্তর্ভুক্ত করুন।',
    sahihReferenceBn: 'সহীহ মুসলিম: ২৩৪, জামে তিরমিযী: ৫৫',
    virtueShortBn: 'জান্নাতের ৮টি দরজাই উন্মুক্ত হয়ে যায়, যে দরজা দিয়ে ইচ্ছা প্রবেশ করা যাবে।',
    recommendedCount: 1,
    searchTags: ['ওজু', 'ওযু', 'অযু', 'wudu', 'ablution', 'shahadah', 'jannat 8 doors']
  },

  // ================= 7. MASJID & PRAYER =================
  {
    id: 'qd-masjid-1',
    contextCategory: 'masjid_prayer',
    contextCategoryBn: 'মসজিদ ও নামাজ',
    contextCategoryIcon: '🕌',
    titleBn: 'মসজিদে প্রবেশের দোয়া (রহমতের দুয়ার উন্মোচন)',
    titleEn: 'Entering the Mosque',
    contextOccasionBn: 'ডান পা বাড়িয়ে মসজিদে প্রবেশের সময়',
    arabicText: 'بِسْمِ اللَّهِ ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    pronunciationBn: 'বিসমিল্লাহি, ওয়াস সালাতু ওয়াস সালামু আলা রাসূলিল্লাহ, আল্লাহুম্মাফ তাহলী আবওয়াবা রহমাতিক।',
    translationBn: 'আল্লাহর নামে এবং আল্লাহর রাসূলের ওপর দরূদ ও সালাম। হে আল্লাহ! আপনি আমার জন্য আপনার রহমতের দরজাসমূহ খুলে দিন।',
    sahihReferenceBn: 'সহীহ মুসলিম: ৭১৩, সুনান আবু দাউদ: ৪৬৫',
    virtueShortBn: 'মসজিদে অবস্থানকালে আল্লাহর বিশেষ রহমতের চাদরে আবৃত থাকা যায়।',
    recommendedCount: 1,
    searchTags: ['মসজিদ', 'মসজিদে প্রবেশ', 'নামাজ', 'mosque', 'masjid', 'entering mosque']
  },
  {
    id: 'qd-masjid-2',
    contextCategory: 'masjid_prayer',
    contextCategoryBn: 'মসজিদ ও নামাজ',
    contextCategoryIcon: '🕌',
    titleBn: 'মসজিদ থেকে বের হওয়ার দোয়া',
    titleEn: 'Leaving the Mosque',
    contextOccasionBn: 'বাম পা বাইরে বাড়িয়ে মসজিদ ত্যাগের সময়',
    arabicText: 'بِسْمِ اللَّهِ ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ ، اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ',
    pronunciationBn: 'বিসমিল্লাহি, ওয়াস সালাতু ওয়াস সালামু আলা রাসূলিল্লাহ, আল্লাহুম্মা ইন্নী আসআলুকা মিন ফাদ্বলিক, আল্লাহুম্মা’সিমনী মিনাশ শায়ত্বানির রাজীম।',
    translationBn: 'আল্লাহর নামে এবং রাসূলের ওপর দরূদ ও সালাম। হে আল্লাহ! আমি আপনার অনুগ্রহ (হালাল রিযিক) প্রার্থনা করছি। হে আল্লাহ! বিতাড়িত শয়তান থেকে আমাকে রক্ষা করুন।',
    sahihReferenceBn: 'সহীহ মুসলিম: ৭১৩, সুনান ইবনে মাজাহ: ৭৭৩',
    virtueShortBn: 'হালাল জীবিকায় বরকত এবং শয়তানের প্রতারণা থেকে মুক্তি।',
    recommendedCount: 1,
    searchTags: ['মসজিদ থেকে বের', 'মসজিদ বাহির', 'leaving mosque', 'masjid out']
  },
  {
    id: 'qd-masjid-3',
    contextCategory: 'masjid_prayer',
    contextCategoryBn: 'মসজিদ ও নামাজ',
    contextCategoryIcon: '🕌',
    titleBn: 'ফরজ সালাত সমাপ্তির পর আয়াতুল কুরসী',
    titleEn: 'Ayatul Kursi After Fardh Prayer',
    contextOccasionBn: 'প্রতি ফরজ সালাতে সালাম ফেরানোর পরপরই',
    arabicText: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ... وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    pronunciationBn: 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূম... ওয়া হুওয়াল আলিয়্যুল আযীম।',
    translationBn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই, তিনি চিরঞ্জীব ও সর্বসত্তার ধারক...',
    sahihReferenceBn: 'সুনান আন-নাসায়ী (আমালুল ইয়াওমি ওয়াল লাইলাহ): ১০০ (সহীহ)',
    virtueShortBn: 'মৃত্যু ছাড়া জান্নাতে প্রবেশে আর কোনো বাধা থাকে না।',
    recommendedCount: 1,
    searchTags: ['সালাত', 'নামাজ শেষ', 'আয়াতুল কুরসী', 'fardh prayer', 'ayatul kursi', 'namaz']
  },

  // ================= 8. DRESS & APPEARANCE =================
  {
    id: 'qd-dress-1',
    contextCategory: 'dress_appearance',
    contextCategoryBn: 'পোশাক ও রূপচর্চা',
    contextCategoryIcon: '👕',
    titleBn: 'নতুন বা যেকোনো পোশাক পরিধানের দোয়া',
    titleEn: 'When Wearing New Clothes',
    contextOccasionBn: 'পোশাক বা জামা পরিধান করার সময়',
    arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    pronunciationBn: 'আলহামদু লিল্লাহিল্লাজি কাসানী হাযা ওয়া রাযাক্বানীহি মিন গাইরি হাওলিম মিন্নী ওয়ালা কুওয়াহ্।',
    translationBn: 'সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাকে এই পোশাক পরালেন এবং আমার কোনো শক্তি-সামর্থ্য ছাড়াই রিযিক হিসেবে দান করলেন।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৪০২৩, জামে তিরমিযী: ৩৪৫৮ (হাসান)',
    virtueShortBn: 'পূর্বের ও পরের সগীরা গুনাহ ক্ষমা করে দেওয়া হয়।',
    recommendedCount: 1,
    searchTags: ['পোশাক', 'কাপড়', 'নতুন জামা', 'dress', 'clothes', 'wearing clothes', 'jama']
  },
  {
    id: 'qd-dress-2',
    contextCategory: 'dress_appearance',
    contextCategoryBn: 'পোশাক ও রূপচর্চা',
    contextCategoryIcon: '👕',
    titleBn: 'পোশাক খোলার সময় (জিনদের দৃষ্টি থেকে পর্দা)',
    titleEn: 'When Undressing / Taking Off Clothes',
    contextOccasionBn: 'পোশাক খোলার শুরুতে মুখে বলা',
    arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا إِلَهَ إِلَّا هُوَ',
    pronunciationBn: 'বিসমিল্লাহিল্লাজি লা ইলাহা ইল্লা হুওয়া।',
    translationBn: 'আল্লাহর নামে (পোশাক খুলছি), যাঁর ছাড়া কোনো সত্য উপাস্য নেই।',
    sahihReferenceBn: 'জামে তিরমিযী: ৬০৬, ইবনে আস-সুন্নী',
    virtueShortBn: 'জিনদের চোখ ও মানুষের সতরের মাঝে অদৃশ্য পর্দা সৃষ্টি হয়।',
    recommendedCount: 1,
    searchTags: ['পোশাক খোলা', 'কাপড় খোলা', 'undress', 'taking off clothes']
  },
  {
    id: 'qd-dress-3',
    contextCategory: 'dress_appearance',
    contextCategoryBn: 'পোশাক ও রূপচর্চা',
    contextCategoryIcon: '👕',
    titleBn: 'আয়না দেখার দোয়া (সুন্দর চরিত্রের প্রার্থনা)',
    titleEn: 'When Looking in the Mirror',
    contextOccasionBn: 'আয়নায় নিজের চেহারা দেখার সময়',
    arabicText: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    pronunciationBn: 'আল্লাহুম্মা আনতা হাস্সানতা খালক্বী ফাহাস্সিন খুলুক্বী।',
    translationBn: 'হে আল্লাহ! আপনি যেভাবে আমার বাহ্যিক চেহারা সুন্দর করেছেন, তেমনি আমার চরিত্র ও স্বভাবকেও সুন্দর করে দিন।',
    sahihReferenceBn: 'মুসনাদে আহমাদ: ২৪৩২২, হিসনুল মুসলিম',
    virtueShortBn: 'আত্মঅহংকার দূর হয় ও চরিত্রের সৌন্দর্য বাড়ে।',
    recommendedCount: 1,
    searchTags: ['আয়না', 'চেহারা', 'রূপ', 'mirror', 'face', 'beauty', 'ayna']
  },

  // ================= 9. STUDY & KNOWLEDGE =================
  {
    id: 'qd-study-1',
    contextCategory: 'study_knowledge',
    contextCategoryBn: 'পড়াশোনা ও জ্ঞান',
    contextCategoryIcon: '📚',
    titleBn: 'জ্ঞান ও মেধা বৃদ্ধির কুরআনি দোয়া',
    titleEn: 'Dua for Increasing Knowledge & Memory',
    contextOccasionBn: 'পড়াশোনা, ক্লাস, পরীক্ষা বা গবেষণার শুরুতে',
    arabicText: 'رَبِّ زِدْنِي عِلْمًا',
    pronunciationBn: 'রব্বি যিদনী ইলমা।',
    translationBn: 'হে আমার পালনকর্তা! আমার জ্ঞান বৃদ্ধি করে দিন।',
    sahihReferenceBn: 'সূরা ত্বা-হা: ১১৪',
    virtueShortBn: 'জ্ঞানার্জনের পথ সুগম হয় এবং মেধা তীক্ষ্ণ হয়।',
    recommendedCount: 3,
    searchTags: ['পড়াশোনা', 'জ্ঞান', 'মেধা', 'পরীক্ষা', 'study', 'knowledge', 'exam', 'memory', 'porasuna']
  },
  {
    id: 'qd-study-2',
    contextCategory: 'study_knowledge',
    contextCategoryBn: 'পড়াশোনা ও জ্ঞান',
    contextCategoryIcon: '📚',
    titleBn: 'কঠিন পড়া বা বিষয় সহজ হওয়ার দোয়া',
    titleEn: 'Dua When Facing Hard Tasks / Exams',
    contextOccasionBn: 'কঠিন প্রশ্ন বা জটিল পাঠের মুখোমুখি হলে',
    arabicText: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا ، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا',
    pronunciationBn: 'আল্লাহুম্মা লা সাহলা ইল্লা মা জাআলতাহু সাহলান, ওয়া আনতা তাজআলুল হাযনা ইযা শি’তা সাহলা।',
    translationBn: 'হে আল্লাহ! কোনো কিছুই সহজ নয় কেবল আপনি যা সহজ করেন তা ছাড়া। আর আপনি চাইলে যেকোনো কঠিন বিষয়কে সহজ করে দেন।',
    sahihReferenceBn: 'সহীহ ইবনে হিব্বান: ৯৭৪, ইবনুস সুন্নী',
    virtueShortBn: 'পরীক্ষার ভয় ও কঠিন বিষয় নিমেষেই সহজ ও বোধগম্য হয়ে যায়।',
    recommendedCount: 1,
    searchTags: ['কঠিন পড়া', 'সহজ হওয়া', 'পরীক্ষা', 'difficult task', 'exam easy', 'shohaj']
  },
  {
    id: 'qd-study-3',
    contextCategory: 'study_knowledge',
    contextCategoryBn: 'পড়াশোনা ও জ্ঞান',
    contextCategoryIcon: '📚',
    titleBn: 'বক্তব্য ও মুখের জড়তা দূর করার দোয়া',
    titleEn: 'Dua for Eloquence & Public Speaking',
    contextOccasionBn: 'উপস্থাপনা, ভাইভা, বক্তব্য বা ক্লাসে কথা বলার আগে',
    arabicText: 'رَبِّ اشْرَحْ لِي صَدْرِي ، وَيَسِّرْ لِي أَمْرِي ، وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي ، يَفْقَهُوا قَوْلِي',
    pronunciationBn: 'রব্বিশ রাহলী সাদরী, ওয়া ইয়াসসির লী আমরী, ওয়াহলুল উক্বদাতাম মিল লিসানী, ইয়াফক্বাহূ ক্বওলী।',
    translationBn: 'হে আমার রব! আমার বক্ষ প্রশস্ত করে দিন, আমার কাজ সহজ করে দিন এবং আমার জিহ্বার জড়তা দূর করে দিন যাতে তারা আমার কথা বুঝতে পারে।',
    sahihReferenceBn: 'সূরা ত্বা-হা: ২৫-২৮ (মুসা আ.-এর দোআ)',
    virtueShortBn: 'মুখের জড়তা কেটে নির্ভীক ও স্পষ্ট বক্তব্য দেওয়ার ক্ষমতা তৈরি হয়।',
    recommendedCount: 1,
    searchTags: ['জড়তা', 'ভাইভা', 'বক্তব্য', 'কথা বলা', 'viva', 'speech', 'presentation', 'speaking']
  },

  // ================= 10. WORK, WEALTH & DEBT =================
  {
    id: 'qd-work-1',
    contextCategory: 'work_wealth',
    contextCategoryBn: 'কাজ, রিযিক ও ঋণ',
    contextCategoryIcon: '💼',
    titleBn: 'পাহাড়সম ঋণ ও অভাব মুক্তির দোয়া',
    titleEn: 'Dua for Freedom from Debt & Poverty',
    contextOccasionBn: 'প্রতিদিন বিশেষ করে ফজর ও আসরের পর',
    arabicText: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    pronunciationBn: 'আল্লাহুম্মাকফিনী বিহালালিকা আন হারামিকা, ওয়া আগনিনী বিফাদ্বলিকা আম্মান সিওয়াক।',
    translationBn: 'হে আল্লাহ! আমাকে আপনার হালাল দ্বারা হারাম থেকে বাঁচিয়ে যথেষ্ট করে দিন এবং আপনার অনুগ্রহ দ্বারা আপনি ছাড়া অন্য সবার থেকে অমুখাপেক্ষী ও অভাবমুক্ত করে দিন।',
    sahihReferenceBn: 'জামে তিরমিযী: ৩৫৬৩ (হাসান)',
    virtueShortBn: 'পাহাড় পরিমাণ ঋণ থাকলেও আল্লাহ তা পরিশোধের গায়েবী ব্যবস্থা করে দেন।',
    recommendedCount: 3,
    searchTags: ['ঋণ', 'অভাব', 'টাকা', 'রিযিক', 'debt', 'poverty', 'wealth', 'rizq', 'taka']
  },
  {
    id: 'qd-work-2',
    contextCategory: 'work_wealth',
    contextCategoryBn: 'কাজ, রিযিক ও ঋণ',
    contextCategoryIcon: '💼',
    titleBn: 'বাজারে বা শপিং মলে প্রবেশের দোয়া (১০ লক্ষ নেকি)',
    titleEn: 'When Entering the Marketplace / Mall',
    contextOccasionBn: 'বাজার, সুপারশপ বা শপিং মলে প্রবেশের সময়',
    arabicText: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    pronunciationBn: 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ইউহ্য়ী ওয়া ইউমীতু ওয়া হুওয়া হাইয়্যুল লা ইয়ামূতু, বিয়াদিহিল খাইরু ওয়া হুওয়া আলা কুল্লি শাইয়িন ক্বদীর।',
    translationBn: 'আল্লাহ ছাড়া সত্য উপাস্য নেই, তিনি একক, শরিকহীন। রাজত্ব ও প্রশংসা তাঁরই। তিনি জীবন ও মৃত্যু দান করেন, তিনি চিরঞ্জীব মৃত্যুহীন; তাঁর হাতেই সব কল্যাণ এবং তিনি সব কিছুর ওপর ক্ষমতাবান।',
    sahihReferenceBn: 'জামে তিরমিযী: ৩৪২৮, সুনান ইবনে মাজাহ: ২২৩৫ (হাসান)',
    virtueShortBn: 'আমলনামায় ১০ লক্ষ নেকি লেখা হয়, ১০ লক্ষ গুনাহ মোচন হয় এবং জান্নাতে প্রাসাদ নির্মিত হয়।',
    recommendedCount: 1,
    searchTags: ['বাজার', 'মার্কেট', 'শপিং', '১০ লাখ নেকি', 'market', 'mall', 'shopping', 'bazar']
  },
  {
    id: 'qd-work-3',
    contextCategory: 'work_wealth',
    contextCategoryBn: 'কাজ, রিযিক ও ঋণ',
    contextCategoryIcon: '💼',
    titleBn: 'হালাল রিযিক ও উপকারী এলেমের দোয়া',
    titleEn: 'Dua for Halal Sustenance & Beneficial Knowledge',
    contextOccasionBn: 'প্রতিদিন ফজরের সালাতের সালাম ফিরানোর পর',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا ، وَرِزْقًا طَيِّبًا ، وَعَمَلًا مُتَقَبَّلًا',
    pronunciationBn: 'আল্লাহুম্মা ইন্নী আসআলুকা ইলমান নাফিআ, ওয়া রিযক্বান ত্বইয়িবা, ওয়া আমালাম মুতাক্বব্বালা।',
    translationBn: 'হে আল্লাহ! আমি আপনার নিকট উপকারী জ্ঞান, পবিত্র ও হালাল রিযিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।',
    sahihReferenceBn: 'সুনান ইবনে মাজাহ: ৯২৫, সুনান আন-নাসায়ী',
    virtueShortBn: 'দিনের শুরুতে হালাল রুজি ও নেক আমলের বারাকা।',
    recommendedCount: 1,
    searchTags: ['হালাল রিযিক', 'আমল কবুল', 'rizq', 'halal wealth', 'beneficial knowledge']
  },

  // ================= 11. HEALTH, CURE & DISTRESS =================
  {
    id: 'qd-heal-1',
    contextCategory: 'distress_healing',
    contextCategoryBn: 'রোগ ও শেফা',
    contextCategoryIcon: '🛡️',
    titleBn: 'শরীরে ব্যথা বা অসুখ হলে ৩+৭ বারের আমল',
    titleEn: 'Dua for Physical Pain / Sickness',
    contextOccasionBn: 'ব্যথার স্থানে ডান হাত রেখে ৩ বার বিসমিল্লাহ + ৭ বার এই দোয়া',
    arabicText: 'بِسْمِ اللَّهِ (৩ বার) ، أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (৭ বার)',
    pronunciationBn: 'বিসমিল্লাহ (৩ বার), আউজু বিল্লাহি ওয়া ক্বুদরাতিহী মিন শাররি মা আজিদু ওয়া উহাযিরু (৭ বার)।',
    translationBn: 'আল্লাহর নামে। আমি আল্লাহর কাছে এবং তাঁর কুদরতের কাছে আশ্রয় চাই সেই কষ্ট ও ভীতি থেকে যা আমি অনুভব করছি।',
    sahihReferenceBn: 'সহীহ মুসলিম: ২২০২',
    virtueShortBn: 'তাত্ক্ষণিক তীব্র ব্যথা ও রোগ থেকে নিরাময় লাভ।',
    recommendedCount: 7,
    searchTags: ['ব্যথা', 'রোগ', 'অসুখ', 'জ্বর', 'pain', 'sickness', 'cure', 'fever', 'shifa']
  },
  {
    id: 'qd-heal-2',
    contextCategory: 'distress_healing',
    contextCategoryBn: 'রোগ ও শেফা',
    contextCategoryIcon: '🛡️',
    titleBn: 'রোগী দেখতে গিয়ে ৭ বার পাঠের দোয়া',
    titleEn: 'Dua When Visiting the Sick',
    contextOccasionBn: 'অসুস্থ ব্যক্তিকে দেখতে গিয়ে তার পাশে বসে ৭ বার পাঠ করবেন',
    arabicText: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    pronunciationBn: 'আসআলুল্লাহাল আযীম, রব্বাল আরশিল আযীম, আঁই ইয়াশফিয়াক।',
    translationBn: 'আমি মহান আরশের প্রতিপালক মহান আল্লাহর নিকট প্রার্থনা করছি, তিনি যেন আপনাকে সুস্থতা ও আরোগ্য দান করেন।',
    sahihReferenceBn: 'সুনান আবু দাউদ: ৩১০৬, জামে তিরমিযী: ২০৮৩ (সহীহ)',
    virtueShortBn: 'মৃত্যু আসন্ন না হলে রোগী নিশ্চিত রোগমুক্ত ও সুস্থ হয়ে ওঠেন।',
    recommendedCount: 7,
    searchTags: ['রোগী দেখা', 'শেফা', 'আরোগ্য', 'sick visit', 'cure sick', 'hospital']
  },
  {
    id: 'qd-heal-3',
    contextCategory: 'distress_healing',
    contextCategoryBn: 'রোগ ও শেফা',
    contextCategoryIcon: '🛡️',
    titleBn: 'চরম বিপদ ও পেরেশানি মুক্তির দোআয়ে ইউনুস',
    titleEn: 'Ayat Kareema for Distress Relief',
    contextOccasionBn: 'বিপদ, জটিল মামলা, উৎকণ্ঠা বা কঠিন পরীক্ষার সময়',
    arabicText: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    pronunciationBn: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুনতু মিনাজ জোয়ালিমীন।',
    translationBn: 'আপনি ছাড়া কোনো সত্য উপাস্য নেই, আপনি অতি পবিত্র; নিশ্চয়ই আমি অবিচারকারীদের অন্তর্ভুক্ত।',
    sahihReferenceBn: 'সূরা আল-আম্বিয়া: ৮৭, জামে তিরমিযী: ৩৫০৫',
    virtueShortBn: 'যেকোনো মুসলিম এই দোয়ার মাধ্যমে চাইলে আল্লাহ অবশ্যই বিপদ দূর করেন।',
    recommendedCount: 33,
    searchTags: ['বিপদ', 'পেরেশানি', 'ইউনুস', 'distress', 'anxiety', 'crisis', 'bipod']
  },

  // ================= 12. ANGER, MANNERS & SOCIAL =================
  {
    id: 'qd-ang-1',
    contextCategory: 'anger_manners',
    contextCategoryBn: 'রাগ, ক্ষমা ও আচরণ',
    contextCategoryIcon: '🤝',
    titleBn: 'রাগ নিয়ন্ত্রণ করার দোয়া',
    titleEn: 'Dua When Getting Angry',
    contextOccasionBn: 'মনে প্রচণ্ড ক্ষোভ বা রাগ উদ্রেক হলে',
    arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    pronunciationBn: 'আউজু বিল্লাহি মিনাশ শায়ত্বানির রাজীম।',
    translationBn: 'আমি বিতাড়িত শয়তানের প্ররোচনা থেকে আল্লাহর আশ্রয় প্রার্থনা করছি।',
    sahihReferenceBn: 'সহীহ বুখারী: ৬১১৫, সহীহ মুসলিম: ২৬১০',
    virtueShortBn: 'শয়তানি উত্তাপ নিভে গিয়ে মন তাৎক্ষণিক শান্ত হয়ে যায়।',
    recommendedCount: 1,
    searchTags: ['রাগ', 'ক্ষোভ', 'শান্ত', 'anger', 'angry', 'calm down', 'gussa']
  },
  {
    id: 'qd-ang-2',
    contextCategory: 'anger_manners',
    contextCategoryBn: 'রাগ, ক্ষমা ও আচরণ',
    contextCategoryIcon: '🤝',
    titleBn: 'হাঁচি দিলে ও হাঁচির উত্তর দেওয়ার দোয়া',
    titleEn: 'Sneezing & Replying to Sneeze',
    contextOccasionBn: 'হাঁচি এলে বলবেন "আলহামদুলিল্লাহ", শুনলে বলবেন "ইয়ারহামুকাল্লাহ"',
    arabicText: 'الْحَمْدُ لِلَّهِ (উত্তর: يَرْحَمُكَ اللَّهُ ، পুনরায়: يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ)',
    pronunciationBn: 'আলহামদু লিল্লাহ। (উত্তরদাতা: ইয়ারহামুকাল্লাহ। হাঁচিদাতা আবার বলবে: ইয়াহ্দীকুমুল্লাহু ওয়া ইউস্লিহু বা-লাকুম)।',
    translationBn: 'সকল প্রশংসা আল্লাহর। (উত্তর: আল্লাহ আপনার ওপর দয়া করুন। পুনরায়: আল্লাহ আপনাকে হেদায়েত দিন ও আপনার অবস্থা সুন্দর করুন)।',
    sahihReferenceBn: 'সহীহ বুখারী: ৬২২৪',
    virtueShortBn: 'পরস্পরের জন্য রহমত ও বরকতের সুন্নাহ কায়েম।',
    recommendedCount: 1,
    searchTags: ['হাঁচি', 'সর্দি', 'sneezing', 'sneeze', 'yarhamukallah']
  },
  {
    id: 'qd-ang-3',
    contextCategory: 'anger_manners',
    contextCategoryBn: 'রাগ, ক্ষমা ও আচরণ',
    contextCategoryIcon: '🤝',
    titleBn: 'কেউ উপকার বা অনুগ্রহ করলে ধন্যবাদ দোয়া',
    titleEn: 'Thanking Someone Who Did a Favor',
    contextOccasionBn: 'কেউ সাহায্য বা উপহার দিলে কৃতজ্ঞতাস্বরূপ বলা',
    arabicText: 'جَزَاكَ اللَّهُ خَيْرًا',
    pronunciationBn: 'জাযাকাল্লাহু খাইরান।',
    translationBn: 'আল্লাহ আপনাকে উত্তম প্রতিদান দান করুন।',
    sahihReferenceBn: 'জামে তিরমিযী: ২০৩৫ (সহীহ)',
    virtueShortBn: 'কৃতজ্ঞতা প্রকাশের সর্বোত্তম ইসলামিক বাক্য।',
    recommendedCount: 1,
    searchTags: ['ধন্যবাদ', 'থ্যাংকস', 'উপকার', 'thank you', 'jazakallah', 'favor']
  },
  {
    id: 'qd-ang-4',
    contextCategory: 'anger_manners',
    contextCategoryBn: 'রাগ, ক্ষমা ও আচরণ',
    contextCategoryIcon: '🤝',
    titleBn: 'বৈঠক বা আড্ডা শেষ করার কাফ্ফারা দোয়া',
    titleEn: 'Expiation of Assembly / Meeting End',
    contextOccasionBn: 'যেকোনো সভা, মিটিং বা আড্ডা শেষ করে ওঠার আগে',
    arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    pronunciationBn: 'সুবহানাকাল্লাহুম্মা ওয়া বিহামদিকা, আশহাদু আল লা ইলাহা ইল্লা আনতা, আসতাগফিরুকা ওয়া আতূবু ইলাইক।',
    translationBn: 'হে আল্লাহ! আপনার প্রশংসাসহ পবিত্রতা ঘোষণা করছি। আমি সাক্ষ্য দিচ্ছি আপনি ছাড়া সত্য উপাস্য নেই। আমি আপনার কাছে ক্ষমা চাই ও তওবা করছি।',
    sahihReferenceBn: 'জামে তিরমিযী: ৩৪৩৩, সুনান আবু দাউদ: ৪৮৫৮',
    virtueShortBn: 'বৈঠকে ঘটে যাওয়া সমস্ত অনর্থক কথাবার্তা ও অনিচ্ছাকৃত ভুলত্রুটি মাফ হয়ে যায়।',
    recommendedCount: 1,
    searchTags: ['বৈঠক', 'সভা', 'মিটিং', 'আড্ডা', 'কাফ্ফারা', 'meeting end', 'assembly', 'boithok']
  },

  // ================= 13. NATURE & WEATHER =================
  {
    id: 'qd-nat-1',
    contextCategory: 'nature_weather',
    contextCategoryBn: 'বৃষ্টি ও আবহাওয়া',
    contextCategoryIcon: '⛈️',
    titleBn: 'বৃষ্টি বর্ষণ শুরু হলে রহমতের দোয়া',
    titleEn: 'When it Rains',
    contextOccasionBn: 'বৃষ্টির ফোঁটা পড়তে দেখলে পাঠ করবেন',
    arabicText: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    pronunciationBn: 'আল্লাহুম্মা সায়্যিবান নাফিআ।',
    translationBn: 'হে আল্লাহ! আমাদের জন্য এই বৃষ্টিকে কল্যাণকর ও উপকারী বানিয়ে দিন।',
    sahihReferenceBn: 'সহীহ বুখারী: ১০৩২',
    virtueShortBn: 'বৃষ্টির সময় দোয়া কবুল হয় এবং রহমতের বৃষ্টি নাজিল হয়।',
    recommendedCount: 1,
    searchTags: ['বৃষ্টি', 'বাদল', 'rain', 'raining', 'weather', 'brishti']
  },
  {
    id: 'qd-nat-2',
    contextCategory: 'nature_weather',
    contextCategoryBn: 'বৃষ্টি ও আবহাওয়া',
    contextCategoryIcon: '⛈️',
    titleBn: 'মেঘের গর্জন বা বজ্রপাত শুনলে',
    titleEn: 'Upon Thunder and Lightning',
    contextOccasionBn: 'মেঘের গর্জন বা বিজলি চমকানোর শব্দ শুনলে',
    arabicText: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
    pronunciationBn: 'সুবহানাল্লাজি ইউসাব্বিহুর রা’দু বিহামদিহী ওয়াল মালা-ইকাতু মিন খীফাতিহী।',
    translationBn: 'পবিত্র সেই সত্তা, মেঘের গর্জন যাঁর প্রশংসার তাসবীহ পাঠ করে এবং ফেরেশতারাও তাঁর ভয়ে কম্পিত হয়ে তাসবীহ করে।',
    sahihReferenceBn: 'মুয়াত্তা ইমাম মালিক: ১৮০৮, আল-আদাবুল মুফরাদ',
    virtueShortBn: 'বজ্রপাত ও আকস্মিক দুর্যোগ থেকে আল্লাহর নিরাপত্তা।',
    recommendedCount: 1,
    searchTags: ['বজ্রপাত', 'মেঘের গর্জন', 'বিদ্যুৎ', 'thunder', 'lightning', 'storm', 'bojro']
  },
  {
    id: 'qd-nat-3',
    contextCategory: 'nature_weather',
    contextCategoryBn: 'বৃষ্টি ও আবহাওয়া',
    contextCategoryIcon: '⛈️',
    titleBn: 'প্রচণ্ড ঝড়-তুফান বা তীব্র বাতাস বইলে',
    titleEn: 'During Strong Winds / Storms',
    contextOccasionBn: 'ঝড়ো হাওয়া বা সাইক্লোন বইতে থাকলে',
    arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ',
    pronunciationBn: 'আল্লাহুম্মা ইন্নী আসআলুকা খাইরাহা ওয়া খাইরা মা ফীহা ওয়া খাইরা মা উরসিলাত বিহী, ওয়া আউজু বিকা মিন শাররিহা ওয়া শাররি মা ফীহা ওয়া শাররি মা উরসিলাত বিহী।',
    translationBn: 'হে আল্লাহ! আমি আপনার কাছে এর কল্যাণ চাই, এতে নিহিত কল্যাণ চাই এবং যা নিয়ে প্রেরিত হয়েছে তার কল্যাণ চাই। আর এর অনিষ্ট থেকে আশ্রয় চাই...',
    sahihReferenceBn: 'সহীহ মুসলিম: ৮৯৯, জামে তিরমিযী: ৩৪৪৯',
    virtueShortBn: 'ঝড়-তুফানের ধ্বংসযজ্ঞ থেকে রক্ষা পাওয়া যায়।',
    recommendedCount: 1,
    searchTags: ['ঝড়', 'বাতাস', 'তুফান', 'সাইক্লোন', 'storm', 'wind', 'cyclone', 'jhor']
  },
  {
    id: 'qd-nat-4',
    contextCategory: 'nature_weather',
    contextCategoryBn: 'বৃষ্টি ও আবহাওয়া',
    contextCategoryIcon: '⛈️',
    titleBn: 'নতুন চাঁদ দেখার দোয়া',
    titleEn: 'Upon Sighting the New Crescent Moon',
    contextOccasionBn: 'রমজান, ঈদ বা যেকোনো মাসের নতুন চাঁদ দেখলে',
    arabicText: 'اللَّهُ أَكْبَرُ ، اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ ، وَالسَّلَامَةِ وَالْإِسْلَامِ ، رَبِّي وَرَبُّكَ اللَّهُ',
    pronunciationBn: 'আল্লাহু আকবার, আল্লাহুম্মা আহিল্লাহু আলাইনা বিল আমনি ওয়াল ঈমান, ওয়াস সালামাতি ওয়াল ইসলাম, রব্বী ওয়া রব্বুকাল্লাহ।',
    translationBn: 'আল্লাহ সর্বশ্রেষ্ঠ। হে আল্লাহ! আমাদের ওপর এই চাঁদকে নিরাপত্তা, ঈমান, শান্তি ও ইসলামের সাথে উদিত করুন। (হে চাঁদ!) আমার রব ও তোমার রব আল্লাহ।',
    sahihReferenceBn: 'জামে তিরমিযী: ৩৪৫১ (হাসান)',
    virtueShortBn: 'পুরো মাস জুড়ে শান্তি, সমৃদ্ধি ও নিরাপত্তা বজায় থাকে।',
    recommendedCount: 1,
    searchTags: ['নতুন চাঁদ', 'চাঁদ দেখা', 'রমজান চাঁদ', 'ঈদ চাঁদ', 'crescent moon', 'hilal', 'eid moon']
  },

  // ================= 14. FAMILY & SOCIAL =================
  {
    id: 'qd-fam-1',
    contextCategory: 'family_social',
    contextCategoryBn: 'পিতামাতা ও পরিবার',
    contextCategoryIcon: '👨‍👩‍👧',
    titleBn: 'পিতামাতার মাগফিরাত ও রহমতের কুরআনি দোয়া',
    titleEn: 'Dua for Parents (Surah Al-Isra)',
    contextOccasionBn: 'প্রতিদিন সালাতের পর ও পিতা-মাতার স্মরণে',
    arabicText: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    pronunciationBn: 'রব্বির হামহুমা কামা রব্বায়ানী সগীরা।',
    translationBn: 'হে আমার পালনকর্তা! আমার পিতামাতার ওপর তেমনি রহম ও দয়া বর্ষণ করুন, যেভাবে শৈশবে তাঁরা আমাকে স্নেহ-মমতায় লালন-পালন করেছেন।',
    sahihReferenceBn: 'সূরা বনী ইসরাঈল (আল-ইসরা): ২৪',
    virtueShortBn: 'পিতামাতার জন্য সর্বোত্তম সাদাকায়ে জারিয়া ও জান্নাতি মর্যাদা বৃদ্ধি।',
    recommendedCount: 3,
    searchTags: ['পিতামাতা', 'মা বাবা', 'বাবা', 'মা', 'parents', 'mother', 'father', 'baba', 'ma']
  },
  {
    id: 'qd-fam-2',
    contextCategory: 'family_social',
    contextCategoryBn: 'পিতামাতা ও পরিবার',
    contextCategoryIcon: '👨‍👩‍👧',
    titleBn: 'উত্তম স্ত্রী ও চক্ষুশীতলকারী নেক সন্তানের দোয়া',
    titleEn: 'Dua for Righteous Spouse & Children',
    contextOccasionBn: 'পরিবারে শান্তি ও নেক বংশধরের প্রার্থনায়',
    arabicText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    pronunciationBn: 'রব্বানা হাব লানা মিন আযওয়াজিনা ওয়া যুররিইয়্যাতিনা ক্বুররাতা আ’ইয়ুনিঁও ওয়াজআলনা লিল মুত্তাক্বীনা ইমামা।',
    translationBn: 'হে আমাদের পালনকর্তা! আমাদের স্ত্রী ও সন্তানদের আমাদের জন্য নয়নপ্রীতিকর বানিয়ে দিন এবং আমাদের মুত্তাকীদের নেতা বানিয়ে দিন।',
    sahihReferenceBn: 'সূরা আল-ফুরকান: ৭৪',
    virtueShortBn: 'দাম্পত্য কলহ দূর হয় এবং সন্তানরা সৎ ও অনুগত হয়।',
    recommendedCount: 1,
    searchTags: ['স্ত্রী', 'স্বামী', 'সন্তান', 'পরিবার', 'spouse', 'children', 'family', 'shongshar', 'sontan']
  },
  {
    id: 'qd-fam-3',
    contextCategory: 'family_social',
    contextCategoryBn: 'পিতামাতা ও পরিবার',
    contextCategoryIcon: '👨‍👩‍👧',
    titleBn: 'বদনজর ও অনিষ্ট থেকে শিশুদের সুরক্ষার দোয়া',
    titleEn: 'Protection of Children from Evil Eye',
    contextOccasionBn: 'সন্তান বা শিশুকে কোলে নিয়ে মাথায় হাত রেখে পাঠ করবেন',
    arabicText: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    pronunciationBn: 'উইযুকুম (একজনের জন্য উইযুকা) বিকালিমা-তিল্লাহিত তা-ম্মাতি মিন কুল্লি শায়ত্বানিঁও ওয়া হা-ম্মাহ, ওয়া মিন কুল্লি আইনিল লা-ম্মাহ।',
    translationBn: 'আমি তোমাদেরকে আল্লাহর পরিপূর্ণ বাণীসমূহের আশ্রয়ে সঁপে দিচ্ছি প্রতিটি শয়তান, বিষাক্ত প্রাণী এবং অনিষ্টকারী বদনজর থেকে।',
    sahihReferenceBn: 'সহীহ বুখারী: ৩৩৭১ (নবীজী হাসান ও হুসাইনের জন্য পড়তেন)',
    virtueShortBn: 'শিশুদের মারাত্মক বদনজর, পেটের পীড়া ও অহেতুক কান্না থেকে শতভাগ রক্ষা।',
    recommendedCount: 3,
    searchTags: ['বদনজর', 'শিশু', 'বাচ্চা', 'সুরক্ষা', 'evil eye', 'children protection', 'baby', 'bodnojor']
  }
];
