/**
 * Audio Resolver Utility
 * Guarantees that any audio title in Bangla or English maps accurately
 * to the exact audio stream URL corresponding to the title.
 */

import { pronunciationVoiceService } from '../services/pronunciationVoiceService';

/**
 * Audio Resolver Utility
 * Guarantees that any audio title in Bangla or English maps accurately
 * to the exact audio stream URL corresponding to the title, avoiding
 * false collisions (e.g. Asr prayer vs Surah Asr) and respecting chosen reciter.
 */

interface SurahAudioMapping {
  keywords: string[];
  number: number;
  /** If true, requires 'সূরা' / 'surah' prefix to avoid collision with common words */
  requirePrefix?: boolean;
}

const SURAH_MAPPINGS: SurahAudioMapping[] = [
  { keywords: ['ফাতিহা', 'fatiha', 'ফাতেহা'], number: 1 },
  { keywords: ['বাকারা', 'বাক্বারা', 'baqarah', 'baqara', 'বাক্বারাহ'], number: 2 },
  { keywords: ['ইমরান', 'imran', 'আলে ইমরান'], number: 3 },
  { keywords: ['নিসা', 'nisa', 'আন-নিসা'], number: 4 },
  { keywords: ['মায়েদা', 'মায়েদা', 'maida', 'মায়িদা'], number: 5 },
  { keywords: ['আনআম', "আন'আম", 'anam', 'আনআম'], number: 6 },
  { keywords: ['আরাফ', "আ'রাফ", 'araf', 'আরাফ'], number: 7 },
  { keywords: ['আনফাল', 'anfal'], number: 8 },
  { keywords: ['তাওবা', 'তওবা', 'tawbah', 'তাওবাহ'], number: 9 },
  { keywords: ['ইউনুস', 'yunus'], number: 10 },
  { keywords: ['হুদ', 'hud'], number: 11 },
  { keywords: ['ইউসুফ', 'yusuf'], number: 12 },
  { keywords: ['রা\'দ', 'রাদের', 'rad', 'রাদ'], number: 13 },
  { keywords: ['ইব্রাহিম', 'ইব্রাহীম', 'ibrahim'], number: 14 },
  { keywords: ['হিজর', 'hijr'], number: 15 },
  { keywords: ['নাহল', 'nahl'], number: 16 },
  { keywords: ['ইসরা', 'বনী ইসরাঈল', 'বনি ইসরাঈল', 'isra'], number: 17 },
  { keywords: ['কাহফ', 'কাহাফ', 'kahf'], number: 18 },
  { keywords: ['মারইয়াম', 'মারিয়াম', 'maryam'], number: 19 },
  { keywords: ['ত্বোয়া-হা', 'ত্বাহা', 'taha', 'তোয়াহা'], number: 20 },
  { keywords: ['আম্বিয়া', 'আম্বিয়া', 'anbiya'], number: 21 },
  { keywords: ['হাজ্জ', 'হজ', 'hajj'], number: 22, requirePrefix: true },
  { keywords: ['মুমিনুন', "মু'মিনুন", 'muminun'], number: 23 },
  { keywords: ['নূর', 'নুর', 'nur'], number: 24, requirePrefix: true },
  { keywords: ['ফুরকান', 'furqan'], number: 25 },
  { keywords: ['শুআরা', "শু'আরা", 'shuara'], number: 26 },
  { keywords: ['নামল', 'naml'], number: 27 },
  { keywords: ['কাসাস', 'qasas'], number: 28 },
  { keywords: ['আনকাবুত', 'ankabut'], number: 29 },
  { keywords: ['রূম', 'রুম', 'rum'], number: 30 },
  { keywords: ['লোকমান', 'লুকমান', 'luqman'], number: 31 },
  { keywords: ['সাজদাহ', 'সেজদা', 'sajdah'], number: 32 },
  { keywords: ['আহযাব', 'আহজাব', 'ahzab'], number: 33 },
  { keywords: ['সাবা', 'saba'], number: 34 },
  { keywords: ['ফাতির', 'fatir'], number: 35 },
  { keywords: ['ইয়াছিন', 'ইয়াসীন', 'ইয়াসিন', 'yasin', 'yaseen'], number: 36 },
  { keywords: ['ছফফাত', 'সাফফাত', 'saffat'], number: 37 },
  { keywords: ['সোয়াদ', 'সোয়াদ', 'sad'], number: 38 },
  { keywords: ['যুমার', 'জুমার', 'zumar'], number: 39 },
  { keywords: ['গাফির', 'ghafir'], number: 40 },
  { keywords: ['ফুসসিলাত', 'fussilat'], number: 41 },
  { keywords: ['শূরা', 'শুরা', 'shura'], number: 42 },
  { keywords: ['যুখরুফ', 'জুখরুফ', 'zukhruf'], number: 43 },
  { keywords: ['দুখান', 'dukhan'], number: 44 },
  { keywords: ['জাসিয়া', 'জাসিয়াহ', 'jathiyah'], number: 45 },
  { keywords: ['আহক্বাফ', 'আহকাফ', 'ahqaf'], number: 46 },
  { keywords: ['মুহাম্মদ', 'muhammad'], number: 47, requirePrefix: true },
  { keywords: ['ফাতহ', 'ফাতাহ', 'fath'], number: 48, requirePrefix: true },
  { keywords: ['হুজুরাত', 'hujurat'], number: 49 },
  { keywords: ['ক্বাফ', 'কাফ', 'qaf'], number: 50 },
  { keywords: ['যারিয়াত', 'যারিয়াত', 'dhariyat'], number: 51 },
  { keywords: ['তূর', 'তুর', 'tur'], number: 52 },
  { keywords: ['নাজম', 'najm'], number: 53 },
  { keywords: ['ক্বামার', 'কামার', 'qamar'], number: 54 },
  { keywords: ['রহমান', 'rahman', 'আর-রহমান'], number: 55 },
  { keywords: ['ওয়াকিয়াহ', 'ওয়াকিয়াহ', 'ওয়াকেয়া', 'waqiah', 'ওয়াকিয়া'], number: 56 },
  { keywords: ['হাদীদ', 'হাদিদ', 'hadid'], number: 57 },
  { keywords: ['মুজাদালাহ', 'মুজাদালা', 'mujadila'], number: 58 },
  { keywords: ['হাশর', 'hashr'], number: 59, requirePrefix: true },
  { keywords: ['মুমতাহিনাহ', 'mumtahanah'], number: 60 },
  { keywords: ['ছফ', 'সফ', 'as-saff'], number: 61 },
  { keywords: ['জুমুআ', "জুমু'আ", 'jumuah'], number: 62, requirePrefix: true },
  { keywords: ['মুনাফিকুন', 'munafiqun'], number: 63 },
  { keywords: ['তাগাবুন', 'taghabun'], number: 64 },
  { keywords: ['ত্বালাক', 'তালাক', 'talaq'], number: 65, requirePrefix: true },
  { keywords: ['তাহরীম', 'তাহরিম', 'tahrim'], number: 66 },
  { keywords: ['মুলক', 'মুলক্‌', 'mulk'], number: 67 },
  { keywords: ['কলম', 'qalam'], number: 68 },
  { keywords: ['হাক্কাহ', 'haqqah'], number: 69 },
  { keywords: ['মাআরিজ', "মা'আরিজ", 'maarij'], number: 70 },
  { keywords: ['নূহ', 'নুহু', 'nuh'], number: 71 },
  { keywords: ['জীন', 'জিন', 'al-jinn'], number: 72 },
  { keywords: ['মুযযাম্মিল', 'মুজ্জাম্মিল', 'muzzammil'], number: 73 },
  { keywords: ['মুদ্দাসসির', 'মুদ্দাস্সির', 'muddaththir'], number: 74 },
  { keywords: ['কিয়ামাহ', 'কিয়ামাত', 'qiyamah'], number: 75 },
  { keywords: ['ইনসান', 'দাহর', 'al-insan'], number: 76 },
  { keywords: ['মুরসালাত', 'mursalat'], number: 77 },
  { keywords: ['নাবা', 'naba'], number: 78 },
  { keywords: ['নাযিয়াত', 'নাযিয়াত', 'naziat'], number: 79 },
  { keywords: ['আবাসা', 'abasa'], number: 80 },
  { keywords: ['তাকভীর', 'তাকভির', 'takwir'], number: 81 },
  { keywords: ['ইনফিতার', 'infitar'], number: 82 },
  { keywords: ['মুত্বাফফিফীন', 'মুতাফফিফিন', 'mutaffifin'], number: 83 },
  { keywords: ['ইনশিকাক', 'inshiqaq'], number: 84 },
  { keywords: ['বুরূজ', 'বুরুজ', 'buruj'], number: 85 },
  { keywords: ['তারিক', 'ত্বারিক', 'tariq'], number: 86 },
  { keywords: ['আ\'লা', 'আলা', 'ala'], number: 87 },
  { keywords: ['গাশিয়াহ', 'গাশিয়া', 'ghashiyah'], number: 88 },
  { keywords: ['ফজর', 'fajr'], number: 89, requirePrefix: true },
  { keywords: ['বালাদ', 'balad'], number: 90 },
  { keywords: ['শামস', 'shams'], number: 91, requirePrefix: true },
  { keywords: ['লাইল', 'layl'], number: 92, requirePrefix: true },
  { keywords: ['দোহা', 'দুহা', 'duha'], number: 93, requirePrefix: true },
  { keywords: ['ইনশিরাহ', 'শারহ', 'sharh', 'inshirah'], number: 94 },
  { keywords: ['তীন', 'তিন', 'al-tin'], number: 95 },
  { keywords: ['আলাক', 'alaq'], number: 96 },
  { keywords: ['কদর', 'qadr'], number: 97, requirePrefix: true },
  { keywords: ['বায়্যিনাহ', 'বায়্যিনাহ', 'bayyinah'], number: 98 },
  { keywords: ['যিলযাল', 'জিলজাল', 'zalzalah'], number: 99 },
  { keywords: ['আদিয়াত', 'আদিয়াত', 'adiyat'], number: 100 },
  { keywords: ['ক্বারিয়াহ', 'কারিয়া', 'qaria'], number: 101 },
  { keywords: ['তাকাসুর', 'takathur'], number: 102 },
  { keywords: ['আসর', 'asr'], number: 103, requirePrefix: true },
  { keywords: ['হুমাযাহ', 'হুমাজা', 'humazah'], number: 104 },
  { keywords: ['ফীল', 'ফিল', 'al-fil'], number: 105 },
  { keywords: ['কুরাইশ', 'quraysh'], number: 106 },
  { keywords: ['মাউন', "মা'উন", 'maun'], number: 107 },
  { keywords: ['কাউসার', 'kawthar'], number: 108 },
  { keywords: ['কাফিরুন', 'kafirun'], number: 109 },
  { keywords: ['নসর', 'nasr'], number: 110, requirePrefix: true },
  { keywords: ['লাহাব', 'মাসাদ', 'lahab'], number: 111 },
  { keywords: ['ইখলাস', 'ikhlas'], number: 112 },
  { keywords: ['ফালাক', 'falaq'], number: 113 },
  { keywords: ['নাস', 'an-nas'], number: 114 }
];

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function convertBnDigitsToEn(str: string): string {
  return str.replace(/[০-৯]/g, d => String(BN_DIGITS.indexOf(d)));
}

/**
 * Returns the audio URL for a given Surah number, respecting the user's active reciter preference.
 */
export function getSurahAudioUrl(surahNum: number): string {
  if (surahNum < 1 || surahNum > 114) {
    surahNum = 1;
  }
  try {
    const activeReciter = pronunciationVoiceService.getActiveReciter();
    if (activeReciter && typeof activeReciter.getUrl === 'function') {
      return activeReciter.getUrl(surahNum);
    }
  } catch (e) {
    // fallback
  }
  return `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNum}.mp3`;
}

/**
 * Extracts Surah number (1-114) from a title string or URL.
 */
export function extractSurahNumber(titleOrUrl: string): number | null {
  if (!titleOrUrl) return null;

  // 1. Check if URL contains Surah number pattern
  // e.g. /murattal/2.mp3 or /afs/002.mp3 or /002.mp3
  const urlMatch = titleOrUrl.match(/(?:\/|\b)(\d{1,3})\.mp3(?:\?|$)/i);
  if (urlMatch) {
    const num = parseInt(urlMatch[1], 10);
    if (num >= 1 && num <= 114) return num;
  }

  const normalized = convertBnDigitsToEn(titleOrUrl).toLowerCase();

  // 2. Check explicit number with 'সূরা' or 'surah' prefix
  // e.g. 'সূরা ২', 'surah 2', 'সূরা 002', '#2'
  const prefixMatch = normalized.match(/(?:সূরা|সুরা|surah)\s*#?\s*(\d{1,3})/i);
  if (prefixMatch) {
    const num = parseInt(prefixMatch[1], 10);
    if (num >= 1 && num <= 114) return num;
  }

  // 3. Leading number e.g. "2. সূরা আল-বাকারা" or "02 - Al-Baqarah"
  const leadingMatch = normalized.match(/^\s*(\d{1,3})\s*[\.:\-]/);
  if (leadingMatch) {
    const num = parseInt(leadingMatch[1], 10);
    if (num >= 1 && num <= 114) return num;
  }

  const hasSurahPrefix = normalized.includes('সূরা') || normalized.includes('সুরা') || normalized.includes('surah');

  // 4. Special cases
  if (normalized.includes('৩ কুল') || normalized.includes('3 qul') || normalized.includes('তিন কুল')) {
    return 112;
  }
  if (normalized.includes('আয়াতুল কুরসী') || normalized.includes('আয়াতুল কুরসি') || normalized.includes('ayatul kursi')) {
    return 2;
  }

  // 5. Match from SURAH_MAPPINGS
  for (const mapping of SURAH_MAPPINGS) {
    if (mapping.requirePrefix && !hasSurahPrefix) {
      continue;
    }
    for (const kw of mapping.keywords) {
      if (normalized.includes(kw)) {
        return mapping.number;
      }
    }
  }

  return null;
}

/**
 * Checks whether an audio is a Surah recitation
 */
export function isSurahAudio(title: string, url?: string): boolean {
  return extractSurahNumber(title) !== null || (!!url && extractSurahNumber(url) !== null);
}

/**
 * Resolves the precise audio stream URL from a given title or text.
 * CRITICAL RULE: If a valid, non-placeholder audio URL is already passed in fallbackUrl,
 * it is PRESERVED so that specific Hadith, Azan, Ayah or Dua audios are never overwritten.
 */
export function resolveAudioUrlFromTitle(title: string, fallbackUrl?: string): string {
  // If a valid HTTP mp3/audio URL is passed and it is already specific (not a generic 1.mp3 fallback), respect it!
  if (fallbackUrl && fallbackUrl.startsWith('http')) {
    const cleanFallback = fallbackUrl.trim();
    // If it's already an EveryAyah, Dua, Azan, or audio stream
    const isGenericFallback = cleanFallback.endsWith('/1.mp3') || cleanFallback.endsWith('/001.mp3');
    const titleIsFatiha = title && (title.includes('ফাতিহা') || title.includes('fatiha'));

    if (!isGenericFallback || titleIsFatiha) {
      return cleanFallback;
    }
  }

  // Check if title maps to a Surah
  const surahNum = extractSurahNumber(title);
  if (surahNum !== null) {
    return getSurahAudioUrl(surahNum);
  }

  // If fallbackUrl exists, return it
  if (fallbackUrl && fallbackUrl.startsWith('http')) {
    return fallbackUrl;
  }

  // Absolute fallback to Surah Al-Fatiha
  return getSurahAudioUrl(1);
}

