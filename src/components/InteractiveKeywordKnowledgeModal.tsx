import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Compass,
  GraduationCap,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';
import { INTERACTIVE_KEYWORDS_DICTIONARY, InteractiveKeyword } from '../data/interactiveKeywordsData';

interface InteractiveKeywordKnowledgeModalProps {
  initialKeywordId?: string | null;
  onClose?: () => void;
  onNavigateTab?: (tab: string, elementId?: string) => void;
}

export const InteractiveKeywordKnowledgeModal: React.FC<InteractiveKeywordKnowledgeModalProps> = ({
  initialKeywordId = null,
  onClose,
  onNavigateTab
}) => {
  const [currentKeywordId, setCurrentKeywordId] = useState<string | null>(initialKeywordId);
  const [isOpen, setIsOpen] = useState<boolean>(Boolean(initialKeywordId));

  useEffect(() => {
    if (initialKeywordId) {
      setCurrentKeywordId(initialKeywordId);
      setIsOpen(true);
    }
  }, [initialKeywordId]);

  // Listen to global open event
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ keywordId: string }>;
      if (customEvent.detail?.keywordId) {
        setCurrentKeywordId(customEvent.detail.keywordId);
        setIsOpen(true);
      }
    };

    window.addEventListener('open-keyword-knowledge-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-keyword-knowledge-modal', handleOpenModal);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setCurrentKeywordId(null);
    if (onClose) onClose();
  };

  if (!isOpen || !currentKeywordId) return null;

  const keyword: InteractiveKeyword | undefined = INTERACTIVE_KEYWORDS_DICTIONARY[currentKeywordId];

  if (!keyword) return null;

  const handleActionButton = () => {
    handleClose();
    if (keyword.connectedTab && onNavigateTab) {
      onNavigateTab(keyword.connectedTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border-2 border-amber-400 text-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Glow Background */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Modal Header Bar */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/80 bg-black/40 flex items-center justify-between gap-3 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black text-xl shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {keyword.categoryLabelBn}
                </span>
                <span className="text-[10px] text-emerald-300">
                  ১ ক্লিকে গভীর জ্ঞান ও প্রজ্ঞা অন্বেষণ
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-amber-300 mt-0.5">
                {keyword.keywordBn}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl bg-black/60 hover:bg-emerald-900 border border-white/20 hover:border-amber-400 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition"
            title="উইন্ডো বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Modal Scrollable Content Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto custom-scrollbar flex-1 relative z-10 space-y-4 text-xs sm:text-sm overscroll-contain touch-pan-y">
          
          {/* Motivational Banner inside scrollable area */}
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-900/40 to-teal-900/30 p-3 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">
                "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ • اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" — একমাত্র আপনারই ইবাদত করি ও সরল পথ চাই
              </span>
            </div>
            <span className="text-[10px] text-emerald-300 hidden md:inline">
              জ্ঞান ও সাধনায় অন্তরের প্রতিজ্ঞা
            </span>
          </div>

          {/* Definition Banner */}
          <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-700/80 text-emerald-100 leading-relaxed font-medium">
            <strong className="text-amber-300 font-bold">মূল নির্যাস: </strong>
            {keyword.shortDefinitionBn}
          </div>

          {/* 4 Pillars Grid (বিষয়টি কী, কেন আল্লাহ করতে বলেছেন, কীভাবে করতে হবে, দুনিয়া ও আখেরাতে সুফল) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            
            {/* Pillar 1: বিষয়টি কী? */}
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-800/80 hover:border-emerald-600 transition space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center text-xs font-bold">১</span>
                <h4>বিষয়টি কী? (What is it?)</h4>
              </div>
              <p className="text-emerald-100/90 leading-relaxed text-xs">
                {keyword.whatIsItBn}
              </p>
            </div>

            {/* Pillar 2: কেন আল্লাহ করতে বলেছেন? */}
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-800/60 hover:border-amber-500/80 transition space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                <span className="w-6 h-6 rounded-lg bg-amber-900 text-amber-300 flex items-center justify-center text-xs font-bold">২</span>
                <h4>কেন আল্লাহ করতে বলেছেন? (Divine Wisdom)</h4>
              </div>
              <p className="text-emerald-100/90 leading-relaxed text-xs">
                {keyword.whyAllahCommandedBn}
              </p>
            </div>

            {/* Pillar 3: কীভাবে করতে হবে? */}
            <div className="p-4 rounded-2xl bg-black/40 border border-teal-800/80 hover:border-teal-600 transition space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
                <span className="w-6 h-6 rounded-lg bg-teal-950 text-teal-300 flex items-center justify-center text-xs font-bold">৩</span>
                <h4>কীভাবে করতে হবে? (Sunnah Methodology)</h4>
              </div>
              <div className="text-emerald-100/90 leading-relaxed text-xs whitespace-pre-line">
                {keyword.howToPerformBn}
              </div>
            </div>

            {/* Pillar 4: দুনিয়া ও আখেরাতের সুফল */}
            <div className="p-4 rounded-2xl bg-black/40 border border-yellow-800/70 hover:border-yellow-500/80 transition space-y-2">
              <div className="flex items-center gap-2 text-yellow-300 font-black text-sm">
                <span className="w-6 h-6 rounded-lg bg-yellow-950 text-yellow-300 flex items-center justify-center text-xs font-bold">৪</span>
                <h4>দুনিয়া ও আখেরাতে সুফল ও ফযিলত</h4>
              </div>
              <p className="text-emerald-100/90 leading-relaxed text-xs">
                {keyword.dunyaAndAkhirahImpactBn}
              </p>
            </div>

          </div>

          {/* Quranic Ayah Evidence Box */}
          {keyword.quranAyah && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-amber-400/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-emerald-800/80 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>কুরআনুল কারীমের অমিয় বাণী:</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40">
                  {keyword.quranAyah.surahName} : আয়াত {keyword.quranAyah.ayahNo}
                </span>
              </div>

              <div className="text-right font-serif text-base sm:text-xl text-amber-100 leading-relaxed py-1">
                {keyword.quranAyah.verseAr}
              </div>

              <p className="text-xs sm:text-sm text-emerald-100 font-medium italic border-t border-white/10 pt-2">
                "{keyword.quranAyah.verseBn}"
              </p>
            </div>
          )}

          {/* Sahih Hadith Evidence Box */}
          {keyword.hadithReference && (
            <div className="p-4 rounded-2xl bg-black/40 border border-teal-600/60 space-y-2">
              <div className="flex items-center justify-between text-xs text-teal-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-teal-400" />
                  <span>সহীহ হাদিসের দলিল:</span>
                </span>
                <span className="text-[11px] text-teal-200">
                  {keyword.hadithReference.bookBn} : হাদিস {keyword.hadithReference.hadithNo}
                </span>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed">
                <strong>{keyword.hadithReference.narratorBn} থেকে বর্ণিত: </strong>
                {keyword.hadithReference.textBn}
              </p>
            </div>
          )}

          {/* Connected Keyword Exploration Suggestions */}
          <div className="p-3 bg-black/30 rounded-xl border border-white/10 space-y-2 text-xs">
            <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>সম্পর্কিত আরও গুরুত্বপূর্ণ শব্দ ও জ্ঞান অন্বেষণ করুন:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(INTERACTIVE_KEYWORDS_DICTIONARY)
                .filter(id => id !== currentKeywordId)
                .slice(0, 5)
                .map(id => {
                  const item = INTERACTIVE_KEYWORDS_DICTIONARY[id];
                  return (
                    <button
                      key={id}
                      onClick={() => setCurrentKeywordId(id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-200 border border-emerald-700 hover:border-amber-400 transition cursor-pointer text-[11px] font-bold"
                    >
                      {item.keywordBn.split(' ')[0]} ➔
                    </button>
                  );
                })}
            </div>
          </div>

        </div>

        {/* 4. Modal Footer & Quick Action Launch */}
        <div className="p-3 sm:p-4 bg-black/60 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 relative z-10 shrink-0">
          <div className="text-[11px] text-emerald-300">
            জ্ঞান অর্জন শেষে আমলে পরিণত করাই প্রকৃত মুমিনের বৈশিষ্ট্য।
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-gray-300 text-xs font-bold transition border border-emerald-700 cursor-pointer"
            >
              বন্ধ করুন
            </button>

            {keyword.actionButtonLabelBn && (
              <button
                onClick={handleActionButton}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black transition shadow cursor-pointer flex items-center gap-1.5"
              >
                <span>{keyword.actionButtonLabelBn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
