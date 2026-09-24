import React, { useState, useEffect } from 'react';
import { ExternalLink, Sparkles, X, Globe, Eye, ShieldCheck } from 'lucide-react';
import { 
  SitePromotion, 
  getActiveSitePromotion, 
  recordPromotionClick, 
  recordPromotionImpression 
} from '../lib/firebase';

interface Props {
  onOpenAdmin?: () => void;
  isAdmin?: boolean;
}

export const WebsitePromotionBanner: React.FC<Props> = ({ onOpenAdmin, isAdmin }) => {
  const [promo, setPromo] = useState<SitePromotion | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('dismissed_site_promo') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    // Fetch promotion config
    getActiveSitePromotion().then((data) => {
      setPromo(data);
      if (data && data.isActive && !isDismissed) {
        recordPromotionImpression();
      }
    });

    // Real-time listener for updates from Admin Panel
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SitePromotion>;
      if (customEvent.detail) {
        setPromo(customEvent.detail);
        setIsDismissed(false);
      }
    };

    window.addEventListener('site-promotion-updated', handleUpdate);
    return () => window.removeEventListener('site-promotion-updated', handleUpdate);
  }, []);

  if (!promo || !promo.isActive || isDismissed) {
    return null;
  }

  const handleCtaClick = () => {
    recordPromotionClick();
    if (promo.websiteUrl) {
      window.open(promo.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('dismissed_site_promo', 'true');
    } catch (e) {}
  };

  // Theme styling presets
  const getThemeClasses = () => {
    switch (promo.bannerTheme) {
      case 'emerald':
        return {
          wrapper: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-emerald-500/60 text-white',
          tag: 'bg-emerald-400 text-slate-950 font-black',
          btn: 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-400/20'
        };
      case 'royal':
        return {
          wrapper: 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-indigo-400/60 text-white',
          tag: 'bg-indigo-400 text-slate-950 font-black',
          btn: 'bg-indigo-400 hover:bg-indigo-300 text-slate-950 shadow-indigo-400/20'
        };
      case 'sunset':
        return {
          wrapper: 'bg-gradient-to-r from-rose-950 via-amber-950 to-slate-950 border-amber-500/60 text-white',
          tag: 'bg-amber-400 text-slate-950 font-black',
          btn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
        };
      case 'gold':
      default:
        return {
          wrapper: 'bg-gradient-to-r from-amber-950/90 via-emerald-950 to-slate-950 border-amber-400/70 text-white',
          tag: 'bg-amber-400 text-slate-950 font-black',
          btn: 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/30'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`relative w-full rounded-2xl border-2 p-3 sm:p-4 shadow-xl transition-all duration-300 ${theme.wrapper}`}>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left Side: Tag, Website Name & Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
            <Globe className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${theme.tag}`}>
                {promo.tag || 'স্পন্সরড'}
              </span>

              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <span>{promo.websiteName}</span>
              </span>

              {promo.clickCount !== undefined && promo.clickCount > 0 && (
                <span className="text-[10px] text-gray-400 hidden md:inline-flex items-center gap-1 font-mono">
                  <Eye className="w-3 h-3 text-emerald-400" />
                  <span>{promo.clickCount} ক্লিক</span>
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
              {promo.title}
            </h4>

            {promo.description && (
              <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-2 sm:line-clamp-1 leading-relaxed">
                {promo.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Action Button & Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end">
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              title="বিজ্ঞাপন ও ওয়েবসাইট প্রমোশন সম্পাদনা করুন"
              className="px-2.5 py-1.5 rounded-xl bg-black/50 hover:bg-black/80 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">এডমিন এডিট</span>
            </button>
          )}

          <button
            onClick={handleCtaClick}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95 ${theme.btn}`}
          >
            <span>{promo.ctaText || 'ওয়েবসাইটে যান'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDismiss}
            title="বিজ্ঞাপন বন্ধ করুন"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
