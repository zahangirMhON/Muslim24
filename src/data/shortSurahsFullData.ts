export interface SurahVerseItem {
  numberInSurah: number;
  arabicText: string;
  transliterationBn: string;
  translationBn: string;
  audioAyahUrl?: string;
}

export interface FullSurahDetail {
  number: number;
  nameAr: string;
  nameBn: string;
  nameEn: string;
  meaningBn: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationTypeBn: string;
  audioUrl: string;
  fajilatBn?: string;
  verses: SurahVerseItem[];
}

export const SHORT_AND_ESSENTIAL_SURAHS: FullSurahDetail[] = [
  {
    number: 1,
    nameAr: 'الفاتحة',
    nameBn: 'সূরা আল-ফাতিহা',
    nameEn: 'Al-Fatiha',
    meaningBn: 'সূচনা / ভূমিকা (উম্মুল কুরআন)',
    numberOfAyahs: 7,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
    fajilatBn: 'কুরআনের সর্বশ্রেষ্ঠ সূরা। এটি ছাড়া কোনো সালাত শুদ্ধ হয় না। এটি সব রোগের মহৌষধ (শিফা)।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliterationBn: 'বিসমিল্লাহির রাহমানির রাহিম',
        translationBn: 'পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে (শুরু করছি)।',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
      },
      {
        numberInSurah: 2,
        arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliterationBn: 'আলহামদু লিল্লাহি রাব্বিল আলামিন',
        translationBn: 'সকল প্রশংসা বিশ্বজগতের প্রতিপালক আল্লাহর জন্য।',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3'
      },
      {
        numberInSurah: 3,
        arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliterationBn: 'আর-রাহমানির রাহিম',
        translationBn: 'যিনি পরম দয়ালু ও পরম করুণাময়।',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3'
      },
      {
        numberInSurah: 4,
        arabicText: 'مَالِكِ يَوْمِ الدِّينِ',
        transliterationBn: 'মালিকি ইয়াওমিদ্দীন',
        translationBn: 'যিনি বিচার দিবসের একমাত্র মালিক ও অধিপতি।',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3'
      },
      {
        numberInSurah: 5,
        arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliterationBn: 'ইইয়্যাকা নাবুদু ওয়া ইইয়্যাকা নাস্তায়ীন',
        translationBn: 'আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই নিকট সাহায্য প্রার্থনা করি।',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3'
      },
      {
        numberInSurah: 6,
        arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliterationBn: 'ইহদিনাস সিরাতাল মুস্তাক্বীম',
        translationBn: 'আমাদের সরল-সঠিক পথ প্রদর্শন করুন।',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3'
      },
      {
        numberInSurah: 7,
        arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliterationBn: 'সিরাতাল্লাযীনা আনআমতা আলাইহিম, গাইরিল মাগদূবি আলাইহিম ওয়ালাদ-দোয়াল্লীন।',
        translationBn: 'তাদের পথ, যাদের আপনি অনুগ্রহ করেছেন; তাদের পথ নয় যারা আপনার ক্রোধে নিপতিত এবং যারা পথভ্রষ্ট হয়েছে। (আমিন)',
        audioAyahUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3'
      }
    ]
  },
  {
    number: 93,
    nameAr: 'الضحى',
    nameBn: 'সূরা আদ্-দুহা',
    nameEn: 'Ad-Duha',
    meaningBn: 'পূর্বাহ্ন / সকালের উজ্জ্বল রোদ',
    numberOfAyahs: 11,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/093.mp3',
    fajilatBn: 'হতাশা ও দুশ্চিন্তা দূর করার অনুপম সূরা। আল্লাহ তাঁর বান্দাকে কখনোই পরিত্যাগ করেন না।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'وَالضُّحَىٰ',
        transliterationBn: 'ওয়াদ-দুহা',
        translationBn: 'শপথ উজ্জ্বল সকালের (পূর্বাহ্নের রোদের),'
      },
      {
        numberInSurah: 2,
        arabicText: 'وَاللَّيْلِ إِذَا سَجَىٰ',
        transliterationBn: 'ওয়াল্লাইলি ইযা সাজা',
        translationBn: 'এবং শপথ রাতের যখন তা নিঝুম ও নিস্তব্ধ হয়,'
      },
      {
        numberInSurah: 3,
        arabicText: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
        transliterationBn: 'মা ওয়াদ্দাআকা রাব্বুকা ওয়া মা ক্বালা',
        translationBn: 'আপনার পালনকর্তা আপনাকে কখনো ত্যাগ করেননি এবং আপনার ওপর অসন্তুষ্ট হননি।'
      },
      {
        numberInSurah: 4,
        arabicText: 'وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ',
        transliterationBn: 'ওয়া লাল আখিরাতু খাইরুল লাকা মিনাল উলা',
        translationBn: 'আর নিঃসন্দেহে আপনার জন্য পরকাল ইহকাল অপেক্ষা অধিকতর শ্রেয়।'
      },
      {
        numberInSurah: 5,
        arabicText: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
        transliterationBn: 'ওয়া লা সাওফা ইউ’তীক্বা রাব্বুকা ফাতারদা',
        translationBn: 'আর অচিরেই আপনার পালনকর্তা আপনাকে এত প্রাচুর্য দান করবেন যে আপনি সন্তুষ্ট হয়ে যাবেন।'
      },
      {
        numberInSurah: 6,
        arabicText: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ',
        transliterationBn: 'আলাম ইয়াজিদকা ইয়াতীমান ফাআওয়া',
        translationBn: 'তিনি কি আপনাকে পিতৃহীন এতিম অবস্থায় পাননি, অতঃপর আশ্রয় দান করেননি?'
      },
      {
        numberInSurah: 7,
        arabicText: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
        transliterationBn: 'ওয়া ওয়াজাদাকা দোয়াল্লান ফাহাদা',
        translationBn: 'এবং তিনি আপনাকে পথ না-জানা অবস্থায় পেয়ে সঠিক পথপ্রদর্শন করেছেন।'
      },
      {
        numberInSurah: 8,
        arabicText: 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ',
        transliterationBn: 'ওয়া ওয়াজাদাকা আইলান ফাআগনা',
        translationBn: 'এবং তিনি আপনাকে নিঃস্ব অবস্থায় পেয়ে অভাবমুক্ত ও ধনী করেছেন।'
      },
      {
        numberInSurah: 9,
        arabicText: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ',
        transliterationBn: 'ফা আম্মাল ইয়াতীমা ফালা তাক্বহার',
        translationBn: 'অতএব আপনি এতিমের প্রতি কখনো কঠোর আচরণ করবেন না,'
      },
      {
        numberInSurah: 10,
        arabicText: 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ',
        transliterationBn: 'ওয়া আম্মাস সা-ইলা ফালা তানহার',
        translationBn: 'এবং যাচঞাকারী বা সাহায্যপ্রার্থীকে ধমক দেবেন না,'
      },
      {
        numberInSurah: 11,
        arabicText: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ',
        transliterationBn: 'ওয়া আম্মা বিনি’মাতি রাব্বিকা ফাহাদ্দিছ',
        translationBn: 'আর আপনার প্রতিপালকের অনুগ্রহ ও নিয়ামতসমূহ প্রকাশ ও বর্ণনা করুন।'
      }
    ]
  },
  {
    number: 94,
    nameAr: 'الشرح',
    nameBn: 'সূরা আল-ইনশিরাহ (আশ-শারহ)',
    nameEn: 'Ash-Sharh',
    meaningBn: 'বক্ষ সম্প্রসারণ / প্রশান্তি লাভ',
    numberOfAyahs: 8,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/094.mp3',
    fajilatBn: 'হৃদয়ের সংকীর্ণতা দূর করে এবং নিশ্চয়ই কষ্টের সাথেই স্বস্তি আছে এই মহান আশাবাদ শিক্ষা দেয়।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
        transliterationBn: 'আলাম নাশরাহ লাকা সাদরাক',
        translationBn: 'আমরা কি আপনার বক্ষ আপনার জন্য উন্মুক্ত ও প্রশস্ত করে দেইনি?'
      },
      {
        numberInSurah: 2,
        arabicText: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
        transliterationBn: 'ওয়া ওয়াদা’না আনকা উইযরাক',
        translationBn: 'এবং আমরা আপনার ওপর থেকে লাঘব করেছি আপনার ভারী বোঝা,'
      },
      {
        numberInSurah: 3,
        arabicText: 'الَّذِي أَنقَضَ ظَهْرَكَ',
        transliterationBn: 'আল্লাযী আনক্বাদা জাহরাক',
        translationBn: 'যা আপনার মেরুদণ্ডকে নুইয়ে দিচ্ছিল।'
      },
      {
        numberInSurah: 4,
        arabicText: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
        transliterationBn: 'ওয়া রাফা’না লাকা যিকরাক',
        translationBn: 'এবং আমরা আপনার মর্যাদাকে সুউচ্চ করেছি।'
      },
      {
        numberInSurah: 5,
        arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliterationBn: 'ফাইন্না মাআল উসরি ইউসরা',
        translationBn: 'অতএব নিশ্চয়ই কষ্টের সাথেই রয়েছে স্বস্তি ও সহজতা।'
      },
      {
        numberInSurah: 6,
        arabicText: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliterationBn: 'ইন্না মাআল উসরি ইউসরা',
        translationBn: 'নিঃসন্দেহে কষ্টের সাথেই রয়েছে স্বস্তি ও মুক্তি।'
      },
      {
        numberInSurah: 7,
        arabicText: 'فَإِذَا فَرَغْتَ فَانصَبْ',
        transliterationBn: 'ফা ইযা ফারাগতা ফানসাব',
        translationBn: 'অতএব যখনই আপনি অবসর পান, তখনই কঠোর সাধনায় মগ্ন হোন (ইবাদতে ব্রতী হোন),'
      },
      {
        numberInSurah: 8,
        arabicText: 'وَإِلَىٰ رَبِّكَ فَارْغَب',
        transliterationBn: 'ওয়া ইলা রাব্বিকা ফারগাব',
        translationBn: 'এবং একাগ্রচিত্তে আপনার প্রতিপালকের প্রতি মনোনিবেশ করুন।'
      }
    ]
  },
  {
    number: 95,
    nameAr: 'التين',
    nameBn: 'সূরা আত-তীন',
    nameEn: 'At-Tin',
    meaningBn: 'ডুমুর / আঞ্জির ফল',
    numberOfAyahs: 8,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/095.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'وَالتِّينِ وَالزَّيْتُونِ',
        transliterationBn: 'ওয়াততীনি ওয়ায যাইতূন',
        translationBn: 'শপথ তীন (ডুমুর) ও যাইতুন (জলপাই) এর,'
      },
      {
        numberInSurah: 2,
        arabicText: 'وَطُورِ سِينِينَ',
        transliterationBn: 'ওয়া তূরি সীনীন',
        translationBn: 'এবং সীনাই পর্বতের,'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَهَٰذَا الْبَلَدِ الْأَمِينِ',
        transliterationBn: 'ওয়া হাযাল বালাদিল আমীন',
        translationBn: 'এবং এই নিরাপদ নগরীর (মক্কা নগরীর),'
      },
      {
        numberInSurah: 4,
        arabicText: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ',
        transliterationBn: 'লাক্বদ খালাক্বনাল ইনসানা ফী আহসানি তাক্বওয়ীম',
        translationBn: 'নিশ্চয়ই আমরা মানুষকে সৃষ্টি করেছি সর্বোত্তম ও সুন্দরতম গঠনে।'
      },
      {
        numberInSurah: 5,
        arabicText: 'ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ',
        transliterationBn: 'ছুম্মা রাদাদনাহু আসফালা সাফিলীন',
        translationBn: 'অতঃপর আমরা তাকে নামিয়ে দিয়েছি হীনতমদের সর্বনিম্ন স্তরে;'
      },
      {
        numberInSurah: 6,
        arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ',
        transliterationBn: 'ইল্লাল্লাযীনা আমানূ ওয়া আমিলুস সালিহাতি ফালাহুম আজরুন গাইরু মামনূন',
        translationBn: 'কিন্তু তারা নয়, যারা ঈমান এনেছে ও সৎকাজ করেছে—তাদের জন্য রয়েছে নিরবচ্ছিন্ন ও অফুরন্ত পুরস্কার।'
      },
      {
        numberInSurah: 7,
        arabicText: 'فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ',
        transliterationBn: 'ফামা ইউকাযযিবুকা বা’দু বিদ্দীন',
        translationBn: 'অতএব এর পর কিসে তোমাকে কর্মফল ও বিচার দিবস সম্পর্কে অবিশ্বাসী করে?'
      },
      {
        numberInSurah: 8,
        arabicText: 'أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ',
        transliterationBn: 'আলাইসাল্লাহু বিআহকামিল হাকিমীন',
        translationBn: 'আল্লাহ কি সকল বিচারকের শ্রেষ্ঠ ও পরম বিচারক নন?'
      }
    ]
  },
  {
    number: 97,
    nameAr: 'القدر',
    nameBn: 'সূরা আল-কদর',
    nameEn: 'Al-Qadr',
    meaningBn: 'মহিমান্বিত রাত / ভাগ্য নির্ধারণের রজনী',
    numberOfAyahs: 5,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/097.mp3',
    fajilatBn: 'লাইলাতুল কদরের মর্যাদা হাজার মাসের ইবাদতের চেয়েও শ্রেষ্ঠ।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
        transliterationBn: 'ইন্না আনযালনাহু ফী লাইলাতিল ক্বদর',
        translationBn: 'নিশ্চয়ই আমি এই কুরআন অবতীর্ণ করেছি মহিমান্বিত লাইলাতুল কদরে।'
      },
      {
        numberInSurah: 2,
        arabicText: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
        transliterationBn: 'ওয়া মা আদরাকা মা লাইলাতুল ক্বদর',
        translationBn: 'আর আপনি কি জানেন মহিমান্বিত কদরের রজনী কী?'
      },
      {
        numberInSurah: 3,
        arabicText: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
        transliterationBn: 'লাইলাতুল ক্বদরি খাইরুম মিন আলফি শাহর',
        translationBn: 'লাইলাতুল কদর হলো এক হাজার মাস অপেক্ষা শ্রেষ্ঠ ও কল্যাণময়।'
      },
      {
        numberInSurah: 4,
        arabicText: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
        transliterationBn: 'তানাযযালুল মালাইকাতু ওয়ার রূহু ফীহা বিইযনি রাব্বিহিম মিন কুল্লি আমর',
        translationBn: 'সে রাতে ফেরেশতাগণ এবং জিবরাঈল (আ.) তাদের প্রতিপালকের অনুমতিক্রমে প্রত্যেক কল্যাণকর নির্দেশ নিয়ে অবতীর্ণ হন।'
      },
      {
        numberInSurah: 5,
        arabicText: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
        transliterationBn: 'সালামুন হিয়া হাত্তা মাতলায়িল ফাজর',
        translationBn: 'এই শান্তিময় রজনী অব্যাহত থাকে ফজর উদয় হওয়া পর্যন্ত।'
      }
    ]
  },
  {
    number: 99,
    nameAr: 'الزلزلة',
    nameBn: 'সূরা আল-যিলযাল',
    nameEn: 'Az-Zalzalah',
    meaningBn: 'ভূকম্পন / প্রলয়ঙ্করী কম্পন',
    numberOfAyahs: 8,
    revelationType: 'Medinan',
    revelationTypeBn: 'মাদানী',
    audioUrl: 'https://server8.mp3quran.net/afs/099.mp3',
    fajilatBn: 'হাদিসে একে অর্ধ-কুরআনের সমতুল্য মর্যাদা দেওয়া হয়েছে (তিরমিযী)।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا',
        transliterationBn: 'ইযা যুলযিলাতিল আরদু যিলযালাহা',
        translationBn: 'যখন পৃথিবী তার চূড়ান্ত প্রকম্পনে প্রকম্পিত হবে,'
      },
      {
        numberInSurah: 2,
        arabicText: 'وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا',
        transliterationBn: 'ওয়া আখরাজাতিল আরদু আছক্বালাহা',
        translationBn: 'এবং পৃথিবী তার ভেতরস্থ ভারী বোঝা (মৃতদেহ ও সম্পদ) বের করে ফেলবে,'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَقَالَ الْإِنسَانُ مَا لَهَا',
        transliterationBn: 'ওয়া ক্বালাল ইনসানু মা লাহা',
        translationBn: 'আর মানুষ বলবে, এর কী হলো?'
      },
      {
        numberInSurah: 4,
        arabicText: 'يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا',
        transliterationBn: 'ইয়াওমাইযিন তুহাদ্দিছু আখবারাহা',
        translationBn: 'সেদিন পৃথিবী তার যাবতীয় বৃত্তান্ত ও ঘটনাবলী বর্ণনা করবে,'
      },
      {
        numberInSurah: 5,
        arabicText: 'بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا',
        transliterationBn: 'বিআন্না রাব্বাকা আওহা লাহা',
        translationBn: 'কারণ আপনার প্রতিপালক তাকে এমন আদেশ করেছেন।'
      },
      {
        numberInSurah: 6,
        arabicText: 'يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ',
        transliterationBn: 'ইয়াওমাইযিয় ইয়াসদুরুন নাসু আশতাতাল লিইউরাও আ’মালাহুম',
        translationBn: 'সেদিন মানুষ বিভিন্ন দলে বিভক্ত হয়ে বের হবে, যেন তাদেরকে তাদের কৃতকর্ম দেখানো যায়।'
      },
      {
        numberInSurah: 7,
        arabicText: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ',
        transliterationBn: 'ফামাইঁ ইয়া’মাল মিছক্বালা যাররাতিন খাইরাইঁ যারাহ',
        translationBn: 'অতএব যে ব্যক্তি অণু পরিমাণ ভালো কাজ করবে, সে তা দেখতে পাবে।'
      },
      {
        numberInSurah: 8,
        arabicText: 'وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
        transliterationBn: 'ওয়া মাইঁ ইয়া’মাল মিছক্বালা যাররাতিন শাররাইঁ যারাহ',
        translationBn: 'আর যে ব্যক্তি অণু পরিমাণ মন্দ কাজ করবে, সেও তা দেখতে পাবে।'
      }
    ]
  },
  {
    number: 100,
    nameAr: 'العاديات',
    nameBn: 'সূরা আল-আদিয়াত',
    nameEn: 'Al-Adiyat',
    meaningBn: 'অভিযানকারী দ্রুতগামী অশ্বসমূহ',
    numberOfAyahs: 11,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/100.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'وَالْعَادِيَاتِ ضَبْحًا',
        transliterationBn: 'ওয়াল আ-দিয়া-তি দাবহা',
        translationBn: 'শপথ উর্ধ্বশ্বাসে ধাবমান দ্রুতগামী অশ্বসমূহের,'
      },
      {
        numberInSurah: 2,
        arabicText: 'فَالْمُورِيَاتِ قَدْحًا',
        transliterationBn: 'ফাল মূরিয়া-তি ক্বদহা',
        translationBn: 'অতঃপর খুরের আঘাতে অগ্নিস্ফুলিঙ্গ বিচ্ছুরণকারীদের,'
      },
      {
        numberInSurah: 3,
        arabicText: 'فَالْمُغِيرَاتِ صُبْحًا',
        transliterationBn: 'ফাল মুগীরা-তি সুবহা',
        translationBn: 'অতঃপর প্রভাতকালে অতর্কিতে আক্রমণকারীদের,'
      },
      {
        numberInSurah: 4,
        arabicText: 'فَأَثَرْنَ بِهِ نَقْعًا',
        transliterationBn: 'ফাআছারনা বিহী নাক্বআ',
        translationBn: 'অতঃপর যারা সে সময়ে ধূলি রাশি উৎক্ষেপণ করে,'
      },
      {
        numberInSurah: 5,
        arabicText: 'فَوَسَطْنَ بِهِ جَمْعًا',
        transliterationBn: 'ফা ওয়াসাতনা বিহী জামআ',
        translationBn: 'অতঃপর যারা শত্রু দলের ভেতরে সজোরে প্রবেশ করে—'
      },
      {
        numberInSurah: 6,
        arabicText: 'إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ',
        transliterationBn: 'ইন্নাল ইনসানা লিরাব্বিহী লাকানূদ',
        translationBn: 'নিশ্চয়ই মানুষ তার প্রতিপালকের প্রতি বড়ই অকৃতজ্ঞ।'
      },
      {
        numberInSurah: 7,
        arabicText: 'وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ',
        transliterationBn: 'ওয়া ইন্নাহূ আলা যালিকা লাশাহীদ',
        translationBn: 'এবং নিশ্চয়ই সে নিজেই এ বিষয়ে প্রত্যক্ষ সাক্ষী।'
      },
      {
        numberInSurah: 8,
        arabicText: 'وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ',
        transliterationBn: 'ওয়া ইন্নাহূ লিহুব্বিল খাইরি লাশাদীদ',
        translationBn: 'এবং নিঃসন্দেহে সে ধন-সম্পদের মোহে অত্যন্ত অন্ধ।'
      },
      {
        numberInSurah: 9,
        arabicText: 'أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ',
        transliterationBn: 'আফালা ইয়া’লামু ইযা বু’ছিরা মা ফিল ক্বুবূর',
        translationBn: 'তবে কি সে জানে না, যখন কবরে যা কিছু আছে তা উত্থিত করা হবে?'
      },
      {
        numberInSurah: 10,
        arabicText: 'وَحُصِّلَ مَا فِي الصُّدُورِ',
        transliterationBn: 'ওয়া হুসসিলা মা ফিস সুদূর',
        translationBn: 'এবং অন্তরে যা কিছু লুকিয়ে ছিল তা প্রকাশ করা হবে?'
      },
      {
        numberInSurah: 11,
        arabicText: 'إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ',
        transliterationBn: 'ইন্না রাব্বাহুম বিহিম ইয়াওমাইযিল লাখাবীর',
        translationBn: 'নিশ্চয়ই তাদের প্রতিপালক সেদিন তাদের সকল কর্ম সম্পর্কে সম্যক অবহিত।'
      }
    ]
  },
  {
    number: 101,
    nameAr: 'القارعة',
    nameBn: 'সূরা আল-কারিআহ',
    nameEn: 'Al-Qariah',
    meaningBn: 'মহাবিপদ / আঘাতকারী কিয়ামত',
    numberOfAyahs: 11,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/101.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'الْقَارِعَةُ',
        transliterationBn: 'আল-ক্বারিআহ',
        translationBn: 'মহা বিপর্যয়কারী আঘাত (কিয়ামত)!'
      },
      {
        numberInSurah: 2,
        arabicText: 'مَا الْقَارِعَةُ',
        transliterationBn: 'মাল ক্বারিআহ',
        translationBn: 'কী সেই মহাপ্রলয়ংকারী আঘাত?'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَمَا أَدْرَاكَ مَا الْقَارِعَةُ',
        transliterationBn: 'ওয়া মা আদরাকা মাল ক্বারিআহ',
        translationBn: 'আর আপনি কি জানেন সেই মহাপ্রলয় কী?'
      },
      {
        numberInSurah: 4,
        arabicText: 'يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ',
        transliterationBn: 'ইয়াওমা ইয়াকূনুন নাসু কাল ফারাশিল মাবছূছ',
        translationBn: 'যেদিন মানুষ হবে ইতস্তত বিক্ষিপ্ত পতঙ্গের মতো,'
      },
      {
        numberInSurah: 5,
        arabicText: 'وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ',
        transliterationBn: 'ওয়া তাকূনুল জিবালু কাল ইহনিল মানফূশ',
        translationBn: 'এবং পাহাড়সমূহ হবে ধুনিত রঙিন তুলার মতো।'
      },
      {
        numberInSurah: 6,
        arabicText: 'فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ',
        transliterationBn: 'ফা আম্মা মান ছাকুলাত মাওয়াযীনুহ',
        translationBn: 'অতঃপর যার নেক আমলের পাল্লা ভারী হবে,'
      },
      {
        numberInSurah: 7,
        arabicText: 'فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ',
        transliterationBn: 'ফাহুওয়া ফী ঈশাতিন রাদিয়াহ',
        translationBn: 'সে তো থাকবে পরম সন্তুষ্টি ও সুখের জীবনে (জান্নাতে)।'
      },
      {
        numberInSurah: 8,
        arabicText: 'وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ',
        transliterationBn: 'ওয়া আম্মা মান খাফফাত মাওয়াযীনুহ',
        translationBn: 'পক্ষান্তরে যার নেক আমলের পাল্লা হালকা হবে,'
      },
      {
        numberInSurah: 9,
        arabicText: 'فَأُمُّهُ هَاوِيَةٌ',
        transliterationBn: 'ফা উম্মুহূ হাবিয়াহ',
        translationBn: 'তার বাসস্থান ও আশ্রয়স্থল হবে ‘হাবিইয়া’ (অতলে নিমজ্জিত জাহান্নাম)।'
      },
      {
        numberInSurah: 10,
        arabicText: 'وَمَا أَدْرَاكَ مَا هِيَهْ',
        transliterationBn: 'ওয়া মা আদরাকা মা হিয়াহ',
        translationBn: 'আর আপনি কি জানেন তা কী?'
      },
      {
        numberInSurah: 11,
        arabicText: 'نَارٌ حَامِيَةٌ',
        transliterationBn: 'নারুন হামিয়াহ',
        translationBn: 'তা হলো প্রজ্বলিত অতি উত্তপ্ত অগ্নি!'
      }
    ]
  },
  {
    number: 102,
    nameAr: 'التكاثر',
    nameBn: 'সূরা আত-তাকাসুর',
    nameEn: 'At-Takathur',
    meaningBn: 'প্রাচুর্যের লালসা ও প্রতিযোগিতা',
    numberOfAyahs: 8,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/102.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'أَلْهَاكُمُ التَّكَاثُرُ',
        transliterationBn: 'আলহা-কুমুত তাকা-ছুর',
        translationBn: 'ধন-সম্পদ ও প্রাচুর্যের মোহ তোমাদের অন্ধ করে রেখেছে,'
      },
      {
        numberInSurah: 2,
        arabicText: 'حَتَّىٰ زُرْتُمُ الْمَقَابِرَ',
        transliterationBn: 'হাত্তা যুরতুমুল মাক্বাবির',
        translationBn: 'এমনকি তোমরা কবরে গিয়ে উপনীত হও।'
      },
      {
        numberInSurah: 3,
        arabicText: 'كَلَّا سَوْفَ تَعْلَمُونَ',
        transliterationBn: 'কাল্লা সাওফা তা’লামূন',
        translationBn: 'কখনোই নয়, তোমরা শীঘ্রই জানতে পারবে।'
      },
      {
        numberInSurah: 4,
        arabicText: 'ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ',
        transliterationBn: 'ছুম্মা কাল্লা সাওফা তা’লামূন',
        translationBn: 'আবারও বলছি কখনো নয়, শীঘ্রই তোমরা উপলব্ধি করবে।'
      },
      {
        numberInSurah: 5,
        arabicText: 'كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ',
        transliterationBn: 'কাল্লা লাও তা’লামূনা ইলমাল ইয়াক্বীন',
        translationBn: 'কখনোই নয়! যদি তোমরা নিশ্চিত জ্ঞানে জানতে (তবে এমন মোহে মত্ত হতে না)।'
      },
      {
        numberInSurah: 6,
        arabicText: 'لَتَرَوُنَّ الْجَحِيمَ',
        transliterationBn: 'লা তারাউন্নাল জাহীম',
        translationBn: 'তোমরা অবশ্যই জাহান্নাম চাক্ষুষ দেখতে পাবে,'
      },
      {
        numberInSurah: 7,
        arabicText: 'ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ',
        transliterationBn: 'ছুম্মা লা তারাউন্নাহা আইনাল ইয়াক্বীন',
        translationBn: 'অতঃপর তোমরা তা দেখবে নিশ্চিত চাক্ষুষ দৃষ্টিতে;'
      },
      {
        numberInSurah: 8,
        arabicText: 'ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ',
        transliterationBn: 'ছুম্মা লাতুসআলুন্না ইয়াওমাইযিন আনিন নাঈম',
        translationBn: 'অতঃপর সেদিন তোমাদের অবশ্যই প্রতিটি প্রদত্ত সুখ ও নিয়ামত সম্পর্কে জবাবদিহি করতে হবে।'
      }
    ]
  },
  {
    number: 103,
    nameAr: 'العصر',
    nameBn: 'সূরা আল-আসর',
    nameEn: 'Al-Asr',
    meaningBn: 'মহাকাল / সময়',
    numberOfAyahs: 3,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/103.mp3',
    fajilatBn: 'ইমাম শাফেয়ী (রহ.) বলেন: কুরআন থেকে কেবল এই একটি সূরাই যদি মানুষ নিয়ে ভাবত, তবে মানুষের হেদায়েতের জন্য এটাই যথেষ্ট হতো।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'وَالْعَصْرِ',
        transliterationBn: 'ওয়াল আসর',
        translationBn: 'শপথ মহাকালের (সময়ের),'
      },
      {
        numberInSurah: 2,
        arabicText: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        transliterationBn: 'ইন্নাল ইনসানা লাফী খুসর',
        translationBn: 'নিশ্চয়ই সমগ্র মানবজাতি চরম ক্ষতির মধ্যে নিমজ্জিত,'
      },
      {
        numberInSurah: 3,
        arabicText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        transliterationBn: 'ইল্লাল্লাযীনা আমানূ ওয়া আমিলুস সালিহাতি ওয়া তাওয়াসাও বিল হাক্কি ওয়া তাওয়াসাও বিস সাবর।',
        translationBn: 'কিন্তু তারা ছাড়া—যারা ঈমান এনেছে, সৎকাজ করেছে এবং পরস্পরকে সত্যের উপদেশ দিয়েছে ও ধৈর্যের উপদেশ দিয়েছে।'
      }
    ]
  },
  {
    number: 104,
    nameAr: 'الهمزة',
    nameBn: 'সূরা আল-হুমাযাহ',
    nameEn: 'Al-Humazah',
    meaningBn: 'পরনিন্দাকারী / পেছনে গীবতকারী',
    numberOfAyahs: 9,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/104.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ',
        transliterationBn: 'ওয়াইলুল লিকুল্লি হুমাযাতিল লুমাযাহ',
        translationBn: 'চরম ধ্বংস ও দুর্ভোগ প্রত্যেক এমন ব্যক্তির জন্য যে সামনাসামনি খোঁচা দেয় ও পেছনে পরনিন্দা (গীবত) করে,'
      },
      {
        numberInSurah: 2,
        arabicText: 'الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ',
        transliterationBn: 'আল্লাযী জামাআ মালান ওয়া আদদাদাহ',
        translationBn: 'যে সম্পদ পুঞ্জীভূত করে ও তা বারবার গণনা করে,'
      },
      {
        numberInSurah: 3,
        arabicText: 'يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ',
        transliterationBn: 'ইয়াহসাবু আন্না মালাহূ আখলাদাহ',
        translationBn: 'সে মনে করে তার সম্পদ তাকে চিরঞ্জীব অমর করে রাখবে!'
      },
      {
        numberInSurah: 4,
        arabicText: 'كَلَّا ۖ لَيُنبَذَنَّ فِي الْحُطَمَةِ',
        transliterationBn: 'কাল্লা লাইউমবাযান্না ফিল হুতামাহ',
        translationBn: 'কখনোই নয়! তাকে অবশ্যই নিক্ষেপ করা হবে চূর্ণ-বিচূর্ণকারী হুতামায়।'
      },
      {
        numberInSurah: 5,
        arabicText: 'وَمَا أَدْرَاكَ مَا الْحُطَمَةُ',
        transliterationBn: 'ওয়া মা আদরাকা মাল হুতামাহ',
        translationBn: 'আর আপনি কি জানেন সেই হুতামা কী?'
      },
      {
        numberInSurah: 6,
        arabicText: 'نَارُ اللَّهِ الْمُوقَدَةُ',
        transliterationBn: 'নারুল্লাহিল মূক্বদাহ',
        translationBn: 'তা হলো আল্লাহর প্রজ্বলিত বহ্নিশিখা,'
      },
      {
        numberInSurah: 7,
        arabicText: 'الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ',
        transliterationBn: 'আল্লাতী তাত্তালিউ আলাল আফইদাহ',
        translationBn: 'যা কলিজা ও অন্তর পর্যন্ত পৌঁছে গ্রাস করে নেবে।'
      },
      {
        numberInSurah: 8,
        arabicText: 'إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ',
        transliterationBn: 'ইন্নাহা আলাইহিম মু’সাদাহ',
        translationBn: 'নিশ্চয়ই তা চারপাশ থেকে তাদের ওপর অবরুদ্ধ করে বন্ধ রাখা হবে,'
      },
      {
        numberInSurah: 9,
        arabicText: 'فِي عَمَدٍ مُّمَدَّدَةٍ',
        transliterationBn: 'ফী আমাদিম মুমাদ্দাদাহ',
        translationBn: 'সুউচ্চ প্রলম্বিত স্তম্ভসমূহের মধ্যে।'
      }
    ]
  },
  {
    number: 105,
    nameAr: 'الفيل',
    nameBn: 'সূরা আল-ফিল',
    nameEn: 'Al-Fil',
    meaningBn: 'হাতি / হস্তীবাহিনী',
    numberOfAyahs: 5,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/105.mp3',
    fajilatBn: 'আবরাহার হস্তীবাহিনী ধ্বংস এবং আল্লাহর ঘর কাবার অলৌকিক হেফাজতের ঐতিহাসিক স্মৃতি।'
    ,verses: [
      {
        numberInSurah: 1,
        arabicText: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
        transliterationBn: 'আলাম তারা কাইফা ফাআলা রাব্বুকা বিআসহাবিল ফীল',
        translationBn: 'আপনি কি দেখেননি আপনার পালনকর্তা হস্তীবাহিনীর সাথে কীরূপ আচরণ করেছিলেন?'
      },
      {
        numberInSurah: 2,
        arabicText: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
        transliterationBn: 'আলাম ইয়াজআল কাইদাহুম ফী তাদলীল',
        translationBn: 'তিনি কি তাদের চক্রান্ত ও কৌশলকে নস্যাৎ করে দেননি?'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
        transliterationBn: 'ওয়া আরসালা আলাইহিম তাইরান আবাবীল',
        translationBn: 'এবং তাদের ওপর ঝাঁকে ঝাঁকে আবাবিল পাখি প্রেরণ করেছিলেন,'
      },
      {
        numberInSurah: 4,
        arabicText: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
        transliterationBn: 'তারমীহিম বিহিজারাতিম মিন সিজ্জীল',
        translationBn: 'যারা তাদের ওপর নিক্ষেপ করছিল পোড়ামাটির শক্ত পাথরকণা,'
      },
      {
        numberInSurah: 5,
        arabicText: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ',
        transliterationBn: 'ফাজাআলাহুম কাআসফিম মা’কূল',
        translationBn: 'অতঃপর তিনি তাদের চর্বিত ভুসি বা খাওয়া তৃণের মতো চূর্ণ-বিচূর্ণ করে ফেলেন।'
      }
    ]
  },
  {
    number: 106,
    nameAr: 'قريش',
    nameBn: 'সূরা কুরাইশ',
    nameEn: 'Quraysh',
    meaningBn: 'কুরাইশ বংশ',
    numberOfAyahs: 4,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/106.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'لِإِيلَافِ قُرَيْشٍ',
        transliterationBn: 'লিঈলাফি কুরাইশ',
        translationBn: 'কুরাইশদের আসক্তি ও নিরাপত্তার জন্য,'
      },
      {
        numberInSurah: 2,
        arabicText: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
        transliterationBn: 'ঈলাফিহিম রিহলাতাশ শিতা-ই ওয়াস সইফ',
        translationBn: 'শীত ও গ্রীষ্মকালীন নির্বিঘ্ন বাণিজ্যিক সফরের নিরাপত্তার কারণে,'
      },
      {
        numberInSurah: 3,
        arabicText: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ',
        transliterationBn: 'ফাল ইয়া’বুদূ রাব্বা হাযাল বাইত',
        translationBn: 'অতএব তারা যেন এই পবিত্র ঘরের (কাবার) রবেরই ইবাদত করে,'
      },
      {
        numberInSurah: 4,
        arabicText: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ',
        transliterationBn: 'আল্লাযী আতআমাহুম মিন জুয়িন ওয়া আমানাহুম মিন খাওফ',
        translationBn: 'যিনি তাদের ক্ষুধায় খাদ্য দান করেছেন এবং চরম ভয়-ভীতি থেকে পরম নিরাপত্তা দিয়েছেন।'
      }
    ]
  },
  {
    number: 107,
    nameAr: 'الماعون',
    nameBn: 'সূরা আল-মাউন',
    nameEn: 'Al-Maun',
    meaningBn: 'সাহায্য-সহায়তা / নিত্যপ্রয়োজনীয় ব্যবহার্য বস্তু',
    numberOfAyahs: 7,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/107.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ',
        transliterationBn: 'আরাআইতাল্লাযী ইউকাযযিবু বিদ্দীন',
        translationBn: 'আপনি কি তাকে দেখেছেন, যে কিয়ামত ও বিচার দিবসকে অস্বীকার করে?'
      },
      {
        numberInSurah: 2,
        arabicText: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
        transliterationBn: 'ফাযালিকাল্লাযী ইয়াদু’উল ইয়াতীম',
        translationBn: 'সে তো সেই ব্যক্তি, যে এতিমকে রূঢ়ভাবে তাড়িয়ে দেয়,'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
        transliterationBn: 'ওয়ালা ইয়াহুদ্দু আলা তাআমিল মিসকীন',
        translationBn: 'এবং মিসকিন ও অভাবগ্রস্তকে খাদ্যদানে অন্যকে উৎসাহিত করে না।'
      },
      {
        numberInSurah: 4,
        arabicText: 'فَوَيْلٌ لِّلْمُصَلِّينَ',
        transliterationBn: 'ফাওয়াইলুল লিলমুসাল্লীন',
        translationBn: 'অতএব দুর্ভোগ সেইসব নামাজীদের জন্য,'
      },
      {
        numberInSurah: 5,
        arabicText: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ',
        transliterationBn: 'আল্লাযীনা হুম আন সালাতিহিম সাহূন',
        translationBn: 'যারা তাদের নামাজ সম্পর্কে উদাসীন ও বেখেয়াল,'
      },
      {
        numberInSurah: 6,
        arabicText: 'الَّذِينَ هُمْ يُرَاءُونَ',
        transliterationBn: 'আল্লাযীনা হুম ইউরা-ঊন',
        translationBn: 'যারা লোকদেখানো প্রদর্শনীর মনোভাব নিয়ে কাজ করে,'
      },
      {
        numberInSurah: 7,
        arabicText: 'وَيَمْنَعُونَ الْمَاعُونَ',
        transliterationBn: 'ওয়া ইয়ামনাঊনাল মাঊন',
        translationBn: 'এবং যারা নিত্যপ্রয়োজনীয় সামান্য সাহায্য-সহায়তা করতেও অস্বীকৃতি জানায়।'
      }
    ]
  },
  {
    number: 108,
    nameAr: 'الكوثر',
    nameBn: 'সূরা আল-কাওসার',
    nameEn: 'Al-Kawthar',
    meaningBn: 'প্রচুর প্রাচুর্য / জান্নাতের কাউসার ঝর্ণা',
    numberOfAyahs: 3,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/108.mp3',
    fajilatBn: 'পবিত্র কুরআনের সবচেয়ে ছোট সূরা। নিয়মিত পাঠে হাউজে কাওসারের সুপেয় পানি নসিব হয়।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        transliterationBn: 'ইন্না আ’তায়নাকাল কাওছার',
        translationBn: 'নিশ্চয়ই আমরা আপনাকে কাওসার (অফুরন্ত কল্যাণ ও নহর) দান করেছি।'
      },
      {
        numberInSurah: 2,
        arabicText: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        transliterationBn: 'ফাসাল্লি লিরাব্বিকা ওয়ানহার',
        translationBn: 'অতএব আপনি আপনার প্রতিপালকের উদ্দেশ্যে নামাজ পড়ুন এবং কুরবানি করুন।'
      },
      {
        numberInSurah: 3,
        arabicText: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        transliterationBn: 'ইন্না শানিয়াকা হুওয়াল আবতার',
        translationBn: 'নিশ্চয়ই আপনার প্রতি বিদ্বেষ পোষণকারী শত্রুই তো নির্বংশ ও সমূলে বিনাশপ্রাপ্ত।'
      }
    ]
  },
  {
    number: 109,
    nameAr: 'الكافرون',
    nameBn: 'সূরা আল-কাফিরুন',
    nameEn: 'Al-Kafirun',
    meaningBn: 'অবিশ্বাসী কাফির সম্প্রদায়',
    numberOfAyahs: 6,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/109.mp3',
    fajilatBn: 'শিরক থেকে মুক্তির ঘোষণা। হাদিসে একে এক-চতুর্থাংশ কুরআনের সমতুল্য বলা হয়েছে। ফজরের সুন্নতে পড়া সুন্নাত।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ',
        transliterationBn: 'ক্বুল ইয়া আইয়্যুহাল কাফিরূন',
        translationBn: 'বলুন: হে অবিশ্বাসী কাফিরেরা!'
      },
      {
        numberInSurah: 2,
        arabicText: 'لَا أَعْبُدُ مَا تَعْبُدُونَ',
        transliterationBn: 'লা আ’বুদু মা তা’বুদূন',
        translationBn: 'আমি তাদের ইবাদত করি না যাদের তোমরা পূজা করো,'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
        transliterationBn: 'ওয়ালা আনতুম আবিদূনা মা আ’বুদ',
        translationBn: 'এবং তোমরাও তাঁর ইবাদতকারী নও যাঁর ইবাদত আমি করি।'
      },
      {
        numberInSurah: 4,
        arabicText: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ',
        transliterationBn: 'ওয়ালা আনা আবিদুম মা আবাত্তুম',
        translationBn: 'আর আমি কখনো তাদের উপাসনা করব না যাদের তোমরা উপাসনা করেছ,'
      },
      {
        numberInSurah: 5,
        arabicText: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
        transliterationBn: 'ওয়ালা আনতুম আবিদূনা মা আ’বুদ',
        translationBn: 'এবং তোমরাও তাঁর উপাসক নও যাঁর উপাসনা আমি করি।'
      },
      {
        numberInSurah: 6,
        arabicText: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
        transliterationBn: 'লাকুম দীনুকুম ওয়ালিয়া দীন',
        translationBn: 'তোমাদের জন্য তোমাদের দ্বীন/ধর্ম এবং আমার জন্য আমার দ্বীন।'
      }
    ]
  },
  {
    number: 110,
    nameAr: 'النصر',
    nameBn: 'সূরা আন-নাসর',
    nameEn: 'An-Nasr',
    meaningBn: 'বিজয় ও ঐশী সাহায্য',
    numberOfAyahs: 3,
    revelationType: 'Medinan',
    revelationTypeBn: 'মাদানী',
    audioUrl: 'https://server8.mp3quran.net/afs/110.mp3',
    fajilatBn: 'পবিত্র কুরআনের সর্বশেষ পূর্ণাঙ্গ অবতীর্ণ সূরা। বিজয়ের সময়ও আল্লাহর তাসবীহ ও ইস্তিগফারের তাকিদ।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
        transliterationBn: 'ইযা জা-আ নাসরুল্লাহি ওয়াল ফাতহ',
        translationBn: 'যখন আসবে আল্লাহর সাহায্য ও মহা বিজয় (মক্কা বিজয়),'
      },
      {
        numberInSurah: 2,
        arabicText: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
        transliterationBn: 'ওয়া রাআইতান নাসা ইয়াদখুলূনা ফী দীনিল্লাহি আফওয়াজা',
        translationBn: 'এবং আপনি মানুষকে দলে দলে আল্লাহর দ্বীনে প্রবেশ করতে দেখবেন,'
      },
      {
        numberInSurah: 3,
        arabicText: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا',
        transliterationBn: 'ফাসাব্বিহ বিহামদি রাব্বিকা ওয়াসতাগফিরহু, ইন্নাহূ কানা তাওওয়াবা',
        translationBn: 'তখন আপনি আপনার প্রতিপালকের প্রশংসাসহ পবিত্রতা ঘোষণা (তাসবীহ) করুন এবং তাঁর নিকট ক্ষমা প্রার্থনা করুন। নিশ্চয়ই তিনি পরম তাওবা কবুলকারী।'
      }
    ]
  },
  {
    number: 111,
    nameAr: 'المسد',
    nameBn: 'সূরা আল-মাসাদ (আল-লাহাব)',
    nameEn: 'Al-Masad',
    meaningBn: 'পাকানো খেজুরের রশি / বহ্নিশিখা',
    numberOfAyahs: 5,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/111.mp3',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
        transliterationBn: 'তাব্বাত ইয়াদা আবী লাহাবিঁও ওয়াতাব্ব',
        translationBn: 'আবু লাহাবের উভয় হাত ধ্বংস হোক এবং সে নিজেও সমূলে ধ্বংস হয়েছে!'
      },
      {
        numberInSurah: 2,
        arabicText: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ',
        transliterationBn: 'মা আগনা আনহু মালুহু ওয়া মা কাসাব',
        translationBn: 'তার ধন-সম্পদ ও যা সে উপার্জন করেছে তা তার কোনো উপকারে আসেনি।'
      },
      {
        numberInSurah: 3,
        arabicText: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ',
        transliterationBn: 'সাইয়াসলা নারান যাতা লাহাব',
        translationBn: 'অচিরেই সে প্রজ্বলিত লেলিহান অগ্নিশিখায় প্রবেশ করবে,'
      },
      {
        numberInSurah: 4,
        arabicText: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ',
        transliterationBn: 'ওয়ামরাআতুহূ হাম্মালাতাল হাতাব',
        translationBn: 'এবং তার স্ত্রীও, যে কাঁটার বোঝা বহনকারী,'
      },
      {
        numberInSurah: 5,
        arabicText: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ',
        transliterationBn: 'ফী জীদিহা হাবলুম মিম মাসাদ',
        translationBn: 'তার গলায় শক্ত পাকানো খেজুরের আঁশের রশি বাঁধা থাকবে।'
      }
    ]
  },
  {
    number: 112,
    nameAr: 'الإخلاص',
    nameBn: 'সূরা আল-ইখলাস',
    nameEn: 'Al-Ikhlas',
    meaningBn: 'একনিষ্ঠতা / খাঁটি তাওহীদ',
    numberOfAyahs: 4,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/112.mp3',
    fajilatBn: 'সহীহ হাদিস অনুযায়ী এটি পাঠ করলে এক-তৃতীয়াংশ কুরআন পাঠের সওয়াব লাভ হয়। প্রতিদিন রাতে ৩ বার পড়া সুন্নাত।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliterationBn: 'ক্বুল হুয়াল্লাহু আহাদ',
        translationBn: 'বলুন: তিনিই আল্লাহ, যিনি একক ও অদ্বিতীয়।'
      },
      {
        numberInSurah: 2,
        arabicText: 'اللَّهُ الصَّمَدُ',
        transliterationBn: 'আল্লাহুস সামাদ',
        translationBn: 'আল্লাহ অমুখাপেক্ষী (সকল সৃষ্টি তাঁর মুখাপেক্ষী, তিনি কারও মুখাপেক্ষী নন)।'
      },
      {
        numberInSurah: 3,
        arabicText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliterationBn: 'লাম ইয়ালিদ ওয়া লাম ইয়ূলাদ',
        translationBn: 'তিনি কাউকে জন্ম দেননি এবং তিনিও কারো থেকে জন্ম নেননি।'
      },
      {
        numberInSurah: 4,
        arabicText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliterationBn: 'ওয়া লাম ইয়াকুল লাহু কুফুওয়ান আহাদ',
        translationBn: 'এবং তাঁর সমকক্ষ বা সমতুল্য কেউই নেই।'
      }
    ]
  },
  {
    number: 113,
    nameAr: 'الفلق',
    nameBn: 'সূরা আল-ফালাক',
    nameEn: 'Al-Falaq',
    meaningBn: 'উষাকাল / প্রভাত',
    numberOfAyahs: 5,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/113.mp3',
    fajilatBn: 'জাদু-টোনা, বদনজর, হিংসা ও যাবতীয় অনিষ্ট থেকে আত্মরক্ষার জন্য অন্যতম মুআওয়াযাতাইন।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliterationBn: 'ক্বুল আউযু বিরাব্বিল ফালাক্ব',
        translationBn: 'বলুন: আমি আশ্রয় প্রার্থনা করছি উষাকালের প্রতিপালকের নিকট,'
      },
      {
        numberInSurah: 2,
        arabicText: 'مِن شَرِّ مَا خَلَقَ',
        transliterationBn: 'মিন শাররি মা খালাক্ব',
        translationBn: 'তিনি যা সৃষ্টি করেছেন তার যাবতীয় অনিষ্ট হতে,'
      },
      {
        numberInSurah: 3,
        arabicText: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliterationBn: 'ওয়া মিন শাররি গাসিক্বিন ইযা ওয়াক্বাব',
        translationBn: 'এবং অন্ধকার রাতের অনিষ্ট হতে যখন তা নিবিড় হয়ে ছড়িয়ে পড়ে,'
      },
      {
        numberInSurah: 4,
        arabicText: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transliterationBn: 'ওয়া মিন শাররিন নাফ্ফাছাতি ফিল উক্বাদ',
        translationBn: 'এবং গিরায় ফুঁকদানকারী যাদুকরদের অনিষ্ট হতে,'
      },
      {
        numberInSurah: 5,
        arabicText: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliterationBn: 'ওয়া মিন শাররি হাসিদিন ইযা হাসাদ',
        translationBn: 'এবং হিংসুকের অনিষ্ট হতে যখন সে হিংসা করে।'
      }
    ]
  },
  {
    number: 114,
    nameAr: 'الناس',
    nameBn: 'সূরা আন-নাস',
    nameEn: 'An-Nas',
    meaningBn: 'মানবজাতি',
    numberOfAyahs: 6,
    revelationType: 'Meccan',
    revelationTypeBn: 'মক্কী',
    audioUrl: 'https://server8.mp3quran.net/afs/114.mp3',
    fajilatBn: 'শয়তানের কুমন্ত্রণা ও অন্তরের ওয়াসওয়াসা দূরীকরণে সূরা আল-ফালাকের সাথে এটি সর্বোত্তম রক্ষা-কবচ।',
    verses: [
      {
        numberInSurah: 1,
        arabicText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliterationBn: 'ক্বুল আউযু বিরাব্বিন নাস',
        translationBn: 'বলুন: আমি আশ্রয় প্রার্থনা করছি মানুষের প্রতিপালকের নিকট,'
      },
      {
        numberInSurah: 2,
        arabicText: 'مَلِكِ النَّاسِ',
        transliterationBn: 'মালিকিন নাস',
        translationBn: 'মানুষের একমাত্র অধিপতি ও মহারাজার নিকট,'
      },
      {
        numberInSurah: 3,
        arabicText: 'إِلَٰهِ النَّاسِ',
        transliterationBn: 'ইলাহিন নাস',
        translationBn: 'মানুষের একমাত্র সত্য উপাস্যের নিকট,'
      },
      {
        numberInSurah: 4,
        arabicText: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliterationBn: 'মিন শাররিল ওয়াসওয়াসিল খান্নাস',
        translationBn: 'গোপনে পশ্চাদপসরণকারী কুমন্ত্রণাদাতার (শয়তানের) অনিষ্ট হতে,'
      },
      {
        numberInSurah: 5,
        arabicText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliterationBn: 'আল্লাযী ইউওয়াসউইসু ফী সুদূরিন নাস',
        translationBn: 'যে মানুষের অন্তরে কুমন্ত্রণা ও সন্দেহ সৃষ্টি করে,'
      },
      {
        numberInSurah: 6,
        arabicText: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliterationBn: 'মিনাল জিন্নাতি ওয়ান নাস',
        translationBn: 'জিনদের মধ্য হতে কিংবা মানুষের মধ্য হতে।'
      }
    ]
  }
];

export const SPECIAL_ESSENTIAL_VERSES = [
  {
    id: 'ayatul-kursi',
    titleBn: 'আয়াতুল কুরসী (সূরা আল-বাকারা: ২৫৫)',
    surahNumber: 2,
    ayahNumber: 255,
    arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliterationBn: 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূম। লা তা’খুযুহু সিনাতুঁও ওয়ালা নাওম। লাহু মা ফিস সামাওয়াতি ওয়া মা ফিল আরদ। মান যাল্লাযী ইয়াশফাউ ইনদাহূ ইল্লা বিইযনিহ। ইয়া’লামু মা বাইনা আইদীহিম ওয়া মা খালফাহুম, ওয়ালা ইউহীতূনা বিশাইইম মিন ইলমিহী ইল্লা বিমা শা-আ। ওয়াসিয়া কুরসিয়্যুহুস সামাওয়াতি ওয়াল আরদ, ওয়ালা ইয়াউদুহু হিফযুহুমা, ওয়া হুয়াল আলিয়্যুল আজীম।',
    translationBn: 'আল্লাহ ছাড়া কোনো সত্য উপাস্য নেই, তিনি চিরঞ্জীব ও সর্বসত্তার ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করে না। আসমান ও জমিনে যা কিছু আছে সবই তাঁর। কে আছে এমন যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সম্মুখে ও পেছনে যা কিছু আছে তিনি তা সবই জানেন। তাঁর ইচ্ছার বাইরে তাঁর জ্ঞানের কিছুই তারা পরিবেষ্টন করতে পারে না। তাঁর কুরসী (সিংহাসন/কর্তৃত্ব) সমগ্র আকাশমন্ডলী ও পৃথিবীকে পরিব্যাপ্ত করে আছে। আর এই দুইয়ের রক্ষণাবেক্ষণ তাঁকে বিন্দুমাত্র ক্লান্ত করে না। তিনি সুউচ্চ ও মহামহিম।',
    fajilatBn: 'কুরআনের সর্বশ্রেষ্ঠ আয়াত। প্রতি ফরজ নামাজের পর পাঠকারীর জান্নাতে প্রবেশে কেবল মৃত্যুই বাধা থাকে (নাসাঈ)।',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/262.mp3'
  },
  {
    id: 'amanar-rasul',
    titleBn: 'সূরা বাকারার শেষ দুই আয়াত (২৮৫-২৮৬)',
    surahNumber: 2,
    ayahNumber: 285,
    arabicText: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliterationBn: 'আমানার রাসূলু বিমা উনযিলা ইলাইহি মির রাব্বিহী ওয়াল মু’মিনূন... গুফরানাকা রাব্বানা ওয়া ইলাইকাল মাসীর... রাব্বানা লা তুআখিযনা ইন নাসীনা আও আখতা’না... ওয়া’ফু আন্না ওয়াগফির লানা ওয়ারহামনা, আন্তা মাওলRootা ফানসুরনা আলাল কাওমিল কাফিরীন।',
    translationBn: 'রাসূল বিশ্বাস এনেছেন যা তাঁর প্রতিপালকের পক্ষ থেকে তাঁর প্রতি অবতীর্ণ হয়েছে এবং মুমিনগণও... তারা বলে: আমরা শুনেছি এবং আনুগত্য করেছি। হে আমাদের প্রতিপালক! আমরা আপনার ক্ষমা প্রার্থনা করি এবং আপনারই দিকে প্রত্যাবর্তনস্থল... হে আমাদের প্রতিপালক! যদি আমরা ভুলে যাই কিংবা ভুলত্রুটি করি তবে আমাদের পাকড়াও করবেন না... আপনি আমাদের অভিভাবক, অতএব কাফির সম্প্রদায়ের বিরুদ্ধে আমাদের সাহায্য করুন।',
    fajilatBn: 'যে ব্যক্তি রাতে এই দুই আয়াত পাঠ করবে, সারারাত সব ধরনের বিপদ-আপদ ও অনিষ্ট থেকে রক্ষার জন্য এটিই তার জন্য যথেষ্ট হয়ে যাবে (বুখারী: ৫০০৯)।',
    audioUrl: 'https://server8.mp3quran.net/afs/002.mp3'
  }
];
