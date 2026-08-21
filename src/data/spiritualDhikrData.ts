export interface SpiritualDhikrItem {
  id: string;
  keyName: string;
  arabicTitle: string;
  bengaliTitle: string;
  category: string;
  fadhilatTitleBn: string;
  fadhilatDescriptionBn: string;
  servantReflectionBn: string; // নগণ্য বান্দার আকুতি ও আত্মশুদ্ধির ভাবনা
  arabicText: string;
  bengaliPronunciation: string;
  bengaliMeaning: string;
  audioUrl: string;
  youtubeUrl?: string;
  recommendedTime: string; // e.g. "সকাল ও সন্ধ্যা", "গভীর রাত", "প্রতি সালাতের পর"
  colorTheme: {
    badgeBg: string;
    badgeText: string;
    border: string;
    glow: string;
  };
}

export const SPIRITUAL_DHIKR_COLLECTION: SpiritualDhikrItem[] = [
  {
    id: 'dhikr-subhanallah',
    keyName: 'subhanallah',
    arabicTitle: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    bengaliTitle: 'সুবহানাল্লাহি ওয়া বিহামদিহি (আল্লাহ অতি পবিত্র ও প্রশংসাময়)',
    category: 'পবিত্রতা ও তাসবীহ',
    fadhilatTitleBn: 'সকল পাপ মোচন ও সমুদ্রের ফেনা সমতুল্য গুনাহ মাফের শ্রেষ্ঠ আমল',
    fadhilatDescriptionBn: 'রাসূলুল্লাহ (সা.) ইরশাদ করেছেন: "যে ব্যক্তি দিনে ১০০ বার \'সুবহানাল্লাহি ওয়া বিহামদিহি\' পাঠ করবে, তার সকল গুনাহ মাফ করে দেওয়া হবে, যদিও তা সমুদ্রের ফেনা সমতুল্য হয়।" (সহীহ বুখারী: ৬৪০৫)',
    servantReflectionBn: 'হে আল্লাহ! আমি আপনার এক নগণ্য ও দুর্বল বান্দা। আপনি সকল দুর্বলতা, অপূর্ণতা ও ত্রুটি থেকে সম্পূর্ণ পবিত্র ও মহান। আমার ক্ষুদ্র জীবনের সব অপূর্ণতায় আপনার পবিত্রতা ও মহিমা ঘোষণা করছি।',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    bengaliPronunciation: 'সুবহা-নাল্লা-হি ওয়া বিহামদিহী, সুবহা-নাল্লা-হিল আযীম',
    bengaliMeaning: 'আল্লাহর পবিত্রতা বর্ণনা করছি তাঁর প্রশংসার সাথে; মহান আল্লাহ অতি পবিত্র।',
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
    recommendedTime: 'প্রতিদিন সকালে ও সন্ধ্যায় ১০০ বার',
    colorTheme: {
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      border: 'border-emerald-500/40',
      glow: 'hover:border-emerald-400'
    }
  },
  {
    id: 'dhikr-alhamdulillah',
    keyName: 'alhamdulillah',
    arabicTitle: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    bengaliTitle: 'আলহামদুলিল্লাহ (সকল প্রশংসা ও পরম শুকরিয়া একমাত্র আল্লাহর)',
    category: 'শুকরিয়া ও কৃতজ্ঞতা',
    fadhilatTitleBn: 'মিজানের পাল্লা পরিপূর্ণকারী ও নেয়ামত বৃদ্ধির সর্বশ্রেষ্ঠ কালেমা',
    fadhilatDescriptionBn: 'রাসূলুল্লাহ (সা.) বলেছেন: "আলহামদুলিল্লাহ মিজানের পাল্লাকে নেকি দিয়ে পূর্ণ করে দেয়।" আল্লাহ তাআলা বলেন: "তোমরা কৃতজ্ঞতা প্রকাশ করলে আমি অবশ্যই তোমাদের নেয়ামত বৃদ্ধি করে দেব।" (সূরা ইব্রাহিম: ৭)',
    servantReflectionBn: 'হে করুণাময় প্রতিপালক! জীবনের প্রতিটি নিঃশ্বাস, প্রতিটি সুস্বাস্থ্য ও প্রতিটি বিপদের হেফাজতের জন্য আপনার দরবারে কোটি কোটি শুকরিয়া। নগণ্য বান্দা হিসেবে আপনার অসীম দয়ার ঋণ আমি কখনো শোধ করতে পারব না—আলহামদুলিল্লাহ্!',
    arabicText: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    bengaliPronunciation: 'আলহামদুলিল্লা-হি হামদান কাসীরান ত্বইয়্যিবাম মুবা-রাকান ফীহি',
    bengaliMeaning: 'সমস্ত প্রশংসা আল্লাহর জন্য—এমন অগণিত, পবিত্র ও বরকতময় প্রশংসা যা তাঁর শান উপযোগী।',
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/55.mp3',
    recommendedTime: 'সুখ ও দুঃখের প্রতিটি মুহূর্তে, সালাত ও খাবারের পর',
    colorTheme: {
      badgeBg: 'bg-teal-500/20',
      badgeText: 'text-teal-300',
      border: 'border-teal-500/40',
      glow: 'hover:border-teal-400'
    }
  },
  {
    id: 'dhikr-allahuakbar',
    keyName: 'allahuakbar',
    arabicTitle: 'اللَّهُ أَكْبَرُ كَبِيرًا',
    bengaliTitle: 'আল্লাহু আকবার (আল্লাহ সর্বশ্রেষ্ঠ ও পরাক্রমশালী মহারাজাধিরাজ)',
    category: 'মহিমা ও তাকবীর',
    fadhilatTitleBn: 'আসমান-জমিনের সকল সৃষ্টির ওপর আল্লাহর শ্রেষ্ঠত্ব ঘোষণা ও অন্তরের অহংকার দূরীকরণ',
    fadhilatDescriptionBn: 'আল্লাহু আকবার তাকবীর আসমান ও জমিনের মধ্যবর্তী স্থানকে নূর ও সওয়াব দিয়ে পূর্ণ করে। এটি অন্তরের সকল দুনিয়াবি ভয় ও অহংকার চূর্ণ করে বান্দাকে আল্লাহর সামনে বিনম্র করে তোলে।',
    servantReflectionBn: 'হে মহান আল্লাহ! আপনার মহত্ত্বের সামনে দুনিয়ার সবকিছু অতি তুচ্ছ ও নগণ্য। আমি এক অসহায় বান্দা আপনার দরবারে সিজদায় মাথা নত করে ঘোষণা করছি—আপনি সর্বশ্রেষ্ঠ, আপনার কোনো শরিক নেই।',
    arabicText: 'اللَّهُ أَكْبَرُ كَبِيرًا ، وَالْحَمْدُ لِلَّهِ كَثِيرًا ، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلاً',
    bengaliPronunciation: 'আল্লা-হু আকবারু কাবীরা, ওয়াল হামদুলিল্লা-হি কাসীরা, ওয়া সুবহা-নাল্লা-হি বুকরাতাও ওয়া আসীলা',
    bengaliMeaning: 'আল্লাহ সর্বশ্রেষ্ঠ অতি মহান; আল্লাহর জন্য অগণিত প্রশংসা এবং সকাল-সন্ধ্যায় আল্লাহরই পবিত্রতা ঘোষণা করছি।',
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/67.mp3',
    recommendedTime: 'প্রতিটি সালাতে, বিপদে এবং গভীর রাতের নির্জনে',
    colorTheme: {
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      border: 'border-amber-500/40',
      glow: 'hover:border-amber-400'
    }
  },
  {
    id: 'dhikr-istighfar',
    keyName: 'istighfar',
    arabicTitle: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    bengaliTitle: 'সাইয়্যিদুল ইস্তিগফার ও তাওবাহ (নগণ্য বান্দার ক্ষমা প্রার্থনা)',
    category: 'তাওবাহ ও মাগফিরাত',
    fadhilatTitleBn: 'জান্নাতের নিশ্চয়তা ও সকল সংকট, দুশ্চিন্তা ও অভাব দূরীকরণের চাবিকাঠি',
    fadhilatDescriptionBn: 'রাসূলুল্লাহ (সা.) বলেছেন: "যে ব্যক্তি সন্ধ্যায় বিশ্বাসের সাথে সাইয়্যিদুল ইস্তিগফার পড়ে সকালের আগে মারা যায়, সে জান্নাতি হবে। আর যে সকালে পড়ে সন্ধ্যার আগে মারা যায়, সেও জান্নাতি হবে।" (বুখারী: ৬৩০৬)',
    servantReflectionBn: 'হে আল্লাহ! আমি আপনার গুনাহগার ও দুর্বল বান্দা। নিজের নফসের ওপর জুলুম করেছি। আপনি ক্ষমা না করলে আমি ধ্বংস হয়ে যাব। আপনার ক্ষমা ছাড়া আমার আর কোনো আশ্রয় নেই—হে পরম ক্ষমাশীল রব!',
    arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ ، خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    bengaliPronunciation: 'আল্লা-হুম্মা আনতা রাব্বী লা ইলা-হা ইল্লা আনতা, খালাক্বতানী ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া’দিকা মাসতাত্বা’তু',
    bengaliMeaning: 'হে আল্লাহ! আপনি আমার রব, আপনি ছাড়া কোনো সত্য উপাস্য নেই। আপনি আমাকে সৃষ্টি করেছেন এবং আমি আপনার এক নগণ্য বান্দা।',
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/113.mp3',
    recommendedTime: 'সকালে ও সন্ধ্যায় এবং যেকোনো ভুল বা গুনাহর পরপরই',
    colorTheme: {
      badgeBg: 'bg-rose-500/20',
      badgeText: 'text-rose-300',
      border: 'border-rose-500/40',
      glow: 'hover:border-rose-400'
    }
  },
  {
    id: 'dhikr-lailahaillallah',
    keyName: 'lailahaillallah',
    arabicTitle: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    bengaliTitle: 'লা ইলাহা ইল্লাল্লাহ (সর্বশ্রেষ্ঠ জিকির ও কালেমায়ে তাওহীদ)',
    category: 'তাওহীদ ও ঈমান',
    fadhilatTitleBn: 'দশটি গোলাম আজাদ, ১০০ নেকি ও সারাদিনের শয়তানি আক্রমণ থেকে দুর্গ লাভ',
    fadhilatDescriptionBn: 'রাসূলুল্লাহ (সা.) বলেছেন: "সর্বশ্রেষ্ঠ জিকির হলো লা ইলাহা ইল্লাল্লাহ।" দিনে ১০০ বার পাঠকারীকে ১০টি দাস মুক্ত করার সওয়াব দেওয়া হয় এবং শয়তানের অনিষ্ট থেকে নিরাপত্তা মেলে। (বুখারী: ৩২৯৩)',
    servantReflectionBn: 'হে আল্লাহ! অন্তরে আর কারো দাসত্ব নয়, কেবল আপনারই তাওহীদ ও আনুগত্য ধারণ করে জীবন পরিচালিত করতে চাই। আমার শেষ নিঃশ্বাসে যেন এই কালেমা জারি থাকে।',
    arabicText: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    bengaliPronunciation: 'লা ইলা-হা ইল্লাল্লা-হু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ওয়া হুওয়া আলা কুল্লি শাইয়িন ক্বাদীর',
    bengaliMeaning: 'আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই, তিনি একক, তাঁর কোনো অংশীদার নেই। রাজত্ব ও প্রশংসা কেবল তাঁরই, তিনি সবকিছুর ওপর ক্ষমতাবান।',
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/112.mp3',
    recommendedTime: 'সকালে ও সন্ধ্যায় ১০০ বার ও দিনের অবসরে',
    colorTheme: {
      badgeBg: 'bg-indigo-500/20',
      badgeText: 'text-indigo-300',
      border: 'border-indigo-500/40',
      glow: 'hover:border-indigo-400'
    }
  },
  {
    id: 'dhikr-durood',
    keyName: 'durood',
    arabicTitle: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    bengaliTitle: 'দরূদে ইবরাহীম (রাসূলুল্লাহ সা.-এর ওপর রহমত ও শান্তির দোয়া)',
    category: 'দরূদ ও ভালোবাসা',
    fadhilatTitleBn: 'প্রতি দরূদে ১০টি রহমত, ১০টি গুনাহ মাফ ও ১০টি মর্যাদা বৃদ্ধির সুসংবাদ',
    fadhilatDescriptionBn: 'রাসূলুল্লাহ (সা.) বলেছেন: "যে ব্যক্তি আমার ওপর একবার দরূদ পাঠ করে, আল্লাহ তাআলা তার ওপর দশটি রহমত বর্ষণ করেন, দশটি গুনাহ ক্ষমা করেন এবং তার মর্যাদা দশ গুণ বাড়িয়ে দেন।" (নাসায়ী: ১২৯৭)',
    servantReflectionBn: 'হে রব! আপনার প্রিয় হাবীব বিশ্বনবী হযরত মুহাম্মাদ (সা.)-এর উম্মত হিসেবে তাঁর প্রতি অসীম ভালোবাসা ও শ্রদ্ধা জানিয়ে দরূদ পেশ করছি। কিয়ামতের কঠিন দিনে তাঁর শাফায়াত নসিব করুন।',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    bengaliPronunciation: 'আল্লা-হুম্মা সাল্লি আলা মুহাম্মাদিওঁ ওয়া আলা আ-লি মুহাম্মাদ, কামা সাল্লাইতা আলা ইবরাহীমা ওয়া আলা আ-লি ইবরাহীম, ইন্নাকা হামীদুম মাজীদ',
    bengaliMeaning: 'হে আল্লাহ! মুহাম্মাদ (সা.) ও তাঁর পরিবারের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহীম (আ.) ও তাঁর পরিবারের ওপর করেছিলেন। নিশ্চয়ই আপনি প্রশংসিত ও মহিমান্বিত।',
    audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/33.mp3',
    recommendedTime: 'জুমার দিন, সালাতের তাশাহহুদে ও সর্বাবস্থায়',
    colorTheme: {
      badgeBg: 'bg-purple-500/20',
      badgeText: 'text-purple-300',
      border: 'border-purple-500/40',
      glow: 'hover:border-purple-400'
    }
  }
];

export interface SuggestionCategoryItem {
  id: string;
  categoryName: string;
  categoryTagBn: string;
  icon: string;
  descriptionBn: string;
  ideasToIncludeBn: string[];
  sampleItems: {
    title: string;
    scholar: string;
    suggestedStartTime: string;
    suggestedEndTime: string;
    audioUrl: string;
    youtubeUrl?: string;
    fadhilatShortBn: string;
    arabicSample?: string;
    bengaliMeaning?: string;
  }[];
}

export const SUGGESTION_CATEGORIES_CATALOG: SuggestionCategoryItem[] = [
  {
    id: 'sug-quran-recitation',
    categoryName: 'Quran Recitation',
    categoryTagBn: 'কুরআন তিলাওয়াত ও রুকাইয়া',
    icon: 'BookOpen',
    descriptionBn: 'বিশ্ববিখ্যাত ক্বারীগণের সুমধুর তিলাওয়াত যা অন্তরে প্রশান্তি আনে এবং ঘরকে শয়তানি প্রভাব থেকে রক্ষা করে।',
    ideasToIncludeBn: [
      'সূরা আল-বাকারা (বদনজর ও জিনের প্রভাব থেকে সুরক্ষা)',
      'সূরা আর-রহমান (মানসিক প্রশান্তি ও শুকরিয়া)',
      'সূরা আল-ওয়াকিয়াহ (রিজিকে বরকত ও অভাব দূরীকরণ)',
      'সূরা আল-মুলক (কবরের আজাব থেকে মুক্তি)',
      'সূরা আল-কাহফ (দাজ্জালের ফিতনা থেকে নিরাপত্তা - বিশেষত জুমার দিন)'
    ],
    sampleItems: [
      {
        title: 'সূরা আল-বাকারা সম্পূর্ণ তিলাওয়াত - শায়েখ মিশারী রশিদ',
        scholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
        suggestedStartTime: '00:00',
        suggestedEndTime: '03:30',
        audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3',
        fadhilatShortBn: 'যে ঘরে সূরা বাকারা তিলাওয়াত করা হয়, সেখান থেকে শয়তান পলায়ন করে।',
        arabicSample: 'الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        bengaliMeaning: 'আলিফ-লাম-মীম। এই সেই কিতাব, যাতে কোনো সন্দেহ নেই; মুত্তাকীদের জন্য পথপ্রদর্শক।'
      },
      {
        title: 'সূরা আর-রহমান ও সূরা ইয়াসীন - ক্বারী আব্দুল বাসিত',
        scholar: 'ক্বারী আব্দুল বাসিত আব্দুস সামাদ',
        suggestedStartTime: '07:00',
        suggestedEndTime: '08:30',
        audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/55.mp3',
        fadhilatShortBn: 'আল্লাহর অপার নিয়ামতের স্মরণ ও অন্তরের গভীর তৃপ্তি লাভ হয়।',
        arabicSample: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
        bengaliMeaning: 'অতএব তোমরা তোমাদের রবের কোন্ কোন্ অনুগ্রহকে অস্বীকার করবে?'
      },
      {
        title: 'সূরা আল-ওয়াকিয়াহ (রিজিকের বরকত) - শায়েখ সুদাইস',
        scholar: 'শায়েখ আবদুর রহমান আস-সুদাইস',
        suggestedStartTime: '18:30',
        suggestedEndTime: '19:30',
        audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/56.mp3',
        fadhilatShortBn: 'প্রতি রাতে সূরা ওয়াকিয়াহ পাঠ বা শ্রবণ করলে অভাব-অনটন স্পর্শ করবে না।',
        arabicSample: 'إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ',
        bengaliMeaning: 'যখন মহাঘটনা (কিয়ামাত) সংঘটিত হবে, তখন তার সংঘটনকে মিথ্যা বলার কেউ থাকবে না।'
      }
    ]
  },
  {
    id: 'sug-tahajjud-night',
    categoryName: 'Dua & Azkar',
    categoryTagBn: 'তাহাজ্জুদ ও গভীর রাতের নির্জনতা',
    icon: 'Moon',
    descriptionBn: 'রাতের শেষ তৃতীয়াংশে যখন আল্লাহ প্রথম আসমানে নেমে বান্দাদের ক্ষমা ও দোয়ার ডাকে সাড়া দেন।',
    ideasToIncludeBn: [
      'তাহাজ্জুদের বিশেষ মোনাজাত ও নগণ্য বান্দার কান্নাকাটি',
      'সূরা আস-সাজদাহ ও আল-ইনসান তিলাওয়াত',
      'সাইয়্যিদুল ইস্তিগফার ও ১০০ বার ক্ষমা প্রার্থনা',
      'আল্লাহর ৯৯ গুণবাচক নাম জিকির'
    ],
    sampleItems: [
      {
        title: 'তাহাজ্জুদ পূর্ব গভীর রাতের রোনাজারি ও তাওবাহ',
        scholar: 'শায়েখ আহমদ তৌফিক',
        suggestedStartTime: '03:00',
        suggestedEndTime: '04:30',
        audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/32.mp3',
        fadhilatShortBn: 'আল্লাহ শেষ রাতে বলেন: কে আমাকে ডাকবে আমি তার ডাকে সাড়া দেব? কে ক্ষমা চাইবে আমি ক্ষমা করব?',
        arabicSample: 'تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ يَدْعُونَ رَبَّهُمْ خَوْفًا وَطَمَعًا',
        bengaliMeaning: 'তাদের পার্শ্বদেশ বিছানা থেকে আলাদা থাকে, তারা ভয় ও আশার সাথে তাদের রবকে ডাকে।'
      }
    ]
  },
  {
    id: 'sug-ruqyah-shifa',
    categoryName: 'Ruqyah',
    categoryTagBn: 'রুকাইয়া শারইয়্যাহ ও রোগমুক্তি',
    icon: 'ShieldCheck',
    descriptionBn: 'কুরআনী আয়াত ও সহীহ দোয়ার মাধ্যমে শারীরিক, মানসিক ও আধ্যাত্মিক রোগের চিকিৎসা।',
    ideasToIncludeBn: [
      'রুকাইয়া শারইয়্যাহ পূর্ণাঙ্গ অডিও (আয়াতুল কুরসী ও ৩ কুল)',
      'কুরআনের ৬টি শেফার আয়াত অর্থসহ তিলাওয়াত',
      'মানসিক বিষণ্ণতা ও ওয়াসওয়াসা দূরীকরণের দোয়া'
    ],
    sampleItems: [
      {
        title: 'রুকাইয়া শারইয়্যাহ - সুরক্ষার মহৌষধ (মিশারী রশিদ)',
        scholar: 'শায়েখ মিশারী রশিদ আল-আফاسى',
        suggestedStartTime: '10:00',
        suggestedEndTime: '11:30',
        audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/114.mp3',
        fadhilatShortBn: 'সূরা ফালাক্ব ও নাস মানুষের ক্ষতি, হিংসা ও কালো জাদুর প্রভাব বিনাশ করে।',
        arabicSample: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ',
        bengaliMeaning: 'বলুন, আমি আশ্রয় প্রার্থনা করছি উষার রবের, তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে।'
      }
    ]
  },
  {
    id: 'sug-hadith-tafsir',
    categoryName: 'Sahih Hadith',
    categoryTagBn: 'সহীহ হাদিস ও জীবনভিত্তিক তাফসীর',
    icon: 'Sparkles',
    descriptionBn: 'বুখারী, মুসলিম ও রিয়াদুস সালেহীনের বিশুদ্ধ হাদিস এবং বাংলা জীবনমুখী উপদেশ।',
    ideasToIncludeBn: [
      'সহীহ বুখারীর ঈমান ও সালাত অধ্যায় পাঠ',
      'পারিবারিক সুখ, পিতা-মাতার সেবা ও আখলাক শিক্ষা',
      'সিরাতুন্নবী (সা.) ও সাহাবায়ে কিরামের বীরত্বপূর্ণ জীবন'
    ],
    sampleItems: [
      {
        title: 'সহীহ বুখারী ও সকালের মাসনুন শিক্ষা',
        scholar: 'ড. আবু বকর মুহাম্মাদ জাকারিয়া',
        suggestedStartTime: '06:00',
        suggestedEndTime: '07:30',
        audioUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/49.mp3',
        fadhilatShortBn: 'দ্বীনি ইলম অর্জন করা প্রত্যেক মুসলিম নর-নারীর ওপর ফরজ।',
        arabicSample: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
        bengaliMeaning: 'যে ব্যক্তি জ্ঞানার্জনের উদ্দেশ্যে কোনো পথ অবলম্বন করে, আল্লাহ তার জান্নাতের পথ সহজ করে দেন।'
      }
    ]
  },
  {
    id: 'sug-live-makkah-madinah',
    categoryName: 'Islamic Lecture',
    categoryTagBn: 'মক্কা ও মদিনা ২৪/৭ লাইভ স্ট্রিমিং',
    icon: 'Radio',
    descriptionBn: 'পবিত্র কাবা শরীফ ও মসজিদে নববীর সার্বক্ষণিক লাইভ স্ট্রিমিং ও উচ্চমানের অডিও সম্প্রচার।',
    ideasToIncludeBn: [
      'মক্কা আল-মুকাররমা লাইভ তাওয়াফ ও সালাত',
      'মদিনা আল-মুনাওয়ারা লাইভ সম্প্রচার ও রওজা মোবারক',
      'লাইভ তারাবীহ ও জুমা খুতবা'
    ],
    sampleItems: [
      {
        title: 'মক্কা আল-মুকাররমা লাইভ এইচডি সম্প্রচার (ইউটিউব লাইভ)',
        scholar: 'মসজিদুল হারাম ইমামগণ',
        suggestedStartTime: '12:00',
        suggestedEndTime: '15:00',
        audioUrl: 'https://www.youtube.com/watch?v=17X21gY8s48',
        youtubeUrl: 'https://www.youtube.com/watch?v=17X21gY8s48',
        fadhilatShortBn: 'মসজিদুল হারামে এক রাকাত সালাত এক লক্ষ রাকাত সালাতের সমান সওয়াব।'
      },
      {
        title: 'মদিনা আল-মুনাওয়ারা লাইভ এইচডি সম্প্রচার (ইউটিউব লাইভ)',
        scholar: 'মসজিদে নববী ইমামগণ',
        suggestedStartTime: '15:00',
        suggestedEndTime: '18:00',
        audioUrl: 'https://www.youtube.com/watch?v=1O9J030Rsm0',
        youtubeUrl: 'https://www.youtube.com/watch?v=1O9J030Rsm0',
        fadhilatShortBn: 'মসজিদে নববীতে এক রাকাত সালাত এক হাজার রাকাত সালাতের সমান সওয়াব।'
      }
    ]
  }
];
