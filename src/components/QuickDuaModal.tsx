import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  X,
  Copy,
  Check,
  Share2,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Clock,
  Heart,
  ChevronRight,
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import {
  QUICK_DUAS_DATA,
  QUICK_DUA_CATEGORIES,
  QuickDuaItem,
  QuickDuaCategoryMeta
} from '../data/dailyActivityQuickDuas';

interface QuickDuaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayGlobalAudio?: (title: string, url: string) => void;
}

export const QuickDuaModal: React.FC<QuickDuaModalProps> = ({
  isOpen,
  onClose,
  onPlayGlobalAudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quick_duas_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track recitation count state for each dua in this session
  const [reciteCounts, setReciteCounts] = useState<Record<string, number>>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto focus search when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('quick_duas_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Copy Dua details
  const handleCopyDua = (dua: QuickDuaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `✨ ${dua.titleBn} (${dua.contextOccasionBn})\n\n📖 আরবি:\n${dua.arabicText}\n\n🗣️ উচ্চারণ:\n${dua.pronunciationBn}\n\n🌸 বাংলা অর্থ:\n${dua.translationBn}\n\n📌 কখন পড়বেন:\n${dua.contextOccasionBn}\n\n📚 সূত্র: ${dua.sahihReferenceBn}\n\n— ইসলামিক লাইফ ২৪/৭ (Quick Dua)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Share Dua
  const handleShareDua = async (dua: QuickDuaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: dua.titleBn,
      text: `${dua.titleBn}\n${dua.arabicText}\n${dua.pronunciationBn}\nঅর্থ: ${dua.translationBn}\nসূত্র: ${dua.sahihReferenceBn}`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copy
        handleCopyDua(dua, e);
      }
    } else {
      handleCopyDua(dua, e);
    }
  };

  // Recite count click
  const handleReciteIncrement = (dua: QuickDuaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = reciteCounts[dua.id] || 0;
    const target = dua.recommendedCount;
    const next = current >= target ? target : current + 1;
    
    setReciteCounts(prev => ({
      ...prev,
      [dua.id]: next
    }));

    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  };

  // Reset count
  const handleResetCount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReciteCounts(prev => ({
      ...prev,
      [id]: 0
    }));
  };

  // TTS speech synthesis for reading pronunciation
  const handleSpeak = (dua: QuickDuaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      if (speakingId === dua.id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      setSpeakingId(dua.id);

      // Try Arabic first if available, otherwise Bengali
      const utterance = new SpeechSynthesisUtterance(dua.arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;

      utterance.onend = () => {
        setSpeakingId(null);
      };
      utterance.onerror = () => {
        setSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Filtered duas based on category, search, and favorites
  const filteredDuas = useMemo(() => {
    return QUICK_DUAS_DATA.filter(dua => {
      // Favorite filter
      if (onlyFavorites && !savedFavorites.includes(dua.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && dua.contextCategory !== selectedCategory) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchTitle = dua.titleBn.toLowerCase().includes(q) || dua.titleEn.toLowerCase().includes(q);
      const matchContext = dua.contextOccasionBn.toLowerCase().includes(q);
      const matchPronunciation = dua.pronunciationBn.toLowerCase().includes(q);
      const matchTranslation = dua.translationBn.toLowerCase().includes(q);
      const matchCategory = dua.contextCategoryBn.toLowerCase().includes(q);
      const matchTags = dua.searchTags.some(tag => tag.toLowerCase().includes(q));
      const matchRef = dua.sahihReferenceBn.toLowerCase().includes(q);

      return matchTitle || matchContext || matchPronunciation || matchTranslation || matchCategory || matchTags || matchRef;
    });
  }, [searchQuery, selectedCategory, onlyFavorites, savedFavorites]);

  // Quick search keywords suggested chips
  const popularContextKeywords = [
    { label: 'খাবার ও পানীয়', query: 'খাবার' },
    { label: 'ঘুমানোর আমল', query: 'ঘুম' },
    { label: 'যানবাহন ও সফর', query: 'গাড়ি' },
    { label: 'ঘর ও বাহির', query: 'ঘর' },
    { label: 'টয়লেট ও ওজু', query: 'টয়লেট' },
    { label: 'পড়াশোনা ও মেধা', query: 'পড়াশোনা' },
    { label: 'ঋণ ও রিযিক', query: 'ঋণ' },
    { label: 'রাগ দমন', query: 'রাগ' },
    { label: 'রোগ ও শেফা', query: 'ব্যথা' },
    { label: 'বৃষ্টি ও দুর্যোগ', query: 'বৃষ্টি' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-slate-900 via-emerald-950/95 to-slate-950 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-emerald-50"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Glowing Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400" />

        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-emerald-800/40 bg-emerald-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                  তাত্ক্ষণিক দোয়া ও দৈনন্দিন আমল
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Quick Dua
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">
                দৈনন্দিন কার্যকলাপ ও পরিস্থিতি অনুযায়ী প্রয়োজনীয় সকল সহীহ দোয়া
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                onlyFavorites
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md'
                  : 'bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border-emerald-700/50'
              }`}
              title="সংরক্ষিত প্রিয় দোয়াসমূহ"
            >
              <Bookmark className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">পছন্দ ({savedFavorites.length})</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="বন্ধ করুন (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slim Search Input Header */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-900/90 border-b border-emerald-900/40 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="পরিস্থিতি বা প্রয়োজন দিয়ে খুঁজুন (যেমন: খাবার, ঘুম, গাড়ি, ওজু, বৃষ্টি, রাগ, ঋণ, পড়ালেখা, রোগ...)"
              className="w-full pl-10 pr-10 py-2 bg-emerald-950/70 border border-emerald-600/50 rounded-xl text-emerald-100 placeholder-emerald-400/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/70 focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-amber-300 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body: Scrollable Categories, Chips & Dua Cards List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5 custom-scrollbar overscroll-contain touch-pan-y">
          
          {/* Quick Context Suggestion Tags inside scrollable area */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-amber-300/80 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> দ্রুত ফিল্টার:
            </span>
            {popularContextKeywords.map(chip => (
              <button
                key={chip.query}
                onClick={() => {
                  setSearchQuery(chip.query);
                  setSelectedCategory('all');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition border cursor-pointer ${
                  searchQuery === chip.query
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold'
                    : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border-emerald-800/60'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Context Category Chips Bar inside scrollable area */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_DUA_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setOnlyFavorites(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition border cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-950/60 scale-102'
                      : 'bg-slate-800/80 hover:bg-emerald-950/80 text-emerald-300 border-emerald-900/50 hover:border-emerald-700/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.labelBn}</span>
                </button>
              );
            })}
          </div>
          {/* Search/Filter Summary Info */}
          <div className="flex items-center justify-between text-xs text-emerald-300/80 px-1">
            <span className="font-medium">
              মোট <strong>{filteredDuas.length}</strong> টি দোয়া পাওয়া গেছে
              {searchQuery && ` ("${searchQuery}" এর ফলাফলে)`}
              {onlyFavorites && ' (সংরক্ষিত পছন্দের তালিকায়)'}
            </span>
            {(searchQuery || selectedCategory !== 'all' || onlyFavorites) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyFavorites(false);
                }}
                className="text-amber-300 hover:underline font-bold"
              >
                রিসেট ফিল্টার
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredDuas.length === 0 && (
            <div className="text-center py-16 px-4 bg-emerald-950/30 rounded-3xl border border-dashed border-emerald-800/60 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-900/50 flex items-center justify-center text-2xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-amber-300">কোনো দোয়া পাওয়া যায়নি</h3>
              <p className="text-xs text-emerald-300/70 max-w-sm mx-auto">
                আপনার অনুসন্ধানের সাথে মেলে এমন কোনো দোয়া পাওয়া যায়নি। অন্য কোনো বাংলা বা ইংরেজি শব্দ দিয়ে চেষ্টা করুন।
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyFavorites(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition shadow-md cursor-pointer"
              >
                সব দোয়া দেখুন
              </button>
            </div>
          )}

          {/* Dua Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuas.map(dua => {
              const isFav = savedFavorites.includes(dua.id);
              const isCopied = copiedId === dua.id;
              const count = reciteCounts[dua.id] || 0;
              const isDone = count >= dua.recommendedCount;
              const isSpeaking = speakingId === dua.id;

              return (
                <div
                  key={dua.id}
                  className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition duration-200 ${
                    isDone
                      ? 'bg-gradient-to-b from-emerald-950/90 via-teal-950/80 to-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-950/80 ring-1 ring-emerald-400/40'
                      : 'bg-gradient-to-b from-slate-900/90 to-emerald-950/70 border-emerald-800/40 hover:border-emerald-600/70 shadow-md'
                  }`}
                >
                  {/* Top Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-900/80 text-amber-300 border border-emerald-700/60 flex items-center gap-1 shadow-xs">
                          <span>{dua.contextCategoryIcon}</span>
                          <span>{dua.contextCategoryBn}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                          {dua.recommendedCount} বার পঠিতব্য
                        </span>
                      </div>

                      {/* Top Action Icons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={e => handleSpeak(dua, e)}
                          className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                            isSpeaking
                              ? 'bg-amber-400 text-emerald-950 border-amber-300 animate-pulse'
                              : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border-emerald-700/40'
                          }`}
                          title="আরবি উচ্চারণ শুনুন"
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={e => toggleFavorite(dua.id, e)}
                          className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                            isFav
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                              : 'bg-emerald-900/50 hover:bg-emerald-800 text-slate-400 hover:text-amber-300 border-emerald-700/40'
                          }`}
                          title="পছন্দের তালিকায় সংরক্ষণ"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current text-amber-400' : ''}`} />
                        </button>

                        <button
                          onClick={e => handleCopyDua(dua, e)}
                          className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                              : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border-emerald-700/40'
                          }`}
                          title="দোয়া কপি করুন"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={e => handleShareDua(dua, e)}
                          className="p-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/40 transition cursor-pointer"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dua Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1 leading-snug">
                      {dua.titleBn}
                    </h3>

                    {/* Context / Situation Alert */}
                    <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs flex items-start gap-1.5 mb-3">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        <strong>কখন পড়বেন:</strong> {dua.contextOccasionBn}
                      </span>
                    </div>

                    {/* Arabic Text */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-700/40 mb-3 text-right">
                      <p className="font-arabic text-lg sm:text-xl text-emerald-200 leading-loose tracking-wide dir-rtl select-all font-semibold">
                        {dua.arabicText}
                      </p>
                    </div>

                    {/* Pronunciation & Translation */}
                    <div className="space-y-2 text-xs mb-3">
                      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
                        <span className="text-emerald-400 font-bold block mb-0.5">🗣️ উচ্চারণ:</span>
                        <p className="text-emerald-100/90 leading-relaxed italic">
                          {dua.pronunciationBn}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-900/40">
                        <span className="text-amber-300 font-bold block mb-0.5">🌸 বাংলা অর্থ:</span>
                        <p className="text-emerald-50 leading-relaxed">
                          {dua.translationBn}
                        </p>
                      </div>
                    </div>

                    {/* Short Virtue & Sahih Reference */}
                    <div className="space-y-1.5 text-[11px] mb-3">
                      <div className="text-emerald-300/90 flex items-start gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                        <span><strong>ফজিলত:</strong> {dua.virtueShortBn}</span>
                      </div>
                      <div className="text-emerald-400/70 flex items-center gap-1 text-[10px]">
                        <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>সূত্র: {dua.sahihReferenceBn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Recitation Progress & Done Button */}
                  <div className="pt-3 border-t border-emerald-900/50 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => handleReciteIncrement(dua, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 font-black ring-2 ring-emerald-300'
                            : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-950 fill-current" />
                            <span>পাঠ সম্পন্ন ({count}/{dua.recommendedCount})</span>
                          </>
                        ) : (
                          <>
                            <Flame className="w-4 h-4 text-emerald-950" />
                            <span>পাঠ গণনা ({count}/{dua.recommendedCount})</span>
                          </>
                        )}
                      </button>

                      {count > 0 && (
                        <button
                          onClick={e => handleResetCount(dua.id, e)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                          title="গণনা রিসেট করুন"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isCopied && (
                      <span className="text-[11px] font-bold text-emerald-400 animate-bounce flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> কপি হয়েছে!
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-emerald-900/50 bg-slate-950/90 flex items-center justify-between text-xs text-emerald-300/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px]">সহীহ হাদিস ও কুরআনের আলোয় দৈনন্দিন দোয়া সংকলন</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 font-bold transition cursor-pointer text-xs"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickDuaModal;
