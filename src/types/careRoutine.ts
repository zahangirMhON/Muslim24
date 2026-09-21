// 24/7 AI Care, Life, Amal & Routine Operating System Types

export type CareProfileId = 'ammu' | 'self' | 'baba' | 'patient' | string;

export type AutomationLevel = 'manual' | 'ai_suggest' | 'confirm_first' | 'smart_auto';

export interface CareProfile {
  id: CareProfileId;
  nameBn: string;
  relationBn: string;
  avatar: string;
  automationLevel: AutomationLevel;
  notes?: string;
  isDefault?: boolean;
}

export type TaskCategory =
  | 'medicine'       // ওষুধ
  | 'water'          // পানি
  | 'feeding'        // খাবার / NG Feeding
  | 'personal_care'  // গোসল / পরিচর্যা
  | 'prayer'         // ৫ ওয়াক্ত নামাজ
  | 'amal'           // কুরআন, জিকির ও আমল
  | 'health_check'   // প্রেশার, সুগার, পালস
  | 'exercise'       // থেরাপি / ব্যায়াম
  | 'custom';        // অন্যান্য

export type TaskPriority = 'critical' | 'important' | 'normal';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'delayed' | 'missed';

export interface DependencyRule {
  dependsOnCategory?: TaskCategory;
  dependsOnTaskId?: string;
  intervalMinutes: number; // e.g. 30 minutes after medicine -> food
  autoScheduleNext: boolean;
  nextTaskTitle: string;
  nextCategory: TaskCategory;
  nextAmount?: string;
}

export type AlarmToneType = 'bengali_voice' | 'adhan' | 'quran' | 'hisnul_dua' | 'beep' | 'folder_audio';

export interface RoutineTask {
  id: string;
  profileId: CareProfileId;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  isMustDo: boolean;
  isFavorite: boolean;
  scheduledTime: string;          // "HH:mm" e.g. "07:00"
  actualStartTime?: string;       // "HH:mm"
  actualCompletedTime?: string;   // "HH:mm"
  durationMinutes?: number;
  status: TaskStatus;
  amountOrDose?: string;          // e.g. "১টি ক্যাপসুল", "১৫০ মিলি", "১ বাটি"
  notes?: string;
  alarmEnabled: boolean;
  alarmTone: AlarmToneType;
  alarmTrackTitle?: string;
  alarmTrackUrl?: string;
  alarmFolderId?: string;         // Link to 24/7 radio folder
  dependencyRule?: DependencyRule;
  repeatDaily: boolean;
  voiceAnnouncementText?: string; // Custom Bengali voice text
}

export interface ActivityLog {
  id: string;
  taskId?: string;
  profileId: CareProfileId;
  timestamp: number;
  date?: string;                  // "YYYY-MM-DD"
  timeString: string;             // "HH:mm"
  action: 'completed' | 'started' | 'logged' | 'rescheduled' | 'snoozed';
  title: string;
  category: TaskCategory;
  amount?: string;
  islamicQuote: string;
  notes?: string;
}

export interface DailyTaskExecution {
  status: TaskStatus;
  actualCompletedTime?: string;   // "HH:mm"
  actualStartTime?: string;       // "HH:mm"
  durationMinutes?: number;
  amount?: string;
  notes?: string;
  completedAtTimestamp?: number;
}

// date (YYYY-MM-DD) -> taskId -> DailyTaskExecution
export type TaskHistoryMap = Record<string, Record<string, DailyTaskExecution>>;

export interface NextActionSuggestion {
  id: string;
  title: string;
  category: TaskCategory;
  suggestedTime: string;
  reasonBn: string;
  dependencyIntervalMinutes?: number;
  alarmProposalText?: string;
  amount?: string;
  profileId: CareProfileId;
  confirmed: boolean;
  createdAt: number;
}

export interface AiContextBrainState {
  activeProfileId: CareProfileId;
  lastActivity?: ActivityLog;
  currentTask?: RoutineTask;
  nextTask?: RoutineTask;
  suggestedNextAction?: NextActionSuggestion;
  pendingMustDoCount: number;
  completedCount: number;
  todayProgressPercent: number;
  aiMessage: string;
  lastAnalysisTimestamp: number;
}

export interface SmartAlarmItem {
  id: string;
  taskId?: string;
  title: string;
  timeString: string;             // "HH:mm"
  profileId: CareProfileId;
  enabled: boolean;
  toneType: AlarmToneType;
  folderId?: string;
  folderTitleBn?: string;
  trackUrl?: string;
  trackTitle?: string;
  voiceText?: string;
  isRinging?: boolean;
  snoozedUntil?: number;
}

export interface DailyPlannerConfig {
  date: string;                   // YYYY-MM-DD
  selectedMustDoIds: string[];
  favoriteIds: string[];
  isConfirmed: boolean;
}

export interface ParsedCommandResult {
  success: boolean;
  understoodProfileId: CareProfileId;
  actionType: 'completed' | 'started' | 'logged' | 'schedule_new' | 'schedule_multi' | 'schedule_sleep' | 'delete';
  category: TaskCategory;
  title: string;
  timeString: string;
  durationMinutes?: number;
  amount?: string;
  confidence: number;
  explanationBn: string;
  multiTasks?: RoutineTask[];
  targetTaskId?: string;
  targetDate?: string;
  nextActionDraft?: NextActionSuggestion;
}
