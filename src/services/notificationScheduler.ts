export type NotificationCategory =
  | 'PRAYER'
  | 'ADHAN'
  | 'PRE_PRAYER'
  | 'POST_PRAYER'
  | 'MORNING_ADHKAR'
  | 'EVENING_ADHKAR'
  | 'QURAN_READING'
  | 'DAILY_DUA'
  | 'DAILY_DHIKR'
  | 'TAHAJJUD'
  | 'SLEEP_SUNNAH'
  | 'ISLAMIC_CALENDAR'
  | 'JUMUAH'
  | 'SPECIAL_ISLAMIC_DAY'
  | 'RAMADAN'
  | 'FASTING'
  | 'SUHOOR'
  | 'IFTAR'
  | 'ISLAMIC_KNOWLEDGE'
  | 'DAILY_HISTORY'
  | 'MONTHLY_FOCUS'
  | 'WEEKLY_FOCUS'
  | 'PERSONAL_ROUTINE'
  | 'AI_PERSONALIZED'
  | 'SCHOLAR_CONTENT'
  | 'SYSTEM';

export type NotificationProfile = 'MINIMAL' | 'BALANCED' | 'DETAILED';

export interface NotificationRule {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  source: 'Quran' | 'Sahih Hadith' | 'Dua' | 'Calendar' | 'System';
  reference: string;
  authenticityStatus: 'VERIFIED_SAHIH' | 'MUTTAFAQ_ALAYH' | 'HASAN' | 'AUTHENTIC_CALENDAR';
  triggerType: 'PRAYER_RELATIVE' | 'FIXED_TIME' | 'HIJRI_EVENT' | 'RAMADAN_RELATIVE';
  prayerName?: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Sunrise' | 'Sunset';
  offsetMinutes?: number; // e.g. -20 for 20 mins before, +15 for 15 mins after
  fixedTime?: string; // "HH:MM" 24h
  quietHoursBypass: boolean;
  enabled: boolean;
}

export interface UserNotificationSettings {
  masterEnabled: boolean;
  profile: NotificationProfile;
  timezone: string; // "Asia/Dhaka"
  locale: string;   // "bn-BD"
  quietHours: {
    enabled: boolean;
    startTime: string; // "23:00"
    endTime: string;   // "04:00"
  };
  enabledCategories: Record<NotificationCategory, boolean>;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'bn' | 'en' | 'ar';
}

export const DEFAULT_NOTIFICATION_SETTINGS: UserNotificationSettings = {
  masterEnabled: true,
  profile: 'BALANCED',
  timezone: 'Asia/Dhaka',
  locale: 'bn-BD',
  quietHours: {
    enabled: true,
    startTime: '23:00',
    endTime: '04:00'
  },
  soundEnabled: true,
  vibrationEnabled: true,
  language: 'bn',
  enabledCategories: {
    PRAYER: true,
    ADHAN: true,
    PRE_PRAYER: true,
    POST_PRAYER: true,
    MORNING_ADHKAR: true,
    EVENING_ADHKAR: true,
    QURAN_READING: true,
    DAILY_DUA: true,
    DAILY_DHIKR: true,
    TAHAJJUD: true,
    SLEEP_SUNNAH: true,
    ISLAMIC_CALENDAR: true,
    JUMUAH: true,
    SPECIAL_ISLAMIC_DAY: true,
    RAMADAN: true,
    FASTING: true,
    SUHOOR: true,
    IFTAR: true,
    ISLAMIC_KNOWLEDGE: true,
    DAILY_HISTORY: true,
    MONTHLY_FOCUS: true,
    WEEKLY_FOCUS: true,
    PERSONAL_ROUTINE: true,
    AI_PERSONALIZED: true,
    SCHOLAR_CONTENT: true,
    SYSTEM: true
  }
};

export class SmartNotificationScheduler {
  private settings: UserNotificationSettings = { ...DEFAULT_NOTIFICATION_SETTINGS };
  private activeRules: NotificationRule[] = [];

  constructor(customSettings?: Partial<UserNotificationSettings>) {
    if (customSettings) {
      this.settings = { ...this.settings, ...customSettings };
    }
    this.seedDefaultRules();
  }

  private seedDefaultRules() {
    this.activeRules = [
      {
        id: 'rule-fajr-pre',
        category: 'PRE_PRAYER',
        title: 'ফজরের নামাজের আগমন বার্তা',
        message: 'ফজরের সালাতের ২০ মিনিট বাকি। অযু ও প্রস্তুতির উত্তম সময়।',
        source: 'Sahih Hadith',
        reference: 'সহীহ বুখারী: ৫২০',
        authenticityStatus: 'VERIFIED_SAHIH',
        triggerType: 'PRAYER_RELATIVE',
        prayerName: 'Fajr',
        offsetMinutes: -20,
        quietHoursBypass: true,
        enabled: true
      },
      {
        id: 'rule-morning-adhkar',
        category: 'MORNING_ADHKAR',
        title: 'সকালের জিকির ও দোয়া',
        message: 'ফজরের পর সকালের আমল: "সুবহানাল্লাহি ওয়া বিহামদিহি" ১০০ বার পাঠ করুন।',
        source: 'Dua',
        reference: 'হিসনুল মুসলিম, পৃষ্ঠা ৪৫',
        authenticityStatus: 'MUTTAFAQ_ALAYH',
        triggerType: 'PRAYER_RELATIVE',
        prayerName: 'Fajr',
        offsetMinutes: 15,
        quietHoursBypass: false,
        enabled: true
      },
      {
        id: 'rule-tahajjud',
        category: 'TAHAJJUD',
        title: 'তাহাজ্জুদ ও মোনাজাতের সেরা সময়',
        message: 'রাতের শেষ তৃতীয়াংশে মহান আল্লাহ অবতীর্ণ হন। মোনাজাত ও ক্ষমার জন্য উঠুন।',
        source: 'Sahih Hadith',
        reference: 'সহীহ বুখারী: ১১৪৫',
        authenticityStatus: 'VERIFIED_SAHIH',
        triggerType: 'FIXED_TIME',
        fixedTime: '03:45',
        quietHoursBypass: true,
        enabled: true
      },
      {
        id: 'rule-quran-daily',
        category: 'QURAN_READING',
        title: 'দৈনিক ১০ আয়াত কুরআন পাঠের লক্ষ্য',
        message: 'আজকের ১০ আয়াত তেলাওয়াত সম্পন্ন করেছেন তো? ছোট আমল নিয়মিত করাই উত্তম।',
        source: 'Quran',
        reference: 'সূরা আল-মুজ্জাম্মিল: ২০',
        authenticityStatus: 'VERIFIED_SAHIH',
        triggerType: 'FIXED_TIME',
        fixedTime: '07:30',
        quietHoursBypass: false,
        enabled: true
      },
      {
        id: 'rule-jumuah',
        category: 'JUMUAH',
        title: 'পবিত্র জুমুআর দিনের আমল',
        message: 'সূরা কাহফ পাঠ, বেশি বেশি দরুদ পাঠ এবং জুমুআর প্রস্তুতির দিন।',
        source: 'Sahih Hadith',
        reference: 'সুনানে আস-সুগরা: ১৩৭৪',
        authenticityStatus: 'VERIFIED_SAHIH',
        triggerType: 'FIXED_TIME',
        fixedTime: '10:00',
        quietHoursBypass: false,
        enabled: true
      },
      {
        id: 'rule-iftar',
        category: 'IFTAR',
        title: 'ইফতারের সময় আসন্ন',
        message: 'ইফতারের ৫ মিনিট বাকি। দুআ কবুলের এই সময়ে বেশি বেশি ইস্তিগফার করুন।',
        source: 'Sahih Hadith',
        reference: 'সুনানে ইবনে মাজাহ: ১৭৫৩',
        authenticityStatus: 'MUTTAFAQ_ALAYH',
        triggerType: 'PRAYER_RELATIVE',
        prayerName: 'Maghrib',
        offsetMinutes: -5,
        quietHoursBypass: true,
        enabled: true
      }
    ];
  }

  public getSettings(): UserNotificationSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<UserNotificationSettings>): UserNotificationSettings {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  public isInQuietHours(now = new Date()): boolean {
    if (!this.settings.quietHours.enabled) return false;

    const [sh, sm] = this.settings.quietHours.startTime.split(':').map(Number);
    const [eh, em] = this.settings.quietHours.endTime.split(':').map(Number);

    const curMin = now.getHours() * 60 + now.getMinutes();
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (startMin > endMin) {
      // Overnight (e.g. 23:00 to 04:00)
      return curMin >= startMin || curMin < endMin;
    } else {
      return curMin >= startMin && curMin < endMin;
    }
  }

  /**
   * Filters rules based on profile (MINIMAL, BALANCED, DETAILED)
   */
  public getEligibleRules(): NotificationRule[] {
    if (!this.settings.masterEnabled) return [];

    return this.activeRules.filter(rule => {
      if (!rule.enabled) return false;
      if (!this.settings.enabledCategories[rule.category]) return false;

      // Profile constraints
      if (this.settings.profile === 'MINIMAL') {
        // Only essential Prayer, Adhan, Suhoor, Iftar
        return ['PRAYER', 'ADHAN', 'SUHOOR', 'IFTAR', 'SYSTEM'].includes(rule.category);
      } else if (this.settings.profile === 'BALANCED') {
        // Exclude deep niche history & complex routine
        return !['DAILY_HISTORY', 'AI_PERSONALIZED'].includes(rule.category);
      }

      return true; // DETAILED gets all
    });
  }

  public getRules(): NotificationRule[] {
    return this.activeRules;
  }
}
