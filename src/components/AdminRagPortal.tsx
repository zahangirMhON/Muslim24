import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, Plus, CheckCircle, XCircle, RefreshCw, FileText, Lock, AlertTriangle } from 'lucide-react';
import { RAG_SOURCES_DB } from '../services/ragEngine';

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
  const [sources, setSources] = useState<Source[]>(RAG_SOURCES_DB);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Hadith');

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
      setLoading(false);
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
    <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 border border-emerald-700/80 rounded-2xl p-5 text-white shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Database className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-50">
              RAG নলেজ বেস ও আলেম ভেরিফিকেশন প্যানেল (Admin Portal)
            </h3>
            <p className="text-xs text-emerald-300/80">
              ইসলামিক লাইফ AI-এর সহীহ সোর্স ম্যানেজমেন্ট, রি-ইনডেক্সিং এবং সাইটেশন অডিট
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সোর্স যুক্ত করুন</span>
        </button>
      </div>

      {/* RAG Source Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-emerald-100 border-collapse">
          <thead>
            <tr className="bg-emerald-900/80 text-amber-300 border-b border-emerald-800">
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
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      অনুমোদন করুন
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(src.id, 'REINDEX')}
                    className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[10px] border border-amber-400/40 inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> রি-ইনডেক্স
                  </button>
                  {src.verificationStatus !== 'DISABLED' && (
                    <button
                      onClick={() => handleAction(src.id, 'DISABLE')}
                      className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 hover:bg-rose-900 font-bold text-[10px] border border-rose-800"
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
                  className="px-4 py-2 rounded-xl bg-emerald-900 text-emerald-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-bold shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
