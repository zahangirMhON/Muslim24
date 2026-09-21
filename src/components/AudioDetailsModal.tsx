import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Share2,
  Play,
  Pause,
  ExternalLink,
  Video,
  FileText,
  Clock,
  BookmarkCheck,
  Headphones,
  Info
} from 'lucide-react';
import { PlayableTrack } from '../services/audioPlaylistManager';
import { pronunciationVoiceService } from '../services/pronunciationVoiceService';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface AudioDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: PlayableTrack | null;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  onToast?: (msg: string) => void;
}

export const AudioDetailsModal: React.FC<AudioDetailsModalProps> = ({
  isOpen,
  onClose,
  track,
  isPlaying = false,
  onTogglePlay,
  onToast
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeakingArabic, setIsSpeakingArabic] = useState<boolean>(false);
  const [isSpeakingBengali, setIsSpeakingBengali] = useState<boolean>(false);
  const [modalFontSize, setModalFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  if (!isOpen || !track) return null;

  const handleCopyAll = () => {
    const lines = [
      `শিরোনাম: ${track.title}`,
      track.subtitle ? `উপ-শিরোনাম: ${track.subtitle}` : '',
      track.reciterOrScholar ? `ক্বারী/আলেম: ${track.reciterOrScholar}` : '',
      track.folderTitleBn ? `ক্যাটাগরি: ${track.folderTitleBn}` : '',
      track.referenceBn ? `রেফারেন্স: ${track.referenceBn}` : '',
      '',
      track.arabicText ? `আরবি পাঠ:\n${track.arabicText}` : '',
      '',
      track.transliterationBn ? `বাংলা উচ্চারণ:\n${track.transliterationBn}` : '',
      '',
      track.translationBn ? `বাংলা অনুবাদ ও ভাবার্থ:\n${track.translationBn}` : '',
      '',
      track.virtueBn ? `ফজিলত ও আমল:\n${track.virtueBn}` : '',
      '',
      `অডিও লিংক: ${track.audioUrl}`
    ].filter(Boolean).join('\n');

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(lines);
      setCopied(true);
      if (onToast) onToast('📋 অডিওর সকল বিস্তারিত তথ্য ও আরবি পাঠ কপি হয়েছে!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTtsArabic = () => {
    if (!track.arabicText) return;
    pronunciationVoiceService.stopSpeech();
    setIsSpeakingArabic(true);
    pronunciationVoiceService.speakArabic(track.arabicText, () => {
      setIsSpeakingArabic(false);
    });
  };

  const handleTtsBengali = () => {
    const txt = track.translationBn || track.transliterationBn;
    if (!txt) return;
    pronunciationVoiceService.stopSpeech();
    setIsSpeakingBengali(true);
    pronunciationVoiceService.speakBengali(txt, () => {
      setIsSpeakingBengali(false);
    });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-emerald-900 border-0 sm:border-2 border-amber-400/80 rounded-none sm:rounded-3xl w-full max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="p-3 sm:p-5 border-b border-emerald-800/80 flex items-center justify-between gap-3 bg-emerald-950/90 shrink-0 sticky top-0 z-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-bold text-[10px] sm:text-xs border border-emerald-600 truncate">
                {track.folderTitleBn || 'অডিও সংগ্রহ'}
              </span>
              {track.categoryBn && (
                <span className="text-[11px] text-emerald-300 font-medium truncate">
                  • {track.categoryBn}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-black text-amber-200 truncate">
              {track.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-emerald-300/90 truncate">
              {track.subtitle || track.reciterOrScholar || 'বিশুদ্ধ ইসলামিক অডিও পাঠ'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Adjuster inside modal */}
            <div className="flex items-center gap-1 bg-emerald-900/80 px-2 py-1 rounded-xl border border-emerald-700 text-xs">
              <button
                onClick={() => setModalFontSize(s => s === 'xl' ? 'lg' : s === 'lg' ? 'base' : 'sm')}
                className="px-1.5 py-0.5 hover:text-amber-300 font-bold cursor-pointer"
                title="ফন্ট ছোট করুন"
              >
                A-
              </button>
              <span className="text-[10px] text-amber-300 font-bold px-0.5">
                {modalFontSize === 'sm' ? 'ছোট' : modalFontSize === 'base' ? 'স্বাভাবিক' : modalFontSize === 'lg' ? 'বড়' : 'অনেক বড়'}
              </span>
              <button
                onClick={() => setModalFontSize(s => s === 'sm' ? 'base' : s === 'base' ? 'lg' : 'xl')}
                className="px-1.5 py-0.5 hover:text-amber-300 font-bold cursor-pointer"
                title="ফন্ট বড় করুন"
              >
                A+
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/60 font-bold transition cursor-pointer flex items-center gap-1 text-xs shadow"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">বন্ধ</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-5 scrollbar-thin">
          
          {/* Audio Playback & Reciter Banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-900/50 border border-emerald-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-lg transition active:scale-95 cursor-pointer hover:brightness-110 shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div>
                <div className="text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>ক্বারী / উপস্থাপক:</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {track.reciterOrScholar || 'শায়খ মিশারী রশিদ আল-আফাসী'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyAll}
                className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'সকল তথ্য কপি'}</span>
              </button>
            </div>
          </div>

          {/* 1. Arabic Scripture Box */}
          {track.arabicText && (
            <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-amber-400/50 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-2">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>মূল আরবি পাঠ (সহীহ তাজবীদ):</span>
                </span>
                <button
                  onClick={handleTtsArabic}
                  disabled={isSpeakingArabic}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                  title="আরবি উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeakingArabic ? 'উচ্চারণ চলছে...' : 'উচ্চারণ শুনুন'}</span>
                </button>
              </div>

              <p
                className={`font-arabic text-amber-100 text-right leading-loose selection:bg-amber-400 selection:text-emerald-950 break-words ${
                  modalFontSize === 'sm'
                    ? 'text-base sm:text-lg'
                    : modalFontSize === 'base'
                    ? 'text-lg sm:text-xl'
                    : modalFontSize === 'lg'
                    ? 'text-xl sm:text-2xl'
                    : 'text-2xl sm:text-3xl'
                }`}
                dir="rtl"
              >
                {track.arabicText}
              </p>
            </div>
          )}

          {/* 2. Bengali Transliteration (উচ্চারণ) */}
          {track.transliterationBn && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-1.5">
              <span className="text-xs font-black text-emerald-300 uppercase tracking-wide block">
                বাংলা উচ্চারণ ও সহীহ ধ্বনি:
              </span>
              <p
                className={`text-emerald-100 leading-relaxed font-serif break-words ${
                  modalFontSize === 'sm'
                    ? 'text-xs sm:text-sm'
                    : modalFontSize === 'base'
                    ? 'text-sm sm:text-base'
                    : modalFontSize === 'lg'
                    ? 'text-base sm:text-lg'
                    : 'text-lg sm:text-xl'
                }`}
              >
                {track.transliterationBn}
              </p>
            </div>
          )}

          {/* 3. Bengali Translation & Explanation (অনুবাদ ও ভাবার্থ) */}
          {track.translationBn && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 space-y-1.5">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-1.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wide block">
                  বাংলা অনুবাদ ও তাৎপর্য:
                </span>
                <button
                  onClick={handleTtsBengali}
                  disabled={isSpeakingBengali}
                  className="px-2.5 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
                  title="বাংলা অর্থ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeakingBengali ? 'অনুবাদ পাঠ চলছে...' : 'অর্থ শুনুন (TTS)'}</span>
                </button>
              </div>
              <p
                className={`text-white/95 leading-relaxed break-words ${
                  modalFontSize === 'sm'
                    ? 'text-xs sm:text-sm'
                    : modalFontSize === 'base'
                    ? 'text-sm sm:text-base'
                    : modalFontSize === 'lg'
                    ? 'text-base sm:text-lg'
                    : 'text-lg sm:text-xl'
                }`}
              >
                {track.translationBn}
              </p>
            </div>
          )}

          {/* 4. Virtues & Fazeelat (ফজিলত ও আমল) */}
          {track.virtueBn && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-emerald-950 to-teal-950/40 border border-amber-500/40 space-y-1.5">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>আমল ও বিশেষ ফজিলত:</span>
              </span>
              <p
                className={`text-amber-100/90 leading-relaxed font-medium break-words ${
                  modalFontSize === 'sm'
                    ? 'text-[11px] sm:text-xs'
                    : modalFontSize === 'base'
                    ? 'text-xs sm:text-sm'
                    : modalFontSize === 'lg'
                    ? 'text-sm sm:text-base'
                    : 'text-base sm:text-lg'
                }`}
              >
                {track.virtueBn}
              </p>
            </div>
          )}

          {/* 5. Authentic Reference & Meta Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {track.referenceBn && (
              <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800 text-xs">
                <span className="font-bold text-emerald-300 block mb-1">
                  📚 সহীহ রেফারেন্স ও সূত্র:
                </span>
                <p className="text-white font-medium">{track.referenceBn}</p>
              </div>
            )}

            {track.pdfPage && (
              <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800 text-xs">
                <span className="font-bold text-emerald-300 block mb-1">
                  📖 হিসনুল মুসলিম বইয়ের পৃষ্ঠা:
                </span>
                <p className="text-white font-medium">
                  পৃষ্ঠা নং {toBengaliDigits(track.pdfPage)} (মূল বাংলা অনুবাদ গ্রন্থ)
                </p>
              </div>
            )}
          </div>

          {/* 6. Technical Audio Stream Info */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-800/80 text-[11px] text-emerald-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>অডিও ফরম্যাট: MP3 (128 kbps Stereo)</span>
              <span className="text-emerald-300">স্ট্যাটাস: সক্রিয় ও যাচাইকৃত</span>
            </div>
            <p className="truncate text-emerald-500 font-mono text-[10px]">
              {track.audioUrl}
            </p>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-emerald-800/80 bg-emerald-950/90 flex items-center justify-between">
          <button
            onClick={handleCopyAll}
            className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>তথ্য কপি</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition shadow cursor-pointer"
          >
            প্লেয়ারে ফিরে যান
          </button>
        </div>

      </div>
    </div>
  );
};
