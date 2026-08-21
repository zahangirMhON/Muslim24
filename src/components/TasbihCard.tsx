import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  BookOpen,
  Vibrate,
  Volume2,
  VolumeX,
  Clock,
  ArrowRight,
  X,
  Check,
  RefreshCw,
  Play,
  Square,
  Repeat,
  Gauge,
  HelpCircle,
  Headphones,
  Maximize2,
  BarChart2,
  TrendingUp
} from 'lucide-react';
import { AzkarItem, Language } from '../types';
import { DAILY_AZKAR } from '../data/islamicData';
import { COMPREHENSIVE_DAILY_DUAS, DAILY_DUAS_CATEGORIES, DailyDuaItem } from '../data/dailyDuasData';
import { ASMAUL_HUSNA_LIST, AsmaulHusnaItem } from '../data/asmaulHusnaData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { translations } from '../locales/translations';
import { triggerHaptic, LaunchDhikrPayload, initAudioContext } from '../utils/haptics';
import { AsmaulHusnaCard } from './AsmaulHusnaCard';
import {
  toggleAmalCompletion,
  recordAmalProgress,
  openUserProfileProgressTab,
  promptAmalLoginModal
} from '../services/amalTrackerService';
import {
  playDuaAudio,
  stopDuaAudio,
  previewPronunciation,
  getCurrentPlayingDuaId
} from '../utils/duaAudioPlayer';

interface TasbihCardProps {
  lang: Language;
  onPlayAudio?: (title: string, url: string) => void;
}

export const TasbihCard: React.FC<TasbihCardProps> = ({ lang, onPlayAudio }) => {
  const t = translations[lang];

  // Top Section View Tabs: 'tasbih' (Digital Tasbih), 'dailyDuas' (Daily Duas & Amals), 'asmaulHusna' (99 Names of Allah)
  const [activeTab, setActiveTab] = useState<'tasbih' | 'dailyDuas' | 'asmaulHusna'>('tasbih');

  // Today's Suggested Asmaul Husna Index
  const [suggestedAsmaIndex, setSuggestedAsmaIndex] = useState<number>(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dayOfYear % ASMAUL_HUSNA_LIST.length;
  });

  // Azkar List for Digital Tasbih
  const [azkarList, setAzkarList] = useState<AzkarItem[]>(() => {
    try {
      const saved = localStorage.getItem('user_tasbih_azkar_list_v2');
      return saved ? JSON.parse(saved) : DAILY_AZKAR;
    } catch {
      return DAILY_AZKAR;
    }
  });
  const [selectedAzkarId, setSelectedAzkarId] = useState<string>('subhanallah');

  // Vibration & Sound Sensory Preferences
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tasbih_vibration_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tasbih_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Audio Player State for Duas & Azkar
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85); // 0.85x for slow & clear practice
  const [audioLoop, setAudioLoop] = useState<boolean>(false);
  const [audioMode, setAudioPlayerMode] = useState<'arabic_only' | 'arabic_and_meaning'>('arabic_only');

  // Detailed Modal for a specific Dua
  const [selectedDetailDua, setSelectedDetailDua] = useState<DailyDuaItem | null>(null);

  // Daily Duas Filters & Search
  const [duaCategoryFilter, setDuaCategoryFilter] = useState<string>('all');
  const [duaCountFilter, setDuaCountFilter] = useState<'all' | 'small' | '100' | 'mid' | 'khatam'>('all');
  const [duaSearchQuery, setDuaSearchQuery] = useState<string>('');
  const [completedDuas, setCompletedDuas] = useState<{ [id: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('user_completed_daily_duas');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Custom Dhikr Modal state
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customArabic, setCustomArabic] = useState<string>('');
  const [customTranslation, setCustomTranslation] = useState<string>('');
  const [customTarget, setCustomTarget] = useState<number>(1000);
  const [customTimeSlot, setCustomTimeSlot] = useState<string>('দিনে যেকোনো সময়');
  const [isPreviewingCustomArabic, setIsPreviewingCustomArabic] = useState<boolean>(false);
  const [isPreviewingCustomBangla, setIsPreviewingCustomBangla] = useState<boolean>(false);

  // Inline Custom Target Switcher in Tasbih
  const [showInlineTargetInput, setShowInlineTargetInput] = useState<boolean>(false);
  const [inlineTargetValue, setInlineTargetValue] = useState<string>('');

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('user_tasbih_azkar_list_v2', JSON.stringify(azkarList));
    } catch (e) {
      console.error(e);
    }
  }, [azkarList]);

  useEffect(() => {
    try {
      localStorage.setItem('user_completed_daily_duas', JSON.stringify(completedDuas));
    } catch (e) {
      console.error(e);
    }
  }, [completedDuas]);

  useEffect(() => {
    try {
      localStorage.setItem('tasbih_vibration_enabled', JSON.stringify(vibrationEnabled));
    } catch (e) {
      console.error(e);
    }
  }, [vibrationEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('tasbih_sound_enabled', JSON.stringify(soundEnabled));
    } catch (e) {
      console.error(e);
    }
  }, [soundEnabled]);

  // Clean up audio when switching tabs
  useEffect(() => {
    stopDuaAudio();
    setPlayingId(null);
  }, [activeTab]);

  // Global 1-Click Dhikr Listener from anywhere in the app
  useEffect(() => {
    const handleLaunchDhikr = (event: CustomEvent<LaunchDhikrPayload>) => {
      const payload = event.detail;
      if (!payload) return;
      const targetId = payload.id || `launched-${Date.now()}`;

      setAzkarList(prev => {
        const existingIdx = prev.findIndex(a => a.id === targetId || a.arabicText === payload.arabicText);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            targetCount: payload.targetCount || updated[existingIdx].targetCount,
            titleBn: payload.titleBn || updated[existingIdx].titleBn,
            translationBn: payload.translationBn || updated[existingIdx].translationBn
          };
          return updated;
        } else {
          const newDhikr: AzkarItem = {
            id: targetId,
            category: 'daily',
            titleBn: payload.titleBn,
            titleEn: payload.titleEn || payload.titleBn,
            arabicText: payload.arabicText,
            transliterationBn: payload.transliterationBn,
            translationBn: payload.translationBn,
            referenceBn: payload.referenceBn || 'সহীহ হাদিস ও মাসনূন আমল',
            targetCount: payload.targetCount || 100,
            completedCount: 0
          };
          return [newDhikr, ...prev];
        }
      });

      setSelectedAzkarId(targetId);
      setActiveTab('tasbih');
      triggerHaptic('tap', vibrationEnabled, soundEnabled);
    };

    window.addEventListener('start-dhikr-tasbih' as any, handleLaunchDhikr as EventListener);
    return () => {
      window.removeEventListener('start-dhikr-tasbih' as any, handleLaunchDhikr as EventListener);
    };
  }, [vibrationEnabled, soundEnabled]);

  const selectedAzkar = azkarList.find(a => a.id === selectedAzkarId) || azkarList[0] || DAILY_AZKAR[0];
  const suggestedAsma = ASMAUL_HUSNA_LIST[suggestedAsmaIndex] || ASMAUL_HUSNA_LIST[0];

  // Increment counter handler
  const handleIncrement = () => {
    initAudioContext();
    let nextCount = 0;
    let target = 100;
    let currentItemTitle = '';
    setAzkarList(prev =>
      prev.map(item => {
        if (item.id === selectedAzkarId) {
          const newCount = item.completedCount + 1;
          const isCompleted = newCount >= item.targetCount;
          nextCount = newCount;
          target = item.targetCount;
          currentItemTitle = item.titleBn;
          return {
            ...item,
            completedCount: newCount,
            isCompleted
          };
        }
        return item;
      })
    );

    // Record progress to Unified Tracker
    recordAmalProgress(selectedAzkarId, {
      category: 'dhikr',
      titleBn: currentItemTitle || 'জিকির ও তসবিহ',
      targetCount: target,
      completedCount: nextCount,
      isCompleted: nextCount >= target
    });

    // Sensory Haptic & Audio feedback
    if (nextCount === target) {
      triggerHaptic('complete', vibrationEnabled, soundEnabled);
    } else if (nextCount === 33 || nextCount === 66 || nextCount === 99 || nextCount === 100) {
      triggerHaptic('milestone', vibrationEnabled, soundEnabled);
    } else {
      triggerHaptic('tap', vibrationEnabled, soundEnabled);
    }
  };

  const handleReset = () => {
    initAudioContext();
    setAzkarList(prev =>
      prev.map(item =>
        item.id === selectedAzkarId
          ? { ...item, completedCount: 0, isCompleted: false }
          : item
      )
    );
    triggerHaptic('reset', vibrationEnabled, soundEnabled);
  };

  // ================= AUDIO PLAYBACK CONTROL =================
  const togglePlayAudio = (
    id: string,
    data: {
      titleBn: string;
      arabicText: string;
      transliterationBn?: string;
      translationBn?: string;
    }
  ) => {
    initAudioContext();
    if (playingId === id) {
      stopDuaAudio();
      setPlayingId(null);
    } else {
      setPlayingId(id);
      playDuaAudio(
        id,
        data,
        {
          speed: audioSpeed,
          mode: audioMode,
          loop: audioLoop,
          onStart: () => setPlayingId(id),
          onEnd: () => setPlayingId(null),
          onError: () => setPlayingId(null)
        }
      );
    }
  };

  // Handle custom dhikr creation
  const handleAddCustomDhikr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newId = `custom-${Date.now()}`;
    const newAzkar: AzkarItem = {
      id: newId,
      category: 'daily',
      titleBn: customTitle.trim(),
      titleEn: customTitle.trim(),
      arabicText: customArabic.trim() || customTitle.trim(),
      transliterationBn: customTimeSlot.trim() || customTitle.trim(),
      translationBn: customTranslation.trim() || 'নিজস্ব সংকল্পিত আমল ও জিকির।',
      referenceBn: `সময়: ${customTimeSlot || 'সারাদিন'} | নিজস্ব লক্ষ্য`,
      targetCount: Math.max(1, customTarget),
      completedCount: 0
    };

    setAzkarList(prev => [newAzkar, ...prev]);
    setSelectedAzkarId(newId);
    setShowAddCustomModal(false);
    setCustomTitle('');
    setCustomArabic('');
    setCustomTranslation('');
    setCustomTarget(100);
    setCustomTimeSlot('দিনে যেকোনো সময়');
    triggerHaptic('milestone', vibrationEnabled, soundEnabled);
  };

  const handleDeleteCustom = (id: string) => {
    setAzkarList(prev => prev.filter(item => item.id !== id));
    if (selectedAzkarId === id) {
      setSelectedAzkarId(DAILY_AZKAR[0].id);
    }
  };

  const loadDuaToTasbih = (dua: DailyDuaItem) => {
    const targetId = `dua-${dua.id}`;
    setAzkarList(prev => {
      const exists = prev.find(a => a.id === targetId);
      if (exists) return prev;
      const newDhikr: AzkarItem = {
        id: targetId,
        category: 'daily',
        titleBn: dua.titleBn,
        titleEn: dua.titleEn,
        arabicText: dua.arabicText,
        transliterationBn: dua.transliterationBn,
        translationBn: dua.translationBn,
        referenceBn: `${dua.sahihReferenceBn} (কখন: ${dua.whenToReciteBn})`,
        targetCount: dua.targetCount,
        completedCount: 0
      };
      return [newDhikr, ...prev];
    });

    setSelectedAzkarId(targetId);
    setActiveTab('tasbih');
    if (selectedDetailDua) setSelectedDetailDua(null);
    triggerHaptic('tap', vibrationEnabled, soundEnabled);
  };

  const loadAsmaToTasbih = (item: AsmaulHusnaItem) => {
    const targetId = `asma-${item.id}`;
    const targetCount = item.recommendedCount || 100;
    setAzkarList(prev => {
      const exists = prev.find(a => a.id === targetId);
      if (exists) {
        return prev.map(a => a.id === targetId ? { ...a, targetCount } : a);
      }
      const newDhikr: AzkarItem = {
        id: targetId,
        category: 'daily',
        titleBn: `ইয়া ${item.transliterationBn} (يَا ${item.arabic})`,
        titleEn: item.transliterationBn,
        arabicText: `يَا ${item.arabic}`,
        transliterationBn: `ইয়া ${item.transliterationBn}`,
        translationBn: `${item.meaningBn} • ফজিলত: ${item.virtueBn}`,
        referenceBn: item.hadithRefBn || item.quranRefBn || 'আল্লাহর পবিত্র ৯৯ নাম',
        targetCount: targetCount,
        completedCount: 0
      };
      return [newDhikr, ...prev];
    });

    setSelectedAzkarId(targetId);
    setActiveTab('tasbih');
    triggerHaptic('tap', vibrationEnabled, soundEnabled);
  };

  const toggleDuaCompletion = (duaId: string, customTitleBn?: string) => {
    const foundDua = COMPREHENSIVE_DAILY_DUAS.find(d => d.id === duaId);
    const title = customTitleBn || foundDua?.titleBn || 'মাসনূন দোয়া';

    promptAmalLoginModal(title, () => {
      setCompletedDuas(prev => ({
        ...prev,
        [duaId]: !prev[duaId]
      }));
      toggleAmalCompletion(duaId, 'dua', title);
      triggerHaptic('tap', vibrationEnabled, soundEnabled);
    });
  };

  const updateSelectedAzkarTarget = (count: number) => {
    initAudioContext();
    const newTarget = Math.max(1, count);
    setAzkarList(prev =>
      prev.map(item =>
        item.id === selectedAzkarId
          ? { ...item, targetCount: newTarget, isCompleted: item.completedCount >= newTarget }
          : item
      )
    );
    setShowInlineTargetInput(false);
    triggerHaptic('milestone', vibrationEnabled, soundEnabled);
  };

  const getDynamicMilestones = (target: number) => {
    if (target <= 33) return [11, 22, 33];
    if (target <= 100) return [33, 66, 99, 100];
    if (target <= 300) return [100, 200, 300];
    if (target <= 500) return [100, 250, 400, 500];
    if (target <= 1000) return [250, 500, 750, 1000];
    if (target <= 5000) return [1000, 2500, 4000, 5000];
    return [
      Math.round(target * 0.25),
      Math.round(target * 0.5),
      Math.round(target * 0.75),
      target
    ];
  };

  // Filtered daily duas list
  const filteredDuas = COMPREHENSIVE_DAILY_DUAS.filter(d => {
    const matchesCategory = duaCategoryFilter === 'all' || d.category === duaCategoryFilter;
    const matchesCount =
      duaCountFilter === 'all' ||
      (duaCountFilter === 'small' && d.targetCount <= 33) ||
      (duaCountFilter === '100' && d.targetCount === 100) ||
      (duaCountFilter === 'mid' && d.targetCount > 100 && d.targetCount <= 500) ||
      (duaCountFilter === 'khatam' && d.targetCount >= 1000);
    const matchesSearch =
      !duaSearchQuery.trim() ||
      d.titleBn.toLowerCase().includes(duaSearchQuery.toLowerCase()) ||
      d.transliterationBn.toLowerCase().includes(duaSearchQuery.toLowerCase()) ||
      d.translationBn.toLowerCase().includes(duaSearchQuery.toLowerCase()) ||
      d.whenToReciteBn.toLowerCase().includes(duaSearchQuery.toLowerCase());
    return matchesCategory && matchesCount && matchesSearch;
  });

  return (
    <div id="tasbih-section-root" className="bg-emerald-900/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-emerald-700/60 shadow-xl space-y-5">
      
      {/* Top Header with Main 3 Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-700/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 text-base sm:text-lg">
              📿
            </span>
            <h3 className="text-lg sm:text-xl font-black text-amber-200">
              দোয়া, জিকির ও আসমাউল হুসনা
            </h3>
          </div>
          <p className="text-xs text-emerald-200/90 mt-0.5">
            বিশুদ্ধ আরবি উচ্চারণ সহ দোয়া, ছোট আমল, ৯৯ নাম ও ডিজিটাল তসবিহ
          </p>
        </div>

        {/* 3 Unified Section Tabs */}
        <div className="flex items-center gap-1.5 bg-emerald-950/90 p-1 rounded-xl border border-emerald-700/60 text-xs font-bold self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('tasbih')}
            className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tasbih'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                : 'text-emerald-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📿 ডিজিটাল তসবিহ</span>
          </button>

          <button
            onClick={() => setActiveTab('dailyDuas')}
            className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dailyDuas'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                : 'text-emerald-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🤲 দৈনন্দিন দোয়া ও ছোট আমল</span>
          </button>

          <button
            onClick={() => setActiveTab('asmaulHusna')}
            className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'asmaulHusna'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                : 'text-emerald-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>✨ ৯৯ নাম ও আমল</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: DIGITAL TASBIH & DHIKR ================= */}
      {activeTab === 'tasbih' && (
        <div className="space-y-5 animate-fade-in">

          {/* TODAY'S ASMAUL HUSNA AMAL SUGGESTION CARD */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 rounded-2xl p-4 border-2 border-amber-400/50 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-extrabold border border-amber-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>আজকের নির্বাচিত আসমাউল হুসনা আমল</span>
                  </span>
                  <span className="text-[11px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-700/50">
                    নাম নং {toBengaliDigits(suggestedAsma.id)}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-arabic" dir="rtl">
                    يَا {suggestedAsma.arabic}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    ইয়া {suggestedAsma.transliterationBn}
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    ({suggestedAsma.meaningBn})
                  </span>

                  {/* Play pronunciation for Asmaul Husna suggestion */}
                  <button
                    onClick={() =>
                      togglePlayAudio(`suggested-asma-${suggestedAsma.id}`, {
                        titleBn: `ইয়া ${suggestedAsma.transliterationBn}`,
                        arabicText: `يَا ${suggestedAsma.arabic}`,
                        transliterationBn: `ইয়া ${suggestedAsma.transliterationBn}`,
                        translationBn: suggestedAsma.meaningBn
                      })
                    }
                    className={`p-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                      playingId === `suggested-asma-${suggestedAsma.id}`
                        ? 'bg-amber-400 text-emerald-950 border-white animate-pulse'
                        : 'bg-emerald-900/80 text-amber-300 border-amber-400/40 hover:bg-emerald-800'
                    }`}
                    title="এই নামের বিশুদ্ধ আরবি উচ্চারণ শুনুন"
                  >
                    {playingId === `suggested-asma-${suggestedAsma.id}` ? (
                      <Square className="w-3 h-3 fill-current" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl pt-0.5">
                  <strong className="text-amber-200">ফজিলত ও আমল: </strong>
                  {suggestedAsma.virtueBn}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-amber-200/90 font-medium">
                  <span>📌 <strong>আজ কত বার পড়বেন:</strong> {toBengaliDigits(suggestedAsma.recommendedCount || 100)} বার (অথবা নামাজের পর ৩৩ বার)</span>
                  <span>•</span>
                  <span>ওয়াক্ত: {suggestedAsma.timeSlot === 'fajr' ? 'ফজর' : suggestedAsma.timeSlot === 'bedtime' ? 'ঘুমানোর আগে' : 'সারাদিনে যেকোনো সময়'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => loadAsmaToTasbih(suggestedAsma)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📿 এই নামে আজ আমল শুরু করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSuggestedAsmaIndex((prev) => (prev + 1) % ASMAUL_HUSNA_LIST.length);
                    triggerHaptic('tap', vibrationEnabled, soundEnabled);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold border border-emerald-700/60 transition flex items-center justify-center gap-1 cursor-pointer"
                  title="অন্য আরেকটি আসমাউল হুসনা নাম দেখুন"
                >
                  <RefreshCw className="w-3 h-3 text-amber-300" />
                  <span>অন্য নাম দেখুন</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Sensory Control Bar (Vibration, Sound & Add Dhikr) */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/80">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <Clock className="w-4 h-4" />
              <span>আমল ও জিকির নির্বাচন করুন:</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  initAudioContext();
                  const next = !vibrationEnabled;
                  setVibrationEnabled(next);
                  if (next) triggerHaptic('tap', true, false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  vibrationEnabled
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow'
                    : 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                }`}
                title="কাউন্ট করার সময় ভাইব্রেশন চালু/বন্ধ"
              >
                <Vibrate className="w-3.5 h-3.5" />
                <span>{vibrationEnabled ? '📳 ভাইব্রেশন অন' : '📴 ভাইব্রেশন অফ'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  initAudioContext();
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) triggerHaptic('tap', false, true);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow'
                    : 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                }`}
                title="কাউন্টে কাঠের তাসবিহ ক্লিক সাউন্ড"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{soundEnabled ? '🔊 সাউন্ড অন' : '🔇 সাউন্ড অফ'}</span>
              </button>

              <button
                onClick={() => setShowAddCustomModal(true)}
                className="px-2.5 py-1 rounded-lg bg-teal-800 hover:bg-teal-700 text-amber-200 text-xs font-bold border border-teal-500/50 flex items-center gap-1 shrink-0 transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ কাস্টম জিকির</span>
              </button>
            </div>
          </div>

          {/* Dhikr Selector Horizontal Carousel */}
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2 custom-scrollbar">
            {azkarList.map(item => (
              <div key={item.id} className="relative group shrink-0">
                <button
                  onClick={() => {
                    initAudioContext();
                    setSelectedAzkarId(item.id);
                    triggerHaptic('tap', vibrationEnabled, soundEnabled);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border flex flex-col items-start gap-0.5 text-left cursor-pointer ${
                    item.id === selectedAzkarId
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md ring-2 ring-amber-300/40'
                      : 'bg-emerald-950/80 text-emerald-200 border-emerald-700/50 hover:bg-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-extrabold">
                    <span>{item.titleBn}</span>
                    {item.completedCount >= item.targetCount && (
                      <span className="text-[10px] text-emerald-950 bg-emerald-300 px-1 rounded font-black">✓ পূর্ণ</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] opacity-80">
                    <span>টার্গেট: {toBengaliDigits(item.targetCount)} বার</span>
                    <span>•</span>
                    <span>কাউন্ট: {toBengaliDigits(item.completedCount)}</span>
                  </div>
                </button>

                {item.id.startsWith('custom-') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustom(item.id);
                    }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition shadow cursor-pointer"
                    title="কাস্টম জিকিরটি মুছুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Main Digital Tasbih Counter Widget */}
          <div className="bg-emerald-950/90 rounded-2xl p-5 border border-amber-400/40 shadow-inner relative">
            
            {/* Selected Dhikr Arabic Title, Meaning & Audio Bar */}
            <div className="text-center mb-3 space-y-2">
              <div className="text-2xl sm:text-4xl font-bold text-amber-200 font-arabic mb-1 leading-relaxed" dir="rtl">
                {selectedAzkar.arabicText}
              </div>
              
              <div className="text-sm font-bold text-emerald-100 flex items-center justify-center gap-2">
                <span>{selectedAzkar.transliterationBn}</span>
              </div>

              {/* Audio Pronunciation & Audio Practice Controller for Selected Dhikr */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    togglePlayAudio(selectedAzkar.id, {
                      titleBn: selectedAzkar.titleBn,
                      arabicText: selectedAzkar.arabicText,
                      transliterationBn: selectedAzkar.transliterationBn,
                      translationBn: selectedAzkar.translationBn
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md border cursor-pointer ${
                    playingId === selectedAzkar.id
                      ? 'bg-amber-400 text-emerald-950 border-white ring-2 ring-amber-300/50 animate-pulse'
                      : 'bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border-amber-400/50'
                  }`}
                  title="আরবি বিশুদ্ধ উচ্চারণ ও অর্থ অডিও শুনুন"
                >
                  {playingId === selectedAzkar.id ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>অডিও থামান</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>🔊 বিশুদ্ধ উচ্চারণ শুনুন</span>
                    </>
                  )}
                </button>

                {/* Speed toggle for pronunciation learning */}
                <button
                  type="button"
                  onClick={() => setAudioSpeed(prev => (prev === 0.85 ? 1.0 : 0.85))}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold border border-emerald-700/60 flex items-center gap-1 transition cursor-pointer"
                  title="গতি পরিবর্তন (০.৮৫x সহজে শেখার জন্য ধীর গতি)"
                >
                  <Gauge className="w-3 h-3 text-amber-300" />
                  <span>গতি: {audioSpeed === 0.85 ? '০.৮৫x (ধীর)' : '১.০x (স্বাভাবিক)'}</span>
                </button>

                {/* Audio Mode: Arabic only vs Arabic + Meaning */}
                <button
                  type="button"
                  onClick={() => setAudioPlayerMode(prev => (prev === 'arabic_only' ? 'arabic_and_meaning' : 'arabic_only'))}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold border border-emerald-700/60 flex items-center gap-1 transition cursor-pointer"
                  title="শুধুমাত্র আরবি শুনবেন নাকি বাংলা অর্থসহ"
                >
                  <span>{audioMode === 'arabic_only' ? '📖 শুধু আরবি' : '🗣️ আরবি + অর্থ'}</span>
                </button>

                {/* Loop Repeat Toggle */}
                <button
                  type="button"
                  onClick={() => setAudioLoop(prev => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                    audioLoop
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 font-extrabold'
                      : 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60'
                  }`}
                  title="মুখস্থ ও শুদ্ধ করার জন্য বারবার লুপ করুন"
                >
                  <Repeat className="w-3 h-3" />
                  <span>{audioLoop ? 'লুপ অন' : 'লুপ অফ'}</span>
                </button>
              </div>

              <div className="text-xs text-emerald-200/90 max-w-lg mx-auto leading-relaxed bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800/50">
                {selectedAzkar.translationBn}
              </div>
            </div>

            {/* Big Counter Display & Sensory Indicator */}
            <div className="flex flex-col items-center justify-center my-4 space-y-4">
              
              {/* Quick Target Selector Bar */}
              <div className="w-full max-w-md bg-emerald-950/80 p-2.5 rounded-2xl border border-emerald-700/60 shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1">
                    <span>🎯 পড়ার লক্ষ্য (টার্গেট সংখ্যা):</span>
                  </span>
                  <span className="text-[11px] text-emerald-300 font-normal">
                    ক্লিক করে লক্ষ্য পরিবর্তন করুন
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: '৩৩ বার', count: 33 },
                    { label: '১০০ বার', count: 100 },
                    { label: '৩০০ বার', count: 300 },
                    { label: '৫০০ বার', count: 500 },
                    { label: '👑 ১,০০০ বার (খতম)', count: 1000 },
                    { label: '৫,০০০ বার', count: 5000 },
                    { label: '১০,০০০ বার', count: 10000 }
                  ].map(tPreset => (
                    <button
                      key={tPreset.count}
                      type="button"
                      onClick={() => updateSelectedAzkarTarget(tPreset.count)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        selectedAzkar.targetCount === tPreset.count
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow font-black'
                          : 'bg-emerald-900/70 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800 hover:text-white'
                      }`}
                    >
                      {tPreset.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setInlineTargetValue(selectedAzkar.targetCount.toString());
                      setShowInlineTargetInput(prev => !prev);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 cursor-pointer ${
                      showInlineTargetInput
                        ? 'bg-teal-500 text-emerald-950 border-teal-300 font-black'
                        : 'bg-emerald-900/70 text-teal-300 border-teal-700/60 hover:bg-teal-900'
                    }`}
                  >
                    <span>✏️ কাস্টম লক্ষ্য</span>
                  </button>
                </div>

                {/* Inline Custom Target Input */}
                {showInlineTargetInput && (
                  <div className="flex items-center gap-2 pt-1 border-t border-emerald-800/80 animate-fade-in">
                    <span className="text-xs text-emerald-200 shrink-0">যেকোনো সংখ্যা লিখুন:</span>
                    <input
                      type="number"
                      min={1}
                      value={inlineTargetValue}
                      onChange={(e) => setInlineTargetValue(e.target.value)}
                      placeholder="যেমন: ১২০০, ৭০, ২৫০০"
                      className="w-28 bg-emerald-900 border border-amber-400 rounded-lg px-2.5 py-1 text-white text-xs font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseInt(inlineTargetValue);
                        if (parsed && parsed > 0) {
                          updateSelectedAzkarTarget(parsed);
                        }
                      }}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-lg shadow cursor-pointer"
                    >
                      সেট করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInlineTargetInput(false)}
                      className="px-2 py-1 bg-emerald-900 text-emerald-300 text-xs rounded-lg hover:text-white cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>
                )}
              </div>

              {/* Counter Display & Sensory Box */}
              <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 border-2 border-amber-400/60 rounded-3xl px-8 py-5 shadow-2xl text-center min-w-[240px] relative">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                  <span>{t.tasbihCounter}</span>
                  {vibrationEnabled && <Vibrate className="w-3 h-3 text-amber-300 animate-pulse" />}
                  {soundEnabled && <Volume2 className="w-3 h-3 text-emerald-400" />}
                </div>

                <div className="text-5xl sm:text-7xl font-black text-amber-300 font-mono tracking-wider select-none">
                  {toBengaliDigits(selectedAzkar.completedCount)}
                </div>

                <div className="text-xs text-emerald-200 font-semibold mt-1 flex flex-col items-center gap-1">
                  <div>
                    {t.target}: <span className="text-amber-300 font-bold">{toBengaliDigits(selectedAzkar.targetCount)}</span> বার{' '}
                    {selectedAzkar.completedCount >= selectedAzkar.targetCount && (
                      <span className="text-emerald-400 font-bold">(সম্পন্ন!)</span>
                    )}
                  </div>

                  {/* Lap / Cycle Indicator for high targets */}
                  {selectedAzkar.targetCount > 100 && (
                    <div className="text-[11px] text-amber-200/90 font-medium bg-emerald-900/70 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                      📿 মালা চক্র:{' '}
                      <span className="font-bold text-amber-300">
                        {toBengaliDigits(Math.min(Math.ceil(selectedAzkar.targetCount / 100), Math.floor(selectedAzkar.completedCount / 100) + 1))}
                      </span>
                      {' / '}
                      <span className="font-bold text-emerald-300">
                        {toBengaliDigits(Math.ceil(selectedAzkar.targetCount / 100))}
                      </span>
                      {' (প্রতি চক্রে ১০০ দানা)'}
                    </div>
                  )}
                </div>

                {/* Smooth Progress Bar */}
                <div className="w-full bg-emerald-950/90 h-2.5 rounded-full overflow-hidden mt-3 border border-emerald-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((selectedAzkar.completedCount / selectedAzkar.targetCount) * 100))}%`
                    }}
                  />
                </div>
                <div className="text-[10px] text-emerald-300 font-bold mt-1 flex justify-between">
                  <span>অগ্রগতি: {toBengaliDigits(Math.min(100, Math.round((selectedAzkar.completedCount / selectedAzkar.targetCount) * 100)))}%</span>
                  <span>
                    {selectedAzkar.completedCount >= selectedAzkar.targetCount
                      ? 'সম্পূর্ণ হয়েছে'
                      : `বাকি: ${toBengaliDigits(Math.max(0, selectedAzkar.targetCount - selectedAzkar.completedCount))} বার`}
                  </span>
                </div>

                {selectedAzkar.completedCount >= selectedAzkar.targetCount && (
                  <div className="absolute -top-3 -right-3 bg-amber-400 text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>আমল পূর্ণ!</span>
                  </div>
                )}
              </div>

              {/* Progress Dynamic Milestones */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold">
                <span className="text-[11px] text-emerald-300 mr-1">মাইলস্টোন:</span>
                {getDynamicMilestones(selectedAzkar.targetCount).map(m => {
                  const isReached = selectedAzkar.completedCount >= m;
                  return (
                    <span
                      key={m}
                      className={`px-2.5 py-0.5 rounded-full border transition flex items-center gap-1 ${
                        isReached
                          ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow-sm font-black'
                          : 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
                      }`}
                    >
                      <span>{toBengaliDigits(m)}</span>
                      {isReached && <span>✓</span>}
                    </span>
                  );
                })}
              </div>

              {/* Controls: BIG VIBRATING TAP Button & Reset */}
              <div className="flex items-center gap-5 mt-4">
                <button
                  type="button"
                  onClick={handleIncrement}
                  onTouchStart={() => {
                    initAudioContext();
                    if ('vibrate' in navigator && vibrationEnabled) {
                      try {
                        navigator.vibrate(40);
                      } catch {}
                    }
                  }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-emerald-950 font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center border-4 border-amber-200/90 cursor-pointer select-none"
                  aria-label="তাসবিহ কাউন্ট করুন"
                >
                  <span className="text-3xl sm:text-4xl">📿</span>
                  <span className="text-[11px] font-black uppercase tracking-wider mt-0.5">ট্যাপ করুন</span>
                  {vibrationEnabled && (
                    <span className="text-[9px] font-bold text-emerald-950/80">📳 ভাইব্রেশন</span>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="p-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 transition flex flex-col items-center gap-1 shadow-md cursor-pointer"
                  title={t.reset}
                >
                  <RotateCcw className="w-5 h-5 text-amber-300" />
                  <span className="text-[10px] font-bold">{t.reset}</span>
                </button>
              </div>
            </div>

            {/* Hadith Sahih Reference & Timing Guidance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-emerald-800/60 text-xs text-amber-200/90">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>সূত্র: {selectedAzkar.referenceBn}</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-semibold">
                📌 নিয়মিত জিকিরে অন্তরে প্রশান্তি ও গুনাহ মাফ হয়
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 2: COMPREHENSIVE DAILY DUAS & AMALS ================= */}
      {activeTab === 'dailyDuas' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Search and Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={duaSearchQuery}
                onChange={(e) => setDuaSearchQuery(e.target.value)}
                placeholder="দোয়ার নাম, বিষয় বা উচ্চারণ লিখে খুঁজুন (যেমন: সাইয়্যিদুল ইস্তিগফার, ঋণমুক্তি, সকাল, ঘুমানোর দোয়া)..."
                className="w-full bg-emerald-950/80 border border-emerald-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {DAILY_DUAS_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setDuaCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                    duaCategoryFilter === cat.id
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow'
                      : 'bg-emerald-950/80 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.labelBn}</span>
                </button>
              ))}
            </div>

            {/* Target Count Range Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
              <span className="text-[11px] font-bold text-emerald-300 shrink-0 mr-1">🔢 পড়ার সংখ্যা ফিল্টার:</span>
              {[
                { id: 'all', label: 'সকল সংখ্যা', icon: '✨' },
                { id: 'small', label: '১ - ৩৩ বার', icon: '📿' },
                { id: '100', label: '১০০ বার', icon: '💯' },
                { id: 'mid', label: '৩০০ - ৫০০ বার', icon: '💠' },
                { id: 'khatam', label: '১,০০০+ বার ও খতম', icon: '👑' }
              ].map(cf => (
                <button
                  key={cf.id}
                  type="button"
                  onClick={() => setDuaCountFilter(cf.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer border ${
                    duaCountFilter === cf.id
                      ? 'bg-emerald-400 text-emerald-950 border-white shadow font-black'
                      : 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-800'
                  }`}
                >
                  <span>{cf.icon}</span>
                  <span>{cf.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Amal Tracking & Progress Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 p-3 sm:p-3.5 rounded-2xl border border-amber-400/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-amber-200 flex items-center gap-1.5">
                  <span>আজকের দো'আ ও জিকির আমল ট্র্যাকিং সক্রিয়</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    লাইভ সিঙ্ক
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  পড়ার পর 'পড়েছি' বাটনে ক্লিক করুন। আজকের প্রগ্রেস, বাকি আমল এবং দিন/সপ্তাহ/মাসের বিশ্লেষণ গ্রাফ দেখতে পারবেন।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openUserProfileProgressTab()}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>📊 অগ্রগতি ও গ্রাফ দেখুন ↗</span>
            </button>
          </div>

          {/* Daily Duas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuas.map(dua => {
              const isCompleted = completedDuas[dua.id];
              const isAudioPlaying = playingId === `dua-${dua.id}`;

              return (
                <div
                  key={dua.id}
                  className={`bg-emerald-950/80 rounded-2xl p-4 border transition flex flex-col justify-between space-y-3 group ${
                    isCompleted
                      ? 'border-emerald-500/80 bg-emerald-950/90'
                      : 'border-emerald-700/60 hover:border-amber-400/60'
                  }`}
                >
                  <div>
                    {/* Header with Category Badge, Play Audio Button & Amal Completion Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30 flex items-center gap-1">
                        <span>{dua.categoryIcon}</span>
                        <span>{dua.categoryBn}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Audio Play Button directly on the card */}
                        <button
                          type="button"
                          onClick={() =>
                            togglePlayAudio(`dua-${dua.id}`, {
                              titleBn: dua.titleBn,
                              arabicText: dua.arabicText,
                              transliterationBn: dua.transliterationBn,
                              translationBn: dua.translationBn
                            })
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                            isAudioPlaying
                              ? 'bg-amber-400 text-emerald-950 border-white animate-pulse shadow-md font-black'
                              : 'bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border-amber-400/40'
                          }`}
                          title="এই দোয়ার আরবি উচ্চারণ শুনুন"
                        >
                          {isAudioPlaying ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>থামান</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>উচ্চারণ শুনুন</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => toggleDuaCompletion(dua.id)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500 text-emerald-950'
                              : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700 hover:text-white'
                          }`}
                          title="দৈনিক আমল সম্পন্ন হিসেবে চিহ্নিত করুন"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'আমল সম্পন্ন' : 'পড়েছি'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Title & Timing info */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-base font-extrabold text-amber-200">
                        {dua.titleBn}
                      </h4>
                      <button
                        onClick={() => setSelectedDetailDua(dua)}
                        className="p-1 rounded-lg bg-emerald-900/60 text-teal-300 hover:text-white hover:bg-emerald-800 transition text-[11px] flex items-center gap-1 shrink-0 border border-teal-700/50 cursor-pointer"
                        title="সম্পূর্ণ বিস্তারিত ও উচ্চারণ শিক্ষা মোডাল দেখুন"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>বিস্তারিত</span>
                      </button>
                    </div>

                    {/* When to Recite banner */}
                    <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-2 mb-2.5 text-xs text-amber-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span><strong>কখন পড়বেন: </strong>{dua.whenToReciteBn}</span>
                    </div>

                    {/* Arabic Text */}
                    <div
                      className="text-lg sm:text-xl font-bold text-amber-100 font-arabic text-right mb-2 leading-relaxed bg-emerald-900/40 p-3 rounded-xl border border-emerald-800/60 select-text"
                      dir="rtl"
                    >
                      {dua.arabicText}
                    </div>

                    {/* Bengali Transliteration & Meaning */}
                    <div className="space-y-1 text-xs">
                      <p className="text-emerald-200 font-semibold leading-relaxed">
                        <strong className="text-amber-300">উচ্চারণ: </strong>
                        {dua.transliterationBn}
                      </p>
                      <p className="text-emerald-100 leading-relaxed">
                        <strong className="text-emerald-300">অর্থ: </strong>
                        {dua.translationBn}
                      </p>
                    </div>

                    {/* Practice Guide & Virtue */}
                    <div className="mt-3 pt-2.5 border-t border-emerald-850 space-y-1.5 text-xs">
                      <div>
                        <span className="font-bold text-teal-300 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-teal-300" />
                          <span>আমলের নিয়ম ও পদ্ধতি: </span>
                        </span>
                        <p className="text-emerald-100/90 mt-0.5">{dua.howToPracticeBn}</p>
                      </div>

                      <div>
                        <span className="font-bold text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-300" />
                          <span>ফজিলত ও উপকারিতা: </span>
                        </span>
                        <p className="text-emerald-200/90 mt-0.5">{dua.virtueAndBenefitBn}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Sahih Reference, Details & 1-Click Tasbih Launch */}
                  <div className="pt-2 border-t border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-emerald-400/80 text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-300" />
                      <span>{dua.sahihReferenceBn}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDetailDua(dua)}
                        className="px-2.5 py-1.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 font-bold transition flex items-center justify-center gap-1 border border-teal-600/50 cursor-pointer"
                      >
                        <Headphones className="w-3.5 h-3.5 text-amber-300" />
                        <span>শুদ্ধ উচ্চারণ শিক্ষা</span>
                      </button>

                      <button
                        onClick={() => loadDuaToTasbih(dua)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer shrink-0"
                      >
                        <span>📿 তসবিহে পড়ুন ({dua.countDisplayBn})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDuas.length === 0 && (
            <div className="text-center py-10 bg-emerald-950/50 rounded-2xl border border-emerald-800 text-emerald-300">
              <p className="text-sm">কোনো দোয়া বা আমল খুঁজে পাওয়া যায়নি।</p>
              <button
                onClick={() => {
                  setDuaSearchQuery('');
                  setDuaCategoryFilter('all');
                }}
                className="mt-2 text-xs text-amber-300 font-bold underline"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: ASMAUL HUSNA (99 BEAUTIFUL NAMES OF ALLAH FULL ECOSYSTEM) ================= */}
      {activeTab === 'asmaulHusna' && (
        <div className="space-y-4 animate-fade-in">
          <AsmaulHusnaCard onPlayAudio={onPlayAudio} lang={lang} />
        </div>
      )}

      {/* ================= MODAL 1: FULL-SCREEN DETAILED VIEW & AUDIO PRONUNCIATION PRACTICE MODAL ================= */}
      {selectedDetailDua &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] isolate bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                stopDuaAudio();
                setPlayingId(null);
                setSelectedDetailDua(null);
              }
            }}
          >
            <div
              className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-amber-400/60 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl text-white my-auto max-h-[90vh] overflow-y-auto custom-scrollbar space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-emerald-700/60">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 flex items-center gap-1.5 w-fit mb-1.5">
                  <span>{selectedDetailDua.categoryIcon}</span>
                  <span>{selectedDetailDua.categoryBn}</span>
                </span>
                <h3 className="text-lg sm:text-xl font-black text-amber-200">
                  {selectedDetailDua.titleBn}
                </h3>
              </div>
              <button
                onClick={() => {
                  stopDuaAudio();
                  setPlayingId(null);
                  setSelectedDetailDua(null);
                }}
                className="p-1.5 rounded-xl bg-emerald-900 text-emerald-300 hover:text-white hover:bg-emerald-800 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recitation Practice Audio Controller Panel */}
            <div className="bg-emerald-950/90 rounded-2xl p-4 border border-amber-400/40 shadow-inner space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span>বিশুদ্ধ উচ্চারণ শিক্ষা ও অডিও প্লেয়ার:</span>
                </span>
                {playingId === `modal-${selectedDetailDua.id}` && (
                  <span className="text-[11px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
                    🔊 অডিও বাজছে...
                  </span>
                )}
              </div>

              {/* Main Play / Stop Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    togglePlayAudio(`modal-${selectedDetailDua.id}`, {
                      titleBn: selectedDetailDua.titleBn,
                      arabicText: selectedDetailDua.arabicText,
                      transliterationBn: selectedDetailDua.transliterationBn,
                      translationBn: selectedDetailDua.translationBn
                    })
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-lg cursor-pointer border ${
                    playingId === `modal-${selectedDetailDua.id}`
                      ? 'bg-amber-400 text-emerald-950 border-white ring-2 ring-amber-300/60 animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 border-amber-300'
                  }`}
                >
                  {playingId === `modal-${selectedDetailDua.id}` ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span>অডিও থামান</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>▶️ আরবি বিশুদ্ধ উচ্চারণ শুনুন</span>
                    </>
                  )}
                </button>

                {/* Speed toggle for pure pronunciation practice */}
                <button
                  type="button"
                  onClick={() => setAudioSpeed(prev => (prev === 0.85 ? 1.0 : 0.85))}
                  className="px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Gauge className="w-3.5 h-3.5 text-amber-300" />
                  <span>গতি: {audioSpeed === 0.85 ? '০.৮৫x (ধীর ও স্পষ্ট)' : '১.০x (স্বাভাবিক)'}</span>
                </button>

                {/* Mode toggle: Pure Arabic vs Arabic + Translation */}
                <button
                  type="button"
                  onClick={() => setAudioPlayerMode(prev => (prev === 'arabic_only' ? 'arabic_and_meaning' : 'arabic_only'))}
                  className="px-3 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>{audioMode === 'arabic_only' ? '📖 শুধু আরবি' : '🗣️ আরবি + অর্থ'}</span>
                </button>

                {/* Loop Repeat Toggle */}
                <button
                  type="button"
                  onClick={() => setAudioLoop(prev => !prev)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    audioLoop
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 font-black'
                      : 'bg-emerald-900 text-emerald-300 border-emerald-700'
                  }`}
                  title="মুখস্থ করতে বারবার পুনরাবৃত্তি করুন"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{audioLoop ? 'লুপ অন' : 'লুপ অফ'}</span>
                </button>
              </div>
            </div>

            {/* When to Recite banner */}
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3 text-xs text-amber-200 font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>কখন ও কোন সময়ে পড়বেন: </strong>{selectedDetailDua.whenToReciteBn}</span>
            </div>

            {/* Crystal-Clear Large Arabic Recitation Box */}
            <div className="bg-emerald-950 rounded-2xl p-4 sm:p-5 border-2 border-emerald-700/80 shadow-md text-right space-y-2">
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase block text-left">
                পবিত্র আরবি নস (বিশুদ্ধ হরকত সহ):
              </span>
              <div
                className="text-xl sm:text-3xl font-black text-amber-200 font-arabic leading-loose select-text"
                dir="rtl"
              >
                {selectedDetailDua.arabicText}
              </div>
            </div>

            {/* Bengali Transliteration & Meaning Box */}
            <div className="space-y-3 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700/60 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">বাংলা উচ্চারণ:</span>
                <p className="text-emerald-100 font-medium leading-relaxed select-text">
                  {selectedDetailDua.transliterationBn}
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-800">
                <span className="font-bold text-emerald-300 block mb-0.5">বাংলা অর্থ:</span>
                <p className="text-emerald-50 leading-relaxed select-text">
                  {selectedDetailDua.translationBn}
                </p>
              </div>
            </div>

            {/* Practical Amal Guide & Sahih Virtues */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-teal-700/40 space-y-1">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-300" />
                  <span>আমলের সঠিক নিয়ম ও পদ্ধতি:</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed pt-1">
                  {selectedDetailDua.howToPracticeBn}
                </p>
              </div>

              <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-amber-700/40 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>সহীহ হাদিসের ফজিলত ও উপকার:</span>
                </span>
                <p className="text-emerald-100/90 leading-relaxed pt-1">
                  {selectedDetailDua.virtueAndBenefitBn}
                </p>
              </div>
            </div>

            {/* Reference info */}
            <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>সহীহ হাদিস ও কিতাব সূত্র: </strong>{selectedDetailDua.sahihReferenceBn}</span>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-emerald-700/60">
              <button
                onClick={() => toggleDuaCompletion(selectedDetailDua.id)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  completedDuas[selectedDetailDua.id]
                    ? 'bg-emerald-500 text-emerald-950 shadow-md font-black'
                    : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{completedDuas[selectedDetailDua.id] ? '✓ আজকের আমল সম্পন্ন হয়েছে' : 'আজকের আমল সম্পন্ন হিসেবে চিহ্নিত করুন'}</span>
              </button>

              <button
                onClick={() => loadDuaToTasbih(selectedDetailDua)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📿 এই দোয়া দিয়ে তসবিহে আমল শুরু করুন ({selectedDetailDua.countDisplayBn})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 2: CUSTOM DHIKR & DUA CREATOR WITH PRONUNCIATION TESTER ================= */}
      {showAddCustomModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] isolate bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                stopDuaAudio();
                setShowAddCustomModal(false);
              }
            }}
          >
            <div
              className="bg-emerald-950 border-2 border-amber-400/60 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl text-white"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-800">
              <div>
                <h4 className="text-base font-black text-amber-300 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>নতুন কাস্টম জিকির বা আমল যোগ করুন</span>
                </h4>
                <p className="text-[11px] text-emerald-300 mt-0.5">
                  আরবি লিখে সাথে সাথে উচ্চারণ শুনে শুদ্ধ করে নিন
                </p>
              </div>
              <button
                onClick={() => {
                  stopDuaAudio();
                  setShowAddCustomModal(false);
                }}
                className="p-1.5 rounded-xl bg-emerald-900 text-emerald-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomDhikr} className="space-y-3.5 text-xs">
              
              {/* Quick Template Presets for 1000x and high count dhikr */}
              <div className="bg-emerald-900/60 p-3 rounded-2xl border border-amber-400/30 space-y-2">
                <span className="text-[11px] font-bold text-amber-300 block">
                  ✨ দ্রুত ফর্ম পূরণ করতে প্রস্তুত আমল বেছে নিন:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    {
                      name: '১,০০০ বার দরূদ শরীফ',
                      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
                      target: 1000,
                      slot: 'সারাদিনে বা জুমার দিনে',
                      meaning: 'নবী করীম (ﷺ) এর প্রতি ভালোবাসায় ১,০০০ বার দরূদ পাঠ।'
                    },
                    {
                      name: '১,০০০ বার সাইয়্যিদুল ইস্তিগফার ও তাওবা',
                      arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
                      target: 1000,
                      slot: 'প্রতিদিন সকালে ও রাতে',
                      meaning: 'গুনাহ মাফ ও রিযিক বৃদ্ধির জন্য ১,০০০ বার ইস্তিগফার।'
                    },
                    {
                      name: '১,০০০ বার খতমে ইউনুস (বিপদ মুক্তি)',
                      arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
                      target: 1000,
                      slot: 'যেকোনো সংকট বা প্রয়োজনে',
                      meaning: 'বিপদ ও দুশ্চিন্তা থেকে মুক্তির জন্য ১,০০০ বার দুআ ইউনুস।'
                    },
                    {
                      name: '১,০০০ বার হাসবুনাল্লাহু ওয়া নিমাল ওয়াকিল',
                      arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
                      target: 1000,
                      slot: 'ভয় ও কঠিন পরিস্থিতিতে',
                      meaning: 'আল্লাহর ওপর সম্পূর্ণ তাওয়াক্কুল ও হেফাজতের আমল।'
                    },
                    {
                      name: '৫০০ বার কালেমা শাহাদাত',
                      arabic: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
                      target: 500,
                      slot: 'দিনে যেকোনো সময়',
                      meaning: 'ঈমান তাজা ও মজবুত করার মহিমান্বিত আমল।'
                    },
                    {
                      name: '৩০০ বার দরূদে খিজরি',
                      arabic: 'صَلَّى اللَّهُ عَلَى مُحَمَّدٍ',
                      target: 300,
                      slot: 'প্রতিদিন সকাল ও সন্ধ্যায়',
                      meaning: 'সংক্ষিপ্ত অথচ অপরিসীম বরকতময় দরূদ আমল।'
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomTitle(preset.name);
                        setCustomArabic(preset.arabic);
                        setCustomTarget(preset.target);
                        setCustomTimeSlot(preset.slot);
                        setCustomTranslation(preset.meaning);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-[11px] text-emerald-200 hover:text-amber-300 border border-emerald-700/60 transition cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dhikr Bangla Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-emerald-200 font-bold">জিকিরের নাম (বাংলা)*</label>
                  {customTitle.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPreviewingCustomBangla(true);
                        previewPronunciation(customTitle, false, 0.95, () => setIsPreviewingCustomBangla(false));
                      }}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                        isPreviewingCustomBangla
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 animate-pulse'
                          : 'bg-emerald-900/80 text-amber-300 border-amber-400/40 hover:bg-emerald-800'
                      }`}
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isPreviewingCustomBangla ? 'বাজছে...' : 'উচ্চারণ টেস্ট'}</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="যেমন: বিশেষ দরূদ শরীফ, সাইয়্যিদুল ইস্তিগফার, লা হাওলা"
                  className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3.5 py-2.5 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Arabic Text with Instant Pronunciation Audio Tester */}
              <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5">
                    <span>আরবি টেক্সট ও হরকত (ঐচ্ছিক)</span>
                  </label>
                  
                  {/* Test Arabic Pronunciation Button */}
                  {customArabic.trim() && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsPreviewingCustomArabic(true);
                        previewPronunciation(customArabic, true, 0.85, () => setIsPreviewingCustomArabic(false));
                      }}
                      className={`text-[11px] font-black px-2.5 py-1 rounded-xl border transition flex items-center gap-1.5 cursor-pointer shadow ${
                        isPreviewingCustomArabic
                          ? 'bg-amber-400 text-emerald-950 border-white ring-2 ring-amber-300 animate-pulse'
                          : 'bg-amber-400/20 text-amber-300 border-amber-400/50 hover:bg-amber-400 hover:text-emerald-950'
                      }`}
                      title="টাইপ করা আরবি টেক্সটটি শুনে শুদ্ধ করে নিন"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPreviewingCustomArabic ? '🔊 বাজছে...' : '▶️ আরবি উচ্চারণ শুনে শুদ্ধ করুন'}</span>
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={customArabic}
                  onChange={(e) => setCustomArabic(e.target.value)}
                  placeholder="যেমন: اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ অথবা لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ"
                  dir="rtl"
                  className="w-full bg-emerald-950 border border-emerald-700 rounded-xl px-3.5 py-2.5 text-amber-200 placeholder-emerald-600 font-arabic text-base focus:outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-emerald-300/80">
                  💡 পরামর্শ: হরকত (যবর, যের, পেশ) দিলে অডিও উচ্চারণ সবচেয়ে বেশি নিখুঁত ও বিশুদ্ধ শোনাবে।
                </p>
              </div>

              {/* Timing */}
              <div>
                <label className="block text-emerald-200 font-bold mb-1">কোন সময় বা ওয়াক্তে পড়তে হবে</label>
                <input
                  type="text"
                  value={customTimeSlot}
                  onChange={(e) => setCustomTimeSlot(e.target.value)}
                  placeholder="যেমন: ফজরের পর, মাগরিবের পর, তাহাজ্জুদে, সারাদিনে"
                  className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3.5 py-2 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Meaning / Intention */}
              <div>
                <label className="block text-emerald-200 font-bold mb-1">অর্থ বা নিয়ত/সংকল্প (ঐচ্ছিক)</label>
                <textarea
                  value={customTranslation}
                  onChange={(e) => setCustomTranslation(e.target.value)}
                  placeholder="জিকিরের অর্থ বা আপনার ব্যক্তিগত নিয়ত ও দুআ..."
                  rows={2}
                  className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3.5 py-2 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Target Count */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-emerald-200 font-bold">দিনে কত বার পড়তে চান (টার্গেট সংখ্যা)*</label>
                  <div className="flex items-center gap-1">
                    {[33, 100, 300, 500, 1000, 5000].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCustomTarget(cnt)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                          customTarget === cnt
                            ? 'bg-amber-400 text-emerald-950 border-amber-300'
                            : 'bg-emerald-900 text-emerald-300 border-emerald-700 hover:text-white'
                        }`}
                      >
                        {cnt >= 1000 ? `${cnt / 1000}k` : cnt}
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="number"
                  required
                  min={1}
                  value={customTarget}
                  onChange={(e) => setCustomTarget(parseInt(e.target.value) || 100)}
                  className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-emerald-800">
                <button
                  type="button"
                  onClick={() => {
                    stopDuaAudio();
                    setShowAddCustomModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-black shadow-md cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
