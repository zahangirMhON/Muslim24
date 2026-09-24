import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Award, 
  HelpCircle, 
  Lock, 
  Unlock,
  Layers,
  ArrowRight,
  RotateCcw,
  Check
} from 'lucide-react';
import { Language } from '../types';
import { toBengaliDigits } from '../utils/bengaliUtils';

export interface ArabicWordItem {
  id: number;
  trackId: 'foundation' | 'tawheed' | 'akhlaq' | 'risalat' | 'hereafter';
  trackNameBn: string;
  stepNumber: number;                   // যেমন: ধাপ ১ থেকে ৮
  arabicSingular: string;               // একবচন (المُفْرَد)
  bengaliPronunciationSingular: string; // একবচনের উচ্চারণ
  bengaliMeaningSingular: string;       // একবচনের বাংলা অর্থ
  arabicPlural: string;                 // বহুবচন (الجَمْع)
  bengaliPronunciationPlural: string;   // বহুবচনের উচ্চারণ
  bengaliMeaningPlural: string;         // বহুবচনের বাংলা অর্থ
  quranOccurrenceCountBn: string;       // কুরআনে উল্লেখ সংখ্যা
  category: 'কুরআনিক শব্দ' | 'দৈনন্দিন ব্যবহার' | 'আখলাক ও ঈমান' | 'ইবাদত ও সালাত';
  quranicExampleAr: string;             // কুরআনের দৃষ্টান্ত আয়াত
  quranicExamplePronunciationBn: string;// কুরআনের আয়াতের বাংলা উচ্চারণ
  quranicExampleBn: string;             // সরল অনুবাদ
  surahReferenceBn: string;             // সূরার নাম ও আয়াত নম্বর
  asbabAlNuzulBn: string;               // শানে নুযূল (অবতীর্ণের পটভূমি)
  spiritualSignificanceBn: string;      // তাৎপর্য ও ফজিলত
}

export const ARABIC_LEARNING_TRACKS = [
  { id: 'foundation', name: 'ধাপ ১-৮: বুনিয়াদি কুরআনিক শব্দ', icon: '🌟', reqFoundation: false },
  { id: 'tawheed', name: 'ট্র্যাক ১: তাওহীদ ও আল্লাহর পরিচয়', icon: '☝️', reqFoundation: true },
  { id: 'akhlaq', name: 'ট্র্যাক ২: আখলাক, সবর ও আত্মশুদ্ধি', icon: '🤍', reqFoundation: true },
  { id: 'risalat', name: 'ট্র্যাক ৩: কুরআন ও রিসালাত', icon: '📖', reqFoundation: true },
  { id: 'hereafter', name: 'ট্র্যাক ৪: নিয়ামত ও আখেরাত', icon: '🕊️', reqFoundation: true }
] as const;

export const ARABIC_VOCABULARY_LIST: ArabicWordItem[] = [
  // -------------------------------------------------------------
  // ধাপে 1-8: বুনিয়াদি শব্দ (Foundation Track: Steps 1 to 8)
  // -------------------------------------------------------------
  {
    id: 1,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 1,
    arabicSingular: 'كِتَابٌ',
    bengaliPronunciationSingular: 'কিতাবুন',
    bengaliMeaningSingular: 'একটি বই বা লিখিত গ্রন্থ',
    arabicPlural: 'كُتُبٌ',
    bengaliPronunciationPlural: 'কুতুবুন',
    bengaliMeaningPlural: 'একাধিক বই বা আসমানী গ্রন্থসমূহ',
    quranOccurrenceCountBn: '২৬১ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ هُدًى لِّلْمُتَّقِينَ',
    quranicExamplePronunciationBn: 'যালিকাল কিতা-বু লা- রইবা ফীহি হুদাললিল মুত্তাক্বীন',
    quranicExampleBn: 'এটা সেই কিতাব; এতে কোনো সন্দেহ নেই, মুত্তাকীদের জন্য হেদায়েত।',
    surahReferenceBn: 'সূরা আল-বাকারা: ২',
    asbabAlNuzulBn: 'মক্কার মুশরিক ও আহলে কিতাবগণ যখন রাসুলুল্লাহ সা.-এর নবুওয়াত ও আসমানী কিতাবের সত্যতা নিয়ে সংশয় প্রকাশ করত, তখন এই আয়াতের মাধ্যমে কুরআনের নিঃসংশয় সত্যতা ও অলৌকিকত্বের চূড়ান্ত ঘোষণা দেওয়া হয়।',
    spiritualSignificanceBn: 'পবিত্র কুরআন মানবজাতির হেদায়েতের একমাত্র নির্ভুল পথ নির্দেশক। প্রতিদিন কুরআন তিলাওয়াত ও গবেষণায় অন্তরে ঈমানী নূর বৃদ্ধি পায়।'
  },
  {
    id: 2,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 2,
    arabicSingular: 'قَلْبٌ',
    bengaliPronunciationSingular: 'ক্বলবুন',
    bengaliMeaningSingular: 'একটি হৃদয় বা একটি অন্তর',
    arabicPlural: 'قُلُوبٌ',
    bengaliPronunciationPlural: 'ক্বুলূবুন',
    bengaliMeaningPlural: 'মানবজাতির সকল হৃদয় বা অন্তরসমূহ',
    quranOccurrenceCountBn: '১৩২ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    quranicExamplePronunciationBn: 'আলা- বিযিকরিল্লা-হি তাত়মাইন্নুল ক্বুলূব',
    quranicExampleBn: 'জেনে রাখো, আল্লাহর জিকির ও স্মরণের মাধ্যমেই কেবল অন্তরসমূহ প্রশান্ত হয়।',
    surahReferenceBn: 'সূরা আর-রা’দ: ২৮',
    asbabAlNuzulBn: 'সাহাবায়ে কেরাম যখন পার্থিব দুশ্চিন্তা ও মানসিক অস্থিরতা কাটিয়ে অন্তরের পরম প্রশান্তি লাভের উপায় জানতে চান, তখন আল্লাহ তাআলা সার্বক্ষণিক জিকিরের এই সুসংবাদ অবতীর্ণ করেন।',
    spiritualSignificanceBn: 'অন্তর মানবদেহের বাদশাহস্বরূপ। অন্তরের কলুষতা দূর করতে নিয়মিত জিকির, ইসতিগফার ও কুরআন তিলাওয়াত অপরিহার্য।'
  },
  {
    id: 3,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 3,
    arabicSingular: 'آيَةٌ',
    bengaliPronunciationSingular: 'আয়াতুন',
    bengaliMeaningSingular: 'একটি নিদর্শন বা কুরআনের একটি বাক্য',
    arabicPlural: 'آيَاتٌ',
    bengaliPronunciationPlural: 'আ-য়া-তুন',
    bengaliMeaningPlural: 'অসংখ্য অলৌকিক নিদর্শনাবলী বা কুরআনের আয়াতসমূহ',
    quranOccurrenceCountBn: '৩৮২ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'تِلْكَ آيَاتُ اللَّهِ نَتْلُوهَا عَلَيْكَ بِالْحَقِّ',
    quranicExamplePronunciationBn: 'তিলকা আ-য়া-তুল্লা-হি নাতলূহা- ‘আলাইকা বিল হাক্বক্ব',
    quranicExampleBn: 'এগুলো আল্লাহর সত্য নিদর্শন বা আয়াত, যা আমি আপনার নিকট সত্যসহ তিলাওয়াত করছি।',
    surahReferenceBn: 'সূরা আল-বাকারা: ২৫২',
    asbabAlNuzulBn: 'মক্কার কাফেররা যখন নবুওয়াতের অলৌকিক মোজেজা দাবি করত, তখন আল্লাহ জানান যে মহাবিশ্বের প্রতিটি সৃষ্টি ও কুরআনের প্রতিটি বাক্যই তাঁর একত্ববাদের সত্য দলিল।',
    spiritualSignificanceBn: 'কুরআনের একটি আয়াত তিলাওয়াত করলেও ১০টি নেকী অর্জিত হয় এবং মানসিক প্রশান্তি মেলে।'
  },
  {
    id: 4,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 4,
    arabicSingular: 'نُورٌ',
    bengaliPronunciationSingular: 'নূরুন',
    bengaliMeaningSingular: 'দিব্য আলো বা আলোকচ্ছটা',
    arabicPlural: 'أَنْوَارٌ',
    bengaliPronunciationPlural: 'আনওয়ারুন',
    bengaliMeaningPlural: 'বহুমুখী জ্যোতি বা দ্যুতিসমূহ',
    quranOccurrenceCountBn: '৪৯ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    quranicExamplePronunciationBn: 'আল্লা-হু নূরুস সামা-ওয়া-তি ওয়াল আরদ্ব',
    quranicExampleBn: 'আল্লাহ আসমানসমূহ ও জমিনের বিশেষ জ্যোতি বা নূর।',
    surahReferenceBn: 'সূরা আন-নূর: ৩৫',
    asbabAlNuzulBn: 'ঈমানের আলো কীভাবে মুমিনের অন্তরে প্রবেশ করে তা বোঝাতে ও অন্ধকারের শিরক থেকে মুক্ত করার প্রেক্ষাপটে এই বিখ্যাত তমসানাশক আয়াত নাজিল হয়।',
    spiritualSignificanceBn: 'নিয়মিত সালাত ও তিলাওয়াতের মাধ্যমে মুমিনের চেহারায় ও অন্তরে কেয়ামতের দিন নূর চমকাবে।'
  },
  {
    id: 5,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 5,
    arabicSingular: 'صَلَاةٌ',
    bengaliPronunciationSingular: 'সালা-তুন',
    bengaliMeaningSingular: 'এক ওয়াক্তের নামাজ বা প্রার্থনা',
    arabicPlural: 'صَلَوَاتٌ',
    bengaliPronunciationPlural: 'সালাওয়া-তুন',
    bengaliMeaningPlural: 'পঞ্চওয়াক্ত ও নফল নামাজসমূহ',
    quranOccurrenceCountBn: '৯৯ বার',
    category: 'ইবাদত ও সালাত',
    quranicExampleAr: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
    quranicExamplePronunciationBn: 'ইন্নাস সালা-তা তানহা- ‘আনিল ফাহশা-ই ওয়াল মুনকার',
    quranicExampleBn: 'নিশ্চয়ই সালাত মানুষকে যেকোনো অশ্লীল ও গর্হিত কাজ থেকে বিরত রাখে।',
    surahReferenceBn: 'সূরা আল-আনকাবুত: ৪৫',
    asbabAlNuzulBn: 'এক আনসার যুবক রাসুল সা.-এর পিছনে সালাত আদায় করত আবার নানা পাপে লিপ্ত হতো; রাসুল সা. বললেন তার সালাতই তাকে একদিন সংশোধন করবে, তখন এই আয়াত নাজিল হয়।',
    spiritualSignificanceBn: 'সালাত হলো মুমিনের মিরাজ ও ঈমানের প্রধান স্তম্ভ। কেয়ামতের দিন প্রথম হিসাব হবে সালাতের।'
  },
  {
    id: 6,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 6,
    arabicSingular: 'عَبْدٌ',
    bengaliPronunciationSingular: '‘আবদুন',
    bengaliMeaningSingular: 'একজন অনুগত বান্দা বা দাস',
    arabicPlural: 'عِبَادٌ',
    bengaliPronunciationPlural: '‘ইবা-দুন',
    bengaliMeaningPlural: 'আল্লাহর অনুগত বান্দাগণ',
    quranOccurrenceCountBn: '২৭৫ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    quranicExamplePronunciationBn: 'ওয়া ইযা- সা’আলাকা ‘ইবা-দী ‘আন্নী ফাইন্নী ক্বরীব',
    quranicExampleBn: 'আর যখন আমার বান্দাগণ আপনার কাছে আমার সম্পর্কে জিজ্ঞেস করে, আমি তো অত্যন্ত কাছেই আছি।',
    surahReferenceBn: 'সূরা আল-বাকারা: ১৮৬',
    asbabAlNuzulBn: 'একজন বেদুইন এসে রাসুল সা.-কে জিজ্ঞেস করেছিল, "আমাদের রব কি নিকটে যে চুপিসারে ডাকব, নাকি দূরে যে চিৎকার করব?" তখন এই আয়াত অবতীর্ণ হয়।',
    spiritualSignificanceBn: 'আল্লাহর সবচেয়ে প্রিয় উপাধি "বান্দা"। ব্যাকুল মনে দোয়া করলে আল্লাহ বান্দার ডাক শোনেন।'
  },
  {
    id: 7,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 7,
    arabicSingular: 'جَنَّةٌ',
    bengaliPronunciationSingular: 'জান্নাতুন',
    bengaliMeaningSingular: 'একটি মনোরম বাগান বা বেহেশত',
    arabicPlural: 'جَنَّاتٌ',
    bengaliPronunciationPlural: 'জান্না-তুন',
    bengaliMeaningPlural: 'নিয়ামতে ভরা চিরস্থায়ী জান্নাতসমূহ',
    quranOccurrenceCountBn: '১৪৭ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتُ النَّعِيمِ',
    quranicExamplePronunciationBn: 'ইন্নাল্লাযীনা আ-মানূ ওয়া ‘আমিলুস স-লিহা-তি লাহুম জান্না-তুন না‘ঈম',
    quranicExampleBn: 'নিশ্চয়ই যারা ঈমান আনে ও সৎকর্ম করে, তাদের জন্য রয়েছে নিয়ামতে ভরা জান্নাত।',
    surahReferenceBn: 'সূরা লুকমান: ৮',
    asbabAlNuzulBn: 'কাফেররা যখন মুমিনদের পার্থিব অনটন নিয়ে উপহাস করত, তখন আল্লাহ তাআলা আখেরাতে সৎকর্মশীল সাহাবীদের জন্য অসীম নিয়ামতের জান্নাতের সুসংবাদ দেন।',
    spiritualSignificanceBn: 'জান্নাত অর্জনে ঈমানের সাথে সাথে নেক আমল ও রবের সন্তুষ্টি আবশ্যক।'
  },
  {
    id: 8,
    trackId: 'foundation',
    trackNameBn: 'বুনিয়াদি শব্দ (ধাপ ১-৮)',
    stepNumber: 8,
    arabicSingular: 'رَحْمَةٌ',
    bengaliPronunciationSingular: 'রহমাতুন',
    bengaliMeaningSingular: 'এক বিশেষ দয়া বা করুণা',
    arabicPlural: 'رَحَمَاتٌ',
    bengaliPronunciationPlural: 'রহমা-তুন',
    bengaliMeaningPlural: 'অবারিত রহমত ও করুণাধারা',
    quranOccurrenceCountBn: '৩১৫ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
    quranicExamplePronunciationBn: 'ওয়া রহমাতী ওয়াসি‘আত কুল্লা শাই’',
    quranicExampleBn: 'আর আমার রহমত ও দয়া তো প্রতিটি বস্তুকে পরিবেষ্টন করে রয়েছে।',
    surahReferenceBn: 'সূরা আল-আ’রাফ: ১৫৬',
    asbabAlNuzulBn: 'গুনাহগার বান্দারা যখন নিজেদের ভুলের কারণে ক্ষমা পাওয়ার আশা ছেড়ে দেওয়ার উপক্রম হয়েছিল, তখন রাব্বুল আলামীন তাঁর অসীমতাপূর্ণ রহমতের দ্বার উন্মোচনের বার্তা দেন।',
    spiritualSignificanceBn: 'আল্লাহর অসীম রহমত ছাড়া কেবল নিজের আমলে কেউ জান্নাতে যেতে পারবে না, তাই সর্বাবস্থায় তওবা ও রহমত কামনা করা কর্তব্য।'
  },

  // -------------------------------------------------------------
  // ট্র্যাক ১: তাওহীদ ও আল্লাহর পরিচয় (Tawheed & Faith Track)
  // -------------------------------------------------------------
  {
    id: 9,
    trackId: 'tawheed',
    trackNameBn: 'ট্র্যাক ১: তাওহীদ ও আল্লাহর পরিচয়',
    stepNumber: 9,
    arabicSingular: 'رَبٌّ',
    bengaliPronunciationSingular: 'রব্বুন',
    bengaliMeaningSingular: 'একক প্রতিপালক, সৃষ্টিকর্তা ও লালনকারী',
    arabicPlural: 'أَرْبَابٌ',
    bengaliPronunciationPlural: 'আরবা-বুন',
    bengaliMeaningPlural: 'মিথ্যা উপাস্য বা তথাকথিত প্রভুগণ',
    quranOccurrenceCountBn: '৯৭৫ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    quranicExamplePronunciationBn: 'আলহামদু লিল্লা-হি রব্বিল ‘আ-লামীন',
    quranicExampleBn: 'যাবতীয় প্রশংসা একমাত্র আল্লাহর জন্য, যিনি সমগ্র বিশ্বজগতের প্রতিপালক।',
    surahReferenceBn: 'সূরা আল-ফাতিহা: ২',
    asbabAlNuzulBn: 'মহান রাব্বুল আলামীনের সার্বিক রবুবিয়াত ও সৃষ্টির প্রতি অফুরন্ত অনুগ্রহের শোকর আদায় শেখাতে এই আয়াত অবতীর্ণ হয়।',
    spiritualSignificanceBn: 'আল্লাহকে জীবনের একমাত্র রব মেনে নেওয়ার মধ্যেই আত্মার চূড়ান্ত মুক্তি ও শান্তি নিহিত।'
  },
  {
    id: 10,
    trackId: 'tawheed',
    trackNameBn: 'ট্র্যাক ১: তাওহীদ ও আল্লাহর পরিচয়',
    stepNumber: 10,
    arabicSingular: 'إِلَٰهٌ',
    bengaliPronunciationSingular: 'ইলা-হুন',
    bengaliMeaningSingular: 'একমাত্র সত্য উপাস্য ও মাবুদ',
    arabicPlural: 'آلِهَةٌ',
    bengaliPronunciationPlural: 'আ-লিহাতুন',
    bengaliMeaningPlural: 'বহু কাল্পনিক মিথ্যা মাবুদসমূহ',
    quranOccurrenceCountBn: '১৪৬ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ',
    quranicExamplePronunciationBn: 'ওয়া ইলা-হুকুম ইলা-হুওঁ ওয়া-হিদ, লা- ইলা-হা ইল্লা- হুওয়ার রহমা-নুর রহীম',
    quranicExampleBn: 'আর তোমাদের মাবুদ একমাত্র একক উপাস্য; তিনি ছাড়া কোনো ইলাহ নেই, তিনি পরম করুণাময়, অতি দয়ালু।',
    surahReferenceBn: 'সূরা আল-বাকারা: ১৬৩',
    asbabAlNuzulBn: 'কুরাইশ মুশরিকরা যখন রাসুল সা.-এর কাছে তাদের ৩৬০টি মূর্তির বদলে একজন একক রবের পরিচয় জানতে চায়, তখন তাওহীদের এই মূলবাণী নাজিল হয়।',
    spiritualSignificanceBn: 'কালিমা লা-ইলাহা ইল্লাল্লাহ মুমিনের জান্নাতের চাবিকাঠি।'
  },
  {
    id: 11,
    trackId: 'tawheed',
    trackNameBn: 'ট্র্যাক ১: তাওহীদ ও আল্লাহর পরিচয়',
    stepNumber: 11,
    arabicSingular: 'عَرْشٌ',
    bengaliPronunciationSingular: '‘আরশুন',
    bengaliMeaningSingular: 'মহান আল্লাহর সর্বোচ্চ সিংহাসন বা আরশ',
    arabicPlural: 'عُرُوشٌ',
    bengaliPronunciationPlural: '‘উরু-শুন',
    bengaliMeaningPlural: 'দুনিয়ার ধ্বংসপ্রাপ্ত সিংহাসন ও অট্টালিকাসমূহ',
    quranOccurrenceCountBn: '২৬ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ',
    quranicExamplePronunciationBn: 'আর-রহমা-নু ‘আলাল ‘আরশিস তাওয়া-',
    quranicExampleBn: 'পরম করুণাময় আল্লাহ আরশের উপর সমাসীন হয়েছেন।',
    surahReferenceBn: 'সূরা ত্বা-হা: ৫',
    asbabAlNuzulBn: 'মহাবিশ্ব সৃষ্টি শেষে রব্বুল আলামীনের সার্বভৌম ক্ষমতা ও সর্বোচ্চ মর্যাদার নিদর্শন হিসেবে এই আয়াত নাজিল হয়।',
    spiritualSignificanceBn: 'আরশের মালিকের বড়ত্ব অন্তরে স্থান দিলে দুনিয়ার সমস্ত ভয়-ভীতি দূর হয়ে যায়।'
  },

  // -------------------------------------------------------------
  // ট্র্যাক ২: আখলাক, সবর ও আত্মশুদ্ধি (Akhlaq Track)
  // -------------------------------------------------------------
  {
    id: 12,
    trackId: 'akhlaq',
    trackNameBn: 'ট্র্যাক ২: আখলাক ও আত্মশুদ্ধি',
    stepNumber: 12,
    arabicSingular: 'صَبْرٌ',
    bengaliPronunciationSingular: 'সবরুন',
    bengaliMeaningSingular: 'পরম ধৈর্য, আত্মসংযম ও অবিচলতা',
    arabicPlural: 'أَصْبَارٌ',
    bengaliPronunciationPlural: 'আসব্বা-রুন',
    bengaliMeaningPlural: 'বহুমাত্রিক ধৈর্যসমূহ',
    quranOccurrenceCountBn: '১০৩ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    quranicExamplePronunciationBn: 'ইয়া- আইয়ুহাল্লাযীনা আ-মানুস তা‘ঈনূ বিসসবরি ওয়াস সালা-হ, ইন্নাল্লা-হা মা‘আস স-বিরীন',
    quranicExampleBn: 'হে মুমিনগণ! তোমরা ধৈর্য ও সালাতের মাধ্যমে সাহায্য প্রার্থনা করো; নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।',
    surahReferenceBn: 'সূরা আল-বাকারা: ১৫৩',
    asbabAlNuzulBn: 'মদীনায় যখন কিবলা পরিবর্তন হয় এবং সাহাবীদের নানা প্রতিকূলতা ও যুদ্ধের মুখোমুখি হতে হচ্ছিল, তখন আল্লাহ এই পরম সান্ত্বনা অবতীর্ণ করেন।',
    spiritualSignificanceBn: 'সবর হলো ঈমানের অর্ধেক। যেকোনো বিপদ ও পরীক্ষার সময় সবরকারীকে আল্লাহ অগণিত প্রতিদান দেন।'
  },
  {
    id: 13,
    trackId: 'akhlaq',
    trackNameBn: 'ট্র্যাক ২: আখলাক ও আত্মশুদ্ধি',
    stepNumber: 13,
    arabicSingular: 'شُكْرٌ',
    bengaliPronunciationSingular: 'শুকরুন',
    bengaliMeaningSingular: 'রবের প্রতি অন্তরের কৃতজ্ঞতা ও শোকর',
    arabicPlural: 'أَشْكَارٌ',
    bengaliPronunciationPlural: 'আশকা-রুন',
    bengaliMeaningPlural: 'অসংখ্য কৃতজ্ঞতাপ্রকাশ',
    quranOccurrenceCountBn: '৭৫ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
    quranicExamplePronunciationBn: 'লায়িন শাকারতুম লা’আযীদান্নাকুম, ওয়া লায়িন কাফারতুম ইন্না ‘আযা-বী লাশাদীদ',
    quranicExampleBn: 'যদি তোমরা কৃতজ্ঞতা স্বীকার করো, তবে আমি অবশ্যই তোমাদের নিয়ামত বাড়িয়ে দেবো; আর যদি অকৃতজ্ঞ হও, তবে নিশ্চয়ই আমার শাস্তি অতি কঠোর।',
    surahReferenceBn: 'সূরা ইবরাহীম: ৭',
    asbabAlNuzulBn: 'বনী ইসরাঈল যখন ফেরাউনের দাসত্ব থেকে মুক্তি পেয়ে আল্লাহর অফুরন্ত নিয়ামতের শোকর ভুলে যাচ্ছিল, তখন মুসা আ.-এর মাধ্যমে এই সতর্কবার্তা দেওয়া হয়।',
    spiritualSignificanceBn: 'শোকর আদায়ের মাধ্যমে অর্জিত নিয়ামত স্থায়ী হয় এবং অপ্রাপ্ত নিয়ামত হস্তগত হয়।'
  },
  {
    id: 14,
    trackId: 'akhlaq',
    trackNameBn: 'ট্র্যাক ২: আখলাক ও আত্মশুদ্ধি',
    stepNumber: 14,
    arabicSingular: 'تَوْبَةٌ',
    bengaliPronunciationSingular: 'তাওবাতুন',
    bengaliMeaningSingular: 'খাঁটি অনুশোচনা ও রবের দিকে প্রত্যাবর্তন',
    arabicPlural: 'تَوْبَاتٌ',
    bengaliPronunciationPlural: 'তাওবা-তুন',
    bengaliMeaningPlural: 'বারংবার ক্ষমা প্রার্থনা',
    quranOccurrenceCountBn: '৮৭ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا',
    quranicExamplePronunciationBn: 'ইয়া- আইয়ুহাল্লাযীনা আ-মানূ তূবূ- ইলাল্লা-হি তাওবাতান নাসূহা-',
    quranicExampleBn: 'হে মুমিনগণ! তোমরা আল্লাহর নিকট খাঁটি তাওবা করো, যাতে তোমাদের রব তোমাদের পাপগুলো মুছে দেন।',
    surahReferenceBn: 'সূরা আত-তাহরীম: ৮',
    asbabAlNuzulBn: 'বান্দার গুনাহ যতই হোক না কেন, মন থেকে লজ্জিত হয়ে পুনরায় পাপে লিপ্ত না হওয়ার সংকল্প করলে রবের ক্ষমার দরজা সদা উন্মুক্ত থাকার নিশ্চয়তা হিসেবে এই আয়াত নাজিল হয়।',
    spiritualSignificanceBn: 'তাওবা অতীতের পাপ ধুয়ে হৃদয়কে নবজাতক শিশুর মতো নির্মল করে দেয়।'
  },

  // -------------------------------------------------------------
  // ট্র্যাক ৩: কুরআন ও রিসালাত (Prophethood Track)
  // -------------------------------------------------------------
  {
    id: 15,
    trackId: 'risalat',
    trackNameBn: 'ট্র্যাক ৩: কুরআন ও রিসালাত',
    stepNumber: 15,
    arabicSingular: 'رَسُولٌ',
    bengaliPronunciationSingular: 'রাসূলুন',
    bengaliMeaningSingular: 'আল্লাহর প্রেরিত পয়গম্বর বা বার্তাবাহক',
    arabicPlural: 'رُسُلٌ',
    bengaliPronunciationPlural: 'রুসুলুন',
    bengaliMeaningPlural: 'আল্লাহর সকল প্রেরিত রাসূলগণ',
    quranOccurrenceCountBn: '৫১৩ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'مُّحَمَّدٌ رَّسُولُ اللَّهِ ۚ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ',
    quranicExamplePronunciationBn: 'মুহাম্মাদুর রাসুলুল্লা-হ, ওয়াল্লাযীনা মা‘আহূ- আশিদ্দা-উ ‘আলাল কুফফা-রি রুহামা-উ বাইনাহুম',
    quranicExampleBn: 'মুহাম্মদ আল্লাহর রাসূল; এবং তাঁর সাথে যারা রয়েছে তারা কাফেরদের প্রতি কঠোর, নিজেদের পরস্পরের প্রতি অত্যন্ত দয়ালু।',
    surahReferenceBn: 'সূরা আল-ফাতহ: ২৯',
    asbabAlNuzulBn: 'হুদায়বিয়ার সন্ধির পর সাহাবায়ে কেরামের উন্নত চরিত্র ও রাসুল সা.-এর চিরন্তন নবুওয়াতের চূড়ান্ত সাক্ষ্য হিসেবে এই ঐতিহাসিক আয়াত অবতীর্ণ হয়।',
    spiritualSignificanceBn: 'রাসূল সা.-এর সুন্নাহ অনুসরণ ছাড়া রবের ভালোবাসা অর্জন অসম্ভব।'
  },
  {
    id: 16,
    trackId: 'risalat',
    trackNameBn: 'ট্র্যাক ৩: কুরআন ও রিসালাত',
    stepNumber: 16,
    arabicSingular: 'حِكْمَةٌ',
    bengaliPronunciationSingular: 'হিকমাতুন',
    bengaliMeaningSingular: 'প্রজ্ঞা, গভীর তত্ত্বজ্ঞান ও অন্তর্দৃষ্টি',
    arabicPlural: 'حِكَمٌ',
    bengaliPronunciationPlural: 'হিকামুন',
    bengaliMeaningPlural: 'বহুমুখী প্রজ্ঞাসমূহ',
    quranOccurrenceCountBn: '২০ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ ۚ وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا',
    quranicExamplePronunciationBn: 'ইউ’তিল হিকমাতা মাইঁ ইয়াশা-’, ওয়া মাইঁ ইউ’তাল হিকমাতা ফাক্বাদ ঊতিয়া খাইরান কাছীরা-',
    quranicExampleBn: 'তিনি যাকে ইচ্ছা হিকমত বা প্রজ্ঞা দান করেন; আর যাকে প্রজ্ঞা দেওয়া হয়েছে, তাকে নিশ্চয়ই বিপুল কল্যাণ দান করা হয়েছে।',
    surahReferenceBn: 'সূরা আল-বাকারা: ২৬৯',
    asbabAlNuzulBn: 'ধন-সম্পদের বাহ্যিক প্রাচুর্যের চেয়ে সঠিক সময়ে সঠিক সিদ্ধান্তের দ্বীনি বোঝাপড়া যে আল্লাহর শ্রেষ্ঠ দান, তা স্মরণ করিয়ে দেওয়ার উদ্দেশ্যে এই আয়াত অবতীর্ণ হয়।',
    spiritualSignificanceBn: 'প্রজ্ঞা মুমিনের হারানো সম্পদ, যেখানেই তা মেলে তা গ্রহণ করা কর্তব্য।'
  },

  // -------------------------------------------------------------
  // ট্র্যাক ৪: নিয়ামত ও আখেরাত (Hereafter Track)
  // -------------------------------------------------------------
  {
    id: 17,
    trackId: 'hereafter',
    trackNameBn: 'ট্র্যাক ৪: নিয়ামত ও আখেরাত',
    stepNumber: 17,
    arabicSingular: 'مَوْتٌ',
    bengaliPronunciationSingular: 'মাওতুন',
    bengaliMeaningSingular: 'পার্থিব জীবনের অবসান বা মৃত্যু',
    arabicPlural: 'أَمْوَاتٌ',
    bengaliPronunciationPlural: 'আমওয়া-তুন',
    bengaliMeaningPlural: 'মৃত ব্যক্তিগণ',
    quranOccurrenceCountBn: '১৬১ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۖ ثُمَّ إِلَيْنَا تُرْجَعُونَ',
    quranicExamplePronunciationBn: 'কুল্লু নাফসিন যা-ইক্বাতুল মাওত, ছুম্মা ইলাইনা- তুরজা‘ঊন',
    quranicExampleBn: 'প্রতিটি প্রাণীকে মৃত্যুর স্বাদ গ্রহণ করতে হবে; অতঃপর তোমরা আমারই কাছে প্রত্যাবর্তিত হবে।',
    surahReferenceBn: 'সূরা আল-আনকাবুত: ৫৭',
    asbabAlNuzulBn: 'মক্কার দুর্বল মুসলিমরা যখন কাফেরদের নির্যাতনের ভয়ে হিজরত করতে দ্বিধাবোধ করছিল, তখন আল্লাহ জানান মৃত্যুর স্থান নির্দিষ্ট, তাই ঈমানের উপর অবিচল থাকাই শ্রেয়।',
    spiritualSignificanceBn: 'মৃত্যুর স্মরণ দুনিয়ার মোহ দূর করে ও আখিরাতের প্রস্তুতি নিতে জাগ্রত করে।'
  },
  {
    id: 18,
    trackId: 'hereafter',
    trackNameBn: 'ট্র্যাক ৪: নিয়ামত ও আখেরাত',
    stepNumber: 18,
    arabicSingular: 'مِيزَانٌ',
    bengaliPronunciationSingular: 'মীযা-নুন',
    bengaliMeaningSingular: 'আমল পরিমাপক দাঁড়িপাল্লা বা তুলাদণ্ড',
    arabicPlural: 'مَوَازِينُ',
    bengaliPronunciationPlural: 'মাওয়া-যীনু',
    bengaliMeaningPlural: 'ন্যায়বিচারের মানদণ্ডসমূহ',
    quranOccurrenceCountBn: '২৩ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'وَنَضَعُ الْمَوَازِينَ الْقِسْطَ لِيَوْمِ الْقِيَامَةِ فَلَا تُظْلَمُ نَفْسٌ شَيْئًا',
    quranicExamplePronunciationBn: 'ওয়া নাদ্বা‘উল মাওয়া-যীনাল ক্বিসত্বা লিইয়াওমিল ক্বিয়া-মাতি ফালা- তুজলামু নাফসুন শাই’আ-',
    quranicExampleBn: 'আর আমি কেয়ামতের দিন ন্যায়বিচারের মানদণ্ডসমূহ স্থাপন করব; সুতরাং কারো প্রতি বিন্দুমাত্র অবিচার করা হবে না।',
    surahReferenceBn: 'সূরা আল-আম্বিয়া: ৪৭',
    asbabAlNuzulBn: 'জালেমরা যেন মনে না করে তাদের জুলুমের বিচার হবে না, সেই প্রেক্ষাপটে সরিষার দানার সমান সৎ ও অসৎ কাজেরও নিখুঁত ওজনের ঘোষণা দেওয়া হয়।',
    spiritualSignificanceBn: 'সুভাষণ, সুন্দর চরিত্র ও যিকির মিজানের পাল্লাকে অত্যন্ত ভারী করে।'
  }
];

interface Props {
  lang: 'bn' | 'en' | 'ar';
}

export const ArabicLearningCard: React.FC<Props> = ({ lang }) => {
  // Selected Track
  const [selectedTrack, setSelectedTrack] = useState<string>('foundation');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Learned IDs stored in localStorage
  const [learnedIds, setLearnedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('learned_arabic_words');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Track completion states
  const foundationIds = [1, 2, 3, 4, 5, 6, 7, 8];
  const isFoundationComplete = foundationIds.every(id => learnedIds.includes(id));
  const completedFoundationCount = foundationIds.filter(id => learnedIds.includes(id)).length;

  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('learned_arabic_words', JSON.stringify(learnedIds));
    } catch (e) {}
  }, [learnedIds]);

  // Filter words by track
  const currentTrackWords = ARABIC_VOCABULARY_LIST.filter(item => {
    if (selectedTrack === 'all') return true;
    return item.trackId === selectedTrack;
  });

  const activeItem = currentTrackWords[currentIndex] || currentTrackWords[0] || ARABIC_VOCABULARY_LIST[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentTrackWords.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentTrackWords.length) % currentTrackWords.length);
  };

  const toggleLearned = (id: number) => {
    setLearnedIds(prev => {
      const isAlreadyLearned = prev.includes(id);
      const nextList = isAlreadyLearned ? prev.filter(item => item !== id) : [...prev, id];
      
      // Check if this action completes the foundation track 1-8
      const nowFoundationComplete = foundationIds.every(fid => nextList.includes(fid));
      if (!isAlreadyLearned && nowFoundationComplete && !isFoundationComplete) {
        setShowCelebrationModal(true);
      }
      return nextList;
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // slightly slower for clean pronunciation
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-emerald-700/60 relative overflow-hidden space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-700/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-emerald-50 flex items-center gap-2 flex-wrap">
              <span>প্রতিদিন সহজ আরবি ভাষা শিক্ষা</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-extrabold shadow-sm">
                একবচন • বহুবচন • শানে নুযূল
              </span>
            </h3>
            <p className="text-xs text-emerald-200/90 font-medium">
              আরবি শব্দের বাংলা উচ্চারণ ও অর্থ, দৃষ্টান্ত আয়াত, শানে নুযূল ও বহুস্তরের প্রগ্রেসিভ ট্র্যাক
            </p>
          </div>
        </div>

        {/* Global Progress Counter */}
        <div className="flex items-center gap-2 bg-emerald-950/90 px-3 py-1.5 rounded-xl border border-emerald-600/50 self-start sm:self-auto shadow">
          <Award className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold text-emerald-100">
            মোট আয়ত্ত: <span className="text-amber-300 font-bold">{toBengaliDigits(learnedIds.length)}</span> / {toBengaliDigits(ARABIC_VOCABULARY_LIST.length)}
          </span>
        </div>
      </div>

      {/* TRACK NAVIGATION PILLS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>শিক্ষণীয় ট্র্যাক নির্বাচন করুন:</span>
          </span>
          <span className="text-[11px] text-amber-300 font-medium">
            বুনিয়াদি সম্পন্ন: {toBengaliDigits(completedFoundationCount)}/৮ {isFoundationComplete ? '✓ (আনলকড)' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {ARABIC_LEARNING_TRACKS.map(track => {
            const isSelected = selectedTrack === track.id;
            const isLocked = track.reqFoundation && !isFoundationComplete;
            
            return (
              <button
                key={track.id}
                onClick={() => {
                  setSelectedTrack(track.id);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : isLocked
                    ? 'bg-emerald-950/70 text-emerald-400/80 border border-emerald-800 hover:bg-emerald-900/60'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60'
                }`}
              >
                <span>{track.icon}</span>
                <span>{track.name}</span>
                {isLocked && <Lock className="w-3 h-3 text-amber-300/80" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Foundation Track Progress Bar (ধাপ ১-৮ আয়ত্তের অগ্রগতি) */}
      <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/40 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-emerald-200 flex items-center gap-1">
            <span>ধাপ ১-৮ বুনিয়াদি অগ্রগতি:</span>
            <span className="font-mono text-amber-300">{toBengaliDigits(completedFoundationCount)}/৮ সম্পন্ন</span>
          </span>
          {isFoundationComplete ? (
            <span className="text-amber-300 font-bold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>মাশাআল্লাহ! পরবর্তী সকল ট্র্যাক উন্মুক্ত হয়েছে</span>
            </span>
          ) : (
            <span className="text-gray-300 text-[10px]">
              ধাপ ১-৮ সম্পন্ন হলে পরবর্তী উন্নত ট্র্যাক স্বয়ংক্রিয়ভাবে খুলে যাবে
            </span>
          )}
        </div>

        {/* 8-Step Visual Dots */}
        <div className="grid grid-cols-8 gap-1.5 pt-0.5">
          {foundationIds.map((stepId) => {
            const isDone = learnedIds.includes(stepId);
            return (
              <div
                key={stepId}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                    : 'bg-emerald-800/80'
                }`}
                title={`ধাপ ${stepId}: ${isDone ? 'সম্পন্ন' : 'বাকি'}`}
              />
            );
          })}
        </div>
      </div>

      {/* MAIN VOCABULARY CARD */}
      {activeItem && (
        <div className="bg-emerald-950/90 rounded-2xl p-4 sm:p-5 border-2 border-amber-400/40 space-y-4 relative shadow-2xl">
          
          {/* Card Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 shadow-sm">
                ধাপ {toBengaliDigits(activeItem.stepNumber)} • {activeItem.trackNameBn}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900 text-emerald-200 border border-emerald-700">
                {activeItem.category}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-900/80 text-amber-300 border border-amber-400/30">
                📖 কুরআনে এসেছে: {activeItem.quranOccurrenceCountBn}
              </span>
            </div>

            {/* Toggle Learned Button */}
            <button
              onClick={() => toggleLearned(activeItem.id)}
              className={`text-xs flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-bold transition cursor-pointer shadow-md ${
                learnedIds.includes(activeItem.id)
                  ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300/60'
                  : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border-emerald-700 hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${learnedIds.includes(activeItem.id) ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>{learnedIds.includes(activeItem.id) ? 'আয়ত্ত করা হয়েছে ✓' : 'আয়ত্ত করেছি চিহ্নিত করুন'}</span>
            </button>
          </div>

          {/* Word Comparison Box: Singular (একবচন) vs Plural (বহুবচন) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Singular Box (একবচন) */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-4 rounded-xl border border-emerald-600/70 relative space-y-2.5 shadow-md">
              <div className="flex justify-between items-center border-b border-emerald-800 pb-1.5">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700">
                  একবচন (المُفْرَد)
                </span>
                <button
                  onClick={() => speakText(activeItem.arabicSingular)}
                  className="px-2 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="আরবি উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-bold text-amber-300 font-arabic tracking-wide" dir="rtl">
                  {activeItem.arabicSingular}
                </span>
              </div>

              <div className="space-y-1.5 text-xs border-t border-emerald-800/80 pt-2.5">
                <div className="text-emerald-200">
                  <span className="text-gray-400 font-medium">বাংলা উচ্চারণ: </span>
                  <span className="text-amber-200 font-extrabold text-sm">{activeItem.bengaliPronunciationSingular}</span>
                </div>
                <div className="text-emerald-100">
                  <span className="text-gray-400 font-medium">একবচনে অর্থ: </span>
                  <span className="text-white font-extrabold">{activeItem.bengaliMeaningSingular}</span>
                </div>
              </div>
            </div>

            {/* Plural Box (বহুবচন) */}
            <div className="bg-gradient-to-br from-teal-950 to-emerald-950 p-4 rounded-xl border border-teal-600/70 relative space-y-2.5 shadow-md">
              <div className="flex justify-between items-center border-b border-teal-800 pb-1.5">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-700">
                  বহুবচন (الجَمْع)
                </span>
                <button
                  onClick={() => speakText(activeItem.arabicPlural)}
                  className="px-2 py-1 rounded-lg bg-teal-900 hover:bg-teal-800 text-teal-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="আরবি উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>উচ্চারণ শুনুন</span>
                </button>
              </div>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-bold text-teal-200 font-arabic tracking-wide" dir="rtl">
                  {activeItem.arabicPlural}
                </span>
              </div>

              <div className="space-y-1.5 text-xs border-t border-teal-800/80 pt-2.5">
                <div className="text-teal-200">
                  <span className="text-gray-400 font-medium">বাংলা উচ্চারণ: </span>
                  <span className="text-teal-100 font-extrabold text-sm">{activeItem.bengaliPronunciationPlural}</span>
                </div>
                <div className="text-teal-100">
                  <span className="text-gray-400 font-medium">বহুবচনে অর্থ: </span>
                  <span className="text-white font-extrabold">{activeItem.bengaliMeaningPlural}</span>
                </div>
              </div>
            </div>

          </div>

          {/* QURANIC EXAMPLE VERSE (আরবি দৃষ্টান্ত আয়াত, বাংলা উচ্চারণ ও সরল অনুবাদ) */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 p-4 rounded-2xl border-2 border-emerald-600/80 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>কুরআনে শব্দটির প্রয়োগ ও দৃষ্টান্ত আয়াত:</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-lg border border-amber-400/40 font-mono">
                  {activeItem.surahReferenceBn}
                </span>
                <button
                  onClick={() => speakText(activeItem.quranicExampleAr)}
                  className="px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs flex items-center gap-1 cursor-pointer transition"
                  title="আয়াত তিলাওয়াত শুনুন"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>তিলাওয়াত</span>
                </button>
              </div>
            </div>

            {/* Arabic Verse */}
            <div className="text-right text-xl sm:text-2xl font-bold text-amber-200 font-arabic leading-loose py-1" dir="rtl">
              {activeItem.quranicExampleAr}
            </div>

            {/* Bengali Pronunciation of the Verse */}
            <div className="text-xs sm:text-sm text-amber-300 font-medium leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
              <strong className="text-teal-300 block mb-0.5">বাংলা উচ্চারণ:</strong>
              "{activeItem.quranicExamplePronunciationBn}"
            </div>

            {/* Simple Bengali Translation */}
            <div className="text-xs sm:text-sm text-emerald-100 leading-relaxed bg-emerald-900/40 p-2.5 rounded-xl border border-white/5">
              <strong className="text-amber-400 block mb-0.5">সরল অনুবাদ:</strong>
              "{activeItem.quranicExampleBn}"
            </div>
          </div>

          {/* Asbab-al-Nuzul (শানে নুযূল) & Spiritual Significance (তাৎপর্য ও ফজিলত) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Asbab Al Nuzul Box */}
            <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-amber-400/30 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>📜 অবতীর্ণের প্রেক্ষাপট ও শানে নুযূল:</span>
              </div>
              <p className="text-emerald-100 leading-relaxed">
                {activeItem.asbabAlNuzulBn}
              </p>
            </div>

            {/* Spiritual Significance & Virtues */}
            <div className="bg-amber-400/10 p-3.5 rounded-xl border border-amber-400/30 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>💡 তাৎপর্য, ফজিলত ও আমল:</span>
              </div>
              <p className="text-amber-100/90 leading-relaxed">
                {activeItem.spiritualSignificanceBn}
              </p>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-emerald-800/60">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs transition cursor-pointer border border-emerald-600 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>পূর্ববর্তী শব্দ</span>
            </button>

            <span className="text-xs font-mono font-bold text-amber-300">
              {toBengaliDigits(currentIndex + 1)} / {toBengaliDigits(currentTrackWords.length)}
            </span>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer border border-amber-300 shadow-md flex items-center gap-1"
            >
              <span>পরবর্তী শব্দ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* TRACK WORDS QUICK SELECTOR GRID */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-emerald-300 block">
          বর্তমান ট্র্যাকের শব্দ তালিকা (সরাসরি পড়তে চাপুন):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {currentTrackWords.map((item, idx) => {
            const isLearned = learnedIds.includes(item.id);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer relative ${
                  isCurrent
                    ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/50 text-amber-200'
                    : isLearned
                    ? 'bg-emerald-900/90 border-emerald-600 text-emerald-100'
                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-gray-300">
                    #{toBengaliDigits(item.stepNumber)}
                  </span>
                  {isLearned && (
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="text-sm font-bold font-arabic mt-1" dir="rtl">
                  {item.arabicSingular} ({item.arabicPlural})
                </div>
                <div className="text-[11px] text-emerald-300 truncate mt-0.5 font-medium">
                  {item.bengaliMeaningSingular}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1-8 COMPLETION CELEBRATION MODAL */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-b from-emerald-900 to-slate-950 border-2 border-amber-400 text-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-amber-400/40 animate-bounce">
              🏆
            </div>

            <h3 className="text-xl font-black text-amber-300">
              আলহামদুলিল্লাহ! ধাপ ১-৮ সম্পন্ন হয়েছে!
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              আপনি বুনিয়াদি ৮টি কুরআনিক শব্দ, তাদের একক ও বহুবচন, দৃষ্টান্ত আয়াত ও শানে নুযূল সফলভাবে আয়ত্ত করেছেন। আপনার জন্য নতুন ৪টি বিশেষ ট্র্যাক উন্মুক্ত করা হয়েছে:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-left">
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-amber-400/40 text-amber-200">
                ☝️ তাওহীদ ও আল্লাহর পরিচয়
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-amber-400/40 text-amber-200">
                🤍 আখলাক ও আত্মশুদ্ধি
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-amber-400/40 text-amber-200">
                📖 কুরআন ও রিসালাত
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-amber-400/40 text-amber-200">
                🕊️ নিয়ামত ও আখেরাত
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setShowCelebrationModal(false);
                  setSelectedTrack('tawheed');
                  setCurrentIndex(0);
                }}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg"
              >
                পরবর্তী ট্র্যাকে যান →
              </button>
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="px-4 py-3 rounded-xl bg-emerald-900 text-emerald-200 text-xs font-bold cursor-pointer hover:bg-emerald-800"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
