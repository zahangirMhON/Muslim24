import React, { useState } from 'react';
import { BookOpen, CheckCircle, Play, Pause, Sparkles, Volume2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Language, QuranVerse } from '../types';
import { TODAY_QURAN_VERSES } from '../data/islamicData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { translations } from '../locales/translations';

interface QuranGoalCardProps {
  lang: Language;
  onPlayAudio: (title: string, url: string) => void;
  currentlyPlayingUrl?: string;
  isPlaying?: boolean;
}

export const QuranGoalCard: React.FC<QuranGoalCardProps> = ({
  lang,
  onPlayAudio,
  currentlyPlayingUrl,
  isPlaying
}) => {
  const t = translations[lang];
  const [verses, setVerses] = useState<QuranVerse[]>(TODAY_QURAN_VERSES);
  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);

  const completedCount = verses.filter(v => v.isRead).length;
  const totalVerses = verses.length;
  const progressPercent = Math.round((completedCount / totalVerses) * 100);

  const toggleVerseRead = (id: number) => {
    setVerses(prev =>
      prev.map(v => (v.id === id ? { ...v, isRead: !v.isRead } : v))
    );
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-5 shadow-xl border border-emerald-700/60 relative overflow-hidden">
      
      {/* Title & Goal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-700/40">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-50">
              দৈনিক ১০ আয়াত পাঠ, অর্থ ও শানে নুযূল
            </h3>
            <p className="text-xs font-semibold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ" — তারা কি কুরআন নিয়ে গভীর চিন্তাভাবনা করে না?</span>
            </p>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-emerald-600/50 flex items-center gap-3 self-stretch sm:self-auto justify-between">
          <div className="text-xs font-semibold text-emerald-200">
            অগ্রগতি: {toBengaliDigits(completedCount)} / {toBengaliDigits(totalVerses)} আয়াত
          </div>
          <div className="w-20 bg-emerald-900 h-2 rounded-full overflow-hidden border border-emerald-700/50">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Verses List */}
      <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {verses.map((verse) => {
          const verseAudioUrl = verse.audioUrl || 'https://server8.mp3quran.net/afs/001.mp3';
          const isCurrentPlaying = currentlyPlayingUrl === verseAudioUrl && isPlaying;
          const isExpanded = selectedVerseId === verse.id;

          return (
            <div
              key={verse.id}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                verse.isRead
                  ? 'bg-emerald-950/40 border-emerald-800/40 opacity-80'
                  : 'bg-emerald-950/80 border-emerald-700/60 hover:border-emerald-500'
              }`}
              onClick={() => setSelectedVerseId(isExpanded ? null : verse.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-800 text-amber-300 border border-emerald-600/60">
                    {verse.surahNameBn} • আয়াত {toBengaliDigits(verse.ayahNumber)}
                  </span>
                  <span className="text-[11px] text-emerald-300/80">
                    {isExpanded ? '(সংক্ষিপ্ত করুন)' : '(বিস্তারিত দেখুন)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Play Specific Ayah Audio */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayAudio(`${verse.surahNameBn} (আয়াত ${toBengaliDigits(verse.ayahNumber)}) - মিশারী রশিদ`, verseAudioUrl);
                    }}
                    className="p-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition cursor-pointer flex items-center gap-1 text-xs"
                    title="এই আয়াতের তিলাওয়াত শুনুন"
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span className="hidden sm:inline">শুনুন</span>
                  </button>

                  {/* Mark Read Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVerseRead(verse.id);
                    }}
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition ${
                      verse.isRead
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50 hover:bg-emerald-800'
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${verse.isRead ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <span>{verse.isRead ? 'পঠিত' : 'পড়ুন'}</span>
                  </button>
                </div>
              </div>

              {/* Arabic Ayah Text */}
              <div
                className="text-right text-xl sm:text-2xl font-bold text-amber-100 py-2 leading-loose tracking-wide font-arabic"
                dir="rtl"
              >
                {verse.arabicText}
              </div>

              {/* Bengali Pronunciation (বাংলা উচ্চারণ) */}
              {verse.bengaliPronunciation && (
                <div className="text-xs sm:text-sm font-semibold text-amber-300/90 italic bg-emerald-900/40 px-3 py-1.5 rounded-lg border border-amber-500/20 my-1.5">
                  <span className="text-emerald-400 font-bold not-italic">উচ্চারণ: </span>
                  {verse.bengaliPronunciation}
                </div>
              )}

              {/* Bengali Meaning (বাংলা অর্থ) */}
              <div className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
                <span className="text-emerald-300 font-semibold">অর্থ: </span>
                {verse.bengaliTranslation}
              </div>

              {/* Expanded Verse Tafsir/Details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-emerald-700/60 text-xs text-emerald-200 space-y-2 bg-emerald-900/60 p-3 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Info className="w-4 h-4 text-amber-300" />
                    <span>আয়াত সংক্ষেপ ও তাফসীর নোট:</span>
                  </div>
                  <p className="text-emerald-100 leading-relaxed">
                    {verse.surahNameBn} এর এই {toBengaliDigits(verse.ayahNumber)} নং আয়াতে মহান আল্লাহ তাআলা বান্দার জন্য ঈমানী হেদায়াত, রহমত ও সত্য পথ প্রদর্শনের বিশেষ শিক্ষা দান করেছেন। নিয়ম করে দৈনিক এই আয়াতসমূহ রিভিশন করলে মন প্রশান্ত থাকে।
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
