import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';

import { BDLocation, CalendarDates, Language, PrayerTimeItem } from './types';
import { translations } from './locales/translations';
import { getTripleCalendarDates, BANGLADESH_LOCATIONS } from './utils/bengaliUtils';
import { calculatePrayerTimes } from './utils/prayerTimes';
import { QURAN_SURAHS } from './data/islamicData';
import { resolveAudioUrlFromTitle } from './utils/audioResolver';

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
import { Footer } from './components/Footer';

export default function App() {
  // State Management
  const [lang, setLang] = useState<Language>('bn'); // Default Bengali (বাংলা)
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default Dark Mode as requested
  const [activeTab, setActiveTab] = useState<'home' | 'quran' | 'prayer' | 'dhikr' | 'ai' | 'quiz' | 'qibla' | 'media' | 'focus' | 'admin'>('home');
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

    window.addEventListener('open-user-profile-tab', handleOpenProfileTab);
    window.addEventListener('open-quick-dua-modal', handleOpenQuickDua);
    return () => {
      window.removeEventListener('open-user-profile-tab', handleOpenProfileTab);
      window.removeEventListener('open-quick-dua-modal', handleOpenQuickDua);
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

  const t = translations[lang];

  const handlePlayAudio = (title: string, url: string) => {
    const resolvedUrl = resolveAudioUrlFromTitle(title, url);
    if (activeAudioUrl === resolvedUrl && isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setActiveAudioTitle(title);
      setActiveAudioUrl(resolvedUrl);
      setIsPlayingAudio(true);
    }
  };

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
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.home}</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'focus'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-amber-300 hover:bg-emerald-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ইসলামিক ফোকাস</span>
          </button>

          <button
            onClick={() => setActiveTab('prayer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'prayer'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t.prayer}</span>
          </button>

          <button
            onClick={() => setActiveTab('quran')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quran'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.quran}</span>
          </button>

          <button
            onClick={() => setActiveTab('dhikr')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dhikr'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.dhikr}</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{t.aiAssistant}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.quiz}</span>
          </button>

          <button
            onClick={() => setActiveTab('qibla')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'qibla'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t.qibla}</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>২৪/৭ মিডিয়া রেডিও</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-amber-300 hover:bg-emerald-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>RAG মডারেশন ও আলেম পোর্টাল</span>
          </button>
        </nav>

        {/* Tab View Contents */}

        {/* TAB 1: HOME DASHBOARD (User Requested Clean Hierarchy) */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            
            {/* 1. Triple Calendar Card (বর্ষপঞ্জিকা) */}
            <CalendarCard dates={calendarDates} lang={lang} />

            {/* 2. Prayer Times Card (৫ ওয়াক্ত ফরয, নফল ও সূর্যোদয়/সূর্যাস্ত সেকশন) */}
            <PrayerCard
              schedule={prayerSchedule}
              lang={lang}
              locationName={`${selectedLocation.districtBn}`}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* 3. Unified Dhikr, Daily Duas & Asmaul Husna (দোয়া, জিকির ও ৯৯ নাম) */}
            <TasbihCard lang={lang} onPlayAudio={handlePlayAudio} />

            {/* 4. 24/7 Live Broadcast & Media Radio (সরাসরি সম্প্রচার) */}
            <MediaEngineTab lang={lang} audioMode={audioMode} onToggleAudioMode={setAudioMode} />

            {/* 5. Islamic Life & AI Chat Guidance (ইসলামিক জীবন নির্দেশিকা) */}
            <IslamicAiChat lang={lang} />

            {/* 6. Quran 10 Ayats/day Goal (দৈনিক ১০টি কুরআনের আয়াত) */}
            <QuranGoalCard
              lang={lang}
              onPlayAudio={handlePlayAudio}
              currentlyPlayingUrl={activeAudioUrl}
              isPlaying={isPlayingAudio}
            />

            {/* 7. Daily Arabic Language Learning (প্রতিদিন সহজ আরবি ভাষা শিক্ষা) */}
            <ArabicLearningCard lang={lang} />

            {/* 8. Islamic Quiz Section (দিন অনুযায়ী পরিবর্তনশীল কুইজ) */}
            <QuizSection lang={lang} />

            {/* 9. Community Amal Progress & Leaderboard Overview (সকলের অগ্রগতি ও পারফরম্যান্স ওভারভিউ) */}
            <CommunityAmalLeaderboard onOpenUserProfile={() => setIsUserProfileOpen(true)} />

          </div>
        )}

        {/* TAB 2: PRAYER VIEW */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <PrayerCard
              schedule={prayerSchedule}
              lang={lang}
              locationName={`${selectedLocation.districtBn}`}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <QiblaCompass lang={lang} locationName={`${selectedLocation.districtBn}`} />
          </div>
        )}

        {/* TAB 3: QURAN VIEW */}
        {activeTab === 'quran' && (
          <div className="space-y-6">
            <QuranGoalCard
              lang={lang}
              onPlayAudio={handlePlayAudio}
              currentlyPlayingUrl={activeAudioUrl}
              isPlaying={isPlayingAudio}
            />
            <ArabicLearningCard lang={lang} />
          </div>
        )}

        {/* TAB 4: DHIKR & DUA VIEW (Unified Tasbih, Duas & Asmaul Husna) */}
        {activeTab === 'dhikr' && (
          <div className="space-y-6">
            <TasbihCard lang={lang} onPlayAudio={handlePlayAudio} />
          </div>
        )}

        {/* TAB 5: ISLAMIC AI VIEW */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <IslamicAiChat lang={lang} />
          </div>
        )}

        {/* TAB 6: QUIZ VIEW */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <QuizSection lang={lang} />
          </div>
        )}

        {/* TAB 7: QIBLA VIEW */}
        {activeTab === 'qibla' && (
          <div className="space-y-6">
            <QiblaCompass lang={lang} locationName={`${selectedLocation.districtBn}`} />
          </div>
        )}

        {/* TAB 8: 24/7 MEDIA RADIO ENGINE */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <MediaEngineTab 
              lang={lang} 
              audioMode={audioMode} 
              onToggleAudioMode={setAudioMode}
              onPlayAudio={handlePlayAudio}
              currentlyPlayingUrl={activeAudioUrl}
              isPlaying={isPlayingAudio}
            />
          </div>
        )}

        {/* TAB 9: ISLAMIC FOCUS DASHBOARD */}
        {activeTab === 'focus' && (
          <div className="space-y-6">
            <IslamicFocusDashboard lang={lang} />
          </div>
        )}

        {/* TAB 10: ADMIN RAG MODERATION PORTAL */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <AdminRagPortal />
          </div>
        )}

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

      {/* Footer */}
      <Footer lang={lang} />

    </div>
  );
}
