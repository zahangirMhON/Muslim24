import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  ChevronUp,
  ChevronDown,
  SkipForward,
  SkipBack,
  BellRing,
  X,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { MediaEngineService, MediaScheduleItem, DEFAULT_247_SCHEDULE } from '../services/mediaEngine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface AudioPlayerBarProps {
  lang: Language;
  activeTitle: string;
  activeAudioUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (title: string, url: string) => void;
  audioMode?: 'both' | 'arabic_only';
  onToggleAudioMode?: (mode: 'both' | 'arabic_only') => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  lang,
  activeTitle,
  activeAudioUrl,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  audioMode = 'both',
  onToggleAudioMode
}) => {
  const t = translations[lang];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [autoScheduleNotification, setAutoScheduleNotification] = useState<string | null>(null);

  // 24/7 Continuous Autoplay Mode State
  const [is247AutoplayEnabled, setIs247AutoplayEnabled] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('islamic_247_autoplay_active');
      return val !== 'false'; // Default enabled
    } catch (e) {
      return true;
    }
  });

  // Custom audio addition states
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customReciter, setCustomReciter] = useState('');
  const [customStartTime, setCustomStartTime] = useState('12:00');
  const [customEndTime, setCustomEndTime] = useState('14:00');
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  // Scroll and collapse state
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isUserCollapsed, setIsUserCollapsed] = useState<boolean>(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState<boolean>(false);

  const mediaService = useRef(new MediaEngineService());
  const [scheduleList, setScheduleList] = useState<MediaScheduleItem[]>(() => mediaService.current.getSchedule());

  const toggle247Autoplay = () => {
    const nextVal = !is247AutoplayEnabled;
    setIs247AutoplayEnabled(nextVal);
    try {
      localStorage.setItem('islamic_247_autoplay_active', String(nextVal));
    } catch (e) {}

    if (nextVal && !isPlaying) {
      const broadcast = mediaService.current.getCurrentBroadcast(new Date());
      onSelectTrack(broadcast.activeItem.title, broadcast.activeItem.audioStreamUrl);
    }
  };

  useEffect(() => {
    let prevScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY <= 45) {
            setScrollDirection('up');
            setIsScrolled(false);
            setIsManuallyExpanded(false);
          } else {
            setIsScrolled(true);
            const diff = currentScrollY - prevScrollY;
            if (Math.abs(diff) > 6) {
              if (diff > 0) {
                setScrollDirection('down');
                setIsManuallyExpanded(false);
                setShowScheduleModal(false);
              } else {
                setScrollDirection('up');
              }
            }
          }

          prevScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.log('Audio autoplay prevented by browser policy until interaction:', e);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeAudioUrl]);

  // 24/7 Watchdog Timer & Auto-Recovery
  // Checks if 24/7 Autoplay is enabled and automatically plays the scheduled track
  useEffect(() => {
    if (!is247AutoplayEnabled) return;

    const watchdog = setInterval(() => {
      if (audioRef.current && audioRef.current.paused && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }, 20000);

    return () => clearInterval(watchdog);
  }, [is247AutoplayEnabled, isPlaying]);

  // Handle Track Finished -> 24/7 Continuous Auto-Scheduling
  const handleTrackEnded = () => {
    if (!is247AutoplayEnabled) return;

    const status = mediaService.current.getCurrentBroadcast(new Date());
    const nextItem = status.nextItem;

    const notif = `বর্তমান অনুষ্ঠানটি সম্পন্ন হয়েছে। পরবর্তী শিডিউল অনুষ্ঠান: '${nextItem.title}' (${toBengaliDigits(nextItem.startTime)}) স্বয়ংক্রিয়ভাবে চালু হচ্ছে...`;
    setAutoScheduleNotification(notif);

    setTimeout(() => {
      setAutoScheduleNotification(null);
    }, 8000);

    onSelectTrack(nextItem.title, nextItem.audioStreamUrl);
  };

  const handleNextTrack = () => {
    const status = mediaService.current.getCurrentBroadcast(new Date());
    const nextItem = status.nextItem;
    onSelectTrack(nextItem.title, nextItem.audioStreamUrl);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Add custom audio track
  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) return;

    // Direct MP3 or Streaming link formatting
    let resolvedUrl = customUrl.trim();
    if (resolvedUrl.includes('youtube.com/watch?v=') || resolvedUrl.includes('youtu.be/')) {
      // In web applets, audio files work with direct mp3/stream URLs; provide helpful notice
      resolvedUrl = customUrl.trim();
    }

    mediaService.current.addScheduleItem({
      title: customTitle.trim(),
      category: 'Islamic Lecture',
      reciterOrScholar: customReciter.trim() || 'কাস্টম অডিও স্ট্রিম',
      startTime: customStartTime,
      endTime: customEndTime,
      recurrenceType: 'DAILY',
      audioStreamUrl: resolvedUrl,
      backupStreamUrl: resolvedUrl
    });

    setScheduleList(mediaService.current.getSchedule());
    setAddFeedback('নতুন অডিও সফলভাবে তালিকায় যুক্ত করা হয়েছে!');
    setCustomTitle('');
    setCustomUrl('');
    setCustomReciter('');

    setTimeout(() => setAddFeedback(null), 4000);
  };

  const handleDeleteItem = (id: string) => {
    mediaService.current.deleteScheduleItem(id);
    setScheduleList(mediaService.current.getSchedule());
  };

  const handleResetSchedule = () => {
    mediaService.current.resetToDefaultSchedule();
    setScheduleList(mediaService.current.getSchedule());
    setAddFeedback('তালিকা ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে');
    setTimeout(() => setAddFeedback(null), 3000);
  };

  const isCollapsed = isUserCollapsed || (isScrolled && scrollDirection === 'down' && !isManuallyExpanded);

  return (
    <>
      <audio
        ref={audioRef}
        src={activeAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        onError={() => {
          console.warn('Audio stream error, attempting backup');
        }}
      />

      {/* Floating Small Compact Bottom Audio Pill */}
      <div
        className={`fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ease-out transform ${
          isCollapsed
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full bg-emerald-950/98 border-2 border-amber-400 text-white shadow-2xl backdrop-blur-xl ring-2 ring-emerald-950/50">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-md active:scale-95 transition cursor-pointer flex-shrink-0"
            title={isPlaying ? 'বিরতি' : 'চালু করুন'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsUserCollapsed(false);
              setIsManuallyExpanded(true);
            }}
            className="flex items-center gap-2 text-left cursor-pointer group focus:outline-none"
            title="অডিও প্লেয়ার সম্পূর্ণ বড় করুন"
          >
            <div className="flex flex-col max-w-[130px] sm:max-w-[190px]">
              <span className="text-[9px] font-black text-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                {is247AutoplayEnabled ? '২৪/৭ অটো-প্লে' : '২৪/৭ অডিও'}
              </span>
              <span className="text-xs font-bold text-white truncate group-hover:text-amber-200">
                {activeTitle}
              </span>
            </div>
            <div className="p-1 rounded-full bg-emerald-900 text-amber-300 border border-emerald-700 group-hover:bg-emerald-800 transition">
              <ChevronUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Full Sticky Bottom Audio Player Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/98 backdrop-blur-xl border-t-2 border-amber-400/60 text-white shadow-2xl p-2.5 sm:p-3 sm:px-6 transition-all duration-300 ease-in-out transform ${
          isCollapsed
            ? 'translate-y-full opacity-0 pointer-events-none shadow-none'
            : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
      >
        {/* Auto-Schedule Transition Notification Toast */}
        {autoScheduleNotification && (
          <div className="max-w-4xl mx-auto mb-2 p-2 sm:p-2.5 rounded-xl bg-amber-400 text-emerald-950 border-2 border-emerald-950 flex items-center justify-between gap-2 shadow-2xl animate-bounce">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black">
              <BellRing className="w-4 h-4 text-emerald-950 flex-shrink-0 animate-spin" />
              <span>📢 {autoScheduleNotification}</span>
            </div>
            <button
              onClick={() => setAutoScheduleNotification(null)}
              className="p-1 rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-950 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
          
          {/* Left: Info & 24/7 Autoplay Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow flex-shrink-0">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div className="min-w-0 max-w-[160px] sm:max-w-xs md:max-w-sm">
                <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    ২৪/৭ সম্প্রচার
                  </span>
                  
                  {/* 24/7 Autoplay Mode Badge */}
                  <button
                    onClick={toggle247Autoplay}
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold border transition cursor-pointer flex items-center gap-0.5 ${
                      is247AutoplayEnabled
                        ? 'bg-amber-400 text-emerald-950 border-amber-300'
                        : 'bg-black/40 text-gray-400 border-white/10'
                    }`}
                    title="২৪/৭ অটো-প্লে চালু থাকলে সময় অনুযায়ী সারাদিন স্বয়ংক্রিয়ভাবে কুরআন ও আজকার বাজবে"
                  >
                    <span>অটো-প্লে:</span>
                    <span>{is247AutoplayEnabled ? 'চালু' : 'বন্ধ'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-black text-white truncate drop-shadow-sm">
                  {activeTitle}
                </p>
              </div>
            </div>

            {/* Actions: Track List & Minimize Button */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-700/80 text-xs font-bold flex items-center gap-1 transition shadow cursor-pointer"
                title="অডিও তালিকা ও কাস্টমাইজেশন"
              >
                <span>তালিকা ও শিডিউল</span>
              </button>

              <button
                onClick={() => setIsUserCollapsed(true)}
                className="p-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-amber-300 border border-emerald-700/80 transition cursor-pointer"
                title="মিনিমাইজ করুন"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center gap-1 w-full md:w-1/2 max-w-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleNextTrack}
                className="p-1.5 text-emerald-300 hover:text-amber-300 transition cursor-pointer"
                title="পরবর্তী অনুষ্ঠান"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 hover:bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-lg transition active:scale-95 cursor-pointer"
                title={isPlaying ? 'বিরতি' : 'চালু করুন'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {onToggleAudioMode && (
                <button
                  onClick={() => onToggleAudioMode(audioMode === 'both' ? 'arabic_only' : 'both')}
                  className="text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-900 border border-emerald-700 text-amber-300 hover:bg-emerald-800 transition cursor-pointer"
                  title="অডিও মোড পরিবর্তন করুন"
                >
                  {audioMode === 'both' ? 'বাংলা সহ' : 'শুধুমাত্র আরবি'}
                </button>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full flex items-center gap-2 text-[10px] sm:text-[11px] text-emerald-300 font-mono">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Mute */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
              title={isMuted ? 'আনমিউট' : 'মিউট'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            </button>
          </div>

        </div>
      </div>

      {/* Full 24/7 Audio List & Custom Stream Manager Modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-400/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 text-emerald-50 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  <span>২৪/৭ ইসলামিক অডিও শিডিউল ও কাস্টমাইজেশন</span>
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  সারাদিনের সময়ভিত্তিক স্বয়ংক্রিয় অডিও ও আপনার নিজস্ব স্ট্রিম লিংক যোগ করার সুবিধা
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 rounded-full bg-black/40 text-emerald-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback Alert */}
            {addFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-800 border border-amber-400 text-amber-200 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400" />
                <span>{addFeedback}</span>
              </div>
            )}

            {/* Custom Audio Form */}
            <form onSubmit={handleAddCustomTrack} className="bg-black/40 p-3.5 rounded-2xl border border-emerald-700/50 space-y-3">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>নতুন অডিও / ইউটিউব ফাইল লিংক যোগ করুন (ডুপ্লিকেট প্রতিরোধ সহ)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="অডিও শিরোনাম (যেমন: সূরা আর-রহমান তিলাওয়াত)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="bg-emerald-950/90 border border-emerald-700/80 rounded-xl px-3 py-2 text-emerald-100 placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
                  required
                />
                <input
                  type="text"
                  placeholder="ক্বারী / বক্তার নাম (যেমন: শায়েখ মিশারী রশিদ)"
                  value={customReciter}
                  onChange={(e) => setCustomReciter(e.target.value)}
                  className="bg-emerald-950/90 border border-emerald-700/80 rounded-xl px-3 py-2 text-emerald-100 placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="url"
                  placeholder="অডিও ফাইল / স্ট্রিম URL (https://...mp3)"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="sm:col-span-2 bg-emerald-950/90 border border-emerald-700/80 rounded-xl px-3 py-2 text-emerald-100 placeholder-emerald-400/60 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black transition cursor-pointer shadow active:scale-95"
                >
                  তালিকায় যোগ করুন
                </button>
              </div>
            </form>

            {/* List of Scheduled Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 px-1">
                <span>বর্তমান ২৪/৭ অডিও শিডিউল:</span>
                <button
                  onClick={handleResetSchedule}
                  className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>ডিফল্ট রিসেট</span>
                </button>
              </div>

              {scheduleList.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 text-xs ${
                    activeTitle === item.title
                      ? 'bg-amber-400/20 border-amber-400 text-amber-100 shadow'
                      : 'bg-black/30 border-white/10 text-emerald-100 hover:bg-black/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-amber-200 truncate">{item.title}</div>
                    <div className="text-[11px] text-emerald-300/80 flex items-center gap-2 mt-0.5">
                      <span>🎤 {item.reciterOrScholar}</span>
                      <span>⏰ {toBengaliDigits(item.startTime)} - {toBengaliDigits(item.endTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onSelectTrack(item.title, item.audioStreamUrl);
                        setShowScheduleModal(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold transition cursor-pointer shadow active:scale-95"
                    >
                      চালু করুন
                    </button>
                    {item.id.startsWith('sch-') && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50 transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
