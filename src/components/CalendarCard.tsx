import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
  Info,
  CalendarDays,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CalendarDates, Language } from '../types';
import { translations } from '../locales/translations';
import { FullMonthCalendar } from './FullMonthCalendar';
import { UnifiedDayLifeConnectionModal } from './UnifiedDayLifeConnectionModal';
import { InteractiveKeywordBadge } from './InteractiveKeywordBadge';
import { TripleYearCycleProgressChart } from './TripleYearCycleProgressChart';

interface CalendarCardProps {
  dates: CalendarDates;
  lang: Language;
}

// Major Islamic & Prophetic/Sahaba Historical Events Data
const ALL_ISLAMIC_EVENTS = [
  {
    id: 'ramadan',
    title: 'পবিত্র রমজানুল মোবারক (Ramadan Mubarak)',
    hijriDate: '১ রমজান ১৪৪৮ হিজরি',
    gregorianApprox: 'ফেব্রুয়ারি ২০২৭',
    icon: '🌙',
    isContemporary: true,
    importance: 'ফারজ সিয়াম ও মহাগ্রন্থ আল-কুরআন নাজিলের মহিমান্বিত পবিত্র মাস।',
    historicalDetails: 'নবুওয়াতের ১৩ বছর পূর্বে এ মাসেই মহাগ্রন্থ আল-কুরআন লওহে মাহফুজ থেকে বাইতুল ইজ্জতে অবতীর্ণ হয় এবং সুরা আল-আলাকের মাধ্যমে ওহী নাজিলের ধারা সূচিত হয়। সাহাবায়ে কেরাম ৬ মাস আগে থেকেই রমজানের অপেক্ষায় দোয়া করতেন।',
    propheticSahabaContext: 'রাসূলুল্লাহ ﷺ এ মাসে সর্বাধিক দানশীল হতেন এবং জিবরীল (আ.)-এর সাথে কুরআন পূর্ণ পুনরাবৃত্তি করতেন।',
    recommendedDeeds: 'তারাবি সালাত, প্রতিদিন অর্থসহ কুরআন তিলাওয়াত, সাহরি ও ইফতার সুন্নাত উপায়ে পালন, শেষ দশকে ইতেকাফ এবং বেশি বেশি সাদাকাহ করা।'
  },
  {
    id: 'badar',
    title: 'ঐতিহাসিক বদর দিবস (Battle of Badr - ১৭ রমজান)',
    hijriDate: '১৭ রমজান ১৪৪৮ হিজরি',
    gregorianApprox: 'মার্চ ২০২৭',
    icon: '⚔️',
    isContemporary: true,
    importance: 'ইয়াউমুল ফুরকান — ইসলামের ইতিহাসে প্রথম সত্য ও মিথ্যার চূড়ান্ত বিজয়ের ঐতিহাসিক দিন।',
    historicalDetails: '২য় হিজরির ১৭ই রমজান ৩১৩ জন নিরস্ত্র সাহাবী পরাক্রমশালী ১০০০ কুরাইশ মুশরিকদের বিরুদ্ধে আল্লাহর গায়েবী সাহায্যে ঐতিহাসিক মহাবিজয় অর্জন করেন।',
    propheticSahabaContext: 'হযরত আলী (রা.), হযরত হামজা (রা.) ও ৩১৩ জন বীর বদরী সাহাবীর অবিচল নিষ্ঠা ও ত্যাগ। বদরী সাহাবাদের জন্য আল্লাহ জান্নাতের চূড়ান্ত মাগফিরাত ঘোষণা করেছেন।',
    recommendedDeeds: 'বদরী সাহাবাদের স্মৃতিস্মরণ, আল্লাহর প্রতি পূর্ণ তাওয়াক্কুল, সিরাত অধ্যয়ন ও দ্বীনের ওপর অবিচল থাকার বিশেষ মোনাজাত।'
  },
  {
    id: 'qadr',
    title: 'লাইলাতুল কদর (Shab-e-Qadr - হাজার মাসের চেয়ে শ্রেষ্ঠ রাত)',
    hijriDate: '২৭ রমজান ১৪৪৮ হিজরি (সম্ভাব্য)',
    gregorianApprox: 'মার্চ ২০২৭',
    icon: '✨',
    isContemporary: true,
    importance: 'হাজার মাসের (৮৩ বছর ৪ মাস) চেয়েও উত্তম বরকতময় ভাগ্য রজনী।',
    historicalDetails: 'আল্লাহ তাআলা এ রাতে পুরো মানবজাতির তাকদীর ও রহমতের ফয়সালা দেন। মালাইকা ও রুহুল কুদুস জিবরীল (আ.) জমিনে শান্তিময় রহমত নিয়ে আগমন করেন।',
    propheticSahabaContext: 'রাসূলুল্লাহ ﷺ শেষ দশকে পরিবার-পরিজনকে জাগিয়ে সারা রাত জাগ্রত থাকতেন এবং সাহাবীগণ মসজিদে ইতেকাফে কান্নাকাটি করতেন।',
    recommendedDeeds: 'সারা রাত নফল সালাত, "আল্লাহুম্মা ইন্নাকা আফুউন তুহিব্বুল আফওয়া ফাফউ আন্নি" পাঠ, তওবা এস্তেগফার এবং গভীর রাতে তাহাজ্জুদ।'
  },
  {
    id: 'makkah_victory',
    title: 'ঐতিহাসিক মক্কা বিজয় (Fath-e-Makkah - ২০ রমজান)',
    hijriDate: '২০ রমজান ১৪৪৮ হিজরি',
    gregorianApprox: 'মার্চ ২০২৭',
    icon: '🚩',
    isContemporary: true,
    importance: 'বিনা রক্তপাতে মক্কা বিজয় ও তাওহীদের পুনঃপ্রতিষ্ঠা।',
    historicalDetails: '৮ম হিজরির ২০ রমজান ১০,০০০ সাহাবীকে নিয়ে রাসূলুল্লাহ ﷺ বিনম্রভাবে মক্কা বিজয় করেন এবং কাবাগৃহ থেকে ৩৬০টি মূর্তি অপসারণ করে তাওহীদ কায়েম করেন।',
    propheticSahabaContext: 'হযরত বেলাল (রা.) কাবার ছাদে উঠে বিজয়ের আযান দেন এবং রাসূল ﷺ কুরাইশদের প্রতি ঐতিহাসিক সাধারণ ক্ষমা ঘোষণা করেন।',
    recommendedDeeds: 'আল্লাহর শুকরিয়া জ্ঞাপনে "সুবহানাল্লাহি ওয়া বিহামদিহি" পাঠ, অহংকার বর্জন ও মানুষের প্রতি ক্ষমাশীল মনোভাব প্রদর্শন।'
  },
  {
    id: 'fitr',
    title: 'পবিত্র ঈদুল ফিতর (Eid-ul-Fitr - ১ শাওয়াল)',
    hijriDate: '১ শাওয়াল ১৪৪৮ হিজরি',
    gregorianApprox: 'মার্চ/এপ্রিল ২০২৭',
    icon: '🎉',
    isContemporary: false,
    importance: 'এক মাস সিয়াম সাধনার পর রবের পক্ষ থেকে মহা পুরস্কার ও আনন্দের দিন।',
    historicalDetails: 'হিজরী দ্বিতীয় বর্ষে বদর যুদ্ধের বিজয়ের পর মুসলমানগণ প্রথম ঈদুল ফিতর উদযাপন করেন। এটি আনন্দ প্রকাশের সাথে রবের কৃতজ্ঞতা প্রকাশের পরম মুহূর্ত।',
    propheticSahabaContext: 'সাহাবীগণ একে অপরকে বলতেন: "তাক্বাব্বালাল্লাহু মিন্না ওয়া মিনকুম" (আল্লাহ আমাদের ও আপনার ইবাদত কবুল করুন)।',
    recommendedDeeds: 'ঈদের সালাতের পূর্বে সাদাকাতুল ফিতর আদায়, মিসওয়াক ও গোসল করে সর্বোত্তম পোশাকে তাকবীর পড়তে পড়তে সালাতে গমন এবং আত্মীয়দের হক আদায়।'
  },
  {
    id: 'uhud',
    title: 'ঐতিহাসিক ওহুদ দিবস (Battle of Uhud - ৭ শাওয়াল)',
    hijriDate: '৭ শাওয়াল ১৪৪৮ হিজরি',
    gregorianApprox: 'এপ্রিল ২০২৭',
    icon: '🛡️',
    isContemporary: false,
    importance: 'রাসূলুল্লাহ ﷺ-এর আনুগত্য ও ঈমানী দৃঢ়তার মহান শিক্ষা।',
    historicalDetails: '৩য় হিজরিতে ওহুদ প্রান্তরে কুরাইশদের বিরুদ্ধে যুদ্ধ। তিরন্দাজ দলের সামান্য অসতর্কতায় বিজয়ের মুহূর্তে সাময়িক বিপর্যয় নেমে আসে, যার মাধ্যমে রাসূলের আদেশের আনুগত্যের গুরুত্ব চিরতরে প্রতিষ্ঠিত হয়।',
    propheticSahabaContext: 'সাইয়েদুশ শুহাদা হযরত হামজা (রা.), হযরত মুসআব ইবনে উমায়ের (রা.) সহ ৭০ জন শ্রেষ্ঠ সাহাবীর শাহাদাত। হযরত তালহা (রা.) নিজের শরীর দিয়ে রাসূল ﷺ-কে রক্ষা করেন।',
    recommendedDeeds: 'রাসূলের সুন্নাহর প্রতি পূর্ণ আনুগত্য প্রকাশ, ওহুদের শহীদানদের জন্য মাগফিরাত ও জীবনে আত্মত্যাগের শপথ।'
  },
  {
    id: 'hudaibiyah',
    title: 'হুদায়বিয়ার ঐতিহাসিক সন্ধি ও বায়আতে রিদওয়ান (জিলকদ ৬ষ্ঠ হিজরি)',
    hijriDate: '১৫ জিলকদ ১৪৪৮ হিজরি',
    gregorianApprox: 'মে ২০২৭',
    icon: '📜',
    isContemporary: false,
    importance: 'আল্লাহ তাআলা কর্তৃক ঘোষিত "ফাতহুম মুবীন" (সুস্পষ্ট বিজয়)।',
    historicalDetails: '৬ষ্ঠ হিজরিতে ১৪০০ সাহাবী বৃক্ষের নিচে দাঁড়িয়ে রাসূলের হাতে আমৃত্যু লড়াই ও আনুগত্যের শপথ নেন, যা "বাইয়াতে রিদওয়ান" নামে খ্যাত। আল্লাহ কুরআনে এই সাহাবীদের ওপর তাঁর সন্তুষ্টি ঘোষণা করেন।',
    propheticSahabaContext: 'হযরত উসমান (রা.), হযরত আবু বকর (রা.), হযরত উমর (রা.) সহ সকল সাহাবীর আনুগত্যের অনন্য দৃষ্টান্ত।',
    recommendedDeeds: 'ধৈর্য ধারণ, প্রতিশ্রুতি রক্ষা ও আল্লাহর ওপর পরিপূর্ণ আস্থা বজায় রাখার আমল।'
  },
  {
    id: 'arafa',
    title: 'পবিত্র ইয়াউমে আরাফাহ (Day of Arafah - ৯ জিলহজ)',
    hijriDate: '৯ জিলহজ ১৪৪৮ হিজরি',
    gregorianApprox: 'জুন ২০২৭',
    icon: '🕋',
    isContemporary: false,
    importance: 'হজের প্রধান দিন এবং অ-হাজীদের জন্য বিগত ও আগামী বছরের গোনাহ মাফের সুবর্ণ সুযোগ।',
    historicalDetails: '১০ম হিজরিতে আরাফাতের ময়দানে সোয়া লক্ষ সাহাবীর সম্মুখে মহানবী ﷺ ঐতিহাসিক বিদায় হজের কালজয়ী ভাষণ দেন এবং দ্বীনের পূর্ণতা ঘোষণা করা হয়।',
    propheticSahabaContext: 'সাহাবীগণ সমস্বরে সাক্ষ্য দিয়েছিলেন: "হে আল্লাহর রাসূল! আপনি আপনার আমানত যথাযথ পৌঁছে দিয়েছেন।"',
    recommendedDeeds: 'আরাফাহর দিনে নফল রোজা রাখা, বেশি বেশি "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু" পাঠ ও আল্লাহর দরবারে রোনাজারি।'
  },
  {
    id: 'adha',
    title: 'পবিত্র ঈদুল আজহা (Eid-ul-Adha - ১০ জিলহজ)',
    hijriDate: '১০ জিলহজ ১৪৪৮ হিজরি',
    gregorianApprox: 'জুন ২০২৭',
    icon: '🐑',
    isContemporary: false,
    importance: 'হজ ও ত্যাগের মহিমায় উদ্দীপিত মহান কুরবানির ঈদ।',
    historicalDetails: 'হযরত ইব্রাহিম (আ.) ও হযরত ইসমাইল (আ.)-এর ঐতিহাসিক ত্যাগের স্মৃতিবিজড়িত ইবাদত। আল্লাহর সন্তুষ্টির জন্য সর্বস্ব ত্যাগের অনুপম দৃষ্টান্ত।',
    propheticSahabaContext: 'রাসূলুল্লাহ ﷺ এবং সাহাবায়ে কেরাম তাকবিরে তাশরিক পাঠ ও সামর্থ্যবানদের পক্ষ থেকে কুরবানি আদায় করতেন।',
    recommendedDeeds: '৯ জিলহজ ফজর থেকে ১৩ জিলহজ আসর পর্যন্ত প্রতি ফরজ নামাজের পর তাকবিরে তাশরিক পাঠ, ঈদের সালাত ও পশুর কুরবানি আদায়।'
  },
  {
    id: 'ashura',
    title: 'পবিত্র আশুরা (Holy Ashura - ১০ মহররম)',
    hijriDate: '১০ মহররম ১৪৪৯ হিজরি',
    gregorianApprox: 'জুলাই/আগস্ট ২০২৭',
    icon: '📿',
    isContemporary: false,
    importance: 'ইসলামের ইতিহাসে সত্যের বিজয় ও কারবালার ঐতিহাসিক শাহাদাত।',
    historicalDetails: 'এ দিনে হযরত মুসা (আ.) ও বনী ইসরাঈল ফেরাউনের জুলুম থেকে লোহিত সাগর পাড় হয়ে অলৌকিক মুক্তি লাভ করেন। পরবর্তীতে ৬১ হিজরিতে কারবালার প্রান্তরে নবীজির দৌহিত্র হযরত হুসাইন (রা.) সত্য ও ইনসাফের জন্য শাহাদাত বরণ করেন।',
    propheticSahabaContext: 'হযরত হুসাইন (রা.) ও আহলে বাইতের সদস্যগণের আপসহীন আত্মত্যাগ।',
    recommendedDeeds: 'মহররমের ৯ ও ১০ তারিখে (অথবা ১০ ও ১১ তারিখে) নফল সিয়াম পালন, বেশি বেশি তাওবা ও পরিবারে প্রশস্ততা আনা।'
  },
  {
    id: 'barat',
    title: 'পবিত্র শবে বরাত (Shab-e-Barat - ১৫ শাবান)',
    hijriDate: '১৫ শাবান ১৪৪৮ হিজরি',
    gregorianApprox: 'জানুয়ারি/ফেব্রুয়ারি ২০২৭',
    icon: '🕌',
    isContemporary: false,
    importance: 'আত্মশুদ্ধি, ক্ষমা ও রহমতের বরকতময় রজনী।',
    historicalDetails: 'এ রাতে আল্লাহ তাআলা অসংখ্য বান্দাকে ক্ষমা ঘোষণা করেন এবং রহমতের দুয়ার উন্মুক্ত করেন।',
    propheticSahabaContext: 'হযরত আয়েশা (রা.) বর্ণনা করেন, রাসূলুল্লাহ ﷺ এ রাতে জান্নাতুল বাক্বীতে গিয়ে মৃতদের জন্য দোয়া করতেন এবং দীর্ঘ সেজদায় মগ্ন থাকতেন।',
    recommendedDeeds: 'নফল সালাত, বেশি বেশি এস্তেগফার, গোনাহের জন্য কান্না ও ক্ষমা চাওয়া এবং পরবর্তী দিনে নফল রোজা রাখা।'
  }
];

export const CalendarCard: React.FC<CalendarCardProps> = ({ dates, lang }) => {
  const t = translations[lang];
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState<boolean>(false);

  const contemporaryEvents = ALL_ISLAMIC_EVENTS.filter(e => e.isContemporary);
  const displayedEvents = showAllEvents ? ALL_ISLAMIC_EVENTS : contemporaryEvents;

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-emerald-700/60 relative overflow-hidden space-y-5">
      
      {/* 1. Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-700/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-50">
              {t.todayCalendar} (আজকের ত্রিমুখী পঞ্জিকা)
            </h2>
          </div>
          <p className="text-xs text-emerald-200/80 mt-0.5 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>আরবি, ইংরেজি ও বাংলা ৩ ধরনের সম্পূর্ণ পঞ্জিকা এবং বিশিষ্ট দিনসমূহের পূর্ণ তালিকা</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUnifiedModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow cursor-pointer font-sans"
            title="আজকের তারিখের সাথে সকল সেকশন কানেকশন ও আমল প্রগ্রেস দেখুন"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>আজকের পূর্ণ সংযোগ ও আমল</span>
          </button>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow">
            <span>বার: {dates.gregorianDayName}</span>
          </span>
        </div>
      </div>

      {/* 2. Today's Triple Calendar Live Display (Minimalist Clean Design - Clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Gregorian Calendar */}
        <div
          onClick={() => setIsUnifiedModalOpen(true)}
          className="bg-emerald-950/80 backdrop-blur p-3.5 rounded-xl border border-teal-500/40 hover:border-teal-300 transition group shadow-inner flex flex-col justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] space-y-2"
          title="ক্লিক করে এই তারিখের সাথে সকল সেকশনের তথ্য একত্রীকরণ দেখুন"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-teal-300 mb-1.5 flex-wrap gap-1">
              <span className="font-bold flex items-center gap-1">📅 {t.gregorianDateLabel}</span>
              <div className="flex items-center gap-1">
                <span className="bg-teal-500/20 text-teal-200 px-1.5 py-0.5 rounded text-[10px] border border-teal-500/40 font-mono font-bold">
                  {dates.gregorianNumeric}
                </span>
                <span className="bg-teal-400/25 text-teal-100 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-400/40 uppercase tracking-wide shadow-sm">
                  🗓️ {dates.gregorianMonthPractice}
                </span>
              </div>
            </div>

            <div className="text-base sm:text-lg font-extrabold text-teal-50 group-hover:text-amber-200 transition py-0.5">
              {dates.gregorianFormatted}
            </div>

            <div className="text-[11px] text-teal-200/90 font-medium pt-1 bg-black/30 px-2 py-1 rounded-lg border border-white/5 space-y-0.5">
              <div className="text-[10px] text-teal-400 font-bold uppercase">সম্ভাব্য সমতুল্য অন্যান্য সন:</div>
              <div className="flex items-center gap-2 flex-wrap text-[10px]">
                <span className="text-amber-300">🌙 হিজরি: {dates.hijriFormatted.replace(' হিজরি', '')}</span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-300">🌾 বাংলা: {dates.bengaliFormatted.replace(' বঙ্গাব্দ', '')}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-teal-300/80 font-medium pt-1 flex items-center justify-between border-t border-white/5">
            <span>সকল সেকশন সংযোগ ও আমল</span>
            <span>➔</span>
          </div>
        </div>

        {/* Hijri Calendar */}
        <div
          onClick={() => setIsUnifiedModalOpen(true)}
          className="bg-emerald-950/80 backdrop-blur p-3.5 rounded-xl border border-amber-500/50 hover:border-amber-300 transition group shadow-inner flex flex-col justify-between ring-1 ring-amber-400/30 cursor-pointer hover:scale-[1.01] active:scale-[0.99] space-y-2"
          title="ক্লিক করে হিজরি ১ বছরের অবস্থান, চাঁদের দশা ও আমল দেখুন"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-amber-300 mb-1.5 flex-wrap gap-1">
              <span className="font-bold flex items-center gap-1">🌙 {t.hijriDateLabel}</span>
              <div className="flex items-center gap-1">
                <span className="bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/40 font-mono font-bold">
                  {dates.hijriNumeric}
                </span>
                <span className="bg-amber-400/25 text-amber-100 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-400/40 uppercase tracking-wide shadow-sm">
                  🗓️ {dates.hijriMonthPractice}
                </span>
              </div>
            </div>

            <div className="text-base sm:text-lg font-extrabold text-amber-100 group-hover:text-amber-300 transition py-0.5">
              {dates.hijriFormatted}
            </div>

            <div className="text-[11px] text-amber-200/90 font-medium pt-1 bg-black/30 px-2 py-1 rounded-lg border border-white/5 space-y-0.5">
              <div className="text-[10px] text-amber-400 font-bold uppercase">সম্ভাব্য সমতুল্য অন্যান্য সন:</div>
              <div className="flex items-center gap-2 flex-wrap text-[10px]">
                <span className="text-blue-300">📅 ইংরেজি: {dates.gregorianFormatted.split(',')[0]}</span>
                <span className="text-gray-500">•</span>
                <span className="text-emerald-300">🌾 বাংলা: {dates.bengaliFormatted.replace(' বঙ্গাব্দ', '')}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-amber-300/80 font-medium pt-1 flex items-center justify-between border-t border-white/5">
            <span>চন্দ্রবছর ও আমল সংযোগ</span>
            <span>➔</span>
          </div>
        </div>

        {/* Bengali Calendar */}
        <div
          onClick={() => setIsUnifiedModalOpen(true)}
          className="bg-emerald-950/80 backdrop-blur p-3.5 rounded-xl border border-emerald-600/50 hover:border-emerald-300 transition group shadow-inner flex flex-col justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] space-y-2"
          title="ক্লিক করে বাংলা পঞ্জিকার সংযোগ দেখুন"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-emerald-300 mb-1.5 flex-wrap gap-1">
              <span className="font-bold flex items-center gap-1">🌾 {t.bengaliDateLabel}</span>
              <div className="flex items-center gap-1">
                <span className="bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/40 font-mono font-bold">
                  {dates.bengaliNumeric}
                </span>
                <span className="bg-emerald-400/25 text-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-400/40 uppercase tracking-wide shadow-sm">
                  🗓️ {dates.bengaliMonthPractice}
                </span>
              </div>
            </div>

            <div className="text-base sm:text-lg font-extrabold text-emerald-100 group-hover:text-emerald-300 transition py-0.5">
              {dates.bengaliFormatted}
            </div>

            <div className="text-[11px] text-emerald-200/90 font-medium pt-1 bg-black/30 px-2 py-1 rounded-lg border border-white/5 space-y-0.5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">সম্ভাব্য সমতুল্য অন্যান্য সন:</div>
              <div className="flex items-center gap-2 flex-wrap text-[10px]">
                <span className="text-blue-300">📅 ইংরেজি: {dates.gregorianFormatted.split(',')[0]}</span>
                <span className="text-gray-500">•</span>
                <span className="text-amber-300">🌙 হিজরি: {dates.hijriFormatted.replace(' হিজরি', '')}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-emerald-300/80 font-medium pt-1 flex items-center justify-between border-t border-white/5">
            <span>পঞ্জিকা ও আমল সংযোগ</span>
            <span>➔</span>
          </div>
        </div>

      </div>

      {/* 2.1 Unified Day & Life Connected Bar */}
      <div className="bg-gradient-to-r from-amber-400/15 via-emerald-800/30 to-teal-800/25 p-3 sm:p-3.5 rounded-xl border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-inner">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              সংযোগ ও মার্জড পোর্টাল
            </span>
            <span className="text-xs font-bold text-amber-300">
              আজকের তারিখের সাথে কুরআন, সালাত, আমল ও প্রগ্রেসের সম্পূর্ণ সংযোগ
            </span>
          </div>
          <p className="text-[11px] text-emerald-200">
            পূর্ণ চাঁদের বয়স, হিজরি ১ বছরের চক্র, তাহাজ্জুদ ও ৫ ওয়াক্ত, নির্ধারিত সূরা ও আয়াত এবং লাইভ আমল কাউন্টার
          </p>
        </div>

        <button
          onClick={() => setIsUnifiedModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition shadow cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>১ ক্লিকে আজকের সংযোগ দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2.2 TRIPLE YEAR CYCLE PROGRESS CHART (চলতি হিজরি ৩৫৪ দিন, ইংরেজি ৩৬৫ দিন ও বাংলা ৩৬৫ দিন বর্ষচক্র) */}
      <TripleYearCycleProgressChart
        currentDate={new Date()}
        onOpenDayModal={() => setIsUnifiedModalOpen(true)}
      />

      {/* 3. FULL MONTHLY INTERACTIVE TRIPLE CALENDAR (Directly Below Panjika as Requested) */}
      <div className="pt-2">
        <FullMonthCalendar />
      </div>

      {/* 3.1 Quick Banner to 1-Year Countdown & Advance Preparation */}
      <div className="bg-gradient-to-r from-amber-500/20 via-emerald-950 to-amber-950/40 border border-amber-400/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-2.5">
          <span className="text-xl p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40">⏳</span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-200">
              আরবি হিজরি বর্ষের বিশেষ দিনগুলোর ১ বছরের লাইভ কাউন্টার ও নতুন বর্ষের আগাম প্রস্তুতি
            </h4>
            <p className="text-[11px] text-emerald-200">
              কত দিন বাকি আছে, প্রতিটি দিনের ১ বছরের কাউন্টডাউন এবং আত্মিক মুহাসাবাহ ও সংকল্প
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById('hijri-countdown-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow transition"
        >
          কাউন্টডাউন ও প্রস্তুতি দেখুন ↓
        </button>
      </div>

      {/* 4. UPCOMING ISLAMIC EVENTS & PROPHETIC/SAHABA MILESTONES */}
      <div className="pt-3 border-t border-emerald-800/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              <span>আসন্ন গুরুত্বপূর্ণ ইসলামিক দিনপঞ্জিকা, নবী ও সাহাবীদের ঐতিহাসিক দিন ও আমল</span>
            </h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              দিন, মাস ও বছরের গুরুত্ব, সাহাবায়ে কেরামের ত্যাগ ও সহীহ সুন্নাহ অনুযায়ী করণীয় আমল
            </p>
          </div>

          <button
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="text-xs text-emerald-200 hover:text-amber-300 font-semibold underline transition cursor-pointer flex items-center gap-1 shrink-0 ml-2"
          >
            <span>{showAllEvents ? 'সংক্ষিপ্ত করুন' : 'সকল ঐতিহাসিক দিন দেখুন'}</span>
            {showAllEvents ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl border transition space-y-2 flex flex-col justify-between ${
                event.isContemporary
                  ? 'bg-amber-400/10 border-amber-400/50 hover:bg-amber-400/15'
                  : 'bg-emerald-950/70 border-emerald-700/60 hover:border-amber-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <h4 className="font-bold text-amber-200 text-sm sm:text-base flex items-center gap-1.5">
                    <span>{event.icon}</span>
                    <span>{event.title}</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-amber-300 border border-emerald-700 font-mono">
                    {event.hijriDate}
                  </span>
                </div>

                <p className="text-xs text-emerald-200 font-semibold mt-2">
                  {event.importance}
                </p>

                <p className="text-xs text-emerald-100/90 leading-relaxed mt-1.5">
                  <strong className="text-amber-300">ঐতিহাসিক প্রেক্ষাপট:</strong> {event.historicalDetails}
                </p>

                {event.propheticSahabaContext && (
                  <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 text-xs text-emerald-200/90 mt-2">
                    <strong className="text-amber-300">নবী ﷺ ও সাহাবীদের ভূমিকা:</strong> {event.propheticSahabaContext}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-emerald-800/60 text-xs text-emerald-200/90 flex items-start gap-1.5 mt-2 bg-amber-400/5 p-2 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-amber-300">করণীয় সুন্নাত আমল:</strong> {event.recommendedDeeds}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Day Life Connection Modal (আজকের তারিখের সাথে সকল সেকশন কানেকশন ও আমল প্রগ্রেস) */}
      <UnifiedDayLifeConnectionModal
        isOpen={isUnifiedModalOpen}
        selectedDate={new Date()}
        onClose={() => setIsUnifiedModalOpen(false)}
        onNavigateTab={(tab) => {
          window.dispatchEvent(new CustomEvent('switch-main-tab', { detail: { tab } }));
        }}
      />

    </div>
  );
};
