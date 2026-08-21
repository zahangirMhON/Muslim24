import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Lock,
  Volume2,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { deviceAmalNotifier } from '../services/deviceAmalNotificationEngine';
import { getDayOverview, getTodayDateString } from '../services/amalTrackerService';

export const LockscreenTestOverlay: React.FC = () => {
  const [state, setState] = useState<{
    active: boolean;
    secondsLeft: number;
    completed: boolean;
    isIframe: boolean;
    permission: NotificationPermission;
    message?: string;
  }>({
    active: false,
    secondsLeft: 0,
    completed: false,
    isIframe: false,
    permission: 'default'
  });

  useEffect(() => {
    const unsubscribe = deviceAmalNotifier.subscribeCountdown((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  if (!state.active && !state.completed) {
    return null;
  }

  const handleClose = () => {
    deviceAmalNotifier.cancelCountdown();
    setState(prev => ({ ...prev, active: false, completed: false }));
  };

  const handleOpenNewTab = () => {
    try {
      window.open(window.location.href, '_blank');
    } catch (e) {
      console.log('Open tab error:', e);
    }
  };

  const overview = getDayOverview(getTodayDateString());

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 border-2 border-amber-400 text-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-center relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 text-emerald-300 hover:text-white hover:bg-black/60 transition cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* State 1: Active Countdown */}
        {state.active && (
          <div className="space-y-4 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5 animate-bounce" />
              <span>লক স্ক্রিন টেস্ট সক্রিয়</span>
            </div>

            {/* Big Animated Countdown Circle */}
            <div className="flex justify-center my-3">
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-emerald-950 font-black text-5xl shadow-2xl shadow-amber-400/30 ring-8 ring-amber-400/30 animate-pulse font-mono">
                {state.secondsLeft}
              </div>
            </div>

            <div className="space-y-1.5 px-2">
              <h3 className="text-lg font-black text-amber-300">
                এখনই মোবাইলের পাওয়ার বাটন চেপে স্ক্রিন বন্ধ করুন!
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
                কাউন্টডাউন শেষ হলে (০ সে.) মোবাইলটি কেঁপে উঠবে এবং সাউন্ডসহ স্ক্রিনে আপনার আজকের আমল প্রগ্রেস ({overview.percent}%) ভেসে উঠবে।
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-200 flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>সাউন্ড ও ভাইব্রেশন টেস্ট লোড হচ্ছে...</span>
            </div>
          </div>
        )}

        {/* State 2: Completed / Success Screen */}
        {state.completed && (
          <div className="space-y-4 pt-2 animate-fade-in">
            <div className="flex justify-center">
              <div className="p-3.5 rounded-full bg-amber-400 text-emerald-950 shadow-xl">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-amber-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>টেস্ট সিগন্যাল সফলভাবে পাঠানো হয়েছে!</span>
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                আপনার ডিভাইসে আমল প্রগ্রেস ({overview.percent}%) ও নামাজের সতর্কতা অ্যালার্ট পাঠানো হয়েছে।
              </p>
            </div>

            {/* If in iframe (preview tab), guide user to open in full tab for 100% unrestricted push notifications */}
            {state.isIframe && (
              <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/50 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>আইফ্রেম প্রিভিউ নির্দেশিকা</span>
                </div>
                <p className="text-[11px] text-emerald-100 leading-relaxed">
                  ব্রাউজার সিকিউরিটির কারণে প্রিভিউ ফ্রেমের বদলে **নতুন ট্যাবে** বা ব্রাউজারে সরাসরি ওপেন করলে আসল মোবাইল লক স্ক্রিনে নোটিফিকেশন সবচেয়ে সুন্দরভাবে কাজ করে।
                </p>
                <button
                  onClick={handleOpenNewTab}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>নতুন ট্যাবে সম্পূর্ণ অ্যাপ খুলুন</span>
                </button>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs shadow transition cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
