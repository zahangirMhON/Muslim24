// 24/7 AI Care, Life, Amal & Routine Operating System Central Service
// Manages Profiles, Dynamic AI Context Brain, NLP Parsing, Auto Next-Action Engine, Dynamic Recovery Planner, and History.

import {
  CareProfile,
  CareProfileId,
  RoutineTask,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  ActivityLog,
  AiContextBrainState,
  NextActionSuggestion,
  DailyPlannerConfig,
  ParsedCommandResult,
  DailyTaskExecution,
  TaskHistoryMap
} from '../types/careRoutine';
import { smartAlarmService } from './smartAlarmService';
import { toBengaliDigits } from '../utils/bengaliUtils';

const PROFILES_STORAGE_KEY = 'islamic_app_care_profiles_v1';
const TASKS_STORAGE_KEY = 'islamic_app_care_tasks_v1';
const LOGS_STORAGE_KEY = 'islamic_app_care_logs_v1';
const ACTIVE_PROFILE_KEY = 'islamic_app_care_active_profile_v1';
const PLANNER_CONFIG_KEY = 'islamic_app_care_planner_config_v1';
const TASK_HISTORY_STORAGE_KEY = 'islamic_app_care_task_history_v2';

export const getLocalTodayString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getOffsetDateString = (offsetDays: number, baseDateStr?: string): string => {
  const base = baseDateStr ? new Date(baseDateStr + 'T12:00:00') : new Date();
  base.setDate(base.getDate() + offsetDays);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const formatBengaliDateHuman = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const todayStr = getLocalTodayString();
    const yesterdayStr = getOffsetDateString(-1, todayStr);
    const tomorrowStr = getOffsetDateString(1, todayStr);

    const weekdaysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const dayName = weekdaysBn[date.getDay()];
    const monthName = monthsBn[date.getMonth()];
    const dayDigits = toBengaliDigits(d);
    const yearDigits = toBengaliDigits(y);

    let prefix = '';
    if (dateStr === todayStr) {
      prefix = 'আজ • ';
    } else if (dateStr === yesterdayStr) {
      prefix = 'গতকাল • ';
    } else if (dateStr === tomorrowStr) {
      prefix = 'আগামীকাল • ';
    }

    return `${prefix}${dayName}, ${dayDigits} ${monthName} ${yearDigits}`;
  } catch {
    return dateStr;
  }
};

export const DEFAULT_CARE_PROFILES: CareProfile[] = [
  {
    id: 'ammu',
    nameBn: 'আম্মু (মা ও প্রবীণ কেয়ার)',
    relationBn: 'মা / পেশেন্ট কেয়ার',
    avatar: '❤️',
    automationLevel: 'confirm_first',
    notes: 'নিয়মিত ওষুধ, সময়মতো ফিডিং ও রক্তচাপ মনিটরিং প্রয়োজন।',
    isDefault: true
  },
  {
    id: 'self',
    nameBn: 'নিজের রুটিন ও আমল',
    relationBn: 'ব্যক্তিগত জীবন ও সালাত',
    avatar: '🕌',
    automationLevel: 'smart_auto',
    notes: '৫ ওয়াক্ত নামাজ, কুরআন হিফজ/তিলাওয়াত ও স্বাস্থ্য রুটিন।'
  },
  {
    id: 'baba',
    nameBn: 'বাবা (পরিবার কেয়ার)',
    relationBn: 'বাবা',
    avatar: '👴',
    automationLevel: 'confirm_first',
    notes: 'ডায়াবেটিস ও হার্টের ওষুধ রুটিন।'
  }
];

export const INITIAL_FAVORITE_TASKS: RoutineTask[] = [
  // --- মা ও প্রবীণ কেয়ার (ammu) ---
  {
    id: 'ammu-task-1',
    profileId: 'ammu',
    title: 'ফজর, ঘুম ভাঙা ও সকালের শুভেচ্ছা',
    category: 'prayer',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '06:00',
    durationMinutes: 20,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true,
    voiceAnnouncementText: 'আসসালামু আলাইকুম। আম্মুর ঘুম ভাঙার ও সকালের শুভেচ্ছা জানানোর সময় হয়েছে।'
  },
  {
    id: 'ammu-task-2',
    profileId: 'ammu',
    title: 'সকালের খালি পেটের ওষুধ ও পানি',
    category: 'medicine',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '07:15',
    durationMinutes: 15,
    status: 'pending',
    amountOrDose: '১টি ক্যাপসুল (পানির সাথে)',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true,
    voiceAnnouncementText: 'বিসমিল্লাহ। আম্মুর সকালের নাস্তার আগের খালি পেটের ওষুধ দেওয়ার সময় হয়েছে।',
    dependencyRule: {
      intervalMinutes: 30,
      autoScheduleNext: true,
      nextTaskTitle: 'সকালের পুষ্টিকর নাস্তা',
      nextCategory: 'feeding',
      nextAmount: '১ বাটি নরম খিচুড়ি / ওটস'
    }
  },
  {
    id: 'ammu-task-3',
    profileId: 'ammu',
    title: 'সকালের পুষ্টিকর নাস্তা ও খাবার',
    category: 'feeding',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '07:45',
    durationMinutes: 30,
    status: 'pending',
    amountOrDose: '১ বাটি নরম খাবার / ওটস / ডিম',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true,
    dependencyRule: {
      intervalMinutes: 90,
      autoScheduleNext: true,
      nextTaskTitle: 'সকালের পানি ও রিহাইড্রেশন',
      nextCategory: 'water',
      nextAmount: '১৫০ মিলি পরিষ্কার পানি'
    }
  },
  {
    id: 'ammu-task-4',
    profileId: 'ammu',
    title: 'সকালের পানি ও রিহাইড্রেশন',
    category: 'water',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '09:15',
    durationMinutes: 15,
    status: 'pending',
    amountOrDose: '১৫০ মিলি কুসুম গরম পানি',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-5',
    profileId: 'ammu',
    title: 'শরীরের স্পঞ্জ / গোসল ও কাপর পরিবর্তন',
    category: 'personal_care',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '10:30',
    durationMinutes: 30,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-6',
    profileId: 'ammu',
    title: 'দুপুরের ফল বা হালকা পুষ্টিকর স্যুপ',
    category: 'feeding',
    priority: 'normal',
    isMustDo: false,
    isFavorite: true,
    scheduledTime: '12:00',
    durationMinutes: 20,
    status: 'pending',
    amountOrDose: 'আপেল পিউরি / স্যুপ',
    alarmEnabled: false,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-7',
    profileId: 'ammu',
    title: 'দুপুরের মূল খাবার ও প্রেসারের ওষুধ',
    category: 'medicine',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '13:30',
    durationMinutes: 40,
    status: 'pending',
    amountOrDose: 'খাবার শেষে প্রেসারের ওষুধ',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-8',
    profileId: 'ammu',
    title: 'দুপুরের আরামদায়ক বিশ্রাম ও ঘুম',
    category: 'personal_care',
    priority: 'important',
    isMustDo: false,
    isFavorite: true,
    scheduledTime: '14:30',
    durationMinutes: 90,
    status: 'pending',
    alarmEnabled: false,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-9',
    profileId: 'ammu',
    title: 'বিকেলের পানি ও হালকা নাস্তা',
    category: 'water',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '16:30',
    durationMinutes: 20,
    status: 'pending',
    amountOrDose: '১০০ মিলি পানি ও চা/বিস্কুট',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-10',
    profileId: 'ammu',
    title: 'মাগরিবের তিলাওয়াত শ্রবণ ও দোয়া',
    category: 'amal',
    priority: 'normal',
    isMustDo: false,
    isFavorite: true,
    scheduledTime: '18:30',
    durationMinutes: 30,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'folder_audio',
    alarmFolderId: 'hisnul_muslim',
    repeatDaily: true
  },
  {
    id: 'ammu-task-11',
    profileId: 'ammu',
    title: 'রাতের মূল খাবার ও ডায়াবেটিসের ওষুধ',
    category: 'medicine',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '20:30',
    durationMinutes: 35,
    status: 'pending',
    amountOrDose: 'রাতের খাবার শেষে ওষুধ',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'ammu-task-12',
    profileId: 'ammu',
    title: 'রাতের ঘুম ও শোবার প্রস্তুতি',
    category: 'personal_care',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '21:30',
    durationMinutes: 30,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true,
    voiceAnnouncementText: 'আম্মুর রাতের ঘুমের প্রস্তুতি ও দোয়া পড়ার সময় হয়েছে।'
  },

  // --- নিজের রুটিন ও আমল (self) ---
  {
    id: 'self-task-1',
    profileId: 'self',
    title: 'তাহাজ্জুদ সালাত, সাহরি ও ইস্তিগফার',
    category: 'amal',
    priority: 'important',
    isMustDo: false,
    isFavorite: true,
    scheduledTime: '04:30',
    durationMinutes: 35,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'quran',
    repeatDaily: true,
    voiceAnnouncementText: 'আসসালামু আলাইকুম। শেষ রাতের বরকতময় তাহাজ্জুদ ও ইস্তিগফারের সময় হয়েছে।'
  },
  {
    id: 'self-task-2',
    profileId: 'self',
    title: 'ফজর সালাত ও সকালের মাসনুন আজকার',
    category: 'prayer',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '05:15',
    durationMinutes: 45,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'adhan',
    repeatDaily: true,
    voiceAnnouncementText: 'আসসালাতু খাইরুম মিনান নাওম। ফজর সালাত ও সকালের আজকারের সময় হয়েছে।'
  },
  {
    id: 'self-task-3',
    profileId: 'self',
    title: 'কুরআন তিলাওয়াত ও তাদাব্বুর (১ পারা)',
    category: 'amal',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '06:15',
    durationMinutes: 45,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'quran',
    repeatDaily: true
  },
  {
    id: 'self-task-4',
    profileId: 'self',
    title: 'স্বাস্থ্যকর নাস্তা ও পর্যাপ্ত পানি',
    category: 'feeding',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '07:30',
    durationMinutes: 30,
    status: 'pending',
    alarmEnabled: false,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'self-task-5',
    profileId: 'self',
    title: 'গুরুত্বপূর্ণ কাজ, কর্মস্থল ও অধ্যয়ন',
    category: 'custom',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '08:30',
    durationMinutes: 240, // ৪ ঘণ্টা
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'self-task-6',
    profileId: 'self',
    title: 'জোহর সালাত ও দুপুরের খাবার',
    category: 'prayer',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '13:15',
    durationMinutes: 45,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'adhan',
    repeatDaily: true
  },
  {
    id: 'self-task-7',
    profileId: 'self',
    title: 'কায়লুলাহ / সংক্ষিপ্ত সুন্নাত বিশ্রাম',
    category: 'personal_care',
    priority: 'normal',
    isMustDo: false,
    isFavorite: true,
    scheduledTime: '14:15',
    durationMinutes: 30,
    status: 'pending',
    alarmEnabled: false,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'self-task-8',
    profileId: 'self',
    title: 'আসর সালাত ও বিকেলের মাসনুন আজকার',
    category: 'prayer',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '16:45',
    durationMinutes: 35,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'adhan',
    repeatDaily: true
  },
  {
    id: 'self-task-9',
    profileId: 'self',
    title: 'শারীরিক হাঁটা, ব্যায়াম ও পারিবারিক সময়',
    category: 'exercise',
    priority: 'important',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '17:40',
    durationMinutes: 35,
    status: 'pending',
    alarmEnabled: false,
    alarmTone: 'bengali_voice',
    repeatDaily: true
  },
  {
    id: 'self-task-10',
    profileId: 'self',
    title: 'মাগরিব সালাত ও সান্ধ্যকালীন তিলাওয়াত',
    category: 'prayer',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '18:25',
    durationMinutes: 35,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'adhan',
    repeatDaily: true
  },
  {
    id: 'self-task-11',
    profileId: 'self',
    title: 'এশা সালাত ও রাতের খাবার',
    category: 'prayer',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '20:00',
    durationMinutes: 50,
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'adhan',
    repeatDaily: true
  },
  {
    id: 'self-task-12',
    profileId: 'self',
    title: 'বিছানার দোয়া, ইস্তিগফার ও রাতের ঘুম',
    category: 'personal_care',
    priority: 'critical',
    isMustDo: true,
    isFavorite: true,
    scheduledTime: '22:30',
    durationMinutes: 360, // ৬ ঘণ্টা
    status: 'pending',
    alarmEnabled: true,
    alarmTone: 'bengali_voice',
    repeatDaily: true,
    voiceAnnouncementText: 'বিসমিল্লাহ। শোবার দোয়া পড়ে আরামদায়ক ঘুমের প্রস্তুতি গ্রহণ করুন।'
  }
];

class CareRoutineService {
  private static instance: CareRoutineService;
  private profiles: CareProfile[] = [];
  private activeProfileId: CareProfileId = 'ammu';
  private tasks: RoutineTask[] = [];
  private logs: ActivityLog[] = [];
  private taskHistory: TaskHistoryMap = {};
  private selectedDate: string = getLocalTodayString();
  private listeners: Set<() => void> = new Set();
  private plannerConfig: DailyPlannerConfig = {
    date: getLocalTodayString(),
    selectedMustDoIds: [],
    favoriteIds: [],
    isConfirmed: false
  };

  private constructor() {
    this.loadData();
  }

  public static getInstance(): CareRoutineService {
    if (!CareRoutineService.instance) {
      CareRoutineService.instance = new CareRoutineService();
    }
    return CareRoutineService.instance;
  }

  private loadData() {
    try {
      // Load Profiles
      const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      this.profiles = storedProfiles ? JSON.parse(storedProfiles) : DEFAULT_CARE_PROFILES;

      // Load Active Profile
      const storedActive = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (storedActive && this.profiles.some(p => p.id === storedActive)) {
        this.activeProfileId = storedActive;
      } else {
        this.activeProfileId = this.profiles[0]?.id || 'ammu';
      }

      // Load Tasks
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      this.tasks = storedTasks ? JSON.parse(storedTasks) : INITIAL_FAVORITE_TASKS;

      // Load Logs
      const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      this.logs = storedLogs ? JSON.parse(storedLogs) : [];

      // Load Task History
      const storedHistory = localStorage.getItem(TASK_HISTORY_STORAGE_KEY);
      this.taskHistory = storedHistory ? JSON.parse(storedHistory) : {};

      const todayStr = getLocalTodayString();
      const yesterdayStr = getOffsetDateString(-1, todayStr);

      // Backfill Task History from ActivityLogs if any
      for (const log of this.logs) {
        if (log.action === 'completed' && log.taskId) {
          const logDate = log.date || (log.timestamp ? new Date(log.timestamp).toISOString().split('T')[0] : yesterdayStr);
          if (!this.taskHistory[logDate]) {
            this.taskHistory[logDate] = {};
          }
          if (!this.taskHistory[logDate][log.taskId]) {
            this.taskHistory[logDate][log.taskId] = {
              status: 'completed',
              actualCompletedTime: log.timeString,
              durationMinutes: 15,
              amount: log.amount,
              notes: log.notes,
              completedAtTimestamp: log.timestamp
            };
          }
        }
      }

      // CRITICAL FIX FOR: "কালকের সম্পন্ন কাজগুলো আজ ও দেখাচ্ছে"
      // Check if any base tasks in this.tasks are marked 'completed'.
      // If they are not marked completed for today in this.taskHistory[todayStr],
      // then they were completed yesterday/earlier!
      // We save their completion state into yesterday's history (if not already recorded)
      // and reset today's base status to 'pending' with cleared completion times.
      for (const task of this.tasks) {
        if (task.status === 'completed') {
          const isCompletedToday = this.taskHistory[todayStr]?.[task.id]?.status === 'completed';
          if (!isCompletedToday) {
            // Find recent completion log for this task
            const taskLog = this.logs.find(l => l.taskId === task.id && l.action === 'completed');
            const targetDate = taskLog?.date || (taskLog?.timestamp ? new Date(taskLog.timestamp).toISOString().split('T')[0] : yesterdayStr);

            if (!this.taskHistory[targetDate]) {
              this.taskHistory[targetDate] = {};
            }
            if (!this.taskHistory[targetDate][task.id]) {
              this.taskHistory[targetDate][task.id] = {
                status: 'completed',
                actualCompletedTime: task.actualCompletedTime || '08:00',
                durationMinutes: task.durationMinutes || 15,
                amount: task.amountOrDose,
                notes: task.notes,
                completedAtTimestamp: taskLog?.timestamp || (Date.now() - 86400000)
              };
            }

            // Reset base task for today
            task.status = 'pending';
            task.actualCompletedTime = undefined;
            task.actualStartTime = undefined;
          }
        }
      }

      // Load Planner Config
      const storedPlanner = localStorage.getItem(PLANNER_CONFIG_KEY);
      if (storedPlanner) {
        this.plannerConfig = JSON.parse(storedPlanner);
      } else {
        this.plannerConfig.selectedMustDoIds = this.tasks.filter(t => t.isMustDo).map(t => t.id);
        this.plannerConfig.favoriteIds = this.tasks.filter(t => t.isFavorite).map(t => t.id);
      }

      // Automatically eliminate any duplicate tasks from storage
      this.cleanDuplicateTasks();

      // If any profile has accumulated bloated duplicate tasks (> 22), prune to a balanced sensible schedule
      for (const p of this.profiles) {
        const count = this.tasks.filter(t => t.profileId === p.id).length;
        if (count > 22) {
          this.pruneToSensibleSchedule(p.id);
        }
      }

      // Ensure 'self' routine exists if user had an older version with only 2 tasks
      const selfTasks = this.tasks.filter(t => t.profileId === 'self');
      if (selfTasks.length < 5) {
        const defaultSelfTasks = INITIAL_FAVORITE_TASKS.filter(t => t.profileId === 'self');
        for (const st of defaultSelfTasks) {
          if (!this.tasks.some(t => t.profileId === 'self' && t.scheduledTime === st.scheduledTime)) {
            this.tasks.push({ ...st });
          }
        }
        this.saveData();
      }
    } catch (e) {
      console.error('Error loading CareRoutineService data:', e);
      this.profiles = DEFAULT_CARE_PROFILES;
      this.tasks = INITIAL_FAVORITE_TASKS;
      this.logs = [];
    }
  }

  /**
   * Clean any duplicate task entries across all profiles
   */
  public cleanDuplicateTasks(): number {
    const seenIds = new Set<string>();
    const seenExact = new Set<string>();
    const seenSlot = new Set<string>();
    const cleanList: RoutineTask[] = [];
    let dupCount = 0;

    for (const task of this.tasks) {
      if (seenIds.has(task.id)) {
        dupCount++;
        continue;
      }
      seenIds.add(task.id);

      const normTitle = task.title.trim().toLowerCase().replace(/\s+/g, ' ');
      const exactKey = `${task.profileId}__${task.scheduledTime.trim()}__${normTitle}`;
      const timeCategoryKey = `${task.profileId}__${task.scheduledTime.trim()}__${task.category}`;

      // 1. Exact match (profile + time + normalized title)
      if (seenExact.has(exactKey)) {
        dupCount++;
        continue;
      }

      // 2. Same time and category collision for non-custom tasks (e.g. 2 water tasks at 09:30 or 2 exercise tasks)
      if (seenSlot.has(timeCategoryKey) && task.category !== 'custom') {
        dupCount++;
        continue;
      }

      seenExact.add(exactKey);
      seenSlot.add(timeCategoryKey);
      cleanList.push(task);
    }

    // 3. Secondary pass: deduplicate closely clustered repetitive uncompleted slots (< 20 mins apart)
    cleanList.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    const finalCleanList: RoutineTask[] = [];
    const categoryLastMinutes = new Map<string, number>();

    for (const task of cleanList) {
      const [h, m] = task.scheduledTime.split(':').map(Number);
      const mins = (h || 0) * 60 + (m || 0);
      const groupKey = `${task.profileId}__${task.category}`;

      const lastMins = categoryLastMinutes.get(groupKey);
      if (
        (task.category === 'water' || task.category === 'exercise') &&
        lastMins !== undefined &&
        Math.abs(mins - lastMins) < 20 &&
        task.status !== 'completed'
      ) {
        dupCount++;
        continue;
      }

      categoryLastMinutes.set(groupKey, mins);
      finalCleanList.push(task);
    }

    if (dupCount > 0 || finalCleanList.length !== this.tasks.length) {
      this.tasks = finalCleanList;
      this.saveData();
    }
    return dupCount;
  }

  /**
   * Prunes a bloated profile's tasks down to a balanced, organized 24-hour schedule (12-16 tasks max)
   */
  public pruneToSensibleSchedule(profileId?: CareProfileId): number {
    const target = profileId || this.activeProfileId;
    const profileTasks = this.tasks.filter(t => t.profileId === target);
    const otherTasks = this.tasks.filter(t => t.profileId !== target);

    if (profileTasks.length <= 18) {
      return 0;
    }

    // Separate completed and pending
    const completedTasks = profileTasks.filter(t => t.status === 'completed');
    const pendingTasks = profileTasks.filter(t => t.status !== 'completed');

    // Build balanced list
    const keptList: RoutineTask[] = [...completedTasks];

    // Priority categories to keep intact
    // 1. All prayer tasks (5 waqt salat)
    const prayerTasks = pendingTasks.filter(t => t.category === 'prayer');
    keptList.push(...prayerTasks);

    // 2. Vital medicine tasks (up to 3 max: morning, noon, night)
    const medicineTasks = pendingTasks.filter(t => t.category === 'medicine').slice(0, 4);
    keptList.push(...medicineTasks);

    // 3. Feeding / nutrition (up to 4 max)
    const feedingTasks = pendingTasks.filter(t => t.category === 'feeding').slice(0, 4);
    keptList.push(...feedingTasks);

    // 4. Balanced water slots (up to 5 max, spaced out)
    const waterTasks = pendingTasks.filter(t => t.category === 'water');
    const spacedWater: RoutineTask[] = [];
    let lastWaterMin = -999;
    for (const wt of waterTasks) {
      const [h, m] = wt.scheduledTime.split(':').map(Number);
      const mins = (h || 0) * 60 + (m || 0);
      if (mins - lastWaterMin >= 120 && spacedWater.length < 5) {
        spacedWater.push(wt);
        lastWaterMin = mins;
      }
    }
    keptList.push(...spacedWater);

    // 5. Balanced exercise / therapy sessions (up to 3 max)
    const exerciseTasks = pendingTasks.filter(t => t.category === 'exercise').slice(0, 3);
    keptList.push(...exerciseTasks);

    // 6. Amal and Personal care / sleep (up to 3 max)
    const amalTasks = pendingTasks.filter(t => t.category === 'amal' || t.category === 'personal_care').slice(0, 3);
    keptList.push(...amalTasks);

    // If still empty or too small, keep at least the first 12 tasks
    if (keptList.length < 8) {
      keptList.push(...pendingTasks.slice(0, 10));
    }

    const removedCount = profileTasks.length - keptList.length;

    // Deduplicate kept list
    const finalSeen = new Set<string>();
    const finalProfileTasks: RoutineTask[] = [];
    for (const t of keptList) {
      if (!finalSeen.has(t.id)) {
        finalSeen.add(t.id);
        finalProfileTasks.push(t);
      }
    }

    finalProfileTasks.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    this.tasks = [...otherTasks, ...finalProfileTasks];
    this.saveData();
    return Math.max(0, removedCount);
  }

  /**
   * Reset the current profile or all profiles to the recommended 24-hour schedule
   */
  public resetToRecommendedRoutines(profileId?: CareProfileId) {
    const targetProfile = profileId || this.activeProfileId;
    // Remove existing tasks for this profile
    this.tasks = this.tasks.filter(t => t.profileId !== targetProfile);
    // Add default tasks
    const defaults = INITIAL_FAVORITE_TASKS.filter(t => t.profileId === targetProfile);
    this.tasks.push(...defaults.map(t => ({ ...t, id: `${t.profileId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` })));
    this.cleanDuplicateTasks();
    this.saveData();
  }

  private saveData() {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(this.profiles));
      localStorage.setItem(ACTIVE_PROFILE_KEY, this.activeProfileId);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(this.tasks));
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(this.logs));
      localStorage.setItem(TASK_HISTORY_STORAGE_KEY, JSON.stringify(this.taskHistory));
      localStorage.setItem(PLANNER_CONFIG_KEY, JSON.stringify(this.plannerConfig));
    } catch (e) {
      console.error('Error saving CareRoutineService data:', e);
    }
    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  // Date Management
  public getSelectedDate(): string {
    return this.selectedDate;
  }

  public setSelectedDate(date: string) {
    this.selectedDate = date;
    this.plannerConfig.date = date;
    this.saveData();
  }

  public shiftSelectedDate(offsetDays: number): string {
    this.selectedDate = getOffsetDateString(offsetDays, this.selectedDate);
    this.plannerConfig.date = this.selectedDate;
    this.saveData();
    return this.selectedDate;
  }

  public getDateStats(date: string, profileId?: CareProfileId) {
    const target = profileId || this.activeProfileId;
    const tasks = this.getTasks(target, date);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const missed = tasks.filter(t => t.status === 'missed').length;
    const pending = total - completed - missed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const today = getLocalTodayString();

    return {
      date,
      total,
      completed,
      missed,
      pending,
      percent,
      isPast: date < today,
      isToday: date === today,
      isFuture: date > today
    };
  }

  public getRecentActiveDates(profileId?: CareProfileId, limit = 7): string[] {
    const dates = new Set<string>();
    const today = getLocalTodayString();
    dates.add(today);
    dates.add(getOffsetDateString(-1, today));

    // from taskHistory
    for (const d of Object.keys(this.taskHistory)) {
      if (Object.keys(this.taskHistory[d] || {}).length > 0) {
        dates.add(d);
      }
    }

    // from logs
    for (const l of this.logs) {
      const d = l.date || (l.timestamp ? new Date(l.timestamp).toISOString().split('T')[0] : '');
      if (d) dates.add(d);
    }

    return Array.from(dates)
      .sort((a, b) => b.localeCompare(a))
      .slice(0, limit);
  }

  // Profile Management
  public getProfiles(): CareProfile[] {
    return [...this.profiles];
  }

  public getActiveProfile(): CareProfile {
    return this.profiles.find(p => p.id === this.activeProfileId) || this.profiles[0];
  }

  public setActiveProfile(profileId: CareProfileId) {
    if (this.profiles.some(p => p.id === profileId)) {
      this.activeProfileId = profileId;
      this.saveData();
    }
  }

  public addProfile(newProfile: CareProfile) {
    this.profiles.push(newProfile);
    this.saveData();
  }

  // Task Management
  public getTasks(profileId?: CareProfileId, targetDate?: string): RoutineTask[] {
    const target = profileId || this.activeProfileId;
    const date = targetDate || this.selectedDate || getLocalTodayString();
    const today = getLocalTodayString();
    const isPast = date < today;

    const baseTasks = this.tasks
      .filter(t => t.profileId === target)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    return baseTasks.map((t): RoutineTask => {
      const history = this.taskHistory[date]?.[t.id];
      if (history) {
        return {
          ...t,
          status: history.status,
          actualCompletedTime: history.actualCompletedTime,
          actualStartTime: history.actualStartTime,
          durationMinutes: history.durationMinutes || t.durationMinutes,
          amountOrDose: history.amount || t.amountOrDose,
          notes: history.notes || t.notes
        };
      }

      if (isPast) {
        return {
          ...t,
          status: 'missed',
          actualCompletedTime: undefined,
          actualStartTime: undefined
        };
      }

      return {
        ...t,
        status: 'pending',
        actualCompletedTime: undefined,
        actualStartTime: undefined
      };
    });
  }

  public getAllTasks(targetDate?: string): RoutineTask[] {
    const date = targetDate || this.selectedDate || getLocalTodayString();
    const today = getLocalTodayString();
    const isPast = date < today;

    return this.tasks.map((t): RoutineTask => {
      const history = this.taskHistory[date]?.[t.id];
      if (history) {
        return {
          ...t,
          status: history.status,
          actualCompletedTime: history.actualCompletedTime,
          actualStartTime: history.actualStartTime,
          durationMinutes: history.durationMinutes || t.durationMinutes,
          amountOrDose: history.amount || t.amountOrDose,
          notes: history.notes || t.notes
        };
      }
      if (isPast) {
        return { ...t, status: 'missed', actualCompletedTime: undefined, actualStartTime: undefined };
      }
      return { ...t, status: 'pending', actualCompletedTime: undefined, actualStartTime: undefined };
    }).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }

  public getMustDoTasks(profileId?: CareProfileId, targetDate?: string): RoutineTask[] {
    return this.getTasks(profileId, targetDate).filter(t => t.isMustDo);
  }

  public getFavoriteTasks(profileId?: CareProfileId, targetDate?: string): RoutineTask[] {
    return this.getTasks(profileId, targetDate).filter(t => t.isFavorite);
  }

  public addTask(task: RoutineTask): RoutineTask {
    // Ensure default duration
    if (!task.durationMinutes || task.durationMinutes <= 0) {
      if (task.category === 'prayer') task.durationMinutes = 30;
      else if (task.category === 'medicine') task.durationMinutes = 15;
      else if (task.category === 'water') task.durationMinutes = 10;
      else if (task.category === 'feeding') task.durationMinutes = 35;
      else if (task.category === 'amal') task.durationMinutes = 40;
      else if (task.category === 'personal_care') task.durationMinutes = 30;
      else task.durationMinutes = 30;
    }

    const normTitle = task.title.trim().toLowerCase().replace(/\s+/g, ' ');

    const existingIdx = this.tasks.findIndex(t => t.id === task.id);
    if (existingIdx >= 0) {
      this.tasks[existingIdx] = task;
    } else {
      // Prevent duplicate entry: same profile, time, and title
      const dupIdx = this.tasks.findIndex(
        t => t.profileId === task.profileId &&
             t.scheduledTime.trim() === task.scheduledTime.trim() &&
             t.title.trim().toLowerCase().replace(/\s+/g, ' ') === normTitle
      );
      if (dupIdx >= 0) {
        this.tasks[dupIdx] = { ...this.tasks[dupIdx], ...task, id: this.tasks[dupIdx].id };
        task = this.tasks[dupIdx];
      } else {
        this.tasks.push(task);
      }
    }

    // Keep sorted
    this.tasks.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    // Sync Alarm if enabled
    if (task.alarmEnabled) {
      smartAlarmService.addOrUpdateAlarm({
        id: `alarm-${task.id}`,
        taskId: task.id,
        title: task.title,
        timeString: task.scheduledTime,
        profileId: task.profileId,
        enabled: true,
        toneType: task.alarmTone,
        folderId: task.alarmFolderId,
        trackUrl: task.alarmTrackUrl,
        trackTitle: task.alarmTrackTitle,
        voiceText: task.voiceAnnouncementText || `বিসমিল্লাহ। এখন ${task.title}-এর নির্ধারিত সময় হয়েছে।`
      });
    } else {
      smartAlarmService.deleteAlarm(`alarm-${task.id}`);
    }

    this.saveData();
    return task;
  }

  public updateTask(task: RoutineTask) {
    this.addTask(task);
  }

  public deleteTask(taskId: string) {
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    smartAlarmService.deleteAlarm(`alarm-${taskId}`);
    this.saveData();
  }

  // START / COMPLETE / DURATION TRACKING
  public startTask(taskId: string, targetDate?: string): { task: RoutineTask; log: ActivityLog } {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const now = new Date();
    const todayStr = getLocalTodayString();
    const date = targetDate || this.selectedDate || todayStr;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!this.taskHistory[date]) {
      this.taskHistory[date] = {};
    }
    this.taskHistory[date][taskId] = {
      status: 'in_progress',
      actualStartTime: timeStr,
      amount: task.amountOrDose,
      notes: task.notes
    };

    if (date === todayStr) {
      task.status = 'in_progress';
      task.actualStartTime = timeStr;
    }

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: task.id,
      profileId: task.profileId,
      timestamp: Date.now(),
      date,
      timeString: timeStr,
      action: 'started',
      title: `${task.title} শুরু করা হয়েছে`,
      category: task.category,
      amount: task.amountOrDose,
      islamicQuote: 'বিসমিল্লাহ। ইনশাআল্লাহ্ কাজটি সুষ্ঠুভাবে শুরু করা হলো।'
    };

    this.addLog(log);
    this.saveData();
    return { task, log };
  }

  public completeTask(
    taskId: string,
    customNotes?: string,
    customAmount?: string,
    targetDate?: string
  ): {
    task: RoutineTask;
    log: ActivityLog;
    nextSuggestion?: NextActionSuggestion;
  } {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const now = new Date();
    const todayStr = getLocalTodayString();
    const date = targetDate || this.selectedDate || todayStr;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Calculate duration
    let duration = 15;
    if (task.actualStartTime) {
      const [startH, startM] = task.actualStartTime.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const curMin = now.getHours() * 60 + now.getMinutes();
      if (curMin >= startMin) {
        duration = Math.max(1, curMin - startMin);
      }
    }

    if (!this.taskHistory[date]) {
      this.taskHistory[date] = {};
    }
    this.taskHistory[date][taskId] = {
      status: 'completed',
      actualCompletedTime: timeStr,
      durationMinutes: duration,
      amount: customAmount || task.amountOrDose,
      notes: customNotes || task.notes,
      completedAtTimestamp: Date.now()
    };

    if (date === todayStr) {
      task.status = 'completed';
      task.actualCompletedTime = timeStr;
      task.durationMinutes = duration;
      if (customAmount) task.amountOrDose = customAmount;
      if (customNotes) task.notes = customNotes;
    }

    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      taskId: task.id,
      profileId: task.profileId,
      timestamp: Date.now(),
      date,
      timeString: timeStr,
      action: 'completed',
      title: `${task.title} সম্পন্ন হয়েছে`,
      category: task.category,
      amount: customAmount || task.amountOrDose,
      islamicQuote: 'আলহামদুলিল্লাহ। কাজটি সুন্দরভাবে সম্পন্ন হয়েছে।'
    };
    this.addLog(log);

    // TRIGGER NEXT ACTION ENGINE!
    let nextSuggestion: NextActionSuggestion | undefined;
    if (task.dependencyRule) {
      const rule = task.dependencyRule;
      const targetTime = this.addMinutesToTime(timeStr, rule.intervalMinutes);

      nextSuggestion = {
        id: `sugg-${Date.now()}`,
        title: rule.nextTaskTitle,
        category: rule.nextCategory,
        suggestedTime: targetTime,
        reasonBn: `${task.title} সম্পন্ন করার ${toBengaliDigits(rule.intervalMinutes)} মিনিট পর নির্ধারিত নিয়ম অনুযায়ী।`,
        dependencyIntervalMinutes: rule.intervalMinutes,
        alarmProposalText: `ইনশাআল্লাহ্ এখন ${rule.nextTaskTitle}-এর সময় হয়েছে।`,
        amount: rule.nextAmount,
        profileId: task.profileId,
        confirmed: false,
        createdAt: Date.now()
      };

      // If user's profile is set to smart_auto, automatically add this task and schedule alarm!
      const profile = this.getActiveProfile();
      if (profile.automationLevel === 'smart_auto' && rule.autoScheduleNext) {
        this.applyNextSuggestion(nextSuggestion);
      }
    }

    this.saveData();
    return { task, log, nextSuggestion };
  }

  /**
   * Revert / Undo a completed task back to pending state
   * Clears completion timestamps and removes corresponding activity logs
   */
  public uncompleteTask(taskId: string, targetDate?: string): { task: RoutineTask; removedLogCount: number } {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const todayStr = getLocalTodayString();
    const date = targetDate || this.selectedDate || todayStr;

    if (this.taskHistory[date]?.[taskId]) {
      delete this.taskHistory[date][taskId];
    }

    if (date === todayStr) {
      task.status = 'pending';
      task.actualCompletedTime = undefined;
      task.actualStartTime = undefined;
    }

    // Clean up any completion logs for this task on this date
    const initialLogCount = this.logs.length;
    this.logs = this.logs.filter(l => {
      const lDate = l.date || (l.timestamp ? new Date(l.timestamp).toISOString().split('T')[0] : '');
      const isMatch = l.taskId === taskId && l.action === 'completed' && (!lDate || lDate === date);
      return !isMatch;
    });
    const removedLogCount = initialLogCount - this.logs.length;

    this.saveData();
    return { task, removedLogCount };
  }

  // ----------------------------------------------------
  // CLEAN ACTIVITY LOG MANAGEMENT & DEDUPLICATION
  // ----------------------------------------------------
  public addLog(log: ActivityLog): ActivityLog {
    if (!log.date) {
      log.date = this.selectedDate || getLocalTodayString();
    }

    // 1. Sanitize title if only "(১৫০ মিলি)" or "(২০০ মিলি তরল পুষ্টি)"
    let cleanTitle = log.title.trim();
    if (cleanTitle.startsWith('(') && cleanTitle.endsWith(')')) {
      const inner = cleanTitle.slice(1, -1);
      if (log.category === 'water' || inner.includes('পানি')) {
        cleanTitle = `পর্যাপ্ত পানি পান — ${inner}`;
      } else if (log.category === 'feeding' || inner.includes('পুষ্টি') || inner.includes('খাবার')) {
        cleanTitle = `পুষ্টিকর খাবার / তরল পুষ্টি — ${inner}`;
      } else if (log.category === 'medicine' || inner.includes('ট্যাবলেট') || inner.includes('ক্যাপসুল')) {
        cleanTitle = `নির্ধারিত ওষুধ — ${inner}`;
      } else {
        cleanTitle = `রুটিন কাজ — ${inner}`;
      }
    }
    log.title = cleanTitle;

    // 2. Intelligent Deduplication (within same date, time, profile and normalized title)
    const existingIdx = this.logs.findIndex(
      l => l.profileId === log.profileId &&
           (l.date || '') === (log.date || '') &&
           l.timeString === log.timeString &&
           l.title.toLowerCase().replace(/\s+/g, ' ') === log.title.toLowerCase().replace(/\s+/g, ' ')
    );

    if (existingIdx >= 0) {
      this.logs[existingIdx] = {
        ...this.logs[existingIdx],
        ...log,
        id: this.logs[existingIdx].id,
        timestamp: Date.now()
      };
      this.saveData();
      return this.logs[existingIdx];
    }

    this.logs.unshift(log);
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }
    this.saveData();
    return log;
  }

  public cleanDuplicateLogs(profileId?: CareProfileId): number {
    const target = profileId || this.activeProfileId;
    const seen = new Set<string>();
    const cleanList: ActivityLog[] = [];
    let dupCount = 0;

    for (const log of this.logs) {
      if (log.profileId !== target) {
        cleanList.push(log);
        continue;
      }

      let title = log.title.trim();
      if (title.startsWith('(') && title.endsWith(')')) {
        const inner = title.slice(1, -1);
        title = log.category === 'water' ? `পর্যাপ্ত পানি পান — ${inner}` :
                log.category === 'feeding' ? `পুষ্টিকর খাবার / তরল পুষ্টি — ${inner}` :
                `রুটিন কাজ — ${inner}`;
      }

      const normKey = `${log.timeString}__${title.toLowerCase().replace(/\s+/g, ' ')}`;
      if (!seen.has(normKey)) {
        seen.add(normKey);
        cleanList.push({ ...log, title });
      } else {
        dupCount++;
      }
    }

    this.logs = cleanList;
    this.saveData();
    return dupCount;
  }

  public deleteLog(logId: string) {
    this.logs = this.logs.filter(l => l.id !== logId);
    this.saveData();
  }

  public clearAllLogs(profileId?: CareProfileId) {
    const target = profileId || this.activeProfileId;
    this.logs = this.logs.filter(l => l.profileId !== target);
    this.saveData();
  }

  // Helper: Add minutes to "HH:mm"
  private addMinutesToTime(timeStr: string, minutesToAdd: number): string {
    const [h, m] = timeStr.split(':').map(Number);
    let totalMinutes = h * 60 + m + minutesToAdd;
    if (totalMinutes >= 24 * 60) totalMinutes = totalMinutes % (24 * 60);
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  }

  // Apply suggested next action
  public applyNextSuggestion(sugg: NextActionSuggestion): RoutineTask {
    const newTask: RoutineTask = {
      id: `task-${Date.now()}`,
      profileId: sugg.profileId,
      title: sugg.title,
      category: sugg.category,
      priority: 'critical',
      isMustDo: true,
      isFavorite: false,
      scheduledTime: sugg.suggestedTime,
      status: 'pending',
      amountOrDose: sugg.amount,
      alarmEnabled: true,
      alarmTone: 'bengali_voice',
      repeatDaily: false,
      voiceAnnouncementText: sugg.alarmProposalText || `বিসমিল্লাহ। এখন ${sugg.title}-এর সময় হয়েছে।`
    };

    this.addTask(newTask);
    sugg.confirmed = true;
    this.saveData();
    return newTask;
  }

  // ----------------------------------------------------
  // NATURAL LANGUAGE & BENGALI VOICE INPUT PARSER
  // ----------------------------------------------------
  public parseNaturalLanguageInput(rawText: string): ParsedCommandResult {
    const text = rawText.trim().toLowerCase();
    const now = new Date();
    const curTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 1. Profile Detection
    let understoodProfileId = this.activeProfileId;
    if (text.includes('আম্মু') || text.includes('মাকে') || text.includes('মা')) {
      understoodProfileId = 'ammu';
    } else if (text.includes('বাবা') || text.includes('আব্বু')) {
      understoodProfileId = 'baba';
    } else if (text.includes('আমার') || text.includes('নিজে') || text.includes('আমি')) {
      understoodProfileId = 'self';
    }

    // 1b. Date Detection
    let targetDate = this.selectedDate || getLocalTodayString();
    if (text.includes('গতকাল') || text.includes('কালকে') || text.includes('কালকের') || text.includes('গত কাল')) {
      targetDate = getOffsetDateString(-1);
    } else if (text.includes('আজ') || text.includes('আজকে') || text.includes('আজকের')) {
      targetDate = getLocalTodayString();
    } else if (text.includes('আগামীকাল') || text.includes('আগামী কাল')) {
      targetDate = getOffsetDateString(1);
    } else if (text.includes('পরশু')) {
      targetDate = getOffsetDateString(2);
    }

    const bengaliDigitsToEnglish: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };

    // ------------------------------------------------------------------
    // SPECIAL CASE 1: MULTI-STEP WATER QUOTA SCHEDULE (e.g. "৩ লিটার পানি")
    // ------------------------------------------------------------------
    const isWaterQuotaRequest =
      (text.includes('পানি') || text.includes('water')) &&
      (text.includes('লিটার') || text.includes('liter') || text.includes('সারাদিন') || text.includes('শিডিউল') || text.includes('খালি পেটে'));

    if (isWaterQuotaRequest) {
      let targetLiters = 3.0;
      if (text.includes('৩.৫') || text.includes('3.5') || text.includes('সাড়ে তিন')) {
        targetLiters = 3.5;
      } else if (text.includes('৩') || text.includes('3') || text.includes('তিন')) {
        targetLiters = 3.0;
      } else if (text.includes('২.৫') || text.includes('2.5') || text.includes('আড়াই') || text.includes('আড়াই')) {
        targetLiters = 2.5;
      } else if (text.includes('২') || text.includes('2') || text.includes('দুই')) {
        targetLiters = 2.0;
      }

      // Generate 7 balanced time-distributed slots
      let slotsConfig: Array<{ time: string; title: string; amount: string; duration: number; notes: string }> = [];

      if (targetLiters === 3.0) {
        slotsConfig = [
          { time: '06:00', title: 'সকালে খালি পেটে কুসুম গরম পানি পান', amount: '৫০০ মিলি', duration: 15, notes: 'খালি পেটে পরিমিত পানি পান হজমশক্তি বৃদ্ধি, শরীর ডিটক্স ও কোষ্ঠকাঠিন্য দূর করে।' },
          { time: '09:00', title: 'সকালের নাস্তার পর পানি পান', amount: '৪০০ মিলি', duration: 10, notes: 'নাস্তা শেষের পর পর্যাপ্ত পানি পানে রক্ত সঞ্চালন সচল থাকে।' },
          { time: '11:30', title: 'দুপুরের খাবারের ৩০ মিনিট আগে পানি', amount: '৪০০ মিলি', duration: 10, notes: 'খাবারের পূর্বে পানি পান পরিপাক রসের ভারসাম্য ঠিক রাখে।' },
          { time: '14:00', title: 'দুপুরের খাবারের ১ ঘণ্টা পর পানি', amount: '৪০০ মিলি', duration: 10, notes: 'খাবার হজমের পর পানি শরীরকে আর্দ্র রাখে।' },
          { time: '16:30', title: 'আসর পরবর্তী বিকেলের পানি পান', amount: '৪০০ মিলি', duration: 10, notes: 'বিকেলের ক্লান্তি দূর করতে ও সতেজ থাকতে পানি পান।' },
          { time: '19:00', title: 'মাগরিব পরবর্তী সন্ধ্যার পানি পান', amount: '৪০০ মিলি', duration: 10, notes: 'সন্ধ্যার স্বাভাবিক আর্দ্রতা বজায় রাখার জন্য।' },
          { time: '21:30', title: 'রাতের খাবারের পর ও শোয়ার পূর্বে পানি', amount: '৫০০ মিলি', duration: 15, notes: 'শোয়ার পূর্বে পরিমিত কুসুম গরম পানি কার্ডিওভাসকুলার স্বাস্থ্যের জন্য উপকারী।' }
        ];
      } else if (targetLiters === 2.5) {
        slotsConfig = [
          { time: '06:00', title: 'সকালে খালি পেটে কুসুম গরম পানি পান', amount: '৪০০ মিলি', duration: 15, notes: 'খালি পেটে পানি পান শরীরকে চাঙা রাখে।' },
          { time: '09:00', title: 'সকালের নাস্তার পর পানি পান', amount: '৩৫০ মিলি', duration: 10, notes: 'নাস্তার পর পানি গ্রহণ।' },
          { time: '11:30', title: 'দুপুরের খাবারের পূর্বে পানি', amount: '৩৫০ মিলি', duration: 10, notes: 'খাবারের পূর্বে পানি পান।' },
          { time: '14:00', title: 'দুপুরের খাবারের পর পানি', amount: '৩৫০ মিলি', duration: 10, notes: 'খাবার হজমের পর পানি গ্রহণ।' },
          { time: '16:30', title: 'বিকেলের পানি পান', amount: '৩৫০ মিলি', duration: 10, notes: 'বিকেলের তরল গ্রহণের রুটিন।' },
          { time: '19:00', title: 'সন্ধ্যার পানি পান', amount: '৩০০ মিলি', duration: 10, notes: 'সন্ধ্যার পুষ্টি ও আর্দ্রতা।' },
          { time: '21:30', title: 'শোয়ার পূর্বে পানি পান', amount: '৪০০ মিলি', duration: 15, notes: 'রাতের সুন্নাত বিশ্রাম পূর্ব পানি।' }
        ];
      } else {
        slotsConfig = [
          { time: '06:30', title: 'সকালে খালি পেটে কুসুম গরম পানি পান', amount: '৩৫০ মিলি', duration: 15, notes: 'সকালে খালি পেটে কুসুম গরম পানি পান।' },
          { time: '09:30', title: 'সকালের নাস্তার পর পানি', amount: '৩০০ মিলি', duration: 10, notes: 'সকালের তরল গ্রহণ।' },
          { time: '12:00', title: 'দুপুরের খাবারের পূর্বে পানি', amount: '৩০০ মিলি', duration: 10, notes: 'দুপুরের খাবারের পূর্বে তরল।' },
          { time: '14:30', title: 'দুপুরের খাবারের পর পানি', amount: '৩০০ মিলি', duration: 10, notes: 'দুপুরের খাবারের পর পানি।' },
          { time: '17:30', title: 'বিকেলের পানি পান', amount: '৩০০ মিলি', duration: 10, notes: 'বিকেলের পানি।' },
          { time: '21:00', title: 'শোয়ার পূর্বে পানি পান', amount: '৪৫০ মিলি', duration: 15, notes: 'রাতে ঘুমানোর পূর্বে পানি।' }
        ];
      }

      const multiTasks: RoutineTask[] = slotsConfig.map((slot, idx) => ({
        id: `water-slot-${Date.now()}-${idx}`,
        profileId: understoodProfileId,
        title: slot.title,
        category: 'water',
        priority: idx === 0 ? 'critical' : 'important',
        isMustDo: true,
        isFavorite: idx === 0,
        scheduledTime: slot.time,
        durationMinutes: slot.duration,
        status: 'pending',
        amountOrDose: slot.amount,
        notes: slot.notes,
        alarmEnabled: true,
        alarmTone: 'bengali_voice',
        repeatDaily: true,
        voiceAnnouncementText: `বিসমিল্লাহ। এখন ${slot.amount} পানি পানের নির্ধারিত সময় হয়েছে। ডান হাতে বসে তিন নিঃশ্বাসে পান করুন।`
      }));

      const explanationBn = `💧 মাশাআল্লাহ! সারাদিনে মোট ${toBengaliDigits(targetLiters)} লিটার পানি পানের জন্য সকালে খালি পেটে কুসুম গরম পানি থেকে শুরু করে ঘুমানোর পূর্ব পর্যন্ত ${toBengaliDigits(multiTasks.length)}টি সুষম সময়ভিত্তিক শিডিউল স্লট প্রস্তুত করা হয়েছে। নিশ্চিত করলেই পুরো দিনের শিডিউলে যুক্ত হবে।`;

      return {
        success: true,
        understoodProfileId,
        actionType: 'schedule_multi',
        category: 'water',
        title: `সারাদিনে ${toBengaliDigits(targetLiters)} লিটার পানি পানের সুষম শিডিউল`,
        timeString: '06:00',
        amount: `${toBengaliDigits(targetLiters)} লিটার`,
        confidence: 0.98,
        explanationBn,
        multiTasks
      };
    }

    // ------------------------------------------------------------------
    // SPECIAL CASE 2: NIGHT SLEEP & DURATION TIME BLOCKING
    // ------------------------------------------------------------------
    const isSleepRequest =
      text.includes('ঘুম') || text.includes('ঘুমানো') || text.includes('sleep') ||
      (text.includes('বিশ্রাম') && (text.includes('রাত') || text.includes('ঘণ্টা')));

    if (isSleepRequest) {
      // Extract start time
      let startTime = '23:00';
      const timeMatchColon = rawText.match(/(\d{1,2})[:](\d{2})/);
      const bnTimeMatch = rawText.match(/([০-৯]{1,2})[:]([০-৯]{2})/);

      if (timeMatchColon) {
        startTime = `${String(timeMatchColon[1]).padStart(2, '0')}:${timeMatchColon[2]}`;
      } else if (bnTimeMatch) {
        const h = bnTimeMatch[1].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
        const m = bnTimeMatch[2].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
        startTime = `${String(h).padStart(2, '0')}:${m}`;
      } else {
        if (text.includes('রাত ১০:৩০') || text.includes('১০:৩০')) startTime = '22:30';
        else if (text.includes('রাত ১০') || text.includes('১০টা')) startTime = '22:00';
        else if (text.includes('রাত ১১:৩০') || text.includes('১১:৩০')) startTime = '23:30';
        else if (text.includes('রাত ১১') || text.includes('১১টা')) startTime = '23:00';
        else if (text.includes('রাত ১২') || text.includes('১২টা')) startTime = '00:00';
      }

      // Extract duration in hours
      let durationHours = 7;
      const hourMatch = rawText.match(/([০-৯0-9]+)\s*(ঘণ্টা|ঘন্টা|hours?)/i);
      if (hourMatch) {
        const engHour = hourMatch[1].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
        durationHours = parseInt(engHour, 10) || 7;
      } else if (text.includes('সকাল ৬') || text.includes('সকাল ০৬')) {
        durationHours = 7;
      } else if (text.includes('সকাল ৭') || text.includes('সকাল ০৭')) {
        durationHours = 8;
      }

      const durationMinutes = durationHours * 60;
      const [startH, startM] = startTime.split(':').map(Number);
      const endTotalMin = (startH * 60 + startM + durationMinutes) % 1440;
      const endH = String(Math.floor(endTotalMin / 60)).padStart(2, '0');
      const endM = String(endTotalMin % 60).padStart(2, '0');
      const endTimeStr = `${endH}:${endM}`;

      const explanationBn = `🌙 মাশাআল্লাহ! রাতের গভীর ঘুমের সময় বুক করা হয়েছে: শুরু রাত ${toBengaliDigits(startTime)}, ব্যাপ্তি ${toBengaliDigits(durationHours)} ঘণ্টা (সকাল ${toBengaliDigits(endTimeStr)} পর্যন্ত)। ২৪ ঘণ্টার টাইমলাইনে এই পুরো সময়টি অবিরাম ঘুমের জন্য বুকড থাকবে ইনশাআল্লাহ।`;

      return {
        success: true,
        understoodProfileId,
        actionType: 'schedule_sleep',
        category: 'personal_care',
        title: 'রাতের গভীর ঘুম ও সুন্নাত বিশ্রাম',
        timeString: startTime,
        durationMinutes,
        amount: `${toBengaliDigits(durationHours)} ঘণ্টা অবিরাম ঘুম`,
        confidence: 0.96,
        explanationBn
      };
    }

    // ------------------------------------------------------------------
    // SPECIAL CASE 3: THERAPY & EXERCISE MULTI-SESSION INTERVAL REASONING
    // e.g. "দিনে ৩-৪ বার থেরাপি ও ব্যায়াম চালু করতে চাই", "সকাল ১০টা থেকে ফার্স্ট থেরাপি স্টার্ট করলাম ঘুমানোর আগে পর্যন্ত বাকি ২-৩ বার সেট করো"
    // ------------------------------------------------------------------
    const isTherapyOrExerciseMulti =
      (text.includes('থেরাপি') || text.includes('ব্যায়াম') || text.includes('ব্যায়াম') || text.includes('ফিজিওথেরাপি') || text.includes('therapy') || text.includes('হাঁটা')) &&
      (text.includes('বার') || text.includes('সেশন') || text.includes('বাকি') || text.includes('ভাগ করে') || text.includes('ইন্টারভাল') || text.includes('স্টার্ট করলাম') || text.includes('চালু করতে'));

    if (isTherapyOrExerciseMulti) {
      // 1. Determine session count (default 3 or 4)
      let totalSessions = 3;
      if (text.includes('৪ বার') || text.includes('৪টা') || text.includes('৪ টি') || text.includes('চার বার') || text.includes('৪ সেশন')) {
        totalSessions = 4;
      } else if (text.includes('৫ বার') || text.includes('৫টা') || text.includes('পাঁচ বার')) {
        totalSessions = 5;
      } else if (text.includes('২ বার') || text.includes('২টা') || text.includes('দুই বার')) {
        totalSessions = 2;
      } else if (text.includes('৩-৪ বার') || text.includes('৩ থেকে ৪ বার')) {
        totalSessions = 3;
      } else if (text.includes('৩ বার') || text.includes('৩টা') || text.includes('তিন বার') || text.includes('৩ টি')) {
        totalSessions = 3;
      }

      // 2. Determine start time of 1st session
      let startH = 10;
      let startM = 0;
      const timeMatchColon = rawText.match(/(\d{1,2})[:](\d{2})/);
      const bnTimeMatch = rawText.match(/([০-৯]{1,2})[:]([০-৯]{2})/);

      if (timeMatchColon) {
        startH = parseInt(timeMatchColon[1], 10);
        startM = parseInt(timeMatchColon[2], 10);
      } else if (bnTimeMatch) {
        const hStr = bnTimeMatch[1].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
        const mStr = bnTimeMatch[2].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
        startH = parseInt(hStr, 10);
        startM = parseInt(mStr, 10);
      } else {
        if (text.includes('সকাল ৮') || text.includes('৮টা') || text.includes('৮:০০')) { startH = 8; startM = 0; }
        else if (text.includes('সকাল ৯') || text.includes('৯টা') || text.includes('৯:০০')) { startH = 9; startM = 0; }
        else if (text.includes('সকাল ১০') || text.includes('১০টা') || text.includes('১০:০০')) { startH = 10; startM = 0; }
        else if (text.includes('সকাল ১১') || text.includes('১১টা') || text.includes('১১:০০')) { startH = 11; startM = 0; }
        else if (text.includes('দুপুর ১২') || text.includes('১২টা') || text.includes('১২:০০')) { startH = 12; startM = 0; }
        else {
          const now = new Date();
          if (now.getHours() < 18) {
            startH = now.getHours();
            startM = Math.ceil(now.getMinutes() / 15) * 15;
            if (startM >= 60) {
              startH += 1;
              startM = 0;
            }
          } else {
            startH = 10;
            startM = 0;
          }
        }
      }

      const startMinutes = startH * 60 + startM;
      const startTimeStr = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;

      // 3. Determine bedtime or end window (default 21:30)
      let endMinutes = 21 * 60 + 30; // 21:30
      if (text.includes('রাত ১০:০০') || text.includes('১০:০০ টা') || text.includes('রাত ১০টা')) {
        endMinutes = 22 * 60;
      } else if (text.includes('রাত ১১টা') || text.includes('২৩:০০')) {
        endMinutes = 23 * 60;
      } else if (text.includes('রাত ৯:৩০') || text.includes('২১:৩০')) {
        endMinutes = 21 * 60 + 30;
      }

      // Ensure end is after start
      if (endMinutes <= startMinutes + 60) {
        endMinutes = Math.min(1430, startMinutes + (totalSessions * 180));
      }

      // 4. Calculate intervals between sessions
      const availableWindow = endMinutes - startMinutes;
      const intervalMinutes = totalSessions > 1 ? Math.floor(availableWindow / (totalSessions - 1)) : 180;
      const intervalHours = (intervalMinutes / 60).toFixed(1).replace('.0', '');

      const ordinalWords = ['১ম', '২য়', '৩য়', '৪র্থ', '৫ম'];
      const sessionDescriptions = [
        '১ম থেরাপি ও সকালের শারীরিক অঙ্গ সঞ্চালন',
        '২য় মধ্যাহ্ন থেরাপি ও ফিজিওথেরাপি ব্যায়াম',
        '৩য় সান্ধ্যকালীন থেরাপি ও রিল্যাক্সেশন',
        '৪র্থ ঘুমানোর পূর্বের হালকা স্ট্রেচিং ও থেরাপি',
        '৫ম অতিরিক্ত থেরাপি সেশন'
      ];

      const multiTasks: RoutineTask[] = [];
      for (let i = 0; i < totalSessions; i++) {
        const curMins = Math.min(1430, startMinutes + (i * intervalMinutes));
        const curH = String(Math.floor(curMins / 60)).padStart(2, '0');
        const curM = String(curMins % 60).padStart(2, '0');
        const timeStr = `${curH}:${curM}`;
        const ord = ordinalWords[i] || `${toBengaliDigits(i + 1)}ম`;
        const title = `${ord} থেরাপি ও ফিজিওথেরাপি সেশন`;

        multiTasks.push({
          id: `therapy-session-${Date.now()}-${i}`,
          profileId: understoodProfileId,
          title,
          category: 'exercise',
          priority: i === 0 ? 'critical' : 'important',
          isMustDo: true,
          isFavorite: i === 0,
          scheduledTime: timeStr,
          durationMinutes: 30,
          status: 'pending',
          amountOrDose: '৩০ মিনিট সেশন',
          notes: `${sessionDescriptions[i] || title}: সঠিক শ্বাস-প্রশ্বাস, মাংসপেশির নমনীয়তা ও সুন্নাত নিয়মে শারীরিক অঙ্গ সঞ্চালন।`,
          alarmEnabled: true,
          alarmTone: 'bengali_voice',
          repeatDaily: true,
          voiceAnnouncementText: `বিসমিল্লাহ। এখন ${ord} থেরাপি ও ব্যায়ামের নির্ধারিত সময় হয়েছে। সাবধানে প্রস্তুতি নিন।`
        });
      }

      const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0');
      const endM = String(endMinutes % 60).padStart(2, '0');
      const endTimeStr = `${endH}:${endM}`;

      const explanationBn = `🏋️ মাশাআল্লাহ! ${toBengaliDigits(startTimeStr)} টায় ১ম থেরাপি শুরু ধরে, ঘুমানোর পূর্ব (${toBengaliDigits(endTimeStr)}) পর্যন্ত প্রায় ${toBengaliDigits(intervalHours)} ঘণ্টা বিরতিতে মোট ${toBengaliDigits(totalSessions)}টি থেরাপি ও ব্যায়াম সেশনের যুক্তিযুক্ত ও সুষম শিডিউল প্রস্তুত করা হয়েছে। নিশ্চিত করলেই পুরো শিডিউল যুক্ত হবে।`;

      return {
        success: true,
        understoodProfileId,
        actionType: 'schedule_multi',
        category: 'exercise',
        title: `সারাদিনে ${toBengaliDigits(totalSessions)}টি থেরাপি ও ব্যায়াম শিডিউল`,
        timeString: startTimeStr,
        amount: `${toBengaliDigits(totalSessions)}টি সেশন (৩০ মিনিট করে)`,
        confidence: 0.98,
        explanationBn,
        multiTasks
      };
    }

    // ------------------------------------------------------------------
    // SPECIAL CASE 4: DELETE COMMAND (e.g. "মুছে ফেলো", "ডিলিট করো")
    // ------------------------------------------------------------------
    const isDeleteRequest =
      text.includes('মুছে') || text.includes('ডিলিট') || text.includes('বাদ দাও') || text.includes('বাতিল') || text.includes('সরিয়ে');

    if (isDeleteRequest) {
      const profileTasks = this.getTasks(understoodProfileId);
      let matchedTask = profileTasks.find(t => {
        const tTitle = t.title.toLowerCase();
        if (text.includes('পানি') && t.category === 'water') return true;
        if (text.includes('ওষুধ') && t.category === 'medicine') return true;
        if (text.includes('খাবার') && t.category === 'feeding') return true;
        if (text.includes('ঘুম') && tTitle.includes('ঘুম')) return true;
        return tTitle.split(' ').some(w => w.length > 2 && text.includes(w));
      });

      if (matchedTask) {
        return {
          success: true,
          understoodProfileId,
          actionType: 'delete',
          category: matchedTask.category,
          title: matchedTask.title,
          timeString: matchedTask.scheduledTime,
          targetTaskId: matchedTask.id,
          confidence: 0.95,
          explanationBn: `🗑️ "${matchedTask.title}" (${toBengaliDigits(matchedTask.scheduledTime)}) শিডিউল থেকে মুছে ফেলার জন্য সনাক্ত করা হয়েছে। নিশ্চিত করলেই তালিকা থেকে বাদ দেওয়া হবে।`
        };
      }
    }

    // ------------------------------------------------------------------
    // GENERAL PARSING: TIME, AMOUNT, ACTION, CATEGORY
    // ------------------------------------------------------------------
    let extractedTime = curTimeStr;
    const timeMatchColon = rawText.match(/(\d{1,2})[:](\d{2})/);
    const bnTimeMatch = rawText.match(/([০-৯]{1,2})[:]([০-৯]{2})/);

    if (timeMatchColon) {
      extractedTime = `${String(timeMatchColon[1]).padStart(2, '0')}:${timeMatchColon[2]}`;
    } else if (bnTimeMatch) {
      const h = bnTimeMatch[1].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
      const m = bnTimeMatch[2].split('').map(d => bengaliDigitsToEnglish[d] || d).join('');
      extractedTime = `${String(h).padStart(2, '0')}:${m}`;
    }

    // Amount Extraction
    let extractedAmount: string | undefined;
    const mlMatch = rawText.match(/([০-৯0-9]+)\s*(মিলি|ml|গ্লাস|বাটি|চামচ|ট্যাবলেট|ক্যাপসুল|লিটার|ঘণ্টা)/i);
    if (mlMatch) {
      extractedAmount = `${mlMatch[1]} ${mlMatch[2]}`;
    }
    const bpMatch = rawText.match(/(\d{2,3}\/\d{2,3})/);
    if (bpMatch) {
      extractedAmount = bpMatch[1];
    }

    // Action Type
    let actionType: 'completed' | 'started' | 'logged' | 'schedule_new' = 'completed';
    if (text.includes('শুরু') || text.includes('স্টার্ট')) {
      actionType = 'started';
    } else if (text.includes('করতে হবে') || text.includes('করবো') || text.includes('করাব') || text.includes('শিডিউল') || text.includes('যুক্ত করো')) {
      actionType = 'schedule_new';
    } else if (text.includes('শেষ') || text.includes('দেওয়া হলো') || text.includes('দিলাম') || text.includes('হয়েছে') || text.includes('খেয়েছে') || text.includes('পড়ানো হয়েছে')) {
      actionType = 'completed';
    }

    // Category & Normalized Title Detection
    let category: TaskCategory = 'custom';
    let title = 'রুটিন কার্যক্রম';

    if (text.includes('ওষুধ') || text.includes('মেডিসিন') || text.includes('গ্যাস') || text.includes('ট্যাবলেট') || text.includes('ক্যাপসুল')) {
      category = 'medicine';
      title = text.includes('গ্যাস') ? 'গ্যাসের ওষুধ সেবন' : 'নির্ধারিত ওষুধ গ্রহণ';
    } else if (text.includes('পানি') || text.includes('ওয়াটার')) {
      category = 'water';
      title = extractedAmount ? `পানি পান (${extractedAmount})` : 'পর্যাপ্ত পানি পান';
    } else if (text.includes('খাওয়া') || text.includes('ফিডিং') || text.includes('নাস্তা') || text.includes('ভাত') || text.includes('খিচুড়ি') || text.includes('পুষ্টি')) {
      category = 'feeding';
      title = text.includes('নাস্তা') ? 'সকালের নাস্তা গ্রহণ' : text.includes('ফিডিং') ? 'NG Feeding / তরল পুষ্টি' : 'পুষ্টিকর খাবার গ্রহণ';
    } else if (text.includes('গোসল') || text.includes('স্পঞ্জ') || text.includes('পরিচর্যা') || text.includes('ড্রেসিং')) {
      category = 'personal_care';
      title = text.includes('গোসল') ? 'গোসল করানো' : 'পরিচর্যা ও স্পঞ্জিং';
    } else if (text.includes('নামাজ') || text.includes('সালাত') || text.includes('ফজর') || text.includes('জোহর') || text.includes('আসর') || text.includes('মাগরিব') || text.includes('এশা')) {
      category = 'prayer';
      if (text.includes('ফজর')) title = 'ফজর সালাত';
      else if (text.includes('জোহর')) title = 'জোহর সালাত';
      else if (text.includes('আসর')) title = 'আসর সালাত';
      else if (text.includes('মাগরিব')) title = 'মাগরিব সালাত';
      else if (text.includes('এশা')) title = 'এশা সালাত';
      else title = 'ফরজ সালাত আদায়';
    } else if (text.includes('কুরআন') || text.includes('জিকির') || text.includes('আমল') || text.includes('দোয়া')) {
      category = 'amal';
      title = text.includes('কুরআন') ? 'কুরআন তিলাওয়াত' : 'মাসনুন জিকির ও আমল';
    } else if (text.includes('প্রেশার') || text.includes('সুগার') || text.includes('ডায়াবেটিস') || text.includes('টেম্পারেচার') || text.includes('জ্বর')) {
      category = 'health_check';
      title = text.includes('প্রেশার') ? 'রক্তচাপ (BP) পরিমাপ' : text.includes('সুগার') ? 'রক্তে সুগার পরীক্ষা' : 'শারীরিক তাপমাত্রা পরীক্ষা';
    }

    // Context-Aware Next Action Suggestion
    let nextActionDraft: NextActionSuggestion | undefined;
    if (actionType === 'completed') {
      if (category === 'medicine') {
        const nextTime = this.addMinutesToTime(extractedTime, 30);
        nextActionDraft = {
          id: `nlp-next-${Date.now()}`,
          title: 'খাওয়ানো ও নাস্তা',
          category: 'feeding',
          suggestedTime: nextTime,
          reasonBn: 'ওষুধ সেবনের ৩০ মিনিট পর পুষ্টিকর খাবার বা ফিডিং দেওয়া নিয়ম।',
          dependencyIntervalMinutes: 30,
          alarmProposalText: 'ইনশাআল্লাহ্ এখন পুষ্টিকর খাবার গ্রহণের সময় হয়েছে।',
          amount: '১ বাটি পুষ্টিকর খাবার',
          profileId: understoodProfileId,
          confirmed: false,
          createdAt: Date.now()
        };
      } else if (category === 'feeding') {
        const nextTime = this.addMinutesToTime(extractedTime, 120);
        nextActionDraft = {
          id: `nlp-next-${Date.now()}`,
          title: 'পরবর্তী তরল পানি পান',
          category: 'water',
          suggestedTime: nextTime,
          reasonBn: 'খাবার গ্রহণের প্রায় ২ ঘণ্টা পর পর্যাপ্ত পানি বা পরবর্তী ফিডিং দেওয়া প্রয়োজন।',
          dependencyIntervalMinutes: 120,
          alarmProposalText: 'ইনশাআল্লাহ্ এখন পানি পান করানোর সময় হয়েছে।',
          amount: '২০০ মিলি',
          profileId: understoodProfileId,
          confirmed: false,
          createdAt: Date.now()
        };
      }
    }

    const explanationBn = `শনাক্তকৃত কাজ: ${title} (${actionType === 'completed' ? 'সম্পন্ন' : actionType === 'started' ? 'শুরু' : 'নতুন শিডিউল'}), সময়: ${toBengaliDigits(extractedTime)}${extractedAmount ? `, পরিমাণ: ${extractedAmount}` : ''}`;

    return {
      success: true,
      understoodProfileId,
      actionType,
      category,
      title,
      timeString: extractedTime,
      amount: extractedAmount,
      confidence: 0.94,
      explanationBn,
      nextActionDraft,
      targetDate
    };
  }

  // Execute the parsed input
  public executeParsedInput(parsed: ParsedCommandResult, customDate?: string): {
    message: string;
    log?: ActivityLog;
    suggestedNextAction?: NextActionSuggestion;
  } {
    const execDate = customDate || parsed.targetDate || this.selectedDate || getLocalTodayString();

    // 1. Multi-Task Batch Schedule (e.g. 3L Water or Multi-session Therapy)
    if (parsed.actionType === 'schedule_multi' && parsed.multiTasks && parsed.multiTasks.length > 0) {
      // Remove previous uncompleted tasks of this category to prevent duplicate stacking
      const targetCategory = parsed.category;
      this.tasks = this.tasks.filter(
        t => !(t.profileId === parsed.understoodProfileId && t.category === targetCategory && t.status !== 'completed')
      );

      for (const t of parsed.multiTasks) {
        this.addTask(t);
      }
      this.cleanDuplicateTasks();
      return {
        message: `আলহামদুলিল্লাহ! সারাদিনে মোট ${toBengaliDigits(parsed.multiTasks.length)}টি সুষম সময়ভিত্তিক শিডিউল সফলভাবে সেট করা হয়েছে।`
      };
    }

    // 2. Sleep Schedule Booking
    if (parsed.actionType === 'schedule_sleep') {
      const sleepTask: RoutineTask = {
        id: `task-sleep-${Date.now()}`,
        profileId: parsed.understoodProfileId,
        title: parsed.title,
        category: 'personal_care',
        priority: 'critical',
        isMustDo: true,
        isFavorite: true,
        scheduledTime: parsed.timeString,
        durationMinutes: parsed.durationMinutes || 420,
        status: 'pending',
        amountOrDose: parsed.amount || '৭ ঘণ্টা অবিরাম ঘুম',
        notes: 'অবিরাম গভীর ঘুম রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে এবং শরীরের কোষ পুনরুদ্ধার করে।',
        alarmEnabled: true,
        alarmTone: 'bengali_voice',
        repeatDaily: true,
        voiceAnnouncementText: 'বিসমিল্লাহ। এখন রাতের সুন্নাত ঘুম ও গভীর বিশ্রামের সময় হয়েছে। ঘুমানোর সুন্নাত দোয়া পাঠ করুন।'
      };
      this.addTask(sleepTask);
      const durHours = Math.round((sleepTask.durationMinutes || 420) / 60);
      return {
        message: `আলহামদুলিল্লাহ! রাতের গভীর ঘুমের সময় (${toBengaliDigits(sleepTask.scheduledTime)} থেকে ${toBengaliDigits(durHours)} ঘণ্টা) ২৪ ঘণ্টার টাইমলাইনে সফলভাবে বুকড করা হয়েছে।`
      };
    }

    // 3. Delete Task Command
    if (parsed.actionType === 'delete') {
      if (parsed.targetTaskId) {
        this.deleteTask(parsed.targetTaskId);
        return {
          message: `আলহামদুলিল্লাহ! "${parsed.title}" শিডিউল থেকে সফলভাবে মুছে ফেলা হয়েছে।`
        };
      }
    }

    // 4. Single Task Completed
    const profileTasks = this.getTasks(parsed.understoodProfileId, execDate);
    let matchedTask = profileTasks.find(
      t => t.category === parsed.category && t.status !== 'completed'
    );

    if (parsed.actionType === 'completed') {
      if (matchedTask) {
        const res = this.completeTask(matchedTask.id, undefined, parsed.amount, execDate);
        return {
          message: `আলহামদুলিল্লাহ! "${matchedTask.title}" সম্পন্ন হিসেবে লগ করা হয়েছে।`,
          log: res.log,
          suggestedNextAction: res.nextSuggestion || parsed.nextActionDraft
        };
      } else {
        const log: ActivityLog = {
          id: `log-${Date.now()}`,
          profileId: parsed.understoodProfileId,
          timestamp: Date.now(),
          date: execDate,
          timeString: parsed.timeString,
          action: 'completed',
          title: `${parsed.title} সম্পন্ন হয়েছে`,
          category: parsed.category,
          amount: parsed.amount,
          islamicQuote: 'আলহামদুলিল্লাহ। কাজটি সুন্দরভাবে সম্পন্ন হয়েছে।'
        };
        this.addLog(log);

        return {
          message: `আলহামদুলিল্লাহ! "${parsed.title}" সম্পন্ন হিসেবে টাইমলাইনে যুক্ত হয়েছে।`,
          log,
          suggestedNextAction: parsed.nextActionDraft
        };
      }
    } else if (parsed.actionType === 'started') {
      if (matchedTask) {
        const res = this.startTask(matchedTask.id, execDate);
        return {
          message: `বিসমিল্লাহ! "${matchedTask.title}" শুরু করা হয়েছে।`,
          log: res.log
        };
      } else {
        const log: ActivityLog = {
          id: `log-${Date.now()}`,
          profileId: parsed.understoodProfileId,
          timestamp: Date.now(),
          date: execDate,
          timeString: parsed.timeString,
          action: 'started',
          title: `${parsed.title} শুরু করা হয়েছে`,
          category: parsed.category,
          amount: parsed.amount,
          islamicQuote: 'বিসমিল্লাহ। ইনশাআল্লাহ্ কাজটি সুষ্ঠুভাবে সম্পন্ন হবে।'
        };
        this.addLog(log);
        return {
          message: `বিসমিল্লাহ! "${parsed.title}" শুরু হিসেবে সংরক্ষিত হয়েছে।`,
          log
        };
      }
    } else {
      // Schedule New Single Task
      const newTask: RoutineTask = {
        id: `task-${Date.now()}`,
        profileId: parsed.understoodProfileId,
        title: parsed.title,
        category: parsed.category,
        priority: 'important',
        isMustDo: true,
        isFavorite: false,
        scheduledTime: parsed.timeString,
        status: 'pending',
        amountOrDose: parsed.amount,
        alarmEnabled: true,
        alarmTone: 'bengali_voice',
        repeatDaily: false
      };
      this.addTask(newTask);
      return {
        message: `ইনশাআল্লাহ্! "${newTask.title}" আজকের শিডিউলে ${toBengaliDigits(newTask.scheduledTime)}-এ যুক্ত করা হয়েছে।`
      };
    }
  }

  // ----------------------------------------------------
  // AI CONTEXT BRAIN ("WHAT HAPPENED → WHAT DOES IT MEAN → WHAT NEXT?")
  // ----------------------------------------------------
  public analyzeContextBrain(profileId?: CareProfileId): AiContextBrainState {
    const targetProfile = profileId || this.activeProfileId;
    const tasks = this.getTasks(targetProfile);
    const logs = this.logs.filter(l => l.profileId === targetProfile);

    const lastActivity = logs[0];

    const now = new Date();
    const curHour = now.getHours();
    const curMin = now.getMinutes();
    const currentTotalMin = curHour * 60 + curMin;

    // Find current task and next pending task
    let currentTask: RoutineTask | undefined;
    let nextTask: RoutineTask | undefined;

    const pendingTasks = tasks
      .filter(t => t.status === 'pending' || t.status === 'in_progress')
      .sort((a, b) => {
        const [ah, am] = a.scheduledTime.split(':').map(Number);
        const [bh, bm] = b.scheduledTime.split(':').map(Number);
        return ah * 60 + am - (bh * 60 + bm);
      });

    for (const t of pendingTasks) {
      const [th, tm] = t.scheduledTime.split(':').map(Number);
      const taskTotalMin = th * 60 + tm;

      if (t.status === 'in_progress') {
        currentTask = t;
      } else if (!currentTask && Math.abs(taskTotalMin - currentTotalMin) <= 30) {
        currentTask = t;
      } else if (taskTotalMin > currentTotalMin && !nextTask) {
        nextTask = t;
      }
    }

    if (!nextTask && pendingTasks.length > 0) {
      nextTask = pendingTasks[0];
    }

    // Must-do count & Progress
    const mustDoTasks = tasks.filter(t => t.isMustDo);
    const completedMustDo = mustDoTasks.filter(t => t.status === 'completed').length;
    const pendingMustDoCount = mustDoTasks.length - completedMustDo;
    const todayProgressPercent = mustDoTasks.length > 0
      ? Math.round((completedMustDo / mustDoTasks.length) * 100)
      : 100;

    // AI Context Message
    let aiMessage = 'আলহামদুলিল্লাহ। আজকের রুটিন চমৎকারভাবে চলছে। ইনশাআল্লাহ্ প্রতিটি কাজ সময়মতো আদায় করি।';
    if (pendingMustDoCount === 0 && mustDoTasks.length > 0) {
      aiMessage = 'মাশাআল্লাহ! আজকের সমস্ত গুরুত্বপূর্ণ (Must-Do) কাজ সফলভাবে সম্পন্ন হয়েছে। আল্লাহ আপনার চেষ্টায় বরকত দিন।';
    } else if (lastActivity) {
      aiMessage = `আলহামদুলিল্লাহ। সর্বশেষ "${lastActivity.title}" সম্পন্ন হয়েছে (${toBengaliDigits(lastActivity.timeString)})। ইনশাআল্লাহ্ পরবর্তী কাজের রিমাইন্ডার প্রস্তুত আছে।`;
    }

    return {
      activeProfileId: targetProfile,
      lastActivity,
      currentTask,
      nextTask,
      pendingMustDoCount,
      completedCount: tasks.filter(t => t.status === 'completed').length,
      todayProgressPercent,
      aiMessage,
      lastAnalysisTimestamp: Date.now()
    };
  }

  // ----------------------------------------------------
  // DYNAMIC RECOVERY PLANNER
  // ----------------------------------------------------
  public generateRecoveryPlan(profileId?: CareProfileId): {
    delayedTasks: RoutineTask[];
    suggestedShifts: { task: RoutineTask; oldTime: string; newTime: string; reason: string }[];
  } {
    const target = profileId || this.activeProfileId;
    const tasks = this.getTasks(target);
    const now = new Date();
    const curTotalMin = now.getHours() * 60 + now.getMinutes();

    const pending = tasks.filter(t => t.status === 'pending');
    const delayedTasks: RoutineTask[] = [];
    const suggestedShifts: { task: RoutineTask; oldTime: string; newTime: string; reason: string }[] = [];

    let rollingMin = curTotalMin + 15; // Start 15 minutes from now

    for (const t of pending) {
      const [th, tm] = t.scheduledTime.split(':').map(Number);
      const tMin = th * 60 + tm;

      if (tMin < curTotalMin) {
        delayedTasks.push(t);
        const newTimeStr = `${String(Math.floor(rollingMin / 60)).padStart(2, '0')}:${String(rollingMin % 60).padStart(2, '0')}`;
        suggestedShifts.push({
          task: t,
          oldTime: t.scheduledTime,
          newTime: newTimeStr,
          reason: 'বাস্তব জীবনের অনাকাঙ্ক্ষিত বিলম্বের কারণে সময় পুনর্বিন্যাস।'
        });
        rollingMin += 45; // Spread by 45 mins
      }
    }

    return { delayedTasks, suggestedShifts };
  }

  public applyRecoveryPlan(shifts: { task: RoutineTask; newTime: string }[]) {
    for (const shift of shifts) {
      shift.task.scheduledTime = shift.newTime;
      shift.task.status = 'pending';
      this.addTask(shift.task);
    }
    this.saveData();
  }

  // ----------------------------------------------------
  // "এখন কী করবো?" (NOW WHAT?) QUERY ENGINE
  // ----------------------------------------------------
  public getNowWhatCategorizedTasks(profileId?: CareProfileId): {
    rightNow: RoutineTask[];
    soon: RoutineTask[];
    later: RoutineTask[];
    aiGuidanceBn: string;
  } {
    const target = profileId || this.activeProfileId;
    const tasks = this.getTasks(target).filter(t => t.status !== 'completed');

    const now = new Date();
    const curTotalMin = now.getHours() * 60 + now.getMinutes();

    const rightNow: RoutineTask[] = [];
    const soon: RoutineTask[] = [];
    const later: RoutineTask[] = [];

    for (const t of tasks) {
      const [th, tm] = t.scheduledTime.split(':').map(Number);
      const tMin = th * 60 + tm;
      const diff = tMin - curTotalMin;

      if (t.status === 'in_progress' || diff <= 15) {
        rightNow.push(t);
      } else if (diff <= 120) {
        soon.push(t);
      } else {
        later.push(t);
      }
    }

    let aiGuidanceBn = 'বিসমিল্লাহ। এখন আপনার জন্য সবচেয়ে গুরুত্বপূর্ণ কাজটি নির্বাচন করে শুরু করতে পারেন।';
    if (rightNow.length > 0) {
      aiGuidanceBn = `বিসমিল্লাহ। এখনই করণীয় তালিকায় ${toBengaliDigits(rightNow.length)}টি কাজ অপেক্ষা করছে। প্রথমে "${rightNow[0].title}" সম্পন্ন করার অনুরোধ করা হচ্ছে।`;
    }

    return { rightNow, soon, later, aiGuidanceBn };
  }

  // Activity Logs
  public getLogs(profileId?: CareProfileId, targetDate?: string): ActivityLog[] {
    const target = profileId || this.activeProfileId;
    const list = this.logs.filter(l => l.profileId === target);
    if (!targetDate) return list;
    return list.filter(l => {
      const lDate = l.date || (l.timestamp ? new Date(l.timestamp).toISOString().split('T')[0] : '');
      return lDate === targetDate;
    });
  }

  public getAllLogs(profileId?: CareProfileId): ActivityLog[] {
    const target = profileId || this.activeProfileId;
    return this.logs.filter(l => l.profileId === target);
  }

  // Daily Planner Config
  public getPlannerConfig(): DailyPlannerConfig {
    return { ...this.plannerConfig };
  }

  public updatePlannerConfig(config: Partial<DailyPlannerConfig>) {
    this.plannerConfig = { ...this.plannerConfig, ...config };
    this.saveData();
  }
}

export const careRoutineService = CareRoutineService.getInstance();
