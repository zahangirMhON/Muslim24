import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Globe,
  MapPin,
  Zap,
  Bell,
  Wifi,
  WifiOff,
  User,
  Menu,
  X,
  Home,
  BookOpen,
  Clock,
  HeartHandshake,
  Bot,
  HelpCircle,
  Compass,
  Radio,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Download
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  locationName: string;
  onOpenSettings: () => void;
  onOpenNotifications?: () => void;
  onOpenUserProfile?: () => void;
  dataSaver: boolean;
  activeTab?: string;
  onNavigateTab?: (tab: 'home' | 'quran' | 'prayer' | 'dhikr' | 'ai' | 'quiz' | 'qibla' | 'media' | 'focus' | 'admin') => void;
  uiZoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  locationName,
  onOpenSettings,
  onOpenNotifications,
  onOpenUserProfile,
  dataSaver,
  activeTab = 'home',
  onNavigateTab,
  uiZoom = 100,
  onZoomIn,
  onZoomOut,
  onResetZoom
}) => {
  const t = translations[lang];
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  
  // Scroll behavior state for mobile responsive hide/reveal & compact icon
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isCompactExpanded, setIsCompactExpanded] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('অ্যাপটি ইতিমধ্যে ইন্সটল করা আছে অথবা ব্রাউজার মেনু (Add to Home Screen) থেকে সহজে হোমস্ক্রিনে যোগ করতে পারেন।');
    }
  };

  useEffect(() => {
    let prevScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY <= 45) {
            setScrollDirection('up');
            setIsScrolled(false);
            setIsCompactExpanded(false);
          } else {
            setIsScrolled(true);
            const diff = currentScrollY - prevScrollY;
            if (Math.abs(diff) > 6) {
              if (diff > 0) {
                setScrollDirection('down');
                setIsCompactExpanded(false);
                setIsSectionMenuOpen(false);
              } else {
                setScrollDirection('up');
              }
            }
          }

          prevScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBrandClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsCompactExpanded(false);
    if (onNavigateTab && activeTab !== 'home') {
      onNavigateTab('home');
    }
  };

  const handleSelectSection = (tab: 'home' | 'quran' | 'prayer' | 'dhikr' | 'ai' | 'quiz' | 'qibla' | 'media' | 'focus' | 'admin') => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    setIsSectionMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SECTIONS: { id: 'home' | 'quran' | 'prayer' | 'dhikr' | 'ai' | 'quiz' | 'qibla' | 'media' | 'focus' | 'admin'; title: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'home', title: 'হোম ড্যাশবোর্ড', icon: <Home className="w-4 h-4 text-emerald-400" />, desc: 'ক্যালেন্ডার, নামাজের ওয়াক্ত, দোয়া ও সকল ফিচার' },
    { id: 'quran', title: 'পবিত্র কুরআন ও ১১৪ সূরা', icon: <BookOpen className="w-4 h-4 text-amber-400" />, desc: 'উচ্চারণ, বাংলা অর্থ ও প্রতিটি আয়াতের অডিও' },
    { id: 'prayer', title: 'সালাতের সময়সূচী', icon: <Clock className="w-4 h-4 text-cyan-400" />, desc: 'ফরয ও নফল সালাতের নির্ভুল সময় ও কাউন্টডাউন' },
    { id: 'dhikr', title: 'দোয়া ও জিকির (তসবিহ)', icon: <HeartHandshake className="w-4 h-4 text-rose-400" />, desc: 'হিসনুল মুসলিম ও আল্লাহর ৯৯টি গুণবাচক নাম' },
    { id: 'media', title: '২৪/৭ লাইভ মিডিয়া রেডিও', icon: <Radio className="w-4 h-4 text-amber-300" />, desc: 'চলমান সময় অনুযায়ী নিরবচ্ছিন্ন ইসলামিক অডিও ও লাইভ' },
    { id: 'qibla', title: 'ক্বিবলা কম্পাস', icon: <Compass className="w-4 h-4 text-emerald-300" />, desc: '৩৬০° জিপিএস ও সেন্সর ভিত্তিক সঠিক ক্বাবা দিক' },
    { id: 'ai', title: 'ইসলামিক এআই ফতোয়া ও জ্ঞান', icon: <Bot className="w-4 h-4 text-teal-300" />, desc: 'কুরআন ও সহীহ হাদিস ভিত্তিক তাৎক্ষণিক উত্তর' },
    { id: 'focus', title: 'ইসলামিক ফোকাস ড্যাশবোর্ড', icon: <Sparkles className="w-4 h-4 text-amber-400" />, desc: 'আমল ট্র্যাকার, সালাত রুটিন ও কুরআন রিডিং গোল' },
    { id: 'quiz', title: 'ইসলামিক কুইজ', icon: <HelpCircle className="w-4 h-4 text-indigo-400" />, desc: 'প্রতিদিন পরিবর্তনশীল ইসলামিক জ্ঞান প্রতিযোগিতা' },
    { id: 'admin', title: 'RAG মডারেশন ও আলেম পোর্টাল', icon: <ShieldCheck className="w-4 h-4 text-amber-300" />, desc: 'সহীহ রেফারেন্স ও নলেজবেস ম্যানেজমেন্ট' },
  ];

  const isHeaderHidden = isScrolled && scrollDirection === 'down' && !isCompactExpanded;

  return (
    <>
      {/* Floating Small Top Compact Icon / Mini Bar */}
      <div
        className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out transform ${
          isHeaderHidden
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-6 scale-90 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-1.5 p-1.5 pl-2 pr-2.5 rounded-full bg-emerald-950/95 border-2 border-amber-400/80 text-white shadow-2xl backdrop-blur-xl ring-2 ring-emerald-950/50">
          <button
            onClick={handleBrandClick}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            title="ইসলামিক লাইফ ২৪/৭ - পেজের শুরুতে যান"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-emerald-950 flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
              🌙
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-amber-300 leading-tight">
                {t.appTitle}
              </span>
              <span className="text-[9px] text-emerald-200">
                {locationName} • {isOnline ? '🟢 অনলাইন' : '🟡 অফলাইন'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setIsCompactExpanded(true)}
            className="p-1 rounded-full bg-emerald-900/90 text-amber-300 hover:bg-emerald-800 border border-emerald-700 ml-1 transition cursor-pointer"
            title="মেনু বার প্রদর্শন করুন"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Full Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 bg-emerald-950 text-white border-b-2 border-emerald-800 shadow-xl transition-all duration-300 ease-in-out ${
          isHeaderHidden
            ? '-translate-y-full opacity-0 pointer-events-none shadow-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* App Brand Logo & Title */}
            <button
              onClick={handleBrandClick}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus:outline-none text-left"
              title="ইসলামিক লাইফ ২৪/৭ - হোমপেজে ফিরে যান"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-emerald-950 flex items-center justify-center font-black text-base sm:text-xl shadow-lg border border-amber-200 group-hover:scale-105 transition-transform flex-shrink-0">
                🌙
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-lg font-black text-amber-300 tracking-tight drop-shadow-sm group-hover:text-amber-200 transition-colors truncate">
                    {t.appTitle}
                  </h1>
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'} flex-shrink-0`} title={isOnline ? 'অনলাইন' : 'অফলাইন মোড'} />
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-300 font-medium group-hover:text-emerald-200 transition-colors flex items-center gap-1 truncate">
                  <span>{t.appSubtitle}</span>
                  <span className="text-[10px] text-amber-300/80 font-bold hidden md:inline">• (হোমে যেতে ক্লিক করুন)</span>
                </p>
              </div>
            </button>

            {/* Quick Menu & Action Controls */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs">
              
              {/* Section Quick Jump Navigator Button */}
              <div className="relative">
                <button
                  onClick={() => setIsSectionMenuOpen(!isSectionMenuOpen)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 border cursor-pointer shadow ${
                    isSectionMenuOpen
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-400/50'
                      : 'bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border-emerald-700/80'
                  }`}
                  title="ওয়েবসাইটের যেকোনো সেকশনে যেতে মেনু খুলুন"
                >
                  <Menu className="w-4 h-4" />
                  <span className="hidden sm:inline">মেনু / সেকশন</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isSectionMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Section Navigator Dropdown */}
                {isSectionMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-emerald-950/98 backdrop-blur-xl border-2 border-amber-400/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 bg-emerald-900 border-b border-emerald-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>যে সেকশনে যেতে চান নির্বাচন করুন</span>
                      </span>
                      <button
                        onClick={() => setIsSectionMenuOpen(false)}
                        className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border-b border-emerald-800/80">
                      <button
                        onClick={() => {
                          setIsSectionMenuOpen(false);
                          window.dispatchEvent(new CustomEvent('open-quick-dua-modal'));
                        }}
                        className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black shadow-md flex items-center gap-2.5 cursor-pointer text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-950 text-amber-300 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-black">তাত্ক্ষণিক দোয়া ও আমল (Quick Dua)</div>
                          <div className="text-[10px] text-emerald-950 font-semibold">খাবার, ঘুম, সফর, রোগ ও সকল জরুরি দোয়া</div>
                        </div>
                      </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {SECTIONS.map(s => {
                        const isCurrent = activeTab === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => handleSelectSection(s.id)}
                            className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 cursor-pointer ${
                              isCurrent
                                ? 'bg-amber-400 text-emerald-950 font-bold shadow'
                                : 'hover:bg-emerald-900/80 text-emerald-100'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${isCurrent ? 'bg-emerald-950/20' : 'bg-emerald-900 border border-emerald-700'}`}>
                              {s.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>{s.title}</span>
                                {isCurrent && <span className="text-[10px] bg-emerald-950 text-amber-300 px-1.5 py-0.5 rounded font-black">বর্তমান</span>}
                              </div>
                              <div className={`text-[10px] truncate ${isCurrent ? 'text-emerald-900 font-medium' : 'text-emerald-300/80'}`}>
                                {s.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-2.5 bg-emerald-900/60 border-t border-emerald-800 text-center">
                      <button
                        onClick={handleBrandClick}
                        className="w-full py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>🔝 সরাসরি পেজের সবার উপরে যান</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* PWA Install Button */}
              {!isInstalled && (
                <button
                  onClick={handleInstallPWA}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-700/80 font-bold transition cursor-pointer"
                  title="অফলাইনে ব্যবহারের জন্য অ্যাপ ইন্সটল করুন (PWA)"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">ইন্সটল PWA</span>
                </button>
              )}

              {/* Text & Display Zoom Controller */}
              <div className="flex items-center bg-emerald-900/90 border border-emerald-700/80 rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={onZoomOut}
                  className="p-1 sm:px-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-amber-300 transition text-[11px] font-bold cursor-pointer"
                  title="জুম আউট / লেখা ছোট করুন (Zoom Out)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onResetZoom}
                  className="px-1.5 py-0.5 text-[10px] font-black text-amber-300 hover:text-amber-200 cursor-pointer min-w-[28px] text-center"
                  title="স্বাভাবিক আকার (১০০%)"
                >
                  {uiZoom}%
                </button>
                <button
                  onClick={onZoomIn}
                  className="p-1 sm:px-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-amber-300 transition text-[11px] font-bold cursor-pointer"
                  title="জুম ইন / লেখা বড় করুন (Zoom In)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Location Selector */}
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition font-medium cursor-pointer"
                title="স্থান ও জেলা পরিবর্তন করুন"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="hidden xs:inline max-w-[80px] sm:max-w-none truncate">{locationName}</span>
              </button>

              {/* Smart Notifications Modal Trigger */}
              <button
                onClick={onOpenNotifications}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700/60 transition flex items-center gap-1 font-bold cursor-pointer"
                title="স্মার্ট ইসলামিক নোটিফিকেশন"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 transition flex items-center gap-1 cursor-pointer"
                title="দৃশ্যানুভূতি পরিবর্তন (দিন/রাত থিম)"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Profile / Amal Leaderboard Modal Trigger */}
              <button
                onClick={onOpenUserProfile}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-400 text-emerald-950 hover:bg-amber-300 font-bold border border-amber-300 transition shadow-sm cursor-pointer"
                title="আমার প্রোফাইল ও আমল ট্র্যাকার"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">প্রোফাইল</span>
              </button>

            </div>

          </div>
        </div>
      </header>
    </>
  );
};
