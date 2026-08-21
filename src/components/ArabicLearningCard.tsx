import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, CheckCircle2, ChevronRight, Award, HelpCircle, ShieldAlert, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface ArabicWordItem {
  id: number;
  arabicSingular: string;               // একবচন (المُفْرَد)
  bengaliPronunciationSingular: string; // একবচনের উচ্চারণ
  bengaliMeaningSingular: string;       // একবচনের বাংলা অর্থ
  arabicPlural: string;                 // বহুবচন (الجَمْع)
  bengaliPronunciationPlural: string;   // বহুবচনের উচ্চারণ
  bengaliMeaningPlural: string;         // বহুবচনের বাংলা অর্থ
  quranOccurrenceCountBn: string;       // কুরআনে উল্লেখ সংখ্যা (যেমন: ২৬১ বার)
  category: 'কুরআনিক শব্দ' | 'দৈনন্দিন ব্যবহার' | 'আখলাক ও ঈমান' | 'ইবাদত ও সালাত';
  quranicExampleAr: string;
  quranicExampleBn: string;
  surahReferenceBn: string;
  asbabAlNuzulBn: string;               // শানে নুযূল (অবতীর্ণের পটভূমি)
  spiritualSignificanceBn: string;       // তাৎপর্য ও ফজিলত
}

const ARABIC_VOCABULARY_LIST: ArabicWordItem[] = [
  {
    id: 1,
    arabicSingular: 'كِتَابٌ',
    bengaliPronunciationSingular: 'কিতাবুন',
    bengaliMeaningSingular: 'একটি বই বা লিখিত গ্রন্থ',
    arabicPlural: 'كُتُبٌ',
    bengaliPronunciationPlural: 'কুতুবুন',
    bengaliMeaningPlural: 'একাধিক বই বা আসমানী গ্রন্থসমূহ',
    quranOccurrenceCountBn: '২৬১ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ هُدًى لِّلْمُتَّقِينَ',
    quranicExampleBn: 'এটা সেই কিতাব; এতে কোনো সন্দেহ নেই, মুত্তাকীদের জন্য হেদায়েত।',
    surahReferenceBn: 'সূরা আল-বাকারা: ২',
    asbabAlNuzulBn: 'মক্কার মুশরিক ও আহলে কিতাবগণ যখন রাসুলুল্লাহ সা.-এর নবুওয়াত ও আসমানী কিতাবের সত্যতা পরীক্ষা করার জন্য জটিল প্রশ্ন করেছিল, তখন এই আয়াতের মাধ্যমে কুরআনের নিঃসংশয় সত্যতার চূড়ান্ত ঘোষণা দেওয়া হয়।',
    spiritualSignificanceBn: 'পবিত্র কুরআন মানবজাতির হেদায়েতের একমাত্র নির্ভুল পথ নির্দেশক। প্রতিদিন কুরআন তিলাওয়াত ও গবেষণায় অন্তরে ঈমানী নূর বৃদ্ধি পায়।'
  },
  {
    id: 2,
    arabicSingular: 'قَلْبٌ',
    bengaliPronunciationSingular: 'কালবুন',
    bengaliMeaningSingular: 'একটি হৃদয় বা একটি অন্তর',
    arabicPlural: 'قُلُوبٌ',
    bengaliPronunciationPlural: 'কূলুবুন',
    bengaliMeaningPlural: 'মানবজাতির সকল হৃদয় বা অন্তরসমূহ',
    quranOccurrenceCountBn: '১৩২ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    quranicExampleBn: 'জেনে রাখো, আল্লাহর জিকির ও স্মরণের মাধ্যমেই কেবল অন্তরসমূহ প্রশান্ত হয়।',
    surahReferenceBn: 'সূরা আর-রা’দ: ২৮',
    asbabAlNuzulBn: 'সাহাবায়ে কেরাম যখন পার্থিব দুশ্চিন্তা ও মানসিক অস্থিরতা কাটিয়ে অন্তরের পরম প্রশান্তি লাভের উপায় জানতে চান, তখন আল্লাহ তাআলা সার্বক্ষণিক জিকিরের এই সুসংবাদ অবতীর্ণ করেন।',
    spiritualSignificanceBn: 'অন্তর মানবদেহের বাদশাহস্বরূপ। অন্তরের কলুষতা দূর করতে ইসতিগফার ও ইবাদত অপরিহার্য।'
  },
  {
    id: 3,
    arabicSingular: 'آيَةٌ',
    bengaliPronunciationSingular: 'আয়াতুন',
    bengaliMeaningSingular: 'একটি নিদর্শন বা কুরআনের একটি বাক্য',
    arabicPlural: 'آيَاتٌ',
    bengaliPronunciationPlural: 'আয়াতুন',
    bengaliMeaningPlural: 'অসংখ্য অলৌকিক নিদর্শনাবলী বা কুরআনের আয়াতসমূহ',
    quranOccurrenceCountBn: '৩৮২ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'تِلْكَ آيَاتُ اللَّهِ نَتْلُوهَا عَلَيْكَ بِالْحَقِّ',
    quranicExampleBn: 'এগুলো আল্লাহর সত্য নিদর্শন বা আয়াত, যা আমি আপনার নিকট সত্যসহ তিলাওয়াত করছি।',
    surahReferenceBn: 'সূরা আল-বাকারা: ২৫২',
    asbabAlNuzulBn: 'মক্কার কাফেররা যখন নবুওয়াতের অলৌকিক মোজেজা দাবি করত, তখন আল্লাহ জানান যে মহাবিশ্বের প্রতিটি সৃষ্টি ও কুরআনের প্রতিটি বাক্যই তাঁর একত্ববাদের সত্য দলিল।',
    spiritualSignificanceBn: 'কুরআনের একটি আয়াত তিলাওয়াত করলেও ১০টি নেকী অর্জিত হয় এবং মানসিক প্রশান্তি মেলে।'
  },
  {
    id: 4,
    arabicSingular: 'نُورٌ',
    bengaliPronunciationSingular: 'নূরুন',
    bengaliMeaningSingular: 'দিব্য আলো বা আলোকচ্ছটা',
    arabicPlural: 'أَنْوَارٌ',
    bengaliPronunciationPlural: 'আনওয়ারুন',
    bengaliMeaningPlural: 'বহুমুখী জ্যোতি বা দ্যুতিসমূহ',
    quranOccurrenceCountBn: '৪৯ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
    quranicExampleBn: 'আল্লাহ আসমানসমূহ ও জমিনের বিশেষ জ্যোতি বা নূর।',
    surahReferenceBn: 'সূরা আন-নূর: ৩৫',
    asbabAlNuzulBn: 'ঈমানের আলো কীভাবে মুমিনের অন্তরে প্রবেশ করে তা বোঝাতে ও অন্ধকারের শিরক থেকে মুক্ত করার প্রেক্ষাপটে এই বিখ্যাত তমসানাশক আয়াত নাজিল হয়।',
    spiritualSignificanceBn: 'নিয়মিত সালাত ও তিলাওয়াতের মাধ্যমে মুমিনের চেহারায় ও অন্তরে কেয়ামতের দিন নূর চমকাবে।'
  },
  {
    id: 5,
    arabicSingular: 'صَلَاةٌ',
    bengaliPronunciationSingular: 'সালাতুন',
    bengaliMeaningSingular: 'এক ওয়াক্তের নামাজ বা প্রার্থনা',
    arabicPlural: 'صَلَوَاتٌ',
    bengaliPronunciationPlural: 'সালাওয়াতুন',
    bengaliMeaningPlural: 'পঞ্চওয়াক্ত ও নফল নামাজসমূহ',
    quranOccurrenceCountBn: '৯৯ বার',
    category: 'ইবাদত ও সালাত',
    quranicExampleAr: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
    quranicExampleBn: 'নিশ্চয়ই সালাত মানুষকে যেকোনো অশ্লীল ও গর্হিত কাজ থেকে বিরত রাখে।',
    surahReferenceBn: 'সূরা আল-আনকাবুত: ৪৫',
    asbabAlNuzulBn: 'এক আনসার যুবক রাসুল সা.-এর পিছনে সালাত আদায় করত আবার নানা পাপে লিপ্ত হতো; রাসুল সা. বললেন তার সালাতই তাকে একদিন সংশোধন করবে, তখন এই আয়াত নাজিল হয়।',
    spiritualSignificanceBn: 'সালাত হলো মুমিনের মিরাজ ও ঈমানের প্রধান স্তম্ভ। কেয়ামতের দিন প্রথম হিসাব হবে সালাতের।'
  },
  {
    id: 6,
    arabicSingular: 'عَبْدٌ',
    bengaliPronunciationSingular: 'আবদুন',
    bengaliMeaningSingular: 'একজন অনুগত বান্দা বা দাস',
    arabicPlural: 'عِبَادٌ',
    bengaliPronunciationPlural: 'ইবাদুন',
    bengaliMeaningPlural: 'আল্লাহর অনুগত বান্দাগণ',
    quranOccurrenceCountBn: '২৭৫ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    quranicExampleBn: 'আর যখন আমার বান্দাগণ আপনার কাছে আমার সম্পর্কে জিজ্ঞেস করে, আমি তো অত্যন্ত কাছেই আছি।',
    surahReferenceBn: 'সূরা আল-বাকারা: ১৮৬',
    asbabAlNuzulBn: 'একজন বেদুইন এসে রাসুল সা.-কে জিজ্ঞেস করেছিল, "আমাদের রব কি নিকটে যে চুপিসারে ডাকব, নাকি দূরে যে চিৎকার করব?" তখন এই আয়াত অবতীর্ণ হয়।',
    spiritualSignificanceBn: 'আল্লাহর সবচেয়ে প্রিয় উপাধি "বান্দা"। ব্যাকুল মনে দোয়া করলে আল্লাহ বান্দার ডাক শোনেন।'
  },
  {
    id: 7,
    arabicSingular: 'جَنَّةٌ',
    bengaliPronunciationSingular: 'জান্নাতুন',
    bengaliMeaningSingular: 'একটি মনোরম বাগান বা বেহেশত',
    arabicPlural: 'جَنَّاتٌ',
    bengaliPronunciationPlural: 'জান্নাতুন',
    bengaliMeaningPlural: 'নিয়ামতে ভরা চিরস্থায়ী জান্নাতসমূহ',
    quranOccurrenceCountBn: '১৪৭ বার',
    category: 'কুরআনিক শব্দ',
    quranicExampleAr: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتُ النَّعِيمِ',
    quranicExampleBn: 'নিশ্চয়ই যারা ঈমান আনে ও সৎকর্ম করে, তাদের জন্য রয়েছে নিয়ামতে ভরা জান্নাত।',
    surahReferenceBn: 'সূরা লুকমান: ৮',
    asbabAlNuzulBn: 'কাফেররা যখন মুমিনদের দারিদ্র্য নিয়ে উপহাস করত, তখন আল্লাহ তাআলা আখেরাতে সৎকর্মশীল সাহাবীদের জন্য অসীম নিয়ামতের জান্নাতের সুসংবাদ দেন।',
    spiritualSignificanceBn: 'জান্নাত অর্জনে ঈমানের সাথে সাথে নেক আমল ও রবের সন্তুষ্টি আবশ্যক।'
  },
  {
    id: 8,
    arabicSingular: 'رَحْمَةٌ',
    bengaliPronunciationSingular: 'রহমাতুন',
    bengaliMeaningSingular: 'এক বিশেষ দয়া বা করুণা',
    arabicPlural: 'رَحَمَاتٌ',
    bengaliPronunciationPlural: 'রহমাতুন',
    bengaliMeaningPlural: 'অবারিত রহমত ও করুণাধারা',
    quranOccurrenceCountBn: '৩১৫ বার',
    category: 'আখলাক ও ঈমান',
    quranicExampleAr: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
    quranicExampleBn: 'আর আমার রহমত ও দয়া তো প্রতিটি বস্তুকে পরিবেষ্টন করে রয়েছে।',
    surahReferenceBn: 'সূরা আল-আ’রাফ: ১৫৬',
    asbabAlNuzulBn: 'গুনাহগার বান্দারা যখন নিজেদের ভুলের কারণে ক্ষমা পাওয়ার আশা ছেড়ে দেওয়ার উপক্রম হয়েছিল, তখন রাব্বুল আলামীন তাঁর অসীমতাপূর্ণ রহমতের দ্বার উন্মোচনের বার্তা দেন।',
    spiritualSignificanceBn: 'আল্লাহর অসীম রহমত ছাড়া কেবল নিজের আমলে কেউ জান্নাতে যেতে পারবে না, তাই সর্ব অবস্থায় তওবা ও রহমত কামনা করা কর্তব্য।'
  }
];

interface Props {
  lang: 'bn' | 'en' | 'ar';
}

export const ArabicLearningCard: React.FC<Props> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [learnedIds, setLearnedIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('সব শব্দ');

  const filteredList = ARABIC_VOCABULARY_LIST.filter(item => {
    return selectedCategory === 'সব শব্দ' || item.category === selectedCategory;
  });

  const activeItem = filteredList[currentIndex] || ARABIC_VOCABULARY_LIST[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const toggleLearned = (id: number) => {
    setLearnedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-5 shadow-xl border border-emerald-700/60 relative overflow-hidden space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-700/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-50 flex items-center gap-2">
              <span>প্রতিদিন সহজ আরবি ভাষা শিক্ষা</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-extrabold">
                একবচন • বহুবচন • শানে নুযূল
              </span>
            </h3>
            <p className="text-xs text-emerald-200/90 font-medium">
              কুরআনিক শব্দের একক ও বহুবচন অর্থ, সঠিক বাংলা উচ্চারণ, কুরআনে ব্যবহার সংখ্যা ও শানে নুযূল
            </p>
          </div>
        </div>

        {/* Progress Counter */}
        <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-600/50 self-start sm:self-auto">
          <Award className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold text-emerald-100">
            আয়ত্ত করা শব্দ: <span className="text-amber-300 font-bold">{toBengaliDigits(learnedIds.length)}</span> / {toBengaliDigits(ARABIC_VOCABULARY_LIST.length)}
          </span>
        </div>
      </div>

      {/* Main Vocabulary Learning Card */}
      {activeItem && (
        <div className="bg-emerald-950/80 rounded-xl p-4 sm:p-5 border border-amber-400/30 space-y-4 relative">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-800 text-emerald-100 border border-emerald-600">
                {activeItem.category} • শব্দ {toBengaliDigits(currentIndex + 1)} / {toBengaliDigits(filteredList.length)}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                📖 কুরআনে এসেছে: {activeItem.quranOccurrenceCountBn}
              </span>
            </div>

            <button
              onClick={() => toggleLearned(activeItem.id)}
              className={`text-xs flex items-center gap-1.5 px-3 py-1 rounded-lg border transition cursor-pointer ${
                learnedIds.includes(activeItem.id)
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                  : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${learnedIds.includes(activeItem.id) ? 'text-amber-300' : 'text-emerald-400'}`} />
              <span>{learnedIds.includes(activeItem.id) ? 'আয়ত্ত করা হয়েছে' : 'পড়া সম্পন্ন চিহ্নিত করুন'}</span>
            </button>
          </div>

          {/* Word Comparison Box: Singular vs Plural with Separate Meanings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-1">
            
            {/* Singular Box (একবচন) */}
            <div className="bg-emerald-900/90 p-4 rounded-xl border border-emerald-600/60 relative space-y-2 shadow-sm">
              <div className="flex justify-between items-center border-b border-emerald-700/60 pb-1.5">
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  একবচন (المُفْرَد)
                </span>
                <button
                  onClick={() => speakText(activeItem.arabicSingular)}
                  className="p-1 rounded bg-emerald-800 hover:bg-emerald-700 text-amber-300 transition cursor-pointer flex items-center gap-1 text-[11px]"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>শুনুন</span>
                </button>
              </div>

              <div className="text-center py-1">
                <span className="text-3xl sm:text-4xl font-bold text-amber-300 font-arabic" dir="rtl">
                  {activeItem.arabicSingular}
                </span>
              </div>

              <div className="space-y-1 text-xs border-t border-emerald-800/80 pt-2">
                <div className="text-emerald-200">
                  <strong>বাংলা উচ্চারণ:</strong> <span className="text-amber-200 font-bold">{activeItem.bengaliPronunciationSingular}</span>
                </div>
                <div className="text-emerald-100">
                  <strong>একবচনে বাংলা অর্থ:</strong> <span className="text-amber-300 font-bold">{activeItem.bengaliMeaningSingular}</span>
                </div>
              </div>
            </div>

            {/* Plural Box (বহুবচন) */}
            <div className="bg-teal-950/90 p-4 rounded-xl border border-teal-600/60 relative space-y-2 shadow-sm">
              <div className="flex justify-between items-center border-b border-teal-800/60 pb-1.5">
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-teal-900 text-teal-300 border border-teal-700">
                  বহুবচন (الجَمْع)
                </span>
                <button
                  onClick={() => speakText(activeItem.arabicPlural)}
                  className="p-1 rounded bg-teal-900 hover:bg-teal-800 text-teal-200 transition cursor-pointer flex items-center gap-1 text-[11px]"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>শুনুন</span>
                </button>
              </div>

              <div className="text-center py-1">
                <span className="text-3xl sm:text-4xl font-bold text-teal-200 font-arabic" dir="rtl">
                  {activeItem.arabicPlural}
                </span>
              </div>

              <div className="space-y-1 text-xs border-t border-teal-800/80 pt-2">
                <div className="text-teal-200">
                  <strong>বাংলা উচ্চারণ:</strong> <span className="text-teal-100 font-bold">{activeItem.bengaliPronunciationPlural}</span>
                </div>
                <div className="text-teal-100">
                  <strong>বহুবচনে বাংলা অর্থ:</strong> <span className="text-amber-300 font-bold">{activeItem.bengaliMeaningPlural}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quranic Example Verse */}
          <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>কুরআনে শব্দটির প্রয়োগ ও দৃষ্টান্ত আয়াত:</span>
              </span>
              <span className="text-xs font-semibold text-amber-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                {activeItem.surahReferenceBn}
              </span>
            </div>

            <div className="text-right text-lg sm:text-xl font-bold text-amber-100 font-arabic leading-relaxed" dir="rtl">
              {activeItem.quranicExampleAr}
            </div>

            <div className="text-xs sm:text-sm text-emerald-100 leading-relaxed pt-1 border-t border-emerald-800/80">
              <span className="font-bold text-teal-300">সরল অনুবাদ: </span>
              "{activeItem.quranicExampleBn}"
            </div>
          </div>

          {/* Asbab-al-Nuzul (শানে নুযূল) & Spiritual Virtues (তাৎপর্য ও ফজিলত) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Asbab Al Nuzul Box */}
            <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-amber-400/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <HelpCircle className="w-4 h-4 text-amber-300 shrink-0" />
                <span>📜 অবতীর্ণের কারণ ও শানে নুযূল:</span>
              </div>
              <p className="text-emerald-100 leading-relaxed">
                {activeItem.asbabAlNuzulBn}
              </p>
            </div>

            {/* Spiritual Significance & Virtues */}
            <div className="bg-amber-400/10 p-3.5 rounded-xl border border-amber-400/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>💡 তাৎপর্য, ফজিলত ও শিক্ষণীয় নসিহত:</span>
              </div>
              <p className="text-amber-100/90 leading-relaxed">
                {activeItem.spiritualSignificanceBn}
              </p>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-semibold text-xs transition cursor-pointer border border-emerald-600"
            >
              ← পূর্ববর্তী শব্দ
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition cursor-pointer border border-amber-300 shadow-md flex items-center gap-1"
            >
              <span>পরবর্তী শব্দ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Vocabulary List Grid Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {ARABIC_VOCABULARY_LIST.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              idx === currentIndex
                ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
            }`}
          >
            <div className="text-xs font-bold font-arabic" dir="rtl">
              {item.arabicSingular} ({item.arabicPlural})
            </div>
            <div className="text-[11px] text-emerald-300 truncate mt-0.5">
              {item.bengaliMeaningSingular}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
