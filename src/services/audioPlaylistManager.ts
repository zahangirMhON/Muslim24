// Audio Playlist & Folder Architecture Service
// Manages folder-based Islamic audio series, Hisnul Muslim audiobook/PDF/video,
// 24/7 scheduled radio auto-play, favorites, and single-audio-controller conflict resolution.

import { HISNUL_MUSLIM_ITEMS, HisnulMuslimItem } from '../data/hisnulMuslimFullData';
import { RADIO_SERIES_CATEGORIES, RADIO_SERIES_ITEMS } from '../data/radioSeriesData';
import { ALL_114_SURAHS } from '../data/allSurahsData';
import { resolveAudioUrlFromTitle, extractSurahNumber, getSurahAudioUrl } from '../utils/audioResolver';
import { toBengaliDigits } from '../utils/bengaliUtils';

export interface FolderScheduleInfo {
  folderId: string;
  folderTitleBn: string;
  timeSlots: { start: string; end: string; title: string; trackId: string }[];
  isCurrentlyActive: boolean;
  activeTrackTitle?: string;
  minutesRemaining?: number;
  timeRemainingBn?: string;
  finishTime?: string;
  coveragePercent: number; // 0 to 100 for 24h bar
  formattedRangeBn: string;
  hasSchedule: boolean;
}

export interface FreeTimeSlot {
  id: string;
  start: string; // HH:MM
  end: string;   // HH:MM
  durationMinutes: number;
  durationLabelBn: string;
  rangeBn: string;
}

export interface PlayableTrack {
  id: string;
  title: string;
  subtitle?: string;
  reciterOrScholar: string;
  audioUrl: string;
  backupUrl?: string;
  folderId: string;
  folderTitleBn: string;
  durationSeconds?: number;
  durationLabel?: string;
  startTime?: string; // HH:MM
  endTime?: string;   // HH:MM
  categoryBn?: string;
  // Hisnul Muslim & Dua Rich Details
  arabicText?: string;
  transliterationBn?: string;
  translationBn?: string;
  referenceBn?: string;
  virtueBn?: string;
  videoId?: string;
  pdfPage?: number;
  isFavorite?: boolean;
}

export interface AudioFolder {
  id: string;
  titleBn: string;
  titleEn: string;
  icon: string;
  descriptionBn: string;
  badge: string;
  colorTheme: string;
  itemCount: number;
  isCustom?: boolean;
  scheduleSupported?: boolean;
}

export interface CustomPlaylist {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  startTime?: string;
  endTime?: string;
  trackIds: string[];
}

const FAVORITES_STORAGE_KEY = 'islamic_app_audio_favorites_v2';
const CUSTOM_PLAYLISTS_STORAGE_KEY = 'islamic_app_custom_playlists_v2';
const AUTOPLAY_MODE_STORAGE_KEY = 'islamic_app_schedule_autoplay_enabled';

class AudioPlaylistManager {
  private static instance: AudioPlaylistManager;
  private listeners: Set<() => void> = new Set();
  private favorites: Set<string> = new Set();
  private customPlaylists: CustomPlaylist[] = [];
  private isScheduleAutoPlay: boolean = true;
  private currentActiveTrack: PlayableTrack | null = null;
  private isPlaying: boolean = false;
  private playbackMode: 'schedule' | 'playlist' | 'single' = 'schedule';
  private currentFolderId: string = 'hisnul_muslim';

  private constructor() {
    this.loadPersistedData();
  }

  public static getInstance(): AudioPlaylistManager {
    if (!AudioPlaylistManager.instance) {
      AudioPlaylistManager.instance = new AudioPlaylistManager();
    }
    return AudioPlaylistManager.instance;
  }

  private loadPersistedData() {
    try {
      const favs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favs) {
        this.favorites = new Set(JSON.parse(favs));
      }

      const playlists = localStorage.getItem(CUSTOM_PLAYLISTS_STORAGE_KEY);
      if (playlists) {
        this.customPlaylists = JSON.parse(playlists);
      }

      const autoMode = localStorage.getItem(AUTOPLAY_MODE_STORAGE_KEY);
      if (autoMode !== null) {
        this.isScheduleAutoPlay = autoMode === 'true';
      }
    } catch (e) {
      console.error('Failed to load audio playlist storage', e);
    }
  }

  private saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(this.favorites)));
    } catch (e) {
      console.error(e);
    }
  }

  private saveCustomPlaylists() {
    try {
      localStorage.setItem(CUSTOM_PLAYLISTS_STORAGE_KEY, JSON.stringify(this.customPlaylists));
    } catch (e) {
      console.error(e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // ================= FOLDERS =================
  public getFolders(): AudioFolder[] {
    const baseFolders: AudioFolder[] = [
      {
        id: 'hisnul_muslim',
        titleBn: 'হিসনুল মুসলিম (বই, অডিওবুক, পিডিএফ ও ভিডিও)',
        titleEn: 'Hisnul Muslim Complete Fortress',
        icon: 'BookMarked',
        descriptionBn: 'সহীহ মাসনূন দোয়া, অডিও উচ্চারণ, বাংলা অর্থ, পিডিএফ বই ও ভিডিও পাঠ',
        badge: 'প্রধান সংগ্রহ',
        colorTheme: 'from-amber-500/20 to-emerald-600/20 border-amber-400/60',
        itemCount: HISNUL_MUSLIM_ITEMS.length,
        scheduleSupported: true
      },
      {
        id: 'schedule_radio',
        titleBn: '২৪/৭ লাইভ রুটিন রেডিও (টাইম অটো-প্লে)',
        titleEn: '24/7 Scheduled Live Radio Routine',
        icon: 'Radio',
        descriptionBn: 'সারাদিনের সময়সূচী অনুযায়ী নিরবচ্ছিন্ন কুরআন, হাদিস ও দোয়া সম্প্রচার',
        badge: 'লাইভ সম্প্রচার',
        colorTheme: 'from-emerald-500/20 to-teal-600/20 border-emerald-400/60',
        itemCount: 16,
        scheduleSupported: true
      },
      {
        id: 'quran_recitations',
        titleBn: 'পবিত্র কুরআন তিলাওয়াত (১১৪ সূরা ও ক্বারীগণ)',
        titleEn: 'Holy Quran Recitation (114 Surahs)',
        icon: 'BookOpen',
        descriptionBn: 'শায়খ মিশারী রশিদ আল-আফাসী ও বিশ্ববিখ্যাত ক্বারীগণের বিশুদ্ধ তিলাওয়াত',
        badge: '১১৪ সূরা',
        colorTheme: 'from-teal-500/20 to-cyan-600/20 border-teal-400/60',
        itemCount: ALL_114_SURAHS.length,
        scheduleSupported: false
      },
      {
        id: 'favorites',
        titleBn: 'আমার পছন্দের অডিও (Favorites - ❤️)',
        titleEn: 'My Favorite Audios',
        icon: 'Heart',
        descriptionBn: 'আপনার বুকমার্ক করা সকল প্রিয় তিলাওয়াত ও দোয়া এক ফোল্ডারে',
        badge: `${this.favorites.size} টি নির্বাচিত`,
        colorTheme: 'from-rose-500/20 to-pink-600/20 border-rose-400/60',
        itemCount: this.favorites.size,
        scheduleSupported: false
      },
      {
        id: 'ruqyah',
        titleBn: 'রুকাইয়া ও আত্মরক্ষা সিরিজ (Ruqyah)',
        titleEn: 'Ruqyah & Spiritual Protection Series',
        icon: 'ShieldCheck',
        descriptionBn: 'বদনজর, কুপ্রভাব ও অনিষ্ট থেকে সুরক্ষার কুরআনিক আয়াত ও মাসনুন দোয়া',
        badge: '৫টি পর্ব',
        colorTheme: 'from-blue-500/20 to-indigo-600/20 border-blue-400/60',
        itemCount: 5,
        scheduleSupported: true
      },
      {
        id: 'barakah',
        titleBn: 'রিজিক ও বরকতময় সিরিজ (Barakah)',
        titleEn: 'Provision & Sustenance Series',
        icon: 'Sparkles',
        descriptionBn: 'অভাব দূরীকরণ, ঋণমুক্তি ও জীবিকায় বরকতের সহীহ আমল ও তাফসীর',
        badge: '৫টি পর্ব',
        colorTheme: 'from-amber-600/20 to-yellow-500/20 border-amber-500/60',
        itemCount: 5,
        scheduleSupported: true
      },
      {
        id: 'shifa',
        titleBn: 'রোগমুক্তি ও কুরআনিক শিফা সিরিজ (Shifa)',
        titleEn: 'Healing & Health in Quran',
        icon: 'HeartPulse',
        descriptionBn: '৬টি শিফা আয়াত, অসুস্থতায় নববী দুআ ও বাংলা অনুপ্রেরণাদায়ী নসিহত',
        badge: '৫টি পর্ব',
        colorTheme: 'from-red-500/20 to-rose-600/20 border-red-400/60',
        itemCount: 5,
        scheduleSupported: true
      },
      {
        id: 'mental_peace',
        titleBn: 'মানসিক প্রশান্তি ও বিষণ্ণতা নিরাময় (Mental Peace)',
        titleEn: 'Inner Peace & Anxiety Relief',
        icon: 'Smile',
        descriptionBn: 'হতাশা, দুশ্চিন্তা ও ভয় থেকে অন্তরের শান্তি অর্জনের কুরআন-হাদিসের অডিও',
        badge: '৫টি পর্ব',
        colorTheme: 'from-cyan-500/20 to-teal-600/20 border-cyan-400/60',
        itemCount: 5,
        scheduleSupported: true
      },
      {
        id: 'daily_adhkar',
        titleBn: 'দৈনন্দিন সুন্নাহ ও তাসবিহ সিরিজ',
        titleEn: 'Daily Sunnah & Adhkar Series',
        icon: 'Sun',
        descriptionBn: 'রাসূলুল্লাহ (সা.) নির্দেশিত সকাল, সন্ধ্যা ও রাতের পূর্ণাঙ্গ আমল',
        badge: '৫টি পর্ব',
        colorTheme: 'from-orange-500/20 to-amber-600/20 border-orange-400/60',
        itemCount: 5,
        scheduleSupported: true
      },
      {
        id: 'bangla_waz',
        titleBn: 'বাংলা ওয়াজ, তাফসীর ও জীবনভিত্তিক নসিহত',
        titleEn: 'Bangla Islamic Lectures & Tafsir',
        icon: 'Mic',
        descriptionBn: 'সমকালীন জীবন, পরিবার ও ঈমান বৃদ্ধির নির্ভরযোগ্য বাংলা আলোচনা',
        badge: 'নির্বাচিত পর্ব',
        colorTheme: 'from-violet-500/20 to-purple-600/20 border-violet-400/60',
        itemCount: 5,
        scheduleSupported: true
      }
    ];

    // Add custom user playlists as dynamic folders
    this.customPlaylists.forEach(cp => {
      baseFolders.push({
        id: `custom_${cp.id}`,
        titleBn: `📁 ${cp.name}`,
        titleEn: cp.name,
        icon: 'FolderPlus',
        descriptionBn: cp.description || (cp.startTime ? `⏰ নির্ধারিত সময়: ${cp.startTime} - ${cp.endTime}` : 'ব্যবহারকারীর কাস্টম প্লেলিস্ট'),
        badge: `${cp.trackIds.length} টি ট্র্যাক`,
        colorTheme: 'from-emerald-700/30 to-teal-800/30 border-emerald-500/70',
        itemCount: cp.trackIds.length,
        isCustom: true,
        scheduleSupported: !!cp.startTime
      });
    });

    return baseFolders;
  }

  // ================= TRACKS PER FOLDER =================
  public getTracksInFolder(folderId: string): PlayableTrack[] {
    const allTracks = this.getAllTracks();

    if (folderId === 'favorites') {
      return allTracks.filter(t => this.favorites.has(t.id));
    }

    if (folderId.startsWith('custom_')) {
      const customId = folderId.replace('custom_', '');
      const playlist = this.customPlaylists.find(p => p.id === customId);
      if (!playlist) return [];
      const set = new Set(playlist.trackIds);
      return allTracks.filter(t => set.has(t.id));
    }

    return allTracks.filter(t => t.folderId === folderId);
  }

  // Master catalog of all playable tracks
  public getAllTracks(): PlayableTrack[] {
    const tracks: PlayableTrack[] = [];

    // 1. Hisnul Muslim tracks
    HISNUL_MUSLIM_ITEMS.forEach((hm) => {
      tracks.push({
        id: hm.id,
        title: hm.titleBn,
        subtitle: hm.chapterTitleBn,
        reciterOrScholar: 'শায়খ সাঈদ আল-ক্বাহত্বানী • বিশুদ্ধ উচ্চারণ',
        audioUrl: hm.audioUrl,
        backupUrl: hm.backupAudioUrl,
        folderId: 'hisnul_muslim',
        folderTitleBn: 'হিসনুল মুসলিম (حصن المسلم)',
        startTime: hm.timeSlotSuggestion?.startTime,
        endTime: hm.timeSlotSuggestion?.endTime,
        categoryBn: hm.chapterTitleBn,
        arabicText: hm.arabicText,
        transliterationBn: hm.transliterationBn,
        translationBn: hm.translationBn,
        referenceBn: hm.referenceBn,
        virtueBn: hm.virtueAndBenefitBn,
        videoId: hm.videoId,
        pdfPage: hm.pdfPageNumber,
        isFavorite: this.favorites.has(hm.id)
      });
    });

    // 2. 24/7 Scheduled Routine Radio tracks
    const SCHEDULED_RADIO_ITEMS: {
      id: string;
      title: string;
      reciterOrScholar: string;
      startTime: string;
      endTime: string;
      audioUrl: string;
      categoryBn: string;
      arabicText?: string;
      transliterationBn?: string;
      translationBn?: string;
    }[] = [
      {
        id: 'sch-01',
        title: 'ফজর পূর্ব তাহাজ্জুদ ও কুরআন তিলাওয়াত (সূরা সাজদাহ)',
        reciterOrScholar: 'শায়খ মিশারী রশিদ আল-আফাসী',
        startTime: '04:00',
        endTime: '05:00',
        audioUrl: resolveAudioUrlFromTitle('সূরা সাজদাহ'),
        categoryBn: 'কুরআন তিলাওয়াত',
        arabicText: 'الم ۝ تَنزِيلُ الْكِتَابِ لَا رَيْبَ فِيهِ مِن رَّبِّ الْعَالَمِينَ',
        transliterationBn: 'আলিফ-লাম-মীম। তানযীলুল কিতাবি লা রায়বা ফীহি মির রাব্বিল ‘আলামীন।',
        translationBn: 'আলিফ-লাম-মীম। এ কিতাবের অবতরণ বিশ্বজগতের প্রতিপালকের পক্ষ থেকে, এতে কোনো সন্দেহ নেই।'
      },
      {
        id: 'sch-02',
        title: 'সকালের মাসনূন জিকির ও সাইয়্যিদুল ইস্তিগফার (হিসনুল মুসলিম)',
        reciterOrScholar: 'শায়খ সাঈদ আল-ক্বাহত্বানী বিশুদ্ধ পাঠ',
        startTime: '05:00',
        endTime: '06:30',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
        categoryBn: 'মাসনূন আজকার',
        arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
        transliterationBn: 'আল্লাহুম্মা আনতা রব্বী লা ইলাহা ইল্লা আনতা...',
        translationBn: 'হে আল্লাহ! আপনিই আমার প্রতিপালক, আপনি ছাড়া কোনো সত্য উপাস্য নেই...'
      },
      {
        id: 'sch-03',
        title: 'সূরা ইয়াসীন ও সকালের প্রশান্তি তিলাওয়াত',
        reciterOrScholar: 'শায়খ আব্দুর রহমান আস-সুদাইস',
        startTime: '06:30',
        endTime: '08:00',
        audioUrl: resolveAudioUrlFromTitle('সূরা ইয়াসীন'),
        categoryBn: 'কুরআন তিলাওয়াত',
        arabicText: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
        transliterationBn: 'ইয়াসীন। ওয়াল কুরআনিল হাকীম। ইন্নাকা লামিনাল মুরসালীন।',
        translationBn: 'ইয়াসীন। প্রজ্ঞাময় কুরআনের শপথ! নিশ্চয়ই আপনি রাসূলগণের একজন।'
      },
      {
        id: 'sch-04',
        title: 'সালাতুদ দুহা ও কর্মক্ষেত্রের বরকতময় দোয়া',
        reciterOrScholar: 'মাওলানা তারেক জামিল (বাংলা অনুবাদসহ)',
        startTime: '08:00',
        endTime: '10:00',
        audioUrl: resolveAudioUrlFromTitle('সূরা আর-রহমান'),
        categoryBn: 'দ্বীনি নসিহত',
        arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
        transliterationBn: 'আল্লাহুম্মা ইন্নী আসআলুকা ইলমান নাফিআ, ওয়া রিযকান তইয়িবা, ওয়া আমালান মুতাক্বব্বালা।',
        translationBn: 'হে আল্লাহ! আমি আপনার কাছে উপকারী জ্ঞান, পবিত্র রিজিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।'
      },
      {
        id: 'sch-05',
        title: 'সূরা আর-রহমান ও রিজিক বৃদ্ধির আলোচনা',
        reciterOrScholar: 'শায়খ আব্দুল বাসিত আব্দুল সামাদ',
        startTime: '10:00',
        endTime: '12:00',
        audioUrl: resolveAudioUrlFromTitle('সূরা রহমান'),
        categoryBn: 'কুরআন ও বরকত',
        arabicText: 'الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ ۝ عَلَّمَهُ الْبَيَانَ',
        transliterationBn: 'আর-রহমান। আল্লামাল কুরআন। খালাকাল ইনসান। আল্লামাহুল বায়ান।',
        translationBn: 'পরম দয়াময় আল্লাহ। তিনিই শিক্ষা দিয়েছেন কুরআন। সৃষ্টি করেছেন মানুষ। তাকে শিখিয়েছেন ভাব প্রকাশ।'
      },
      {
        id: 'sch-06',
        title: 'জোহর সালাত পূর্ব প্রস্তুতি ও সূরা ওয়াকিয়াহ',
        reciterOrScholar: 'শায়খ সাউদ আশ-শুরাইম',
        startTime: '12:00',
        endTime: '13:30',
        audioUrl: resolveAudioUrlFromTitle('সূরা ওয়াকিয়াহ'),
        categoryBn: 'সালাত ও কুরআন',
        arabicText: 'إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَّافِعَةٌ ۝ إِذَا رُجَّتِ الْأَرْضُ رَجًّا',
        transliterationBn: 'ইযা ওয়াক্বা‘আতিল ওয়াকি‘আহ। লায়সা লিওয়াক্ব‘আতিহা কাযিবাহ। খাফিদাতুর রাফি‘আহ। ইযা রুজ্জাতিল আরদু রাজ্জা।',
        translationBn: 'যখন কিয়ামত সংঘটিত হবে, যার সংঘটনকে অস্বীকার করার কেউ নেই। তা কাউকে করবে অবনত, কাউকে করবে উন্নত। যখন পৃথিবী প্রবলভাবে প্রকম্পিত হবে।'
      },
      {
        id: 'sch-07',
        title: 'দুপুরের বিশ্রাম ও রুকাইয়া শারইয়্যাহ (আত্মরক্ষা)',
        reciterOrScholar: 'শায়খ ইদ্রিস আবকার',
        startTime: '13:30',
        endTime: '15:30',
        audioUrl: resolveAudioUrlFromTitle('সূরা বাকারা'),
        categoryBn: 'রুকাইয়া ও শেফা',
        arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
        transliterationBn: 'আল্লাহু লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূম। লা তা’খুযুহু সিনাতুঁও ওয়ালা নাওম। লাহু মা ফিস সামাওয়াতি ওয়ামা ফিল আরদ।',
        translationBn: 'আল্লাহ, তিনি ছাড়া কোনো সত্য উপাস্য নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তন্দ্রা ও নিদ্রা তাঁকে স্পর্শ করে না। আকাশমণ্ডলী ও পৃথিবীতে যা কিছু আছে সবই তাঁর।'
      },
      {
        id: 'sch-08',
        title: 'আসর পরবর্তী নসিহত ও সহীহ হাদিস পাঠ',
        reciterOrScholar: 'শায়খ আহমাদুল্লাহ (সহীহ বুখারী পাঠ)',
        startTime: '15:30',
        endTime: '17:30',
        audioUrl: resolveAudioUrlFromTitle('সূরা কাহফ'),
        categoryBn: 'হাদিস ও নসিহত',
        arabicText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliterationBn: 'আল্লাহুম্মা সাল্লি ‘আলা মুহাম্মাদিঁও ওয়া ‘আলা আলি মুহাম্মাদ, কামা সাল্লায়তা ‘আলা ইবরাহীমা ওয়া ‘আলা আলি ইবরাহীম, ইন্নাকা হামীদুম মাজীদ।',
        translationBn: 'হে আল্লাহ! আপনি মুহাম্মাদ (সা.) এবং তাঁর পরিবারবর্গের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহীম (আ.) ও তাঁর বংশধরের ওপর রহমত বর্ষণ করেছিলেন।'
      },
      {
        id: 'sch-09',
        title: 'মাগরিবের পর সন্ধ্যার আজকার ও ইস্তিগফার খতম',
        reciterOrScholar: 'শায়খ সাঈদ আল-ক্বাহত্বানী',
        startTime: '17:30',
        endTime: '19:30',
        audioUrl: resolveAudioUrlFromTitle('সূরা ফালাক'),
        categoryBn: 'সন্ধ্যার আজকার',
        arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ',
        transliterationBn: 'আমসাইনা ওয়া আমসাল মুলকু লিল্লাহ, ওয়ালহামদু লিল্লাহ, লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু।',
        translationBn: 'আমরা এবং সারা সৃষ্টি আল্লাহর উদ্দেশ্যে সন্ধ্যায় উপনীত হলাম। সকল প্রশংসা আল্লাহর। একমাত্র আল্লাহ ছাড়া কোনো সত্য মাবুদ নেই, তাঁর কোনো শরিক নেই।'
      },
      {
        id: 'sch-10',
        title: 'এশার সালাত ও রাতের আরামদায়ক কুরআন তিলাওয়াত',
        reciterOrScholar: 'শায়খ ইয়াসির আদ-দাওসারী',
        startTime: '19:30',
        endTime: '21:30',
        audioUrl: resolveAudioUrlFromTitle('সূরা মুলক'),
        categoryBn: 'কুরআন তিলাওয়াত',
        arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
        transliterationBn: 'তাবারাকাল্লাযী বিইয়াদিহিল মুলকু ওয়াহুওয়া ‘আলা কুল্লি শাইয়িন ক্বাদীর। আল্লাযী খালাকাল মাওতা ওয়াল হায়াতা লিইয়াবলুওয়াকুম আইয়্যুকুম আহসানু আমালা।',
        translationBn: 'বরকতময় তিনি যাঁর হাতে রয়েছে সর্বময় কর্তৃত্ব, আর তিনি সবকিছুর ওপর ক্ষমতাবান। যিনি সৃষ্টি করেছেন মৃত্যু ও জীবন, তোমাদেরকে পরীক্ষা করার জন্য—কে তোমাদের মধ্যে আমলে সেরা।'
      },
      {
        id: 'sch-11',
        title: 'ঘুমানোর সুন্নাত ও সূরা আল-মুলক তিলাওয়াত',
        reciterOrScholar: 'শায়খ মিশারী রশিদ আল-আফাসী',
        startTime: '21:30',
        endTime: '23:30',
        audioUrl: resolveAudioUrlFromTitle('সূরা মুলক'),
        categoryBn: 'রাতের আমল',
        arabicText: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
        transliterationBn: 'বিসমিকা রব্বী ওয়াদ্বা‘তু জাম্বী, ওয়াবিকা আরফা‘উহু, ফাইন্ আমসাকতা নাফসী ফারহামহা, ওয়া ইন্ আরসালতাহা ফাহফাযহা বিমা তাহফাযু বিহী ‘ইবাদাকাছ্ ছালিহীন।',
        translationBn: 'হে আমার প্রতিপালক! আপনার নামেই আমার দেহ শয্যায় রাখলাম এবং আপনার নামেই তা তুলব। যদি আপনি আমার প্রাণ রেখে দেন তবে তার প্রতি দয়া করবেন, আর যদি ছেড়ে দেন তবে তাকে রক্ষা করবেন যেমন আপনি আপনার নেককার বান্দাদের রক্ষা করেন।'
      },
      {
        id: 'sch-12',
        title: 'গভীর রাতের তিলাওয়াত ও ইস্তিগফার (তাহাজ্জুদ প্রস্তুতি)',
        reciterOrScholar: 'শায়খ মাহের আল-মুয়াইক্বলী',
        startTime: '23:30',
        endTime: '04:00',
        audioUrl: resolveAudioUrlFromTitle('সূরা বাকারা'),
        categoryBn: 'তাহাজ্জুদ ও তাওবা',
        arabicText: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ ۝ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliterationBn: 'আস্তাগফিরুল্লাহাল্লাযী লা ইলাহা ইল্লা হুওয়াল হাইয়্যুল ক্বাইয়্যূমু ওয়া আতূবু ইলাইহি। রব্বানা আতিনা ফিদ্দুনয়া হাসানাতাঁও ওয়া ফিল আখিরাতি হাসানাতাঁও ওয়া ক্বিনা ‘আযাবান নার।',
        translationBn: 'আমি আল্লাহর কাছে ক্ষমা প্রার্থনা করছি, যিনি ছাড়া কোনো উপাস্য নেই, যিনি চিরঞ্জীব ও চিরস্থায়ী এবং তাঁর কাছেই তাওবা করছি। হে আমাদের প্রতিপালক! আমাদের ইহকালে কল্যাণ দিন এবং পরকালেও কল্যাণ দিন।'
      }
    ];

    SCHEDULED_RADIO_ITEMS.forEach((item) => {
      tracks.push({
        id: item.id,
        title: item.title,
        reciterOrScholar: item.reciterOrScholar,
        audioUrl: item.audioUrl,
        folderId: 'schedule_radio',
        folderTitleBn: '২৪/৭ লাইভ রুটিন রেডিও',
        startTime: item.startTime,
        endTime: item.endTime,
        categoryBn: item.categoryBn,
        arabicText: item.arabicText,
        transliterationBn: item.transliterationBn,
        translationBn: item.translationBn,
        referenceBn: `২৪/৭ ইসলামিক রুটিন রেডিও • সময়: ${toBengaliDigits(item.startTime)} - ${toBengaliDigits(item.endTime)}`,
        virtueBn: 'নিয়মিত এই আমল ও তিলাওয়াত শ্রবণ আত্মিক প্রশান্তি বৃদ্ধি করে ও দৈনন্দিন জীবনে বরকত আনে।',
        isFavorite: this.favorites.has(item.id)
      });
    });

    // 3. Holy Quran 114 Surahs (Full library with rich Arabic & Bengali metadata)
    ALL_114_SURAHS.forEach((surah) => {
      const trackId = `surah-${surah.number}`;
      tracks.push({
        id: trackId,
        title: `${toBengaliDigits(surah.number)}. ${surah.nameBn} (${surah.nameAr})`,
        subtitle: `${toBengaliDigits(surah.numberOfAyahs)} আয়াত • ${surah.revelationTypeBn} • অর্থ: ${surah.meaningBn}`,
        reciterOrScholar: surah.reciterNameBn || 'শায়খ মিশারী রশিদ আল-আফাসী',
        audioUrl: surah.audioUrl,
        backupUrl: `https://server8.mp3quran.net/afs/${String(surah.number).padStart(3, '0')}.mp3`,
        folderId: 'quran_recitations',
        folderTitleBn: 'পবিত্র কুরআন তিলাওয়াত',
        categoryBn: 'কুরআন তিলাওয়াত',
        arabicText: surah.number === 1
          ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ'
          : `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • ${surah.nameAr}`,
        transliterationBn: `বিসমিল্লাহির রাহমানির রাহীম • ${surah.nameBn} (${surah.nameEn})`,
        translationBn: `পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি • সূরার ভাবার্থ: ${surah.meaningBn} (মোট আয়াত: ${toBengaliDigits(surah.numberOfAyahs)} টি, অবতীর্ণ: ${surah.revelationTypeBn})`,
        referenceBn: `পবিত্র আল-কুরআন • সূরা নং ${toBengaliDigits(surah.number)}`,
        virtueBn: `রাসূলুল্লাহ (সা.) বলেছেন: যে ব্যক্তি কুরআনের একটি হরফ পাঠ করবে সে একটি নেকি পাবে, আর প্রতিটি নেকি দশ গুণ বৃদ্ধি পায়। (সুনানে তিরমিযী)`,
        isFavorite: this.favorites.has(trackId)
      });
    });

    // 4. Radio Series Items (Ruqyah, Barakah, Shifa, Mental Peace, etc.)
    const seriesList = Object.entries(RADIO_SERIES_ITEMS);
    seriesList.forEach(([catKey, items]) => {
      const cat = RADIO_SERIES_CATEGORIES.find(c => c.id === catKey);
      items.forEach((seriesItem, idx) => {
        const trackId = `series-${catKey}-${idx}`;
        tracks.push({
          id: trackId,
          title: seriesItem.title,
          subtitle: cat?.taglineBn || 'ইসলামিক অডিও সিরিজ',
          reciterOrScholar: seriesItem.reciterOrScholar || 'বিশিষ্ট ইসলামিক আলেম',
          audioUrl: seriesItem.audioStreamUrl || resolveAudioUrlFromTitle(seriesItem.title),
          folderId: catKey || 'ruqyah',
          folderTitleBn: cat?.nameBn || 'ইসলামিক সিরিজ',
          categoryBn: cat?.nameBn || 'সিরিজ',
          startTime: seriesItem.startTime,
          endTime: seriesItem.endTime,
          arabicText: seriesItem.arabicVerseOrDhikr,
          transliterationBn: seriesItem.bengaliPronunciation,
          translationBn: seriesItem.bengaliMeaning,
          virtueBn: seriesItem.realLifeActionBn,
          isFavorite: this.favorites.has(trackId)
        });
      });
    });

    return tracks;
  }

  // ================= 24/7 SCHEDULE LOGIC =================
  public getCurrentlyScheduledTrack(nowDate: Date = new Date()): {
    track: PlayableTrack;
    nextTrack: PlayableTrack;
    timeRemainingText: string;
    isNowPlaying: boolean;
  } {
    const scheduledTracks = this.getAllTracks().filter(t => t.startTime && t.endTime);
    if (scheduledTracks.length === 0) {
      const fallback = this.getAllTracks()[0];
      return {
        track: fallback,
        nextTrack: fallback,
        timeRemainingText: '',
        isNowPlaying: true
      };
    }

    const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    const parseToMinutes = (timeStr: string): number => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    let matchedTrack = scheduledTracks[0];
    let nextTrack = scheduledTracks[1] || scheduledTracks[0];

    for (let i = 0; i < scheduledTracks.length; i++) {
      const item = scheduledTracks[i];
      const startMin = parseToMinutes(item.startTime!);
      const endMin = parseToMinutes(item.endTime!);

      if (startMin <= endMin) {
        // Normal daytime window (e.g. 05:00 - 06:30)
        if (currentMinutes >= startMin && currentMinutes < endMin) {
          matchedTrack = item;
          nextTrack = scheduledTracks[(i + 1) % scheduledTracks.length];
          break;
        }
      } else {
        // Midnight crossing window (e.g. 23:30 - 04:00)
        if (currentMinutes >= startMin || currentMinutes < endMin) {
          matchedTrack = item;
          nextTrack = scheduledTracks[(i + 1) % scheduledTracks.length];
          break;
        }
      }
    }

    // Calculate time remaining in current window
    let diffMinutes = 0;
    const endMin = parseToMinutes(matchedTrack.endTime!);
    if (endMin >= currentMinutes) {
      diffMinutes = endMin - currentMinutes;
    } else {
      diffMinutes = (1440 - currentMinutes) + endMin;
    }

    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    const timeRemainingText = hrs > 0 ? `${toBengaliDigits(hrs)} ঘণ্টা ${toBengaliDigits(mins)} মিনিট বাকি` : `${toBengaliDigits(mins)} মিনিট বাকি`;

    return {
      track: matchedTrack,
      nextTrack,
      timeRemainingText,
      isNowPlaying: true
    };
  }

  // Calculate 24-hour visual progress, active slot, and time remaining for a folder
  public getFolderScheduleInfo(folderId: string, nowDate: Date = new Date()): FolderScheduleInfo {
    const tracks = this.getTracksInFolder(folderId);
    const folder = this.getFolders().find(f => f.id === folderId);
    const currentMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    const parseToMinutes = (timeStr: string): number => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const timeSlots: { start: string; end: string; title: string; trackId: string }[] = [];
    tracks.forEach(t => {
      if (t.startTime && t.endTime) {
        timeSlots.push({
          start: t.startTime,
          end: t.endTime,
          title: t.title,
          trackId: t.id
        });
      }
    });

    let isCurrentlyActive = false;
    let activeTrackTitle: string | undefined;
    let minutesRemaining: number | undefined;
    let timeRemainingBn: string | undefined;
    let finishTime: string | undefined;
    let totalMinutesCovered = 0;

    timeSlots.forEach(slot => {
      const s = parseToMinutes(slot.start);
      const e = parseToMinutes(slot.end);
      const slotDuration = s <= e ? e - s : (1440 - s) + e;
      totalMinutesCovered += slotDuration;

      const inSlot = s <= e
        ? (currentMinutes >= s && currentMinutes < e)
        : (currentMinutes >= s || currentMinutes < e);

      if (inSlot) {
        isCurrentlyActive = true;
        activeTrackTitle = slot.title;
        finishTime = slot.end;
        const diff = e >= currentMinutes ? e - currentMinutes : (1440 - currentMinutes) + e;
        minutesRemaining = diff;
        const hrs = Math.floor(diff / 60);
        const mins = diff % 60;
        timeRemainingBn = hrs > 0 
          ? `${toBengaliDigits(hrs)} ঘণ্টা ${toBengaliDigits(mins)} মিনিট বাকি`
          : `${toBengaliDigits(mins)} মিনিট বাকি`;
      }
    });

    const coveragePercent = Math.min(100, Math.round((totalMinutesCovered / 1440) * 100));

    let formattedRangeBn = '';
    if (timeSlots.length > 0) {
      formattedRangeBn = `${toBengaliDigits(timeSlots[0].start)} - ${toBengaliDigits(timeSlots[timeSlots.length - 1].end)}`;
    } else {
      formattedRangeBn = '২৪/৭ উন্মুক্ত';
    }

    return {
      folderId,
      folderTitleBn: folder?.titleBn || 'ফোল্ডার',
      timeSlots,
      isCurrentlyActive,
      activeTrackTitle,
      minutesRemaining,
      timeRemainingBn,
      finishTime,
      coveragePercent,
      formattedRangeBn,
      hasSchedule: timeSlots.length > 0
    };
  }

  // Calculate free / unallocated time slots across 24 hours (00:00 to 24:00)
  public get24HourFreeTimeSlots(): FreeTimeSlot[] {
    const parseToMinutes = (timeStr: string): number => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const bookedWindows: { startMin: number; endMin: number }[] = [];

    // 1. From 24/7 radio schedule
    const scheduledRadio = this.getAllTracks().filter(
      t => t.folderId === 'schedule_radio' && t.startTime && t.endTime
    );
    scheduledRadio.forEach(t => {
      const s = parseToMinutes(t.startTime!);
      const e = parseToMinutes(t.endTime!);
      if (s <= e) {
        bookedWindows.push({ startMin: s, endMin: e });
      } else {
        bookedWindows.push({ startMin: s, endMin: 1440 });
        bookedWindows.push({ startMin: 0, endMin: e });
      }
    });

    // 2. From custom scheduled playlists
    this.customPlaylists.forEach(cp => {
      if (cp.startTime && cp.endTime) {
        const s = parseToMinutes(cp.startTime);
        const e = parseToMinutes(cp.endTime);
        if (s <= e) {
          bookedWindows.push({ startMin: s, endMin: e });
        } else {
          bookedWindows.push({ startMin: s, endMin: 1440 });
          bookedWindows.push({ startMin: 0, endMin: e });
        }
      }
    });

    // 1440-minute occupancy array
    const minuteOccupied = new Array(1440).fill(false);
    bookedWindows.forEach(w => {
      for (let m = w.startMin; m < w.endMin && m < 1440; m++) {
        minuteOccupied[m] = true;
      }
    });

    const freeSlots: FreeTimeSlot[] = [];
    let inFreeBlock = false;
    let blockStart = 0;

    for (let m = 0; m <= 1440; m++) {
      const isOccupied = m < 1440 ? minuteOccupied[m] : true;
      if (!isOccupied && !inFreeBlock) {
        inFreeBlock = true;
        blockStart = m;
      } else if (isOccupied && inFreeBlock) {
        inFreeBlock = false;
        const duration = m - blockStart;
        if (duration >= 15) {
          const sH = String(Math.floor(blockStart / 60)).padStart(2, '0');
          const sM = String(blockStart % 60).padStart(2, '0');
          const eH = String(Math.floor(m / 60)).padStart(2, '0');
          const eM = String(m % 60).padStart(2, '0');
          const hrs = Math.floor(duration / 60);
          const mins = duration % 60;
          const durationLabelBn = hrs > 0 
            ? (mins > 0 ? `${toBengaliDigits(hrs)} ঘণ্টা ${toBengaliDigits(mins)} মিনিট` : `${toBengaliDigits(hrs)} ঘণ্টা`)
            : `${toBengaliDigits(mins)} মিনিট`;
          
          freeSlots.push({
            id: `free_${sH}${sM}_${eH}${eM}`,
            start: `${sH}:${sM}`,
            end: `${eH}:${eM}`,
            durationMinutes: duration,
            durationLabelBn,
            rangeBn: `${toBengaliDigits(sH)}:${toBengaliDigits(sM)} - ${toBengaliDigits(eH)}:${toBengaliDigits(eM)}`
          });
        }
      }
    }

    // Default slots if fully booked
    if (freeSlots.length === 0) {
      freeSlots.push({
        id: 'free_default_1',
        start: '07:30',
        end: '08:30',
        durationMinutes: 60,
        durationLabelBn: '১ ঘণ্টা',
        rangeBn: '০৭:৩০ - ০৮:৩০'
      });
      freeSlots.push({
        id: 'free_default_2',
        start: '13:30',
        end: '14:30',
        durationMinutes: 60,
        durationLabelBn: '১ ঘণ্টা',
        rangeBn: '১৩:৩০ - ১৪:৩০'
      });
    }

    return freeSlots;
  }

  // ================= FAVORITES =================
  public toggleFavorite(trackId: string): boolean {
    if (this.favorites.has(trackId)) {
      this.favorites.delete(trackId);
    } else {
      this.favorites.add(trackId);
    }
    this.saveFavorites();
    this.notify();
    return this.favorites.has(trackId);
  }

  public isFavorite(trackId: string): boolean {
    return this.favorites.has(trackId);
  }

  // ================= CUSTOM PLAYLISTS =================
  public createCustomPlaylist(name: string, description?: string, startTime?: string, endTime?: string): CustomPlaylist {
    const newPlaylist: CustomPlaylist = {
      id: 'pl_' + Date.now(),
      name: name.trim(),
      description: description?.trim(),
      createdAt: new Date().toISOString(),
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      trackIds: []
    };
    this.customPlaylists.push(newPlaylist);
    this.saveCustomPlaylists();
    this.notify();
    return newPlaylist;
  }

  public deleteCustomPlaylist(id: string) {
    this.customPlaylists = this.customPlaylists.filter(p => p.id !== id);
    this.saveCustomPlaylists();
    this.notify();
  }

  public addTrackToPlaylist(playlistId: string, trackId: string) {
    const pl = this.customPlaylists.find(p => p.id === playlistId);
    if (pl && !pl.trackIds.includes(trackId)) {
      pl.trackIds.push(trackId);
      this.saveCustomPlaylists();
      this.notify();
    }
  }

  public removeTrackFromPlaylist(playlistId: string, trackId: string) {
    const pl = this.customPlaylists.find(p => p.id === playlistId);
    if (pl) {
      pl.trackIds = pl.trackIds.filter(id => id !== trackId);
      this.saveCustomPlaylists();
      this.notify();
    }
  }

  public getCustomPlaylists(): CustomPlaylist[] {
    return [...this.customPlaylists];
  }

  // ================= AUTOPLAY MODE =================
  public isAutoPlayEnabled(): boolean {
    return this.isScheduleAutoPlay;
  }

  public toggleAutoPlay(): boolean {
    this.isScheduleAutoPlay = !this.isScheduleAutoPlay;
    try {
      localStorage.setItem(AUTOPLAY_MODE_STORAGE_KEY, String(this.isScheduleAutoPlay));
    } catch (e) {}
    this.notify();
    return this.isScheduleAutoPlay;
  }

  // ================= GLOBAL PLAYBACK STATE & SINGLETON CONFLICT RESOLUTION =================
  public getActiveTrack(): PlayableTrack | null {
    if (!this.currentActiveTrack) {
      // Default to current schedule track
      const { track } = this.getCurrentlyScheduledTrack();
      return track;
    }
    return this.currentActiveTrack;
  }

  /**
   * Synchronizes the active track when any audio is played anywhere across the entire application.
   * Ensures that ModernMusicPlayerPopup, lyrics/details tab, and audio controllers instantly display
   * the exact authentic audio details, Arabic text, translation, and references.
   */
  public syncActiveTrack(title: string, url: string, extraDetails?: Partial<PlayableTrack>): PlayableTrack {
    const allTracks = this.getAllTracks();

    // 1. Direct match by audioUrl or backupUrl
    let matched = allTracks.find(t => t.audioUrl === url || (t.backupUrl && t.backupUrl === url));

    // 2. Direct match by exact title
    if (!matched && title) {
      matched = allTracks.find(t => t.title === title || t.title.toLowerCase() === title.toLowerCase());
    }

    // 3. Surah detection (by title or url)
    const surahNum = extractSurahNumber(title) || extractSurahNumber(url);
    if (!matched && surahNum !== null && surahNum >= 1 && surahNum <= 114) {
      matched = allTracks.find(t => t.id === `surah-${surahNum}`);
      if (!matched) {
        const surah = ALL_114_SURAHS[surahNum - 1];
        if (surah) {
          matched = {
            id: `surah-${surah.number}`,
            title: `${toBengaliDigits(surah.number)}. ${surah.nameBn} (${surah.nameAr})`,
            subtitle: `${toBengaliDigits(surah.numberOfAyahs)} আয়াত • ${surah.revelationTypeBn} • ভাবার্থ: ${surah.meaningBn}`,
            reciterOrScholar: surah.reciterNameBn || 'শায়খ মিশারী রশিদ আল-আফাসী',
            audioUrl: url || getSurahAudioUrl(surah.number),
            backupUrl: `https://server8.mp3quran.net/afs/${String(surah.number).padStart(3, '0')}.mp3`,
            folderId: 'quran_recitations',
            folderTitleBn: 'পবিত্র কুরআন তিলাওয়াত',
            categoryBn: 'পবিত্র কুরআন তিলাওয়াত',
            arabicText: surah.number === 1
              ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'
              : `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ • ${surah.nameAr}`,
            transliterationBn: `বিসমিল্লাহির রাহমানির রাহীম • ${surah.nameBn} (${surah.nameEn})`,
            translationBn: `পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি • সূরার ভাবার্থ: ${surah.meaningBn} (মোট আয়াত: ${toBengaliDigits(surah.numberOfAyahs)} টি, অবতীর্ণ: ${surah.revelationTypeBn})`,
            referenceBn: `পবিত্র আল-কুরআন • সূরা নং ${toBengaliDigits(surah.number)}`,
            virtueBn: `রাসূলুল্লাহ (সা.) বলেছেন: যে ব্যক্তি কুরআনের একটি হরফ পাঠ করবে সে একটি নেকি পাবে, আর প্রতিটি নেকি দশ গুণ বৃদ্ধি পায়। (সুনানে তিরমিযী)`,
            ...extraDetails
          };
        }
      }
    }

    // 4. Hisnul Muslim detection
    if (!matched && title) {
      const hmMatch = HISNUL_MUSLIM_ITEMS.find(h => 
        title.includes(h.titleBn) || h.titleBn.includes(title) || (h.arabicText && title.includes(h.arabicText.slice(0, 15)))
      );
      if (hmMatch) {
        matched = allTracks.find(t => t.id === hmMatch.id);
      }
    }

    // 5. If not matched in catalog, synthesize a full PlayableTrack
    if (!matched) {
      matched = {
        id: `track-${Date.now()}`,
        title: title || 'ইসলামিক অডিও তিলাওয়াত',
        subtitle: extraDetails?.subtitle || 'বিশুদ্ধ তিলাওয়াত ও অডিও পাঠ',
        reciterOrScholar: extraDetails?.reciterOrScholar || 'বিশিষ্ট ক্বারী ও গবেষক',
        audioUrl: url,
        backupUrl: extraDetails?.backupUrl,
        folderId: extraDetails?.folderId || 'custom',
        folderTitleBn: extraDetails?.folderTitleBn || 'অন্যান্য অডিও সংগ্রহ',
        categoryBn: extraDetails?.categoryBn || 'ইসলামিক অডিও',
        arabicText: extraDetails?.arabicText,
        transliterationBn: extraDetails?.transliterationBn,
        translationBn: extraDetails?.translationBn,
        referenceBn: extraDetails?.referenceBn,
        virtueBn: extraDetails?.virtueBn,
        videoId: extraDetails?.videoId,
        pdfPage: extraDetails?.pdfPage,
        ...extraDetails
      };
    }

    // Ensure audioUrl aligns with currently playing stream
    if (url && matched.audioUrl !== url) {
      matched = { ...matched, audioUrl: url, ...(extraDetails || {}) };
    }

    this.currentActiveTrack = matched;
    if (matched.folderId) {
      this.currentFolderId = matched.folderId;
    }
    this.isPlaying = true;
    this.notify();

    // Broadcast global single-audio event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('global-play-track', {
        detail: {
          title: matched.title,
          url: matched.audioUrl,
          backupUrl: matched.backupUrl,
          track: matched
        }
      }));
    }

    return matched;
  }

  public setActiveTrack(track: PlayableTrack, folderId?: string) {
    this.currentActiveTrack = track;
    if (folderId) {
      this.currentFolderId = folderId;
    }
    this.isPlaying = true;
    this.notify();

    // Broadcast global single-audio event so all components sync to this single audio stream
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('global-play-track', {
        detail: {
          title: track.title,
          url: track.audioUrl,
          backupUrl: track.backupUrl,
          track
        }
      }));
    }
  }

  public getPlaybackState(): {
    isPlaying: boolean;
    activeTrack: PlayableTrack | null;
    isScheduleAutoPlay: boolean;
    currentFolderId: string;
  } {
    return {
      isPlaying: this.isPlaying,
      activeTrack: this.getActiveTrack(),
      isScheduleAutoPlay: this.isScheduleAutoPlay,
      currentFolderId: this.currentFolderId
    };
  }

  public setPlayState(playing: boolean) {
    this.isPlaying = playing;
    this.notify();
  }
}

export const playlistManager = AudioPlaylistManager.getInstance();
