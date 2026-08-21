import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BookOpen,
  Share2,
  Copy,
  Check,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ListMusic,
  Maximize2,
  CheckCircle2
} from 'lucide-react';
import { SHORT_AND_ESSENTIAL_SURAHS, FullSurahDetail, SurahVerseItem } from '../data/shortSurahsFullData';
import { ALL_114_SURAHS, SurahItem } from '../data/allSurahsData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { getAyahBengaliPronunciation } from '../utils/quranTransliteration';

interface SurahFullVerseModalProps {
  surahNumber: number | null;
  onClose: () => void;
  onPlayFullAudio?: (title: string, url: string) => void;
  currentlyPlayingUrl?: string | null;
  isPlaying?: boolean;
}

export const SurahFullVerseModal: React.FC<SurahFullVerseModalProps> = ({
  surahNumber,
  onClose,
  onPlayFullAudio,
  currentlyPlayingUrl,
  isPlaying: isParentPlaying = false
}) => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(surahNumber);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [apiVerses, setApiVerses] = useState<SurahVerseItem[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Ayah-by-Ayah Audio Player State
  const [activePlayingAyah, setActivePlayingAyah] = useState<number | null>(null);
  const [isAyahAudioPlaying, setIsAyahAudioPlaying] = useState<boolean>(false);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);
  const [audioError, setAudioError] = useState<string | null>(null);
  const ayahAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCurrentNumber(surahNumber);
  }, [surahNumber]);

  // Stop Ayah audio when switching Surah or unmounting
  useEffect(() => {
    if (ayahAudioRef.current) {
      ayahAudioRef.current.pause();
    }
    setActivePlayingAyah(null);
    setIsAyahAudioPlaying(false);
  }, [currentNumber]);

  useEffect(() => {
    if (!currentNumber) return;

    // Check if we have pre-loaded offline data for this surah
    const local = SHORT_AND_ESSENTIAL_SURAHS.find(s => s.number === currentNumber);
    if (local) {
      // Ensure all local verses have EveryAyah audio and pronunciation
      const enrichedLocalVerses: SurahVerseItem[] = local.verses.map(v => ({
        ...v,
        transliterationBn: getAyahBengaliPronunciation(v.arabicText, undefined, v.transliterationBn),
        audioAyahUrl: v.audioAyahUrl || `https://everyayah.com/data/Alafasy_128kbps/${String(currentNumber).padStart(3, '0')}${String(v.numberInSurah).padStart(3, '0')}.mp3`
      }));
      setApiVerses(enrichedLocalVerses);
      setIsLoadingApi(false);
      return;
    }

    // Fetch from AlQuran Cloud with Arabic + Bangla + Transliteration
    let isMounted = true;
    setIsLoadingApi(true);
    setApiVerses(null);

    fetch(`https://api.alquran.cloud/v1/surah/${currentNumber}/editions/quran-uthmani,bn.bengali,en.transliteration`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.code === 200 && data.data && data.data.length >= 2) {
          const arEdition = data.data[0];
          const bnEdition = data.data[1];
          const enTranslitEdition = data.data[2] || null;

          const mappedVerses: SurahVerseItem[] = arEdition.ayahs.map((ayah: any, index: number) => {
            const bnAyah = bnEdition.ayahs[index];
            const enTranslit = enTranslitEdition ? enTranslitEdition.ayahs[index]?.text : '';
            const ayahNum = ayah.numberInSurah;
            const surahPad = String(currentNumber).padStart(3, '0');
            const ayahPad = String(ayahNum).padStart(3, '0');

            const pronunciation = getAyahBengaliPronunciation(ayah.text, enTranslit);

            return {
              numberInSurah: ayahNum,
              arabicText: ayah.text,
              transliterationBn: pronunciation,
              translationBn: bnAyah ? bnAyah.text : 'বাংলা অর্থ লোড করা সম্ভব হয়নি।',
              audioAyahUrl: `https://everyayah.com/data/Alafasy_128kbps/${surahPad}${ayahPad}.mp3`
            };
          });

          setApiVerses(mappedVerses);
        } else {
          throw new Error('Invalid API response');
        }
      })
      .catch(err => {
        console.error('Error fetching surah verses:', err);
        // Fallback: minimal generated structure
        const surahMeta = ALL_114_SURAHS.find(s => s.number === currentNumber);
        const count = surahMeta?.numberOfAyahs || 7;
        const fallbackList: SurahVerseItem[] = Array.from({ length: count }, (_, idx) => {
          const num = idx + 1;
          const sPad = String(currentNumber).padStart(3, '0');
          const aPad = String(num).padStart(3, '0');
          return {
            numberInSurah: num,
            arabicText: `আয়াত #${toBengaliDigits(num)}`,
            transliterationBn: `উচ্চারণ প্রস্তুত হচ্ছে...`,
            translationBn: `বাংলা অর্থ প্রস্তুত হচ্ছে...`,
            audioAyahUrl: `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`
          };
        });
        setApiVerses(fallbackList);
      })
      .finally(() => {
        if (isMounted) setIsLoadingApi(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentNumber]);

  if (!currentNumber) return null;

  const surahMeta: SurahItem | undefined = ALL_114_SURAHS.find(s => s.number === currentNumber);
  const localSurah: FullSurahDetail | undefined = SHORT_AND_ESSENTIAL_SURAHS.find(s => s.number === currentNumber);
  const displayVerses: SurahVerseItem[] = apiVerses || localSurah?.verses || [];

  const handleCopyAyah = (ayah: SurahVerseItem) => {
    const text = `${ayah.arabicText}\nউচ্চারণ: ${ayah.transliterationBn}\nঅর্থ: ${ayah.translationBn}\n(সূরা ${surahMeta?.nameBn || ''}, আয়াত: ${toBengaliDigits(ayah.numberInSurah)})`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handlePlaySingleAyah = (ayah: SurahVerseItem) => {
    const sPad = String(currentNumber).padStart(3, '0');
    const aPad = String(ayah.numberInSurah).padStart(3, '0');
    const targetUrl = ayah.audioAyahUrl || `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`;

    if (activePlayingAyah === ayah.numberInSurah && isAyahAudioPlaying) {
      // Pause
      ayahAudioRef.current?.pause();
      setIsAyahAudioPlaying(false);
      return;
    }

    setActivePlayingAyah(ayah.numberInSurah);
    setAudioError(null);

    if (ayahAudioRef.current) {
      ayahAudioRef.current.src = targetUrl;
      ayahAudioRef.current.play()
        .then(() => {
          setIsAyahAudioPlaying(true);
        })
        .catch(err => {
          console.warn('EveryAyah primary failed, trying backup CDN:', err);
          // Try backup Islamic Network CDN
          const backupUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.numberInSurah}.mp3`;
          if (ayahAudioRef.current) {
            ayahAudioRef.current.src = backupUrl;
            ayahAudioRef.current.play()
              .then(() => setIsAyahAudioPlaying(true))
              .catch(e => setAudioError('অডিও প্লে করতে সমস্যা হচ্ছে।'));
          }
        });
    }
  };

  const handleAyahAudioEnded = () => {
    if (!autoPlayNext || activePlayingAyah === null) {
      setIsAyahAudioPlaying(false);
      return;
    }

    // Auto-advance to next Ayah in this surah
    const nextAyahNum = activePlayingAyah + 1;
    const nextVerse = displayVerses.find(v => v.numberInSurah === nextAyahNum);

    if (nextVerse) {
      handlePlaySingleAyah(nextVerse);
    } else {
      setIsAyahAudioPlaying(false);
      setActivePlayingAyah(null);
    }
  };

  const handlePlayFullSurah = () => {
    if (!surahMeta) return;
    const directAudio = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${currentNumber}.mp3`;
    if (onPlayFullAudio) {
      onPlayFullAudio(`${surahMeta.nameBn} (${surahMeta.nameAr}) - পূর্ণাঙ্গ তিলাওয়াত`, directAudio);
    }
  };

  const isCurrentSurahPlaying = (currentlyPlayingUrl?.includes(`/${currentNumber}.mp3`) ||
    currentlyPlayingUrl?.includes(`/${String(currentNumber).padStart(3, '0')}.mp3`)) && isParentPlaying;

  const filteredVerses = displayVerses.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.arabicText.includes(q) ||
      v.transliterationBn.toLowerCase().includes(q) ||
      v.translationBn.toLowerCase().includes(q) ||
      String(v.numberInSurah).includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Hidden Audio Element for Ayah-by-Ayah Playback */}
      <audio
        ref={ayahAudioRef}
        onEnded={handleAyahAudioEnded}
        onError={() => {
          setIsAyahAudioPlaying(false);
          setAudioError('অডিও লোড করা যায়নি।');
        }}
      />

      <div className="bg-emerald-950 border-2 border-amber-400/60 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-emerald-50">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-emerald-900/95 border-b border-emerald-700/80">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-black text-lg flex items-center justify-center shadow-md">
              {toBengaliDigits(currentNumber)}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-amber-300">
                  {surahMeta?.nameBn || `সূরা #${toBengaliDigits(currentNumber)}`}
                </h2>
                <span className="text-sm font-arabic font-bold text-amber-200 bg-emerald-950/90 px-2.5 py-0.5 rounded-lg border border-amber-400/30">
                  {surahMeta?.nameAr}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-800 text-emerald-200 font-bold border border-emerald-700">
                  {surahMeta?.revelationTypeBn || 'মক্কী'}
                </span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                অর্থ: <strong className="text-white">{surahMeta?.meaningBn}</strong> • মোট আয়াত: <strong className="text-amber-300">{toBengaliDigits(surahMeta?.numberOfAyahs || displayVerses.length || 0)}টি</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size control */}
            <div className="hidden sm:flex items-center gap-1 bg-emerald-950 p-1 rounded-xl border border-emerald-800 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg font-bold transition ${fontSize === 'normal' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300'}`}
                title="সাধারণ ফন্ট"
              >
                অ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg font-bold transition ${fontSize === 'large' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300'}`}
                title="বড় ফন্ট"
              >
                আ
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg font-bold transition ${fontSize === 'xlarge' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300'}`}
                title="সর্বোচ্চ বড় ফন্ট"
              >
                আ+
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-900 hover:bg-rose-600 text-emerald-200 hover:text-white transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Toolbar (Audio Player & Surah Navigation) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 sm:px-6 py-2.5 bg-emerald-900/60 border-b border-emerald-800/80 text-xs">
          
          {/* Previous / Next Surah */}
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentNumber <= 1}
              onClick={() => setCurrentNumber(prev => Math.max(1, (prev || 1) - 1))}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-800 disabled:opacity-40 text-emerald-200 font-bold transition flex items-center gap-1 border border-emerald-800 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">পূর্ববর্তী</span>
            </button>

            <span className="px-2 py-1 bg-amber-400/10 text-amber-300 rounded-lg font-bold border border-amber-400/30">
              সূরা {toBengaliDigits(currentNumber)} / {toBengaliDigits(114)}
            </span>

            <button
              disabled={currentNumber >= 114}
              onClick={() => setCurrentNumber(prev => Math.min(114, (prev || 1) + 1))}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-800 disabled:opacity-40 text-emerald-200 font-bold transition flex items-center gap-1 border border-emerald-800 cursor-pointer"
            >
              <span className="hidden xs:inline">পরবর্তী</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Controls: Auto-Advance & Full Surah Audio */}
          <div className="flex items-center gap-2">
            
            {/* Auto-Play Next Ayah Toggle */}
            <button
              onClick={() => setAutoPlayNext(!autoPlayNext)}
              className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                autoPlayNext
                  ? 'bg-emerald-800 text-amber-300 border-amber-400/50'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}
              title="একটি আয়াত শেষ হলে স্বয়ংক্রিয়ভাবে পরবর্তী আয়াত বাজবে"
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>পরপর প্লে: {autoPlayNext ? 'চালু' : 'বন্ধ'}</span>
            </button>

            {/* Full Surah Audio Button */}
            <button
              onClick={handlePlayFullSurah}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                isCurrentSurahPlaying
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-300 text-emerald-950'
              }`}
            >
              {isCurrentSurahPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>তিলাওয়াত বিরতি</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>সম্পূর্ণ সূরা তিলাওয়াত</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Ayah Audio Playing Banner */}
        {activePlayingAyah !== null && (
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-900/60 to-amber-500/20 px-4 sm:px-6 py-2 border-b border-amber-400/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-amber-300">
                🔊 আয়াত {toBengaliDigits(activePlayingAyah)} তিলাওয়াত চলছে
              </span>
              <span className="text-emerald-300 text-[11px]">
                (শায়েখ মিশারী রশিদ আল-আফাসী)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isAyahAudioPlaying) {
                    ayahAudioRef.current?.pause();
                    setIsAyahAudioPlaying(false);
                  } else {
                    ayahAudioRef.current?.play();
                    setIsAyahAudioPlaying(true);
                  }
                }}
                className="px-2.5 py-1 bg-amber-400 text-emerald-950 rounded-lg font-bold flex items-center gap-1"
              >
                {isAyahAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAyahAudioPlaying ? 'বিরতি' : 'চালু'}</span>
              </button>

              <button
                onClick={() => {
                  ayahAudioRef.current?.pause();
                  setActivePlayingAyah(null);
                  setIsAyahAudioPlaying(false);
                }}
                className="p-1 rounded-lg bg-emerald-950 text-emerald-300 hover:text-rose-400"
                title="বন্ধ করুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Fajilat Box if available */}
        {localSurah?.fajilatBn && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">বিশেষ ফজিলত ও গুরুত্ব:</strong> {localSurah.fajilatBn}
            </div>
          </div>
        )}

        {/* Search within Surah */}
        <div className="px-4 sm:px-6 pt-3 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="এই সূরার কোনো আরবি শব্দ, উচ্চারণ বা বাংলা অর্থ খুঁজুন..."
              className="w-full bg-emerald-900/60 pl-8 pr-3 py-1.5 rounded-xl border border-emerald-800 text-white placeholder-emerald-400 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Verses Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 custom-scrollbar">
          
          {/* Bismillah (for all surahs except Surah At-Tawbah #9 and Al-Fatihah where it's ayah 1) */}
          {currentNumber !== 9 && currentNumber !== 1 && (
            <div className="text-center py-3.5 border-b border-emerald-800/60 my-2 bg-emerald-900/30 rounded-2xl">
              <p className="text-xl sm:text-2xl font-arabic text-amber-300 tracking-wide font-bold">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-amber-200/90 font-medium mt-1">
                উচ্চারণ: বিসমিল্লাহির রাহমানির রাহিম
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে শুরু করছি
              </p>
            </div>
          )}

          {/* Loading API State */}
          {isLoadingApi && (
            <div className="text-center py-12 space-y-3">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-emerald-300 font-bold">
                অনলাইন থেকে সূরার সকল আয়াত, বাংলা উচ্চারণ ও অর্থ লোড হচ্ছে...
              </p>
            </div>
          )}

          {/* Verses List */}
          {!isLoadingApi && filteredVerses.length > 0 && (
            <div className="space-y-4">
              {filteredVerses.map((verse) => {
                const isThisAyahActive = activePlayingAyah === verse.numberInSurah;

                return (
                  <div
                    key={verse.numberInSurah}
                    id={`ayah-card-${verse.numberInSurah}`}
                    className={`p-4 sm:p-5 rounded-2xl transition-all space-y-3 relative group border ${
                      isThisAyahActive
                        ? 'bg-amber-950/40 border-amber-400 shadow-lg ring-1 ring-amber-400'
                        : 'bg-emerald-900/40 border-emerald-700/60 hover:border-amber-400/50'
                    }`}
                  >
                    {/* Top Bar of Ayah */}
                    <div className="flex items-center justify-between gap-2 border-b border-emerald-800/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border transition ${
                          isThisAyahActive
                            ? 'bg-amber-400 text-emerald-950 border-amber-300 font-black scale-105'
                            : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        }`}>
                          {toBengaliDigits(verse.numberInSurah)}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-300">
                          সূরা {surahMeta?.nameBn} • আয়াত {toBengaliDigits(verse.numberInSurah)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Play Individual Ayah Button */}
                        <button
                          onClick={() => handlePlaySingleAyah(verse)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                            isThisAyahActive && isAyahAudioPlaying
                              ? 'bg-amber-400 text-emerald-950 border-amber-300 font-black'
                              : 'bg-emerald-950 hover:bg-amber-400 hover:text-emerald-950 text-emerald-200 border border-emerald-700'
                          }`}
                          title="এই নির্দিষ্ট আয়াতের অডিও শুনুন"
                        >
                          {isThisAyahActive && isAyahAudioPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>চলছে</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                              <span>আয়াত অডিও</span>
                            </>
                          )}
                        </button>

                        {/* Copy Ayah */}
                        <button
                          onClick={() => handleCopyAyah(verse)}
                          className="p-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-emerald-300 text-xs transition border border-emerald-800"
                          title="আয়াত, উচ্চারণ ও অর্থ কপি করুন"
                        >
                          {copiedAyah === verse.numberInSurah ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Ayah Text */}
                    <div className="text-right py-2 leading-loose">
                      <p
                        className={`font-arabic text-amber-200 font-bold tracking-wide select-text leading-[2.2] ${
                          fontSize === 'normal'
                            ? 'text-lg sm:text-xl'
                            : fontSize === 'large'
                            ? 'text-xl sm:text-2xl'
                            : 'text-2xl sm:text-3xl'
                        }`}
                        dir="rtl"
                      >
                        {verse.arabicText}
                      </p>
                    </div>

                    {/* Bengali Pronunciation / Transliteration (MANDATORY & ALWAYS PRESENT) */}
                    <div className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800/80 text-xs sm:text-sm text-amber-100 leading-relaxed">
                      <div className="flex items-center gap-1.5 mb-1 text-amber-400 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>বাংলা উচ্চারণ:</span>
                      </div>
                      <p className="font-medium text-amber-50">
                        {verse.transliterationBn || getAyahBengaliPronunciation(verse.arabicText)}
                      </p>
                    </div>

                    {/* Bengali Translation */}
                    <div className="bg-amber-400/5 p-3 rounded-xl border border-amber-400/20 text-xs sm:text-sm text-white leading-relaxed">
                      <div className="flex items-center gap-1.5 mb-1 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                        <BookOpen className="w-3 h-3 text-emerald-300" />
                        <span>বাংলা অর্থ ও অনুবাদ:</span>
                      </div>
                      <p className="text-emerald-50">
                        {verse.translationBn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoadingApi && filteredVerses.length === 0 && (
            <div className="text-center py-10 text-emerald-400 text-sm">
              কোনো আয়াত পাওয়া যায়নি।
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-4 sm:px-6 py-3 bg-emerald-900/95 border-t border-emerald-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>
              পবিত্র কুরআনের ১১৪ টি সূরার প্রতিটি আয়াতের আরবি, স্পষ্ট বাংলা উচ্চারণ ও নির্ভরযোগ্য অর্থ সংরক্ষিত।
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-amber-400 text-emerald-950 font-bold hover:bg-amber-300 transition cursor-pointer shadow self-stretch sm:self-auto"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
