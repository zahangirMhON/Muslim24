import React, { useState, useEffect } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Moon,
  Sun,
  Smartphone,
  Lock,
  Flame,
  Check
} from 'lucide-react';
import { Language, PrayerTimeItem } from '../types';
import { MediaEngineService, AZAN_AUDIO_TRACKS } from '../services/mediaEngine';
import { launchDhikrInTasbih } from '../utils/haptics';
import { notificationSound } from '../utils/audioChime';
import { deviceAmalNotifier } from '../services/deviceAmalNotificationEngine';
import { getDayOverview, getTodayDateString } from '../services/amalTrackerService';

interface SmartIslamicNotificationPopupProps {
  lang: Language;
  prayerSchedule: PrayerTimeItem[];
  onPlayAudioTrack: (title: string, url: string) => void;
  isPlayingAudio: boolean;
  onOpenDuaModal: () => void;
  onOpenDhikrModal: () => void;
}

interface NotificationItem {
  id: string;
  type: 'azan' | 'prayer_reminder' | 'audio_suggestion' | 'dhikr' | 'dua' | 'sunnah_amal' | 'amal_progress';
  title: string;
  message: string;
  timeContext: string;
  actionText?: string;
  audioTrack?: { title: string; url: string };
  dhikrItem?: { titleBn: string; arabicText: string; transliterationBn: string; translationBn: string; targetCount: number };
  badgeText: string;
  badgeColor: string;
  isAutoAzan?: boolean;
}

export const SmartIslamicNotificationPopup: React.FC<SmartIslamicNotificationPopupProps> = ({
  lang,
  prayerSchedule,
  onPlayAudioTrack,
  isPlayingAudio,
  onOpenDuaModal,
  onOpenDhikrModal
}) => {
  const [activePopup, setActivePopup] = useState<NotificationItem | null>(null);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  
  // Sound Enabled State
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('islamic_notif_sound_enabled');
      return val !== 'false'; // default true
    } catch (e) {
      return true;
    }
  });

  // Auto-Azan State
  const [isAutoAzanEnabled, setIsAutoAzanEnabled] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('islamic_auto_azan_enabled');
      return val !== 'false'; // default true
    } catch (e) {
      return true;
    }
  });

  const [lastNotifiedKey, setLastNotifiedKey] = useState<string>('');
  const [devicePermission, setDevicePermission] = useState<NotificationPermission>('default');
  const mediaEngine = new MediaEngineService();

  // Check initial notification permission and start background watcher
  useEffect(() => {
    deviceAmalNotifier.checkPermission().then(setDevicePermission);
    deviceAmalNotifier.startBackgroundWatcher();
  }, []);

  const toggleSound = () => {
    const nextVal = !isSoundEnabled;
    setIsSoundEnabled(nextVal);
    deviceAmalNotifier.saveConfig({ sound: nextVal });
    try {
      localStorage.setItem('islamic_notif_sound_enabled', String(nextVal));
    } catch (e) {}
    if (nextVal) {
      notificationSound.playChime('gentle');
    }
  };

  const toggleAutoAzan = () => {
    const nextVal = !isAutoAzanEnabled;
    setIsAutoAzanEnabled(nextVal);
    try {
      localStorage.setItem('islamic_auto_azan_enabled', String(nextVal));
    } catch (e) {}
  };

  // Request browser Notification permission for device lock screen
  const requestSystemNotificationPermission = async () => {
    const granted = await deviceAmalNotifier.requestPermission();
    if (granted) {
      setDevicePermission('granted');
    }
  };

  // Trigger popup with sound and device lock-screen push notification
  const displayPopup = (item: NotificationItem, isAzan: boolean = false) => {
    setActivePopup(item);

    // 1. Play chime sound
    if (isSoundEnabled) {
      notificationSound.playChime(isAzan ? 'azan' : 'gentle');
    }

    // 2. Trigger native device lock-screen push notification
    deviceAmalNotifier.sendDirectNotification(item.title, item.message, {
      tag: item.id,
      requireInteraction: true
    });
  };

  // Periodic Watcher for Prayer Arrival & Amal Progress Reminders
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const timeKey = `${now.toDateString()}_${currentHour}_${Math.floor(currentMin / 10)}`; // 10 min window

      const hh = currentHour.toString().padStart(2, '0');
      const mm = currentMin.toString().padStart(2, '0');
      const currentTimeStr = `${hh}:${mm}`;

      // 1. Check for Prayer Time / Wakt Arrival (Auto-Azan + Lockscreen Alert)
      const currentPrayer = prayerSchedule.find(p => {
        const prayerDate = new Date(p.timestamp);
        const pHour = prayerDate.getHours().toString().padStart(2, '0');
        const pMin = prayerDate.getMinutes().toString().padStart(2, '0');
        return `${pHour}:${pMin}` === currentTimeStr;
      });
      if (currentPrayer && lastNotifiedKey !== `azan_${currentPrayer.nameEn}_${now.toDateString()}`) {
        setLastNotifiedKey(`azan_${currentPrayer.nameEn}_${now.toDateString()}`);
        
        const isFajr = currentPrayer.nameEn.toLowerCase().includes('fajr');
        const azanTrack = isFajr ? AZAN_AUDIO_TRACKS.fajrAzan : AZAN_AUDIO_TRACKS.generalAzan;

        const notif: NotificationItem = {
          id: `azan-${Date.now()}`,
          type: 'azan',
          title: `🕌 ${currentPrayer.nameBn}র নামাজের ওয়াক্ত শুরু হয়েছে!`,
          message: isAutoAzanEnabled
            ? `মধুর আজান বাজছে। আজানের উত্তর দিন এবং আজান শেষে মাসনূন দোয়া পাঠ করুন।`
            : `জামায়াতে সালাত আদায় করার প্রস্তুতি নিন ও অজু করে নিন।`,
          timeContext: `ওয়াক্ত: ${currentPrayer.azanTimeString || currentPrayer.timeString}`,
          actionText: isAutoAzanEnabled ? 'আজান বাজছে' : 'আজান শুনুন',
          audioTrack: azanTrack,
          badgeText: 'ওয়াক্ত ও আজান',
          badgeColor: 'bg-emerald-500 text-white',
          isAutoAzan: true
        };

        displayPopup(notif, true);

        if (isAutoAzanEnabled) {
          onPlayAudioTrack(azanTrack.title, azanTrack.url);
        }
        return;
      }

      // 2. Periodic Amal Progress & Wisdom Reminder
      if (timeKey !== lastNotifiedKey) {
        setLastNotifiedKey(timeKey);

        const overview = getDayOverview(getTodayDateString());
        const broadcast = mediaEngine.getCurrentBroadcast(now);
        const item = broadcast.activeItem;
        let suggestionItem: NotificationItem | null = null;

        // Morning Azkar & Amal (05:30 - 07:30)
        if (currentHour >= 5 && currentHour < 8) {
          suggestionItem = {
            id: `sugg-${Date.now()}`,
            type: 'dhikr',
            title: `🌅 সকালের আমল প্রগ্রেস (${overview.percent}% সম্পন্ন)`,
            message: overview.remainingTasks > 0
              ? `আজকের ${overview.remainingTasks}টি আমল বাকি। সকালের ১০০ বার "সুবহানাল্লাহি ওয়া বিহামদিহি" ও হেফাজতের দোয়া পড়ুন।`
              : 'সকালের তাসবিহ ও বরকতপূর্ণ আমল সম্পন্ন হয়েছে। মাশাআল্লাহ!',
            timeContext: 'সকালের বরকত',
            actionText: '📿 তাসবিহ শুরু করুন',
            dhikrItem: {
              titleBn: 'সকালের তাসবিহ ও ক্ষমা প্রার্থনা',
              arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
              transliterationBn: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
              translationBn: 'আমি আল্লাহর পবিত্রতা ঘোষণা করছি এবং তাঁর প্রশংসা করছি।',
              targetCount: 100
            },
            badgeText: 'আমল প্রগ্রেস',
            badgeColor: 'bg-teal-500 text-white'
          };
        }
        // Chasht & Work (08:00 - 11:30)
        else if (currentHour >= 8 && currentHour < 12) {
          suggestionItem = {
            id: `sugg-${Date.now()}`,
            type: 'audio_suggestion',
            title: `🌾 হালাল রিজিক ও আমল অগ্রগতি (${overview.percent}%)`,
            message: `কর্মব্যস্ত দিনে প্রশান্তির জন্য "${item.title}" শুনুন এবং আজকের বাকি আমলগুলো সম্পন্ন করুন।`,
            timeContext: 'চাশত ও কর্মব্যস্ততা',
            actionText: '▶️ অডিও শুনুন',
            audioTrack: { title: item.title, url: item.audioStreamUrl },
            badgeText: 'রিজিক ও বরকত',
            badgeColor: 'bg-emerald-600 text-white'
          };
        }
        // Evening Azkar & Maghrib (16:30 - 18:30)
        else if (currentHour >= 16 && currentHour < 19) {
          suggestionItem = {
            id: `sugg-${Date.now()}`,
            type: 'dhikr',
            title: `🌆 সন্ধ্যার মাসনূন আজকার (${overview.percent}% সম্পন্ন)`,
            message: 'সূর্যাস্তের পূর্বে সাইয়্যিদুল ইস্তেগফার পাঠ করুন ও অনিষ্ট থেকে বাঁচার ৩ কুল দোয়া পড়ুন।',
            timeContext: 'সন্ধ্যার আমল',
            actionText: '🤲 দোয়া ও আজকার দেখুন',
            badgeText: 'সন্ধ্যার হেফাজত',
            badgeColor: 'bg-amber-500 text-emerald-950'
          };
        }
        // Night / Surah Mulk (20:30 - 23:30)
        else if (currentHour >= 20 && currentHour < 24) {
          suggestionItem = {
            id: `sugg-${Date.now()}`,
            type: 'audio_suggestion',
            title: `✨ রাতের আমল ও সূরা মুলক (${overview.percent}% সম্পন্ন)`,
            message: overview.remainingTasks > 0 
              ? `ঘুমানোর আগে বাকি ${overview.remainingTasks}টি আমল সম্পন্ন করুন এবং সূরা মুলক তিলাওয়াত শুনুন।`
              : 'আলহামদুলিল্লাহ! আজকের সব আমল সম্পন্ন হয়েছে। সুন্নাহ অনুযায়ী ঘুমাতে যান।',
            timeContext: 'রাতের প্রশান্তি',
            actionText: '▶️ সূরা মুলক শুনুন',
            audioTrack: { title: item.title, url: item.audioStreamUrl },
            badgeText: 'রাতের সুন্নাত',
            badgeColor: 'bg-indigo-600 text-white'
          };
        }

        if (suggestionItem) {
          displayPopup(suggestionItem, false);
        }
      }
    }, 15000);

    return () => clearInterval(checkInterval);
  }, [prayerSchedule, isAutoAzanEnabled, isSoundEnabled, lastNotifiedKey]);

  // Initial welcome pop-up on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      const shownWelcome = sessionStorage.getItem('islamic_top_welcome_shown');
      if (!shownWelcome) {
        sessionStorage.setItem('islamic_top_welcome_shown', 'true');
        const welcomeItem: NotificationItem = {
          id: 'welcome-notif',
          type: 'sunnah_amal',
          title: '✨ আসসালামু আলাইকুম! ইসলামিক লাইফ ২৪/৭ এ স্বাগতম',
          message: 'স্ক্রিন লক থাকলেও আমল প্রগ্রেস ও নামাজের ওয়াক্তের রিমাইন্ডার পেতে নোটিফিকেশন সক্রিয় করুন।',
          timeContext: 'সক্রিয় ও আপডেট',
          badgeText: 'লক স্ক্রিন অ্যালার্ট',
          badgeColor: 'bg-amber-400 text-emerald-950'
        };
        displayPopup(welcomeItem, false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // 5-Second Lock Screen Test Trigger
  const triggerLockScreenTest = () => {
    deviceAmalNotifier.scheduleLockscreenTestCountdown((secondsLeft) => {
      setTestCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        setTimeout(() => setTestCountdown(null), 2000);
      }
    });
  };

  if (!activePopup) return null;

  return (
    /* TOP OF THE SCREEN POPUP BANNER */
    <div className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-[99999] max-w-xl w-[calc(100vw-16px)] sm:w-full transition-all duration-300 ease-out transform">
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-400/95 rounded-2xl p-3 sm:p-4 shadow-2xl space-y-2.5 text-emerald-50 relative backdrop-blur-xl ring-4 ring-emerald-950/60">
        
        {/* Top Controls: Lock Status, Sound Toggle, Device Push, Close */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black shadow-sm ${activePopup.badgeColor}`}>
              {activePopup.badgeText}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-200/90 font-mono flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" />
              <span>{activePopup.timeContext}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Device Push Permission Button */}
            {devicePermission !== 'granted' ? (
              <button
                onClick={requestSystemNotificationPermission}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-400 text-emerald-950 font-black hover:bg-amber-300 transition flex items-center gap-1 cursor-pointer shadow animate-pulse"
                title="স্ক্রিন লক থাকলেও নোটিফিকেশন পেতে অন করুন"
              >
                <Smartphone className="w-3 h-3" />
                <span>লক স্ক্রিন নোটিফিকেশন অন করুন</span>
              </button>
            ) : (
              <span className="text-[9px] px-2 py-0.5 rounded-md bg-emerald-800 text-emerald-200 font-bold border border-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>লক স্ক্রিন অ্যালার্ট সক্রিয়</span>
              </span>
            )}

            {/* Sound Mute/Unmute Quick Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1 rounded-lg border transition cursor-pointer ${
                isSoundEnabled
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 hover:bg-amber-400/30'
                  : 'bg-black/40 text-gray-400 border-white/10'
              }`}
              title={isSoundEnabled ? 'নোটিফিকেশন সাউন্ড চালু (ক্লিক করে মিউট করুন)' : 'সাউন্ড বন্ধ (চালু করতে ক্লিক করুন)'}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => setActivePopup(null)}
              className="p-1 rounded-lg bg-black/40 text-emerald-300 hover:text-white hover:bg-black/60 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Title & Body */}
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 leading-snug flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
            <span>{activePopup.title}</span>
          </h4>
          <p className="text-xs text-emerald-100/95 leading-relaxed font-medium">
            {activePopup.message}
          </p>
        </div>

        {/* Interactive Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/10 flex-wrap">
          
          <div className="flex items-center gap-2">
            {/* Play Recommended Audio Track */}
            {activePopup.audioTrack && (
              <button
                onClick={() => {
                  onPlayAudioTrack(activePopup.audioTrack!.title, activePopup.audioTrack!.url);
                  setActivePopup(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{activePopup.actionText || 'অডিও শুনুন'}</span>
              </button>
            )}

            {/* Launch in Tasbih */}
            {activePopup.dhikrItem && (
              <button
                onClick={() => {
                  launchDhikrInTasbih(activePopup.dhikrItem!);
                  setActivePopup(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>তাসবিহ শুরু করুন</span>
              </button>
            )}

            {/* Open Dua Modal */}
            {activePopup.type === 'dhikr' && !activePopup.dhikrItem && (
              <button
                onClick={() => {
                  onOpenDuaModal();
                  setActivePopup(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>দোয়া ও আজকার দেখুন</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Azan Toggle for Prayer arrival */}
            {activePopup.type === 'azan' && (
              <button
                onClick={toggleAutoAzan}
                className={`text-[10px] px-2 py-1 rounded-lg border font-bold transition flex items-center gap-1 cursor-pointer ${
                  isAutoAzanEnabled
                    ? 'bg-emerald-800 text-emerald-200 border-emerald-500'
                    : 'bg-black/40 text-gray-400 border-white/10'
                }`}
                title="ওয়াক্ত হলে স্বয়ংক্রিয় আজান বাজবে কি না"
              >
                <span>অটো-আজান:</span>
                <span className={isAutoAzanEnabled ? 'text-amber-300' : 'text-gray-400'}>
                  {isAutoAzanEnabled ? 'চালু' : 'বন্ধ'}
                </span>
              </button>
            )}

            {/* 5-Second Lock Screen Test Button */}
            <button
              onClick={triggerLockScreenTest}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 transition flex items-center gap-1 font-bold cursor-pointer"
              title="স্ক্রিন লক করে টেস্ট নোটিফিকেশন দেখুন"
            >
              <Smartphone className="w-3 h-3" />
              <span>
                {testCountdown !== null ? `লক করুন: ${testCountdown} সে.` : '📱 ৫ সে. লক টেস্ট'}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
