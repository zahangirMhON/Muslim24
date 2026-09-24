import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Plus, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  FileText, 
  Lock, 
  AlertTriangle,
  Megaphone,
  Globe,
  Tag,
  Link as LinkIcon,
  Users,
  Search,
  Eye,
  ExternalLink,
  Sparkles,
  Save,
  CheckCircle2,
  Sliders,
  Award
} from 'lucide-react';
import { RAG_SOURCES_DB } from '../services/ragEngine';
import { 
  SitePromotion, 
  getActiveSitePromotion, 
  saveSitePromotion, 
  getAllUsersForAdmin, 
  AdminUserInfo,
  auth
} from '../lib/firebase';
import { toBengaliDigits } from '../utils/bengaliUtils';

interface Source {
  id: string;
  title: string;
  author: string;
  category: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'DISABLED';
  verifiedBy?: string;
  chunkCount: number;
  license: string;
  createdAt: string;
}

export const AdminRagPortal: React.FC = () => {
  // Admin Navigation Tabs
  const [adminTab, setAdminTab] = useState<'promo' | 'users' | 'rag' | 'access'>('promo');

  // -------------------------------------------------------------
  // 1. Website Promotion & Ads State
  // -------------------------------------------------------------
  const [promoData, setPromoData] = useState<SitePromotion>({
    websiteName: 'মাকতাবাতুল ইসলাম ডিজিটাল লাইব্রেরি',
    websiteUrl: 'https://quran.com',
    tag: 'স্পন্সরড পার্টনার',
    title: 'সহজ কুরআন ও সহীহ হাদিস পাঠের সমৃদ্ধ অনলাইন প্ল্যাটফর্ম',
    description: 'বিশুদ্ধ তাফসীর, বাংলা অনুবাদ ও সকল ভাষার অডিও তিলাওয়াত পড়ার জন্য আমাদের অফিসিয়াল পার্টনার ওয়েবসাইট ভিজিট করুন।',
    ctaText: 'ওয়েবসাইটে যান →',
    bannerTheme: 'gold',
    isActive: true,
    clickCount: 142,
    impressionCount: 1250
  });

  const [promoSaveStatus, setPromoSaveStatus] = useState<string | null>(null);
  const [isSavingPromo, setIsSavingPromo] = useState<boolean>(false);

  useEffect(() => {
    getActiveSitePromotion().then(data => {
      if (data) setPromoData(data);
    });
  }, []);

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPromo(true);
    try {
      await saveSitePromotion(promoData);
      setPromoSaveStatus('সফলভাবে হোমস্ক্রিন প্রমোশন ব্যানার আপডেট ও সংরক্ষণ করা হয়েছে ✓');
      setTimeout(() => setPromoSaveStatus(null), 4000);
    } catch (err) {
      setPromoSaveStatus('সংরক্ষণে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSavingPromo(false);
    }
  };

  // -------------------------------------------------------------
  // 2. Users Data & Analytics State
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState<AdminUserInfo[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const data = await getAllUsersForAdmin();
      setUsersList(data);
    } catch (e) {
      console.warn('Could not load users list:', e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = usersList.filter(u => {
    const q = userSearchQuery.toLowerCase();
    return (
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  // -------------------------------------------------------------
  // 3. RAG Knowledge Base Sources State
  // -------------------------------------------------------------
  const [sources, setSources] = useState<Source[]>(RAG_SOURCES_DB);
  const [loadingSources, setLoadingSources] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Hadith');

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/v1/admin/rag/sources');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.sources) {
          setSources(data.sources);
        }
      }
    } catch (e) {
      console.warn('Could not fetch sources over network, using local store:', e);
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleAction = async (id: string, action: 'VERIFY' | 'REJECT' | 'DISABLE' | 'REINDEX') => {
    try {
      await fetch(`/api/v1/admin/rag/sources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, verifiedBy: 'মুফতি আব্দুল্লাহ (যাচাইকারী আলেম)' })
      });
      fetchSources();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    try {
      await fetch('/api/v1/admin/rag/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          author: newAuthor,
          category: newCategory,
          license: 'Verified Islamic Data'
        })
      });
      setNewTitle('');
      setNewAuthor('');
      setShowAddModal(false);
      fetchSources();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border-2 border-amber-400/60 rounded-3xl p-4 sm:p-6 text-white shadow-2xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-lg shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-amber-300 tracking-wide">
                সেন্ট্রাল এডমিন ও ম্যানেজমেন্ট ড্যাশবোর্ড
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase shadow">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
              হোমস্ক্রিন প্রমোশন অ্যাডস, ইউজার অ্যানালিটিক্স এবং ইসলামিক সোর্স ভেরিফিকেশন
            </p>
          </div>
        </div>

        {/* Current Admin Email Badge */}
        <div className="bg-black/50 border border-amber-400/40 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-gray-300">এডমিন এক্সেস:</span>
          <span className="text-amber-300 font-mono font-bold">
            {auth.currentUser?.email || 'zahangir.mhn@gmail.com'}
          </span>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 border-b border-white/10">
        <button
          onClick={() => setAdminTab('promo')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            adminTab === 'promo'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
              : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>📢 ওয়েবসাইট প্রমোশন ও অ্যাডস</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            adminTab === 'users'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
              : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 ইউজার ডেটা ও অ্যানালিটিক্স</span>
        </button>

        <button
          onClick={() => setAdminTab('rag')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
            adminTab === 'rag'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
              : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>📚 RAG ইসলামিক সোর্স পোর্টাল</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: WEBSITE PROMOTION & ADS MANAGER (হোমস্ক্রিন ওয়েবসাইট প্রমোশন) */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'promo' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="bg-emerald-900/60 p-4 rounded-2xl border border-amber-400/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>হোমস্ক্রিনের শীর্ষে ওয়েবসাইট প্রমোশন ব্যানার কনফিগারেশন</span>
              </h3>
              <p className="text-xs text-emerald-100 mt-1">
                এখানে ওয়েবসাইটের লিংক, নাম, ট্যাগ এবং বর্ণনা লিখলে তা তাৎক্ষণিকভাবে অ্যাপ্লিকেশনের হোমস্ক্রিনের সবার উপরে ব্যানার আকারে দৃশ্যমান হবে।
              </p>
            </div>

            {/* Live Impression & Click Stats */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block">মোট ইমপ্রেশন</span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {toBengaliDigits(promoData.impressionCount || 0)} বার
                </span>
              </div>
              <div className="bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block">মোট ক্লিক</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {toBengaliDigits(promoData.clickCount || 0)} জন
                </span>
              </div>
            </div>
          </div>

          {/* Form and Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: Custom Input Fields */}
            <form onSubmit={handleSavePromotion} className="lg:col-span-7 bg-emerald-950/80 p-5 rounded-2xl border border-emerald-700/80 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Website Name */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>ওয়েবসাইটের নাম (Website Name):</span>
                  </label>
                  <input
                    type="text"
                    value={promoData.websiteName}
                    onChange={(e) => setPromoData({ ...promoData, websiteName: e.target.value })}
                    placeholder="যেমন: মাকতাবাতুল ইসলাম"
                    className="w-full bg-emerald-900/90 px-3.5 py-2.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                    required
                  />
                </div>

                {/* 2. Custom Tag / Badge */}
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>প্রমোশন ট্যাগ (Ad Tag / Badge):</span>
                  </label>
                  <input
                    type="text"
                    value={promoData.tag}
                    onChange={(e) => setPromoData({ ...promoData, tag: e.target.value })}
                    placeholder="যেমন: স্পন্সরড / অফিসিয়াল পার্টনার / বিশেষ অফার"
                    className="w-full bg-emerald-900/90 px-3.5 py-2.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
                    required
                  />
                </div>
              </div>

              {/* 3. Website URL / Link */}
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>ওয়েবসাইট লিংক (Website URL - কাস্টম লিংক):</span>
                </label>
                <input
                  type="url"
                  value={promoData.websiteUrl}
                  onChange={(e) => setPromoData({ ...promoData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full bg-emerald-900/90 px-3.5 py-2.5 rounded-xl border border-emerald-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {/* 4. Promotion Title */}
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                  বিজ্ঞাপন শিরোনাম (Headline / Title):
                </label>
                <input
                  type="text"
                  value={promoData.title}
                  onChange={(e) => setPromoData({ ...promoData, title: e.target.value })}
                  placeholder="যেমন: সহজ কুরআন ও হাদিস পাঠের সমৃদ্ধ অনলাইন প্ল্যাটফর্ম"
                  className="w-full bg-emerald-900/90 px-3.5 py-2.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>

              {/* 5. Promotion Description */}
              <div>
                <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                  বিজ্ঞাপন বিবরণ (Description):
                </label>
                <textarea
                  rows={2}
                  value={promoData.description}
                  onChange={(e) => setPromoData({ ...promoData, description: e.target.value })}
                  placeholder="ওয়েবসাইট সম্পর্কে আকর্ষণীয় ২-১ লাইনের বিবরণ..."
                  className="w-full bg-emerald-900/90 px-3.5 py-2 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              {/* 6. Button Text & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    বাটন টেক্সট (CTA Text):
                  </label>
                  <input
                    type="text"
                    value={promoData.ctaText || 'ওয়েবসাইটে যান →'}
                    onChange={(e) => setPromoData({ ...promoData, ctaText: e.target.value })}
                    placeholder="ওয়েবসাইটে যান →"
                    className="w-full bg-emerald-900/90 px-3.5 py-2.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-200 mb-1.5">
                    ব্যানার কালার থিম:
                  </label>
                  <select
                    value={promoData.bannerTheme || 'gold'}
                    onChange={(e) => setPromoData({ ...promoData, bannerTheme: e.target.value as any })}
                    className="w-full bg-emerald-900/90 px-3.5 py-2.5 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="gold">🥇 রয়েল গোল্ড (Royal Gold)</option>
                    <option value="emerald">🌿 ইসলামিক এমারেল্ড (Islamic Emerald)</option>
                    <option value="royal">🌌 ডিপ ইন্ডিগো (Deep Indigo)</option>
                    <option value="sunset">🌅 সানসেট অরেঞ্জ (Sunset Orange)</option>
                  </select>
                </div>
              </div>

              {/* 7. Active Toggle Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <span className="text-xs font-bold text-emerald-200 block">হোমস্ক্রিনে প্রদর্শন স্থিতি</span>
                  <span className="text-[11px] text-gray-400">চালু থাকলে হোমস্ক্রিনের উপরে ব্যানারটি দেখানো হবে</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPromoData({ ...promoData, isActive: !promoData.isActive })}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    promoData.isActive
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                      : 'bg-rose-950 text-rose-300 border border-rose-700'
                  }`}
                >
                  {promoData.isActive ? 'সক্রিয় (Active) ✓' : 'নিষ্ক্রিয় (Disabled)'}
                </button>
              </div>

              {/* Save Feedback */}
              {promoSaveStatus && (
                <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 font-bold animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{promoSaveStatus}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingPromo}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 cursor-pointer transition active:scale-[0.99]"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>{isSavingPromo ? 'সংরক্ষণ হচ্ছে...' : 'হোমস্ক্রিনের ব্যাকএন্ডে সংরক্ষণ ও প্রচার করুন ✓'}</span>
                </button>
              </div>
            </form>

            {/* Right 5 Cols: Live Preview Card */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>লাইভ প্রিভিউ (হোমস্ক্রিনে যেমন দেখাবে):</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-amber-300 font-mono">
                  Live Preview
                </span>
              </div>

              {/* Mock Home Screen Environment Frame */}
              <div className="bg-slate-950/90 p-3 rounded-2xl border-2 border-dashed border-emerald-700/80 space-y-2">
                <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider border-b border-white/5 pb-1">
                  📱 App Header &gt; Home Top Banner
                </div>

                {/* Banner Render */}
                <div className={`rounded-2xl border-2 p-3.5 shadow-xl transition-all ${
                  promoData.bannerTheme === 'emerald'
                    ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-emerald-500/60 text-white'
                    : promoData.bannerTheme === 'royal'
                    ? 'bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-indigo-400/60 text-white'
                    : promoData.bannerTheme === 'sunset'
                    ? 'bg-gradient-to-r from-rose-950 via-amber-950 to-slate-950 border-amber-500/60 text-white'
                    : 'bg-gradient-to-r from-amber-950/90 via-emerald-950 to-slate-950 border-amber-400/70 text-white'
                }`}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center shrink-0 shadow">
                      <Globe className="w-4 h-4 text-amber-300" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase shadow-sm">
                          {promoData.tag || 'স্পন্সরড'}
                        </span>
                        <span className="text-[11px] font-bold text-amber-300 truncate">
                          {promoData.websiteName || 'ওয়েবসাইটের নাম'}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-white leading-snug">
                        {promoData.title || 'বিজ্ঞাপন শিরোনাম'}
                      </h4>

                      <p className="text-[10px] text-gray-300 line-clamp-2 leading-relaxed">
                        {promoData.description || 'এখানে প্রমোশন বর্ণনা থাকবে।'}
                      </p>

                      <div className="pt-1.5 flex justify-end">
                        <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black inline-flex items-center gap-1 shadow">
                          <span>{promoData.ctaText || 'ওয়েবসাইটে যান'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 text-center pt-1">
                  {promoData.isActive ? '✅ এই ব্যানারটি বর্তমানে হোমস্ক্রিনের শীর্ষে লাইভ আছে' : '⚠️ ব্যানারটি বর্তমানে নিষ্ক্রিয় রাখা হয়েছে'}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: USER DATA & ANALYTICS DASHBOARD (ইউজার এর ডেটা তথ্য) */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'users' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* User Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-900/60 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-gray-300 block">মোট নিবন্ধিত ইউজার</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {toBengaliDigits(usersList.length)} জন
              </span>
            </div>

            <div className="bg-emerald-900/60 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-gray-300 block">সক্রিয় স্ট্রিক মুমিন</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {toBengaliDigits(usersList.filter(u => (u.streakDays || 0) > 0).length)} জন
              </span>
            </div>

            <div className="bg-emerald-900/60 p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-gray-300 block">এডমিন প্রিভিলেজ ইউজার</span>
              <span className="text-2xl font-black text-teal-300 font-mono">
                {toBengaliDigits(usersList.filter(u => u.isAdmin).length || 1)} জন
              </span>
            </div>
          </div>

          {/* User Search & Table Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="ইউজার নাম, ইমেইল বা আইডি দিয়ে খুঁজুন..."
                className="w-full bg-emerald-900/90 pl-9 pr-3.5 py-2 rounded-xl border border-emerald-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={fetchUsers}
              disabled={isLoadingUsers}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-emerald-600"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isLoadingUsers ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ ডেটা</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-emerald-800/80 bg-black/40">
            <table className="w-full text-left text-xs text-emerald-100 border-collapse">
              <thead>
                <tr className="bg-emerald-900/90 text-amber-300 border-b border-emerald-800">
                  <th className="p-3">ইউজার প্রোফাইল</th>
                  <th className="p-3">ইমেইল অ্যাড্রেস</th>
                  <th className="p-3">রোল / পারমিশন</th>
                  <th className="p-3">আমল স্ট্রিক</th>
                  <th className="p-3 text-right">শেষ সক্রিয়</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      কোনো ইউজার পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-emerald-800/40 hover:bg-emerald-900/40 transition">
                      <td className="p-3 font-semibold text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-amber-300 overflow-hidden shrink-0">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            user.displayName?.[0] || 'ইউ'
                          )}
                        </div>
                        <div>
                          <span className="block font-bold text-emerald-100">{user.displayName || 'সম্মানিত ইউজার'}</span>
                          <span className="text-[10px] font-mono text-gray-400">{user.id.slice(0, 10)}...</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-gray-300 text-[11px]">{user.email || '—'}</td>
                      <td className="p-3">
                        {user.isAdmin || user.email === 'zahangir.mhn@gmail.com' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-sm">
                            এডমিন (ADMIN)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700 text-[10px]">
                            ইউজার (User)
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-amber-300">
                          {toBengaliDigits(user.streakDays || 1)} দিন 🔥
                        </span>
                      </td>
                      <td className="p-3 text-right text-gray-400 text-[11px] font-mono">
                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('bn-BD') : 'আজ'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: RAG ISLAMIC SOURCES & ALEEM AUDIT (নলেজ বেস ও সোর্স) */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'rag' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                ইসলামিক লাইফ AI-এর সহীহ সোর্স ম্যানেজমেন্ট ও আলেম ভেরিফিকেশন
              </h3>
              <p className="text-xs text-gray-300">
                আর্টিফিশিয়াল ইন্টেলিজেন্স যাতে নির্ভরযোগ্য কিতাব ছাড়া ভুল মাসআলা না দেয় তা এখান থেকে নিরীক্ষা করা হয়।
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কিতাব / সোর্স যুক্ত করুন</span>
            </button>
          </div>

          {/* RAG Source Table */}
          <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-emerald-800/80 bg-black/40">
            <table className="w-full text-left text-xs text-emerald-100 border-collapse">
              <thead>
                <tr className="bg-emerald-900/90 text-amber-300 border-b border-emerald-800">
                  <th className="p-3">গ্রন্থ / উৎস নাম</th>
                  <th className="p-3">লেখক / সম্পাদক</th>
                  <th className="p-3">ক্যাটাগরি</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3">ভেক্টর চাংক</th>
                  <th className="p-3 text-right">আলেম মডারেশন</th>
                </tr>
              </thead>
              <tbody>
                {sources.map(src => (
                  <tr key={src.id} className="border-b border-emerald-800/60 hover:bg-emerald-900/40 transition">
                    <td className="p-3 font-semibold text-emerald-50 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{src.title}</span>
                    </td>
                    <td className="p-3 text-emerald-200">{src.author}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-800/80 text-[10px] font-bold text-amber-200">
                        {src.category}
                      </span>
                    </td>
                    <td className="p-3">
                      {src.verificationStatus === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> যাচাইকৃত (VERIFIED)
                        </span>
                      )}
                      {src.verificationStatus === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> পেন্ডিং (PENDING)
                        </span>
                      )}
                      {src.verificationStatus === 'DISABLED' && (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                          <Lock className="w-3.5 h-3.5" /> নিষ্ক্রিয় (DISABLED)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-amber-300">{src.chunkCount} chunks</td>
                    <td className="p-3 text-right space-x-1.5">
                      {src.verificationStatus === 'PENDING' && (
                        <button
                          onClick={() => handleAction(src.id, 'VERIFY')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                        >
                          অনুমোদন
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(src.id, 'REINDEX')}
                        className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[10px] border border-amber-400/40 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> রি-ইনডেক্স
                      </button>
                      {src.verificationStatus !== 'DISABLED' && (
                        <button
                          onClick={() => handleAction(src.id, 'DISABLE')}
                          className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 hover:bg-rose-900 font-bold text-[10px] border border-rose-800 cursor-pointer"
                        >
                          বন্ধ করুন
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Source Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
              <div className="bg-emerald-950 border border-emerald-700 text-white rounded-2xl w-full max-w-md p-5 shadow-2xl">
                <h4 className="font-bold text-amber-300 text-sm mb-3">নতুন ইসলামিক গ্রন্থ বা সোর্স যুক্ত করুন</h4>
                <form onSubmit={handleAddSource} className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 font-bold text-emerald-200">গ্রন্থের নাম</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="যেমন: সুনানে তিরমিযী"
                      className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-emerald-200">লেখক / অনুবাদক</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      placeholder="যেমন: ইমাম তিরমিযী (র.)"
                      className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold text-emerald-200">ক্যাটাগরি</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-emerald-900 p-2.5 rounded-xl border border-emerald-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Quran">কুরআন তাফসীর</option>
                      <option value="Hadith">সহীহ হাদিস</option>
                      <option value="Dua">দোয়া ও জিকির</option>
                      <option value="Fiqh">ফিকহ ও মাসআলা</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-300 font-bold cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold shadow-md cursor-pointer"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
