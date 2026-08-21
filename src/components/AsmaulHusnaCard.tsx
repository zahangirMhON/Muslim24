import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Heart,
  CheckCircle2,
  Play,
  Square,
  Volume2,
  RotateCcw,
  Award,
  BookOpen,
  Star,
  ShieldCheck,
  Flame,
  ChevronRight,
  Filter,
  Layers,
  Clock,
  Target,
  FileText,
  Share2,
  Info,
  Calendar,
  Zap,
  Check,
  Lock,
  MessageSquare,
  Compass,
  ArrowRight,
  Vibrate,
  X
} from 'lucide-react';

import { ASMAUL_HUSNA_LIST, AsmaulHusnaItem, EvidenceLevel } from '../data/asmaulHusnaData';
import { ASMA_CHALLENGES, AsmaChallenge } from '../data/asmaulHusnaChallenges';
import {
  loadMasteryState,
  saveMasteryState,
  AsmaMasteryState,
  UserAsmaProgress,
  getSingleNameMasteryPercent,
  getOverallMasteryPercent,
  getMasteredNamesCount,
  getPracticingNamesCount,
  getSpacedReviewQueue,
  getRecommendedAsmaByTimeSlot,
  getTodayDateString
} from '../utils/asmaulHusnaMastery';
import { playAsmaulHusnaCompleteAudio, stopAsmaulHusnaAudio } from '../utils/asmaulHusnaAudio';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { triggerHaptic, launchDhikrInTasbih } from '../utils/haptics';
import { AmalCardModal } from './AmalCardModal';
import { getPreloadedAsma } from '../services/amalCardDataPreloader';

interface AsmaulHusnaCardProps {
  onPlayAudio?: (title: string, url: string) => void;
  lang?: string;
}

export const AsmaulHusnaCard: React.FC<AsmaulHusnaCardProps> = ({ onPlayAudio }) => {
  // Navigation Sub-Tabs within Asmaul Husna Ecosystem
  const [activeSubTab, setActiveSubTab] = useState<
    'today' | 'galaxy' | 'library' | 'tasbih' | 'challenges' | 'review'
  >('today');

  // Master State
  const [masteryState, setMasteryState] = useState<AsmaMasteryState>(() => loadMasteryState());
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('asmaul_husna_favs');
      return saved ? JSON.parse(saved) : [1, 2, 3, 16, 17, 38];
    } catch {
      return [1, 2, 3, 16, 17, 38];
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [selectedEvidenceFilter, setSelectedEvidenceFilter] = useState<string>('all');

  // Selected Detail Modal / Drawer
  const [selectedNameDetail, setSelectedNameDetail] = useState<AsmaulHusnaItem | null>(null);
  const [journalNote, setJournalNote] = useState('');

  // Audio playing state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  // Digital Tasbih State
  const [activeTasbihAsmaId, setActiveTasbihAsmaId] = useState<number>(1);
  const [tasbihCounter, setTasbihCounter] = useState<number>(0);

  // Challenge active state
  const [selectedChallenge, setSelectedChallenge] = useState<AsmaChallenge | null>(null);

  // Save mastery state on change
  useEffect(() => {
    saveMasteryState(masteryState);
  }, [masteryState]);

  useEffect(() => {
    try {
      localStorage.setItem('asmaul_husna_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Helper to get or init user progress for a name
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

  // Update specific progress fields
  const updateProgress = (asmaId: number, patch: Partial<UserAsmaProgress>) => {
    setMasteryState(prev => {
      const current = prev.progressMap[asmaId] || {
        asmaId,
        learned: false,
        understood: false,
        practiced: false,
        applied: false,
        tasbihCountToday: 0,
        reviewStage: 0
      };

      const updated = { ...current, ...patch, lastPracticedDate: getTodayDateString() };
      return {
        ...prev,
        lastActiveDate: getTodayDateString(),
        progressMap: {
          ...prev.progressMap,
          [asmaId]: updated
        }
      };
    });
  };

  // Play audio narration
  const handleTogglePlayAudio = (item: AsmaulHusnaItem) => {
    if (playingAudioId === item.id) {
      stopAsmaulHusnaAudio();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(item.id);
      playAsmaulHusnaCompleteAudio(
        item,
        () => {
          // Audio started
          updateProgress(item.id, { learned: true, understood: true });
        },
        () => {
          // Audio ended
          setPlayingAudioId(null);
        }
      );
    }
  };

  // Digital Tasbih Tap with Haptic Vibration
  const handleTasbihTap = (item: AsmaulHusnaItem) => {
    const target = item.recommendedCount || 33;
    const next = tasbihCounter + 1;
    setTasbihCounter(next);

    // Vibration feedback
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      if (next === 33) navigator.vibrate([40, 30, 40]);
      else if (next === 99) navigator.vibrate([60, 40, 60]);
      else if (next === 100 || next === target) navigator.vibrate([100, 50, 100, 50, 150]);
      else navigator.vibrate(15);
    }

    // Auto mark practice completed if target reached
    if (next >= target) {
      updateProgress(item.id, {
        practiced: true,
        tasbihCountToday: next
      });
    }
  };

  const handleResetTasbih = () => {
    setTasbihCounter(0);
  };

  // Evidence badge color & text label renderer
  const renderEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 'quran_proof':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            📖 কুরআনের দলিল
          </span>
        );
      case 'sahih_hadith':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            📜 সহিহ হাদিসের দলিল
          </span>
        );
      case 'hasan_hadith':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            🔵 হাসান হাদিস
          </span>
        );
      case 'personal_habit_target':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30" title="এই নির্দিষ্ট সংখ্যাটি ব্যক্তি দৈনন্দিন অভ্যাস তৈরি করার জন্য নির্ধারণ করা হয়েছে, এটি সুন্নাহর বাধ্যবাধকতা নয়।">
            🟡 ব্যক্তিগত অভ্যাস টার্গেট (Habit Target)
          </span>
        );
    }
  };

  // Calculations
  const overallMastery = getOverallMasteryPercent(masteryState.progressMap);
  const masteredCount = getMasteredNamesCount(masteryState.progressMap);
  const practicingCount = getPracticingNamesCount(masteryState.progressMap);
  const reviewQueue = getSpacedReviewQueue(masteryState.progressMap);

  // Time Slot recommendation
  const currentHour = new Date().getHours();
  let timeSlotKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'bedtime' = 'fajr';
  let slotTitleBn = '🌅 ফজর ও সকালের শুভ সূচনা';
  if (currentHour >= 5 && currentHour < 12) {
    timeSlotKey = 'fajr';
    slotTitleBn = '🌅 ফজর ও সকালের জিকির';
  } else if (currentHour >= 12 && currentHour < 15) {
    timeSlotKey = 'dhuhr';
    slotTitleBn = '☀️ জোহর ও দুপুরের প্রশান্তি';
  } else if (currentHour >= 15 && currentHour < 18) {
    timeSlotKey = 'asr';
    slotTitleBn = '🌇 আসর ও বিকেলের তাওয়াক্কুল';
  } else if (currentHour >= 18 && currentHour < 20) {
    timeSlotKey = 'maghrib';
    slotTitleBn = '🌆 মাগরিব ও সন্ধ্যার ইস্তিগফার';
  } else if (currentHour >= 20 && currentHour < 22) {
    timeSlotKey = 'isha';
    slotTitleBn = '🕌 এশা ও রাতের আমল';
  } else {
    timeSlotKey = 'bedtime';
    slotTitleBn = '🌙 ঘুমের পূর্বের নিরাপত্তা ও সুরক্ষা';
  }

  const todayRecommendedAsma = getRecommendedAsmaByTimeSlot(timeSlotKey);

  // Filtered List for Galaxy Grid & Library
  const categories = ['সব', 'রহমত ও ক্ষমা', 'রিজিক ও সাহায্য', 'শক্তি ও আধিপত্য', 'জ্ঞান ও হেদায়েত', 'পছন্দের তালিকায়'];

  const filteredList = ASMAUL_HUSNA_LIST.filter(item => {
    const matchesSearch =
      item.arabic.includes(searchQuery) ||
      item.transliterationBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaningBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.virtueBn.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'পছন্দের তালিকায়') {
      if (!favorites.includes(item.id)) return false;
    } else if (selectedCategory !== 'সব') {
      if (item.categoryBn !== selectedCategory) return false;
    }

    if (selectedEvidenceFilter !== 'all') {
      if (item.evidenceLevel !== selectedEvidenceFilter) return false;
    }

    return true;
  });

  return (
    <div id="asmaul-husna-master-card" className="bg-emerald-900/60 backdrop-blur-xl border border-emerald-700/50 rounded-3xl p-4 sm:p-6 shadow-2xl text-emerald-50 space-y-6">
      
      {/* 1. Ecosystem Header & Mastery Progress Dashboard */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 rounded-2xl border border-emerald-600/40 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                আসমাউল হুসনা — ৯৯ নাম, ৯৯ অভ্যাস
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                শেখা → বুঝা → আমল → ট্র্যাকিং
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
              Asmaul Husna Habit & Amal System
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
              শুধু মুখস্থ নয়; কুরআনিক প্রমাণ, সহিহ হাদীসের ফযীলত ও বাস্তব জীবনের ৯৯টি আখলাক পরিবর্তনের পূর্ণাঙ্গ ব্যবস্থা।
            </p>
          </div>

          {/* Quick Mastery Score & Streaks */}
          <div className="flex items-center gap-3 bg-emerald-900/80 p-3 rounded-2xl border border-emerald-700/50 self-stretch sm:self-auto justify-around">
            <div className="text-center px-2">
              <div className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                আমল স্ট্রাইক
              </div>
              <div className="text-xl font-bold text-amber-300">
                {toBengaliDigits(masteryState.amalStreak)} দিন
              </div>
            </div>
            <div className="h-8 w-px bg-emerald-700/60" />
            <div className="text-center px-2">
              <div className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-emerald-400" />
                মাস্টারি স্কোর
              </div>
              <div className="text-xl font-bold text-emerald-200">
                {toBengaliDigits(overallMastery)}%
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-emerald-300 font-medium">
            <span>৯৫টি নামের ৯৯ ধাপে পরিবর্তন</span>
            <span className="text-amber-300 font-bold">
              {toBengaliDigits(masteredCount)}টি অর্জিত (Mastered) • {toBengaliDigits(practicingCount)}টি চলমান
            </span>
          </div>
          <div className="w-full h-3 bg-emerald-950/80 rounded-full overflow-hidden p-0.5 border border-emerald-700/50">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${overallMastery}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Top Interactive Navigation Sub-Tabs */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-emerald-700/40">
        <button
          onClick={() => setActiveSubTab('today')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'today'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
              : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-800/80'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>আজকের নাম ও স্লট</span>
        </button>

        <button
          onClick={() => setActiveSubTab('galaxy')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'galaxy'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
              : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-800/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>৯৯ নামের গ্যালাক্সি ({toBengaliDigits(99)})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('library')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'library'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
              : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-800/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>আমল ও দলীল লাইব্রেরি</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tasbih')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'tasbih'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
              : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-800/80'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-900" />
          <span>ডিজিটাল তাসবিহ ও জিকির</span>
        </button>

        <button
          onClick={() => setActiveSubTab('challenges')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'challenges'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
              : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-800/80'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>আমল কোর্স ও চ্যালেঞ্জ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('review')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'review'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
              : 'bg-emerald-800/40 text-emerald-200 hover:bg-emerald-800/80'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>স্পেসড রিভিউ ({toBengaliDigits(reviewQueue.length)})</span>
        </button>
      </nav>

      {/* SUB-TAB 1: TODAY'S NAME & TIME-AWARE SLOT WIDGET */}
      {activeSubTab === 'today' && (
        <div className="space-y-6">
          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-9xl font-serif text-amber-300">
              {todayRecommendedAsma.arabic}
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {slotTitleBn}
                </span>
                {renderEvidenceBadge(todayRecommendedAsma.evidenceLevel)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Main Asma Callout */}
                <div className="md:col-span-5 text-center md:text-left space-y-2 bg-emerald-900/40 p-4 rounded-xl border border-emerald-700/40">
                  <span className="text-xs text-emerald-300 font-semibold">
                    নাম নং {toBengaliDigits(todayRecommendedAsma.id)}
                  </span>
                  <div className="text-4xl sm:text-5xl font-serif font-bold text-amber-300 tracking-wide">
                    {todayRecommendedAsma.arabic}
                  </div>
                  <div className="text-lg font-bold text-emerald-100">
                    {todayRecommendedAsma.transliterationBn}
                  </div>
                  <div className="text-xs text-emerald-200 font-medium italic">
                    "{todayRecommendedAsma.meaningBn}"
                  </div>
                </div>

                {/* Practical Task & Audio Action */}
                <div className="md:col-span-7 space-y-3">
                  <div className="bg-emerald-900/60 p-4 rounded-xl border border-emerald-700/50 space-y-2">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      আজকের বাস্তব জীবনের ছোট আমল:
                    </div>
                    <p className="text-sm text-emerald-50 leading-relaxed font-medium">
                      {todayRecommendedAsma.lifeApplicationTaskBn}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => handleTogglePlayAudio(todayRecommendedAsma)}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition flex items-center gap-2 shadow-md"
                    >
                      {playingAudioId === todayRecommendedAsma.id ? (
                        <>
                          <Square className="w-4 h-4 fill-emerald-950" />
                          <span>অডিও থামান</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-emerald-950" />
                          <span>শব্দোচ্চারণ ও বাংলা ব্যাখ্যা শুনুন</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedNameDetail(todayRecommendedAsma)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-800 text-emerald-100 border border-emerald-600/50 hover:bg-emerald-700 font-bold text-xs sm:text-sm transition flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>সম্পূর্ণ আমল কার্ড দেখুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Grid Preview of Favorites & Daily Focus */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-200 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                আপনার পছন্দের ও আজকের বিশেষ জিকির
              </h3>
              <button
                onClick={() => setActiveSubTab('galaxy')}
                className="text-xs font-bold text-amber-300 hover:underline flex items-center gap-1"
              >
                সব ৯৯টি দেখুন <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ASMAUL_HUSNA_LIST.slice(0, 6).map(item => {
                const prog = getProgress(item.id);
                const percent = getSingleNameMasteryPercent(prog);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedNameDetail(item)}
                    className="bg-emerald-950/60 hover:bg-emerald-800/60 transition cursor-pointer p-4 rounded-2xl border border-emerald-700/50 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-700/50">
                        #{toBengaliDigits(item.id)}
                      </span>
                      {renderEvidenceBadge(item.evidenceLevel)}
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-2xl font-serif font-bold text-amber-300 group-hover:scale-105 transition-transform">
                        {item.arabic}
                      </div>
                      <div className="text-sm font-bold text-emerald-100">
                        {item.transliterationBn}
                      </div>
                      <div className="text-xs text-emerald-300/80 line-clamp-1">
                        {item.meaningBn}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-emerald-300 font-medium">
                        <span>মাস্টারি প্রগ্রেস</span>
                        <span className="text-amber-300 font-bold">{toBengaliDigits(percent)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-emerald-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 99 NAMES MASTERY GALAXY GRID */}
      {activeSubTab === 'galaxy' && (
        <div className="space-y-6">
          {/* Search & Category Filter Controls */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Field */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="আরবি নাম, অর্থ বা ফজিলত লিখে খুঁজুন..."
                  className="w-full bg-emerald-900/80 border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-emerald-50 placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Evidence Level Filter */}
              <div className="sm:col-span-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={selectedEvidenceFilter}
                  onChange={e => setSelectedEvidenceFilter(e.target.value)}
                  className="w-full bg-emerald-900/80 border border-emerald-700/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-emerald-50 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">সকল দলীল স্তর (All Evidence)</option>
                  <option value="quran_proof">📖 কুরআন ভিত্তিক প্রমাণ</option>
                  <option value="sahih_hadith">📜 সহিহ হাদিসের প্রমাণ</option>
                  <option value="personal_habit_target">🟡 ব্যক্তিগত অভ্যাস টার্গেট (Habit Target)</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-emerald-950 shadow-sm'
                      : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 99 Grid View */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredList.map(item => {
              const prog = getProgress(item.id);
              const percent = getSingleNameMasteryPercent(prog);
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedNameDetail(item)}
                  className="bg-emerald-950/70 hover:bg-emerald-800/70 transition cursor-pointer p-3.5 rounded-2xl border border-emerald-700/50 space-y-2 relative group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                    <span>#{toBengaliDigits(item.id)}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="p-1 hover:text-amber-400 transition"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'text-amber-400 fill-amber-400' : 'text-emerald-500'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-center py-1">
                    <div className="text-2xl font-serif font-bold text-amber-300 group-hover:scale-105 transition-transform">
                      {item.arabic}
                    </div>
                    <div className="text-xs font-bold text-emerald-100 truncate">
                      {item.transliterationBn}
                    </div>
                    <div className="text-[11px] text-emerald-300/80 truncate">
                      {item.meaningBn}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-emerald-800/60">
                    <div className="flex justify-between items-center text-[10px] text-emerald-300 font-semibold">
                      <span>মাস্টারি</span>
                      <span className="text-amber-300">{toBengaliDigits(percent)}%</span>
                    </div>
                    <div className="w-full h-1 bg-emerald-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EVIDENCE & AMAL LIBRARY */}
      {activeSubTab === 'library' && (
        <div className="space-y-6">
          <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/50 space-y-3">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              কুরআন ও সহিহ দলীলভিত্তিক আমল লাইব্রেরি
            </h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              ইসলামিক শরিয়াহর বিশ্বস্ততা রক্ষায় অ্যাপটিতে প্রতিটি আমলের দলীল স্পষ্ট করা হয়েছে। বিশেষ কোনো সংখ্যাকে সুন্নাহ হিসেবে দাবি না করে নির্ভরযোগ্য দলীল অনুযায়ী 'সহিহ হাদীস', 'কুরআনের আয়াত' ও 'ব্যক্তিগত অভ্যাস টার্গেট' আলাদা দেখানো হয়েছে।
            </p>
          </div>

          <div className="space-y-4">
            {filteredList.map(item => (
              <div
                key={item.id}
                className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/50 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      #{toBengaliDigits(item.id)}
                    </span>
                    <span className="text-lg font-serif font-bold text-amber-300">
                      {item.arabic}
                    </span>
                    <span className="text-sm font-bold text-emerald-100">
                      ({item.transliterationBn})
                    </span>
                  </div>
                  {renderEvidenceBadge(item.evidenceLevel)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-emerald-200 bg-emerald-900/30 p-3 rounded-xl">
                  <div>
                    <span className="font-bold text-amber-300 block mb-1">📖 কুরআনের সনদ/রেফারেন্স:</span>
                    <p>{item.quranRefBn || 'সূরা আল-আ\'রাফ: ১৮০'}</p>
                  </div>
                  <div>
                    <span className="font-bold text-cyan-300 block mb-1">📜 হাদীসের সনদ/রেফারেন্স:</span>
                    <p>{item.hadithRefBn || 'সহিহ বুখারী ২৭৩৬ (আল্লাহর সুন্দর নামসমূহ)'}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-emerald-300">🤲 কীভাবে এই নামে দোয়া করবেন:</div>
                  <p className="text-emerald-100 italic bg-emerald-900/20 p-2.5 rounded-lg border border-emerald-800/40">
                    "{item.duaWithThisNameBn}"
                  </p>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setSelectedNameDetail(item)}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 text-xs font-bold hover:bg-amber-300 transition flex items-center gap-1.5"
                  >
                    <span>আমল কার্ড খুলুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INTERACTIVE DIGITAL TASBIH & AUTO SYNC */}
      {activeSubTab === 'tasbih' && (
        <div className="space-y-6 max-w-xl mx-auto">
          {(() => {
            const currentItem =
              ASMAUL_HUSNA_LIST.find(i => i.id === activeTasbihAsmaId) || ASMAUL_HUSNA_LIST[0];
            const targetCount = currentItem.recommendedCount || 33;
            const progressPercent = Math.min(100, Math.round((tasbihCounter / targetCount) * 100));

            return (
              <div className="bg-emerald-950/90 border border-emerald-700/60 rounded-3xl p-6 text-center space-y-6 shadow-2xl">
                {/* Select Asma Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 block">
                    জিকির ও ডিজিটাল তাসবিহের জন্য নাম নির্বাচন করুন:
                  </label>
                  <select
                    value={activeTasbihAsmaId}
                    onChange={e => {
                      setActiveTasbihAsmaId(Number(e.target.value));
                      setTasbihCounter(0);
                    }}
                    className="w-full bg-emerald-900/80 border border-emerald-700/60 rounded-xl px-4 py-2 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    {ASMAUL_HUSNA_LIST.map(item => (
                      <option key={item.id} value={item.id}>
                        #{toBengaliDigits(item.id)} {item.arabic} — {item.transliterationBn} ({item.meaningBn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Asma Display */}
                <div className="space-y-1">
                  <div className="text-4xl font-serif font-bold text-amber-300 tracking-wider">
                    {currentItem.arabic}
                  </div>
                  <div className="text-base font-bold text-emerald-100">
                    {currentItem.transliterationBn}
                  </div>
                  <div className="text-xs text-emerald-300 font-medium">
                    "{currentItem.meaningBn}"
                  </div>
                  <div className="pt-2">{renderEvidenceBadge(currentItem.evidenceLevel)}</div>
                </div>

                {/* Big Interactive Touch Counter Circle */}
                <div className="flex flex-col items-center justify-center py-2">
                  <button
                    onClick={() => handleTasbihTap(currentItem)}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 border-4 border-amber-400/60 hover:border-amber-400 shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center space-y-1 relative group cursor-pointer"
                  >
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                      ট্যাপ করুন
                    </span>
                    <span className="text-5xl font-extrabold text-amber-300 font-mono">
                      {toBengaliDigits(tasbihCounter)}
                    </span>
                    <span className="text-[11px] text-emerald-300/80">
                      লক্ষ্য: {toBengaliDigits(targetCount)}
                    </span>
                  </button>
                </div>

                {/* Milestone Indicators */}
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-emerald-300">
                  <span
                    className={`px-3 py-1 rounded-full border ${
                      tasbihCounter >= 33
                        ? 'bg-amber-400 text-emerald-950 border-amber-400'
                        : 'bg-emerald-900/60 border-emerald-700/50'
                    }`}
                  >
                    ৩৩ {tasbihCounter >= 33 && '✓'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full border ${
                      tasbihCounter >= 99
                        ? 'bg-amber-400 text-emerald-950 border-amber-400'
                        : 'bg-emerald-900/60 border-emerald-700/50'
                    }`}
                  >
                    ৯৯ {tasbihCounter >= 99 && '✓'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full border ${
                      tasbihCounter >= 100
                        ? 'bg-amber-400 text-emerald-950 border-amber-400'
                        : 'bg-emerald-900/60 border-emerald-700/50'
                    }`}
                  >
                    ১০০ {tasbihCounter >= 100 && '✓'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetTasbih}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-200 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>রিসেট কাউন্টার</span>
                  </button>

                  <button
                    onClick={() => {
                      updateProgress(currentItem.id, { practiced: true });
                      alert('আজকের জিকির ডাটাবেসে সফলভাবে যুক্ত হয়েছে!');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 text-xs font-bold hover:bg-amber-300 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>আজকের আমল সম্পন্ন হিসেবে সেভ করুন</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SUB-TAB 5: AMAL COURSES & HABIT CHALLENGES */}
      {activeSubTab === 'challenges' && (
        <div className="space-y-6">
          <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/50 space-y-2">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Award className="w-5 h-5" />
              আসমাউল হুসনা অভ্যাস ও আমল কোর্সসমূহ
            </h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              নির্দিষ্ট দিন মেয়াদী এই অভ্যাস কোর্সগুলো আপনার জীবনধারা, নৈতিক আচরণ ও আত্মিক প্রশান্তিতে দীর্ঘমেয়াদী ইতিবাচক পরিবর্তন আনবে ইনশাআল্লাহ।
            </p>
          </div>

          {/* Challenge Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ASMA_CHALLENGES.map(ch => (
              <div
                key={ch.id}
                onClick={() => setSelectedChallenge(ch)}
                className={`bg-gradient-to-br ${ch.gradientClass} p-5 rounded-2xl border border-amber-400/30 hover:border-amber-400 transition cursor-pointer space-y-4 shadow-xl flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{ch.badgeIcon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-emerald-950">
                      {toBengaliDigits(ch.durationDays)} দিন
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-amber-300 leading-snug">
                    {ch.titleBn}
                  </h4>
                  <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                    {ch.subtitleBn}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-700/50 flex items-center justify-between text-xs font-bold text-amber-200">
                  <span>কোর্স শুরু করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Selected Challenge Roadmap Modal/View */}
          {selectedChallenge && (
            <div className="bg-emerald-950/90 border border-emerald-700/60 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                    <span>{selectedChallenge.badgeIcon}</span>
                    <span>{selectedChallenge.titleBn}</span>
                  </h4>
                  <p className="text-xs text-emerald-300">
                    {selectedChallenge.descriptionBn}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-emerald-200 text-xs font-bold hover:bg-emerald-700"
                >
                  বন্ধ করুন
                </button>
              </div>

              {/* Day-by-day Timeline */}
              <div className="space-y-3 pt-2">
                {selectedChallenge.days.map(day => {
                  const asmaItem = ASMAUL_HUSNA_LIST.find(i => i.id === day.asmaId);
                  return (
                    <div
                      key={day.dayNumber}
                      className="bg-emerald-900/50 p-4 rounded-xl border border-emerald-700/40 space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                          {day.titleBn}
                        </span>
                        {asmaItem && (
                          <span className="text-sm font-serif font-bold text-amber-300">
                            {asmaItem.arabic} ({asmaItem.transliterationBn})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-emerald-100 font-medium">
                        💼 <span className="font-bold text-amber-300">আজকের কাজ:</span> {day.actionTaskBn}
                      </p>
                      <p className="text-xs text-emerald-300 italic">
                        🧠 <span className="font-bold">আজকের ভাবনা:</span> "{day.reflectionPromptBn}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 6: SPACED REPETITION & REFLECTION JOURNAL */}
      {activeSubTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/50 space-y-2">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              "Never Forget 99" — স্মার্ট পুনরাবৃত্তি ও রিভিউ
            </h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              একবার শেখার পর যাতে ৯৯টি নাম ভুলে না যান, সেজন্য স্পেসড রিপিটিশন (Spaced Repetition) অ্যালগোরিদম ১, ৩, ৭, ১৪ ও ৩০ দিন পর পর স্বয়ংক্রিয়ভাবে পূর্বের শেখা নামগুলো রিভিউ কিউতে নিয়ে আসবে।
            </p>
          </div>

          {reviewQueue.length === 0 ? (
            <div className="bg-emerald-950/60 p-8 rounded-2xl border border-emerald-700/50 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-amber-300">
                মাশাআল্লাহ! আপনার সমস্ত শেখা নাম রিভিশন সম্পন্ন আছে।
              </h4>
              <p className="text-xs text-emerald-300">
                নতুন কোনো নাম শিখলে বা কয়েক দিন পার হলে সেগুলো স্বয়ংক্রিয়ভাবে এখানে রিভিশনের জন্য চলে আসবে।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                আজকের রিভিশন কিউ ({toBengaliDigits(reviewQueue.length)}টি নাম বাকি):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviewQueue.map(item => (
                  <div
                    key={item.id}
                    className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">
                        #{toBengaliDigits(item.id)}
                      </span>
                      <span className="text-xl font-serif font-bold text-amber-300">
                        {item.arabic}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-emerald-100">
                      {item.transliterationBn} — "{item.meaningBn}"
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          updateProgress(item.id, {
                            lastReviewedDate: getTodayDateString(),
                            reviewStage: (getProgress(item.id).reviewStage || 0) + 1
                          });
                          alert('রিভিশন সম্পন্ন হিসেবে সেভ হয়েছে!');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-emerald-950 text-xs font-bold hover:bg-amber-300 transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>রিভিশন সম্পন্ন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. COMPLETE REFACTORED AMAL CARD MODAL (PORTAL-RENDERED WITH FIXED Z-INDEX) */}
      <AmalCardModal
        isOpen={!!selectedNameDetail}
        itemData={selectedNameDetail}
        onClose={() => setSelectedNameDetail(null)}
      />
    </div>
  );
};
