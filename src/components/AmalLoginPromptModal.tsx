import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, UserCheck, CheckCircle2, Lock, ArrowRight, X, HeartHandshake } from 'lucide-react';
import { auth, loginWithGoogle } from '../lib/firebase';

interface AmalLoginPromptModalProps {
  // Can be controlled via props or global event
}

export const AmalLoginPromptModal: React.FC<AmalLoginPromptModalProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [amalTitle, setAmalTitle] = useState<string>('আমল');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  useEffect(() => {
    const handlePromptEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ titleBn?: string; onProceedGuest?: () => void }>;
      // If user is already logged in, do not show prompt
      if (auth.currentUser) {
        if (customEvent.detail?.onProceedGuest) {
          customEvent.detail.onProceedGuest();
        }
        return;
      }

      // Check if user previously opted to suppress prompt in this session
      const isDismissed = sessionStorage.getItem('amal_guest_prompt_suppressed');
      if (isDismissed === 'true') {
        if (customEvent.detail?.onProceedGuest) {
          customEvent.detail.onProceedGuest();
        }
        return;
      }

      setAmalTitle(customEvent.detail?.titleBn || 'আপনার আমল');
      setPendingCallback(() => customEvent.detail?.onProceedGuest || null);
      setIsOpen(true);
    };

    window.addEventListener('islamic-amal-login-prompt', handlePromptEvent);
    return () => {
      window.removeEventListener('islamic-amal-login-prompt', handlePromptEvent);
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      await loginWithGoogle();
      setIsOpen(false);
      if (pendingCallback) {
        pendingCallback();
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleContinueAsGuest = (rememberForSession = false) => {
    if (rememberForSession) {
      sessionStorage.setItem('amal_guest_prompt_suppressed', 'true');
    }
    setIsOpen(false);
    if (pendingCallback) {
      pendingCallback();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 text-emerald-50 rounded-3xl border-2 border-amber-400/60 max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => handleContinueAsGuest(false)}
          className="absolute top-4 right-4 text-emerald-300 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Islamic Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex p-3.5 rounded-2xl bg-amber-400 text-slate-950 shadow-lg ring-4 ring-amber-400/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-amber-200">
            আমল ট্র্যাকিং ও ক্লাউড সংরক্ষণ
          </h3>
          <p className="text-xs font-semibold text-emerald-300">
            "{amalTitle}" সম্পন্ন হিসেবে চিহ্নিত করতে যাচ্ছেন
          </p>
        </div>

        {/* Informative & Respectful explanation */}
        <div className="bg-emerald-950/70 p-4 rounded-2xl border border-emerald-500/30 space-y-2.5 text-xs text-emerald-100/95 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">ক্লাউড অটো-সিঙ্ক সুবিধা:</span> গুগল অ্যাকাউন্ট দিয়ে লগইন করলে আপনার আজকের ও বিগত দিন/সপ্তাহ/মাসের সকল আমলের অগ্রগতি নিরাপদে ক্লাউডে সংরক্ষিত থাকবে এবং আপনি কমিউনিটি বোর্ডে অনুপ্রেরণা হিসেবে যুক্ত হবেন।
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1.5 border-t border-white/10">
            <UserCheck className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-300">আপনার পূর্ণ স্বাধীনতা:</span> আপনি চাইলে লগইন করা ছাড়াই সম্পূর্ণ স্বাধীনভাবে অফলাইনেও ট্র্যাকিং চালিয়ে যেতে পারবেন। এটি আপনার একান্ত ব্যক্তিগত ইচ্ছা।
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Primary Option: 1-click Google Sign in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSigningIn ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-base">⏳</span>
                <span>লগইন হচ্ছে...</span>
              </span>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>গুগল দিয়ে লগইন ও ক্লাউডে সংরক্ষণ করুন</span>
              </>
            )}
          </button>

          {/* Secondary Option: Proceed as guest */}
          <button
            type="button"
            onClick={() => handleContinueAsGuest(false)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-200 hover:text-white font-bold text-xs transition border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>লগইন ছাড়াই সম্পন্ন করুন (অফলাইন ট্র্যাকিং)</span>
          </button>

          {/* Don't ask again during this session */}
          <button
            type="button"
            onClick={() => handleContinueAsGuest(true)}
            className="w-full text-center text-[11px] text-emerald-400/70 hover:text-amber-300 py-1 transition cursor-pointer"
          >
            এই সেশনে পরবর্তীতে আর দেখাবেন না ✕
          </button>
        </div>

      </div>
    </div>
  );
};
