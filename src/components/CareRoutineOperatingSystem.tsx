import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  Brain,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Star,
  Trash2,
  Calendar,
  Volume2,
  Bell,
  Activity,
  Droplets,
  Pill,
  Utensils,
  ChevronRight,
  Shield,
  HelpCircle,
  Share2,
  Sliders,
  Check,
  X,
  ListOrdered,
  Lock,
  Unlock,
  KeyRound,
  FileText,
  Smartphone,
  RefreshCw,
  Moon,
  AlertTriangle
} from 'lucide-react';
import {
  CareProfile,
  CareProfileId,
  RoutineTask,
  TaskCategory,
  TaskPriority,
  ActivityLog,
  AiContextBrainState,
  NextActionSuggestion,
  AlarmToneType
} from '../types/careRoutine';
import { careRoutineService, getLocalTodayString, getOffsetDateString, formatBengaliDateHuman } from '../services/careRoutineService';
import { smartAlarmService } from '../services/smartAlarmService';
import { playlistManager } from '../services/audioPlaylistManager';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { CareReportShareView } from './CareReportShareView';
import { Care24HourTimelineVisualizer } from './Care24HourTimelineVisualizer';
import { CareRoutineTaskPrayerCard } from './CareRoutineTaskPrayerCard';
import { CareAutoPeriodicReminder } from './CareAutoPeriodicReminder';
import { CareDashboardShareModal } from './CareDashboardShareModal';
import { CareQuickDailyTaskAdder } from './CareQuickDailyTaskAdder';
import { CareTaskEditModal } from './CareTaskEditModal';
import { CareActivityHistoryLog } from './CareActivityHistoryLog';
import { CareRoutineDateNavigator } from './CareRoutineDateNavigator';

interface CareRoutineOperatingSystemProps {
  onToast?: (msg: string) => void;
  onOpenReport?: (range?: '1d' | '7d' | '30d') => void;
}

export const CareRoutineOperatingSystem: React.FC<CareRoutineOperatingSystemProps> = ({
  onToast,
  onOpenReport
}) => {
  const [profiles, setProfiles] = useState<CareProfile[]>(() => careRoutineService.getProfiles());
  const [activeProfile, setActiveProfile] = useState<CareProfile>(() => careRoutineService.getActiveProfile());
  const [selectedDate, setSelectedDate] = useState<string>(() => careRoutineService.getSelectedDate());
  const [tasks, setTasks] = useState<RoutineTask[]>(() => careRoutineService.getTasks(undefined, careRoutineService.getSelectedDate()));
  const [logs, setLogs] = useState<ActivityLog[]>(() => careRoutineService.getLogs(undefined, careRoutineService.getSelectedDate()));
  const [brainState, setBrainState] = useState<AiContextBrainState>(() => careRoutineService.analyzeContextBrain());

  const dateStats = useMemo(() => {
    return careRoutineService.getDateStats(selectedDate, activeProfile.id);
  }, [selectedDate, activeProfile.id, tasks]);

  // Security PIN Lock
  const [isControlLocked, setIsControlLocked] = useState<boolean>(() => {
    return localStorage.getItem('care_os_security_locked') === 'true';
  });
  const [securityPin, setSecurityPin] = useState<string>(() => {
    return localStorage.getItem('care_os_security_pin') || '1234';
  });
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Modals
  const [showDashboardShareModal, setShowDashboardShareModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportModalRange, setReportModalRange] = useState<'1d' | '7d' | '30d'>('7d');
  const [showNowWhatModal, setShowNowWhatModal] = useState<boolean>(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);

  // Input & Natural Language
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [parsedPreview, setParsedPreview] = useState<ReturnType<typeof careRoutineService.parseNaturalLanguageInput> | null>(null);

  // Recovery & Now What Data
  const [recoveryPlan, setRecoveryPlan] = useState<ReturnType<typeof careRoutineService.generateRecoveryPlan> | null>(null);
  const [nowWhatData, setNowWhatData] = useState<ReturnType<typeof careRoutineService.getNowWhatCategorizedTasks> | null>(null);

  // Filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Quick Adder Prefill Slot
  const [quickStartTime, setQuickStartTime] = useState<string>('');
  const [quickDuration, setQuickDuration] = useState<number>(30);

  // Current Minutes for live card updates
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState<number>(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  const quickAdderRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Periodic tick for live card timing
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTimeMinutes(d.getHours() * 60 + d.getMinutes());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize state with careRoutineService
  const refreshData = () => {
    const currentProfile = careRoutineService.getActiveProfile();
    const curDate = careRoutineService.getSelectedDate();
    setSelectedDate(curDate);
    setProfiles(careRoutineService.getProfiles());
    setActiveProfile(currentProfile);
    setTasks(careRoutineService.getTasks(currentProfile.id, curDate));
    setLogs(careRoutineService.getLogs(currentProfile.id, curDate));
    setBrainState(careRoutineService.analyzeContextBrain(currentProfile.id));
  };

  const handleSelectDate = (dateStr: string) => {
    careRoutineService.setSelectedDate(dateStr);
    setSelectedDate(dateStr);
    refreshData();
  };

  const handleShiftDate = (offset: number) => {
    const newDate = careRoutineService.shiftSelectedDate(offset);
    setSelectedDate(newDate);
    refreshData();
  };

  useEffect(() => {
    const unsub = careRoutineService.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, []);

  // Web Speech API Voice Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = 'bn-BD';

        reco.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          handleParseInput(transcript);
        };

        reco.onerror = (e: any) => {
          console.error('Speech recognition error:', e);
          setIsListening(false);
          if (onToast) onToast('ভয়েস শনাক্তকরণে সমস্যা হয়েছে, অনুগ্রহ করে লিখে জানান।');
        };

        reco.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = reco;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      if (onToast) onToast('আপনার ব্রাউজারে বাংলা ভয়েস ইনপুট সমর্থিত নয়, অনুগ্রহ করে লিখুন।');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        recognitionRef.current.start();
        if (onToast) onToast('🎙️ বাংলা ভয়েস শুনছি... স্পষ্ট করে বলুন');
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  // Parsing Handler
  const handleParseInput = (textToParse?: string) => {
    const query = textToParse || inputText;
    if (!query.trim()) return;

    const parsed = careRoutineService.parseNaturalLanguageInput(query);
    setParsedPreview(parsed);
  };

  const handleConfirmParsedInput = () => {
    if (!parsedPreview) return;
    const res = careRoutineService.executeParsedInput(parsedPreview, selectedDate);
    setInputText('');
    setParsedPreview(null);
    refreshData();
    if (onToast) onToast(res.message);
  };

  // Profile Switching
  const handleSwitchProfile = (profileId: CareProfileId) => {
    careRoutineService.setActiveProfile(profileId);
    const p = careRoutineService.getActiveProfile();
    setActiveProfile(p);
    setTasks(careRoutineService.getTasks(p.id, selectedDate));
    setLogs(careRoutineService.getLogs(p.id, selectedDate));
    setBrainState(careRoutineService.analyzeContextBrain(p.id));
  };

  // Security Guard
  const guardSecureAction = (action: () => void) => {
    if (isControlLocked) {
      setPendingAction(() => action);
      setPinInput('');
      setPinError('');
      setShowPinModal(true);
    } else {
      action();
    }
  };

  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === securityPin) {
      setShowPinModal(false);
      setIsControlLocked(false);
      localStorage.setItem('care_os_security_locked', 'false');
      if (onToast) onToast('🔓 কন্ট্রোল প্যানেল সফলভাবে আনলক করা হয়েছে!');
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setPinError('ভুল পিন নম্বর! অনুগ্রহ করে সঠিক ৪-সংখ্যার পিন দিন। (ডিফল্ট: 1234)');
    }
  };

  const handleToggleLock = () => {
    if (!isControlLocked) {
      setIsControlLocked(true);
      localStorage.setItem('care_os_security_locked', 'true');
      if (onToast) onToast('🔒 কন্ট্রোল প্যানেল সুরক্ষিত (লক) করা হয়েছে।');
    } else {
      setPendingAction(null);
      setPinInput('');
      setPinError('');
      setShowPinModal(true);
    }
  };

  // Deduplication & Optimization Action
  const handleCleanDuplicates = () => {
    const removedCount = careRoutineService.cleanDuplicateTasks();
    const prunedCount = careRoutineService.pruneToSensibleSchedule(activeProfile.id);
    refreshData();
    const totalRemoved = removedCount + prunedCount;
    if (onToast) {
      if (totalRemoved > 0) {
        onToast(`🧹 ${toBengaliDigits(totalRemoved)}টি ডুপ্লিকেট ও অতিরিক্ত এন্ট্রি সফলভাবে সরানো হয়েছে!`);
      } else {
        onToast('✨ কোনো ডুপ্লিকেট এন্ট্রি নেই, রুটিন একদম পরিচ্ছন্ন!');
      }
    }
  };

  // Restore Default 24-Hour Routine Action
  const handleRestoreDefaults = () => {
    guardSecureAction(() => {
      careRoutineService.resetToRecommendedRoutines(activeProfile.id);
      refreshData();
      if (onToast) onToast('🔄 ডিফল্ট ২৪ ঘণ্টার রুটিন সফলভাবে রিস্টোর করা হয়েছে!');
    });
  };

  // Open "এখন কী করবো?" Modal
  const handleOpenNowWhat = () => {
    const data = careRoutineService.getNowWhatCategorizedTasks(activeProfile.id);
    setNowWhatData(data);
    setShowNowWhatModal(true);
  };

  // Open Recovery Plan Modal
  const handleOpenRecovery = () => {
    const plan = careRoutineService.generateRecoveryPlan(activeProfile.id);
    setRecoveryPlan(plan);
    setShowRecoveryModal(true);
  };

  const handleApplyRecovery = () => {
    if (recoveryPlan && recoveryPlan.suggestedShifts.length > 0) {
      careRoutineService.applyRecoveryPlan(recoveryPlan.suggestedShifts);
      setShowRecoveryModal(false);
      if (onToast) onToast('আলহামদুলিল্লাহ! আজকের বাকি শিডিউল সফলভাবে পুনর্বিন্যাস করা হয়েছে।');
    }
  };

  // Task Completion
  const handleCompleteTask = (taskId: string) => {
    const res = careRoutineService.completeTask(taskId, undefined, undefined, selectedDate);
    refreshData();
    if (onToast) {
      onToast(`আলহামদুলিল্লাহ! "${res.task.title}" সম্পন্ন হয়েছে।`);
    }
  };

  const handleUncompleteTask = (taskId: string) => {
    guardSecureAction(() => {
      const { task } = careRoutineService.uncompleteTask(taskId, selectedDate);
      refreshData();
      if (onToast) {
        onToast(`↩️ "${task.title}" পুনরায় অসম্পন্ন (Pending) অবস্থায় ফিরিয়ে আনা হয়েছে।`);
      }
    });
  };

  const handleStartTask = (taskId: string) => {
    const res = careRoutineService.startTask(taskId, selectedDate);
    refreshData();
    if (onToast) {
      onToast(`বিসমিল্লাহ! "${res.task.title}" শুরু করা হয়েছে।`);
    }
  };

  // Toggle Alarm for Task
  const handleToggleAlarm = (task: RoutineTask) => {
    guardSecureAction(() => {
      const updated: RoutineTask = {
        ...task,
        alarmEnabled: !task.alarmEnabled
      };
      careRoutineService.updateTask(updated);
      refreshData();
      if (onToast) {
        onToast(updated.alarmEnabled ? `🔔 "${task.title}" এলার্ম চালু করা হয়েছে` : `🔕 "${task.title}" এলার্ম বন্ধ করা হয়েছে`);
      }
    });
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    guardSecureAction(() => {
      careRoutineService.deleteTask(taskId);
      refreshData();
      if (onToast) onToast('কাজটি সফলভাবে মুছে ফেলা হয়েছে।');
    });
  };

  // Edit Task
  const handleEditTask = (task: RoutineTask) => {
    guardSecureAction(() => {
      setEditingTask(task);
    });
  };

  const handleSaveEditedTask = (updatedTask: RoutineTask) => {
    careRoutineService.updateTask(updatedTask);
    setEditingTask(null);
    refreshData();
    if (onToast) onToast(`✅ "${updatedTask.title}" সফলভাবে আপডেট করা হয়েছে!`);
  };

  // Quick Daily Add Task
  const handleQuickAddTask = (newTask: RoutineTask) => {
    guardSecureAction(() => {
      newTask.profileId = activeProfile.id;
      careRoutineService.addTask(newTask);
      refreshData();
      if (onToast) onToast(`✅ "${newTask.title}" রুটিনে সমন্বয় করা হয়েছে!`);
    });
  };

  // When user clicks a free slot in 24h visualizer
  const handleSelectFreeSlot = (startTime: string, durationMinutes: number) => {
    setQuickStartTime(startTime);
    setQuickDuration(durationMinutes);
    if (quickAdderRef.current) {
      quickAdderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (onToast) onToast(`স্লট ${toBengaliDigits(startTime)} নির্বাচিত হয়েছে। কাজের বিবরণ পূরণ করুন।`);
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'must_do') return t.isMustDo;
    return t.category === categoryFilter;
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* 1. TOP HERO: PROFILE SELECTION & CAREGIVER HANDOVER */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 border-2 border-emerald-700/80 p-4 sm:p-5 shadow-2xl text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-lg shrink-0">
              {activeProfile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-amber-300">
                  {activeProfile.nameBn}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-800 border border-emerald-600 font-bold text-emerald-200">
                  {activeProfile.relationBn}
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 mt-0.5">
                🧠 ২৪/৭ AI কেয়ার, লাইফ ও রুটিন অপারেটিং সিস্টেম • নিট অ্যান্ড ক্লিন ভিউ
              </p>
            </div>
          </div>

          {/* Profile Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {profiles.map(p => (
              <button
                key={p.id}
                onClick={() => handleSwitchProfile(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                  activeProfile.id === p.id
                    ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow font-black scale-105'
                    : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border-emerald-700/80'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.nameBn.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Quick Management Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Share Dashboard with Device Info */}
            <button
              onClick={() => setShowDashboardShareModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 ডিভাইসের তথ্যসহ ড্যাশবোর্ড রিপোর্ট শেয়ার</span>
            </button>

            {/* Clean Duplicates Button */}
            <button
              onClick={handleCleanDuplicates}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-600/50 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
              title="একই সময়ের কোনো ডুপ্লিকেট এন্ট্রি থাকলে পরিষ্কার করুন"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ডুপ্লিকেট রিমুভ ও ক্লিন</span>
            </button>

            {/* Restore Default 24h Routine */}
            <button
              onClick={handleRestoreDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              title="প্রস্তাবিত পূর্ণাঙ্গ ২৪ ঘণ্টার রুটিন ফিরিয়ে আনুন"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>ডিফল্ট রুটিন রিস্টোর</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Lock / Unlock Status */}
            <button
              onClick={handleToggleLock}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                isControlLocked
                  ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700 shadow'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-600'
              }`}
            >
              {isControlLocked ? <Lock className="w-3.5 h-3.5 text-rose-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isControlLocked ? 'লক করা (PIN সুরক্ষিত)' : 'আনলকড'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. DATE NAVIGATOR & HISTORICAL ROUTINE TRACKER */}
      <CareRoutineDateNavigator
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onShiftDate={handleShiftDate}
        stats={dateStats}
      />

      {/* 3. 24-HOUR TIME MANAGEMENT & FREE TIME VISUALIZER */}
      <Care24HourTimelineVisualizer
        tasks={tasks}
        onSelectFreeSlot={handleSelectFreeSlot}
        onSelectTask={handleEditTask}
      />

      {/* 3. 10-MINUTE PERIODIC AUDIO BRIEFING & AMAL REMINDER */}
      <CareAutoPeriodicReminder
        tasks={tasks}
        brainState={brainState}
        activeProfileName={activeProfile.nameBn}
      />

      {/* 4. QUICK DAILY ROUTINE ADDER (DUPLICATE-SAFE) */}
      <div ref={quickAdderRef}>
        <CareQuickDailyTaskAdder
          existingTasks={tasks}
          onAddTask={handleQuickAddTask}
          defaultStartTime={quickStartTime}
          defaultDuration={quickDuration}
        />
      </div>

      {/* 5. 5-WAQT PRAYER STYLE ROUTINE TASKS BOARD */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-700/80 space-y-4 shadow-xl backdrop-blur-md">
        {/* Header with Title and Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>দৈনিক রুটিন ও আমল তালিকা</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold">
                  {toBengaliDigits(tasks.filter(t => t.status === 'completed').length)}/{toBengaliDigits(tasks.length)} সম্পন্ন
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                ৫ ওয়াক্তের নামাজের মতো করে শুরু, শেষ, মোট ব্যাপ্তি ও ইসলামিক আমল
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'সব কাজ' },
              { id: 'must_do', label: '🔴 Must Do' },
              { id: 'prayer', label: '🕌 নামাজ' },
              { id: 'amal', label: '📿 আমল' },
              { id: 'medicine', label: '💊 ওষুধ' },
              { id: 'water', label: '💧 পানি' },
              { id: 'feeding', label: '🥣 খাবার' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                  categoryFilter === cat.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bloated Tasks Optimization Banner */}
        {tasks.length > 20 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-400 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-black text-amber-300">
                  রুটিনে অতিরিক্ত টাস্ক ({toBengaliDigits(tasks.length)}টি) জমা হয়েছে!
                </p>
                <p className="text-[11px] text-amber-200/80">
                  বারবার শিডিউল যোগ বা টেস্ট করার কারণে ডুপ্লিকেট হয়েছে। এক ক্লিকে সুষম ও পরিচ্ছন্ন রুটিনে নামিয়ে আনুন।
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCleanDuplicates}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ক্লিন ও অপ্টিমাইজ করুন</span>
              </button>
              <button
                onClick={handleRestoreDefaults}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer border border-slate-700 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                <span>ডিফল্ট ২৪ঘণ্টা রুটিন</span>
              </button>
            </div>
          </div>
        )}

        {/* Task Cards Grid (Prayer Style) */}
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-300">এই ক্যাটাগরিতে কোনো রুটিন কাজ নেই</p>
            <p className="text-[11px]">উপরের ফরম থেকে সহজে নতুন কাজ যুক্ত করুন</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <CareRoutineTaskPrayerCard
                key={task.id}
                task={task}
                currentTimeMinutes={currentTimeMinutes}
                onComplete={handleCompleteTask}
                onUncomplete={handleUncompleteTask}
                onStart={handleStartTask}
                onToggleAlarm={handleToggleAlarm}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* 6. NATURAL LANGUAGE & VOICE QUICK INPUT BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-black text-amber-300">
              বাংলা ভয়েস ও দ্রুত টেক্সট এন্ট্রি (AI Context)
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
            বলুন বা লিখুন
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleParseInput()}
              placeholder="যেমন: 'আম্মুর সকালের ওষুধ দেওয়া শেষ ৭:১৮' বা '১৫০ মিলি পানি পান সম্পন্ন'..."
              className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-amber-400"
            />
            {inputText && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
            }`}
            title="বাংলা ভয়েস দিয়ে বলুন"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleParseInput()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black shadow transition cursor-pointer shrink-0"
            title="AI এন্ট্রি"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
          {[
            { label: '🏋️ দিনে ৩ বার থেরাপি ও ব্যায়াম (১০:০০ থেকে)', text: 'সকাল ১০:০০ থেকে ফার্স্ট থেরাপি স্টার্ট করলাম সারাদিনে ঘুমানোর আগে পর্যন্ত দিনে ৩ বার থেরাপি ও ব্যায়াম শিডিউল সেট করে দাও' },
            { label: '💧 সারাদিনে ৩ লিটার পানি শিডিউল', text: 'সারাদিনে ৩ লিটার পানি পানের শিডিউল সেট করে দাও' },
            { label: '🌙 রাতের ঘুম রাত ১১টা (৭ ঘণ্টা)', text: 'রাতের ঘুমের সময় রাত ১১টা থেকে ৭ ঘণ্টা' },
            { label: '💊 সকালের ওষুধ সম্পন্ন ৭:১৮', text: 'আম্মুর সকালের ওষুধ দেওয়া শেষ ৭:১৮' },
            { label: '🥣 পুষ্টিকর খাবার সম্পন্ন', text: 'পুষ্টিকর খাবার গ্রহণ সম্পন্ন' },
            { label: '🕌 জোহর নামাজ আদায়', text: 'জোহর নামাজ আদায় করা হয়েছে' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(chip.text);
                handleParseInput(chip.text);
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 text-[10px] font-medium whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Parsed Preview */}
        {parsedPreview && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-slate-950 border-2 border-amber-400 text-white space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-300 font-black text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI স্মার্ট পার্সিং ফলাফল</span>
              </span>
              <button onClick={() => setParsedPreview(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">{parsedPreview.explanationBn}</p>

            {/* If multi-tasks (e.g. 3L water) */}
            {parsedPreview.actionType === 'schedule_multi' && parsedPreview.multiTasks && (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-sky-500/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-sky-300 border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>প্রস্তাবিত দৈনিক স্লটসমূহ ({toBengaliDigits(parsedPreview.multiTasks.length)}টি):</span>
                  </span>
                  <span className="text-emerald-400 font-mono">মোট {parsedPreview.amount}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {parsedPreview.multiTasks.map((t, idx) => (
                    <div key={idx} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-amber-300 font-bold bg-slate-900 px-1 py-0.5 rounded text-[10px]">
                          {toBengaliDigits(t.scheduledTime)}
                        </span>
                        <span className="text-slate-200 truncate">{t.title}</span>
                      </div>
                      <span className="text-sky-300 font-mono text-[10px] shrink-0 font-bold ml-1">
                        {t.amountOrDose}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If sleep booking */}
            {parsedPreview.actionType === 'schedule_sleep' && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between text-xs">
                <span className="text-purple-300 flex items-center gap-1.5 font-bold">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <span>রাত {toBengaliDigits(parsedPreview.timeString)} থেকে {parsedPreview.amount}</span>
                </span>
                <span className="text-[11px] text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded-full font-bold">
                  বুকড স্লট
                </span>
              </div>
            )}

            {/* If delete action */}
            {parsedPreview.actionType === 'delete' && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-xs text-rose-200">
                <span className="flex items-center gap-1.5 font-bold">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>মুছে ফেলা হবে: {parsedPreview.title}</span>
                </span>
              </div>
            )}

            <div className="flex justify-end items-center gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => setParsedPreview(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer font-bold transition"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmParsedInput}
                className={`px-4 py-1.5 rounded-xl text-xs font-black cursor-pointer shadow-lg transition flex items-center gap-1.5 ${
                  parsedPreview.actionType === 'delete'
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {parsedPreview.actionType === 'schedule_multi'
                    ? `সবগুলো (${toBengaliDigits(parsedPreview.multiTasks?.length || 0)}টি) যুক্ত করুন`
                    : parsedPreview.actionType === 'schedule_sleep'
                    ? 'ঘুমের সময় বুক করুন'
                    : parsedPreview.actionType === 'delete'
                    ? 'মুছে ফেলুন'
                    : 'নিশ্চিত করুন ও প্রয়োগ করুন'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. RECENT ACTIVITY HISTORY LOG (CLEAN, DEDUPLICATED, MOBILE-OPTIMIZED) */}
      <CareActivityHistoryLog
        logs={logs}
        onCleanDuplicates={() => {
          const removedCount = careRoutineService.cleanDuplicateLogs(activeProfile.id);
          refreshData();
          if (onToast) {
            if (removedCount > 0) {
              onToast(`🧹 ${toBengaliDigits(removedCount)}টি ডুপ্লিকেট লগ সরানো হয়েছে!`);
            } else {
              onToast('✨ কোনো ডুপ্লিকেট লগ নেই, লগবুক একদম পরিচ্ছন্ন!');
            }
          }
        }}
        onClearAllLogs={() => {
          guardSecureAction(() => {
            if (window.confirm('আপনি কি আজকের সব অ্যাক্টিভিটি হিস্ট্রি লগ মুছে ফেলতে চান?')) {
              careRoutineService.clearAllLogs(activeProfile.id);
              refreshData();
              if (onToast) onToast('সকল অ্যাক্টিভিটি হিস্ট্রি লগ সফলভাবে মুছে ফেলা হয়েছে।');
            }
          });
        }}
        onDeleteLog={(logId: string) => {
          guardSecureAction(() => {
            careRoutineService.deleteLog(logId);
            refreshData();
            if (onToast) onToast('লগ সফলভাবে মুছে ফেলা হয়েছে।');
          });
        }}
      />

      {/* MODAL: DASHBOARD SHARE WITH DEVICE INFO */}
      <CareDashboardShareModal
        isOpen={showDashboardShareModal}
        onClose={() => setShowDashboardShareModal(false)}
        activeProfile={activeProfile}
        tasks={tasks}
        logs={logs}
        selectedDate={selectedDate}
        onToast={onToast}
      />

      {/* 🔒 SECURITY PIN UNLOCK MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-400 p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm text-white">সিকিউর কন্ট্রোল প্যানেল আনলক</h3>
              </div>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPendingAction(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              রুটিন পরিবর্তন, কাজ মোছা বা সেটিংস পরিবর্তনের জন্য আপনার ৪-সংখ্যার পিন (PIN) প্রদান করুন:
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="৪ সংখ্যার পিন লিখুন"
                  autoFocus
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border-2 border-slate-700 text-center text-xl tracking-widest font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-400 font-bold mt-1 text-center">
                    {pinError}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  প্রাথমিক ডিফল্ট পিন: <strong>1234</strong>
                </p>
              </div>

              {/* Quick Number Pad */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(btn => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => {
                      if (btn === 'C') setPinInput('');
                      else if (btn === '⌫') setPinInput(prev => prev.slice(0, -1));
                      else setPinInput(prev => (prev.length < 6 ? prev + btn : prev));
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-sm text-white active:scale-95 transition"
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg"
                >
                  আনলক করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📊 SHAREABLE CARE & ROUTINE REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md overflow-y-auto p-2 sm:p-4">
          <div className="min-h-full flex flex-col justify-start">
            <CareReportShareView
              onBackToApp={() => setShowReportModal(false)}
              onToast={onToast}
              initialRange={reportModalRange}
              initialProfileId={activeProfile.id}
            />
          </div>
        </div>
      )}

      {/* ✏️ TASK EDIT MODAL */}
      <CareTaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
        onDelete={(id) => {
          handleDeleteTask(id);
          setEditingTask(null);
        }}
      />
    </div>
  );
};
