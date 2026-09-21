// Unified Pre-loading and Data Cache Service for Islamic Amal Cards
// Ensures instant rendering, zero black screen, and reliable metadata access across all components

import { ASMAUL_HUSNA_LIST, AsmaulHusnaItem, EvidenceLevel } from '../data/asmaulHusnaData';
import { DEFAULT_DAILY_AMAL_ROSTER, AmalRecord } from './amalTrackerService';
import { getTodaySpecialAmalSuggestions, SpecialAmalItem } from '../utils/specialDaySuggestions';

export interface UnifiedAmalCardData {
  id: string | number;
  type: 'asmaul_husna' | 'daily_amal' | 'special_day' | 'dhikr_dua' | 'custom';
  titleBn: string;
  titleEn?: string;
  arabicText: string;
  transliterationBn: string;
  meaningBn: string;
  virtueBn: string;
  categoryBn: string;
  categoryIcon?: string;
  recommendedCount: number;
  recommendedTimeBn: string;
  timeSlot?: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'bedtime' | 'any';
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
  audioUrl?: string;
  asmaId?: number;
  isCompleted?: boolean;
}

// In-memory instant lookup cache
const asmaCacheById: Map<number, AsmaulHusnaItem> = new Map();
const unifiedCardCache: Map<string, UnifiedAmalCardData> = new Map();
let isPreloaded = false;

/**
 * Preloads and indexes all 99 names of Allah and daily amals into memory
 */
export function preloadAllAmalData(): void {
  if (isPreloaded && asmaCacheById.size >= 99) return;

  // 1. Preload 99 Names of Allah
  ASMAUL_HUSNA_LIST.forEach((item) => {
    asmaCacheById.set(item.id, item);

    const unifiedItem: UnifiedAmalCardData = {
      id: `asma-${item.id}`,
      asmaId: item.id,
      type: 'asmaul_husna',
      titleBn: item.transliterationBn,
      titleEn: `Name #${item.id}`,
      arabicText: item.arabic,
      transliterationBn: item.transliterationBn,
      meaningBn: item.meaningBn,
      virtueBn: item.virtueBn || item.deeperMeaningBn || 'আল্লাহর পবিত্র নামের জিকিরে অন্তরে প্রশান্তি লাভ হয়।',
      categoryBn: item.categoryBn || 'আল্লাহর পবিত্র নাম',
      categoryIcon: '✨',
      recommendedCount: item.recommendedCount || 100,
      recommendedTimeBn: item.timeSlot === 'fajr' ? 'ফজর সালাতের পর ও সকালে' :
                         item.timeSlot === 'maghrib' ? 'মাগরিবের পর ও সন্ধ্যায়' :
                         item.timeSlot === 'bedtime' ? 'ঘুমানোর পূর্বে' :
                         item.timeSlot === 'dhuhr' ? 'জোহরের ওয়াক্তে' :
                         item.timeSlot === 'asr' ? 'আসর সালাতের পর' : 'প্রতি ফরয সালাত শেষে ও যেকোনো উত্তম সময়ে',
      timeSlot: item.timeSlot || 'any',
      evidenceLevel: item.evidenceLevel || 'quran_proof',
      quranRefBn: item.quranRefBn || 'সূরা আল-আ\'রাফ: ১৮০, সূরা আল-হাশর: ২২-২৪',
      hadithRefBn: item.hadithRefBn || 'সহিহ বুখারী ২৭৩৬, সহিহ মুসলিম ২৬৭৭ (আল্লাহর ৯৯টি নামের সার্বিক ফজিলত)',
      hadithVirtueBn: item.hadithVirtueBn || item.virtueBn,
      testedVirtueBn: item.testedVirtueBn || item.virtueBn,
      testedOutcomeBn: item.testedOutcomeBn || 'অন্তরে পরম প্রশান্তি, দ্বীনি দৃঢ়তা ও জীবনে বরকত লাভ।',
      contextExplanationBn: item.contextExplanationBn || item.deeperMeaningBn,
      detailedAmalRuleBn: item.detailedAmalRuleBn || `প্রতিদিন সালাতের পর ওযূ অবস্থায় ১০০ বার পাঠ করুন।`,
      amalConditionsBn: item.amalConditionsBn || ['হালাল উপার্জন বজায় রাখা', 'একাগ্রচিত্তে জিকির করা', 'ধৈর্য ও তাওয়াক্কুল রাখা'],
      deeperMeaningBn: item.deeperMeaningBn || `আল্লাহ তাআলার পবিত্র বৈশিষ্ট্য '${item.transliterationBn}' স্মরণের মাধ্যমে অন্তরে তাঁর মহত্ত্ব প্রতিষ্ঠিত হয়।`,
      duaWithThisNameBn: item.duaWithThisNameBn || `يَا ${item.arabic} اغْفِرْ لِي وَارْحَمْنِي (হে ${item.transliterationBn}! আমাকে ক্ষমা করুন ও দয়া করুন)`,
      characterLessonBn: item.characterLessonBn || `${item.transliterationBn} নামের শিক্ষা ধারণ করে নিজের চরিত্রকে সুন্দর ও বিনয়ী রাখা।`,
      lifeApplicationTaskBn: item.lifeApplicationTaskBn || `আজ অন্তত একবার এই পবিত্র নাম স্মরণ করে আল্লাহর কাছে আন্তরিক দোয়া করুন।`,
      lifeSituationsBn: item.lifeSituationsBn || ['ঈমানী শক্তি বৃদ্ধি', 'পারিবারিক শান্তি', 'বিপদাপদ থেকে মুক্তি'],
      audioUrl: item.audioUrl || `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${item.id}.mp3`
    };

    unifiedCardCache.set(`asma-${item.id}`, unifiedItem);
    unifiedCardCache.set(String(item.id), unifiedItem);
  });

  // 2. Preload Core Daily Amal Roster
  DEFAULT_DAILY_AMAL_ROSTER.forEach((amal) => {
    const unifiedDaily: UnifiedAmalCardData = {
      id: amal.id,
      type: 'daily_amal',
      titleBn: amal.titleBn,
      arabicText: amal.arabicText || '',
      transliterationBn: '',
      meaningBn: amal.titleBn,
      virtueBn: amal.virtueBn || 'দৈনন্দিন ফরজ ও সুন্নাত আমল নিয়মিত পালনে আল্লাহর সন্তুষ্টি ও রহমত লাভ হয়।',
      categoryBn: amal.category === 'prayer' ? 'ফরয ও সুন্নাত সালাত' :
                  amal.category === 'quran' ? 'কুরআন তিলাওয়াত' :
                  amal.category === 'dua' ? 'মাসনূন দোয়া' :
                  amal.category === 'dhikr' ? 'দৈনিক জিকির ও তাসবিহ' : 'সুন্নাহ আমল',
      categoryIcon: amal.category === 'prayer' ? '🕌' :
                    amal.category === 'quran' ? '📖' :
                    amal.category === 'dua' ? '🤲' :
                    amal.category === 'dhikr' ? '📿' : '🌱',
      recommendedCount: amal.targetCount || 1,
      recommendedTimeBn: amal.recommendedTimeBn || 'নির্ধারিত ওয়াক্তে',
      evidenceLevel: 'sahih_hadith',
      quranRefBn: 'সূরা আন-নিসা: ১০৩ (সালাত নির্ধারিত সময়ে মুমিনদের ওপর ফরয)',
      hadithRefBn: 'সহিহ বুখারী ও সহিহ মুসলিম',
      deeperMeaningBn: 'দৈনন্দিন জীবনের প্রতিটি কাজে আল্লাহর বিধান মেনে চলা এবং রাসূলুল্লাহ ﷺ-এর সুন্নাতের অনুসরণ করা।',
      duaWithThisNameBn: amal.arabicText || 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      characterLessonBn: 'সময়ানুবর্তিতা, একনিষ্ঠতা ও আল্লাহর প্রতি সার্বক্ষণিক আনুগত্যের অভ্যাস গড়ে তোলা।',
      lifeApplicationTaskBn: 'আজকের নির্ধারিত ওয়াক্তে এই আমলটি একাগ্রচিত্তে সম্পন্ন করুন।',
      lifeSituationsBn: ['দৈনন্দিন ঈমানী দায়িত্ব', 'আত্মিক উন্নতি', 'গুনাহ মাফ']
    };

    unifiedCardCache.set(amal.id, unifiedDaily);
  });

  // 3. Preload Special Day Suggestions
  try {
    const specialDayData = getTodaySpecialAmalSuggestions();
    specialDayData.items.forEach((item) => {
      const unifiedSpecial: UnifiedAmalCardData = {
        id: item.id,
        type: 'special_day',
        titleBn: item.titleBn,
        arabicText: item.arabicText || '',
        transliterationBn: item.transliterationBn || '',
        meaningBn: item.meaningBn || item.titleBn,
        virtueBn: item.virtueBn || 'বিশেষ দিনের সুন্নাত আমলের সওয়াব ও প্রতিদান বহুগুণ বেশি।',
        categoryBn: 'আজকের বিশেষ আমল',
        categoryIcon: item.category === 'prayer' ? '🕌' :
                      item.category === 'quran' ? '📖' :
                      item.category === 'dua' ? '🤲' :
                      item.category === 'dhikr' ? '📿' : '🌟',
        recommendedCount: item.targetCount || 1,
        recommendedTimeBn: item.recommendedTimeBn || 'আজকের দিনে সুবিধাজনক সময়ে',
        evidenceLevel: 'sahih_hadith',
        quranRefBn: item.surahNumber ? `সূরা নং ${item.surahNumber}` : 'পবিত্র কুরআন',
        hadithRefBn: item.hadithSourceBn || 'সহিহ হাদিস সংকলন',
        deeperMeaningBn: item.virtueBn,
        characterLessonBn: 'রাসূলুল্লাহ ﷺ-এর সুন্নাতের প্রতি ভালোবাসা এবং নির্ধারিত দিনের বরকত অর্জন করা।',
        lifeApplicationTaskBn: 'আজকের দিনে এই বিশেষ সুন্নাতটি নিজে পালন করুন এবং পরিবারকেও উৎসাহিত করুন।',
        lifeSituationsBn: ['বিশেষ দিনের বরকত', 'সওয়াব বৃদ্ধি', 'দোয়া কবুল']
      };

      unifiedCardCache.set(item.id, unifiedSpecial);
    });
  } catch (err) {
    console.warn('Special day preload info:', err);
  }

  isPreloaded = true;
}

// Immediately run preloading on module load
preloadAllAmalData();

/**
 * Synchronously retrieves a pre-loaded Asmaul Husna item by ID (1-99)
 */
export function getPreloadedAsma(id: number | string): AsmaulHusnaItem | null {
  preloadAllAmalData();
  const numId = typeof id === 'string' ? parseInt(id.replace('asma-', ''), 10) : id;
  if (!isNaN(numId) && asmaCacheById.has(numId)) {
    return asmaCacheById.get(numId)!;
  }
  return ASMAUL_HUSNA_LIST.find(a => a.id === numId) || null;
}

/**
 * Synchronously retrieves or normalizes any Amal card data
 */
export function getPreloadedAmalCard(id: string | number): UnifiedAmalCardData | null {
  preloadAllAmalData();
  const strId = String(id);

  if (unifiedCardCache.has(strId)) {
    return unifiedCardCache.get(strId)!;
  }

  // Check if it's an Asma ID
  const asmaItem = getPreloadedAsma(id);
  if (asmaItem) {
    return normalizeAsmaToAmalCard(asmaItem);
  }

  return null;
}

/**
 * Normalizes an AsmaulHusnaItem to UnifiedAmalCardData
 */
export function normalizeAsmaToAmalCard(item: AsmaulHusnaItem): UnifiedAmalCardData {
  return {
    id: `asma-${item.id}`,
    asmaId: item.id,
    type: 'asmaul_husna',
    titleBn: item.transliterationBn,
    titleEn: `Name #${item.id}`,
    arabicText: item.arabic,
    transliterationBn: item.transliterationBn,
    meaningBn: item.meaningBn,
    virtueBn: item.virtueBn || item.deeperMeaningBn || 'আল্লাহর নামের জিকিরে অন্তরে পরম প্রশান্তি নামে।',
    categoryBn: item.categoryBn || 'রহমত ও ক্ষমা',
    categoryIcon: '✨',
    recommendedCount: item.recommendedCount || 100,
    recommendedTimeBn: item.timeSlot === 'fajr' ? 'ফজর সালাতের পর ও সকালে' :
                       item.timeSlot === 'maghrib' ? 'মাগরিবের পর ও সন্ধ্যায়' :
                       item.timeSlot === 'bedtime' ? 'ঘুমানোর পূর্বে' :
                       item.timeSlot === 'dhuhr' ? 'জোহরের ওয়াক্তে' :
                       item.timeSlot === 'asr' ? 'আসর সালাতের পর' : 'প্রতি ফরয সালাত শেষে ও যেকোনো সময়ে',
    timeSlot: item.timeSlot || 'any',
    evidenceLevel: item.evidenceLevel || 'quran_proof',
    quranRefBn: item.quranRefBn || 'সূরা আল-আ\'রাফ: ১৮০, সূরা আল-হাশর: ২২-২৪',
    hadithRefBn: item.hadithRefBn || 'সহিহ বুখারী ২৭৩৬, সহিহ মুসলিম ২৬৭৭ (আল্লাহর ৯৯টি নামের সার্বিক ফজিলত)',
    hadithVirtueBn: item.hadithVirtueBn || item.virtueBn,
    testedVirtueBn: item.testedVirtueBn || item.virtueBn,
    testedOutcomeBn: item.testedOutcomeBn || 'আল্লাহর রহমত লাভ ও অন্তরে পরম প্রশান্তি।',
    contextExplanationBn: item.contextExplanationBn || item.deeperMeaningBn,
    detailedAmalRuleBn: item.detailedAmalRuleBn || `প্রতিদিন সালাতের পর ওযূ অবস্থায় ১০০ বার পাঠ করুন।`,
    amalConditionsBn: item.amalConditionsBn || ['হালাল উপার্জন বজায় রাখা', 'একাগ্রচিত্তে জিকির করা', 'ধৈর্য ও তাওয়াক্কুল রাখা'],
    deeperMeaningBn: item.deeperMeaningBn || `আল্লাহ তাআলার পবিত্র বৈশিষ্ট্য '${item.transliterationBn}' স্মরণের মাধ্যমে অন্তরে তাঁর মহত্ত্ব প্রতিষ্ঠিত হয়।`,
    duaWithThisNameBn: item.duaWithThisNameBn || `يَا ${item.arabic} اغْفِرْ লِي وَارْحَمْنِي`,
    characterLessonBn: item.characterLessonBn || `${item.transliterationBn} নামের শিক্ষা ধারণ করে নিজের আচরণকে সংযত ও সুন্দর রাখা।`,
    lifeApplicationTaskBn: item.lifeApplicationTaskBn || `আজ অন্তত একবার এই পবিত্র নাম স্মরণ করে আল্লাহর কাছে আন্তরিক দোয়া করুন।`,
    lifeSituationsBn: item.lifeSituationsBn || ['ঈমানী শক্তি বৃদ্ধি', 'পারিবারিক শান্তি', 'বিপদাপদ থেকে মুক্তি'],
    audioUrl: item.audioUrl || `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${item.id}.mp3`
  };
}

/**
 * Normalizes any generic item to UnifiedAmalCardData
 */
export function normalizeGenericToAmalCard(raw: any): UnifiedAmalCardData {
  if (!raw) {
    const fallback = getPreloadedAsma(1)!;
    return normalizeAsmaToAmalCard(fallback);
  }

  if (raw.arabic && raw.transliterationBn && !raw.arabicText) {
    return normalizeAsmaToAmalCard(raw as AsmaulHusnaItem);
  }

  return {
    id: raw.id || 'amal-custom',
    asmaId: raw.asmaId,
    type: raw.type || 'daily_amal',
    titleBn: raw.titleBn || raw.title || 'ইসলামিক আমল',
    titleEn: raw.titleEn,
    arabicText: raw.arabicText || raw.arabic || '',
    transliterationBn: raw.transliterationBn || '',
    meaningBn: raw.meaningBn || raw.translationBn || '',
    virtueBn: raw.virtueBn || raw.virtueShortBn || raw.fajilatBn || 'সুন্নাত আমল পালনে বিপুল সওয়াব ও বরকত নিহিত রয়েছে।',
    categoryBn: raw.categoryBn || raw.contextCategoryBn || 'দৈনন্দিন আমল',
    categoryIcon: raw.categoryIcon || raw.contextCategoryIcon || '🌟',
    recommendedCount: raw.recommendedCount || raw.targetCount || 1,
    recommendedTimeBn: raw.recommendedTimeBn || raw.contextOccasionBn || 'নির্ধারিত সময়ে',
    timeSlot: raw.timeSlot || 'any',
    evidenceLevel: raw.evidenceLevel || 'sahih_hadith',
    quranRefBn: raw.quranRefBn,
    hadithRefBn: raw.hadithRefBn || raw.sahihReferenceBn || raw.hadithSourceBn || 'সহিহ হাদিস সংকলন',
    hadithVirtueBn: raw.hadithVirtueBn || raw.virtueBn,
    testedVirtueBn: raw.testedVirtueBn || raw.virtueBn,
    testedOutcomeBn: raw.testedOutcomeBn,
    contextExplanationBn: raw.contextExplanationBn || raw.deeperMeaningBn,
    detailedAmalRuleBn: raw.detailedAmalRuleBn,
    amalConditionsBn: raw.amalConditionsBn,
    deeperMeaningBn: raw.deeperMeaningBn,
    duaWithThisNameBn: raw.duaWithThisNameBn,
    characterLessonBn: raw.characterLessonBn,
    lifeApplicationTaskBn: raw.lifeApplicationTaskBn,
    lifeSituationsBn: raw.lifeSituationsBn,
    audioUrl: raw.audioUrl
  };
}
