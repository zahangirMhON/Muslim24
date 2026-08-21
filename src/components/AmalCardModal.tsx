import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  Check,
  Share2,
  Copy,
  Volume2,
  VolumeX,
  Play,
  Square,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  Target,
  Zap,
  Flame,
  Vibrate,
  ShieldCheck
} from 'lucide-react';
import {
  UnifiedAmalCardData,
  getPreloadedAmalCard,
  normalizeAsmaToAmalCard,
  normalizeGenericToAmalCard,
  getPreloadedAsma
} from '../services/amalCardDataPreloader';
import { AsmaulHusnaItem, EvidenceLevel } from '../data/asmaulHusnaData';
import { loadMasteryState, saveMasteryState, UserAsmaProgress } from '../utils/asmaulHusnaMastery';
import { triggerHaptic, launchDhikrInTasbih } from '../utils/haptics';
import { playAsmaulHusnaCompleteAudio, stopAsmaulHusnaAudio } from '../utils/asmaulHusnaAudio';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface AmalCardModalProps {
  isOpen?: boolean;
  itemData?: UnifiedAmalCardData | AsmaulHusnaItem | any | null;
  onClose?: () => void;
  onLaunchTasbih?: (payload: any) => void;
}

export const AmalCardModal: React.FC<AmalCardModalProps> = ({
  isOpen: propIsOpen,
  itemData: propItemData,
  onClose: propOnClose,
  onLaunchTasbih
}) => {
  // Internal state to support global event dispatching as well as props
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const [internalData, setInternalData] = useState<UnifiedAmalCardData | null>(null);

  // Local interaction states
  const [tasbihCounter, setTasbihCounter] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSpeakingTTS, setIsSpeakingTTS] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Mastery state
  const [masteryState, setMasteryState] = useState(() => loadMasteryState());

  // Derive effective open and data
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const rawData = propItemData !== undefined ? propItemData : internalData;

  const currentCard: UnifiedAmalCardData | null = useMemo(() => {
    if (!rawData) return null;
    return normalizeGenericToAmalCard(rawData);
  }, [rawData]);

  // Listen for global window events to open the modal from anywhere
  useEffect(() => {
    const handleOpenGlobalModal = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id?: string | number;
        asmaId?: number;
        amalData?: any;
        item?: any;
      }>;

      const detail = customEvent.detail;
      if (!detail) return;

      let foundData: UnifiedAmalCardData | null = null;

      if (detail.amalData) {
        foundData = normalizeGenericToAmalCard(detail.amalData);
      } else if (detail.item) {
        foundData = normalizeGenericToAmalCard(detail.item);
      } else if (detail.asmaId) {
        const asma = getPreloadedAsma(detail.asmaId);
        if (asma) foundData = normalizeAsmaToAmalCard(asma);
      } else if (detail.id) {
        foundData = getPreloadedAmalCard(detail.id);
      }

      if (foundData) {
        setInternalData(foundData);
        setInternalIsOpen(true);
        setTasbihCounter(0);
        setIsPlayingAudio(false);
      }
    };

    window.addEventListener('open-amal-card-modal', handleOpenGlobalModal);
    return () => {
      window.removeEventListener('open-amal-card-modal', handleOpenGlobalModal);
    };
  }, []);

  // Lock body scroll when modal is open to prevent background jumps & glitches
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset states on card change
  useEffect(() => {
    if (currentCard) {
      setTasbihCounter(0);
      setIsPlayingAudio(false);
      setIsSpeakingTTS(false);
      setIsCopied(false);

      // Check favorite status
      try {
        const savedFavs = localStorage.getItem('asmaul_husna_favs');
        if (savedFavs && currentCard.asmaId) {
          const list = JSON.parse(savedFavs);
          setIsFavorite(list.includes(currentCard.asmaId));
        }
      } catch {
        setIsFavorite(false);
      }
    }
  }, [currentCard?.id]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    stopAsmaulHusnaAudio();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsSpeakingTTS(false);

    if (propOnClose) {
      propOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  if (!isOpen || !currentCard) return null;

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!currentCard.asmaId) return;
    try {
      const saved = localStorage.getItem('asmaul_husna_favs');
      let list: number[] = saved ? JSON.parse(saved) : [];
      if (list.includes(currentCard.asmaId)) {
        list = list.filter(id => id !== currentCard.asmaId);
        setIsFavorite(false);
      } else {
        list.push(currentCard.asmaId);
        setIsFavorite(true);
      }
      localStorage.setItem('asmaul_husna_favs', JSON.stringify(list));
      triggerHaptic('tap');
    } catch (e) {
      console.error(e);
    }
  };

  // Copy details
  const handleCopy = () => {
    const text = `✨ ${currentCard.titleBn} (${currentCard.arabicText})\n\n🗣️ উচ্চারণ: ${currentCard.transliterationBn}\n🌸 অর্থ: ${currentCard.meaningBn}\n\n📖 কুরআন রেফারেন্স: ${currentCard.quranRefBn || 'সূরা আল-আ\'রাফ: ১৮০'}\n📜 হাদিস সূত্র: ${currentCard.hadithRefBn || 'সহিহ হাদিস'}\n\n🌿 ফজিলত: ${currentCard.virtueBn}\n🤲 দোয়া: ${currentCard.duaWithThisNameBn || ''}\n💼 আজকের আমল: ${currentCard.lifeApplicationTaskBn || ''}\n\n— ইসলামিক লাইফ ২৪/৭ (Amal Card)`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    triggerHaptic('tap');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Share
  const handleShare = async () => {
    const shareData = {
      title: currentCard.titleBn,
      text: `${currentCard.titleBn} (${currentCard.arabicText})\nঅর্থ: ${currentCard.meaningBn}\nফজিলত: ${currentCard.virtueBn}\nসূত্র: ${currentCard.hadithRefBn || ''}`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  // Instant In-Modal Tasbih Tap with haptic vibration
  const handleTasbihTap = () => {
    const next = tasbihCounter + 1;
    setTasbihCounter(next);
    const target = currentCard.recommendedCount || 100;

    if (next >= target && next % target === 0) {
      triggerHaptic('complete', true, true);
    } else if (next % 33 === 0) {
      triggerHaptic('milestone', true, true);
    } else {
      triggerHaptic('tap', true, true);
    }

    // Auto-update practice progress in mastery
    if (currentCard.asmaId) {
      updateProgress(currentCard.asmaId, { practiced: true, tasbihCountToday: next });
    }
  };

  const handleResetTasbih = () => {
    setTasbihCounter(0);
    triggerHaptic('reset', true, true);
  };

  // Audio Playback Handler
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAsmaulHusnaAudio();
      setIsPlayingAudio(false);
    } else {
      const asmaItem = currentCard.asmaId ? getPreloadedAsma(currentCard.asmaId) : null;
      if (asmaItem) {
        setIsPlayingAudio(true);
        playAsmaulHusnaCompleteAudio(
          asmaItem,
          () => setIsPlayingAudio(true),
          () => setIsPlayingAudio(false)
        );
      } else if (currentCard.arabicText && 'speechSynthesis' in window) {
        setIsPlayingAudio(true);
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(currentCard.arabicText);
        ut.lang = 'ar-SA';
        ut.rate = 0.85;
        ut.onend = () => setIsPlayingAudio(false);
        ut.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(ut);
      }
    }
  };

  // Launch to Main Global Tasbih
  const handleLaunchMainTasbih = () => {
    const payload = {
      id: currentCard.id ? String(currentCard.id) : undefined,
      titleBn: `${currentCard.titleBn} (${currentCard.arabicText})`,
      arabicText: currentCard.arabicText,
      transliterationBn: currentCard.transliterationBn,
      translationBn: `${currentCard.meaningBn} - ${currentCard.virtueBn}`,
      targetCount: currentCard.recommendedCount || 100,
      recommendedTimeBn: currentCard.recommendedTimeBn
    };

    if (onLaunchTasbih) {
      onLaunchTasbih(payload);
    } else {
      launchDhikrInTasbih(payload);
    }
    handleClose();
  };

  // Update Mastery Status for this name
  const updateProgress = (asmaId: number, patch: Partial<UserAsmaProgress>) => {
    const current = masteryState.progressMap[asmaId] || {
      asmaId,
      learned: false,
      understood: false,
      practiced: false,
      applied: false,
      tasbihCountToday: 0,
      reviewStage: 0
    };

    const updated = { ...current, ...patch };
    const newProgressMap = { ...masteryState.progressMap, [asmaId]: updated };
    const newState = { ...masteryState, progressMap: newProgressMap };

    setMasteryState(newState);
    saveMasteryState(newState);
    triggerHaptic('tap');
  };

  const getProgress = (asmaId: number): UserAsmaProgress => {
    return (
      masteryState.progressMap[asmaId] || {
        asmaId,
        learned: false,
        understood: false,
        practiced: false,
        applied: false,
        tasbihCountToday: 0,
        reviewStage: 0
      }
    );
  };

  // Render Evidence Badge
  const renderEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 'quran_proof':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
            <BookOpen className="w-3 h-3" />
            <span>কুরআনে বর্ণিত সুনির্দিষ্ট নাম</span>
          </span>
        );
      case 'sahih_hadith':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
            <ShieldCheck className="w-3 h-3" />
            <span>সহিহ হাদিসে প্রমাণিত আমল</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
            <Sparkles className="w-3 h-3" />
            <span>মুস্তাহাব ও সুন্নাহ আমল</span>
          </span>
        );
    }
  };

  const asmaId = currentCard.asmaId;
  const currentProgress = asmaId ? getProgress(asmaId) : null;

  // React Portal to document.body ensures escape from any parent stacking contexts
  return createPortal(
    <div
      id="unified-amal-card-modal-root"
      className="fixed inset-0 z-[9999] isolate bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative bg-gradient-to-b from-slate-900 via-emerald-950/95 to-slate-950 border border-emerald-500/50 rounded-3xl p-4 sm:p-6 max-w-2xl w-full text-emerald-50 space-y-4 my-auto shadow-2xl max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Gold-Emerald Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-t-3xl" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-emerald-800/60 pb-3.5 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {currentCard.asmaId ? (
                <span className="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  নাম নং #{toBengaliDigits(currentCard.asmaId)}
                </span>
              ) : (
                <span className="text-xs font-black text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <span>{currentCard.categoryIcon || '✨'}</span>
                  <span>{currentCard.categoryBn}</span>
                </span>
              )}
              {renderEvidenceBadge(currentCard.evidenceLevel)}
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 pt-1 leading-tight tracking-wide">
              {currentCard.arabicText}
            </h3>
            <div className="text-base sm:text-lg font-bold text-emerald-100">
              {currentCard.transliterationBn}
            </div>
            <div className="text-xs sm:text-sm text-emerald-300 italic font-medium leading-relaxed">
              "{currentCard.meaningBn}"
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {currentCard.asmaId && (
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow'
                    : 'bg-emerald-900/60 text-slate-300 hover:text-amber-300 border-emerald-700/50'
                }`}
                title="পছন্দের তালিকায় রাখুন"
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current text-amber-400' : ''}`} />
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                isCopied
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-emerald-900/60 text-emerald-200 hover:text-white border-emerald-700/50'
              }`}
              title="কপি করুন"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-emerald-900/60 text-emerald-200 hover:text-white border border-emerald-700/50 transition cursor-pointer"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-xs transition border border-slate-700 cursor-pointer ml-1"
              title="বন্ধ করুন (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timing & Daily Recommended Target Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800/60 space-y-1">
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>পড়ার উত্তম সময় ও ওয়াক্ত:</span>
            </span>
            <p className="text-xs font-semibold text-emerald-100">
              {currentCard.recommendedTimeBn || 'প্রতি ফরয সালাত শেষে / ফজর ও মাগরিবের পর'}
            </p>
          </div>

          <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800/60 space-y-1">
            <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-400" />
              <span>দিনে অন্তত কত বার পাঠ্য:</span>
            </span>
            <p className="text-xs font-semibold text-emerald-100">
              দিনে অন্তত {toBengaliDigits(currentCard.recommendedCount || 100)} বার (অথবা ৩৩ বার)
            </p>
          </div>
        </div>

        {/* 1-CLICK DHIKR & INSTANT VIBRATING COUNTER SECTION */}
        <div className="bg-gradient-to-br from-emerald-900/90 via-teal-950/90 to-emerald-950 p-4 rounded-2xl border-2 border-amber-400/50 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>📿</span>
                <span>১-ক্লিকে তসবিহ ও জিকির আমল</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  📳 ভাইব্রেশন সক্রিয়
                </span>
              </div>
              <div className="text-[11px] text-emerald-200">
                কাউন্ট করার সাথে সাথে ডিভাইসে বাস্তবসম্মত স্পন্দন ও ভাইব্রেশন হবে
              </div>
            </div>

            <button
              onClick={handleLaunchMainTasbih}
              className="px-3.5 py-2 rounded-xl bg-amber-400 text-emerald-950 text-xs font-black hover:bg-amber-300 transition flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <span>📿 মূল তসবিহে শুরু করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* In-Modal Instant Tap Tasbih Counter */}
          <div className="bg-emerald-950/90 p-3 rounded-xl border border-emerald-700/60 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-[11px] text-emerald-300 font-bold">
                সরাসরি এই কার্ডে জিকির কাউন্ট:
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {toBengaliDigits(tasbihCounter)} / {toBengaliDigits(currentCard.recommendedCount || 100)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTasbihTap}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-emerald-950 font-black text-xs hover:scale-105 active:scale-95 transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>📿 +১ ট্যাপ</span>
                <Vibrate className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleResetTasbih}
                className="p-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs transition border border-emerald-700 cursor-pointer"
                title="রিসেট করুন"
              >
                <RotateCcw className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Audio & Pronunciation Guide Button */}
        <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700/50 flex items-center justify-between flex-wrap gap-2.5">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-amber-300">
              🔊 অডিও উচ্চারণ ও বাংলা ব্যাখ্যা
            </div>
            <div className="text-[11px] text-emerald-300">
              আরবি বিশুদ্ধ উচ্চারণ ও বাস্তব আমলের দিকনির্দেশনা শুনুন
            </div>
          </div>

          <button
            onClick={handleToggleAudio}
            className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs hover:bg-amber-300 transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            {isPlayingAudio ? (
              <>
                <Square className="w-4 h-4 fill-emerald-950" />
                <span>অডিও থামান</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-emerald-950" />
                <span>অডিও প্লে করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Evidence & References */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>কুরআন ও সহিহ দলীল:</span>
          </h4>
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800/60 space-y-1 text-xs">
            <div>
              <span className="font-bold text-emerald-300">কুরআন আয়াত রেফারেন্স:</span>{' '}
              <span className="text-emerald-100">{currentCard.quranRefBn || 'সূরা আল-আ\'রাফ: ১৮০, সূরা আল-হাশর: ২২-২৪'}</span>
            </div>
            <div>
              <span className="font-bold text-cyan-300">সহিহ হাদিস রেফারেন্স:</span>{' '}
              <span className="text-emerald-100">{currentCard.hadithRefBn || 'সহিহ বুখারী ২৭৩৬, সহিহ মুসলিম ২৬৭৭'}</span>
            </div>
          </div>
        </div>

        {/* Deeper Meaning & Virtue */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অর্থ, তাৎপর্য ও প্রমাণিত ফজিলত:</span>
          </h4>
          <p className="text-xs text-emerald-100 leading-relaxed bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
            {currentCard.deeperMeaningBn || currentCard.virtueBn}
          </p>
        </div>

        {/* How to Call Allah (Dua) */}
        {currentCard.duaWithThisNameBn && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🤲</span>
              <span>কীভাবে আল্লাহকে এই নামে ডাকবেন (দোয়া):</span>
            </h4>
            <p className="text-xs font-serif font-bold text-amber-200 bg-emerald-950/80 p-3 rounded-xl border border-emerald-700/50 leading-relaxed">
              {currentCard.duaWithThisNameBn}
            </p>
          </div>
        )}

        {/* Character Transformation Lesson */}
        {currentCard.characterLessonBn && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧠</span>
              <span>এই আমল/নাম থেকে চরিত্র গঠনের শিক্ষা:</span>
            </h4>
            <p className="text-xs text-emerald-200 leading-relaxed bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
              {currentCard.characterLessonBn}
            </p>
          </div>
        )}

        {/* Practical Daily Action Task */}
        {currentCard.lifeApplicationTaskBn && (
          <div className="space-y-1.5 bg-amber-400/10 p-3.5 rounded-xl border border-amber-400/30">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>💼 আজকের বাস্তব জীবনের ছোট আমল:</span>
            </h4>
            <p className="text-xs text-emerald-50 font-medium leading-relaxed">
              {currentCard.lifeApplicationTaskBn}
            </p>
          </div>
        )}

        {/* 4-Step Mastery Checkboxes (For Asmaul Husna) */}
        {currentCard.asmaId && currentProgress && (
          <div className="space-y-2 pt-2 border-t border-emerald-800/60">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              ৪টি ধাপে মাস্টারি স্টেটাস আপডেট করুন:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => updateProgress(currentCard.asmaId!, { learned: !currentProgress.learned })}
                className={`p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentProgress.learned
                    ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow font-black'
                    : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900'
                }`}
              >
                <span>📖 জানা</span>
                {currentProgress.learned && '✓'}
              </button>

              <button
                onClick={() => updateProgress(currentCard.asmaId!, { understood: !currentProgress.understood })}
                className={`p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentProgress.understood
                    ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow font-black'
                    : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900'
                }`}
              >
                <span>🧠 বোঝা</span>
                {currentProgress.understood && '✓'}
              </button>

              <button
                onClick={() => updateProgress(currentCard.asmaId!, { practiced: !currentProgress.practiced })}
                className={`p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentProgress.practiced
                    ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow font-black'
                    : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900'
                }`}
              >
                <span>📿 আমল</span>
                {currentProgress.practiced && '✓'}
              </button>

              <button
                onClick={() => updateProgress(currentCard.asmaId!, { applied: !currentProgress.applied })}
                className={`p-2.5 rounded-xl text-xs font-bold transition border flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentProgress.applied
                    ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow font-black'
                    : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900'
                }`}
              >
                <span>🤲 প্রচার</span>
                {currentProgress.applied && '✓'}
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Close Button */}
        <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between gap-3 text-xs text-emerald-300/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px]">সহীহ দলিলভিত্তিক ইসলামিক আমল কার্ড</span>
          </div>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold transition border border-emerald-700/60 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AmalCardModal;
