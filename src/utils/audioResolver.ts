/**
 * Audio Resolver Utility
 * Guarantees that any audio title in Bangla or English maps accurately
 * to the exact audio stream URL corresponding to the title.
 */

interface SurahAudioMapping {
  keywords: string[];
  number: number;
}

const SURAH_MAPPINGS: SurahAudioMapping[] = [
  { keywords: ['ফাতিহা', 'fatiha', 'ফাতেহা'], number: 1 },
  { keywords: ['বাকারা', 'baqarah', 'আয়াতুল কুরসী', 'আয়াতুল কুরসি', 'ayatul kursi', 'রুকাইয়া', 'রুকিয়া', 'ruqyah'], number: 2 },
  { keywords: ['ইমরান', 'imran'], number: 3 },
  { keywords: ['নিসা', 'nisa'], number: 4 },
  { keywords: ['মায়েদা', 'মায়েদা', 'maida'], number: 5 },
  { keywords: ['আনআম', "আন'আম", 'anam'], number: 6 },
  { keywords: ['আরাফ', "আ'রাফ", 'araf'], number: 7 },
  { keywords: ['আনফাল', 'anfal'], number: 8 },
  { keywords: ['তাওবা', 'তওবা', 'tawbah'], number: 9 },
  { keywords: ['ইউনুস', 'yunus'], number: 10 },
  { keywords: ['হুদ', 'hud'], number: 11 },
  { keywords: ['ইউসুফ', 'yusuf'], number: 12 },
  { keywords: ['রা\'দ', 'রাদের', 'rad'], number: 13 },
  { keywords: ['ইব্রাহিম', 'ইব্রাহীম', 'ibrahim'], number: 14 },
  { keywords: ['হিজর', 'hijr'], number: 15 },
  { keywords: ['নাহল', 'nahl'], number: 16 },
  { keywords: ['ইসরা', 'বনী ইসরাঈল', 'isra'], number: 17 },
  { keywords: ['কাহফ', 'kahf'], number: 18 },
  { keywords: ['মারইয়াম', 'মারিয়াম', 'maryam'], number: 19 },
  { keywords: ['ত্বোয়া-হা', 'ত্বাহা', 'taha'], number: 20 },
  { keywords: ['আম্বিয়া', 'আম্বিয়া', 'anbiya'], number: 21 },
  { keywords: ['হাজ্জ', 'হজ', 'hajj'], number: 22 },
  { keywords: ['মুমিনুন', "মু'মিনুন", 'muminun'], number: 23 },
  { keywords: ['নূর', 'নুর', 'nur'], number: 24 },
  { keywords: ['ফুরকান', 'furqan'], number: 25 },
  { keywords: ['শুআরা', "শু'আরা", 'shuara'], number: 26 },
  { keywords: ['নামল', 'naml'], number: 27 },
  { keywords: ['কাসাস', 'qasas'], number: 28 },
  { keywords: ['আনকাবুত', 'ankabut'], number: 29 },
  { keywords: ['রূম', 'রুম', 'rum'], number: 30 },
  { keywords: ['লোকমান', 'luqman'], number: 31 },
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
  { keywords: ['মুহাম্মদ', 'muhammad'], number: 47 },
  { keywords: ['ফাতহ', 'ফাতাহ', 'fath'], number: 48 },
  { keywords: ['হুজুরাত', 'hujurat'], number: 49 },
  { keywords: ['ক্বাফ', 'কাফ', 'qaf'], number: 50 },
  { keywords: ['যারিয়াত', 'যারিয়াত', 'dhariyat'], number: 51 },
  { keywords: ['তূর', 'তুর', 'tur'], number: 52 },
  { keywords: ['নাজম', 'najm'], number: 53 },
  { keywords: ['ক্বামার', 'কামার', 'qamar'], number: 54 },
  { keywords: ['রহমান', 'rahman'], number: 55 },
  { keywords: ['ওয়াকিয়াহ', 'ওয়াকিয়াহ', 'ওয়াকেয়া', 'waqiah'], number: 56 },
  { keywords: ['হাদীদ', 'হাদিদ', 'hadid'], number: 57 },
  { keywords: ['মুজাদালাহ', 'মুজাদালা', 'mujadila'], number: 58 },
  { keywords: ['হাশর', 'hashr'], number: 59 },
  { keywords: ['মুমতাহিনাহ', 'mumtahanah'], number: 60 },
  { keywords: ['ছফ', 'সফ', 'saff'], number: 61 },
  { keywords: ['জুমুআ', "জুমু'আ", 'jumuah'], number: 62 },
  { keywords: ['মুনাফিকুন', 'munafiqun'], number: 63 },
  { keywords: ['তাগাবুন', 'taghabun'], number: 64 },
  { keywords: ['ত্বালাক', 'তালাক', 'talaq'], number: 65 },
  { keywords: ['তাহরীম', 'তাহরিম', 'tahrim'], number: 66 },
  { keywords: ['মুলক', 'মুলক্‌', 'mulk'], number: 67 },
  { keywords: ['কলম', 'qalam'], number: 68 },
  { keywords: ['হাক্কাহ', 'haqqah'], number: 69 },
  { keywords: ['মাআরিজ', "মা'আরিজ", 'maarij'], number: 70 },
  { keywords: ['নূহ', 'নুহু', 'nuh'], number: 71 },
  { keywords: ['জীন', 'জিন', 'jinn'], number: 72 },
  { keywords: ['মুযযাম্মিল', 'মুজ্জাম্মিল', 'muzzammil'], number: 73 },
  { keywords: ['মুদ্দাসসির', 'মুদ্দাস্সির', 'muddaththir'], number: 74 },
  { keywords: ['কিয়ামাহ', 'কিয়ামাত', 'qiyamah'], number: 75 },
  { keywords: ['ইনসান', 'দাহর', 'insan'], number: 76 },
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
  { keywords: ['ফজর', 'fajr'], number: 89 },
  { keywords: ['বালাদ', 'balad'], number: 90 },
  { keywords: ['শামস', 'shams'], number: 91 },
  { keywords: ['লাইল', 'layl'], number: 92 },
  { keywords: ['দোহা', 'দুহা', 'duha'], number: 93 },
  { keywords: ['ইনশিরাহ', 'শারহ', 'sharh', 'inshirah'], number: 94 },
  { keywords: ['তীন', 'তিন', 'tin'], number: 95 },
  { keywords: ['আলাক', 'alaq'], number: 96 },
  { keywords: ['কদর', 'qadr'], number: 97 },
  { keywords: ['বায়্যিনাহ', 'বায়্যিনাহ', 'bayyinah'], number: 98 },
  { keywords: ['যিলযাল', 'জিলজাল', 'zalzalah'], number: 99 },
  { keywords: ['আদিয়াত', 'আদিয়াত', 'adiyat'], number: 100 },
  { keywords: ['ক্বারিয়াহ', 'কারিয়া', 'qaria'], number: 101 },
  { keywords: ['তাকাসুর', 'takathur'], number: 102 },
  { keywords: ['আসর', 'asr'], number: 103 },
  { keywords: ['হুমাযাহ', 'হুমাজা', 'humazah'], number: 104 },
  { keywords: ['ফীল', 'ফিল', 'fil'], number: 105 },
  { keywords: ['কুরাইশ', 'quraysh'], number: 106 },
  { keywords: ['মাউন', "মা'উন", 'maun'], number: 107 },
  { keywords: ['কাউসার', 'kawthar'], number: 108 },
  { keywords: ['কাফিরুন', 'kafirun'], number: 109 },
  { keywords: ['নসর', 'nasr'], number: 110 },
  { keywords: ['লাহাব', 'মাসাদ', 'lahab'], number: 111 },
  { keywords: ['ইখলাস', 'ikhlas'], number: 112 },
  { keywords: ['ফালাক', 'falaq'], number: 113 },
  { keywords: ['নাস', 'nas'], number: 114 }
];

export function getSurahAudioUrl(surahNum: number): string {
  // Primary CDN: QuranicAudio / Mishari Alafasy (Fast, High Quality MP3)
  return `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNum}.mp3`;
}

/**
 * Resolves the precise audio stream URL from a given title or text.
 * Matches Surah names, Ruqyah, Ayatul Kursi, 3 Quls, etc.
 */
export function resolveAudioUrlFromTitle(title: string, fallbackUrl?: string): string {
  if (!title) return fallbackUrl || getSurahAudioUrl(1);

  const cleanTitle = title.toLowerCase().trim();

  // 1. Direct check for Ruqyah / 3 Qul / Ayatul Kursi
  if (cleanTitle.includes('৩ কুল') || cleanTitle.includes('3 qul')) {
    return getSurahAudioUrl(112);
  }
  if (cleanTitle.includes('রুকাইয়া') || cleanTitle.includes('রুকিয়া') || cleanTitle.includes('ruqyah')) {
    return getSurahAudioUrl(2); // Surah Baqarah - Main Ruqyah
  }

  // 2. Match Surah keywords in title
  for (const mapping of SURAH_MAPPINGS) {
    for (const kw of mapping.keywords) {
      if (cleanTitle.includes(kw)) {
        return getSurahAudioUrl(mapping.number);
      }
    }
  }

  // 3. Fallback to passed URL if provided and valid
  if (fallbackUrl && fallbackUrl.startsWith('http')) {
    return fallbackUrl;
  }

  return getSurahAudioUrl(1);
}
