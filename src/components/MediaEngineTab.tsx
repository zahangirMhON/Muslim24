import React, { useState, useEffect, useMemo } from 'react';
import {
  Radio,
  Play,
  Pause,
  RefreshCw,
  Clock,
  Volume2,
  ShieldAlert,
  Calendar,
  Plus,
  CheckCircle,
  AlertTriangle,
  Music,
  Trash2,
  HelpCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Info,
  Search,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Heart,
  Sun,
  Moon,
  Copy,
  Check,
  Sliders,
  Edit3,
  ListPlus,
  CheckCircle2
} from 'lucide-react';
import { MediaScheduleItem, StreamStatus, DEFAULT_247_SCHEDULE } from '../services/mediaEngine';
import { ALL_114_SURAHS, SurahItem } from '../data/allSurahsData';
import { SHORT_AND_ESSENTIAL_SURAHS, SPECIAL_ESSENTIAL_VERSES } from '../data/shortSurahsFullData';
import { SurahFullVerseModal } from './SurahFullVerseModal';
import { RADIO_SERIES_CATEGORIES, RADIO_SERIES_ITEMS, RadioSeriesCategory } from '../data/radioSeriesData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { resolveAudioUrlFromTitle } from '../utils/audioResolver';
import { SpiritualDhikrSection } from './SpiritualDhikrSection';
import { MediaCategorySuggestions } from './MediaCategorySuggestions';
import { QuickScheduleSearchModal } from './QuickScheduleSearchModal';
import { SpiritualDhikrItem } from '../data/spiritualDhikrData';

interface Props {
  lang: 'bn' | 'en' | 'ar';
  audioMode?: 'both' | 'arabic_only';
  onToggleAudioMode?: (mode: 'both' | 'arabic_only') => void;
  onPlayAudio?: (title: string, url: string) => void;
  currentlyPlayingUrl?: string;
  isPlaying?: boolean;
}

// Helper function to extract YouTube video ID from various YouTube URL formats
const extractYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Convert HH:MM string to minutes for calculation
const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
};

// Check for time overlap in schedule to prevent conflicting entries
const findScheduleConflict = (
  start: string,
  end: string,
  scheduleList: MediaScheduleItem[],
  excludeId?: string
): MediaScheduleItem | null => {
  const startMin = parseTimeToMinutes(start);
  let endMin = parseTimeToMinutes(end);
  if (endMin <= startMin) endMin = 24 * 60;

  for (const item of scheduleList) {
    if (excludeId && item.id === excludeId) continue;
    const itemStartMin = parseTimeToMinutes(item.startTime);
    let itemEndMin = parseTimeToMinutes(item.endTime);
    if (itemEndMin <= itemStartMin) itemEndMin = 24 * 60;

    // Exact start time conflict
    if (item.startTime === start) {
      return item;
    }
    // Time interval intersection conflict
    if (startMin < itemEndMin && endMin > itemStartMin) {
      return item;
    }
  }
  return null;
};

// Calculate next unallocated time slot in the 24-hour routine
const getNextFreeTimeSlot = (list: MediaScheduleItem[]): { start: string; end: string } => {
  const sorted = [...list].sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
  let pointer = 0;
  for (const item of sorted) {
    const itemStart = parseTimeToMinutes(item.startTime);
    const itemEnd = parseTimeToMinutes(item.endTime);
    if (itemStart - pointer >= 60) {
      const sH = String(Math.floor(pointer / 60)).padStart(2, '0');
      const sM = String(pointer % 60).padStart(2, '0');
      const eH = String(Math.floor(itemStart / 60)).padStart(2, '0');
      const eM = String(itemStart % 60).padStart(2, '0');
      return { start: `${sH}:${sM}`, end: `${eH}:${eM}` };
    }
    pointer = Math.max(pointer, itemEnd);
  }
  if (pointer < 24 * 60) {
    const sH = String(Math.floor(pointer / 60)).padStart(2, '0');
    const sM = String(pointer % 60).padStart(2, '0');
    return { start: `${sH}:${sM}`, end: '24:00' };
  }
  return { start: '12:00', end: '13:00' };
};

// Preset Stream Options for Quick Fill in Admin Modal
const PRESET_STREAMS = [
  {
    name: '📺 মক্কা লাইভ সম্প্রচার (ইউটিউব এইচডি স্ট্রিম)',
    url: 'https://www.youtube.com/watch?v=17X21gY8s48',
    backup: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3'
  },
  {
    name: '📺 মদিনা লাইভ সম্প্রচার (ইউটিউব এইচডি স্ট্রিম)',
    url: 'https://www.youtube.com/watch?v=1O9J030Rsm0',
    backup: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3'
  },
  {
    name: '🕋 মক্কা আল-মুকাররমা লাইভ কুরআন রেডিও (MP3/Radio)',
    url: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3',
    backup: 'https://server8.mp3quran.net/afs/002.mp3'
  },
  {
    name: '🕌 মদিনা আল-মুনাওয়ারা লাইভ স্ট্রিম (MP3/Radio)',
    url: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
    backup: 'https://server8.mp3quran.net/afs/001.mp3'
  },
  {
    name: '📿 শায়েখ মিশারী রশিদ আল-আফাসী (২৪/৭)',
    url: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/36.mp3',
    backup: 'https://server8.mp3quran.net/afs/036.mp3'
  },
  {
    name: '📖 শায়েখ আবদুর রহমান আস-সুদাইস (কুরআন)',
    url: 'https://server11.mp3quran.net/sds/002.mp3',
    backup: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3'
  },
  {
    name: '🎙️ সহীহ বুখারী ও সহীহ হাদিস অডিও স্ট্রিম',
    url: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/67.mp3',
    backup: 'https://server8.mp3quran.net/afs/067.mp3'
  }
];

export const MediaEngineTab: React.FC<Props> = ({
  lang,
  audioMode = 'both',
  onToggleAudioMode,
  onPlayAudio,
  currentlyPlayingUrl,
  isPlaying: isGlobalPlaying
}) => {
  const defaultStatus: StreamStatus = {
    isLive: true,
    activeItem: DEFAULT_247_SCHEDULE[0],
    nextItem: DEFAULT_247_SCHEDULE[1] || DEFAULT_247_SCHEDULE[0],
    isPrayerPause: false,
    usingBackupStream: false,
    playbackSource: DEFAULT_247_SCHEDULE[0].audioStreamUrl,
    timeRemainingMinutes: 120
  };

  const [currentStatus, setCurrentStatus] = useState<StreamStatus | null>(defaultStatus);
  const [schedule, setSchedule] = useState<MediaScheduleItem[]>(DEFAULT_247_SCHEDULE);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [useBackup, setUseBackup] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<MediaScheduleItem | null>(null);

  const triggerPlayAudio = (title: string, rawUrl: string, item?: MediaScheduleItem) => {
    const resolvedUrl = resolveAudioUrlFromTitle(title, rawUrl);
    if (item) {
      setSelectedPreviewItem(item);
    }
    if (onPlayAudio) {
      onPlayAudio(title, resolvedUrl);
    } else {
      setIsPlaying(true);
    }
    setStreamError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemPlaying = (itemUrl: string, title: string) => {
    const resolvedUrl = resolveAudioUrlFromTitle(title, itemUrl);
    if (currentlyPlayingUrl) {
      return currentlyPlayingUrl === resolvedUrl && !!isGlobalPlaying;
    }
    return selectedPreviewItem?.audioStreamUrl === resolvedUrl && isPlaying;
  };

  // Admin Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showQuickSearchModal, setShowQuickSearchModal] = useState<boolean>(false);

  // Form State for Admin Modal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Quran Recitation' | 'Sahih Hadith' | 'Tafsir' | 'Islamic Lecture' | 'Dua & Azkar' | 'Ramadan Special'>('Quran Recitation');
  const [newScholar, setNewScholar] = useState('');
  const [newStart, setNewStart] = useState('00:00');
  const [newEnd, setNewEnd] = useState('04:00');
  const [newRecurrence, setNewRecurrence] = useState<'DAILY' | 'WEEKLY' | 'RAMADAN' | 'SPECIAL_EVENT'>('DAILY');
  const [customStreamUrl, setCustomStreamUrl] = useState('');
  const [customBackupUrl, setCustomBackupUrl] = useState('');

  // Conflict checking for Admin Modal
  const adminScheduleConflict = useMemo(() => {
    return findScheduleConflict(newStart, newEnd, schedule);
  }, [newStart, newEnd, schedule]);

  const handleAutoAdminFreeSlot = () => {
    const slot = getNextFreeTimeSlot(schedule);
    setNewStart(slot.start);
    setNewEnd(slot.end);
  };

  // 114 Surahs Recitation State
  const [surahSearch, setSurahSearch] = useState('');
  const [surahFilter, setSurahFilter] = useState<'all' | 'essential' | 'Meccan' | 'Medinan'>('all');
  const [expandedSurahNumber, setExpandedSurahNumber] = useState<number | null>(null);
  const [readingSurahNumber, setReadingSurahNumber] = useState<number | null>(null);

  // 24/7 Category Series Radio State
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('ruqyah');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [isSpeakingBengali, setIsSpeakingBengali] = useState<boolean>(false);

  // Clean UI Dropdown / Floating Details States
  const [showVerseDetails, setShowVerseDetails] = useState<boolean>(true);
  const [showTafsirGuidance, setShowTafsirGuidance] = useState<boolean>(false);
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  const handleSpeakBengaliTranslation = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('দুঃখিত, আপনার ব্রাউজারে ভয়েস স্পিচ অডিও সাপোর্ট নেই।');
      return;
    }
    if (isSpeakingBengali) {
      window.speechSynthesis.cancel();
      setIsSpeakingBengali(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingBengali(false);
    utterance.onerror = () => setIsSpeakingBengali(false);
    setIsSpeakingBengali(true);
    window.speechSynthesis.speak(utterance);
  };

  // User Custom Radio Playlist / Plans State
  const [customUserPlans, setCustomUserPlans] = useState<MediaScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('user_custom_radio_schedule_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'user-custom-01',
        title: 'আমার সকালের আমল ও সূরা ইয়াছিন তিলাওয়াত',
        category: 'Quran Recitation',
        reciterOrScholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
        startTime: '06:00',
        endTime: '08:00',
        recurrenceType: 'DAILY',
        audioStreamUrl: 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/36.mp3',
        backupStreamUrl: 'https://server8.mp3quran.net/afs/036.mp3',
        arabicVerseOrDhikr: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ ۝ إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
        bengaliPronunciation: 'ইয়াসীন, ওয়াল কুরআনিল হাকীম, ইন্নাকা নামিনাল মুরসালীন',
        bengaliMeaning: 'ইয়া-সীন। প্রজ্ঞাময় কুরআনের শপথ! নিশ্চয়ই তুমি রাসূলদের অন্তর্ভুক্ত।',
        realLifeActionBn: 'সকালে ঘুম থেকে উঠে সূরা ইয়াসীন তিলাওয়াত বা শ্রবণ করলে সারাদিনের প্রয়োজন মেটানোর দায়িত্ব আল্লাহ নেন।'
      }
    ];
  });

  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [cTitle, setCTitle] = useState('');
  const [cScholar, setCScholar] = useState('');
  const [cCategory, setCCategory] = useState<'Quran Recitation' | 'Sahih Hadith' | 'Tafsir' | 'Islamic Lecture' | 'Dua & Azkar' | 'Ruqyah' | 'Barakah' | 'Shifa' | 'Gratitude' | 'Knowledge'>('Quran Recitation');
  const [cStart, setCStart] = useState('06:00');
  const [cEnd, setCEnd] = useState('08:00');
  const [cUrl, setCUrl] = useState('');
  const [cArabic, setCArabic] = useState('');
  const [cPronunciation, setCPronunciation] = useState('');
  const [cMeaning, setCMeaning] = useState('');
  const [cAction, setCAction] = useState('');

  // Conflict checking for Custom Plan Modal
  const customPlanConflict = useMemo(() => {
    return findScheduleConflict(cStart, cEnd, [...schedule, ...customUserPlans]);
  }, [cStart, cEnd, schedule, customUserPlans]);

  const handleAutoCustomFreeSlot = () => {
    const slot = getNextFreeTimeSlot([...schedule, ...customUserPlans]);
    setCStart(slot.start);
    setCEnd(slot.end);
  };

  // Persist Custom User Plans to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('user_custom_radio_schedule_v1', JSON.stringify(customUserPlans));
    } catch (e) {
      console.error(e);
    }
  }, [customUserPlans]);

  const handleCreateCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim()) return;

    if (customPlanConflict) {
      alert(`⚠️ সময় সংঘাত সতর্কতা: ইতিমধ্যে এই সময়ে (${customPlanConflict.startTime} - ${customPlanConflict.endTime}) '${customPlanConflict.title}' অনুষ্ঠানটি বিদ্যমান রয়েছে! একই সময়ে একাধিক এন্ট্রি করা যাবে না। অনুগ্রহ করে ভিন্ন সময় নির্বাচন করুন।`);
      return;
    }

    const newItem: MediaScheduleItem = {
      id: `usr-plan-${Date.now()}`,
      title: cTitle.trim(),
      category: cCategory,
      reciterOrScholar: cScholar.trim() || 'আমার পছন্দের ক্বারী / শায়েখ',
      startTime: cStart.trim() || '00:00',
      endTime: cEnd.trim() || '23:59',
      recurrenceType: 'DAILY',
      audioStreamUrl: cUrl.trim() || 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3',
      backupStreamUrl: cUrl.trim() || 'https://server8.mp3quran.net/afs/002.mp3',
      arabicVerseOrDhikr: cArabic.trim() || undefined,
      bengaliPronunciation: cPronunciation.trim() || undefined,
      bengaliMeaning: cMeaning.trim() || undefined,
      realLifeActionBn: cAction.trim() || undefined
    };

    setCustomUserPlans([newItem, ...customUserPlans]);
    setShowCustomModal(false);
    // Reset Form
    setCTitle('');
    setCScholar('');
    setCUrl('');
    setCArabic('');
    setCPronunciation('');
    setCMeaning('');
    setCAction('');

    // Automatically preview and play newly created custom plan
    setSelectedPreviewItem(newItem);
    setIsPlaying(true);
    setStreamError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaySpiritualDhikr = (title: string, audioUrl: string, youtubeUrl?: string) => {
    const targetUrl = youtubeUrl || audioUrl;
    const dhikrMediaItem: MediaScheduleItem = {
      id: `dhikr-${Date.now()}`,
      category: 'Dua & Azkar',
      title: `🤲 ${title}`,
      reciterOrScholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
      startTime: '00:00',
      endTime: '23:59',
      recurrenceType: 'DAILY',
      audioStreamUrl: targetUrl,
      backupStreamUrl: audioUrl,
      arabicVerseOrDhikr: title,
      bengaliPronunciation: title,
      bengaliMeaning: 'আল্লাহর পবিত্রতা, মহিমা ও কৃতজ্ঞতা প্রকাশ'
    };
    triggerPlayAudio(title, targetUrl, dhikrMediaItem);
  };

  const handleAddToScheduleFromDhikr = (dhikr: SpiritualDhikrItem) => {
    setNewTitle(dhikr.bengaliTitle);
    setNewScholar('শায়েখ মিশারী রশিদ আল-আফাসী');
    setNewCategory('Dua & Azkar');
    setCustomStreamUrl(dhikr.youtubeUrl || dhikr.audioUrl);
    setCustomBackupUrl(dhikr.audioUrl);
    const slot = getNextFreeTimeSlot(schedule);
    setNewStart(slot.start);
    setNewEnd(slot.end);
    setShowAddModal(true);
  };

  const handleSelectSuggestionForSchedule = (sug: {
    title: string;
    scholar: string;
    startTime: string;
    endTime: string;
    category: any;
    audioUrl: string;
    youtubeUrl?: string;
    arabicVerse?: string;
    bengaliMeaning?: string;
  }) => {
    setNewTitle(sug.title);
    setNewScholar(sug.scholar);
    setNewCategory(sug.category || 'Quran Recitation');
    setCustomStreamUrl(sug.youtubeUrl || sug.audioUrl);
    setCustomBackupUrl(sug.audioUrl);
    
    // Check if suggested time conflicts; if so, assign next available free slot!
    const conflict = findScheduleConflict(sug.startTime, sug.endTime, schedule);
    if (conflict) {
      const slot = getNextFreeTimeSlot(schedule);
      setNewStart(slot.start);
      setNewEnd(slot.end);
    } else {
      setNewStart(sug.startTime);
      setNewEnd(sug.endTime);
    }

    setShowAddModal(true);
  };

  const handleQuickAddScheduleItem = (item: Omit<MediaScheduleItem, 'id'>): boolean => {
    const conflict = findScheduleConflict(item.startTime, item.endTime, schedule);
    if (conflict) {
      alert(`⚠️ সময় সংঘাত সতর্কবার্তা: ইতিমধ্যে এই সময়ে (${conflict.startTime} - ${conflict.endTime}) '${conflict.title}' অনুষ্ঠানটি তালিকাভুক্ত রয়েছে! একই সময়ে একাধিক এন্ট্রি করা যাবে না।`);
      return false;
    }

    const newItem: MediaScheduleItem = {
      ...item,
      id: `sch-quick-${Date.now()}`
    };

    setSchedule([...schedule, newItem]);

    // Send to backend
    fetch('/api/v1/admin/media/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(console.error);

    return true;
  };

  const handleDeleteCustomPlan = (id: string) => {
    if (!confirm('আপনি কি এই কাস্টম প্লেলিস্ট রেডিও আইটেমটি মুছে ফেলতে চান?')) return;
    setCustomUserPlans(customUserPlans.filter(item => item.id !== id));
    if (selectedPreviewItem?.id === id) {
      setSelectedPreviewItem(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const handlePlaySurah = (surah: SurahItem) => {
    const title = `সূরা ${surah.nameBn} (${surah.nameAr}) - সম্পূর্ণ তিলাওয়াত`;
    const surahMediaItem: MediaScheduleItem = {
      id: `surah-${surah.number}`,
      category: 'Quran Recitation',
      title,
      reciterOrScholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
      startTime: '00:00',
      endTime: '23:59',
      recurrenceType: 'DAILY',
      audioStreamUrl: surah.audioUrl,
      backupStreamUrl: surah.audioUrl,
      arabicVerseOrDhikr: surah.nameAr,
      bengaliPronunciation: `সূরা ${surah.nameBn} (${surah.nameEn})`,
      bengaliMeaning: `বাংলা অর্থ: ${surah.meaningBn} (${toBengaliDigits(surah.numberOfAyahs)} আয়াত, ${surah.revelationTypeBn})`
    };
    triggerPlayAudio(title, surah.audioUrl, surahMediaItem);
  };

  const filteredSurahs = ALL_114_SURAHS.filter(surah => {
    if (surahFilter === 'essential') {
      const isEssential = SHORT_AND_ESSENTIAL_SURAHS.some(s => s.number === surah.number);
      if (!isEssential) return false;
    } else if (surahFilter !== 'all' && surah.revelationType !== surahFilter) {
      return false;
    }
    if (!surahSearch.trim()) return true;
    const q = surahSearch.toLowerCase().trim();
    return (
      surah.number.toString().includes(q) ||
      toBengaliDigits(surah.number).includes(q) ||
      surah.nameBn.toLowerCase().includes(q) ||
      surah.nameAr.toLowerCase().includes(q) ||
      surah.meaningBn.toLowerCase().includes(q) ||
      surah.nameEn.toLowerCase().includes(q)
    );
  });

  const fetchCurrentBroadcast = async () => {
    try {
      const res = await fetch('/api/v1/media/current');
      if (res && res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.status) {
          setCurrentStatus(data.status);
        }
      }
    } catch (e) {
      // Offline fallback: keep existing or default state
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch('/api/v1/media/schedule');
      if (res && res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.schedule && Array.isArray(data.schedule) && data.schedule.length > 0) {
          setSchedule(data.schedule);
        }
      }
    } catch (e) {
      // Offline fallback: keep existing or default state
    }
  };

  useEffect(() => {
    fetchCurrentBroadcast();
    fetchSchedule();
    const interval = setInterval(fetchCurrentBroadcast, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    setStreamError(false);
  };

  const handleStreamError = () => {
    setStreamError(true);
    if (!useBackup) {
      setUseBackup(true); // Auto retry with backup
    }
  };

  const handleAddScheduleItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newScholar) return;

    // If no custom URL provided, default to auto-detected high quality CDN
    const finalStreamUrl = customStreamUrl.trim() || 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/2.mp3';
    const finalBackupUrl = customBackupUrl.trim() || 'https://server8.mp3quran.net/afs/002.mp3';

    try {
      await fetch('/api/v1/admin/media/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          reciterOrScholar: newScholar,
          startTime: newStart,
          endTime: newEnd,
          recurrenceType: newRecurrence,
          audioStreamUrl: finalStreamUrl,
          backupStreamUrl: finalBackupUrl
        })
      });

      setShowAddModal(false);
      setNewTitle('');
      setNewScholar('');
      setCustomStreamUrl('');
      setCustomBackupUrl('');
      fetchSchedule();
      fetchCurrentBroadcast();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteScheduleItem = async (id: string) => {
    if (!confirm('আপনি কি সত্যিই এই শিডিউল প্রোগ্রামটি মুছে ফেলতে চান?')) return;
    try {
      await fetch(`/api/v1/admin/media/schedule/${id}`, { method: 'DELETE' });
      fetchSchedule();
      fetchCurrentBroadcast();
    } catch (e) {
      console.error(e);
    }
  };

  const applyPresetStream = (preset: typeof PRESET_STREAMS[0]) => {
    setCustomStreamUrl(preset.url);
    setCustomBackupUrl(preset.backup);
  };

  const activeItem = selectedPreviewItem || currentStatus?.activeItem;
  const isPrayerPause = currentStatus?.isPrayerPause;
  const isPreviewMode = !!selectedPreviewItem;

  return (
    <div className="space-y-6">
      
      {/* 24/7 Live Radio Player Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 border-2 border-amber-400/60 rounded-2xl p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Radio className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 space-y-4">
          
          {/* Header & Live Badge & Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
              <span className="text-xs font-black tracking-wide text-rose-300 bg-rose-950/90 border border-rose-800 px-3 py-1 rounded-full shadow">
                ২৪/৭ সরাসরি ইসলামিক সম্প্রচার ব্যবস্থা
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuickSearchModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer transform hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>১-ক্লিক সার্চ ও ২৪/৭ শিডিউল যোগ</span>
              </button>

              <button
                onClick={() => setShowGuideModal(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-200 border border-teal-600/60 text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>অডিও নির্দেশিকা</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>শিডিউল কাস্টমাইজ</span>
              </button>
            </div>
          </div>

          {/* Current Program Details */}
          {activeItem && (
            <div className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-700/60 space-y-2">
              {isPreviewMode && (
                <div className="bg-amber-400/20 border border-amber-400/50 p-2.5 rounded-lg flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>অন-ডিমান্ড প্রিভিউ মোড সচল (আপনার নির্বাচিত অনুষ্ঠান চালানো হচ্ছে)</span>
                  </div>
                  <button
                    onClick={() => setSelectedPreviewItem(null)}
                    className="px-2.5 py-1 rounded bg-amber-400 text-emerald-950 font-black text-[11px] hover:bg-amber-300 transition cursor-pointer"
                  >
                    লাইভ সম্প্রচারে ফিরুন ↺
                  </button>
                </div>
              )}

              {/* Audio Language Mode Selector Banner */}
              <div className="bg-emerald-950/80 p-3 rounded-xl border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-300 block">অডিও ব্রডকাস্ট ভাষা মোড:</span>
                    <span className="text-[11px] text-emerald-200">
                      {audioMode === 'both' ? 'আরবি তিলওয়াত শোনার পর সাথে সাথে স্পষ্ট বাংলা অনুবাদ ও উপদেশ প্রচারিত হবে' : 'শুধুমাত্র আরবি তিলওয়াত সম্প্রচারিত হবে'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-900 p-1 rounded-lg border border-emerald-700 shrink-0">
                  <button
                    onClick={() => onToggleAudioMode?.('both')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      audioMode === 'both'
                        ? 'bg-amber-400 text-emerald-950 shadow'
                        : 'text-emerald-300 hover:text-white'
                    }`}
                  >
                    <span>🔊 আরবি + বাংলা অনুবাদ</span>
                  </button>
                  <button
                    onClick={() => onToggleAudioMode?.('arabic_only')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      audioMode === 'arabic_only'
                        ? 'bg-amber-400 text-emerald-950 shadow'
                        : 'text-emerald-300 hover:text-white'
                    }`}
                  >
                    <span>📖 শুধুমাত্র আরবি</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-block px-3 py-0.5 rounded-md bg-emerald-800 border border-emerald-600 text-amber-300 font-bold text-xs">
                  {activeItem.category} • সময়: {activeItem.startTime} - {activeItem.endTime}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-black flex items-center gap-1 shadow border ${
                  audioMode === 'both'
                    ? 'bg-amber-400 text-emerald-950 border-amber-300'
                    : 'bg-emerald-900 text-emerald-200 border-emerald-700'
                }`}>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>
                    {audioMode === 'both'
                      ? '🔊 আরবি তিলওয়াত + বাংলা অনুবাদ অডিও সচল'
                      : '📖 শুধুমাত্র আরবি তিলওয়াত সচল'}
                  </span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                {activeItem.title}
              </h2>

              <p className="text-sm font-semibold text-emerald-200 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-400" />
                <span>{activeItem.reciterOrScholar}</span>
              </p>

              {/* Bengali Translation Audio Speech Button & Floating Details Toggle */}
              {activeItem.bengaliMeaning && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSpeakBengaliTranslation(`${activeItem.bengaliMeaning}. ${activeItem.realLifeActionBn || ''}`)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition cursor-pointer shadow-md ${
                      isSpeakingBengali
                        ? 'bg-rose-500 text-white border-rose-300 animate-pulse'
                        : 'bg-teal-500 hover:bg-teal-400 text-emerald-950 border-teal-300'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isSpeakingBengali ? '🔊 বাংলা অনুবাদ পড়া হচ্ছে...' : '🔊 বাংলা অনুবাদ ও আমল অডিওতে শুনুন'}</span>
                  </button>

                  <button
                    onClick={() => setShowVerseDetails(!showVerseDetails)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 font-bold text-xs flex items-center gap-2 border border-amber-400/40 shadow cursor-pointer transition ml-auto"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>{showVerseDetails ? 'আয়াত ও বিস্তারিত অনুবাদ লুকান ▲' : 'আয়াত, অর্থ ও আমল বিস্তারিত (ড্রপডাউন ▾)'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showVerseDetails ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

              {/* Arabic Verse, Bengali Pronunciation, Meaning & Real Life Action for Active Item (Collapsible) */}
              {activeItem.arabicVerseOrDhikr && showVerseDetails && (
                <div className="mt-3 pt-3 border-t border-emerald-700/60 space-y-2.5 animate-fadeIn">
                  <div className="flex items-start justify-between gap-3 bg-emerald-900/80 p-3 rounded-xl border border-emerald-700/80">
                    <button
                      onClick={() => handleCopyText(`${activeItem.arabicVerseOrDhikr}\n${activeItem.bengaliMeaning || ''}`, 'active-item')}
                      className="p-1.5 rounded-lg bg-emerald-950 text-emerald-300 hover:text-amber-300 border border-emerald-700/80 transition cursor-pointer shrink-0"
                      title="অনুলিপি করুন"
                    >
                      {copiedTextId === 'active-item' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="text-right text-lg sm:text-2xl font-bold text-amber-100 font-arabic leading-relaxed" dir="rtl">
                      {activeItem.arabicVerseOrDhikr}
                    </div>
                  </div>

                  {activeItem.bengaliPronunciation && (
                    <div className="text-xs sm:text-sm font-semibold text-amber-300 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-amber-500/20">
                      <strong className="text-emerald-400">উচ্চারণ: </strong>
                      {activeItem.bengaliPronunciation}
                    </div>
                  )}

                  {activeItem.bengaliMeaning && (
                    <div className="text-xs sm:text-sm text-emerald-100 bg-emerald-950/70 p-3 rounded-lg border border-emerald-800">
                      <strong className="text-amber-300">স্পষ্ট বাংলা অর্থ: </strong>
                      <span className="leading-relaxed">{activeItem.bengaliMeaning}</span>
                    </div>
                  )}

                  {/* Real Life Action & Practice Guidance */}
                  {activeItem.realLifeActionBn && (
                    <div className="bg-amber-400/20 p-3 rounded-xl border border-amber-400/50 text-xs sm:text-sm text-amber-100 space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>বাস্তব জীবনের শিক্ষণীয় আমল ও নির্দেশনা:</span>
                      </div>
                      <p className="font-semibold text-amber-100/90 leading-relaxed">
                        {activeItem.realLifeActionBn}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Prayer Time Pause Warning */}
          {isPrayerPause && (
            <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-300 text-sm">
                  🕌 নামাজের ওয়াক্ত স্থগিতকরণ মোড সক্রিয় ({currentStatus?.prayerName} সালাত)
                </h4>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  ২৪ ঘণ্টার সুনির্দিষ্ট রুটিন অনুযায়ী নামাজের ওয়াক্তের সময় সাধারণ সম্প্রচার স্থগিত রেখে আযান ও সালাতের জন্য বিরতি দেওয়া হয়েছে।
                </p>
              </div>
            </div>
          )}

          {/* Stream Failover Alert */}
          {streamError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>মূল স্ট্রিম সংযোগ বিচ্ছিন্ন। স্বয়ংক্রিয় বিকল্প ব্যাকআপ স্ট্রিমে কানেক্ট করা হচ্ছে...</span>
            </div>
          )}

          {/* Player Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={handleTogglePlay}
              disabled={isPrayerPause}
              className={`px-6 py-3.5 rounded-xl font-black text-sm flex items-center gap-2.5 shadow-2xl transition cursor-pointer ${
                isPrayerPause
                  ? 'bg-emerald-900 text-emerald-500 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-emerald-950 scale-102'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isPlaying ? 'সাময়িক বন্ধ রাখুন' : 'সরাসরি সম্প্রচার শুনুন'}</span>
            </button>

            <button
              onClick={fetchCurrentBroadcast}
              className="p-3.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 transition cursor-pointer"
              title="সম্প্রচার পুনরায় সমন্বয় করুন"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <div className="text-xs text-emerald-300/90 flex items-center gap-1.5 ml-auto">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>২৪/৭ সচল ব্যাকগ্রাউন্ড অডিও প্লেয়ার</span>
            </div>
          </div>

          {/* Real Audio / Video Stream Player element */}
          {isPlaying && activeItem && (() => {
            const currentUrl = useBackup ? activeItem.backupStreamUrl : activeItem.audioStreamUrl;
            const ytId = extractYouTubeId(currentUrl);

            if (ytId) {
              return (
                <div className="mt-4 rounded-xl overflow-hidden border border-amber-400/50 shadow-2xl bg-black aspect-video max-w-2xl mx-auto">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`}
                    title={activeItem.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            }

            return (
              <audio
                src={currentUrl}
                autoPlay
                onError={handleStreamError}
                className="hidden"
              />
            );
          })()}

          {/* Bengali Translation, Tafsir & Spiritual Guidance Panel (Collapsible Floating Dropdown) */}
          {activeItem && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-900/90 border border-amber-400/40 text-emerald-50 space-y-2.5 shadow-inner">
              <div 
                onClick={() => setShowTafsirGuidance(!showTafsirGuidance)}
                className="flex items-center justify-between cursor-pointer select-none border-b border-emerald-700/80 pb-2"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-amber-400/20 text-amber-300 text-xs">📖</span>
                  <h4 className="font-bold text-amber-200 text-xs sm:text-sm">
                    অনুষ্ঠানের সরল বাংলা অনুবাদ, মর্মার্থ ও হেদায়েতের নসিহত
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                    {showTafsirGuidance ? 'লুকান ▲' : 'নসিহত দেখুন (ড্রপডাউন ▾)'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform ${showTafsirGuidance ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {showTafsirGuidance && (
                <div className="text-xs sm:text-sm text-emerald-100 leading-relaxed space-y-2 pt-1 animate-fadeIn">
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          const text = `বর্তমান অনুষ্ঠান: ${activeItem.title}। ${activeItem.reciterOrScholar}। এই অনুষ্ঠানে কুরআনের আরবি তিলাওয়াতের পাশাপাশি প্রতিটির সরল বাংলা অর্থ, জীবনঘনিষ্ঠ তাফসীর ও আত্মশুদ্ধির নসিহত প্রদান করা হচ্ছে।`;
                          const utterance = new SpeechSynthesisUtterance(text);
                          utterance.lang = 'bn-BD';
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 flex items-center gap-1 cursor-pointer transition"
                      title="বাংলায় বয়ান ও অনুবাদ শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>বাংলায় ভয়েস ও বয়ান শুনুন</span>
                    </button>
                  </div>

                  <div className="bg-emerald-950/80 p-3 rounded-lg border border-emerald-700/60">
                    <p className="font-bold text-teal-300 mb-1">💡 বাংলা অনুবাদ ও তাৎপর্য:</p>
                    <p className="text-emerald-100">
                      "{activeItem.title}" — কেবল আরবি শ্রবণ নয়, বরং কুরআনের প্রতিটি আয়াতের সাথে এর সরল বাংলা অনুবাদ ও জীবনমুখী শিক্ষা হৃদয়ঙ্গম করার বিশেষ ব্যবস্থা। মহান আল্লাহ তাআলা কুরআনে বলেছেন: "তারা কি কুরআন নিয়ে গভীর চিন্তাভাবনা করে না?" (সূরা মুহাম্মদ: ২৪)
                    </p>
                  </div>

                  <div className="bg-amber-400/10 p-3 rounded-lg border border-amber-400/30 text-amber-200/90 text-xs">
                    <strong className="text-amber-300">হৃদয়ঙ্গম ও হেদায়েতের আহ্বান:</strong> কোনো দ্বীনি বার্তা শ্রবণ করার সময় কেবল শব্দ নয়, তার মর্মার্থ উপলব্ধি করে নিজের জীবনে আমল করুন এবং পরিবারের মাঝে দাওয়াত পৌঁছে দিন।
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 24/7 Routine Schedule List (Collapsible Floating Dropdown) */}
      <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 text-white space-y-4 shadow-xl">
        <div 
          onClick={() => setShowFullSchedule(!showFullSchedule)}
          className="flex items-center justify-between border-b border-emerald-800/80 pb-3 cursor-pointer select-none hover:opacity-90 transition"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-emerald-100 text-sm sm:text-base">
                ২৪ ঘণ্টার ৭ দিনের রুটিন শিডিউল (কুরআন, হাদিস ও বাংলা ওয়াজ)
              </h3>
              <p className="text-[11px] text-emerald-300/80">
                স্বয়ংক্রিয় শিডিউল তালিকা দেখতে ড্রপডাউন বাটনটি চাপুন
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-amber-300 font-bold bg-emerald-900 px-3 py-1 rounded-full border border-emerald-700 shadow-sm flex items-center gap-1.5">
              <span>{showFullSchedule ? 'তালিকা লুকান ▲' : 'সম্পূর্ণ শিডিউল দেখুন (ড্রপডাউন ▾)'}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-amber-300 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {showFullSchedule && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 animate-fadeIn">
            {schedule.map(item => {
              const isCurrent = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition relative group ${
                    isCurrent
                      ? 'bg-emerald-800/90 border-amber-400/80 shadow-lg ring-1 ring-amber-400/30'
                      : 'bg-emerald-900/50 border-emerald-800/60 hover:bg-emerald-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 text-[10px] font-bold border border-emerald-700">
                          {item.category}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                            এখন চলছে
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-emerald-50 text-sm">{item.title}</h4>
                      <p className="text-xs text-emerald-300/90">{item.reciterOrScholar}</p>

                      {/* Arabic Verse & Bengali Pronunciation / Meaning */}
                      {item.arabicVerseOrDhikr && (
                        <div className="pt-2 mt-2 border-t border-emerald-800/80 space-y-1 text-xs">
                          <div className="text-right text-base font-bold text-amber-200 font-arabic" dir="rtl">
                            {item.arabicVerseOrDhikr}
                          </div>
                          {item.bengaliPronunciation && (
                            <div className="text-[11px] text-amber-300 font-semibold italic">
                              <strong>উচ্চারণ: </strong>{item.bengaliPronunciation}
                            </div>
                          )}
                          {item.bengaliMeaning && (
                            <div className="text-[11px] text-emerald-200">
                              <strong>অর্থ: </strong>{item.bengaliMeaning}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                        {item.startTime} - {item.endTime}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => triggerPlayAudio(item.title, item.audioStreamUrl, item)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer ${
                            isItemPlaying(item.audioStreamUrl, item.title)
                              ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow'
                              : 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border-amber-400/40'
                          }`}
                          title="এই অনুষ্ঠানটি এখনই শুনুন (অন-ডিমান্ড প্রিভিউ)"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isItemPlaying(item.audioStreamUrl, item.title) ? 'চলছে (প্রিভিউ)' : 'প্লে করুন'}</span>
                        </button>

                        {item.id.startsWith('sch-') && (
                          <button
                            onClick={() => handleDeleteScheduleItem(item.id)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 transition"
                            title="শিডিউলটি মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 24/7 Category Series Radio Section (বিষয়ভিত্তিক রেডিও সিরিজ: রুকিয়াহ, বরকত, শেফা, শুকরিয়া ও জ্ঞানার্জন) */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400/60 rounded-2xl p-5 sm:p-6 text-white space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders className="w-6 h-6 text-amber-300" />
              <h3 className="font-black text-amber-200 text-lg sm:text-xl">
                ২৪/৭ বিষয়ভিত্তিক স্পিরিচুয়াল রেডিও সিরিজ ও প্লেলিস্ট
              </h3>
            </div>
            <p className="text-xs text-emerald-200/90">
              নির্দিষ্ট বিষয়ের ওপর ২৪ ঘণ্টা শোনার জন্য স্পেশাল সিরিজ বেছে নিন। প্রতিটি অনুষ্ঠানে রয়েছে আরবি তিলাওয়াত, স্পষ্ট বাংলা অনুবাদ ও বাস্তব জীবনের আমল।
            </p>
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <ListPlus className="w-4 h-4" />
            <span>নিজস্ব ২৪/৭ রেডিও প্ল্যান তৈরি করুন</span>
          </button>
        </div>

        {/* Series Filter Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {RADIO_SERIES_CATEGORIES.map(cat => {
            const isSelected = selectedSeriesId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedSeriesId(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md scale-102'
                    : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700/80'
                }`}
              >
                <span>{cat.nameBn}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-emerald-950 text-amber-300' : 'bg-emerald-950/80 text-emerald-300'
                }`}>
                  {cat.itemsCount}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setSelectedSeriesId('custom_user')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border cursor-pointer ${
              selectedSeriesId === 'custom_user'
                ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-md scale-102'
                : 'bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border-amber-500/40'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>আমার নিজস্ব রেডিও প্ল্যান ({customUserPlans.length})</span>
          </button>
        </div>

        {/* Selected Series Info Bar */}
        {(() => {
          if (selectedSeriesId === 'custom_user') {
            return (
              <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-amber-400/40 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>আপনার ব্যক্তিগত কাস্টমাইজড রেডিও প্লেলিস্ট প্ল্যান</span>
                  </h4>
                  <span className="text-[11px] text-emerald-300 font-semibold">
                    মোট সংরক্ষিত: {toBengaliDigits(customUserPlans.length)} টি
                  </span>
                </div>
                <p className="text-emerald-200/90">
                  আপনার নিজের ইচ্ছেমত তৈরি করা ২৪/৭ দিনের অডিও রেডিও প্লেলিস্ট। অডিও লিঙ্ক, আরবি, বাংলা অনুবাদ ও বাস্তব আমল দিয়ে সাজানো।
                </p>
              </div>
            );
          }

          const currentCat = RADIO_SERIES_CATEGORIES.find(c => c.id === selectedSeriesId);
          if (!currentCat) return null;

          return (
            <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-emerald-700 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                  <span>{currentCat.nameBn}</span>
                  <span className="text-xs text-emerald-200/80">({currentCat.nameEn})</span>
                </h4>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${currentCat.badgeBg} ${currentCat.badgeText}`}>
                  {currentCat.taglineBn}
                </span>
              </div>
              <p className="text-emerald-200/90 leading-relaxed">
                {currentCat.descriptionBn}
              </p>
            </div>
          );
        })()}

        {/* Series Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const itemsToDisplay = selectedSeriesId === 'custom_user'
              ? customUserPlans
              : (RADIO_SERIES_ITEMS[selectedSeriesId] || []);

            if (itemsToDisplay.length === 0) {
              return (
                <div className="col-span-full text-center py-8 text-emerald-300 bg-emerald-900/40 rounded-xl border border-emerald-800 space-y-2">
                  <p className="text-sm font-semibold">
                    এখনও কোনো কাস্টম রেডিও প্লেলিস্ট তৈরি করা হয়নি।
                  </p>
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs"
                  >
                    + নতুন কাস্টম রেডিও প্ল্যান তৈরি করুন
                  </button>
                </div>
              );
            }

            return itemsToDisplay.map((item, idx) => {
              const isSelected = selectedPreviewItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition relative flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-emerald-800/95 border-amber-400 shadow-xl ring-2 ring-amber-400/50'
                      : 'bg-emerald-900/60 border-emerald-800/80 hover:bg-emerald-900/90'
                  }`}
                >
                  <div className="space-y-2">
                    
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-amber-300 text-[11px] font-bold border border-emerald-700">
                        {item.seriesTag || item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        সময়: {item.startTime} - {item.endTime}
                      </span>
                    </div>

                    <h4 className="font-black text-amber-100 text-base">
                      {item.title}
                    </h4>

                    <p className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.reciterOrScholar}</span>
                    </p>

                    {/* Arabic Verse / Dhikr Snippet */}
                    {item.arabicVerseOrDhikr && (
                      <div className="bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-800/80 space-y-1">
                        <div className="text-right text-base font-bold text-amber-200 font-arabic leading-normal" dir="rtl">
                          {item.arabicVerseOrDhikr}
                        </div>
                        {item.bengaliMeaning && (
                          <p className="text-[11px] text-emerald-200 line-clamp-2">
                            <strong className="text-amber-300">বাংলা অর্থ: </strong>{item.bengaliMeaning}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Real Life Action Guidance */}
                    {item.realLifeActionBn && (
                      <div className="bg-amber-400/10 p-2.5 rounded-lg border border-amber-400/30 text-[11px] text-amber-200 space-y-0.5">
                        <strong className="text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>বাস্তব জীবনের আমল:</span>
                        </strong>
                        <p className="text-emerald-100/90">{item.realLifeActionBn}</p>
                      </div>
                    )}

                  </div>

                  {/* Footer Buttons */}
                  <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyText(`${item.title}\n${item.arabicVerseOrDhikr || ''}\n${item.bengaliMeaning || ''}`, item.id)}
                      className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedTextId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTextId === item.id ? 'অনুলিপিকৃত' : 'অনুলিপি'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {item.id.startsWith('usr-plan-') && (
                        <button
                          onClick={() => handleDeleteCustomPlan(item.id)}
                          className="p-1.5 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800 transition cursor-pointer"
                          title="এই কাস্টম প্ল্যানটি মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => triggerPlayAudio(item.title, item.audioStreamUrl, item)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition shadow cursor-pointer ${
                          isItemPlaying(item.audioStreamUrl, item.title)
                            ? 'bg-rose-500 hover:bg-rose-600 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                        }`}
                      >
                        {isItemPlaying(item.audioStreamUrl, item.title) ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>চলছে (প্লেয়ারে)</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>২৪/৭ প্লে করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            });
          })()}
        </div>

      </div>

      {/* 114 Surahs Selection & Recitation Section (সকল ১১৪ টি সূরা তিলাওয়াত ও বাংলা অর্থ) */}
      <div className="bg-emerald-950/90 border-2 border-amber-400/50 rounded-2xl p-5 sm:p-6 text-white space-y-5 shadow-2xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-300" />
              <h3 className="font-black text-amber-200 text-lg sm:text-xl">
                পবিত্র কুরআনের সকল ১১৪ টি সূরা (আরবি, বাংলা নাম, অর্থ ও তিলাওয়াত)
              </h3>
            </div>
            <p className="text-xs text-emerald-200/90">
              সূরা নম্বর, আরবি নাম, বাংলা উচ্চারণ ও বাংলা অর্থসহ সকল ১১৪ টি সূরার তালিকা। ক্লিক করে অডিও তিলাওয়াত শুনুন।
            </p>
          </div>

          <span className="self-start md:self-auto px-3.5 py-1.5 rounded-full bg-amber-400 text-emerald-950 text-xs font-black shadow-md border border-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>মোট ১১৪ টি সূরা সংরক্ষিত</span>
          </span>
        </div>

        {/* Popular Surahs Quick Jump Bar */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>জনপ্রিয় সূরাসমূহে সরাসরি যান:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 36, 55, 56, 67, 112, 113, 114].map(num => {
              const surah = ALL_114_SURAHS.find(s => s.number === num);
              if (!surah) return null;
              return (
                <button
                  key={num}
                  onClick={() => handlePlaySurah(surah)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/90 hover:bg-amber-400 hover:text-emerald-950 text-emerald-200 border border-emerald-700/80 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current text-amber-400" />
                  <span>#{toBengaliDigits(surah.number)} {surah.nameBn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs & Search Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-800">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={surahSearch}
              onChange={e => setSurahSearch(e.target.value)}
              placeholder="সূরার নাম (আরবি/বাংলা), অর্থ বা নম্বর দিয়ে খুঁজুন (যেমন: ১১২, ইয়াসীন, ইখলাস)..."
              className="w-full bg-emerald-950 pl-9 pr-3 py-2 rounded-xl border border-emerald-700/80 text-white placeholder-emerald-400/80 text-xs focus:outline-none focus:border-amber-400 transition"
            />
            {surahSearch && (
              <button
                onClick={() => setSurahSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Type Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-emerald-950 p-1 rounded-xl border border-emerald-800 self-start sm:self-auto">
            <button
              onClick={() => setSurahFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                surahFilter === 'all'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              সকল ({toBengaliDigits(ALL_114_SURAHS.length)})
            </button>
            <button
              onClick={() => setSurahFilter('essential')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                surahFilter === 'essential'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ছোট ও প্রয়োজনীয় ({toBengaliDigits(SHORT_AND_ESSENTIAL_SURAHS.length)})</span>
            </button>
            <button
              onClick={() => setSurahFilter('Meccan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                surahFilter === 'Meccan'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              মক্কী (৮৬)
            </button>
            <button
              onClick={() => setSurahFilter('Medinan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                surahFilter === 'Medinan'
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              মাদানী (২৮)
            </button>
          </div>
        </div>

        {/* Surahs Count Notice */}
        <div className="text-xs text-emerald-300/80 flex items-center justify-between px-1">
          <span>
            প্রদর্শিত হচ্ছে: <strong className="text-amber-300">{toBengaliDigits(filteredSurahs.length)}</strong> টি সূরা
          </span>
          {surahSearch && (
            <span className="text-amber-300 font-semibold">
              খোঁজা হচ্ছে: "{surahSearch}"
            </span>
          )}
        </div>

        {/* Grid of Surahs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[680px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredSurahs.map(surah => {
            const isPlayingThis = isItemPlaying(surah.audioUrl, surah.nameBn);
            const isExpanded = expandedSurahNumber === surah.number;
            const fullSurahData = SHORT_AND_ESSENTIAL_SURAHS.find(s => s.number === surah.number);

            return (
              <div
                key={surah.number}
                className={`p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isPlayingThis
                    ? 'bg-emerald-800/95 border-amber-400 shadow-xl ring-2 ring-amber-400/50'
                    : 'bg-emerald-900/60 border-emerald-800/80 hover:bg-emerald-900/90 hover:border-emerald-600'
                }`}
              >
                <div className="space-y-2.5">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-amber-300 text-xs font-bold border border-emerald-700/80 font-mono">
                      #{toBengaliDigits(surah.number)}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      {fullSurahData && (
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                          পূর্ণ আয়াত সংরক্ষিত
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                        {toBengaliDigits(surah.numberOfAyahs)} আয়াত
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        surah.revelationType === 'Meccan'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      }`}>
                        {surah.revelationTypeBn}
                      </span>
                    </div>
                  </div>

                  {/* Names Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-emerald-800/60 pb-2">
                    <div>
                      <h4 className="font-black text-amber-100 text-base sm:text-lg flex items-center gap-1.5">
                        <span>সূরা {surah.nameBn}</span>
                      </h4>
                      <p className="text-[11px] text-emerald-300/80 font-mono">
                        {surah.nameEn}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-amber-200 font-arabic tracking-wide" dir="rtl">
                        {surah.nameAr}
                      </span>
                    </div>
                  </div>

                  {/* Bengali Meaning Box */}
                  <div className="bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-800 space-y-1">
                    <div className="text-xs text-emerald-200">
                      <strong className="text-amber-300">বাংলা অর্থ: </strong>
                      <span className="text-emerald-100 font-semibold">{surah.meaningBn}</span>
                    </div>
                  </div>

                  {/* Quick Reader Button */}
                  <button
                    onClick={() => setReadingSurahNumber(surah.number)}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-emerald-950 border border-amber-400/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>আয়াত ও অর্থ সহ সম্পূর্ণ পড়ুন 📖</span>
                  </button>

                  {/* Extended Info on Expand */}
                  {isExpanded && (
                    <div className="bg-emerald-950 p-3 rounded-xl border border-amber-400/30 text-xs space-y-3 text-emerald-200 animate-fade-in">
                      <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-emerald-800/60">
                        <p><strong className="text-amber-300">অবতীর্ণ:</strong> {surah.revelationTypeBn}</p>
                        <p><strong className="text-amber-300">মোট আয়াত:</strong> {toBengaliDigits(surah.numberOfAyahs)}টি</p>
                      </div>

                      {/* If full surah verses exist, display them in-place */}
                      {fullSurahData ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                          {fullSurahData.fajilatBn && (
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-400/20 text-[11px] text-amber-200">
                              <strong className="text-amber-300">ফজিলত:</strong> {fullSurahData.fajilatBn}
                            </div>
                          )}
                          {fullSurahData.verses.map(v => (
                            <div key={v.numberInSurah} className="p-2 bg-emerald-900/50 rounded-lg border border-emerald-800/60 space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-amber-300 font-mono">
                                <span>আয়াত #{toBengaliDigits(v.numberInSurah)}</span>
                              </div>
                              <p className="font-arabic text-right text-base text-amber-100 font-bold leading-relaxed">
                                {v.arabicText}
                              </p>
                              <p className="text-[11px] text-emerald-300">
                                <strong>উচ্চারণ:</strong> {v.transliterationBn}
                              </p>
                              <p className="text-[11px] text-white">
                                <strong>অর্থ:</strong> {v.translationBn}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-900/40 rounded-lg border border-emerald-800 text-[11px] text-emerald-300 flex items-center justify-between">
                          <span>সকল আয়াত ও বাংলা অনুবাদ দেখতে চান?</span>
                          <button
                            onClick={() => setReadingSurahNumber(surah.number)}
                            className="px-2 py-1 bg-amber-400 text-emerald-950 font-bold rounded text-[10px]"
                          >
                            রিডার খুলুন
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Bottom Control Buttons */}
                <div className="pt-3 mt-3 border-t border-emerald-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setExpandedSurahNumber(isExpanded ? null : surah.number)}
                    className="text-[11px] text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'সংক্ষেপ' : 'বিস্তারিত'}</span>
                  </button>

                  <button
                    onClick={() => handlePlaySurah(surah)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow cursor-pointer ${
                      isPlayingThis
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
                    }`}
                  >
                    {isPlayingThis ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>চলছে...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>তিলাওয়াত শুনুন</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-8 text-emerald-300 bg-emerald-900/40 rounded-xl border border-emerald-800">
            <p className="text-sm font-semibold">
              "${surahSearch}" এর সাথে মিল রেখে কোনো সূরা পাওয়া যায়নি।
            </p>
            <button
              onClick={() => { setSurahSearch(''); setSurahFilter('all'); }}
              className="mt-2 text-xs text-amber-300 underline font-bold"
            >
              সকল ১১৪ টি সূরা দেখুন ↺
            </button>
          </div>
        )}

      </div>

      {/* Spiritual Dhikr, Praise & Gratitude Section (সুবহানাল্লাহ, আলহামদুলিল্লাহ্ ও শুকরিয়া বার্তা) */}
      <SpiritualDhikrSection
        onPlayDhikr={handlePlaySpiritualDhikr}
        onAddToSchedule={handleAddToScheduleFromDhikr}
        currentlyPlayingUrl={currentlyPlayingUrl || selectedPreviewItem?.audioStreamUrl}
        isPlaying={isGlobalPlaying || isPlaying}
      />

      {/* Media Category Suggestions & Ideas Catalog (কি কি যুক্ত করবেন তার আইডিয়া ও ১-ক্লিক সাজেশন্স) */}
      <MediaCategorySuggestions
        onPlayItem={handlePlaySpiritualDhikr}
        onSelectSuggestionForSchedule={handleSelectSuggestionForSchedule}
        currentlyPlayingUrl={currentlyPlayingUrl || selectedPreviewItem?.audioStreamUrl}
        isPlaying={isGlobalPlaying || isPlaying}
      />

      {/* Quick Schedule Search & Conflict-Proof Modal */}
      <QuickScheduleSearchModal
        isOpen={showQuickSearchModal}
        onClose={() => setShowQuickSearchModal(false)}
        onAddScheduleItem={handleQuickAddScheduleItem}
        existingSchedule={schedule}
        onPreviewAudio={(title, url) => triggerPlayAudio(title, url)}
        currentlyPlayingUrl={currentlyPlayingUrl || selectedPreviewItem?.audioStreamUrl}
        isPlaying={isGlobalPlaying || isPlaying}
      />

      {/* Admin Add Schedule Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-emerald-950 border border-amber-400/60 text-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>নতুন মিডিয়া সম্প্রচার শিডিউল যোগ করুন</span>
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-emerald-400 hover:text-white text-xs font-bold"
              >
                ✕ বন্ধ
              </button>
            </div>

            {/* Explanatory Help Callout */}
            <div className="bg-emerald-900/80 p-3 rounded-xl border border-emerald-700/60 text-xs space-y-1.5 text-emerald-200">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-300" />
                <span>শিডিউল ও অডিও সোর্স কীভাবে কাজ করে?</span>
              </div>
              <p className="text-emerald-200/90 leading-relaxed">
                ১. আপনি আপনার ইচ্ছেমত যেকোনো শিরোনাম ও সময়সীমা (যেমন: 00:00 - 04:00) লিখে শিডিউল তৈরি করতে পারেন।<br/>
                ২. <strong>কাস্টম লিঙ্ক</strong> ঘরে আপনার নিজস্ব MP3, অনলাইন রেডিও স্ট্রিম লিঙ্ক বা অডিও ইউআরএল বসাতে পারেন।<br/>
                ৩. যদি লিঙ্ক ঘরটি খালি রাখেন, তবে সিস্টেম অটো-ডিটেক্ট করে বিশ্বস্ত কুরআন ও হাদিস নেটওয়ার্ক (Quranicaudio CDN) থেকে সঠিক অডিও প্লে করবে!
              </p>
            </div>

            <form onSubmit={handleAddScheduleItem} className="space-y-3.5 text-xs">
              {/* Conflict Prevention Alert */}
              {adminScheduleConflict ? (
                <div className="p-3 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 flex items-start gap-2.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-rose-300 text-xs block">
                      ⚠️ সময় সংঘাত সতর্কবার্তা (ডুপ্লিকেট ইনপুট নিষিদ্ধ):
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      ইতিমধ্যে এই সময়ে <strong>({adminScheduleConflict.startTime} - {adminScheduleConflict.endTime})</strong> '<strong>{adminScheduleConflict.title}</strong>' অনুষ্ঠানটি তালিকাভুক্ত রয়েছে! পূর্বের একই সময়ে এন্ট্রি থাকলে নতুন ইনপুট নেওয়া হবে না।
                    </p>
                    <button
                      type="button"
                      onClick={handleAutoAdminFreeSlot}
                      className="mt-1 px-2.5 py-1 bg-amber-400 text-emerald-950 rounded-lg font-black text-[11px] hover:bg-amber-300 transition"
                    >
                      ✨ পরবর্তী খালি সময় অটো-সেট করুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-200 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>নির্ধারিত সময়ে কোনো সংঘাত নেই — শিডিউল গ্রহণযোগ্য!</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoAdminFreeSlot}
                    className="text-amber-300 hover:underline font-bold"
                  >
                    খালি স্লট খুঁজুন
                  </button>
                </div>
              )}

              <div>
                <label className="block mb-1 font-bold text-emerald-200">অনুষ্ঠানের নাম (Program Title)*</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="যেমন: সূরা আল-বাকারা ও পরিবার নির্দেশিকা"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-emerald-200">ক্যাটাগরি</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Quran Recitation">কুরআন তেলাওয়াত</option>
                    <option value="Sahih Hadith">সহীহ হাদিস পাঠ</option>
                    <option value="Tafsir">তাফসীরুল কুরআন</option>
                    <option value="Islamic Lecture">ইসলামিক বয়ান ও আলোচনা</option>
                    <option value="Dua & Azkar">দোআ ও জিকির</option>
                    <option value="Ramadan Special">রমজান স্পেশাল</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-emerald-200">কারী / শায়েখ এর নাম*</label>
                  <input
                    type="text"
                    value={newScholar}
                    onChange={e => setNewScholar(e.target.value)}
                    placeholder="যেমন: শায়েখ মিশারী রশিদ আল-আফাসী"
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-emerald-200">শুরুর সময় (24-Hour Format)*</label>
                  <input
                    type="text"
                    value={newStart}
                    onChange={e => setNewStart(e.target.value)}
                    placeholder="00:00"
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-emerald-200">শেষের সময় (24-Hour Format)*</label>
                  <input
                    type="text"
                    value={newEnd}
                    onChange={e => setNewEnd(e.target.value)}
                    placeholder="04:00"
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              {/* 1-Click Preset Streams Options */}
              <div>
                <label className="block mb-1.5 font-bold text-amber-300 flex items-center justify-between">
                  <span>১-ক্লিক জনপ্রিয় প্রিসেট স্ট্রিমিং সোর্স বেছে নিন (Preset Stream)</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                  {PRESET_STREAMS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPresetStream(p)}
                      className="text-left px-3 py-1.5 rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700 text-emerald-100 flex items-center justify-between transition"
                    >
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-[10px] text-amber-300 bg-emerald-950 px-2 py-0.5 rounded">সিলেক্ট করুন</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Audio / YouTube Stream Input */}
              <div>
                <label className="block mb-1 font-bold text-emerald-200">
                  কাস্টম অডিও / ইউটিউব লিঙ্ক (Audio Stream or YouTube Video/Live URL)
                </label>
                <input
                  type="url"
                  value={customStreamUrl}
                  onChange={e => setCustomStreamUrl(e.target.value)}
                  placeholder="যেমন: https://www.youtube.com/watch?v=... অথবা https://server.com/stream.mp3"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
                />
                <span className="text-[11px] text-amber-300/90 mt-1 block">
                  ✨ ইউটিউব (YouTube) এর লাইভ স্ট্রিম বা ভিডিও লিঙ্ক দিলে সিস্টেম তা স্বয়ংক্রিয়ভাবে ডিটেক্ট করে প্লেয়ারে চালিয়ে দেবে!
                </span>
              </div>

              <div>
                <label className="block mb-1 font-bold text-emerald-200">
                  বিকল্প ব্যাকআপ স্ট্রিমিং লিঙ্ক (Backup Stream URL - ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={customBackupUrl}
                  onChange={e => setCustomBackupUrl(e.target.value)}
                  placeholder="https://backup-server.com/backup.mp3"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-300 font-bold hover:bg-emerald-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold shadow-md cursor-pointer"
                >
                  সংরক্ষণ ও যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide & Source Information Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-emerald-950 border border-amber-400/60 text-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>২৪/৭ সচল ইসলামিক সম্প্রচার ও অডিও সোর্স গাইড</span>
              </h4>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-emerald-400 hover:text-white text-xs font-bold"
              >
                ✕ বন্ধ
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-emerald-100 leading-relaxed">
              <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-emerald-700/60 space-y-1">
                <h5 className="font-bold text-amber-300 text-sm">
                  ১. বর্তমান রুটিনগুলোর অডিও উৎস (Source) কি?
                </h5>
                <p className="text-emerald-200/90">
                  সিস্টেমের ডিফল্ট রুটিনে ব্যবহৃত অডিওগুলো সরাসরি মক্কা আল-মুকাররমা লাইভ রেডিও, মদিনা মুনাওয়ারা লাইভ রেডিও এবং গ্লোবাল কুরআন সিডিএন নেটওয়ার্ক (Quranicaudio.com & MP3Quran.net) থেকে সংগৃহীত। শায়েখ মিশারী রশিদ, শায়েখ আবদুর রহমান আস-সুদাইস সহ আন্তর্জাতিক কারীদের অডিও ব্যবহার করা হয়।
                </p>
              </div>

              <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-emerald-700/60 space-y-1">
                <h5 className="font-bold text-amber-300 text-sm">
                  ২. নতুন শিডিউল যুক্ত করলে অডিও/ইউটিউব কীভাবে কাজ করে?
                </h5>
                <p className="text-emerald-200/90">
                  অ্যাডমিন হিসেবে আপনি দুইভাবে অডিও/ভিডিও সেট করতে পারবেন:<br/>
                  • <strong>ইউটিউব লিঙ্ক (YouTube Support):</strong> আপনি সরাসরি যেকোনো YouTube ওয়াচ লিঙ্ক (যেমন: `https://www.youtube.com/watch?v=...` বা `https://youtu.be/...`) দিলে প্লেয়ার স্বয়ংক্রিয়ভাবে ভিডিও বা লাইভ স্ট্রিম এমবেড করে প্লে করবে!<br/>
                  • <strong>কাস্টম MP3 / স্ট্রিম লিঙ্ক:</strong> অনলাইন রেডিও লিঙ্ক বা কোনো অডিও ফাইলের ডিরেক্ট URL দিতে পারেন।<br/>
                  • <strong>অটো-ডিটেক্ট মোড:</strong> লিঙ্ক ফাঁকা রাখলে বিশ্বস্ত কুরআন সিডিএন থেকে অডিও সিলেক্ট করে চালানো হবে।
                </p>
              </div>

              <div className="bg-emerald-900/80 p-3.5 rounded-xl border border-emerald-700/60 space-y-1">
                <h5 className="font-bold text-amber-300 text-sm">
                  ৩. আযান ও সালাতের সময় বিরতি কীভাবে হয়?
                </h5>
                <p className="text-emerald-200/90">
                  বাংলাদেশের ভৌগোলিক সময়সূচী অনুযায়ী ফজর, যোহর, আসর, মাগরিব ও এশার সালাতের ওয়াক্ত শুরু হলে সিস্টেম স্বয়ংক্রিয়ভাবে সাধারণ বিষয় স্থগিত রেখে সালাতের ওয়াক্ত স্থগিতকরণ মোড সক্রিয় করে।
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-emerald-800">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Custom Radio Plan Creator Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-emerald-950 border-2 border-amber-400 text-white rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <h4 className="font-bold text-amber-300 text-base flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-amber-400" />
                <span>নিজের কাস্টম ২৪/৭ রেডিও প্লেলিস্ট প্ল্যান তৈরি করুন</span>
              </h4>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-emerald-400 hover:text-white text-xs font-bold"
              >
                ✕ বন্ধ
              </button>
            </div>

            <div className="bg-amber-400/10 p-3 rounded-xl border border-amber-400/30 text-xs space-y-1 text-amber-200">
              <p className="font-semibold">
                ✨ এখানে আপনার নিজস্ব পছন্দের ইসলামিক লেকচার, তিলাওয়াত, দোয়া বা যেকোনো অডিও/ইউটিউব সোর্স দিয়ে নিজস্ব ২৪/৭ রেডিও প্ল্যান কাস্টমাইজ করুন।
              </p>
            </div>

            <form onSubmit={handleCreateCustomPlan} className="space-y-3 text-xs">
              {/* Conflict Prevention Alert for Custom Plan */}
              {customPlanConflict ? (
                <div className="p-3 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 flex items-start gap-2.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-rose-300 text-xs block">
                      ⚠️ সময় সংঘাত সতর্কবার্তা (ডুপ্লিকেট ইনপুট নিষিদ্ধ):
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      ইতিমধ্যে এই সময়ে <strong>({customPlanConflict.startTime} - {customPlanConflict.endTime})</strong> '<strong>{customPlanConflict.title}</strong>' অনুষ্ঠানটি তালিকাভুক্ত রয়েছে! পূর্বের একই সময়ে এন্ট্রি থাকলে নতুন ইনপুট নেওয়া হবে না।
                    </p>
                    <button
                      type="button"
                      onClick={handleAutoCustomFreeSlot}
                      className="mt-1 px-2.5 py-1 bg-amber-400 text-emerald-950 rounded-lg font-black text-[11px] hover:bg-amber-300 transition"
                    >
                      ✨ পরবর্তী খালি সময় অটো-সেট করুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-200 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>নির্ধারিত সময়ে কোনো সংঘাত নেই — শিডিউল গ্রহণযোগ্য!</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoCustomFreeSlot}
                    className="text-amber-300 hover:underline font-bold"
                  >
                    খালি স্লট খুঁজুন
                  </button>
                </div>
              )}

              <div>
                <label className="block mb-1 font-bold text-emerald-200">অনুষ্ঠানের নাম (Program Title)*</label>
                <input
                  type="text"
                  value={cTitle}
                  onChange={e => setCTitle(e.target.value)}
                  placeholder="যেমন: আমার সকালের আমল ও রুকিয়াহ"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-emerald-200">ক্যাটাগরি</label>
                  <select
                    value={cCategory}
                    onChange={e => setCCategory(e.target.value as any)}
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Quran Recitation">কুরআন তেলাওয়াত</option>
                    <option value="Ruqyah">রুকিয়াহ ও আত্মরক্ষা</option>
                    <option value="Barakah">বরকত ও রিজিক</option>
                    <option value="Shifa">রোগমুক্তি ও শেফা</option>
                    <option value="Gratitude">শুকরিয়া ও প্রশান্তি</option>
                    <option value="Knowledge">দ্বীনি ইলম ও হাদিস</option>
                    <option value="Dua & Azkar">আজকার ও দোয়া</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-emerald-200">কারী / বক্তার নাম</label>
                  <input
                    type="text"
                    value={cScholar}
                    onChange={e => setCScholar(e.target.value)}
                    placeholder="যেমন: শায়েখ আহমদুল্লাহ / আল-আফাসী"
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-emerald-200">শুরুর সময় (Start Time)</label>
                  <input
                    type="text"
                    value={cStart}
                    onChange={e => setCStart(e.target.value)}
                    placeholder="06:00"
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold text-emerald-200">শেষের সময় (End Time)</label>
                  <input
                    type="text"
                    value={cEnd}
                    onChange={e => setCEnd(e.target.value)}
                    placeholder="08:00"
                    className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-emerald-200">অডিও লিঙ্ক / ইউটিউব ইউআরএল (Audio / YouTube Stream URL)</label>
                <input
                  type="url"
                  value={cUrl}
                  onChange={e => setCUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... অথবা https://.../audio.mp3"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-emerald-200">আরবি আয়াত / দোয়া / জিকির (Arabic Text)</label>
                <textarea
                  value={cArabic}
                  onChange={e => setCArabic(e.target.value)}
                  rows={2}
                  placeholder="আরবি টেক্সট লিখুন..."
                  className="w-full bg-emerald-900 p-2 rounded-xl border border-emerald-700 text-white font-arabic focus:outline-none focus:border-amber-400 text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-emerald-200">বাংলা অনুবাদ ও অর্থ (Bengali Meaning)*</label>
                <textarea
                  value={cMeaning}
                  onChange={e => setCMeaning(e.target.value)}
                  rows={2}
                  placeholder="সহজ বোধগম্য বাংলা অনুবাদ লিখুন..."
                  className="w-full bg-emerald-900 p-2 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-amber-300">বাস্তব জীবনের আমল ও শিক্ষা (Practical Guidance)</label>
                <input
                  type="text"
                  value={cAction}
                  onChange={e => setCAction(e.target.value)}
                  placeholder="যেমন: প্রতিদিন ফজরের পর এই জিকিরটি ৭ বার পাঠ করুন..."
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-300 font-bold hover:bg-emerald-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black shadow-md cursor-pointer"
                >
                  সংরক্ষণ ও যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Surah Full Verse Reader Modal */}
      {readingSurahNumber !== null && (
        <SurahFullVerseModal
          surahNumber={readingSurahNumber}
          onClose={() => setReadingSurahNumber(null)}
          onPlayFullAudio={triggerPlayAudio}
          currentlyPlayingUrl={currentlyPlayingUrl || selectedPreviewItem?.audioStreamUrl}
          isPlaying={isGlobalPlaying || isPlaying}
        />
      )}

    </div>
  );
};
