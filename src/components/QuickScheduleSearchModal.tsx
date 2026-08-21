import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Volume2,
  HelpCircle,
  ShieldCheck,
  X
} from 'lucide-react';
import { MediaScheduleItem } from '../services/mediaEngine';
import { ALL_114_SURAHS } from '../data/allSurahsData';
import { SPIRITUAL_DHIKR_COLLECTION } from '../data/spiritualDhikrData';
import { SUGGESTION_CATEGORIES_CATALOG } from '../data/spiritualDhikrData';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddScheduleItem: (item: Omit<MediaScheduleItem, 'id'>) => boolean;
  existingSchedule: MediaScheduleItem[];
  onPreviewAudio: (title: string, url: string) => void;
  currentlyPlayingUrl?: string;
  isPlaying?: boolean;
}

// Convert HH:MM to minutes
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
};

// Check if proposed time overlaps with existing schedule
const checkTimeOverlap = (start: string, end: string, list: MediaScheduleItem[]): MediaScheduleItem | null => {
  const newStartMin = timeToMinutes(start);
  let newEndMin = timeToMinutes(end);
  if (newEndMin <= newStartMin) newEndMin = 24 * 60;

  for (const item of list) {
    const itemStartMin = timeToMinutes(item.startTime);
    let itemEndMin = timeToMinutes(item.endTime);
    if (itemEndMin <= itemStartMin) itemEndMin = 24 * 60;

    // Direct identical start time
    if (item.startTime === start) {
      return item;
    }
    // Time interval overlap
    if (newStartMin < itemEndMin && newEndMin > itemStartMin) {
      return item;
    }
  }
  return null;
};

// Find next unallocated time slot in the 24-hour cycle
const findNextAvailableSlot = (list: MediaScheduleItem[]): { start: string; end: string } => {
  // Sort schedule by start time
  const sorted = [...list].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  
  // Find a gap between entries or start after last
  let currentPointer = 0; // minutes from 00:00
  for (const item of sorted) {
    const itemStart = timeToMinutes(item.startTime);
    const itemEnd = timeToMinutes(item.endTime);
    if (itemStart - currentPointer >= 60) {
      // Found at least 1 hour free slot!
      const startH = String(Math.floor(currentPointer / 60)).padStart(2, '0');
      const startM = String(currentPointer % 60).padStart(2, '0');
      const endH = String(Math.floor(itemStart / 60)).padStart(2, '0');
      const endM = String(itemStart % 60).padStart(2, '0');
      return { start: `${startH}:${startM}`, end: `${endH}:${endM}` };
    }
    currentPointer = Math.max(currentPointer, itemEnd);
  }

  if (currentPointer < 24 * 60) {
    const startH = String(Math.floor(currentPointer / 60)).padStart(2, '0');
    const startM = String(currentPointer % 60).padStart(2, '0');
    return { start: `${startH}:${startM}`, end: '24:00' };
  }

  return { start: '12:00', end: '13:00' };
};

export const QuickScheduleSearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddScheduleItem,
  existingSchedule,
  onPreviewAudio,
  currentlyPlayingUrl,
  isPlaying
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'custom_form'>('search');

  // Form states for manual or customized item
  const [title, setTitle] = useState('');
  const [scholar, setScholar] = useState('শায়েখ মিশারী রশিদ আল-আফাসী');
  const [category, setCategory] = useState<'Quran Recitation' | 'Sahih Hadith' | 'Tafsir' | 'Islamic Lecture' | 'Dua & Azkar' | 'Ramadan Special'>('Quran Recitation');
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('08:00');
  const [audioUrl, setAudioUrl] = useState('');
  const [backupUrl, setBackupUrl] = useState('');
  const [arabicText, setArabicText] = useState('');
  const [bengaliMeaning, setBengaliMeaning] = useState('');
  const [realLifeAction, setRealLifeAction] = useState('');

  // Overlap verification
  const conflictingItem = useMemo(() => {
    return checkTimeOverlap(startTime, endTime, existingSchedule);
  }, [startTime, endTime, existingSchedule]);

  const handleAutoFreeSlot = () => {
    const slot = findNextAvailableSlot(existingSchedule);
    setStartTime(slot.start);
    setEndTime(slot.end);
  };

  const handleSelectPredefined = (item: {
    title: string;
    scholar: string;
    category: any;
    audioUrl: string;
    arabicText?: string;
    bengaliMeaning?: string;
    realLifeAction?: string;
  }) => {
    setTitle(item.title);
    setScholar(item.scholar);
    setCategory(item.category || 'Quran Recitation');
    setAudioUrl(item.audioUrl);
    setArabicText(item.arabicText || '');
    setBengaliMeaning(item.bengaliMeaning || '');
    setRealLifeAction(item.realLifeAction || '');
    
    // Auto calculate next available free slot to prevent conflict!
    const slot = findNextAvailableSlot(existingSchedule);
    setStartTime(slot.start);
    setEndTime(slot.end);
    
    setActiveTab('custom_form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictingItem) {
      alert(`⚠️ সময় সংঘাত সতর্কবার্তা: ইতিমধ্যে এই সময়ে (${conflictingItem.startTime} - ${conflictingItem.endTime}) '${conflictingItem.title}' অনুষ্ঠানটি তালিকাভুক্ত রয়েছে! একই সময়ে একাধিক এন্ট্রি করা যাবে না। অনুগ্রহ করে ভিন্ন সময় নির্বাচন করুন।`);
      return;
    }

    const success = onAddScheduleItem({
      title,
      category,
      reciterOrScholar: scholar,
      startTime,
      endTime,
      recurrence: 'DAILY',
      audioStreamUrl: audioUrl || 'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
      backupStreamUrl: backupUrl || 'https://server8.mp3quran.net/afs/001.mp3',
      isLiveStream: true,
      arabicVerseOrDhikr: arabicText || undefined,
      bengaliMeaning: bengaliMeaning || undefined,
      realLifeActionBn: realLifeAction || undefined
    });

    if (success) {
      onClose();
    }
  };

  // Search Results across Surahs, Spiritual Dhikrs, & Suggestions
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: any;
      scholar: string;
      audioUrl: string;
      arabic?: string;
      bengaliMeaning?: string;
      type: 'surah' | 'dhikr' | 'suggestion';
    }> = [];

    // Surahs
    ALL_114_SURAHS.forEach(surah => {
      if (
        !query ||
        surah.nameBn.toLowerCase().includes(query) ||
        surah.nameEn.toLowerCase().includes(query) ||
        surah.meaningBn.toLowerCase().includes(query) ||
        String(surah.number).includes(query)
      ) {
        results.push({
          id: `surah-${surah.number}`,
          title: `সূরা ${surah.nameBn} (${surah.nameEn})`,
          subtitle: `অর্থ: ${surah.meaningBn} • ${surah.revelationTypeBn} • ${surah.numberOfAyahs} আয়াত`,
          category: 'Quran Recitation',
          scholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
          audioUrl: surah.audioUrl,
          arabic: surah.nameAr,
          bengaliMeaning: surah.meaningBn,
          type: 'surah'
        });
      }
    });

    // Dhikrs
    SPIRITUAL_DHIKR_COLLECTION.forEach(dhikr => {
      if (
        !query ||
        dhikr.bengaliTitle.toLowerCase().includes(query) ||
        dhikr.category.toLowerCase().includes(query) ||
        dhikr.bengaliMeaning.toLowerCase().includes(query)
      ) {
        results.push({
          id: dhikr.id,
          title: dhikr.bengaliTitle,
          subtitle: dhikr.fadhilatTitleBn,
          category: 'Dua & Azkar',
          scholar: 'শায়েখ মিশারী রশিদ আল-আফাসী',
          audioUrl: dhikr.audioUrl,
          arabic: dhikr.arabicText,
          bengaliMeaning: dhikr.bengaliMeaning,
          type: 'dhikr'
        });
      }
    });

    // Suggestions
    SUGGESTION_CATEGORIES_CATALOG.forEach(cat => {
      cat.sampleItems.forEach((sample, idx) => {
        if (
          !query ||
          sample.title.toLowerCase().includes(query) ||
          sample.scholar.toLowerCase().includes(query) ||
          sample.fadhilatShortBn.toLowerCase().includes(query)
        ) {
          results.push({
            id: `sug-${cat.id}-${idx}`,
            title: sample.title,
            subtitle: `${sample.scholar} • ${sample.fadhilatShortBn}`,
            category: cat.categoryName,
            scholar: sample.scholar,
            audioUrl: sample.audioUrl,
            arabic: sample.arabicSample,
            bengaliMeaning: sample.bengaliMeaning,
            type: 'suggestion'
          });
        }
      });
    });

    return results.slice(0, 40); // Limit to top 40 for max performance
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-emerald-950 border-2 border-amber-400 text-white rounded-3xl w-full max-w-2xl p-5 sm:p-7 shadow-2xl space-y-5 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-amber-300 text-base sm:text-lg">
              ১-ক্লিক সার্চ ও ২৪/৭ শিডিউল যোগ করুন
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-900 text-emerald-300 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-emerald-800/80 pb-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>১-ক্লিক সার্চ ও ক্যাটালগ ({toBengaliDigits(searchResults.length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'custom_form'
                ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>শিডিউল এন্ট্রি ফরম ও যাচাই</span>
          </button>
        </div>

        {activeTab === 'search' ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="সূরা, আয়াত, জিকির, কারী বা হাদিসের নাম দিয়ে খুঁজুন..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-emerald-900 border border-emerald-700 text-white placeholder-emerald-400 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
                autoFocus
              />
              <Search className="w-5 h-5 text-emerald-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-xs bg-emerald-800 px-2 py-0.5 rounded text-emerald-300 hover:text-white"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>

            {/* Search Results List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {searchResults.map(res => {
                const isPlayingThis = currentlyPlayingUrl === res.audioUrl && !!isPlaying;

                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800 hover:border-emerald-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-amber-300 text-[10px] font-bold border border-emerald-800">
                          {res.category}
                        </span>
                        {res.type === 'surah' && (
                          <span className="text-[10px] bg-teal-900/80 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                            আল-কুরআন
                          </span>
                        )}
                        {res.type === 'dhikr' && (
                          <span className="text-[10px] bg-purple-900/80 text-purple-300 px-1.5 py-0.5 rounded">
                            শুকরিয়া ও জিকির
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-amber-100 text-sm">
                        {res.title}
                      </h5>
                      <p className="text-xs text-emerald-300/90">
                        {res.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Play Preview */}
                      <button
                        onClick={() => onPreviewAudio(res.title, res.audioUrl)}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                          isPlayingThis
                            ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                            : 'bg-emerald-950 text-amber-300 hover:bg-emerald-800 border-emerald-700'
                        }`}
                        title="শুনুন"
                      >
                        {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span className="text-[11px]">{isPlayingThis ? 'চলছে' : 'শুনুন'}</span>
                      </button>

                      {/* Select to Schedule */}
                      <button
                        onClick={() => handleSelectPredefined({
                          title: res.title,
                          scholar: res.scholar,
                          category: res.category,
                          audioUrl: res.audioUrl,
                          arabicText: res.arabic,
                          bengaliMeaning: res.bengaliMeaning
                        })}
                        className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>শিডিউলে যুক্ত</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {searchResults.length === 0 && (
                <div className="text-center py-8 text-emerald-300 bg-emerald-900/30 rounded-2xl border border-emerald-800">
                  <p className="text-sm font-semibold">"{searchQuery}" এর সাথে মিল রেখে কিছু পাওয়া যায়নি।</p>
                  <button
                    onClick={() => setActiveTab('custom_form')}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold text-xs"
                  >
                    + কাস্টম অডিও বা ইউটিউব লিঙ্ক দিয়ে তৈরি করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Form Tab */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Overlap Warning Banner */}
            {conflictingItem ? (
              <div className="p-3.5 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 flex items-start gap-3 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-rose-300 text-xs block">
                    ⚠️ সময় সংঘাত সতর্কবার্তা (ডুপ্লিকেট ইনপুট নিষিদ্ধ):
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    ইতিমধ্যে এই সময়ে <strong>({conflictingItem.startTime} - {conflictingItem.endTime})</strong> '<strong>{conflictingItem.title}</strong>' অনুষ্ঠানটি তালিকাভুক্ত রয়েছে! পূর্বের একই সময়ে এন্ট্রি থাকলে নতুন ইনপুট নেওয়া হবে না।
                  </p>
                  <button
                    type="button"
                    onClick={handleAutoFreeSlot}
                    className="mt-1 px-3 py-1 bg-amber-400 text-emerald-950 rounded-lg font-black text-[11px] hover:bg-amber-300 transition"
                  >
                    ✨ পরবর্তী খালি সময় অটো-সেট করুন
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-emerald-200 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>নির্ধারিত সময়ে কোনো সংঘাত নেই — শিডিউল গ্রহণযোগ্য!</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFreeSlot}
                  className="text-amber-300 hover:underline font-bold"
                >
                  খালি স্লট খুঁজুন
                </button>
              </div>
            )}

            <div>
              <label className="block mb-1 font-bold text-emerald-200">অনুষ্ঠানের শিরোনাম (Title)*</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="যেমন: সূরা আর-রহমান ও শুকরিয়া বার্তা"
                className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-emerald-200">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
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
                <label className="block mb-1 font-bold text-emerald-200">কারী / বক্তার নাম*</label>
                <input
                  type="text"
                  value={scholar}
                  onChange={e => setScholar(e.target.value)}
                  placeholder="যেমন: শায়েখ মিশারী রশিদ আল-আফাসী"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-bold text-emerald-200">শুরুর সময় (Start Time - 24H)*</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  placeholder="06:00"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-emerald-200">শেষের সময় (End Time - 24H)*</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  placeholder="08:00"
                  className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold text-emerald-200">
                অডিও লিঙ্ক / ইউটিউব ইউআরএল (Audio Stream / YouTube URL)
              </label>
              <input
                type="url"
                value={audioUrl}
                onChange={e => setAudioUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... অথবা https://.../stream.mp3"
                className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white placeholder-emerald-500 focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-amber-300/90 mt-1 block">
                ✨ ইউটিউব লিঙ্ক দিলে সিস্টেম স্বয়ংক্রিয়ভাবে ভিডিও ও অডিও স্ট্রিমিং সমন্বয় করবে!
              </span>
            </div>

            <div>
              <label className="block mb-1 font-bold text-emerald-200">আরবি আয়াত / দোয়া (Arabic Text - ঐচ্ছিক)</label>
              <textarea
                value={arabicText}
                onChange={e => setArabicText(e.target.value)}
                rows={2}
                placeholder="আরবি টেক্সট লিখুন..."
                className="w-full bg-emerald-900 p-2 rounded-xl border border-emerald-700 text-white font-arabic focus:outline-none focus:border-amber-400 text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-emerald-200">বাংলা অর্থ ও তাৎপর্য (Bengali Meaning - ঐচ্ছিক)</label>
              <textarea
                value={bengaliMeaning}
                onChange={e => setBengaliMeaning(e.target.value)}
                rows={2}
                placeholder="বাংলা অনুবাদ..."
                className="w-full bg-emerald-900 p-2 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-300 font-bold hover:bg-emerald-800 transition"
              >
                বাতিল
              </button>

              <button
                type="submit"
                disabled={!!conflictingItem}
                className={`px-5 py-2 rounded-xl font-black shadow-lg transition flex items-center gap-1.5 ${
                  conflictingItem
                    ? 'bg-emerald-900 text-emerald-600 cursor-not-allowed border border-emerald-800'
                    : 'bg-amber-400 hover:bg-amber-300 text-emerald-950 cursor-pointer'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>সংরক্ষণ ও যুক্ত করুন</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
