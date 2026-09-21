import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle2,
  ListPlus,
  ArrowRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { ChatMessage, Language, AiScheduleTask } from '../types';
import { translations } from '../locales/translations';
import { RAG_CHUNKS_DB } from '../services/ragEngine';
import { careRoutineService } from '../services/careRoutineService';
import { RoutineTask } from '../types/careRoutine';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface IslamicAiChatProps {
  lang: Language;
}

export const IslamicAiChat: React.FC<IslamicAiChatProps> = ({ lang }) => {
  const t = translations[lang];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি **ইসলামিক লাইফ AI**।\n\nপবিত্র কুরআন ও সহীহ সুন্নাহর বিশুদ্ধ দলিলের আলোকে ফরজ বিধান, নফল ইবাদত, ৯৯ নামের পরীক্ষিত ফযীলত ও বাস্তব আমল, মাসনূন দোয়া এবং আপনার জন্য কাস্টমাইজড **দৈনিক ইসলামিক শিডিউল বা রুটিন** তৈরি করতে আমি প্রস্তুত। যেকোনো বিষয় জিজ্ঞাসা করুন বা নিচের কুইক বাটনে ক্লিক করুন।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['আল-কুরআনুল কারীম', 'সহীহ বুখারী', 'সহীহ মুসলিম', 'আসমাউল হুসনা মুজাররাবাত']
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedSchedules, setAppliedSchedules] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Client-side fallback if server is unreachable
  const getLocalRagFallback = (query: string): { reply: string; sources: string[]; scheduleTasks?: AiScheduleTask[]; scheduleTitle?: string } => {
    const qLower = query.toLowerCase();
    const isSchedule = ['শিডিউল', 'রুটিন', 'schedule', 'routine', 'সময়সূচি', 'সময়সূচি', 'প্ল্যান', 'সারাদিনের আমল', 'দৈনিক রুটিন', 'তাহাজ্জুদের রুটিন'].some(k => qLower.includes(k));

    if (isSchedule) {
      const isNight = qLower.includes('তাহাজ্জুদ') || qLower.includes('রাত');
      const scheduleTitle = isNight ? 'তাহাজ্জুদ ও নৈশ ইবাদতের বিশেষ শিডিউল' : 'পূর্ণাঙ্গ ২৪ ঘণ্টা ইসলামিক আমল ও সালাত শিডিউল';
      const scheduleTasks: AiScheduleTask[] = isNight ? [
        { title: 'তাহাজ্জুদ সালাত ও নিভৃত মোনাজাত', category: 'prayer', time: '04:15', priority: 'critical', notes: '৪ বা ৮ রাকাত তাহাজ্জুদ ও সজল নয়নে ইস্তেগফার', durationMinutes: 35 },
        { title: 'সাইয়্যিদুল ইস্তেগফার ও তওবা', category: 'amal', time: '04:50', priority: 'important', notes: 'হিসনুল মুসলিম অনুযায়ী সাইয়্যিদুল ইস্তেগফার ও ক্ষমা প্রার্থনা', durationMinutes: 10 },
        { title: 'ফজর সালাত ও জামায়াত', category: 'prayer', time: '05:10', priority: 'critical', notes: '২ রাকাত সুন্নত ও ২ রাকাত ফরজ জামায়াতে আদায়', durationMinutes: 25 },
        { title: 'সকালের মাসনূন হেফাজতের দোয়া', category: 'amal', time: '05:40', priority: 'important', notes: 'আয়াতুল কুরসি, ৪ কুল ও সকালের প্রতিরক্ষা জিকির', durationMinutes: 15 },
        { title: 'ইশরাক সালাত', category: 'prayer', time: '06:20', priority: 'important', notes: '২ রাকাত ইশরাক সালাত আদায়', durationMinutes: 10 },
        { title: 'চাশত (সালাতুদ দুহা)', category: 'prayer', time: '09:30', priority: 'normal', notes: '২ বা ৪ রাকাত চাশত সালাত আদায়', durationMinutes: 15 },
        { title: 'ইশা ও বিতর সালাত', category: 'prayer', time: '20:00', priority: 'critical', notes: 'ফরজ ও ৩ রাকাত বিতর সালাত আদায়', durationMinutes: 25 },
        { title: 'সূরা আল-মুলক তিলাওয়াত ও শয়নকালীন জিকির', category: 'amal', time: '22:00', priority: 'important', notes: 'কবরের আজাব থেকে রক্ষার জন্য সূরা মুলক ও শয়নকালীন দোয়া', durationMinutes: 15 }
      ] : [
        { title: 'তাহাজ্জুদ সালাত ও ইস্তেগফার', category: 'prayer', time: '04:20', priority: 'important', notes: '২ বা ৪ রাকাত তাহাজ্জুদ ও সেহরির বরকত', durationMinutes: 30 },
        { title: 'ফজর সালাত (ফরজ ও সুন্নত)', category: 'prayer', time: '05:10', priority: 'critical', notes: 'সুন্নতের পর জামায়াতে ফরজ সালাত আদায়', durationMinutes: 25 },
        { title: 'সকালের মাসনূন দোয়া ও কুরআন তিলাওয়াত', category: 'amal', time: '05:40', priority: 'important', notes: '১০ আয়াত কুরআন তিলাওয়াত ও সকালের হেফাজতের জিকির', durationMinutes: 25 },
        { title: 'ইশরাক সালাত', category: 'prayer', time: '06:25', priority: 'important', notes: '২ রাকাত ইশরাক সালাত আদায়', durationMinutes: 10 },
        { title: 'সকালের নাস্তা ও বরকতময় পানি গ্রহণ', category: 'feeding', time: '07:30', priority: 'normal', notes: 'সুন্নতি তরীকায় খাদ্য ও পর্যাপ্ত পানি গ্রহণ', durationMinutes: 20 },
        { title: 'চাশত সালাত (সালাতুদ দুহা)', category: 'prayer', time: '10:00', priority: 'normal', notes: '২ রাকাত চাশত সালাত আদায়', durationMinutes: 10 },
        { title: 'জোহর সালাত ও মধ্যাহ্ন তাসবিহ', category: 'prayer', time: '13:00', priority: 'critical', notes: '৪ রাকাত সুন্নত ও ৪ রাকাত ফরজ জামায়াতে আদায়', durationMinutes: 30 },
        { title: 'দুপুরের আহার ও কায়লুলা (স্বল্প বিশ্রাম)', category: 'personal_care', time: '13:45', priority: 'normal', notes: 'সুন্নত অনুযায়ী অল্প সময়ের জন্য কায়লুলা/বিশ্রাম', durationMinutes: 30 },
        { title: 'আসর সালাত ও সন্ধ্যার হেফাজতের দোয়া', category: 'prayer', time: '16:30', priority: 'critical', notes: '৪ রাকাত ফরজ সালাত ও সন্ধ্যার ৩ কুল ও সাইয়্যিদুল ইস্তেগফার', durationMinutes: 30 },
        { title: 'আসমাউল হুসনা পাঠ ও মননশীল জিকির', category: 'amal', time: '17:30', priority: 'important', notes: 'আল্লাহর ৯৯ নাম ও পরীক্ষিত তাসবিহ পাঠ', durationMinutes: 15 },
        { title: 'মাগরিব সালাত ও আওয়াবীন', category: 'prayer', time: '18:15', priority: 'critical', notes: '৩ রাকাত ফরজ, ২ রাকাত সুন্নত ও ২-৬ রাকাত আওয়াবীন সালাত', durationMinutes: 30 },
        { title: 'ইশা সালাত ও সালাতুল বিতর', category: 'prayer', time: '20:00', priority: 'critical', notes: 'ফরজ, সুন্নত ও ৩ রাকাত বিতর সালাত', durationMinutes: 35 },
        { title: 'সূরা আল-মুলক পাঠ ও শয়নকালীন সুন্নাত', category: 'amal', time: '22:00', priority: 'important', notes: 'সূরা মুলক, আয়াতুল কুরসি ও অজুর সাথে শোয়া', durationMinutes: 20 }
      ];

      return {
        reply: `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ।\n\nআপনার জন্য পবিত্র কুরআন ও সহীহ সুন্নাহ মোতাবেক একটি সুষম ও বরকতময় **"${scheduleTitle}"** প্রস্তুত করা হয়েছে।\n\n📌 **শিডিউলটির মূল বিষয়সমূহ:**\n• পাঁচ ওয়াক্ত ফরজ সালাতের সুনির্দিষ্ট ওয়াক্ত ও জামায়াতের সময় বণ্টন।\n• শেষ রাতে তাহাজ্জুদ ও দিনের শুরুতে ইশরাক ও চাশত (সালাতুদ দুহা)-এর নফল সালাত।\n• সকাল-সন্ধ্যার প্রমাণিত মাসনূন হেফাজতের দোয়া ও আসমাউল হুসনা আমল।\n• সুন্নাত অনুযায়ী কায়লুলা (দুপুরের স্বল্প বিশ্রাম) ও রাতের শুরুতে সূরা মুলক পাঠ।\n\nনিচের শিডিউল কার্ড থেকে আপনি এক ক্লিকেই **"এই শিডিউলটি আমার ডেইলি কেয়ার ও রুটিনে যুক্ত করুন"** বাটনে চাপ দিয়ে আপনার অ্যাপের ২৪ ঘণ্টা অ্যালার্ম ও কেয়ার অপারেটিং সিস্টেমে এটি সক্রিয় করে নিতে পারেন।`,
        sources: ['কুরআনুল কারীম', 'সহীহ বুখারী', 'সহীহ মুসলিম', 'হিসনুল মুসলিম'],
        scheduleTasks,
        scheduleTitle
      };
    }

    const cleanTokens = qLower.split(/\s+/).filter(w => w.length >= 2);
    const matched = RAG_CHUNKS_DB.filter(c => {
      const text = (c.content + ' ' + c.reference + ' ' + c.sourceTitle).toLowerCase();
      return cleanTokens.some(w => text.includes(w));
    });

    if (matched.length > 0) {
      const primary = matched[0];
      const others = matched.slice(1, 3);
      let text = `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ। আপনার প্রশ্নের প্রেক্ষিতে নির্ভরযোগ্য দলিল ও বিবরণ:\n\n📖 **মূল বিষয় (${primary.sourceTitle}):**\n${primary.content}\n\n📌 **সূত্র:** ${primary.reference} (${primary.authenticityGrade})\n\n`;
      if (others.length > 0) {
        text += `✨ **পরিপূরক তথ্য ও আমল:**\n` + others.map(o => `• **${o.sourceTitle}:** ${o.content.split('\n')[0]} (${o.reference})`).join('\n\n') + '\n\n';
      }
      text += `💡 **আমল ও নির্দেশনা:** সহীহ সুন্নাহ মোতাবেক খাঁটি অন্তরে আমল পরিচালনা করুন।`;
      return {
        reply: text,
        sources: matched.slice(0, 3).map(m => `${m.sourceTitle} (${m.reference})`)
      };
    }

    return {
      reply: 'আসসালামু আলাইকুম। আপনার প্রশ্নের বিষয়ে পবিত্র কুরআন ও সহীহ হাদিসের আলোকে সর্বদা খাঁটি ঈমান, তাকওয়া ও সুন্নাতের অনুসরণে জীবন পরিচালনার নির্দেশ দেওয়া হয়েছে। পাঁচ ওয়াক্ত সালাত, জিকির, ৯৯ নামের পরীক্ষিত আমল বা যে কোনো ইসলামিক শিডিউল তৈরির জন্য জিজ্ঞাসা করুন।',
      sources: ['কুরআন ও সহীহ সুন্নাহ']
    };
  };

  const handleApplySchedule = (tasks: AiScheduleTask[], scheduleTitle?: string, msgId?: string) => {
    try {
      const activeProfile = careRoutineService.getActiveProfile();
      let addedCount = 0;

      tasks.forEach((task, idx) => {
        const routineTask: RoutineTask = {
          id: `ai-sched-${Date.now()}-${idx}`,
          profileId: activeProfile.id,
          title: task.title,
          category: task.category,
          priority: task.priority || 'important',
          isMustDo: task.priority === 'critical',
          isFavorite: false,
          scheduledTime: task.time,
          status: 'pending',
          durationMinutes: task.durationMinutes || 20,
          notes: task.notes || (scheduleTitle ? `${scheduleTitle} থেকে সংযোজিত` : 'ইসলামিক লাইফ AI শিডিউল'),
          alarmEnabled: true,
          alarmTone: task.category === 'prayer' ? 'adhan' : 'bengali_voice',
          repeatDaily: true,
          voiceAnnouncementText: `${task.title}-এর সময় হয়েছে।`
        };
        careRoutineService.addTask(routineTask);
        addedCount++;
      });

      // Dispatch event to refresh visualizers and timelines
      window.dispatchEvent(new CustomEvent('care-tasks-updated', { detail: { count: addedCount } }));
      
      const key = msgId || scheduleTitle || 'default';
      setAppliedSchedules(prev => ({ ...prev, [key]: true }));
      setToastMessage(`✓ আলহামদুলিল্লাহ! ${toBengaliDigits(addedCount)}টি আমল আপনার ২৪ ঘণ্টা রুটিন ও অ্যালার্মে যুক্ত করা হয়েছে।`);
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.error('Failed to apply schedule to careRoutineService:', err);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      let data: any = null;
      if (response && response.ok && response.headers.get('content-type')?.includes('application/json')) {
        data = await response.json();
      }

      if (!data || !data.reply) {
        const fallback = getLocalRagFallback(query);
        data = {
          reply: data?.reply || fallback.reply,
          sources: data?.sources || fallback.sources,
          scheduleTasks: data?.scheduleTasks || fallback.scheduleTasks,
          scheduleTitle: data?.scheduleTitle || fallback.scheduleTitle
        };
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['কুরআন ও সহীহ হাদিস'],
        scheduleTasks: data.scheduleTasks,
        scheduleTitle: data.scheduleTitle
      };

      if (data?.disclaimer) {
        aiMsg.text += `\n\n_${data.disclaimer}_`;
      }

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Network chat fetch error, using local verified knowledge:', err);
      const fallback = getLocalRagFallback(query);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: fallback.sources,
        scheduleTasks: fallback.scheduleTasks,
        scheduleTitle: fallback.scheduleTitle
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'prayer':
        return 'bg-emerald-800/90 text-emerald-200 border-emerald-600/50';
      case 'amal':
        return 'bg-amber-900/80 text-amber-200 border-amber-600/50';
      case 'feeding':
        return 'bg-blue-900/80 text-blue-200 border-blue-600/50';
      case 'personal_care':
        return 'bg-purple-900/80 text-purple-200 border-purple-600/50';
      default:
        return 'bg-teal-900/80 text-teal-200 border-teal-600/50';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'prayer': return 'নামাজ';
      case 'amal': return 'আমল ও জিকির';
      case 'feeding': return 'খাবার ও পানি';
      case 'personal_care': return 'বিশ্রাম ও পরিচর্যা';
      case 'health_check': return 'স্বাস্থ্যবিধি';
      default: return 'অন্যান্য';
    }
  };

  const formatScheduleTime = (timeStr: string) => {
    try {
      const [hStr, mStr] = timeStr.split(':');
      const h = parseInt(hStr, 10);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${toBengaliDigits(h12)}:${toBengaliDigits(mStr)} ${suffix}`;
    } catch {
      return toBengaliDigits(timeStr);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-emerald-700/60 relative overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-emerald-800 text-amber-200 font-semibold shadow-2xl border border-emerald-500 text-xs sm:text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-700/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Bot className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-50">
                {t.aiTitle || 'ইসলামিক লাইফ AI জিজ্ঞাসা ও শিডিউলার'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-bold">
                PRO 24/7
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium">
              সহীহ দলিল, ৯৯ নামের পরীক্ষিত আমল ও ইন্টারেক্টিভ ইসলামিক শিডিউল মেকার
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-800/90 text-amber-200 border border-emerald-600/50 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>সকল সেকশনের পূর্ণাঙ্গ জ্ঞান ভাণ্ডার</span>
          </span>
        </div>
      </div>

      {/* Preset Suggested Questions & Schedule Triggers */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-amber-300/90 mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>দ্রুত জানতে বা শিডিউল তৈরি করতে ক্লিক করুন:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sendMessage('আমার জন্য একটি পূর্ণাঙ্গ ২৪ ঘণ্টা ইসলামিক আমল ও সালাত শিডিউল তৈরি করে দাও')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-800/60 hover:from-amber-500/30 text-xs font-semibold text-amber-200 border border-amber-400/40 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>📅 পূর্ণাঙ্গ ২৪ ঘণ্টা ইসলামিক শিডিউল তৈরি করুন</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sendMessage('তাহাজ্জুদ ও নফল সালাতের পড়ার নিয়ম, ফযীলত ও একটি বিশেষ রুটিন বানিয়ে দাও')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>📿 তাহাজ্জুদ ও নফল সালাতের রুটিন</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sendMessage('আল্লাহর ৯৯ নামের মধ্যে আর-রহমান ও আর-রহীম নামের হাদিস বর্ণিত ফযীলত এবং বাস্তব পরীক্ষিত আমল কি?')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>🌟 ৯৯ নামের পরীক্ষিত ফযীলত ও আমল</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sendMessage('ঋণ ও চরম দুশ্চিন্তা মুক্তির জন্য সহীহ হাদিস ও পরীক্ষিত আমল বিস্তারিত বলুন')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>🤲 ঋণ ও দুশ্চিন্তা মুক্তির আমল</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sendMessage('পাঁচ ওয়াক্ত ফরজ সালাতের ওয়াক্ত, রাকাত সংখ্যা ও জামায়াতে আদায়ের গুরুত্ব বলুন')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>🕌 ৫ ওয়াক্ত ফরজ সালাতের হিসাব</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => sendMessage('জুমার দিনের সুন্নত ও বিশেষ আমলসমূহ কি কি?')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>📖 জুমার দিনের সুন্নত ও আমল</span>
          </motion.button>
        </div>
      </div>

      {/* Message History Area */}
      <div className="bg-emerald-950/90 rounded-2xl p-3 sm:p-4 border border-emerald-800/60 h-96 sm:h-[420px] overflow-y-auto space-y-4 mb-4 custom-scrollbar">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`flex items-start gap-2.5 sm:gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'bg-emerald-700 text-amber-300 border border-emerald-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[92%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-400 text-emerald-950 rounded-tr-none font-medium'
                  : 'bg-emerald-900/90 text-emerald-50 rounded-tl-none border border-emerald-700/60'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed break-words font-normal">
                {msg.text}
              </div>

              {/* GENERATED SCHEDULE CARD (Interactive Schedule Display & 1-Click Save) */}
              {msg.scheduleTasks && msg.scheduleTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="mt-4 p-3.5 sm:p-4 rounded-xl bg-emerald-950/95 border border-amber-400/40 shadow-xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-800/70">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-amber-200 text-xs sm:text-sm">
                          {msg.scheduleTitle || 'প্রস্তাবিত পূর্ণাঙ্গ ইসলামিক শিডিউল'}
                        </h4>
                        <p className="text-[11px] text-emerald-300/80">
                          মোট {toBengaliDigits(msg.scheduleTasks.length)}টি সুবিন্যস্ত আমল ও সালাতের ওয়াক্ত
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-800 text-amber-300 border border-emerald-600 font-semibold self-start sm:self-center">
                      ২৪ ঘণ্টা রুটিন ফ্রেন্ডলি
                    </span>
                  </div>

                  {/* Tasks Timeline Table */}
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {msg.scheduleTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="p-2 sm:p-2.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-800/60 flex items-start justify-between gap-2 transition"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60 whitespace-nowrap shrink-0">
                            {formatScheduleTime(task.time)}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-semibold text-emerald-50">
                                {task.title}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${getCategoryBadgeClass(task.category)}`}>
                                {getCategoryLabel(task.category)}
                              </span>
                            </div>
                            {task.notes && (
                              <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-relaxed break-words">
                                {task.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {task.durationMinutes && (
                          <span className="text-[10px] text-emerald-300/70 font-mono whitespace-nowrap shrink-0 mt-0.5">
                            {toBengaliDigits(task.durationMinutes)} মি.
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons to Save/Apply Schedule */}
                  <div className="pt-2 border-t border-emerald-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    {appliedSchedules[msg.id] || appliedSchedules[msg.scheduleTitle || 'default'] ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-900/80 px-3 py-2 rounded-xl border border-emerald-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>✓ আলহামদুলিল্লাহ! এই শিডিউলটি আপনার ২৪ ঘণ্টা রুটিন ও অ্যালার্মে সক্রিয় আছে।</span>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleApplySchedule(msg.scheduleTasks!, msg.scheduleTitle, msg.id)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                      >
                        <ListPlus className="w-4 h-4 text-emerald-950" />
                        <span>📥 এই শিডিউলটি আমার ডেইলি কেয়ার ও রুটিনে যুক্ত করুন</span>
                      </motion.button>
                    )}

                    <div className="text-[11px] text-emerald-300/80 flex items-center justify-center gap-1 self-center">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>অ্যালার্ম ও রিমাইন্ডার স্বয়ংক্রিয় সেট হবে</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Citations and Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-1.5 text-[10px] text-amber-200/90 leading-relaxed break-words">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>
                    <strong className="text-amber-300">নির্ভরযোগ্য সূত্র:</strong> {msg.sources.join(' | ')}
                  </span>
                </div>
              )}

              <div
                className={`text-[10px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-emerald-900/80' : 'text-emerald-300/60'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-xs text-amber-300 p-3 bg-emerald-900/90 rounded-2xl w-fit border border-emerald-700/60 shadow-lg"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce inline-block [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce inline-block [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce inline-block" />
            </div>
            <span className="font-medium text-emerald-100">
              ইসলামিক লাইফ AI কুরআন, সহীহ হাদিস ও অ্যাপের সকল সেকশন পর্যালোচনা করে উত্তর সাজাচ্ছে...
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="যেকোনো ফরজ, নফল, ৯৯ নামের পরীক্ষিত আমল বা 'শিডিউল বানিয়ে দাও' লিখুন..."
          className="flex-1 bg-emerald-950/90 text-white placeholder-emerald-400/60 px-4 py-3 rounded-xl border border-emerald-700/60 focus:outline-none focus:border-amber-400/80 text-xs sm:text-sm transition shadow-inner"
        />
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-emerald-950 font-bold transition flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden xs:inline text-xs">{t.askAi || 'জিজ্ঞাসা'}</span>
        </motion.button>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-emerald-300/70 text-center sm:text-left">
        <div className="flex items-center gap-1 mx-auto sm:mx-0">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>কুরআন, সিহাহ সিত্তাহ ও সালাফে সালেহীনের বিশুদ্ধ দলিলের ভিত্তিতে সাজানো।</span>
        </div>
        <div className="flex items-center gap-1 mx-auto sm:mx-0">
          <HeartHandshake className="w-3 h-3 text-amber-300" />
          <span>ব্যক্তিগত জটিল ফতোয়ার ক্ষেত্রে যোগ্য মুফতির শরণাপন্ন হোন।</span>
        </div>
      </div>

    </div>
  );
};
