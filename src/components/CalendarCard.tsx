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
  ShieldCheck
} from 'lucide-react';
import { CalendarDates, Language } from '../types';
import { translations } from '../locales/translations';
import { FullMonthCalendar } from './FullMonthCalendar';

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

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>আজকের বার: {dates.gregorianDayName}</span>
        </span>
      </div>

      {/* 2. Today's Triple Calendar Live Display (Minimalist Clean Design) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Gregorian Calendar */}
        <div className="bg-emerald-950/80 backdrop-blur p-3.5 rounded-xl border border-teal-500/40 hover:border-teal-400 transition group shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-teal-300 mb-1.5">
            <span className="font-bold flex items-center gap-1">📅 {t.gregorianDateLabel}</span>
            <span className="bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded text-[10px] border border-teal-500/40 font-mono font-bold">
              {dates.gregorianNumeric}
            </span>
          </div>

          <div className="text-base sm:text-lg font-extrabold text-teal-50 group-hover:text-amber-200 transition py-1">
            {dates.gregorianFormatted}
          </div>
        </div>

        {/* Hijri Calendar */}
        <div className="bg-emerald-950/80 backdrop-blur p-3.5 rounded-xl border border-amber-500/50 hover:border-amber-400 transition group shadow-inner flex flex-col justify-between ring-1 ring-amber-400/30">
          <div className="flex items-center justify-between text-xs font-medium text-amber-300 mb-1.5">
            <span className="font-bold flex items-center gap-1">🌙 {t.hijriDateLabel}</span>
            <span className="bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded text-[10px] border border-amber-500/40 font-mono font-bold">
              {dates.hijriNumeric}
            </span>
          </div>

          <div className="text-base sm:text-lg font-extrabold text-amber-100 group-hover:text-amber-300 transition py-1">
            {dates.hijriFormatted}
          </div>
        </div>

        {/* Bengali Calendar */}
        <div className="bg-emerald-950/80 backdrop-blur p-3.5 rounded-xl border border-emerald-600/50 hover:border-emerald-400 transition group shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-300 mb-1.5">
            <span className="font-bold flex items-center gap-1">🌾 {t.bengaliDateLabel}</span>
            <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded text-[10px] border border-emerald-500/40 font-mono font-bold">
              {dates.bengaliNumeric}
            </span>
          </div>

          <div className="text-base sm:text-lg font-extrabold text-emerald-100 group-hover:text-emerald-300 transition py-1">
            {dates.bengaliFormatted}
          </div>
        </div>

      </div>

      {/* 3. FULL MONTHLY INTERACTIVE TRIPLE CALENDAR (Directly Below Panjika as Requested) */}
      <div className="pt-2">
        <FullMonthCalendar />
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

    </div>
  );
};
