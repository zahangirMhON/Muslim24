import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Calendar, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Volume2, 
  Save, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Clock,
  Check,
  FileText,
  Filter,
  Info,
  HelpCircle
} from 'lucide-react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  loginWithGoogle, 
  loginAnonymously, 
  logoutUser, 
  saveUserActivityProgress, 
  getUserActivityProgress, 
  saveUserPreferences,
  getUserPreferences,
  saveUserCustomSchedule, 
  getUserCustomSchedule,
  UserActivityData 
} from '../lib/firebase';
import { RADIO_SERIES_CATEGORIES } from '../data/radioSeriesData';
import { AmalProgressAnalytics } from './AmalProgressAnalytics';
import { BarChart3 } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomSchedule?: (customCategories: string[]) => void;
  activeCustomCategories?: string[];
}

export interface ActivityTaskSchema {
  id: string;
  categoryBn: string;
  categoryGroupBn: string;
  titleBn: string;
  shortDescBn: string;
  detailedDescriptionBn: string;
  recommendedTimeBn: string;
  actionStepsBn: string[];
  sources: {
    textBn: string;
    referenceBn: string;
    bookNameBn: string;
  }[];
}

export const DETAILED_TRACK_ACTIVITY_SCHEMA: ActivityTaskSchema[] = [
  {
    id: 't-salah-01',
    categoryBn: 'সালাত ও ফারাইজ',
    categoryGroupBn: '১. সালাত ও দৈনন্দিন ফরয ইবাদত',
    titleBn: 'পাঁচ ওয়াক্ত ফরয সালাত প্রথম ওয়াক্তে আদায়',
    shortDescBn: 'দৈনিক ৫ ওয়াক্ত সালাত সঠিক সময়ে একাগ্রতার সাথে আদায় করা।',
    detailedDescriptionBn: 'ইসলামের দ্বিতীয় রুকন হলো সালাত। বান্দা ও রবের মধ্যকার সর্বাধিক ঘনিষ্টতার মুহূর্ত হলো সাজদাহ। কিয়ামতের মাঠে বান্দার আমলসমূহের মধ্যে সর্বপ্রথম সালাতের হিসাব নেওয়া হবে। সালাত সঠিক হলে অন্যান্য আমল সহজ হয়ে যায়।',
    recommendedTimeBn: 'ফজর, যোহর, আসর, মাগরিব ও এশার আযানের পরপরই।',
    actionStepsBn: [
      'আজানের পরপরই সুন্নাহ সম্মত পদ্ধতিতে মিসওয়াকসহ উত্তমরূপে ওযু করা।',
      'পুরুষগণ মসজিদে জামাআতের সাথে এবং নারীগণ ঘরে একাগ্রতার সাথে সালাত আদায় করা।',
      'সালাত শেষে মাসনুন তসবিহ (৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ, ৩৪ বার আল্লাহু আকবার) পাঠ করা।'
    ],
    sources: [
      {
        textBn: 'রাসূলুল্লাহ (সা.)-কে জিজ্ঞাসা করা হলো, আল্লাহর নিকট সর্বাধিক প্রিয় আমল কোনটি? তিনি বললেন: "সময়মতো সালাত আদায় করা।"- (সহীহ বুখারী)',
        referenceBn: 'সহীহ বুখারী: ৫২৭',
        bookNameBn: 'সহীহ আল-বুখারী (কিতাবুম মাওয়াকিতিস সালাত)'
      },
      {
        textBn: 'নিশ্চয় সালাত মুমিনদের উপর নির্দিষ্ট সময়ে ফরয করা হয়েছে।',
        referenceBn: 'সূরা আন-নিসা: ৪:১০৩',
        bookNameBn: 'আল-কুরআনুল কারীম'
      }
    ]
  },
  {
    id: 't-quran-02',
    categoryBn: 'কুরআন তিলাওয়াত',
    categoryGroupBn: '২. কুরআন কারীম তিলাওয়াত ও অডিও তাফসীর',
    titleBn: 'দৈনিক অন্তত ১ রুকু বা ১ পৃষ্ঠা অর্থসহ তিলাওয়াত ও তিলওয়াত শ্রবণ',
    shortDescBn: 'কুরআন অনুধাবন, তিলাওয়াত ও ২৪/৭ রেডিও অডিও স্ট্রিম থেকে ভাবার্থ শ্রবণ।',
    detailedDescriptionBn: 'কুরআনুল কারীম মানুষের অন্তরের ব্যাধির আরোগ্য এবং হেদায়াতের আলোকবর্তিকা। প্রতিদিন নির্দিষ্ট সময়ে তরজমা ও তাফসীরসহ কুরআন পাঠ করলে ঈমানী চেতনা জাগ্রত থাকে ও জীবনের সকল ক্ষেত্রে সঠিক সিদ্ধান্ত নেওয়া সহজ হয়।',
    recommendedTimeBn: 'ফজরের সালাতের পর অথবা রাতে ঘুমানোর পূর্বে।',
    actionStepsBn: [
      'কমপক্ষে ১ পৃষ্ঠা আরবি স্পষ্ট তিলাওয়াত করা।',
      'পঠিত আয়াতের বাংলা অর্থ ও সংক্ষিপ্ত তাফসীর পড়া বা অডিওতে মন দিয়ে শোনা।',
      '২৪/৭ ইসলামী রেডিওর রুকাইয়া বা সুরার তাফসীর পর্ব চালু রাখা।'
    ],
    sources: [
      {
        textBn: 'তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে নিজে কুরআন শেখে এবং অপরকে শিক্ষা দেয়।',
        referenceBn: 'সহীহ বুখারী: ৫০২৭',
        bookNameBn: 'সহীহ আল-বুখারী'
      },
      {
        textBn: 'কুরআন যখন পাঠ করা হয়, তখন তা মনোযোগ দিয়ে শোন এবং চুপ থাক, যাতে তোমাদের ওপর রহমত বর্ষিত হয়।',
        referenceBn: 'সূরা আল-আ\'রাফ: ৭:২০৪',
        bookNameBn: 'আল-কুরআনুল কারীম'
      }
    ]
  },
  {
    id: 't-azkar-03',
    categoryBn: 'মাসনুন আজকার',
    categoryGroupBn: '৩. সকাল-সন্ধ্যার জিকির ও দোয়া',
    titleBn: 'বিশুদ্ধ সকাল-সন্ধ্যার মাসনুন জিকির ও আয়াতুল কুরসী পাঠ',
    shortDescBn: 'হিসনুল মুসলিম বর্ণিত দোয়া পাঠের মাধ্যমে দিনভর আল্লাহর সার্বিক নিরাপত্তায় থাকা।',
    detailedDescriptionBn: 'সকাল ও সন্ধ্যার জিকির বান্দার জন্য অদৃশ্য দুর্গের মতো কাজ করে। এটি বদনজর, জীন-শয়তানের কুমন্ত্রণা, হিংসা, দুর্ঘটনা ও মানসিক হতাশা থেকে হেফাজত করে।',
    recommendedTimeBn: 'সকালে ফজরের পর থেকে সূর্যোদয় পর্যন্ত এবং বিকেলে আসরের পর থেকে মাগরিব পর্যন্ত।',
    actionStepsBn: [
      'সকালে ৩ বার ও সন্ধ্যায় ৩ বার "বিসমিল্লাহিল্লাজী লা ইয়াদুররু..." পড়া।',
      'আয়াতুল কুরসী ও ৩ কুল (সূরা ইখলাস, ফালাক, নাস) ৩ বার করে পাঠ করে শরীরে ফুঁ দেওয়া।',
      'দৈনিক ১০০ বার "সুবহানাল্লাহি ওয়া বিহামদিহী" পাঠ করা।'
    ],
    sources: [
      {
        textBn: 'যে ব্যক্তি সকালে ৩ বার এবং সন্ধ্যায় ৩ বার এ দোয়া পাঠ করবে, কোনো কিছুই তার ক্ষতি করতে পারবে না।',
        referenceBn: 'সূনান আত-তিরমিযী: ৩৩৮৮',
        bookNameBn: 'তিরমিযী ও আবু দাউদ'
      },
      {
        textBn: 'হে ঈমানদারগণ! তোমরা আল্লাহকে অধিক পরিমাণে স্মরণ করো।',
        referenceBn: 'সূরা আল-আহযাব: ৩৩:৪১',
        bookNameBn: 'আল-কুরআনুল কারীম'
      }
    ]
  },
  {
    id: 't-istighfar-04',
    categoryBn: 'তওবা ও ইস্তিগফার',
    categoryGroupBn: '৪. আত্মশুদ্ধি ও ইস্তিগফার',
    titleBn: '১০০ বার সৈয়্যদুল ইস্তিগফার ও খাঁটি তওবা',
    shortDescBn: 'পাপ মোচন, রিজিক বৃদ্ধি ও মানসিক প্রশান্তির জন্য আস্তাগফিরুল্লাহ পাঠ।',
    detailedDescriptionBn: 'ইস্তিগফার বান্দার রিজিকে অনাবিল বরকত আনে, দুশ্চিন্তা দূর করে এবং আল্লাহর নৈকট্য দান করে। সৈয়্যদুল ইস্তিগফার হলো ক্ষমা প্রার্থনার সর্বশ্রেষ্ঠ দোয়া।',
    recommendedTimeBn: 'প্রতিটি সালাতের পর ও রাতের শেষ প্রহরে।',
    actionStepsBn: [
      'অতীতের ভুলের জন্য অনুশোচনা করে আল্লাহর কাছে খাঁটি তওবা করা।',
      'সৈয়্যদুল ইস্তিগফার (আল্লাহুম্মা আনতা রব্বী...) অর্থ অনুধাবন করে পাঠ করা।',
      'চলতে-ফিরতে "আস্তাগফিরুল্লাহ" জিকির জারি রাখা।'
    ],
    sources: [
      {
        textBn: 'যে ব্যক্তি দিনে বা রাতে দৃঢ় বিশ্বাসের সাথে সৈয়্যদুল ইস্তিগফার পড়বে এবং ঐ দিনে মারা যাবে, সে জান্নাতী হবে।',
        referenceBn: 'সহীহ বুখারী: ৬৩০৬',
        bookNameBn: 'সহীহ আল-বুখারী'
      },
      {
        textBn: 'তোমরা তোমাদের রবের ক্ষমা প্রার্থনা কর; নিশ্চয় তিনি অতি ক্ষমাশীল। তিনি তোমাদের ধন-সম্পদ ও সন্তান-সন্ততি দ্বারা সমৃদ্ধ করবেন।',
        referenceBn: 'সূরা নূহ: ৭১:১০-১২',
        bookNameBn: 'আল-কুরআনুল কারীম'
      }
    ]
  },
  {
    id: 't-ruqyah-05',
    categoryBn: 'রুকাইয়া ও সুরক্ষা',
    categoryGroupBn: '৫. রুকিয়াহ শরইয়্যাহ ও আত্মরক্ষা',
    titleBn: 'সূরা বাকারা ও রুকিয়াহ অডিও শ্রবণ বা পাঠ',
    shortDescBn: 'ঘর ও মনকে শয়তান ও কু-প্রভাব থেকে মুক্ত রাখতে রুকায়িয়ার আমল।',
    detailedDescriptionBn: 'সূরা বাকারা যে ঘরে পাঠ করা হয় বা নিয়মিত শোনা হয়, সেখান থেকে শয়তান পালিয়ে যায়। বদনজর, জাদু ও কু-প্রভাব কাটাতে কুরআনী রুকিয়াহ একটি সুন্নাহ সম্মত চিকিৎসা পদ্ধতি।',
    recommendedTimeBn: 'দিনে অন্তত একবার ঘরে ২৪/৭ রেডিওর রুকাইয়া প্লেলিস্ট চালু রাখুন।',
    actionStepsBn: [
      'রেডিওর রুকাইয়া সিরিজ প্লেলিস্ট থেকে সূরা বাকারা ও শিফা আয়াত শ্রবণ করা।',
      'পানিতে ৩ কুল পড়ে ফুঁ দিয়ে পান করা এবং ঘরে ছিটানো।',
      'প্রাত্যহিক জীবনে সকল প্রকার শিরক ও বিদআত মুক্ত থাকা।'
    ],
    sources: [
      {
        textBn: 'তোমাদের ঘরগুলোকে গোরস্তানে পরিণত করো না। যে ঘরে সূরা আল-বাকারা পাঠ করা হয়, সেখান থেকে শয়তান পালিয়ে যায়।',
        referenceBn: 'সহীহ মুসলিম: ৭৮০',
        bookNameBn: 'সহীহ মুসলিম'
      }
    ]
  },
  {
    id: 't-family-06',
    categoryBn: 'পারিবারিক দায়িত্ব',
    categoryGroupBn: '৬. পরিবার ও সামাজিক অধিকার',
    titleBn: 'পিতা-মাতা, স্ত্রী-সন্তান ও আত্মীয়ের সাথে সদব্যবহার ও দোয়া',
    shortDescBn: 'পিতা-মাতার খেদমত, সন্তানের সুশিক্ষা ও আত্মীয়তার সম্পর্ক রক্ষা করা।',
    detailedDescriptionBn: 'ইসলামে পিতা-মাতার সন্তুষ্টিতে রবের সন্তুষ্টি। পরিবারের সদস্যদের সাথে উত্তম আচরণ ও তাদের দ্বীনি দিকনির্দেশনা দেওয়া প্রত্যেক ঈমানদারের আমানত।',
    recommendedTimeBn: 'প্রতিদিন পারিবারিক মিলনে ও সালাত পরবর্তী দোয়ায়।',
    actionStepsBn: [
      'পিতা-মাতার জন্য "রব্বির হামহুমা কামা রব্বায়ানী সাগীরা" দোয়া পাঠ করা।',
      'পরিবারের সাথে হাসিমুখে কথা বলা ও হিংসা-বিদ্বেষ পরিহার করা।',
      'সন্তানদের সালাত ও নৈতিক চরিত্র গঠনে উৎসাহিত করা।'
    ],
    sources: [
      {
        textBn: 'পিতার সন্তুষ্টিতে রবের সন্তুষ্টি এবং পিতার অসন্তুষ্টিতে রবের অসন্তুষ্টি।',
        referenceBn: 'জামে আত-তিরমিযী: ১৮৯৯',
        bookNameBn: 'তিরমিযী'
      },
      {
        textBn: 'তোমাদের মধ্যে সেই ব্যক্তিই উত্তম, যে তার পরিবারের নিকট উত্তম।',
        referenceBn: 'সূনান ইবনে মাজাহ: ১৯৭৭',
        bookNameBn: 'ইবনে মাজাহ'
      }
    ]
  }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomSchedule,
  activeCustomCategories = []
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab inside User Modal: 'progress' | 'activities' | 'customization'
  const [activeTab, setActiveTab] = useState<'progress' | 'activities' | 'customization'>('progress');

  useEffect(() => {
    const handleOpenTab = (e: any) => {
      if (e?.detail?.tab) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener('open-user-profile-tab' as any, handleOpenTab);
    return () => window.removeEventListener('open-user-profile-tab' as any, handleOpenTab);
  }, []);

  // Today's Date String (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Activity Checklist State
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [listeningMinutes, setListeningMinutes] = useState<number>(20);
  const [userNotes, setUserNotes] = useState<string>('');
  const [streakDays, setStreakDays] = useState<number>(1);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string>('');

  // Expandable Accordion state for Track Activity items (all hidden by default)
  const [expandedTaskIds, setExpandedTaskIds] = useState<string[]>([]);

  // Search / Category Filter inside Activity Tracker
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');

  // Custom Radio & App Preferences
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(activeCustomCategories);
  const [isCustomModeEnabled, setIsCustomModeEnabled] = useState<boolean>(activeCustomCategories.length > 0);

  // Auth State Listener & Cloud Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        // Load today's activity progress from Firestore
        const activity = await getUserActivityProgress(user.uid, todayStr);
        if (activity) {
          setCompletedTaskIds(activity.completedTaskIds || []);
          setListeningMinutes(activity.dailyListeningMinutes || 20);
          setUserNotes(activity.notes || '');
          setStreakDays(activity.streakDays || 1);
        }

        // Load custom schedule/preferences from Firestore
        const userPrefCats = await getUserPreferences(user.uid);
        if (userPrefCats && userPrefCats.length > 0) {
          setSelectedCategoryIds(userPrefCats);
          setIsCustomModeEnabled(true);
        } else {
          const customSched = await getUserCustomSchedule(user.uid);
          if (customSched && customSched.customItems && customSched.customItems.length > 0) {
            setSelectedCategoryIds(customSched.customItems);
            setIsCustomModeEnabled(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [todayStr]);

  if (!isOpen) return null;

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // Toggle Accordion Expansion (Arrow Click)
  const handleToggleExpandTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents checkbox toggle on arrow click
    setExpandedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSaveStatusMsg('গুগল অ্যাকাউন্ট দিয়ে সফলভাবে সিঙ্ক ও লগইন করা হয়েছে!');
    } catch (err: any) {
      console.error('Google login failed:', err);
      setAuthError('গুগল লগইন করতে সমস্যা হয়েছে। গেস্ট হিসেবে চালিয়ে যান।');
    } finally {
      setLoading(false);
    }
  };

  // Guest Login Handler
  const handleGuestLogin = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      await loginAnonymously('অতিথি মুমিন');
      setSaveStatusMsg('অতিথি অ্যাকাউন্ট হিসেবে যুক্ত হয়েছেন।');
    } catch (err) {
      setAuthError('গেস্ট লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setCompletedTaskIds([]);
    setSaveStatusMsg('লগআউট সম্পন্ন হয়েছে।');
  };

  // Save Activity Progress to Firestore
  const handleSaveProgress = async () => {
    if (!currentUser) {
      setSaveStatusMsg('ক্লাউডে সংরক্ষণ করতে প্রথমে লগইন বা গেস্ট সাইন-ইন করুন।');
      return;
    }

    setLoading(true);
    const calculatedStreak = completedTaskIds.length >= 3 ? Math.max(streakDays, 2) : streakDays;

    const progressData: UserActivityData = {
      userId: currentUser.uid,
      date: todayStr,
      completedTaskIds,
      dailyListeningMinutes: listeningMinutes,
      notes: userNotes,
      streakDays: calculatedStreak
    };

    await saveUserActivityProgress(progressData);
    setSaveStatusMsg('আজকের আমল ও এক্টিভিটি সিঙ্ক ফায়ারবেস ক্লাউডে সফলভাবে সংরক্ষিত হয়েছে! 🟢');
    setLoading(false);

    setTimeout(() => setSaveStatusMsg(''), 4500);
  };

  // Save Custom Preferences (24/7 Radio Playlist Categories)
  const handleSaveCustomization = async () => {
    const finalCats = isCustomModeEnabled ? selectedCategoryIds : [];
    
    if (onApplyCustomSchedule) {
      onApplyCustomSchedule(finalCats);
    }

    if (currentUser) {
      await saveUserPreferences(currentUser.uid, finalCats);
      await saveUserCustomSchedule(
        currentUser.uid,
        isCustomModeEnabled ? 'কাস্টম ইউজার রেডিও প্লেলিস্ট' : 'এডমিন ডিফল্ট',
        finalCats
      );
    }

    setSaveStatusMsg('আপনার কাস্টোমাইজড রেডিও প্লেলিস্ট ও ক্যাটাগরি ফায়ারবেসে সেভ হয়েছে!');
    setTimeout(() => setSaveStatusMsg(''), 4500);
  };

  const completionPercentage = Math.round((completedTaskIds.length / DETAILED_TRACK_ACTIVITY_SCHEMA.length) * 100);

  // Group items by category for filtered viewing
  const uniqueGroupNames = Array.from(new Set(DETAILED_TRACK_ACTIVITY_SCHEMA.map(t => t.categoryGroupBn)));

  const filteredTasks = selectedGroupFilter === 'ALL'
    ? DETAILED_TRACK_ACTIVITY_SCHEMA
    : DETAILED_TRACK_ACTIVITY_SCHEMA.filter(t => t.categoryGroupBn === selectedGroupFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[94vh] overflow-y-auto bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 border border-amber-400/50 rounded-2xl shadow-2xl text-emerald-50 p-4 sm:p-6 space-y-5">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-amber-200">
                ইউজার প্রোফাইল ও একটিভিটি ট্র্যাকার
              </h3>
              <p className="text-xs text-emerald-200/90">
                গুগল ফায়ারবেস ক্লাউড ডেটাবেস সিঙ্ক • আমল ট্র্যাকার ও বিস্তারিত সূত্র
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message Notification Bar */}
        {saveStatusMsg && (
          <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{saveStatusMsg}</span>
            </div>
            <button onClick={() => setSaveStatusMsg('')} className="text-amber-400 font-bold px-2 py-0.5">✕</button>
          </div>
        )}

        {/* Firebase Authentication Card */}
        <div className="p-4 rounded-xl bg-emerald-900/80 border border-emerald-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          {currentUser ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="User Profile" 
                  className="w-12 h-12 rounded-full border-2 border-amber-400 shadow object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-bold text-lg">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-amber-300">
                    {currentUser.displayName || 'সম্মানিত ইউজার'}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    {currentUser.isAnonymous ? 'গেস্ট অ্যাকাউন্ট' : 'গুগল ফায়ারবেস অ্যাকাউন্ট'}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80">{currentUser.email || 'গুগল সিঙ্ক সক্রিয়'}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-full sm:w-auto text-center sm:text-left">
              <h4 className="font-bold text-amber-200 text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>প্রোফাইল সেভ ও ক্লাউড সিঙ্ক</span>
              </h4>
              <p className="text-xs text-emerald-300/80">
                লগইন করলে আপনার দৈনিক আমল ট্র্যাকার প্রগ্রেস ও কাস্টম রেডিও প্লেলিস্ট ফায়ারবেসে অটো-সেভ থাকবে।
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!currentUser ? (
              <>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>গুগল দিয়ে লগইন</span>
                </button>
                <button
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-medium text-xs border border-emerald-600 transition cursor-pointer"
                >
                  গেস্ট লগইন
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <p className="text-xs text-rose-300 bg-rose-950/80 p-2.5 rounded-lg border border-rose-800">{authError}</p>
        )}

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-emerald-700/80 gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto scrollbar-thin pb-0.5">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'progress'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/50 rounded-t-lg'
                : 'border-transparent text-emerald-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-300" />
            <span>আমলের অগ্রগতি ও গ্রাফ</span>
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'activities'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/50 rounded-t-lg'
                : 'border-transparent text-emerald-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>দৈনিক আমল ট্র্যাকার ও বিস্তারিত সূত্র</span>
          </button>

          <button
            onClick={() => setActiveTab('customization')}
            className={`px-3 py-2 font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'customization'
                ? 'border-amber-400 text-amber-300 bg-emerald-900/50 rounded-t-lg'
                : 'border-transparent text-emerald-300 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>রেডিও ও প্লেলিস্ট</span>
          </button>
        </div>

        {/* TAB 0: AMAL PROGRESS & DAY/WEEK/MONTH ANALYTICS GRAPHS */}
        {activeTab === 'progress' && (
          <AmalProgressAnalytics onCloseParentModal={onClose} />
        )}

        {/* TAB 1: EXPANDABLE ACCORDION TRACK ACTIVITY SCHEMA WITH SOURCES */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            
            {/* Today's Progress Bar & Streak Card */}
            <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-700/80 space-y-3 shadow">
              <div className="flex items-center justify-between text-xs sm:text-sm flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span className="font-bold text-amber-200">আজকের তারিখ: {todayStr}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-400/40 text-amber-300 font-extrabold text-xs">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                  <span>আমল স্ট্রিক: {streakDays} দিন!</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs text-emerald-200 mb-1">
                  <span>আজকের আমল সম্পন্ন: {completedTaskIds.length} / {DETAILED_TRACK_ACTIVITY_SCHEMA.length}</span>
                  <span className="font-extrabold text-amber-300">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-emerald-900 h-2.5 rounded-full overflow-hidden border border-emerald-700">
                  <div 
                    className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Filter controls & Instructions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-700/60">
              <div className="flex items-center gap-1.5 text-amber-200 font-bold">
                <Info className="w-4 h-4 text-amber-300 shrink-0" />
                <span>প্রতিটি সেকশন ডিফল্টভাবে হাইড থাকবে; এরো (▼) আইকনে ক্লিক করে অদ্যোপান্ত বিস্তারিত সূত্র ও নির্দেশিকা দেখুন:</span>
              </div>

              {/* Group Filter Dropdown */}
              <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                <Filter className="w-3.5 h-3.5 text-amber-300" />
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="bg-emerald-950 border border-emerald-700 text-amber-200 font-bold text-xs rounded-lg p-1 focus:outline-none"
                >
                  <option value="ALL">সকল ক্যাটাগরি</option>
                  {uniqueGroupNames.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACCORDION ACTIVITY LIST (HIDDEN BY DEFAULT) */}
            <div className="space-y-3">
              {filteredTasks.map((task, index) => {
                const isCompleted = completedTaskIds.includes(task.id);
                const isExpanded = expandedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isCompleted
                        ? 'bg-emerald-900/70 border-amber-400/60 shadow'
                        : 'bg-emerald-950/80 border-emerald-800 hover:border-emerald-700'
                    }`}
                  >
                    {/* Collapsed Header Bar (Click checkbox or click Arrow to expand) */}
                    <div 
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none bg-emerald-950/40 hover:bg-emerald-900/40"
                      onClick={() => handleToggleTask(task.id)}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTask(task.id);
                          }}
                          className="shrink-0 focus:outline-none"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-400/20" />
                          ) : (
                            <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 hover:text-emerald-400" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                              {task.categoryBn}
                            </span>
                            <span className="text-xs font-bold text-emerald-200/80">
                              {task.categoryGroupBn}
                            </span>
                          </div>
                          <h4 className={`text-xs sm:text-sm font-extrabold mt-1 ${isCompleted ? 'line-through text-amber-200/80' : 'text-emerald-100'}`}>
                            {task.titleBn}
                          </h4>
                        </div>
                      </div>

                      {/* Expand / Collapse Arrow Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleExpandTask(task.id, e)}
                        className="p-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-700 transition flex items-center gap-1 text-xs shrink-0"
                        title={isExpanded ? 'বিবরণ ও সূত্র হাইড করুন' : 'অদ্যোপান্ত বিস্তারিত সূত্র ও নির্দেশিকা দেখুন'}
                      >
                        <span className="hidden sm:inline font-semibold">{isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত সূত্র'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* EXPANDABLE DETAILED SECTION (HIDDEN BY DEFAULT) */}
                    {isExpanded && (
                      <div className="p-4 border-t border-emerald-800/80 bg-emerald-950/90 text-xs space-y-3.5 animate-fadeIn">
                        
                        {/* Comprehensive Details */}
                        <div>
                          <h5 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                            <FileText className="w-3.5 h-3.5 text-amber-300" />
                            <span>অদ্যোপান্ত বিস্তারিত ব্যাখ্যা:</span>
                          </h5>
                          <p className="text-emerald-100/90 leading-relaxed bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800">
                            {task.detailedDescriptionBn}
                          </p>
                        </div>

                        {/* Timing / Schedule */}
                        <div>
                          <h5 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                            <Clock className="w-3.5 h-3.5 text-amber-300" />
                            <span>আমলের প্রস্তাবিত সময়সূচী:</span>
                          </h5>
                          <p className="text-emerald-200 bg-emerald-900/30 p-2 rounded-lg border border-emerald-800/60 font-semibold">
                            {task.recommendedTimeBn}
                          </p>
                        </div>

                        {/* Action Steps */}
                        <div>
                          <h5 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                            <Check className="w-3.5 h-3.5 text-amber-300" />
                            <span>বাস্তবমুখী নির্দেশিকা ও কর্মপরিকল্পনা:</span>
                          </h5>
                          <ul className="list-disc list-inside space-y-1 text-emerald-200/90 bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-800/60">
                            {task.actionStepsBn.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Authentic Quran & Hadith Sources (সূত্র ও দলিল) */}
                        <div>
                          <h5 className="font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                            <span>বিশুদ্ধ সূত্র, হাদিস ও কুরআনী দলিল (Authentic Sources):</span>
                          </h5>
                          <div className="space-y-2">
                            {task.sources.map((src, sIdx) => (
                              <div key={sIdx} className="p-2.5 rounded-lg bg-teal-950/80 border border-teal-700/60 space-y-1">
                                <p className="text-teal-100 italic">"{src.textBn}"</p>
                                <div className="flex items-center justify-between text-[11px] text-amber-300/90 font-bold pt-1 border-t border-teal-800/50">
                                  <span>📖 গ্রন্থ: {src.bookNameBn}</span>
                                  <span className="bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                                    সূত্র: {src.referenceBn}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Listening Minutes & Personal Notes Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 space-y-1.5">
                <label className="text-xs font-bold text-amber-200 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>আজকে রেডিও/কুরআন শোনার সময় (মিনিট):</span>
                </label>
                <input
                  type="number"
                  value={listeningMinutes}
                  onChange={(e) => setListeningMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-emerald-950 border border-emerald-700 rounded-lg p-2 text-xs text-amber-200 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/60 space-y-1.5">
                <label className="text-xs font-bold text-amber-200 flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>ব্যক্তিগত আমল ও আত্মশুদ্ধির অনুভূতি নোট:</span>
                </label>
                <input
                  type="text"
                  placeholder="আজকের আমল বা বিশেষ অনুভূতি লিখুন..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-emerald-950 border border-emerald-700 rounded-lg p-2 text-xs text-emerald-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Save Activity Progress Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveProgress}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>আজকের আমল প্রগ্রেস ফায়ারবেসে সেভ করুন</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: RADIO & PLAYLIST CUSTOMIZATION */}
        {activeTab === 'customization' && (
          <div className="space-y-4">
            
            <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-700 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-amber-300 text-sm sm:text-base">
                    এডমিন ডিফল্ট মোড বনাম কাস্টম ইউজার প্রোফাইল
                  </h4>
                  <p className="text-xs text-emerald-200/80">
                    এডমিনের জন্য ডিফল্ট ২৪/৭ রেডিও সিডিউল থাকবে, আর আপনি চাইলে আপনার পছন্দের সিরিজ ক্যাটাগরি বেছে নিতে পারেন।
                  </p>
                </div>
                
                {/* Mode Switch toggle button */}
                <button
                  onClick={() => setIsCustomModeEnabled(!isCustomModeEnabled)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isCustomModeEnabled
                      ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow'
                      : 'bg-emerald-800 text-emerald-200 border-emerald-600'
                  }`}
                >
                  {isCustomModeEnabled ? 'কাস্টম ইউজার প্লেলিস্ট সক্রিয় 🟢' : 'এডমিন ডিফল্ট সিডিউল ⚙️'}
                </button>
              </div>

              {!isCustomModeEnabled ? (
                <div className="p-3.5 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-xs text-emerald-200 space-y-1">
                  <p className="font-bold text-amber-200">
                    📌 এডমিন ডিফল্ট মোড সক্রিয় রয়েছে:
                  </p>
                  <p className="text-emerald-100/90">
                    ২৪ ঘন্টা ব্যাপি রুকাইয়া, বরকত, রোগমুক্তি, আজকার, মানসিক প্রশান্তি ও বাংলা বয়ানের জাতীয় বিশ্বস্ত সিডিউল সার্বজনীনভাবে চলবে।
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-300" />
                    <span>আপনার পছন্দের ২৪/৭ সিরিজ ক্যাটাগরি বেছে নিন (কাস্টম রেডিও প্লেলিস্ট):</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {RADIO_SERIES_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryIds(prev =>
                              prev.includes(cat.id)
                                ? prev.filter(id => id !== cat.id)
                                : [...prev, cat.id]
                            );
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer select-none transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow'
                              : 'bg-emerald-900/50 border-emerald-800 text-emerald-300 hover:border-emerald-600'
                          }`}
                        >
                          <div>
                            <span className="font-bold block">{cat.nameBn}</span>
                            <span className="text-[10px] text-emerald-300/80 line-clamp-1">{cat.taglineBn}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 ml-2" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveCustomization}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>কাস্টোমাইজেশন সেটিংস ফায়ারবেসে সেভ করুন</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
