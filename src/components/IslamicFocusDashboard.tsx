import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, BookOpen, CheckSquare, Compass, ShieldCheck, Moon, Sun, AlertTriangle, Clock, Award, Flame, Heart, Share2, ArrowRight, Smartphone, Lock, CheckCircle2, Bell } from 'lucide-react';
import { IslamicFocusEngine, HijriMonthData, DailyFocusData } from '../services/islamicFocusEngine';
import { launchDhikrInTasbih } from '../utils/haptics';
import { deviceAmalNotifier } from '../services/deviceAmalNotificationEngine';
import { getDayOverview, getTodayDateString } from '../services/amalTrackerService';

interface Props {
  lang: 'bn' | 'en' | 'ar';
}

export const IslamicFocusDashboard: React.FC<Props> = ({ lang }) => {
  const [focusEngine] = useState(() => new IslamicFocusEngine());
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'weekly' | 'monthly' | 'ramadan' | 'history'>('daily');
  const [devicePermission, setDevicePermission] = useState<NotificationPermission>('default');
  const [testCountdown, setTestCountdown] = useState<number | null>(null);

  useEffect(() => {
    deviceAmalNotifier.checkPermission().then(setDevicePermission);
  }, []);

  const todayAmalOverview = getDayOverview(getTodayDateString());

  const handleRequestPermission = async () => {
    const granted = await deviceAmalNotifier.requestPermission();
    if (granted) {
      setDevicePermission('granted');
    }
  };

  const handleTestLockScreen = () => {
    deviceAmalNotifier.scheduleLockscreenTestCountdown((sec) => {
      setTestCountdown(sec);
      if (sec <= 0) {
        setTimeout(() => setTestCountdown(null), 2000);
      }
    });
  };
  
  const todayFocus = focusEngine.getTodayFocus();
  const allMonths = focusEngine.getAllHijriMonths();
  const [selectedMonthId, setSelectedMonthId] = useState<string>('ramadan');
  const selectedMonth = focusEngine.getHijriMonthData(selectedMonthId);

  // Ramadan Mode Toggle & Daily Checklist State
  const [ramadanMode, setRamadanMode] = useState<boolean>(true);
  const [checklist, setChecklist] = useState({
    prayers: false,
    fasting: true,
    quran: false,
    dhikr: true,
    dua: false,
    sadaqah: false,
    taraweeh: false
  });

  const historyItems = focusEngine.getHistoryItems();

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Sub-Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-900/60 p-2 rounded-2xl border border-emerald-700/60 text-white">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('daily')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'daily'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>দৈনিক ফোকাস</span>
          </button>

          <button
            onClick={() => setActiveSubTab('weekly')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'weekly'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>সাপ্তাহিক ফোকাস</span>
          </button>

          <button
            onClick={() => setActiveSubTab('monthly')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'monthly'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>১২ হিজরি মাসের ফোকাস</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ramadan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'ramadan'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-amber-300" />
            <span>রমজান মোড</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-amber-400 text-emerald-950 shadow-md'
                : 'text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>যাচাইকৃত ইতিহাস</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-semibold text-amber-300">সহীহ তথ্য নিশ্চিত</span>
        </div>
      </div>

      {/* SUB-TAB 1: DAILY FOCUS */}
      {activeSubTab === 'daily' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Hero Card for Daily Focus */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 border border-emerald-700/80 rounded-3xl p-6 text-white shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800 pb-3">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>আজকের ইসলামিক থিম: {todayFocus.theme}</span>
              </span>
              <span className="text-xs text-emerald-300/80 font-mono">
                {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {/* Device Lock-Screen Notification Banner */}
            <div className="bg-emerald-950/90 border-2 border-amber-400/70 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400 text-emerald-950 font-black">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>লক স্ক্রিন ডিভাইস নোটিফিকেশন</span>
                    </span>
                    {devicePermission === 'granted' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        <span>সক্রিয়</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                        অনুমতি প্রয়োজন
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    আজকের আমল প্রগ্রেস ({todayAmalOverview.percent}%) ও নামাজের ওয়াক্ত ফোন লক থাকলেও নোটিফিকেশনে ভাসবে।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {devicePermission !== 'granted' ? (
                  <button
                    onClick={handleRequestPermission}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-emerald-950 text-xs font-black hover:bg-amber-300 transition flex items-center gap-1.5 shadow cursor-pointer animate-pulse"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>লক অ্যালার্ট অন করুন</span>
                  </button>
                ) : (
                  <button
                    onClick={handleTestLockScreen}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/60 hover:bg-amber-400/30 text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                    title="৫ সেকেন্ডের মধ্যে ফোন লক করে টেস্ট দেখুন"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>
                      {testCountdown !== null ? `লক করুন: ${testCountdown} সে.` : '📱 ৫ সে. লক টেস্ট'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Quran Verse */}
            <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <span>📖 আল-কুরআন থেকে দিকনির্দেশনা</span>
              </div>
              <p className="text-lg sm:text-xl font-serif text-amber-200 text-right leading-loose dir-rtl pt-1">
                {todayFocus.quranVerse.arabic}
              </p>
              <p className="text-sm text-emerald-100 font-medium pt-2">
                "{todayFocus.quranVerse.bengali}"
              </p>
              <span className="inline-block text-[11px] font-bold text-amber-300 bg-emerald-900 px-2.5 py-0.5 rounded border border-emerald-700">
                {todayFocus.quranVerse.reference}
              </span>
            </div>

            {/* Sahih Hadith */}
            <div className="bg-emerald-950/80 border border-emerald-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  📜 সহীহ হাদিস
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">
                  {todayFocus.sahihHadith.authenticity}
                </span>
              </div>
              <p className="text-sm text-emerald-100 leading-relaxed">
                "{todayFocus.sahihHadith.bengali}"
              </p>
              <div className="text-[11px] text-amber-300 font-semibold pt-1">
                সূত্র: {todayFocus.sahihHadith.source} ({todayFocus.sahihHadith.reference})
              </div>
            </div>

            {/* Dua & Dhikr Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                    🤲 আজকের দুআ
                  </span>
                  <p className="text-sm font-serif text-amber-200 text-right leading-relaxed dir-rtl">
                    {todayFocus.dua.arabic}
                  </p>
                  <p className="text-xs text-emerald-100 italic">
                    "{todayFocus.dua.bengali}"
                  </p>
                </div>
                <button
                  onClick={() => {
                    launchDhikrInTasbih({
                      id: 'daily-focus-dua',
                      titleBn: 'আজকের বিশেষ দুআ',
                      arabicText: todayFocus.dua.arabic,
                      transliterationBn: todayFocus.dua.bengali,
                      translationBn: todayFocus.dua.bengali,
                      targetCount: 10,
                      recommendedTimeBn: 'সারাদিনে যেকোনো সময়'
                    });
                  }}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-amber-400 text-emerald-950 text-xs font-bold hover:bg-amber-300 transition flex items-center justify-center gap-1.5 shadow cursor-pointer self-start"
                >
                  <span>📿 ১-ক্লিকে তসবিহে পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                    📿 আজকের বিশেষ জিকির
                  </span>
                  <h4 className="font-bold text-amber-200 text-sm">{todayFocus.dhikr.title}</h4>
                  <p className="text-xs text-emerald-200">{todayFocus.dhikr.virtue}</p>
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-800/60">
                  <span className="inline-block px-3 py-1 bg-emerald-900 text-amber-300 rounded-full font-bold text-xs border border-emerald-700">
                    লক্ষ্য: {todayFocus.dhikr.count} বার
                  </span>
                  <button
                    onClick={() => {
                      launchDhikrInTasbih({
                        id: 'daily-focus-dhikr',
                        titleBn: todayFocus.dhikr.title,
                        arabicText: todayFocus.dhikr.title,
                        transliterationBn: todayFocus.dhikr.title,
                        translationBn: todayFocus.dhikr.virtue,
                        targetCount: todayFocus.dhikr.count || 33,
                        recommendedTimeBn: 'আজকের সারাদিনের আমল'
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 text-emerald-950 text-xs font-bold hover:bg-amber-300 transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>📿 জিকির শুরু করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Amal Checklist */}
            <div className="bg-emerald-950/60 border border-emerald-800 p-5 rounded-2xl space-y-3">
              <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>আজকের করণীয় সুন্নাত আমল (Suggested Amal)</span>
              </h4>
              <ul className="space-y-2 text-xs text-emerald-100">
                {todayFocus.suggestedAmal.map((amal, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{amal}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: WEEKLY FOCUS */}
      {activeSubTab === 'weekly' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-3xl p-6 text-white space-y-4">
            <h3 className="text-lg font-bold text-amber-300">
              সাপ্তাহিক ইসলামিক থিম: জুমুআ ও সামাজিক মেলবন্ধন
            </h3>
            <p className="text-xs text-emerald-200 leading-relaxed">
              সপ্তাহের প্রতিটি দিনকে আত্মশুদ্ধি ও সহীহ জ্ঞানের আলোয় উদ্ভাসিত করার জন্য বিশেষ ইসলামিক ভাবনা।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded bg-amber-400 text-emerald-950 font-bold text-[10px]">
                  শুক্রবার (জুমুআ)
                </span>
                <h4 className="font-bold text-emerald-100 text-sm">সূরা কাহফ ও দরুদ শরীফ</h4>
                <p className="text-xs text-emerald-300/80">
                  জুমুআর দিনে বেশি বেশি দরুদ পাঠ ও সূরা কাহফ তিলাওয়াত দুই জুমুআর মধ্যবর্তী সময়কে আলোকিত রাখে।
                </p>
              </div>

              <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-amber-300 font-bold text-[10px]">
                  সোম ও বৃহস্পতিবার
                </span>
                <h4 className="font-bold text-emerald-100 text-sm">সুন্নাত রোজা পালন</h4>
                <p className="text-xs text-emerald-300/80">
                  এ দুই দিনে আল্লাহর দরবারে বান্দার আমল পেশ করা হয়, তাই রোজাদার অবস্থায় আমল পেশ করা উত্তম।
                </p>
              </div>

              <div className="bg-emerald-950 p-4 rounded-2xl border border-emerald-800 space-y-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-emerald-200 font-bold text-[10px]">
                  সাপ্তাহিক সদাচরণ
                </span>
                <h4 className="font-bold text-emerald-100 text-sm">আত্মীয়তার সম্পর্ক রক্ষা</h4>
                <p className="text-xs text-emerald-300/80">
                  পিতামাতা ও আত্মীয়স্বজনের খোঁজখবর নেওয়া এবং সদকা করার মাধ্যমে রিজিক ও হায়াতে বরকত লাভ হয়।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MONTHLY FOCUS (HIJRI MONTHS GUIDE) */}
      {activeSubTab === 'monthly' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Month Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {allMonths.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMonthId(m.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                  selectedMonthId === m.id
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg'
                    : 'bg-emerald-900/60 text-emerald-200 border-emerald-800 hover:bg-emerald-800'
                }`}
              >
                <span>{m.nameBengali}</span>
              </button>
            ))}
          </div>

          {/* Detailed Hijri Month Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 border border-emerald-700/80 rounded-3xl p-6 text-white space-y-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400">{selectedMonth.nameArabic}</span>
                <h2 className="text-2xl font-black text-emerald-50">{selectedMonth.nameBengali}</h2>
                <p className="text-xs text-emerald-300/80">অর্থ: {selectedMonth.meaning}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-800 border border-emerald-600 text-amber-300 text-xs font-bold">
                হিজরি ক্যালেন্ডার গাইড
              </span>
            </div>

            <p className="text-sm text-emerald-100 leading-relaxed">
              {selectedMonth.importance}
            </p>

            {/* Authentic Virtues */}
            <div className="space-y-2 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800">
              <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>যাচাইকৃত সহীহ ফযীলতসমূহ</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-200">
                {selectedMonth.authenticVirtues.map((v, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Misconceptions Warning */}
            <div className="space-y-2 bg-rose-950/40 p-4 rounded-2xl border border-rose-900/80">
              <h4 className="font-bold text-rose-300 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>প্রচলিত ভুল ধারণা ও কুসংস্কার (কখনোই শরীয়তসম্মত নয়)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200/90">
                {selectedMonth.commonMisconceptions.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monthly Action Plan */}
            <div className="space-y-2 bg-emerald-950/80 p-4 rounded-2xl border border-emerald-800">
              <h4 className="font-bold text-amber-300 text-sm">
                মাসিক সুনির্দিষ্ট আমল পরিকল্পনা
              </h4>
              <ul className="space-y-1 text-xs text-emerald-200">
                {selectedMonth.monthlyActionPlan.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 4: RAMADAN MODE */}
      {activeSubTab === 'ramadan' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border border-amber-400/50 rounded-3xl p-6 text-white space-y-6 shadow-2xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-800 pb-4">
              <div className="flex items-center gap-3">
                <Moon className="w-8 h-8 text-amber-400 animate-pulse" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-300">🌙 রমজান মোড (Ramadan Dashboard)</h2>
                  <p className="text-xs text-emerald-200">সিয়াম সাধনা, তারাবীহ ও আত্মশুদ্ধির সেরা সঙ্গী</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-emerald-900 px-3 py-1.5 rounded-2xl border border-emerald-700">
                <span className="text-xs font-bold text-emerald-200">রমজান মোড সক্রিয়:</span>
                <button
                  onClick={() => setRamadanMode(!ramadanMode)}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition ${
                    ramadanMode ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-950 text-emerald-400'
                  }`}
                >
                  {ramadanMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Suhoor & Iftar Countdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-700 space-y-1">
                <span className="text-xs text-amber-300 font-bold block">সেহরির শেষ সময় বাকি</span>
                <div className="text-2xl font-black font-mono text-white">০২ ঘন্টা ১৪ মিনিট</div>
                <p className="text-[10px] text-emerald-300/80">আজকের সেহরির শেষ সময়: ভোর ০৪:১২ মি.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-900/80 border border-emerald-700 space-y-1">
                <span className="text-xs text-amber-300 font-bold block">ইফতারের সময় বাকি</span>
                <div className="text-2xl font-black font-mono text-white">০৬ ঘন্টা ৩৫ মিনিট</div>
                <p className="text-[10px] text-emerald-300/80">আজকের ইফতারের সময়: সন্ধ্যা ০৬:৪৮ মি.</p>
              </div>
            </div>

            {/* Personal Ramadan Checklist Tracker */}
            <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-800 space-y-3">
              <h4 className="font-bold text-amber-300 text-sm flex items-center justify-between">
                <span>📋 প্রাত্যহিক রমজান ট্র্যাকার (Personal Habit Tracker)</span>
                <span className="text-xs font-normal text-emerald-300/80">কোনো পয়েন্ট বা র্যাঙ্ক ছাড়াই ব্যক্তিগত রুটিন</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {[
                  { key: 'prayers', label: '৫ ওয়াক্ত নামাজ' },
                  { key: 'fasting', label: 'ফরজ রোজা' },
                  { key: 'quran', label: 'কুরআন তিলাওয়াত' },
                  { key: 'dhikr', label: 'সকাল-সন্ধ্যার জিকির' },
                  { key: 'dua', label: 'ইফতারের দুআ' },
                  { key: 'sadaqah', label: 'দান-সদকা' },
                  { key: 'taraweeh', label: 'তারাবীহ সালাত' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key as any)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition ${
                      checklist[item.key as keyof typeof checklist]
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-emerald-900/40 border-emerald-800 text-emerald-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={checklist[item.key as keyof typeof checklist]}
                      readOnly
                      className="accent-amber-400 rounded cursor-pointer"
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 5: VERIFIED ISLAMIC HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-3xl p-6 text-white space-y-4">
            <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>যাচাইকৃত ইসলামিক ইতিহাস ও ইবুক সংকলন</span>
            </h3>

            <div className="space-y-3">
              {historyItems.map(hist => (
                <div key={hist.id} className="p-5 rounded-2xl bg-emerald-950 border border-emerald-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-800 text-amber-300 text-xs font-bold">
                      {hist.category} • {hist.hijriYear}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] font-bold">
                      {hist.authenticityLevel}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-emerald-50">{hist.title}</h4>
                  <p className="text-xs text-emerald-200 leading-relaxed">{hist.detailedStory}</p>
                  <div className="text-[11px] text-amber-300 font-semibold pt-1">
                    সূত্র: {hist.sources.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
