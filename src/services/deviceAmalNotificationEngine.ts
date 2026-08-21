// Unified Device Lock-Screen & Background Push Notification Engine for Amal Progress
// Ensures notifications ring, vibrate, and appear on Android/iOS/Desktop lock screens

import { getDayOverview, getTodayDateString } from './amalTrackerService';
import { notificationSound } from '../utils/audioChime';

export interface LockscreenNotificationConfig {
  enabled: boolean;
  vibrate: boolean;
  sound: boolean;
  remindRemainingAmals: boolean;
  remindPrayers: boolean;
  nightSleepAmalReminder: boolean;
  morningAzkarReminder: boolean;
}

const CONFIG_KEY = 'islamic_lockscreen_notif_config_v2';
const LAST_ALERT_KEY_PREFIX = 'islamic_last_lockscreen_alert_';

type CountdownListener = (state: {
  active: boolean;
  secondsLeft: number;
  completed: boolean;
  isIframe: boolean;
  permission: NotificationPermission;
  message?: string;
}) => void;

export class DeviceAmalNotificationEngine {
  private config: LockscreenNotificationConfig;
  private intervalId: any = null;
  private countdownListeners: Set<CountdownListener> = new Set();
  private isCountingDown = false;
  private countdownTimer: any = null;

  constructor() {
    this.config = this.loadConfig();
    this.initServiceWorkerSync();
  }

  public loadConfig(): LockscreenNotificationConfig {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return {
      enabled: true,
      vibrate: true,
      sound: true,
      remindRemainingAmals: true,
      remindPrayers: true,
      nightSleepAmalReminder: true,
      morningAzkarReminder: true
    };
  }

  public saveConfig(newConfig: Partial<LockscreenNotificationConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {}
    this.syncWithServiceWorker();
  }

  public getConfig(): LockscreenNotificationConfig {
    return this.config;
  }

  public isInIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  /**
   * Check if device has granted notification permissions
   */
  public async checkPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Request device permission for Lock Screen & Background push notifications
   */
  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Web Notification API not supported on this browser/device');
      return false;
    }

    try {
      // Unlock audio context on user gesture
      notificationSound.initContext();

      // Older browsers used callbacks, modern use Promise
      let result: NotificationPermission;
      try {
        result = await Notification.requestPermission();
      } catch (err) {
        // Callback fallback for legacy browsers
        result = await new Promise((resolve) => {
          Notification.requestPermission((perm) => resolve(perm));
        });
      }

      if (result === 'granted') {
        // Send initial confirmation alert
        await this.sendDirectNotification(
          '🔒 লক স্ক্রিন নোটিফিকেশন সক্রিয় হয়েছে!',
          'এখন থেকে স্ক্রিন লক থাকা অবস্থায়ও নামাজের ওয়াক্ত ও আমল প্রগ্রেসের রিমাইন্ডার পাবেন।',
          {
            tag: 'permission-granted-welcome',
            requireInteraction: true
          }
        );
        if (this.config.sound) {
          notificationSound.playChime('gentle');
        }
        this.syncWithServiceWorker();
        return true;
      }
    } catch (e) {
      console.warn('Error requesting notification permission (possible iframe restriction):', e);
    }
    return false;
  }

  /**
   * Low-level helper to trigger a system-level notification via ServiceWorker
   * This is what shows on phone lock screens, watches, and desktop notification centers
   */
  public async sendDirectNotification(
    title: string,
    body: string,
    customOptions: {
      tag?: string;
      requireInteraction?: boolean;
      data?: any;
      silent?: boolean;
    } = {}
  ): Promise<boolean> {
    // Vibrate device
    if (this.config.vibrate && 'vibrate' in navigator) {
      try {
        navigator.vibrate([300, 100, 300, 100, 300]);
      } catch (e) {}
    }

    if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    const options: any = {
      body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag: customOptions.tag || `islamic-amal-${Date.now()}`,
      renotify: true,
      requireInteraction: customOptions.requireInteraction !== undefined ? customOptions.requireInteraction : true,
      silent: customOptions.silent || false,
      data: {
        url: '/',
        date: getTodayDateString(),
        timestamp: Date.now(),
        ...(customOptions.data || {})
      }
    };

    if (this.config.vibrate && 'vibrate' in navigator) {
      options.vibrate = [300, 100, 300, 100, 300];
    }

    // 1. Try through Service Worker Registration (Highest priority for lockscreen waking)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, options);
          return true;
        }
      } catch (swErr) {
        console.warn('ServiceWorker showNotification fallback:', swErr);
      }
    }

    // 2. Fallback to standard window.Notification
    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      console.warn('Failed to trigger window Notification:', e);
      return false;
    }
  }

  /**
   * Subscribes a callback to the live countdown
   */
  public subscribeCountdown(listener: CountdownListener): () => void {
    this.countdownListeners.add(listener);
    return () => {
      this.countdownListeners.delete(listener);
    };
  }

  private notifyCountdownListeners(state: {
    active: boolean;
    secondsLeft: number;
    completed: boolean;
    isIframe: boolean;
    permission: NotificationPermission;
    message?: string;
  }) {
    this.countdownListeners.forEach(listener => {
      try {
        listener(state);
      } catch (e) {
        console.error('Countdown listener error:', e);
      }
    });
  }

  /**
   * Triggers an immediate 5-second countdown test notification!
   * ALWAYS starts countdown immediately regardless of permission state.
   */
  public async scheduleLockscreenTestCountdown(onCountdownTick?: (secondsLeft: number) => void): Promise<void> {
    // 1. Initialize Web Audio on user click
    notificationSound.initContext();

    // 2. If permission not requested yet, prompt in background without blocking
    this.checkPermission().then(async (perm) => {
      if (perm === 'default') {
        try {
          await this.requestPermission();
        } catch (e) {}
      }
    });

    // Clear any existing countdown
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    this.isCountingDown = true;
    let count = 5;
    const isIframe = this.isInIframe();
    let currentPerm: NotificationPermission = 'default';
    try {
      if ('Notification' in window) {
        currentPerm = Notification.permission;
      }
    } catch (e) {}

    // First tick sound
    notificationSound.playTick(700);

    // Initial dispatch
    if (onCountdownTick) onCountdownTick(count);
    this.notifyCountdownListeners({
      active: true,
      secondsLeft: count,
      completed: false,
      isIframe,
      permission: currentPerm,
      message: 'এখনই আপনার মোবাইলের পাওয়ার বাটন চেপে স্ক্রিন লক (বন্ধ) করুন...'
    });

    this.countdownTimer = setInterval(async () => {
      count -= 1;
      
      if (count > 0) {
        // Sound tick on each countdown second
        notificationSound.playTick(600 + count * 30);
        if (onCountdownTick) onCountdownTick(count);
        this.notifyCountdownListeners({
          active: true,
          secondsLeft: count,
          completed: false,
          isIframe,
          permission: currentPerm,
          message: count <= 2 
            ? 'স্ক্রিন লক রাখুন, কিছুক্ষণের মধ্যে অ্যালার্ট বাজবে...'
            : 'পাওয়ার বাটন চেপে স্ক্রিন বন্ধ করুন...'
        });
      } else {
        // Count reaches 0! Test Finished
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.isCountingDown = false;

        if (onCountdownTick) onCountdownTick(0);

        // 1. Play Islamic Chime
        if (this.config.sound) {
          notificationSound.playChime('gentle');
        }

        // 2. Hardware vibration
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate([400, 150, 400, 150, 400]);
          } catch (e) {}
        }

        // 3. Trigger native lockscreen notification
        const overview = getDayOverview(getTodayDateString());
        const alertTitle = '🔔 টেস্ট সফল: ডিভাইস লক স্ক্রিন নোটিফিকেশন!';
        const alertBody = `মাশাআল্লাহ! ফোন লক থাকা সত্ত্বেও আমল প্রগ্রেস (${overview.percent}%) ও নামাজের সতর্কতা এভাবে আপনার স্ক্রিনে ভেসে উঠবে।`;

        await this.sendDirectNotification(alertTitle, alertBody, {
          tag: 'test-lockscreen-alert',
          requireInteraction: true
        });

        // 4. Notify UI modal / overlay
        this.notifyCountdownListeners({
          active: false,
          secondsLeft: 0,
          completed: true,
          isIframe,
          permission: currentPerm,
          message: 'আলহামদুলিল্লাহ! টেস্ট অ্যালার্ট ও রিমাইন্ডার সফলভাবে ট্রিগার হয়েছে।'
        });
      }
    }, 1000);
  }

  /**
   * Cancel ongoing countdown
   */
  public cancelCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    this.isCountingDown = false;
    this.notifyCountdownListeners({
      active: false,
      secondsLeft: 0,
      completed: false,
      isIframe: this.isInIframe(),
      permission: 'default'
    });
  }

  /**
   * Inspects user's Amal Progress and sends smart lock-screen device alert
   */
  public async checkAndNotifyAmalProgress(forced = false): Promise<boolean> {
    if (!this.config.enabled) return false;

    const permission = await this.checkPermission();
    if (permission !== 'granted') return false;

    const now = new Date();
    const currentHour = now.getHours();
    const dateStr = getTodayDateString();

    const overview = getDayOverview(dateStr);
    const remainingTasks = overview.remainingList;
    const completedCount = overview.completedTasks;
    const totalCount = overview.totalTasks;
    const percent = overview.percent;

    // If 100% completed, give congratulations if not notified yet
    if (totalCount > 0 && remainingTasks.length === 0) {
      const doneKey = `all_done_${dateStr}`;
      if (this.canSendAlert(doneKey) || forced) {
        this.markAlertSent(doneKey);
        return await this.sendDirectNotification(
          '🎉 মাশাআল্লাহ! আজকের ১০০% আমল সম্পন্ন!',
          `আলহামদুলিল্লাহ! আজকের সবকটি (${totalCount}টি) ফরজ ও সুন্নাত আমল সম্পন্ন করেছেন। আল্লাহ কবুল করুন!`,
          { tag: 'amal-100-percent-complete', requireInteraction: true }
        );
      }
      return false;
    }

    // Context-sensitive lockscreen reminders based on time of day & remaining tasks
    let alertTitle = '';
    let alertBody = '';
    let alertKey = '';

    if (currentHour >= 6 && currentHour <= 8) {
      alertKey = `morning_amal_${dateStr}`;
      alertTitle = `🌅 সকালের আমল প্রগ্রেস (${overview.percent}% সম্পন্ন)`;
      alertBody = `আজকের ${remainingTasks.length}টি আমল বাকি। সকালের জিকির ও ১০ আয়াত তিলাওয়াত সম্পন্ন করুন।`;
    } else if (currentHour >= 12 && currentHour <= 14) {
      alertKey = `dhuhr_amal_${dateStr}`;
      alertTitle = `☀️ জোহর ওয়াক্ত ও আমল প্রগ্রেস (${overview.percent}% সম্পন্ন)`;
      alertBody = `আজকের ${completedCount}/${totalCount}টি আমল সম্পন্ন হয়েছে। জোহর সালাত আদায় করুন।`;
    } else if (currentHour >= 16 && currentHour <= 17) {
      alertKey = `asr_amal_${dateStr}`;
      alertTitle = `🌇 আসর ও সন্ধ্যার আমল রিমাইন্ডার (${overview.percent}%)`;
      alertBody = `সূর্যাস্তের পূর্বে আসর সালাত ও সন্ধ্যার মাসনূন জিকির পাঠ করুন।`;
    } else if (currentHour >= 18 && currentHour <= 20) {
      alertKey = `maghrib_amal_${dateStr}`;
      alertTitle = `🌆 মাগরিব সালাত ও আমল অগ্রগতি (${overview.percent}%)`;
      alertBody = `আজকের ${remainingTasks.length}টি আমল বাকি আছে। মাগরিব ও এশার সালাত সম্পন্ন করুন।`;
    } else if (currentHour >= 21 && currentHour <= 23) {
      alertKey = `night_amal_${dateStr}`;
      alertTitle = `✨ রাতের আমল ও সূরা মুলক রিমাইন্ডার (${overview.percent}%)`;
      alertBody = `ঘুমানোর পূর্বে সূরা আল-মুলক তিলাওয়াত করুন ও বাকি আমল সম্পন্ন করুন।`;
    } else {
      alertKey = `general_amal_${dateStr}_${currentHour}`;
      alertTitle = `📿 আমল প্রগ্রেস রিমাইন্ডার (${overview.percent}% সম্পন্ন)`;
      alertBody = `আজকের ${completedCount}/${totalCount}টি আমল সম্পন্ন হয়েছে। বাকি ${remainingTasks.length}টি আমল সম্পন্ন করুন।`;
    }

    if (forced || this.canSendAlert(alertKey)) {
      this.markAlertSent(alertKey);
      if (this.config.sound) {
        notificationSound.playChime('gentle');
      }
      return await this.sendDirectNotification(alertTitle, alertBody, {
        tag: `amal-lockscreen-${alertKey}`,
        requireInteraction: true,
        data: { remainingCount: remainingTasks.length, percent }
      });
    }

    return false;
  }

  private canSendAlert(key: string): boolean {
    try {
      const last = localStorage.getItem(`${LAST_ALERT_KEY_PREFIX}${key}`);
      if (!last) return true;
      const lastTime = parseInt(last, 10);
      return (Date.now() - lastTime) > (3 * 60 * 60 * 1000);
    } catch (e) {
      return true;
    }
  }

  private markAlertSent(key: string) {
    try {
      localStorage.setItem(`${LAST_ALERT_KEY_PREFIX}${key}`, Date.now().toString());
    } catch (e) {}
  }

  /**
   * Initializes background listeners and visibilitychange hooks
   */
  public startBackgroundWatcher() {
    if (typeof window === 'undefined') return;

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.checkAndNotifyAmalProgress(false);
      }, 120000);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.syncWithServiceWorker();
        setTimeout(() => {
          this.checkAndNotifyAmalProgress(false);
        }, 3000);
      }
    });

    setTimeout(() => {
      this.checkAndNotifyAmalProgress(false);
    }, 8000);
  }

  private initServiceWorkerSync() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'TRIGGER_AMAL_CHECK') {
          this.checkAndNotifyAmalProgress(false);
        }
      });
    }
  }

  private syncWithServiceWorker() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const overview = getDayOverview(getTodayDateString());
      navigator.serviceWorker.controller.postMessage({
        type: 'UPDATE_AMAL_PROGRESS',
        config: this.config,
        overview: {
          percent: overview.percent,
          remainingTasksCount: overview.remainingTasks,
          date: overview.date
        }
      });
    }
  }
}

export const deviceAmalNotifier = new DeviceAmalNotificationEngine();
