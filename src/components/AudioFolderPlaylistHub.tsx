import React, { useState, useEffect } from 'react';
import {
  Folder,
  Play,
  Pause,
  Clock,
  Heart,
  BookOpen,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  Plus,
  Radio,
  Search,
  Check,
  ChevronRight,
  ChevronDown,
  Volume2,
  ListMusic,
  Share2
} from 'lucide-react';
import { playlistManager, AudioFolder, PlayableTrack } from '../services/audioPlaylistManager';
import { HISNUL_MUSLIM_ITEMS, HISNUL_MUSLIM_BOOK_INFO, HisnulMuslimItem } from '../data/hisnulMuslimFullData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { ScheduleTimelineVisualizer } from './ScheduleTimelineVisualizer';

interface AudioFolderPlaylistHubProps {
  onPlayAudio: (title: string, url: string) => void;
  currentlyPlayingUrl?: string;
  isPlaying?: boolean;
  lang?: 'bn' | 'en' | 'ar';
}

export const AudioFolderPlaylistHub: React.FC<AudioFolderPlaylistHubProps> = ({
  onPlayAudio,
  currentlyPlayingUrl,
  isPlaying,
  lang = 'bn'
}) => {
  const [folders, setFolders] = useState<AudioFolder[]>(() => playlistManager.getFolders());
  const [selectedFolderId, setSelectedFolderId] = useState<string>('hisnul_muslim');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync with playlistManager
  useEffect(() => {
    const handleUpdate = () => {
      setFolders(playlistManager.getFolders());
    };
    const unsubscribe = playlistManager.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenPopupPlayer = (track?: PlayableTrack) => {
    if (track) {
      playlistManager.setActiveTrack(track, selectedFolderId);
      onPlayAudio(track.title, track.audioUrl);
    }
    window.dispatchEvent(new CustomEvent('open-music-player-popup'));
  };

  const handleToggleFavorite = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    const isFav = playlistManager.toggleFavorite(trackId);
    setFolders(playlistManager.getFolders());
    showToast(isFav ? '❤️ পছন্দের তালিকায় যুক্ত করা হয়েছে' : 'পছন্দের তালিকা থেকে বাদ দেওয়া হয়েছে');
  };

  // Get tracks for selected folder
  const currentFolder = folders.find(f => f.id === selectedFolderId) || folders[0];
  const folderTracks = playlistManager.getTracksInFolder(selectedFolderId);

  // Filtered tracks by search
  const filteredTracks = folderTracks.filter(tr => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      tr.title.toLowerCase().includes(q) ||
      (tr.arabicText && tr.arabicText.includes(q)) ||
      (tr.translationBn && tr.translationBn.toLowerCase().includes(q)) ||
      (tr.transliterationBn && tr.transliterationBn.toLowerCase().includes(q)) ||
      (tr.categoryBn && tr.categoryBn.toLowerCase().includes(q))
    );
  });

  return (
    <div id="audio-folder-playlist-hub" className="space-y-5">
      
      {/* Floating Notification Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-amber-400 text-emerald-950 font-black text-xs shadow-2xl border border-emerald-900 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Feature Banner: Folder & Playlist Music System */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400/80 shadow-2xl text-white relative overflow-hidden">
        
        {/* Background Islamic Geometric Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black shadow flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>ফোল্ডার ও প্লেলিস্ট সিস্টেম</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-800 border border-emerald-600 text-[11px] font-bold text-amber-300">
                ২৪/৭ টাইম অটো-প্লে ও ডুপ্লিকেট মুক্ত
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-tight">
              ইসলামিক অডিও ফোল্ডার, প্লেলিস্ট ও হিসনুল মুসলিম লাইব্রেরি
            </h2>

            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              আপনার পছন্দের অডিওগুলো ফোল্ডার ও প্লেলিস্ট আকারে সাজানো রয়েছে। প্রতিটি ফোল্ডারের গান বা দোয়া সময় অনুযায়ী অটো-প্লে হবে এবং পপ-আপ মিউজিক প্লেয়ার এর মত স্বচ্ছ ইন্টারফেসে লিরিক্স ও অর্থসহ উপভোগ করুন।
            </p>
          </div>

          {/* Action Launch Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenPopupPlayer()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-emerald-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition active:scale-95 cursor-pointer border border-amber-200"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>🎧 পপ আপ প্লেয়ারে শুনুন</span>
            </button>
          </div>
        </div>

        {/* Horizontal Quick Folder Selector Carousel */}
        <div className="mt-5 pt-4 border-t border-emerald-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {folders.map(f => {
            const isSelected = selectedFolderId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolderId(f.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg scale-105'
                    : 'bg-emerald-900/60 text-emerald-200 border-emerald-700/60 hover:bg-emerald-800/80'
                }`}
              >
                <span>{f.id === 'favorites' ? '❤️' : f.id === 'hisnul_muslim' ? '📚' : '📁'}</span>
                <span>{f.titleBn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                  isSelected ? 'bg-emerald-950 text-amber-300' : 'bg-emerald-950/60 text-emerald-300'
                }`}>
                  {f.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Hisnul Muslim Info Card when Hisnul Muslim folder is active */}
      {selectedFolderId === 'hisnul_muslim' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-900 border border-amber-400/50 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">📖</span>
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {HISNUL_MUSLIM_BOOK_INFO.bookTitleBn} (দৈনন্দিন জীবনের সহীহ দোয়া ও আজকার)
                </h3>
              </div>
              <p className="font-arabic text-xs text-amber-100/90 mt-0.5" dir="rtl">
                {HISNUL_MUSLIM_BOOK_INFO.bookTitleAr} • সংকলক: {HISNUL_MUSLIM_BOOK_INFO.authorBn}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={HISNUL_MUSLIM_BOOK_INFO.pdfOnlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>পিডিএফ ভিউ / ডাউনলোড</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleOpenPopupPlayer()}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>বই সূচী ও অধ্যায়</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-emerald-200/90 leading-relaxed border-t border-emerald-800/80 pt-2">
            {HISNUL_MUSLIM_BOOK_INFO.descriptionBn}
          </p>
        </div>
      )}

      {/* 24-Hour Schedule & Free Time Slot Visualizer */}
      <ScheduleTimelineVisualizer
        selectedFolderId={selectedFolderId}
        onPlayTrack={(track) => {
          playlistManager.setActiveTrack(track, selectedFolderId);
          onPlayAudio(track.title, track.audioUrl);
        }}
        onCreatePlaylistForSlot={() => {
          handleOpenPopupPlayer();
        }}
      />

      {/* Tracks Browser & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-800/60 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="দোয়া, সূরা বা বিষয় দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-emerald-900/40 dark:bg-emerald-900/60 border border-emerald-700/60 rounded-xl text-xs text-white placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
            />
          </div>

          <span className="text-xs text-emerald-300 whitespace-nowrap font-medium hidden sm:inline">
            মোট: {toBengaliDigits(filteredTracks.length)} টি
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (filteredTracks.length > 0) {
                handleOpenPopupPlayer(filteredTracks[0]);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>সবগুলো প্লে করুন</span>
          </button>
        </div>
      </div>

      {/* Tracks Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTracks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-emerald-300/80 text-sm">
            কোনো অডিও ট্র্যাক খুঁজে পাওয়া যায়নি। অন্য শব্দ দিয়ে সার্চ করুন।
          </div>
        ) : (
          filteredTracks.map((track, idx) => {
            const isCurrentPlaying = currentlyPlayingUrl === track.audioUrl && isPlaying;
            const isExpanded = expandedItemId === track.id;
            const isFav = playlistManager.isFavorite(track.id);

            return (
              <div
                key={track.id}
                className={`p-4 rounded-2xl border transition-all duration-200 bg-white/95 dark:bg-emerald-950/70 ${
                  isCurrentPlaying
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                    : 'border-emerald-800/40 hover:border-amber-400/60 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Row: Category, Time Slot & Actions */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-amber-300 border border-emerald-700/60 truncate">
                      {track.categoryBn || track.folderTitleBn}
                    </span>

                    {track.startTime && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>{toBengaliDigits(track.startTime)} - {toBengaliDigits(track.endTime || '')}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => handleToggleFavorite(e, track.id)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isFav
                          ? 'text-rose-500 bg-rose-500/10'
                          : 'text-emerald-400 hover:text-rose-400 hover:bg-black/20'
                      }`}
                      title={isFav ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {track.videoId && (
                      <button
                        onClick={() => setActiveVideoUrl(track.videoId!)}
                        className="p-1.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-800 hover:text-white transition cursor-pointer"
                        title="ভিডিও দেখুন"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Scholar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-black text-sm sm:text-base text-gray-900 dark:text-amber-200 line-clamp-1">
                      {track.title}
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5 line-clamp-1">
                      {track.reciterOrScholar} {track.subtitle && `• ${track.subtitle}`}
                    </p>
                  </div>

                  {/* Play Trigger */}
                  <button
                    onClick={() => handleOpenPopupPlayer(track)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition shadow cursor-pointer active:scale-90 shrink-0 ${
                      isCurrentPlaying
                        ? 'bg-amber-400 text-emerald-950 font-black'
                        : 'bg-emerald-800 hover:bg-amber-400 hover:text-emerald-950 text-amber-300'
                    }`}
                    title={isCurrentPlaying ? 'চলছে (পপ-আপ প্লেয়ার খুলুন)' : 'চালু করুন'}
                  >
                    {isCurrentPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>

                {/* Arabic Text Preview if present */}
                {track.arabicText && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-900/30 border border-emerald-800/40">
                    <p className="font-arabic text-sm text-amber-100 text-right leading-relaxed line-clamp-2" dir="rtl">
                      {track.arabicText}
                    </p>

                    {track.translationBn && (
                      <p className="text-[11px] text-emerald-300/90 mt-1 line-clamp-1">
                        অর্থ: {track.translationBn}
                      </p>
                    )}
                  </div>
                )}

                {/* Expanded Details Button */}
                {(track.transliterationBn || track.virtueBn || track.referenceBn) && (
                  <div className="mt-2 pt-2 border-t border-emerald-800/30 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => setExpandedItemId(isExpanded ? null : track.id)}
                      className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'উচ্চারণ ও ফজিলত দেখুন'}</span>
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => handleOpenPopupPlayer(track)}
                      className="text-emerald-300 hover:text-amber-300 font-bold cursor-pointer"
                    >
                      লিরিক্স সহ সম্পূর্ণ শুনুন →
                    </button>
                  </div>
                )}

                {/* Expanded Box */}
                {isExpanded && (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-amber-400/30 text-xs space-y-2 animate-fade-in">
                    {track.transliterationBn && (
                      <div>
                        <span className="font-bold text-amber-300 block mb-0.5">বাংলা উচ্চারণ:</span>
                        <p className="text-white font-serif">{track.transliterationBn}</p>
                      </div>
                    )}
                    {track.virtueBn && (
                      <div className="pt-1.5 border-t border-white/10">
                        <span className="font-bold text-emerald-300 block mb-0.5">ফজিলত ও আমল:</span>
                        <p className="text-emerald-200">{track.virtueBn}</p>
                      </div>
                    )}
                    {track.referenceBn && (
                      <div className="text-[10px] text-emerald-400 font-mono">
                        রেফারেন্স: {track.referenceBn}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Video Embed Modal */}
      {activeVideoUrl && (
        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div
            className="bg-emerald-950 border-2 border-amber-400 rounded-3xl p-4 max-w-3xl w-full space-y-3 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                <span>সহীহ ভিডিও তিলাওয়াত ও তাফসীর</span>
              </h3>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="px-3 py-1 rounded-xl bg-emerald-900 text-emerald-200 hover:text-white text-xs font-bold cursor-pointer"
              >
                বন্ধ করুন ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-emerald-800">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideoUrl}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
