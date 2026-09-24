import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  BookOpen,
  Clock,
  HeartHandshake,
  Bot,
  HelpCircle,
  Compass,
  Sliders,
  Moon,
  Sun,
  ShieldCheck,
  Radio,
  Bell,
  Sparkles,
  Brain,
  Heart
} from 'lucide-react';

import { BDLocation, CalendarDates, Language, PrayerTimeItem } from './types';
import { translations } from './locales/translations';
import { getTripleCalendarDates, BANGLADESH_LOCATIONS } from './utils/bengaliUtils';
import { calculatePrayerTimes } from './utils/prayerTimes';
import { QURAN_SURAHS } from './data/islamicData';
import { resolveAudioUrlFromTitle } from './utils/audioResolver';
import { playlistManager } from './services/audioPlaylistManager';

import { Header } from './components/Header';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { CalendarCard } from './components/CalendarCard';
import { PrayerCard } from './components/PrayerCard';
import { QuranGoalCard } from './components/QuranGoalCard';
import { TasbihCard } from './components/TasbihCard';
import { IslamicAiChat } from './components/IslamicAiChat';
import { QuizSection } from './components/QuizSection';
import { QiblaCompass } from './components/QiblaCompass';
import { SettingsModal } from './components/SettingsModal';
import { AdminRagPortal } from './components/AdminRagPortal';
import { MediaEngineTab } from './components/MediaEngineTab';
import { ArabicLearningCard } from './components/ArabicLearningCard';
import { IslamicFocusDashboard } from './components/IslamicFocusDashboard';
import { SmartNotificationSettingsModal } from './components/SmartNotificationSettingsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CommunityAmalLeaderboard } from './components/CommunityAmalLeaderboard';
import { AmalLoginPromptModal } from './components/AmalLoginPromptModal';
import { QuickDuaModal } from './components/QuickDuaModal';
import { QuickDhikrModal } from './components/QuickDhikrModal';
import { QuickDuaFab } from './components/QuickDuaFab';
import { SmartIslamicNotificationPopup } from './components/SmartIslamicNotificationPopup';
import { LockscreenTestOverlay } from './components/LockscreenTestOverlay';
import { CareRoutineOperatingSystem } from './components/CareRoutineOperatingSystem';
import { CareReportShareView } from './components/CareReportShareView';
import { AlarmRingingOverlay } from './components/AlarmRingingOverlay';
import { WebsitePromotionBanner } from './components/WebsitePromotionBanner';
import { HijriYearSpecialDaysCountdown } from './components/HijriYearSpecialDaysCountdown';
import { InteractiveKeywordKnowledgeModal } from './components/InteractiveKeywordKnowledgeModal';
import { Footer } from './components/Footer';

export default function App() {
  // State Management
  const [lang, setLang] = useState<Language>('bn'); // Default Bengali (বাংলা)
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default Dark Mode as requested
  const [activeTab, setActiveTab] = useState<'home' | 'quran' | 'prayer' | 'dhikr' | 'ai' | 'quiz' | 'qibla' | 'media' | 'focus' | 'admin'>('home');
  const [mediaSubSection, setMediaSubSection] = useState<'radio' | 'care_os' | 'care_report'>('radio');

  // Check if opened via share link for Care Report (Standalone Web App Shareable View)
  const [isStandaloneReport, setIsStandaloneReport] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('care_report') === 'true' || params.get('report') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };
  const [dataSaver, setDataSaver] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState<boolean>(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
  const [userProfileInitialTab, setUserProfileInitialTab] = useState<'profile' | 'progress' | 'security' | 'stats'>('profile');
  const [userCustomCategories, setUserCustomCategories] = useState<string[]>([]);
  const [isQuickDuaOpen, setIsQuickDuaOpen] = useState<boolean>(false);
  const [isQuickDhikrOpen, setIsQuickDhikrOpen] = useState<boolean>(false);

  // Listen for open-user-profile-tab and open-quick-dua-modal global events
  useEffect(() => {
    const handleOpenProfileTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: 'profile' | 'progress' | 'security' | 'stats' }>;
      if (customEvent.detail?.tab) {
        setUserProfileInitialTab(customEvent.detail.tab);
      }
      setIsUserProfileOpen(true);
    };

    const handleOpenQuickDua = () => {
      setIsQuickDuaOpen(true);
    };

    const handleSwitchMainTab = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: string; elementId?: string }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab as any);
        if (customEvent.detail.elementId) {
          setTimeout(() => {
            const el = document.getElementById(customEvent.detail.elementId!);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    window.addEventListener('open-user-profile-tab', handleOpenProfileTab);
    window.addEventListener('open-quick-dua-modal', handleOpenQuickDua);
    window.addEventListener('switch-main-tab', handleSwitchMainTab);
    return () => {
      window.removeEventListener('open-user-profile-tab', handleOpenProfileTab);
      window.removeEventListener('open-quick-dua-modal', handleOpenQuickDua);
      window.removeEventListener('switch-main-tab', handleSwitchMainTab);
    };
  }, []);

  // Default Location: Dhaka, Bangladesh
  const [selectedLocation, setSelectedLocation] = useState<BDLocation>(BANGLADESH_LOCATIONS[0]);
  const [calculationMethodId, setCalculationMethodId] = useState<string>('ifb');

  // Dates & Prayer Schedule
  const [calendarDates, setCalendarDates] = useState<CalendarDates>(() => getTripleCalendarDates());
  const [prayerSchedule, setPrayerSchedule] = useState<PrayerTimeItem[]>(() =>
    calculatePrayerTimes(new Date(), selectedLocation.lat, selectedLocation.lng)
  );

  // Audio Player State
  const [activeAudioTitle, setActiveAudioTitle] = useState<string>(
    `${QURAN_SURAHS[0].nameBn} - ${QURAN_SURAHS[0].reciterNameBn}`
  );
  const [activeAudioUrl, setActiveAudioUrl] = useState<string>(QURAN_SURAHS[0].audioUrl);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<'both' | 'arabic_only'>('both');
  const [uiZoom, setUiZoom] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('islamic_app_ui_zoom');
      if (saved) return Number(saved);
    } catch (e) {
      console.error(e);
    }
    return 100;
  });

  const handleZoomIn = () => {
    setUiZoom(prev => {
      const next = Math.min(135, prev + 10);
      try { localStorage.setItem('islamic_app_ui_zoom', next.toString()); } catch (e) {}
      return next;
    });
  };

  const handleZoomOut = () => {
    setUiZoom(prev => {
      const next = Math.max(85, prev - 10);
      try { localStorage.setItem('islamic_app_ui_zoom', next.toString()); } catch (e) {}
      return next;
    });
  };

  const handleResetZoom = () => {
    setUiZoom(100);
    try { localStorage.setItem('islamic_app_ui_zoom', '100'); } catch (e) {}
  };

  // Update dates and prayer times dynamically
  useEffect(() => {
    setCalendarDates(getTripleCalendarDates());
    setPrayerSchedule(calculatePrayerTimes(new Date(), selectedLocation.lat, selectedLocation.lng));
  }, [selectedLocation, calculationMethodId]);

  // Handle dark mode root class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Global audio listener to sync popup player, folders, and 24/7 radio
  useEffect(() => {
    const handleGlobalPlay = (e: any) => {
      if (e?.detail?.title && e?.detail?.url) {
        setActiveAudioTitle(e.detail.title);
        setActiveAudioUrl(e.detail.url);
        setIsPlayingAudio(true);
      }
    };
    window.addEventListener('global-play-track', handleGlobalPlay);
    return () => window.removeEventListener('global-play-track', handleGlobalPlay);
  }, []);

  const t = translations[lang];

  const handlePlayAudio = (title: string, url: string, metadata?: any) => {
    const resolvedUrl = resolveAudioUrlFromTitle(title, url);
    if (activeAudioUrl === resolvedUrl && isPlayingAudio) {
      setIsPlayingAudio(false);
      playlistManager.setPlayState(false);
    } else {
      setActiveAudioTitle(title);
      setActiveAudioUrl(resolvedUrl);
      setIsPlayingAudio(true);
      playlistManager.syncActiveTrack(title, resolvedUrl, metadata);
    }
  };

  // If accessed via standalone share link (?care_report=true or ?report=true), render only the report page
  if (isStandaloneReport) {
    return (
      <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-emerald-950 text-emerald-50' : 'bg-emerald-50/60 text-emerald-950'}`}>
        <div className="max-w-4xl mx-auto p-3 sm:p-5">
          <CareReportShareView
            onBackToApp={() => {
              setIsStandaloneReport(false);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('care_report');
                url.searchParams.delete('report');
                url.searchParams.delete('range');
                url.searchParams.delete('profile');
                window.history.replaceState({}, '', url.toString());
              } catch (e) {}
            }}
            onToast={showToast}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-emerald-950 text-emerald-50' : 'bg-emerald-50/60 text-emerald-950'}`}>
      
      {/* Top Header */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        locationName={`${selectedLocation.districtBn}, বাংলাদেশ`}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        dataSaver={dataSaver}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        uiZoom={uiZoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />

      {/* Main Container */}
      <main
        className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 pb-28 transition-all duration-200"
        style={{ fontSize: `${uiZoom}%` }}
      >
        
        {/* Navigation Tabs (Seamless switching between Home and specialized views) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar bg-emerald-900/40 p-1.5 rounded-2xl border border-emerald-700/40 backdrop-blur-md">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'home'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.home}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('focus')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'focus'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-amber-300 hover:bg-emerald-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ইসলামিক ফোকাস</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('prayer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'prayer'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t.prayer}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('quran')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quran'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.quran}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('dhikr')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dhikr'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.dhikr}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{t.aiAssistant}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.quiz}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('qibla')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'qibla'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.qibla}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>২৪/৭ মিডিয়া রেডিও</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-extrabold'
                : 'text-amber-300 hover:bg-emerald-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>এডমিন প্যানেল ও প্রমোশন কন্ট্রোল</span>
          </motion.button>
        </nav>

        {/* Tab View Contents with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* 0. Top Website Promotion Banner (হোমস্ক্রিন শীর্ষ ওয়েবসাইট প্রমোশন) */}
              <WebsitePromotionBanner 
                onOpenAdmin={() => setActiveTab('admin')} 
                isAdmin={true} 
              />

              {/* Quick Teaser to Care OS inside Media */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  setMediaSubSection('care_os');
                  setActiveTab('media');
                }}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400/80 text-white flex items-center justify-between gap-3 shadow-xl cursor-pointer hover:border-amber-300 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                    🧠
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                      <span>২৪/৭ AI কেয়ার, লাইফ ও রুটিন অপারেটিং সিস্টেম</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold animate-pulse">
                        চলমান
                      </span>
                    </h3>
                    <p className="text-[11px] text-emerald-200 mt-0.5">
                      ভয়েস ও টেক্সটে ওষুধ, পানি, ফিডিং ও আমল ট্র্যাক করুন • অটো শিডিউল ও ফোল্ডার এলার্ম
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-amber-400 text-emerald-950 text-xs font-black shrink-0 shadow">
                  ওপেন করুন →
                </button>
              </motion.div>
              
              {/* 1. Triple Calendar Card (বর্ষপঞ্জিকা) */}
              <div id="calendar-card-section">
                <CalendarCard dates={calendarDates} lang={lang} />
              </div>

              {/* 1.1 Islamic Hijri Year Special Days & Advance New Year Countdown */}
              <div id="hijri-countdown-section">
                <HijriYearSpecialDaysCountdown />
              </div>

              {/* 2. Prayer Times Card (৫ ওয়াক্ত ফরয, নফল ও সূর্যোদয়/সূর্যাস্ত সেকশন) */}
              <div id="prayer-card-section">
                <PrayerCard
                  schedule={prayerSchedule}
                  lang={lang}
                  locationName={`${selectedLocation.districtBn}`}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </div>

              {/* 3. Unified Dhikr, Daily Duas & Asmaul Husna (দোয়া, জিকির ও ৯৯ নাম) */}
              <div id="tasbih-card-section">
                <TasbihCard lang={lang} onPlayAudio={handlePlayAudio} />
              </div>

              {/* 4. 24/7 Live Broadcast & Media Radio (সরাসরি সম্প্রচার) */}
              <div id="media-card-section">
                <MediaEngineTab lang={lang} audioMode={audioMode} onToggleAudioMode={setAudioMode} />
              </div>

              {/* 5. Islamic Life & AI Chat Guidance (ইসলামিক জীবন নির্দেশিকা) */}
              <div id="ai-chat-section">
                <IslamicAiChat lang={lang} />
              </div>

              {/* 6. Quran 10 Ayats/day Goal (দৈনিক ১০টি কুরআনের আয়াত) */}
              <div id="quran-goal-section">
                <QuranGoalCard
                  lang={lang}
                  onPlayAudio={handlePlayAudio}
                  currentlyPlayingUrl={activeAudioUrl}
                  isPlaying={isPlayingAudio}
                />
              </div>

              {/* 7. Daily Arabic Language Learning (প্রতিদিন সহজ আরবি ভাষা শিক্ষা) */}
              <div id="arabic-learning-section">
                <ArabicLearningCard lang={lang} />
              </div>

              {/* 8. Islamic Quiz Section (দিন অনুযায়ী পরিবর্তনশীল কুইজ) */}
              <div id="quiz-section">
                <QuizSection lang={lang} />
              </div>

              {/* 9. Community Amal Progress & Leaderboard Overview (সকলের অগ্রগতি ও পারফরম্যান্স ওভারভিউ) */}
              <div id="leaderboard-section">
                <CommunityAmalLeaderboard onOpenUserProfile={() => setIsUserProfileOpen(true)} />
              </div>
            </motion.div>
          )}

          {activeTab === 'prayer' && (
            <motion.div
              key="tab-prayer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <PrayerCard
                schedule={prayerSchedule}
                lang={lang}
                locationName={`${selectedLocation.districtBn}`}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
              <QiblaCompass lang={lang} locationName={`${selectedLocation.districtBn}`} />
            </motion.div>
          )}

          {activeTab === 'quran' && (
            <motion.div
              key="tab-quran"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <QuranGoalCard
                lang={lang}
                onPlayAudio={handlePlayAudio}
                currentlyPlayingUrl={activeAudioUrl}
                isPlaying={isPlayingAudio}
              />
              <ArabicLearningCard lang={lang} />
            </motion.div>
          )}

          {activeTab === 'dhikr' && (
            <motion.div
              key="tab-dhikr"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <TasbihCard lang={lang} onPlayAudio={handlePlayAudio} />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="tab-ai"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <IslamicAiChat lang={lang} />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="tab-quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <QuizSection lang={lang} />
            </motion.div>
          )}

          {activeTab === 'qibla' && (
            <motion.div
              key="tab-qibla"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <QiblaCompass lang={lang} locationName={`${selectedLocation.districtBn}`} />
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div
              key="tab-media"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <MediaEngineTab 
                lang={lang} 
                audioMode={audioMode} 
                onToggleAudioMode={setAudioMode}
                onPlayAudio={handlePlayAudio}
                currentlyPlayingUrl={activeAudioUrl}
                isPlaying={isPlayingAudio}
                onToast={showToast}
                initialMediaSubSection={mediaSubSection}
              />
            </motion.div>
          )}

          {activeTab === 'focus' && (
            <motion.div
              key="tab-focus"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <IslamicFocusDashboard lang={lang} />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="tab-admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-6"
            >
              <AdminRagPortal />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* User Profile & Firebase Activity Tracker Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onApplyCustomSchedule={(cats) => setUserCustomCategories(cats)}
        activeCustomCategories={userCustomCategories}
      />

      {/* Smart Notification Settings Modal */}
      <SmartNotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        selectedMethodId={calculationMethodId}
        onSelectMethod={setCalculationMethodId}
        dataSaver={dataSaver}
        onToggleDataSaver={() => setDataSaver(!dataSaver)}
      />

      {/* Amal Login Prompt Modal */}
      <AmalLoginPromptModal />

      {/* Quick Action Floating Buttons (🤲 Quick Dua & 📿 Quick Dhikr) */}
      <QuickDuaFab 
        onOpenDua={() => setIsQuickDuaOpen(true)}
        onOpenDhikr={() => setIsQuickDhikrOpen(true)}
        lang={lang} 
      />

      {/* Quick Dua Modal */}
      <QuickDuaModal
        isOpen={isQuickDuaOpen}
        onClose={() => setIsQuickDuaOpen(false)}
        onPlayGlobalAudio={handlePlayAudio}
      />

      {/* Quick Dhikr & Instant Tasbih Modal */}
      <QuickDhikrModal
        isOpen={isQuickDhikrOpen}
        onClose={() => setIsQuickDhikrOpen(false)}
      />

      {/* Smart In-App Islamic Advice & Prayer/Azan Notification Pop-up */}
      <SmartIslamicNotificationPopup
        lang={lang}
        prayerSchedule={prayerSchedule}
        onPlayAudioTrack={handlePlayAudio}
        isPlayingAudio={isPlayingAudio}
        onOpenDuaModal={() => setIsQuickDuaOpen(true)}
        onOpenDhikrModal={() => setIsQuickDhikrOpen(true)}
      />

      {/* Lockscreen Test Countdown & Success Overlay Modal */}
      <LockscreenTestOverlay />

      {/* Universal Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999999] px-4 py-2.5 rounded-2xl bg-emerald-950/95 border-2 border-amber-400 text-white font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-[92vw] animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global 24/7 Smart Alarm Ringing Overlay (TTS, Audio & Marking Complete) */}
      <AlarmRingingOverlay />

      {/* Global 24/7 Audio Player Bar */}
      {activeAudioUrl && (
        <AudioPlayerBar
          lang={lang}
          activeTitle={activeAudioTitle}
          activeAudioUrl={activeAudioUrl}
          isPlaying={isPlayingAudio}
          onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
          onSelectTrack={(title, url) => {
            setActiveAudioTitle(title);
            setActiveAudioUrl(url);
            setIsPlayingAudio(true);
          }}
          audioMode={audioMode}
          onToggleAudioMode={setAudioMode}
        />
      )}

      {/* Interactive Keyword Knowledge Modal (১ ক্লিকে শব্দের গভীর জ্ঞান, কেন ও কীভাবে এবং অনুপ্রেরণা) */}
      <InteractiveKeywordKnowledgeModal
        onNavigateTab={(tab, elementId) => {
          setActiveTab(tab as any);
          if (elementId) {
            setTimeout(() => {
              const el = document.getElementById(elementId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }}
      />

      {/* Footer */}
      <Footer lang={lang} />

    </div>
  );
}
