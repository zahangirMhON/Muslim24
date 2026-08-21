import React, { useState, useEffect } from 'react';
import {
  Bell,
  ShieldCheck,
  Moon,
  Volume2,
  CheckCircle2,
  Sliders,
  X,
  Sparkles,
  Clock,
  AlertCircle,
  Smartphone,
  Lock,
  Flame,
  Check
} from 'lucide-react';
import { SmartNotificationScheduler, UserNotificationSettings, NotificationProfile } from '../services/notificationScheduler';
import { deviceAmalNotifier, LockscreenNotificationConfig } from '../services/deviceAmalNotificationEngine';
import { getDayOverview, getTodayDateString } from '../services/amalTrackerService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartNotificationSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [scheduler] = useState(() => new SmartNotificationScheduler());
  const [settings, setSettings] = useState<UserNotificationSettings>(() => scheduler.getSettings());
  const [lockConfig, setLockConfig] = useState<LockscreenNotificationConfig>(() => deviceAmalNotifier.getConfig());
  const [devicePermission, setDevicePermission] = useState<NotificationPermission>('default');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      deviceAmalNotifier.checkPermission().then(setDevicePermission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMaster = () => {
    const updated = scheduler.updateSettings({ masterEnabled: !settings.masterEnabled });
    setSettings(updated);
  };

  const handleProfileChange = (profile: NotificationProfile) => {
    const updated = scheduler.updateSettings({ profile });
    setSettings(updated);
  };

  const handleToggleCategory = (categoryKey: string) => {
    const newCategories = {
      ...settings.enabledCategories,
      [categoryKey]: !settings.enabledCategories[categoryKey as keyof typeof settings.enabledCategories]
    };
    const updated = scheduler.updateSettings({ enabledCategories: newCategories });
    setSettings(updated);
  };

  const handleQuietHoursToggle = () => {
    const updated = scheduler.updateSettings({
      quietHours: {
        ...settings.quietHours,
        enabled: !settings.quietHours.enabled
      }
    });
    setSettings(updated);
  };

  const handleRequestLockPermission = async () => {
    const granted = await deviceAmalNotifier.requestPermission();
    if (granted) {
      setDevicePermission('granted');
    }
  };

  const handleToggleLockOption = (key: keyof LockscreenNotificationConfig) => {
    const nextVal = !lockConfig[key];
    const newConf = { ...lockConfig, [key]: nextVal };
    setLockConfig(newConf);
    deviceAmalNotifier.saveConfig(newConf);
  };

  const handleRun5SecLockTest = () => {
    deviceAmalNotifier.scheduleLockscreenTestCountdown((sec) => {
      setTestCountdown(sec);
      if (sec <= 0) {
        setTimeout(() => setTestCountdown(null), 2000);
      }
    });
  };

  const handleSave = () => {
    deviceAmalNotifier.saveConfig(lockConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const todayAmal = getDayOverview(getTodayDateString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-emerald-950 border border-emerald-700/80 text-white rounded-3xl w-full max-w-2xl p-5 sm:p-6 shadow-2xl my-8 space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-emerald-50">স্মার্ট ইসলামিক ও লক স্ক্রিন নোটিফিকেশন</h3>
              <p className="text-xs text-emerald-300/80">স্ক্রিন লক থাকলেও আমল প্রগ্রেস ও নামাজের সতর্কতা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🔒 Device Lock Screen Push Notification Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/90 to-teal-950 border-2 border-amber-400/80 space-y-3 shadow-lg">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-400 text-emerald-950 font-black">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ডিভাইস লক স্ক্রিন ও ব্যাকগ্রাউন্ড পুশ নোটিফিকেশন</span>
                </h4>
                <p className="text-xs text-emerald-200/90">
                  মোবাইল লক বা ব্রাউজার বন্ধ থাকলেও ভাইব্রেশন ও সাউন্ডসহ নোটিফিকেশন আসবে
                </p>
              </div>
            </div>

            {devicePermission !== 'granted' ? (
              <button
                onClick={handleRequestLockPermission}
                className="px-3 py-1.5 rounded-xl bg-amber-400 text-emerald-950 font-black text-xs hover:bg-amber-300 transition shadow cursor-pointer animate-pulse"
              >
                📲 পারমিশন সক্রিয় করুন
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>অনুমতি সক্রিয়</span>
              </span>
            )}
          </div>

          {/* Quick 5-second Lock screen tester */}
          <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xs text-emerald-100">
              <span className="font-bold text-amber-300">লক স্ক্রিন টেস্ট: </span>
              <span>বাটনে চাপ দিয়ে ৫ সেকেন্ডের মধ্যে ফোন লক করে টেস্ট অ্যালার্ট দেখুন।</span>
            </div>

            <button
              onClick={handleRun5SecLockTest}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/50 hover:bg-amber-400/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>
                {testCountdown !== null ? `ফোন লক করুন: ${testCountdown} সে.` : '📱 ৫ সে. লক টেস্ট'}
              </span>
            </button>
          </div>

          {/* Amal Progress specific toggle options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs cursor-pointer hover:bg-emerald-950">
              <span className="text-emerald-100 font-medium">📿 বাকি আমল প্রগ্রেস রিমাইন্ডার</span>
              <input
                type="checkbox"
                checked={lockConfig.remindRemainingAmals}
                onChange={() => handleToggleLockOption('remindRemainingAmals')}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs cursor-pointer hover:bg-emerald-950">
              <span className="text-emerald-100 font-medium">🕌 ৫ ওয়াক্ত নামাজের সময় নোটিফিকেশন</span>
              <input
                type="checkbox"
                checked={lockConfig.remindPrayers}
                onChange={() => handleToggleLockOption('remindPrayers')}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs cursor-pointer hover:bg-emerald-950">
              <span className="text-emerald-100 font-medium">✨ রাতের আমল ও সূরা মুলক রিমাইন্ডার</span>
              <input
                type="checkbox"
                checked={lockConfig.nightSleepAmalReminder}
                onChange={() => handleToggleLockOption('nightSleepAmalReminder')}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs cursor-pointer hover:bg-emerald-950">
              <span className="text-emerald-100 font-medium">📳 হার্ডওয়্যার ভাইব্রেশন ও সাউন্ড</span>
              <input
                type="checkbox"
                checked={lockConfig.vibrate}
                onChange={() => handleToggleLockOption('vibrate')}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Master Switch */}
        <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-amber-300">ইন-অ্যাপ স্মার্ট ব্যানার ও অডিও এলার্ট</h4>
            <p className="text-xs text-emerald-200/80">অ্যাপ চালু থাকাকালীন শীর্ষ ব্যানার ও অডিও পরামর্শ</p>
          </div>
          <button
            onClick={handleToggleMaster}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 cursor-pointer ${
              settings.masterEnabled ? 'bg-amber-400 justify-end' : 'bg-emerald-950 justify-start border border-emerald-800'
            }`}
          >
            <span className={`w-4 h-4 rounded-full shadow-md transition ${settings.masterEnabled ? 'bg-emerald-950' : 'bg-emerald-600'}`} />
          </button>
        </div>

        {/* Profile Frequency Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
            বিজ্ঞপ্তি প্রকাশের ঘনত্বের মাত্রা
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'MINIMAL', title: 'প্রয়োজনীয় ন্যূনতম', desc: 'কেবল ফরজ সালাত ও জরুরি বার্তা' },
              { id: 'BALANCED', title: 'ভারসাম্যপূর্ণ সাধারণ', desc: 'সালাত, প্রাত্যহিক দোআ ও কুরআন' },
              { id: 'DETAILED', title: 'বিস্তারিত ও নিবিড়', desc: 'সকল সুন্নাত আমল, ইতিহাস ও ফোকাস' }
            ].map(prof => (
              <button
                key={prof.id}
                onClick={() => handleProfileChange(prof.id as NotificationProfile)}
                className={`p-2.5 rounded-2xl text-left border transition cursor-pointer ${
                  settings.profile === prof.id
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-lg'
                    : 'bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-900/80'
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  {settings.profile === prof.id && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{prof.title}</span>
                </div>
                <p className="text-[10px] text-emerald-300/70 mt-1">{prof.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Moon className="w-4 h-4" />
              <span>রাতের শান্ত সময়সূচী (নিশ্চুপ মোড)</span>
            </div>
            <button
              onClick={handleQuietHoursToggle}
              className={`w-10 h-5 flex items-center rounded-full p-1 transition duration-300 cursor-pointer ${
                settings.quietHours.enabled ? 'bg-amber-400 justify-end' : 'bg-emerald-950 justify-start border border-emerald-800'
              }`}
            >
              <span className={`w-3 h-3 rounded-full shadow-md transition ${settings.quietHours.enabled ? 'bg-emerald-950' : 'bg-emerald-600'}`} />
            </button>
          </div>
          <p className="text-xs text-emerald-200/80">
            রাত ১১:০০ টা থেকে ভোর ৪:০০ টা পর্যন্ত অপ্রয়োজনীয় বিজ্ঞপ্তি স্থগিত থাকবে। কেবল তাহাজ্জুদ ও ফজরের এলার্ট কাজ করবে।
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-emerald-800 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>১০০% সহীহ ও অফলাইন সুরক্ষিত</span>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                <span>সংরক্ষিত হয়েছে!</span>
              </>
            ) : (
              <span>সেটিংস সংরক্ষণ করুন</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
