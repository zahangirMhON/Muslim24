import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { translations } from '../locales/translations';
import { RAG_CHUNKS_DB } from '../services/ragEngine';

interface IslamicAiChatProps {
  lang: Language;
}

export const IslamicAiChat: React.FC<IslamicAiChatProps> = ({ lang }) => {
  const t = translations[lang];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি **ইসলামিক লাইফ AI**। পবিত্র কুরআন ও সহীহ হাদিসের বিশুদ্ধ সূত্রের আলোকে আপনার যেকোনো ইসলামিক প্রশ্নের সঠিক তথ্য জানতে এখানে জিজ্ঞাসা করুন। (বাংলা, Banglish বা ইংরেজি উভয়ই সমর্থিত)।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['কুরআনুল কারীম', 'সহীহ বুখারী', 'সহীহ মুসলিম']
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getLocalRagFallback = (query: string): { reply: string; sources: string[] } => {
    const qLower = query.toLowerCase();
    const matched = RAG_CHUNKS_DB.filter(c => {
      const text = (c.content + ' ' + c.reference + ' ' + c.sourceTitle).toLowerCase();
      const words = qLower.split(/\s+/).filter(w => w.length > 2);
      return words.some(w => text.includes(w));
    });

    if (matched.length > 0) {
      const primary = matched[0];
      return {
        reply: `আসসালামু আলাইকুম। আপনার প্রশ্নের প্রেক্ষিতে সহীহ দলিল:\n\n"${primary.content}"\n\n📌 বিধান ও শিক্ষা: কুরআন ও সহীহ সুন্নাহ মোতাবেক আমল করুন।`,
        sources: matched.map(m => `${m.sourceTitle} (${m.reference})`)
      };
    }

    return {
      reply: 'আসসালামু আলাইকুম। আপনার প্রশ্নের জন্য সহীহ কুরআন ও হাদিসের নির্ভরযোগ্য রেফারেন্স যাচাই করুন। নামাজের ওয়াক্ত, জিকির, সূরা ও আমলের জন্য ইসলামিক লাইফ ২৪/৭-এর সংশ্লিষ্ট সেকশনগুলো ব্যবহার করতে পারেন।',
      sources: ['কুরআন ও সহীহ সুন্নাহ']
    };
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
          sources: data?.sources || fallback.sources
        };
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['কুরআন ও সহীহ হাদিস']
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
        sources: fallback.sources
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-5 shadow-xl border border-emerald-700/60 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-700/40">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-50">
              {t.aiTitle}
            </h3>
            <p className="text-xs text-emerald-200/90 font-medium">
              {t.aiSubtitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-800/80 text-amber-200 border border-emerald-600/50 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>সহীহ তথ্যভিত্তিক AI</span>
        </span>
      </div>

      {/* Preset Suggested Questions */}
      <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar mb-3">
        <button
          onClick={() => sendMessage('আজকের ফজিলতপূর্ণ জিকির কোনটি?')}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition"
        >
          💡 {t.presetQ1}
        </button>
        <button
          onClick={() => sendMessage('তাহাজ্জুদ নামাজের সময় ও পড়ার নিয়ম বিস্তারিত বলুন')}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition"
        >
          💡 {t.presetQ2}
        </button>
        <button
          onClick={() => sendMessage('সফর অবস্থায় কসর নামাজের সহজ বিধান কি?')}
          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-xs text-amber-200 border border-emerald-700/60 whitespace-nowrap transition"
        >
          💡 {t.presetQ3}
        </button>
      </div>

      {/* Message History Area */}
      <div className="bg-emerald-950/80 rounded-2xl p-4 border border-emerald-800/60 h-80 overflow-y-auto space-y-3.5 mb-4 custom-scrollbar">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'bg-emerald-700 text-amber-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-400 text-emerald-950 rounded-tr-none font-medium'
                  : 'bg-emerald-900/90 text-emerald-50 rounded-tl-none border border-emerald-700/60'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-1.5 text-[10px] text-amber-200/90">
                  <BookOpen className="w-3 h-3 text-amber-300" />
                  <span>সূত্র: {msg.sources.join(', ')}</span>
                </div>
              )}

              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-emerald-900/80' : 'text-emerald-300/60'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-amber-300 p-2 bg-emerald-900/60 rounded-xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>ইসলামিক লাইফ AI সহীহ রেফারেন্স পর্যালোচনা করছে...</span>
          </div>
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
          placeholder={t.aiPlaceholder}
          className="flex-1 bg-emerald-950/90 text-white placeholder-emerald-400/60 px-4 py-3 rounded-xl border border-emerald-700/60 focus:outline-none focus:border-amber-400/80 text-xs sm:text-sm transition"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-emerald-950 font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden xs:inline text-xs">{t.askAi}</span>
        </button>
      </form>

      <p className="text-[10px] text-emerald-300/70 mt-2 text-center">
        {t.aiDisclaimer}
      </p>

    </div>
  );
};
