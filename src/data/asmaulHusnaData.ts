export type EvidenceLevel = 'sahih_hadith' | 'quran_proof' | 'hasan_hadith' | 'personal_habit_target';

export interface AsmaulHusnaItem {
  id: number;
  arabic: string;
  transliterationBn: string;
  meaningBn: string;
  virtueBn: string;
  categoryBn: string; // 'রহমত ও ক্ষমা', 'রিজিক ও সাহায্য', 'শক্তি ও আধিপত্য', 'জ্ঞান ও হেদায়েত'
  recommendedCount: number; // e.g. 100 or 33
  audioUrl?: string;
  
  // Enhanced Fields for Amal & Mastery System
  evidenceLevel: EvidenceLevel;
  quranRefBn?: string;
  hadithRefBn?: string;
  hadithVirtueBn?: string;
  testedVirtueBn?: string;
  testedOutcomeBn?: string;
  contextExplanationBn?: string;
  detailedAmalRuleBn?: string;
  amalConditionsBn?: string[];
  deeperMeaningBn?: string;
  duaWithThisNameBn?: string;
  characterLessonBn?: string;
  lifeApplicationTaskBn?: string;
  lifeSituationsBn?: string[];
  timeSlot?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'bedtime' | 'any';
}

import { FULL_99_NAMES_DATA } from './all99AsmaData';

export const ASMAUL_HUSNA_LIST: AsmaulHusnaItem[] = FULL_99_NAMES_DATA;
