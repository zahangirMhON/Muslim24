import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  Folder,
  Clock,
  BookOpen,
  Video,
  FileText,
  ListMusic,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Radio,
  Plus,
  Share2,
  Check,
  ExternalLink,
  BookMarked,
  Maximize2,
  Minimize2,
  Copy,
  Mic,
  Info,
  Bell
} from 'lucide-react';
import { playlistManager, PlayableTrack, AudioFolder } from '../services/audioPlaylistManager';
import { smartAlarmService } from '../services/smartAlarmService';
import { HISNUL_MUSLIM_BOOK_INFO } from '../data/hisnulMuslimFullData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { ScheduleTimelineVisualizer } from './ScheduleTimelineVisualizer';
import { VoiceControlTab } from './VoiceControlTab';
import { AudioDetailsModal } from './AudioDetailsModal';
import { pronunciationVoiceService } from '../services/pronunciationVoiceService';

interface ModernMusicPlayerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'bn' | 'en' | 'ar';
  initialFullScreen?: boolean;
  externalAudio?: {
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onSeek: (time: number) => void;
    onSelectTrack: (title: string, url: string) => void;
    activeTitle?: string;
    activeAudioUrl?: string;
  };
}

export const ModernMusicPlayerPopup: React.FC<ModernMusicPlayerPopupProps> = ({
  isOpen,
  onClose,
  lang = 'bn',
  initialFullScreen = false,
  externalAudio
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Full Screen State
  const [isFullScreen, setIsFullScreen] = useState<boolean>(initialFullScreen);
  const [lyricsFontSize, setLyricsFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);

  // Player State
  const [activeTrack, setActiveTrack] = useState<PlayableTrack | null>(() => playlistManager.getActiveTrack());
  const [internalPlaying, setInternalPlaying] = useState<boolean>(false);
  const isPlaying = externalAudio ? externalAudio.isPlaying : internalPlaying;
  const [internalCurrentTime, setInternalCurrentTime] = useState<number>(0);
  const currentTime = externalAudio ? externalAudio.currentTime : internalCurrentTime;
  const [internalDuration, setInternalDuration] = useState<number>(0);
  const duration = externalAudio ? externalAudio.duration : internalDuration;

  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('all');
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState<boolean>(() => playlistManager.isAutoPlayEnabled());

  // Navigation & Sub-views in Player
  const [activeTab, setActiveTab] = useState<'now_playing' | 'queue' | 'folders' | 'lyrics_dua' | 'tts_voice' | 'hisnul_book' | 'video'>('now_playing');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('hisnul_muslim');
  const [folders, setFolders] = useState<AudioFolder[]>(() => playlistManager.getFolders());
  const [folderTracks, setFolderTracks] = useState<PlayableTrack[]>([]);

  // Feedback Notification
  const [notification, setNotification] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Detailed Audio Info Modal
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [isQuickSpeaking, setIsQuickSpeaking] = useState<boolean>(false);

  // Create Custom Playlist Modal inside player
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [newPlaylistStart, setNewPlaylistStart] = useState<string>('06:00');
  const [newPlaylistEnd, setNewPlaylistEnd] = useState<string>('07:00');

  // Video embed modal
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // 24/7 Folder Alarm Modal State
  const [showFolderAlarmModal, setShowFolderAlarmModal] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useState<string>('05:30');
  const [alarmCustomTitle, setAlarmCustomTitle] = useState<string>('');
  const [alarmFolderChoice, setAlarmFolderChoice] = useState<string>('');

  const handleCreateFolderAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const folderObj = folders.find(f => f.id === (alarmFolderChoice || activeTrack?.folderId));
    smartAlarmService.createAlarmFromTrackOrFolder({
      title: alarmCustomTitle || activeTrack?.title || '২৪/৭ রেডিও এলার্ম',
      timeString: alarmTime,
      profileId: 'self',
      folderId: alarmFolderChoice || activeTrack?.folderId,
      folderTitleBn: folderObj?.titleBn || activeTrack?.folderTitleBn,
      trackUrl: activeTrack?.audioUrl,
      trackTitle: activeTrack?.title,
      voiceText: `বিসমিল্লাহ। এখন ${alarmCustomTitle || activeTrack?.title || 'ইসলামিক রেডিও'}-এর এলার্ম সময় হয়েছে।`
    });
    setShowFolderAlarmModal(false);
    showToast(`⏰ "${alarmCustomTitle || activeTrack?.title || 'রেডিও'}" এর জন্য ${toBengaliDigits(alarmTime)}-এ এলার্ম সেট হয়েছে!`);
  };

  // Sync with playlistManager
  useEffect(() => {
    const updateFromManager = () => {
      const state = playlistManager.getPlaybackState();
      setActiveTrack(state.activeTrack);
      setInternalPlaying(state.isPlaying);
      setIsAutoPlayEnabled(state.isScheduleAutoPlay);
      setFolders(playlistManager.getFolders());
      if (state.activeTrack) {
        setIsFavorite(playlistManager.isFavorite(state.activeTrack.id));
      }
    };

    updateFromManager();
    const unsubscribe = playlistManager.subscribe(updateFromManager);
    return () => unsubscribe();
  }, []);

  // Update tracks when selected folder changes
  useEffect(() => {
    const tracks = playlistManager.getTracksInFolder(selectedFolderId);
    setFolderTracks(tracks);
  }, [selectedFolderId, folders]);

  // Update favorite state when active track changes
  useEffect(() => {
    if (activeTrack) {
      setIsFavorite(playlistManager.isFavorite(activeTrack.id));
    }
  }, [activeTrack]);

  // Audio HTML Element Control (Single Audio Instance Guarantee - only used if no externalAudio provided)
  useEffect(() => {
    if (externalAudio || !audioRef.current) return;

    if (activeTrack && audioRef.current.src !== activeTrack.audioUrl) {
      audioRef.current.src = activeTrack.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('Playback prevented, retrying fallback or awaiting user interaction', err);
        });
      }
    } else if (isPlaying) {
      audioRef.current.play().catch(err => console.warn(err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, activeTrack, externalAudio]);

  // Handle Volume & Speed
  useEffect(() => {
    if (!externalAudio && audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, isMuted, playbackSpeed, externalAudio]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (!externalAudio && audioRef.current) {
      setInternalCurrentTime(audioRef.current.currentTime);
      setInternalDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (externalAudio) {
      externalAudio.onSeek(val);
    } else if (audioRef.current) {
      audioRef.current.currentTime = val;
      setInternalCurrentTime(val);
    }
  };

  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      if (externalAudio) {
        externalAudio.onSeek(0);
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    // If 24/7 Schedule Autoplay is active, transition to next scheduled program
    if (isAutoPlayEnabled) {
      const { nextTrack } = playlistManager.getCurrentlyScheduledTrack(new Date());
      playTrack(nextTrack);
      showToast(`সময়সূচী অনুযায়ী পরবর্তী সম্প্রচার: '${nextTrack.title}' চালু হচ্ছে...`);
      return;
    }

    // Otherwise next in current folder/queue
    handleNextTrack();
  };

  const handleNextTrack = () => {
    const list = folderTracks.length > 0 ? folderTracks : playlistManager.getAllTracks();
    if (!activeTrack || list.length === 0) return;

    if (isShuffle) {
      const randIdx = Math.floor(Math.random() * list.length);
      playTrack(list[randIdx]);
      return;
    }

    const currentIdx = list.findIndex(t => t.id === activeTrack.id);
    const nextIdx = (currentIdx + 1) % list.length;
    playTrack(list[nextIdx]);
  };

  const handlePrevTrack = () => {
    const list = folderTracks.length > 0 ? folderTracks : playlistManager.getAllTracks();
    if (!activeTrack || list.length === 0) return;

    const currentIdx = list.findIndex(t => t.id === activeTrack.id);
    const prevIdx = (currentIdx - 1 + list.length) % list.length;
    playTrack(list[prevIdx]);
  };

  const playTrack = (track: PlayableTrack, folderId?: string) => {
    playlistManager.setActiveTrack(track, folderId || track.folderId);
    setActiveTrack(track);
    if (externalAudio) {
      externalAudio.onSelectTrack(track.title, track.audioUrl);
    } else {
      setInternalPlaying(true);
      playlistManager.setPlayState(true);
    }
  };

  const togglePlay = () => {
    if (externalAudio) {
      externalAudio.onTogglePlay();
    } else {
      const next = !isPlaying;
      setInternalPlaying(next);
      playlistManager.setPlayState(next);
    }
  };

  const toggleFavorite = () => {
    if (!activeTrack) return;
    const nowFav = playlistManager.toggleFavorite(activeTrack.id);
    setIsFavorite(nowFav);
    showToast(nowFav ? '❤️ পছন্দের তালিকায় যুক্ত হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে');
  };

  const toggleAutoPlay = () => {
    const enabled = playlistManager.toggleAutoPlay();
    setIsAutoPlayEnabled(enabled);
    showToast(enabled ? '২৪/৭ সময়ভিত্তিক অটো-প্লে চালু করা হয়েছে' : 'অটো-প্লে বন্ধ করা হয়েছে');
  };

  const handleCopyLyrics = () => {
    if (!activeTrack) return;
    const parts = [
      activeTrack.title,
      activeTrack.arabicText ? `আরবি:\n${activeTrack.arabicText}` : '',
      activeTrack.transliterationBn ? `বাংলা উচ্চারণ:\n${activeTrack.transliterationBn}` : '',
      activeTrack.translationBn ? `বাংলা অর্থ:\n${activeTrack.translationBn}` : '',
      activeTrack.referenceBn ? `রেফারেন্স:\n${activeTrack.referenceBn}` : '',
      activeTrack.virtueBn ? `আমল ও ফজিলত:\n${activeTrack.virtueBn}` : ''
    ].filter(Boolean).join('\n\n');

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(parts);
      setCopiedLyrics(true);
      showToast('📋 আরবি, উচ্চারণ ও অর্থ সফলভাবে কপি হয়েছে!');
      setTimeout(() => setCopiedLyrics(false), 2500);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Create Custom Playlist
  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const pl = playlistManager.createCustomPlaylist(newPlaylistName, undefined, newPlaylistStart, newPlaylistEnd);
    if (activeTrack) {
      playlistManager.addTrackToPlaylist(pl.id, activeTrack.id);
    }
    setFolders(playlistManager.getFolders());
    setShowCreatePlaylistModal(false);
    setNewPlaylistName('');
    showToast(`নতুন প্লেলিস্ট '${pl.name}' তৈরি করা হয়েছে!`);
  };

  if (!isOpen) return null;

  return (
    <div
      id="modern-music-player-modal"
      className={`fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-fade-in ${
        isFullScreen ? 'p-0' : 'p-0 sm:p-3 md:p-6'
      }`}
      onClick={onClose}
    >
      {!externalAudio && (
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnded}
          onError={() => {
            if (activeTrack?.backupUrl && audioRef.current && audioRef.current.src !== activeTrack.backupUrl) {
              audioRef.current.src = activeTrack.backupUrl;
              audioRef.current.play().catch(() => {});
            }
          }}
        />
      )}

      {/* Main Glassmorphic Popup Shell */}
      <div
        className={`bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 flex flex-col shadow-2xl overflow-hidden text-white relative transition-all duration-300 ${
          isFullScreen
            ? 'fixed inset-0 w-full h-[100dvh] rounded-none max-w-none max-h-none border-0 z-50'
            : 'border-0 sm:border-2 border-amber-400/80 rounded-none sm:rounded-3xl w-full max-w-5xl h-[100dvh] sm:h-[92vh] max-h-[100dvh] sm:max-h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Notification Toast */}
        {notification && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-amber-400 text-emerald-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 border border-emerald-950 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Top Nav Bar */}
        <div className="flex flex-col border-b border-emerald-800/80 bg-emerald-950/95 sticky top-0 z-40 backdrop-blur-md shrink-0">
          {/* Main Top Row */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 gap-2">
            {/* Left: App title & badge */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shrink-0">
                <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-xs sm:text-base font-black text-amber-300 truncate">
                    ২৪/৭ ইসলামিক প্লেয়ার
                  </h2>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-800 border border-emerald-600 text-emerald-200 truncate max-w-[120px] sm:max-w-none">
                    {activeTrack?.folderTitleBn || 'হিসনুল মুসলিম'}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-300/80 hidden sm:block truncate">
                  ফোল্ডার ভিত্তিক প্লেলিস্ট • টাইম শিডিউল অটো-প্লে • হিসনুল মুসলিম বুক
                </p>
              </div>
            </div>

            {/* Right: Fullscreen, Minimize, Alarm, and Close buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Folder Alarm Button */}
              <button
                onClick={() => {
                  setAlarmCustomTitle(activeTrack?.title || '');
                  setAlarmFolderChoice(activeTrack?.folderId || '');
                  setShowFolderAlarmModal(true);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black border border-amber-300 transition cursor-pointer flex items-center gap-1 text-xs shadow"
                title="এই অডিও বা ফোল্ডার দিয়ে এলার্ম সেট করুন"
              >
                <Bell className="w-4 h-4 text-emerald-950 fill-current" />
                <span className="hidden sm:inline">এলার্ম</span>
              </button>

              {/* Fullscreen Toggle Button */}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-amber-300 border border-emerald-700/80 transition cursor-pointer flex items-center gap-1 text-xs"
                title={isFullScreen ? 'ফুল স্ক্রিন বন্ধ করুন' : 'পূর্ণাঙ্গ স্ক্রিনে লিরিক্স ও প্লেয়ার দেখুন'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="hidden md:inline">{isFullScreen ? 'ছোট করুন' : 'ফুল স্ক্রিন'}</span>
              </button>

              {/* Minimize to bottom mini-player */}
              <button
                onClick={onClose}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-amber-300 border border-emerald-700/80 transition cursor-pointer flex items-center gap-1 text-xs"
                title="প্লেয়ার মিনিমাইজ করুন (নিচে ব্যাকগ্রাউন্ডে বাজবে)"
              >
                <ChevronDown className="w-4 h-4" />
                <span className="hidden md:inline">মিনিমাইজ</span>
              </button>

              {/* Primary Close Button (ALWAYS HIGH-CONTRAST & PROMINENT) */}
              <button
                onClick={onClose}
                className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white border-2 border-rose-400 font-black transition cursor-pointer flex items-center gap-1.5 text-xs shadow-xl ring-2 ring-rose-500/50"
                title="প্লেয়ার বন্ধ করুন"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span className="font-black">বন্ধ</span>
              </button>
            </div>
          </div>

          {/* Secondary Utility Row: Autoplay toggle, Info modal, and Global Font Size Adjuster */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-1.5 bg-black/40 border-t border-emerald-900/60 text-xs gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Detailed Audio Info Button */}
              <button
                onClick={() => setShowDetailsModal(true)}
                disabled={!activeTrack}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-[11px] sm:text-xs transition flex items-center gap-1 shadow cursor-pointer disabled:opacity-50 shrink-0"
                title="বর্তমান অডিও এর পূর্ণাঙ্গ বিস্তারিত বিবরণ ও দলিল দেখুন"
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>বিস্তারিত তথ্য</span>
              </button>

              {/* 24/7 Autoplay Toggle Button */}
              <button
                onClick={toggleAutoPlay}
                className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition flex items-center gap-1 shadow cursor-pointer shrink-0 ${
                  isAutoPlayEnabled
                    ? 'bg-emerald-800 text-amber-300 border-emerald-600'
                    : 'bg-emerald-900/80 text-emerald-300 border-emerald-700 hover:bg-emerald-800'
                }`}
                title="সময় অনুযায়ী অটো-প্লে চালু রাখলে দিন-রাত ঘড়ির সময় মিলিয়ে স্বয়ংক্রিয়ভাবে কুরআন ও দোয়া বাজবে"
              >
                <Clock className="w-3 h-3 shrink-0" />
                <span>২৪/৭ অটো: <strong className={isAutoPlayEnabled ? 'text-amber-300' : 'text-emerald-400'}>{isAutoPlayEnabled ? 'চালু' : 'বন্ধ'}</strong></span>
              </button>
            </div>

            {/* Global Text / Font Size Controller (A- / A+) */}
            <div className="flex items-center gap-1 shrink-0 bg-emerald-950/90 px-2 py-0.5 rounded-lg border border-emerald-800 text-xs">
              <span className="text-[10px] text-emerald-300 font-bold hidden xs:inline">ফন্ট:</span>
              <button
                onClick={() => setLyricsFontSize(s => s === 'xl' ? 'lg' : s === 'lg' ? 'base' : 'sm')}
                className="px-1.5 py-0.5 hover:bg-emerald-900 text-emerald-200 hover:text-white font-bold cursor-pointer text-xs"
                title="ফন্ট সাইজ ছোট করুন"
              >
                A-
              </button>
              <span className="text-[10px] text-amber-300 font-bold px-1">
                {lyricsFontSize === 'sm' ? 'ছোট' : lyricsFontSize === 'base' ? 'স্বাভাবিক' : lyricsFontSize === 'lg' ? 'বড়' : 'অনেক বড়'}
              </span>
              <button
                onClick={() => setLyricsFontSize(s => s === 'sm' ? 'base' : s === 'base' ? 'lg' : 'xl')}
                className="px-1.5 py-0.5 hover:bg-emerald-900 text-emerald-200 hover:text-white font-bold cursor-pointer text-xs"
                title="ফন্ট সাইজ বড় করুন"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation in Player */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2 bg-black/50 border-b border-emerald-800/60 overflow-x-auto scrollbar-none text-xs shrink-0 touch-pan-x">
          <button
            onClick={() => setActiveTab('now_playing')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'now_playing'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>প্লেয়ার স্ক্রিন</span>
          </button>

          <button
            onClick={() => setActiveTab('tts_voice')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'tts_voice'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-amber-300 hover:bg-emerald-900/60 border border-amber-400/40 bg-emerald-950/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>উচ্চারণ ও ভয়েস (TTS)</span>
          </button>

          <button
            onClick={() => setActiveTab('folders')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'folders'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>ফোল্ডার ও প্লেলিস্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'queue'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>শিডিউল ও ট্র্যাক ({folderTracks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lyrics_dua')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'lyrics_dua'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>আরবি ও বাংলা অর্থ</span>
          </button>

          <button
            onClick={() => setActiveTab('hisnul_book')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              activeTab === 'hisnul_book'
                ? 'bg-amber-400 text-emerald-950 shadow'
                : 'text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-300" />
            <span>হিসনুল মুসলিম বুক</span>
          </button>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 scrollbar-thin">

          {/* VIEW 1: NOW PLAYING MAIN SCREEN */}
          {activeTab === 'now_playing' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
              
              {/* Left Column: Visual Artwork & Waveform */}
              <div className="lg:col-span-5 flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-500 to-amber-300 shadow-2xl group flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] sm:rounded-[22px] bg-emerald-950 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden border-2 border-emerald-900">
                    
                    {/* Background Islamic Geometric Star Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Animated Center Disk / Quranic Symbol */}
                    <div className={`w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-amber-400/80 bg-gradient-to-br from-emerald-900 to-teal-950 flex items-center justify-center text-2xl sm:text-4xl shadow-inner ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '16s' }}>
                      🕌
                    </div>

                    {/* Audio Waveform Bars Simulation */}
                    <div className="flex items-end gap-0.5 sm:gap-1 h-5 sm:h-8 mt-2 sm:mt-4">
                      {[40, 75, 55, 95, 60, 80, 45, 90, 70, 85, 50, 65].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 sm:w-1.5 bg-gradient-to-t from-amber-400 to-amber-200 rounded-full transition-all duration-300"
                          style={{
                            height: isPlaying ? `${Math.max(15, (h * ((i % 3) + 1)) % 100)}%` : '20%',
                            opacity: isPlaying ? 1 : 0.4
                          }}
                        />
                      ))}
                    </div>

                    {/* Time slot badge if exists */}
                    {activeTrack?.startTime && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[9px] sm:text-[10px] font-black shadow flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{toBengaliDigits(activeTrack.startTime)} - {toBengaliDigits(activeTrack.endTime || '')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Track Quick Actions (Favorite, Add to Playlist, Video) */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 sm:p-2.5 rounded-xl border transition shadow cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 scale-105'
                        : 'bg-emerald-900/60 border-emerald-700/60 text-emerald-200 hover:text-white'
                    }`}
                    title={isFavorite ? 'পছন্দের তালিকা থেকে বাদ দিন' : 'পছন্দের তালিকায় রাখুন'}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => setShowCreatePlaylistModal(true)}
                    className="p-2 sm:p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-emerald-200 hover:text-amber-300 transition shadow cursor-pointer"
                    title="কাস্টম প্লেলিস্টে যোগ করুন"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {activeTrack?.videoId && (
                    <button
                      onClick={() => setActiveVideoId(activeTrack.videoId!)}
                      className="px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-red-600/20 border border-red-500/60 text-red-300 hover:bg-red-600/40 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      title="ভিডিও প্লেলিস্টে সরাসরি দেখুন"
                    >
                      <Video className="w-3.5 h-3.5 text-red-400" />
                      <span>ভিডিও</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Track Details, Progress Scrubber, Controls & Mini Dua */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                
                {/* Title & Metadata */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-800/90 text-amber-300 font-bold text-[10px] sm:text-xs border border-emerald-600 truncate">
                      {activeTrack?.folderTitleBn || 'হিসনুল মুসলিম'}
                    </span>
                    {activeTrack?.categoryBn && (
                      <span className="text-[11px] sm:text-xs text-emerald-300 truncate">
                        • {activeTrack.categoryBn}
                      </span>
                    )}
                  </div>

                  <h1 className="text-base sm:text-2xl font-black text-amber-200 tracking-tight break-words">
                    {activeTrack?.title || 'ইসলামিক অডিও নির্বাচন করুন'}
                  </h1>

                  <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5 font-medium">
                    {activeTrack?.reciterOrScholar || 'বিশিষ্ট ক্বারী ও আলেম'}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => setShowDetailsModal(true)}
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer active:scale-95"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>বিস্তারিত তথ্য ও আমল</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('tts_voice')}
                      className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-emerald-700 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer active:scale-95"
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>ক্বারী ও উচ্চারণ কন্ট্রোল (TTS)</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Timers */}
                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-emerald-800"
                  />
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration > 0 ? formatTime(duration) : 'লাইভ স্ট্রিম'}</span>
                  </div>
                </div>

                {/* Primary Music Controls */}
                <div className="flex items-center justify-between gap-2 py-2 px-1">
                  
                  {/* Left: Shuffle & Repeat */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setIsShuffle(!isShuffle)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        isShuffle ? 'text-amber-400 bg-emerald-900' : 'text-emerald-400 hover:text-white'
                      }`}
                      title="অদলবদল করে শুনুন"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setRepeatMode(prev => prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all')}
                      className={`p-2 rounded-xl transition cursor-pointer relative ${
                        repeatMode !== 'off' ? 'text-amber-400 bg-emerald-900' : 'text-emerald-400 hover:text-white'
                      }`}
                      title={`পুনরাবৃত্তি: ${repeatMode === 'one' ? 'একটি গান' : repeatMode === 'all' ? 'সবগুলো' : 'বন্ধ'}`}
                    >
                      <Repeat className="w-4 h-4" />
                      {repeatMode === 'one' && (
                        <span className="absolute -top-1 -right-1 text-[9px] font-black text-amber-300">1</span>
                      )}
                    </button>
                  </div>

                  {/* Center: Prev, Play/Pause, Next */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={handlePrevTrack}
                      className="p-2 sm:p-3 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition shadow cursor-pointer active:scale-90"
                      title="পূর্ববর্তী"
                    >
                      <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-xl transition active:scale-95 cursor-pointer border-2 border-amber-200 hover:brightness-110 shrink-0"
                      title={isPlaying ? 'বিরতি' : 'চালু করুন'}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={handleNextTrack}
                      className="p-2 sm:p-3 rounded-full bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition shadow cursor-pointer active:scale-90"
                      title="পরবর্তী"
                    >
                      <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </button>
                  </div>

                  {/* Right: Playback Speed & Volume */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setPlaybackSpeed(s => s === 1 ? 1.25 : s === 1.25 ? 1.5 : 1)}
                      className="px-2 py-1 rounded-lg bg-emerald-900 text-amber-300 text-[11px] sm:text-xs font-mono font-bold border border-emerald-700 cursor-pointer"
                      title="প্লেব্যাক স্পিড পরিবর্তন করুন"
                    >
                      {playbackSpeed}x
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 text-emerald-300 hover:text-white transition cursor-pointer"
                      title={isMuted ? 'আনমিউট' : 'মিউট'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                    </button>
                  </div>

                </div>

                {/* Comprehensive Ayah & Dua Lyrics Display Box */}
                {activeTrack?.arabicText ? (
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border-2 border-amber-400/60 space-y-3.5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📖</span>
                        <span className="text-xs font-black text-amber-300">
                          আয়াত ও দোয়ার সহীহ লিরিক্স ও উচ্চারণ
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Font size adjustments */}
                        <div className="flex items-center bg-emerald-950 rounded-lg p-0.5 border border-emerald-800 text-[10px] text-emerald-300">
                          <button
                            onClick={() => setLyricsFontSize(s => s === 'xl' ? 'lg' : s === 'lg' ? 'base' : 'sm')}
                            className="px-1.5 py-0.5 hover:text-white cursor-pointer"
                            title="ফন্ট ছোট করুন"
                          >
                            A-
                          </button>
                          <span className="text-emerald-500">|</span>
                          <button
                            onClick={() => setLyricsFontSize(s => s === 'sm' ? 'base' : s === 'base' ? 'lg' : 'xl')}
                            className="px-1.5 py-0.5 hover:text-white font-bold cursor-pointer"
                            title="ফন্ট বড় করুন"
                          >
                            A+
                          </button>
                        </div>

                        {/* Copy Lyrics Button */}
                        <button
                          onClick={handleCopyLyrics}
                          className="px-2.5 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-[10px] font-bold flex items-center gap-1 transition shadow cursor-pointer"
                          title="উচ্চারণ ও অর্থ কপি করুন"
                        >
                          {copiedLyrics ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedLyrics ? 'কপি হয়েছে' : 'কপি'}</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('lyrics_dua')}
                          className="text-[11px] text-emerald-300 hover:text-amber-300 underline cursor-pointer hidden sm:inline"
                        >
                          পূর্ণ লিরিক্স →
                        </button>
                      </div>
                    </div>

                    {/* 1. Arabic Verse / Dua */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-amber-400/90 uppercase tracking-wider block">
                        মূল আরবি পাঠ:
                      </span>
                      <p
                        className={`font-arabic text-amber-100 text-right leading-loose ${
                          lyricsFontSize === 'sm'
                            ? 'text-base sm:text-lg'
                            : lyricsFontSize === 'base'
                            ? 'text-lg sm:text-xl'
                            : lyricsFontSize === 'lg'
                            ? 'text-xl sm:text-2xl'
                            : 'text-2xl sm:text-3xl'
                        }`}
                        dir="rtl"
                      >
                        {activeTrack.arabicText}
                      </p>
                    </div>

                    {/* 2. Bengali Transliteration (আরবি এর বাংলা উচ্চারণ) */}
                    {activeTrack.transliterationBn && (
                      <div className="pt-2 border-t border-emerald-800/60 space-y-0.5">
                        <span className="text-[10px] font-black text-emerald-300 block">
                          আরবি এর বাংলা উচ্চারণ:
                        </span>
                        <p
                          className={`text-white leading-relaxed font-serif ${
                            lyricsFontSize === 'sm'
                              ? 'text-xs'
                              : lyricsFontSize === 'base'
                              ? 'text-xs sm:text-sm'
                              : lyricsFontSize === 'lg'
                              ? 'text-sm sm:text-base'
                              : 'text-base sm:text-lg'
                          }`}
                        >
                          {activeTrack.transliterationBn}
                        </p>
                      </div>
                    )}

                    {/* 3. Bengali Translation (বাংলা অর্থ) */}
                    {activeTrack.translationBn && (
                      <div className="pt-2 border-t border-emerald-800/60 space-y-0.5">
                        <span className="text-[10px] font-black text-teal-300 block">
                          বাংলা অর্থ ও মর্মার্থ:
                        </span>
                        <p
                          className={`text-emerald-100 leading-relaxed ${
                            lyricsFontSize === 'sm'
                              ? 'text-xs'
                              : lyricsFontSize === 'base'
                              ? 'text-xs sm:text-sm'
                              : lyricsFontSize === 'lg'
                              ? 'text-sm sm:text-base'
                              : 'text-base sm:text-lg'
                          }`}
                        >
                          {activeTrack.translationBn}
                        </p>
                      </div>
                    )}

                    {/* 4. Hadith / Quran Reference & Virtues */}
                    {(activeTrack.referenceBn || activeTrack.virtueBn) && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-800 text-[11px] text-emerald-200 space-y-1">
                        {activeTrack.referenceBn && (
                          <div className="flex items-center gap-1.5 font-bold text-amber-300">
                            <span>📌 রেফারেন্স:</span>
                            <span>{activeTrack.referenceBn}</span>
                          </div>
                        )}
                        {activeTrack.virtueBn && (
                          <div className="text-emerald-200/90">
                            ✨ <span className="font-semibold text-white">আমল ও ফজিলত:</span> {activeTrack.virtueBn}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick TTS Pronunciation Bar */}
                    <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => {
                            if (activeTrack.arabicText) {
                              pronunciationVoiceService.stopSpeech();
                              setIsQuickSpeaking(true);
                              pronunciationVoiceService.speakArabic(activeTrack.arabicText, () => setIsQuickSpeaking(false));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          title="আরবি উচ্চারণ শুনুন"
                        >
                          <Mic className="w-3 h-3 text-amber-400" />
                          <span>আরবি উচ্চারণ (TTS)</span>
                        </button>

                        {(activeTrack.translationBn || activeTrack.transliterationBn) && (
                          <button
                            onClick={() => {
                              const txt = activeTrack.translationBn || activeTrack.transliterationBn;
                              if (txt) {
                                pronunciationVoiceService.stopSpeech();
                                setIsQuickSpeaking(true);
                                pronunciationVoiceService.speakBengali(txt, () => setIsQuickSpeaking(false));
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="বাংলা অর্থ শুনুন"
                          >
                            <Volume2 className="w-3 h-3 text-emerald-300" />
                            <span>বাংলা অর্থ (TTS)</span>
                          </button>
                        )}

                        {isQuickSpeaking && (
                          <button
                            onClick={() => {
                              pronunciationVoiceService.stopSpeech();
                              setIsQuickSpeaking(false);
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                          >
                            থামান
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setShowDetailsModal(true)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                      >
                        সম্পূর্ণ বিস্তারিত বিবরণ →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/30 border border-emerald-800/60 text-xs text-emerald-200/90 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-bold">
                      <span>📻 অনুষ্ঠান পরিচিতি ও শিক্ষা:</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-700">
                        {activeTrack?.folderTitleBn || '২৪/৭ ইসলামিক সম্প্রচার'}
                      </span>
                    </div>
                    <p className="leading-relaxed">
                      {activeTrack?.subtitle || 'সহীহ কুরআন ও সুন্নাহর আলোকে পরিচালিত ধারাবাহিক ইসলামিক অডিও সম্প্রচার।'}
                    </p>
                    {activeTrack?.referenceBn && (
                      <p className="text-[11px] text-amber-200/80 font-mono">
                        উৎস: {activeTrack.referenceBn}
                      </p>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* VIEW 2: FOLDERS & PLAYLISTS */}
          {activeTab === 'folders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>সকল অডিও ফোল্ডার ও প্লেলিস্ট তালিকা</span>
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    যেকোনো ফোল্ডার বেছে নিয়ে ক্রমান্বয়ে বা সময় অনুযায়ী শুনুন
                  </p>
                </div>

                <button
                  onClick={() => setShowCreatePlaylistModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন প্লেলিস্ট তৈরি</span>
                </button>
              </div>

              {/* Folders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {folders.map((f) => {
                  const isSelected = selectedFolderId === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedFolderId(f.id);
                        setActiveTab('queue');
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer bg-gradient-to-br ${f.colorTheme} ${
                        isSelected
                          ? 'ring-2 ring-amber-400 shadow-xl scale-[1.02]'
                          : 'hover:scale-[1.01] hover:brightness-110'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-amber-400/50 flex items-center justify-center text-xl shadow">
                          {f.id === 'favorites' ? '❤️' : f.id === 'hisnul_muslim' ? '📚' : '📁'}
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950 text-amber-300 border border-emerald-700">
                          {f.badge}
                        </span>
                      </div>

                      <h4 className="font-black text-white text-sm mt-3 group-hover:text-amber-200">
                        {f.titleBn}
                      </h4>
                      <p className="text-xs text-emerald-200/80 mt-1 line-clamp-2">
                        {f.descriptionBn}
                      </p>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs font-bold text-amber-300">
                        <span>{f.itemCount} টি অডিও ট্র্যাক</span>
                        <span className="text-emerald-300 hover:underline">খুলুন →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 3: QUEUE & SCHEDULE TIMELINE */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {/* 24-Hour Visual Schedule and Free Slot Visualizer */}
              <ScheduleTimelineVisualizer
                selectedFolderId={selectedFolderId}
                onPlayTrack={(t) => playTrack(t, selectedFolderId)}
                onCreatePlaylistForSlot={(start, end) => {
                  setNewPlaylistStart(start);
                  setNewPlaylistEnd(end);
                  setShowCreatePlaylistModal(true);
                }}
              />

              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-2">
                    <ListMusic className="w-4 h-4" />
                    <span>
                      ফোল্ডার: {folders.find(f => f.id === selectedFolderId)?.titleBn || 'হিসনুল মুসলিম'}
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    ক্লিক করে শুনুন • ঘড়ির সময় অনুযায়ী অটো-প্লে সক্রিয়
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (folderTracks.length > 0) {
                        playTrack(folderTracks[0]);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>সবগুলো প্লে করুন</span>
                  </button>
                </div>
              </div>

              {/* Tracks List */}
              <div className="space-y-2">
                {folderTracks.length === 0 ? (
                  <div className="text-center py-12 text-emerald-300 text-sm">
                    এই ফোল্ডারে এখনো কোনো ট্র্যাক যোগ করা হয়নি।
                  </div>
                ) : (
                  folderTracks.map((track, idx) => {
                    const isCurrent = activeTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => playTrack(track, selectedFolderId)}
                        className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-400/20 border-amber-400 shadow-lg text-white'
                            : 'bg-black/30 border-emerald-800/50 hover:bg-black/50 text-emerald-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-6 text-center font-mono font-bold ${isCurrent ? 'text-amber-300' : 'text-emerald-400/60'}`}>
                            {isCurrent && isPlaying ? '▶' : toBengaliDigits(idx + 1)}
                          </span>

                          <div className="min-w-0">
                            <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                              <span>{track.title}</span>
                              {track.startTime && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-900 border border-emerald-700 text-amber-300 text-[10px] font-mono shrink-0">
                                  ⏰ {toBengaliDigits(track.startTime)} - {toBengaliDigits(track.endTime || '')}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-emerald-300/80 truncate mt-0.5">
                              {track.reciterOrScholar} {track.subtitle && `• ${track.subtitle}`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {track.videoId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoId(track.videoId!);
                              }}
                              className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-300 border border-red-700/50 transition cursor-pointer"
                              title="ভিডিও পাঠ দেখুন"
                            >
                              <Video className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playlistManager.toggleFavorite(track.id);
                              setFolders(playlistManager.getFolders());
                            }}
                            className="p-1.5 text-emerald-400 hover:text-rose-400 transition cursor-pointer"
                          >
                            <Heart className={`w-4 h-4 ${playlistManager.isFavorite(track.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playTrack(track, selectedFolderId);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold transition shadow cursor-pointer ${
                              isCurrent && isPlaying
                                ? 'bg-amber-400 text-emerald-950 font-black'
                                : 'bg-emerald-900 text-amber-300 hover:bg-emerald-800'
                            }`}
                          >
                            {isCurrent && isPlaying ? 'চলছে' : 'চালু করুন'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW 4: LYRICS & ARABIC DUA VIEW */}
          {activeTab === 'lyrics_dua' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="text-center border-b border-emerald-800/80 pb-3">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-xs text-amber-300 font-bold px-2.5 py-0.5 rounded-full bg-emerald-900 border border-emerald-700">
                    {activeTrack?.subtitle || activeTrack?.folderTitleBn || 'হিসনুল মুসলিম'}
                  </span>
                  {activeTrack?.referenceBn && (
                    <span className="text-xs text-emerald-300/90 font-medium">
                      📌 {activeTrack.referenceBn}
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-2xl font-black text-amber-200 mt-2 break-words">
                  {activeTrack?.title}
                </h2>
                <p className="text-xs text-emerald-300/80 mt-1">
                  {activeTrack?.reciterOrScholar || 'সহীহ হাদিস ও কুরআন রেফারেন্স'}
                </p>
              </div>

              {/* Utility Control Toolbar for Lyrics: Font Resizer, TTS, Copy */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-800">
                {/* Font Size Adjusters */}
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-emerald-800 text-xs">
                  <span className="text-emerald-300 font-bold text-[11px]">টেক্সট সাইজ:</span>
                  <button
                    onClick={() => setLyricsFontSize(s => s === 'xl' ? 'lg' : s === 'lg' ? 'base' : 'sm')}
                    className="px-2 py-0.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded font-bold cursor-pointer transition text-xs"
                    title="ফন্ট ছোট করুন"
                  >
                    A-
                  </button>
                  <span className="text-amber-300 font-bold text-xs px-1">
                    {lyricsFontSize === 'sm' ? 'ছোট' : lyricsFontSize === 'base' ? 'স্বাভাবিক' : lyricsFontSize === 'lg' ? 'বড়' : 'অনেক বড়'}
                  </span>
                  <button
                    onClick={() => setLyricsFontSize(s => s === 'sm' ? 'base' : s === 'base' ? 'lg' : 'xl')}
                    className="px-2 py-0.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded font-bold cursor-pointer transition text-xs"
                    title="ফন্ট বড় করুন"
                  >
                    A+
                  </button>
                </div>

                {/* Quick TTS Audio and Copy */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeTrack?.arabicText && (
                    <button
                      onClick={() => {
                        pronunciationVoiceService.stopSpeech();
                        setIsQuickSpeaking(true);
                        pronunciationVoiceService.speakArabic(activeTrack.arabicText!, () => setIsQuickSpeaking(false));
                      }}
                      className="px-2.5 py-1 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                      title="আরবি সহীহ উচ্চারণ শুনুন"
                    >
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      <span>আরবি তিলাওয়াত (TTS)</span>
                    </button>
                  )}

                  {(activeTrack?.translationBn || activeTrack?.transliterationBn) && (
                    <button
                      onClick={() => {
                        const txt = activeTrack.translationBn || activeTrack.transliterationBn;
                        if (txt) {
                          pronunciationVoiceService.stopSpeech();
                          setIsQuickSpeaking(true);
                          pronunciationVoiceService.speakBengali(txt, () => setIsQuickSpeaking(false));
                        }
                      }}
                      className="px-2.5 py-1 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                      title="বাংলা অর্থ শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>বাংলা পাঠ (TTS)</span>
                    </button>
                  )}

                  {isQuickSpeaking && (
                    <button
                      onClick={() => {
                        pronunciationVoiceService.stopSpeech();
                        setIsQuickSpeaking(false);
                      }}
                      className="px-2 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                    >
                      ভয়েস থামান
                    </button>
                  )}

                  <button
                    onClick={handleCopyLyrics}
                    className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-black flex items-center gap-1 transition shadow cursor-pointer"
                    title="সম্পূর্ণ লিরিক্স ও অর্থ কপি করুন"
                  >
                    {copiedLyrics ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLyrics ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {activeTrack?.arabicText ? (
                <div className="p-4 sm:p-6 rounded-3xl bg-black/40 border border-amber-400/50 space-y-4 shadow-xl">
                  {/* 1. Arabic Text */}
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                      মূল আরবি তিলাওয়াত:
                    </span>
                    <p
                      className={`font-arabic text-amber-100 text-right leading-loose break-words ${
                        lyricsFontSize === 'sm'
                          ? 'text-lg sm:text-xl'
                          : lyricsFontSize === 'base'
                          ? 'text-xl sm:text-2xl'
                          : lyricsFontSize === 'lg'
                          ? 'text-2xl sm:text-3xl'
                          : 'text-3xl sm:text-4xl'
                      }`}
                      dir="rtl"
                    >
                      {activeTrack.arabicText}
                    </p>
                  </div>

                  {/* 2. Transliteration */}
                  {activeTrack.transliterationBn && (
                    <div className="pt-3 border-t border-emerald-800/80">
                      <span className="text-xs font-bold text-emerald-300 block mb-1">
                        বাংলা উচ্চারণ:
                      </span>
                      <p
                        className={`text-white leading-relaxed font-serif break-words ${
                          lyricsFontSize === 'sm'
                            ? 'text-xs sm:text-sm'
                            : lyricsFontSize === 'base'
                            ? 'text-sm sm:text-base'
                            : lyricsFontSize === 'lg'
                            ? 'text-base sm:text-lg'
                            : 'text-lg sm:text-xl'
                        }`}
                      >
                        {activeTrack.transliterationBn}
                      </p>
                    </div>
                  )}

                  {/* 3. Translation */}
                  {activeTrack.translationBn && (
                    <div className="pt-3 border-t border-emerald-800/80">
                      <span className="text-xs font-bold text-teal-300 block mb-1">
                        বাংলা ভাবার্থ ও অনুবাদ:
                      </span>
                      <p
                        className={`text-emerald-100 leading-relaxed break-words ${
                          lyricsFontSize === 'sm'
                            ? 'text-xs sm:text-sm'
                            : lyricsFontSize === 'base'
                            ? 'text-sm sm:text-base'
                            : lyricsFontSize === 'lg'
                            ? 'text-base sm:text-lg'
                            : 'text-lg sm:text-xl'
                        }`}
                      >
                        {activeTrack.translationBn}
                      </p>
                    </div>
                  )}

                  {/* 4. Virtue */}
                  {activeTrack.virtueBn && (
                    <div className="p-3.5 rounded-2xl bg-emerald-900/60 border border-emerald-700 text-xs text-emerald-200 space-y-1">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        আমলের ফজিলত ও উপকারিতা:
                      </span>
                      <p className="leading-relaxed break-words">{activeTrack.virtueBn}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-emerald-300 bg-black/30 rounded-2xl border border-emerald-800/60 p-6">
                  বর্তমান ট্র্যাকটির জন্য কোনো বিশেষ দোয়া লিরিক্স যুক্ত করা নেই। আপনি অডিও প্লেয়ার বা অন্যান্য ফোল্ডার থেকে হিসনুল মুসলিম এর দোয়া নির্বাচন করতে পারেন।
                </div>
              )}
            </div>
          )}

          {/* VIEW 5: HISNUL MUSLIM BOOK & PDF VIEWER */}
          {activeTab === 'hisnul_book' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Book Header Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 to-teal-900 border-2 border-amber-400/70 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
                      <BookMarked className="w-5 h-5 text-amber-400" />
                      <span>{HISNUL_MUSLIM_BOOK_INFO.bookTitleBn}</span>
                    </h3>
                    <p className="font-arabic text-sm text-amber-100/90 mt-0.5" dir="rtl">
                      {HISNUL_MUSLIM_BOOK_INFO.bookTitleAr}
                    </p>
                    <p className="text-xs text-emerald-200 mt-1">
                      লেখক: {HISNUL_MUSLIM_BOOK_INFO.authorBn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={HISNUL_MUSLIM_BOOK_INFO.pdfOnlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>পিডিএফ ডাউনলোড / ভিউ</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-emerald-200/90 leading-relaxed border-t border-emerald-800/80 pt-2">
                  {HISNUL_MUSLIM_BOOK_INFO.descriptionBn}
                </p>
              </div>

              {/* Book Chapters Table of Contents */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ListMusic className="w-4 h-4" />
                  <span>বইটির গুরুত্বপূর্ণ অধ্যায় ও পৃষ্ঠা সূচী:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {HISNUL_MUSLIM_BOOK_INFO.chaptersSummary.map((ch) => (
                    <div
                      key={ch.num}
                      className="p-3 rounded-xl bg-black/40 border border-emerald-800/60 flex items-center justify-between gap-2 hover:bg-black/60 transition"
                    >
                      <div>
                        <span className="font-mono text-amber-400 font-bold mr-2">
                          #{toBengaliDigits(ch.num)}
                        </span>
                        <span className="font-bold text-white">{ch.title}</span>
                      </div>
                      <span className="text-[11px] text-emerald-300 font-mono shrink-0">
                        পৃষ্ঠা: {toBengaliDigits(ch.page)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: TTS VOICE & PRONUNCIATION CONTROLS */}
          {activeTab === 'tts_voice' && (
            <VoiceControlTab
              activeTrack={activeTrack}
              onToast={(msg) => showToast(msg)}
              onReciterChanged={(reciter) => {
                showToast(`🎙️ ক্বারী নির্বাচিত: ${reciter.nameBn}`);
              }}
            />
          )}

        </div>

        {/* Video Player Modal Embed if Active */}
        {activeVideoId && (
          <div
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setActiveVideoId(null)}
          >
            <div
              className="bg-emerald-950 border-2 border-amber-400 rounded-3xl p-4 max-w-3xl w-full space-y-3 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-amber-300 text-sm sm:text-base flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-400" />
                  <span>হিসনুল মুসলিম সহীহ ভিডিও তিলাওয়াত</span>
                </h3>
                <button
                  onClick={() => setActiveVideoId(null)}
                  className="p-1.5 rounded-full bg-black/40 text-emerald-200 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-emerald-800">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreatePlaylistModal && (
          <div
            className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowCreatePlaylistModal(false)}
          >
            <div
              className="bg-emerald-950 border-2 border-amber-400 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                <h3 className="font-black text-amber-300 text-sm sm:text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>নতুন প্লেলিস্ট ও টাইম শিডিউল তৈরি</span>
                </h3>
                <button
                  onClick={() => setShowCreatePlaylistModal(false)}
                  className="p-1 rounded-full text-emerald-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePlaylist} className="space-y-3 text-xs">
                <div>
                  <label className="block text-emerald-200 font-bold mb-1">
                    প্লেলিস্টের নাম:
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: আমার সকালের আমল / তাহাজ্জুদ প্লেলিস্ট"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3 py-2 text-white placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-emerald-200 font-bold mb-1">
                      শুরুর সময় (অটো-প্লে):
                    </label>
                    <input
                      type="time"
                      value={newPlaylistStart}
                      onChange={(e) => setNewPlaylistStart(e.target.value)}
                      className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-200 font-bold mb-1">
                      শেষের সময়:
                    </label>
                    <input
                      type="time"
                      value={newPlaylistEnd}
                      onChange={(e) => setNewPlaylistEnd(e.target.value)}
                      className="w-full bg-emerald-900/90 border border-emerald-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreatePlaylistModal(false)}
                    className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-200 font-bold hover:bg-emerald-800 transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black transition cursor-pointer shadow"
                  >
                    তৈরি করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Audio Details & Reference Modal */}
        <AudioDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          track={activeTrack}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onToast={(msg) => showToast(msg)}
        />

        {/* 24/7 Radio Folder Alarm Creation Modal */}
        {showFolderAlarmModal && (
          <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateFolderAlarm}
              className="w-full max-w-md bg-emerald-950 border-2 border-amber-400 rounded-3xl p-5 text-white space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-amber-300">
                    ২৪/৭ অডিও ফোল্ডার এলার্ম সেট করুন
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFolderAlarmModal(false)}
                  className="text-emerald-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-emerald-200 block mb-1">এলার্মের শিরোনাম:</label>
                  <input
                    type="text"
                    value={alarmCustomTitle}
                    onChange={(e) => setAlarmCustomTitle(e.target.value)}
                    placeholder="যেমন: ফজর সালাত ও কুরআন, বা সকালের ওষুধ..."
                    className="w-full p-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-emerald-200 block mb-1">এলার্মের সময় (HH:MM):</label>
                  <input
                    type="time"
                    required
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-amber-300 block mb-1">
                    রেডিও অডিও ফোল্ডার (যে ফোল্ডার থেকে সুর বাজবে):
                  </label>
                  <select
                    value={alarmFolderChoice || activeTrack?.folderId || ''}
                    onChange={(e) => setAlarmFolderChoice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-emerald-900 border border-emerald-700 text-white text-xs cursor-pointer focus:outline-none focus:border-amber-400"
                  >
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.titleBn} ({f.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[11px] text-emerald-300/90 bg-emerald-900/60 p-2.5 rounded-xl border border-emerald-800">
                  💡 নির্ধারিত সময়ে এই অডিও ফোল্ডার থেকে মধুর তিলাওয়াত ও বাংলা ভয়েস রিমাইন্ডার স্বয়ংক্রিয়ভাবে বেজে উঠবে।
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-800">
                <button
                  type="button"
                  onClick={() => setShowFolderAlarmModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-900 text-emerald-200 text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="w-4 h-4 fill-current" />
                  <span>এলার্ম সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ALWAYS-VISIBLE STICKY BOTTOM QUICK ACTION BAR (ENSURES CLOSE BUTTON IS ACCESSIBLE INSTANTLY ON MOBILE) */}
        <div className="shrink-0 bg-emerald-950/98 border-t-2 border-emerald-700/90 px-3 py-2 sm:py-2.5 flex items-center justify-between gap-2 z-40 backdrop-blur-md shadow-2xl">
          {/* PRIMARY CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xl border-2 border-rose-400 transition cursor-pointer active:scale-95"
            title="প্লেয়ার বন্ধ করুন"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>প্লেয়ার বন্ধ করুন</span>
          </button>

          {/* FOLDER ALARM BUTTON */}
          <button
            onClick={() => {
              setAlarmCustomTitle(activeTrack?.title || '');
              setAlarmFolderChoice(activeTrack?.folderId || '');
              setShowFolderAlarmModal(true);
            }}
            className="py-2 px-3 sm:px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg border border-amber-300 transition cursor-pointer shrink-0 active:scale-95"
            title="এই অডিও বা ফোল্ডার দিয়ে এলার্ম সেট করুন"
          >
            <Bell className="w-4 h-4 fill-current text-emerald-950" />
            <span>ফোল্ডার এলার্ম</span>
          </button>

          {/* MINIMIZE BUTTON */}
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-emerald-600 transition cursor-pointer active:scale-95"
            title="নিচে ব্যাকগ্রাউন্ডে মিনিমাইজ করুন"
          >
            <ChevronDown className="w-4 h-4" />
            <span>মিনিমাইজ</span>
          </button>
        </div>

      </div>
    </div>
  );
};
