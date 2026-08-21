import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { triggerHaptic, playSensoryClick } from '../utils/haptics';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface QuickDhikrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DhikrPreset {
  id: string;
  titleBn: string;
  arabicText: string;
  transliterationBn: string;
  meaningBn: string;
  virtueBn: string;
  targetCount: number;
}

const QUICK_DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    titleBn: 'সুবহানাল্লাহ (SubhanAllah)',
    arabicText: 'سُبْحَانَ اللَّهِ',
    transliterationBn: 'সুবহানাল্লাহ',
    meaningBn: 'আল্লাহ অতি পবিত্র ও সকল ত্রুটিমুক্ত।',
    virtueBn: 'জান্নাতে একটি খেজুর গাছ রোপণ করা হয় (তিরমিজি: ৩৪৬৪)।',
    targetCount: 33
  },
  {
    id: 'alhamdulillah',
    titleBn: 'আলহামদুলিল্লাহ (Alhamdulillah)',
    arabicText: 'الْحَمْدُ لِلَّهِ',
    transliterationBn: 'আলহামদুলিল্লাহ',
    meaningBn: 'সকল প্রশংসা মহান আল্লাহর জন্য।',
    virtueBn: 'মিজানের পাল্লাকে নেকি দিয়ে পূর্ণ করে দেয় (সহীহ মুসলিম: ২২৩)।',
    targetCount: 33
  },
  {
    id: 'allahuakbar',
    titleBn: 'আল্লাহু আকবার (Allahu Akbar)',
    arabicText: 'اللَّهُ أَكْبَرُ',
    transliterationBn: 'আল্লাহু আকবার',
    meaningBn: 'আল্লাহ সর্বশ্রেষ্ঠ ও মহান।',
    virtueBn: 'আসমান ও জমিনের মধ্যবর্তী শূন্যস্থান সওয়াব দিয়ে পূর্ণ করে দেয়।',
    targetCount: 34
  },
  {
    id: 'istighfar',
    titleBn: 'ইস্তেগফার (ক্ষমা প্রার্থনা)',
    arabicText: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliterationBn: 'আস্তাগফিরুল্লাহা ওয়া আতূবু ইলাইহি',
    meaningBn: 'আমি আল্লাহর কাছে ক্ষমা চাই এবং তাঁরই দিকে ফিরে আসছি।',
    virtueBn: 'রিজিক বৃদ্ধি পায় ও সকল দুশ্চিন্তা থেকে মুক্তির পথ খোলে (আবু দাউদ: ১৫১৮)।',
    targetCount: 100
  },
  {
    id: 'durood',
    titleBn: 'দরূদ শরীফ (নবীপ্রেম ও রহমত)',
    arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    transliterationBn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিঁও ওয়া আলা আলি মুহাম্মাদ',
    meaningBn: 'হে আল্লাহ! মুহাম্মদ ﷺ ও তাঁর পরিবারের ওপর রহমত বর্ষণ করুন।',
    virtueBn: 'একবার পাঠে আল্লাহ ১০টি রহমত বর্ষণ করেন ও ১০টি গোনাহ মাফ করেন (মুসলিম: ৪০৮)।',
    targetCount: 100
  },
  {
    id: 'lailaha',
    titleBn: 'কালিমা তাইয়্যেবা (তাওহীদ)',
    arabicText: 'لَا إِلٰهَ إِلَّا اللَّهُ',
    transliterationBn: 'লা ইলাহা ইল্লাল্লাহ',
    meaningBn: 'আল্লাহ ব্যতীত কোনো উপাস্য নেই।',
    virtueBn: 'সর্বশ্রেষ্ঠ জিকির ও জান্নাতের চাবিকাঠি (তিরমিজি: ৩৩৮৩)।',
    targetCount: 100
  },
  {
    id: 'hawqala',
    titleBn: 'লা হাওলা (জান্নাতের গুপ্তধন)',
    arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliterationBn: 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ',
    meaningBn: 'আল্লাহর সাহায্য ব্যতীত পাপ থেকে ফেরার ও নেক আমল করার শক্তি নেই।',
    virtueBn: 'জান্নাতের একটি অমূল্য রত্নভাণ্ডার (সহীহ বুখারী: ৪২০৫)।',
    targetCount: 100
  },
  {
    id: 'tasbih_complete',
    titleBn: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliterationBn: 'সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আজিম',
    meaningBn: 'আল্লাহর পবিত্রতা ঘোষণা করছি তাঁর প্রশংসার সাথে, মহান আল্লাহ অতি পবিত্র।',
    virtueBn: 'জিহ্বায় অতি সহজ, মিজানে ভারী ও দয়াময় আল্লাহর কাছে প্রিয় (বুখারী: ৬৬৮২)।',
    targetCount: 100
  }
];

export const QuickDhikrModal: React.FC<QuickDhikrModalProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<DhikrPreset>(QUICK_DHIKR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    setCount(0);
    setIsCompleted(false);
  }, [selectedPreset.id]);

  if (!isOpen) return null;

  const handleTap = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    const isDone = nextCount >= selectedPreset.targetCount;
    const is33or99 = nextCount % 33 === 0;

    const feedbackType = isDone ? 'complete' : is33or99 ? 'milestone' : 'tap';
    triggerHaptic(feedbackType, true, soundEnabled);

    if (isDone && !isCompleted) {
      setIsCompleted(true);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
    setIsCompleted(false);
    triggerHaptic('reset', true, soundEnabled);
  };

  const progressPercentage = Math.min(100, Math.round((count / selectedPreset.targetCount) * 100));

  return createPortal(
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-400/70 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 text-emerald-50 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📿</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300">
                তাৎক্ষণিক ডিজিটাল জিকির ও তাসবিহ
              </h3>
              <p className="text-[11px] text-emerald-200/80">
                সহজে তাসবিহ গণনা, সাউন্ড ও হ্যাপটিক ভাইব্রেশন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-black/40 text-amber-300 hover:bg-black/60 transition cursor-pointer border border-white/10"
              title={soundEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 text-emerald-300 hover:text-amber-300 hover:bg-black/60 transition cursor-pointer border border-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {QUICK_DHIKR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer shrink-0 border ${
                selectedPreset.id === preset.id
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md font-black'
                  : 'bg-black/40 text-emerald-200 border-white/10 hover:border-amber-400/40'
              }`}
            >
              {preset.titleBn.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Dhikr Card Display */}
        <div className="bg-black/40 p-4 rounded-2xl border border-amber-400/30 text-center space-y-2 relative">
          <div className="text-right font-serif text-xl sm:text-2xl text-amber-200 leading-relaxed font-bold tracking-wide">
            {selectedPreset.arabicText}
          </div>

          <div className="text-xs font-semibold text-emerald-200 italic">
            উচ্চারণ: {selectedPreset.transliterationBn}
          </div>

          <div className="text-xs text-emerald-100 font-medium">
            অর্থ: {selectedPreset.meaningBn}
          </div>

          <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300/90 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{selectedPreset.virtueBn}</span>
          </div>
        </div>

        {/* BIG INTERACTIVE TOUCH COUNTER BUTTON */}
        <div className="space-y-3">
          <button
            onClick={handleTap}
            className="w-full h-36 sm:h-44 rounded-3xl bg-gradient-to-b from-emerald-850 via-emerald-800 to-teal-900 border-4 border-amber-400/80 shadow-2xl active:scale-98 transition flex flex-col items-center justify-center gap-1 cursor-pointer select-none relative group hover:border-amber-300"
          >
            {/* Background circular ripple indicator */}
            <div
              className="absolute inset-0 bg-amber-400/10 rounded-3xl transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />

            <span className="text-4xl sm:text-5xl font-black font-mono text-amber-300 drop-shadow-md z-10">
              {toBengaliDigits(count)}
            </span>

            <span className="text-xs sm:text-sm font-bold text-emerald-200 z-10 flex items-center gap-1">
              <span>লক্ষ্য: {toBengaliDigits(selectedPreset.targetCount)} বার</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-white/10">
                {toBengaliDigits(progressPercentage)}%
              </span>
            </span>

            <span className="text-[11px] text-amber-400/90 font-semibold mt-1 z-10 animate-pulse">
              👆 এখানে স্পর্শ করে জিকির গণনা করুন
            </span>
          </button>

          {/* Progress Bar & Reset Controls */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-rose-950/80 text-emerald-200 hover:text-rose-300 border border-white/10 transition cursor-pointer flex items-center gap-1.5 font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট (০)</span>
            </button>

            {isCompleted && (
              <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-400/20 px-3 py-1.5 rounded-xl border border-amber-400/40 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>মাশাআল্লাহ! লক্ষ্য পূর্ণ হয়েছে!</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
