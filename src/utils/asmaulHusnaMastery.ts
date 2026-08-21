import { ASMAUL_HUSNA_LIST, AsmaulHusnaItem } from '../data/asmaulHusnaData';

export interface UserAsmaProgress {
  asmaId: number;
  learned: boolean;      // 25% - Read basic info
  understood: boolean;   // 25% - Understood proof & deep meaning / listened audio
  practiced: boolean;    // 25% - Completed Tasbih / Dhikr target
  applied: boolean;      // 25% - Practical action & reflection done
  tasbihCountToday: number;
  lastPracticedDate?: string; // YYYY-MM-DD
  lastReviewedDate?: string;  // YYYY-MM-DD
  reviewStage: number;        // Spaced repetition stage (0, 1, 2, 3, 4)
  reflectionNotes?: string;
}

export interface AsmaMasteryState {
  progressMap: Record<number, UserAsmaProgress>;
  amalStreak: number;
  bestAmalStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  graceDaysAvailable: number;
  completedChallengeDays: Record<string, number[]>; // challengeId -> array of completed day numbers
}

const STORAGE_KEY = 'asmaul_husna_mastery_v2';

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function loadMasteryState(): AsmaMasteryState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: AsmaMasteryState = JSON.parse(saved);
      return checkAndAutoUpdateStreak(parsed);
    }
  } catch (e) {
    console.error('Error loading mastery state:', e);
  }

  return {
    progressMap: {},
    amalStreak: 1,
    bestAmalStreak: 1,
    lastActiveDate: getTodayDateString(),
    graceDaysAvailable: 1,
    completedChallengeDays: {}
  };
}

export function saveMasteryState(state: AsmaMasteryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving mastery state:', e);
  }
}

// Auto streak check with gentle Grace Day protection
function checkAndAutoUpdateStreak(state: AsmaMasteryState): AsmaMasteryState {
  const today = getTodayDateString();
  const lastActive = state.lastActiveDate;

  if (lastActive === today) {
    return state; // Already updated today
  }

  const todayTime = new Date(today).getTime();
  const lastTime = new Date(lastActive).getTime();
  const diffDays = Math.round((todayTime - lastTime) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return state;
  } else if (diffDays === 2 && state.graceDaysAvailable > 0) {
    // Used 1 grace day automatically!
    return {
      ...state,
      graceDaysAvailable: state.graceDaysAvailable - 1,
      lastActiveDate: today
    };
  } else if (diffDays > 1) {
    // Missed days - Reset streak gently without harsh negative warnings
    return {
      ...state,
      amalStreak: 1,
      graceDaysAvailable: 1, // Replenish Grace Day
      lastActiveDate: today
    };
  }

  return state;
}

// Calculate individual name mastery percentage (0 to 100)
export function getSingleNameMasteryPercent(progress?: UserAsmaProgress): number {
  if (!progress) return 0;
  let score = 0;
  if (progress.learned) score += 25;
  if (progress.understood) score += 25;
  if (progress.practiced) score += 25;
  if (progress.applied) score += 25;
  return score;
}

// Calculate overall 99 Names Mastery Percentage
export function getOverallMasteryPercent(progressMap: Record<number, UserAsmaProgress>): number {
  let totalScore = 0;
  ASMAUL_HUSNA_LIST.forEach(item => {
    totalScore += getSingleNameMasteryPercent(progressMap[item.id]);
  });
  return Math.round(totalScore / 99); // max 100%
}

// Count how many names are fully Mastered (100%)
export function getMasteredNamesCount(progressMap: Record<number, UserAsmaProgress>): number {
  return ASMAUL_HUSNA_LIST.filter(item => getSingleNameMasteryPercent(progressMap[item.id]) === 100).length;
}

// Count how many names are practicing (>0%)
export function getPracticingNamesCount(progressMap: Record<number, UserAsmaProgress>): number {
  return ASMAUL_HUSNA_LIST.filter(item => {
    const p = getSingleNameMasteryPercent(progressMap[item.id]);
    return p > 0 && p < 100;
  }).length;
}

// "Never Forget 99" - Spaced Repetition Review Queue Generator
export function getSpacedReviewQueue(progressMap: Record<number, UserAsmaProgress>): AsmaulHusnaItem[] {
  const today = getTodayDateString();
  
  return ASMAUL_HUSNA_LIST.filter(item => {
    const prog = progressMap[item.id];
    if (!prog || !prog.learned) return false;

    // If never reviewed, recommend for review
    if (!prog.lastReviewedDate) return true;

    const lastReviewedTime = new Date(prog.lastReviewedDate).getTime();
    const todayTime = new Date(today).getTime();
    const daysSince = Math.round((todayTime - lastReviewedTime) / (1000 * 60 * 60 * 24));

    // Intervals based on stage: Stage 0 -> 1 day, Stage 1 -> 3 days, Stage 2 -> 7 days, Stage 3 -> 14 days, Stage 4 -> 30 days
    const intervals = [1, 3, 7, 14, 30];
    const targetInterval = intervals[prog.reviewStage] || 30;

    return daysSince >= targetInterval;
  }).slice(0, 5); // Return max 5 items in review queue
}

// Suggest Asmaul Husna based on current prayer time / slot
export function getRecommendedAsmaByTimeSlot(
  currentSlot: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'bedtime'
): AsmaulHusnaItem {
  const matching = ASMAUL_HUSNA_LIST.filter(i => i.timeSlot === currentSlot);
  if (matching.length > 0) {
    const randomIndex = Math.floor(Math.random() * matching.length);
    return matching[randomIndex];
  }
  return ASMAUL_HUSNA_LIST[0]; // Fallback Ar-Rahman
}
