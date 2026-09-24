import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { INTERACTIVE_KEYWORDS_DICTIONARY } from '../data/interactiveKeywordsData';

interface InteractiveKeywordBadgeProps {
  keywordId: string;
  customLabel?: string;
  variant?: 'amber' | 'emerald' | 'teal' | 'gold';
  className?: string;
}

export const InteractiveKeywordBadge: React.FC<InteractiveKeywordBadgeProps> = ({
  keywordId,
  customLabel,
  variant = 'amber',
  className = ''
}) => {
  const keywordData = INTERACTIVE_KEYWORDS_DICTIONARY[keywordId];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('open-keyword-knowledge-modal', {
        detail: { keywordId }
      })
    );
  };

  const variantStyles = {
    amber: 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border-amber-400/50 hover:border-amber-300',
    emerald: 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50 hover:border-emerald-300',
    teal: 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border-teal-500/50 hover:border-teal-300',
    gold: 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 hover:from-amber-400/40 hover:to-amber-500/40 text-amber-200 border-amber-400/60 hover:border-amber-300'
  };

  const displayText = customLabel || (keywordData ? keywordData.keywordBn : keywordId);

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition shadow-sm cursor-pointer hover:scale-105 active:scale-95 group ${variantStyles[variant]} ${className}`}
      title="ক্লিক করে এই শব্দটির গভীর অর্থ, কেন ও কীভাবে আল্লাহ করতে বলেছেন তা জানুন"
    >
      <Sparkles className="w-3 h-3 text-amber-300 group-hover:rotate-12 transition-transform" />
      <span>{displayText}</span>
      <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">ℹ️</span>
    </button>
  );
};
