import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface QuickActionFabsProps {
  onOpenDua: () => void;
  onOpenDhikr: () => void;
  lang?: string;
}

export const QuickDuaFab: React.FC<QuickActionFabsProps> = ({ onOpenDua, onOpenDhikr, lang = 'bn' }) => {
  const [hoveredButton, setHoveredButton] = useState<'dua' | 'dhikr' | null>(null);

  return (
    <div className="fixed bottom-24 sm:bottom-28 right-3.5 sm:right-5 z-40 flex flex-col items-end gap-2 select-none">
      
      {/* 1. Quick Dhikr (📿) FAB */}
      <div className="relative flex items-center group">
        {hoveredButton === 'dhikr' && (
          <div className="absolute right-12 bg-emerald-950/95 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-xl shadow-lg border border-amber-400/40 whitespace-nowrap animate-fade-in mr-1">
            📿 তাৎক্ষণিক জিকির (Quick Dhikr)
          </div>
        )}

        <button
          onClick={onOpenDhikr}
          onMouseEnter={() => setHoveredButton('dhikr')}
          onMouseLeave={() => setHoveredButton(null)}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-800 text-white shadow-xl shadow-teal-900/40 border-2 border-teal-200/60 hover:border-amber-300 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
          aria-label="Quick Dhikr Counter"
          title="তাৎক্ষণিক জিকির ও তাসবিহ"
        >
          <span className="text-xl sm:text-2xl filter drop-shadow">📿</span>
        </button>
      </div>

      {/* 2. Quick Dua (🤲) FAB */}
      <div className="relative flex items-center group">
        {hoveredButton === 'dua' && (
          <div className="absolute right-12 bg-emerald-950/95 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-xl shadow-lg border border-amber-400/40 whitespace-nowrap animate-fade-in mr-1">
            🤲 তাৎক্ষণিক দোয়া (Quick Dua)
          </div>
        )}

        <button
          onClick={onOpenDua}
          onMouseEnter={() => setHoveredButton('dua')}
          onMouseLeave={() => setHoveredButton(null)}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 text-emerald-950 shadow-xl shadow-amber-900/40 border-2 border-yellow-100 hover:border-amber-200 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer relative group"
          aria-label="Quick Dua Modal"
          title="তাৎক্ষণিক দোয়া ও মুনাজাত"
        >
          <span className="text-xl sm:text-2xl filter drop-shadow">🤲</span>
          {/* Subtle live indicator dot */}
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white animate-pulse" />
        </button>
      </div>

    </div>
  );
};

export default QuickDuaFab;
