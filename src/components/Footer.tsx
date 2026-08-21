import React, { useState } from 'react';
import { ShieldCheck, FileText, HelpCircle, Heart, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'help' | null>(null);

  return (
    <footer className="bg-emerald-950 text-emerald-300 border-t border-emerald-800/60 py-8 px-4 sm:px-6 lg:px-8 mt-12 pb-28">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="font-bold text-emerald-100 text-sm">ইসলামিক লাইফ ২৪/৭</span>
          <span className="text-emerald-400/60">|</span>
          <span className="text-emerald-300/80">বাংলাদেশ সংস্করণ</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-amber-300 transition flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.privacyPolicy}</span>
          </button>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-amber-300 transition flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.termsOfService}</span>
          </button>
          <button
            onClick={() => setActiveModal('help')}
            className="hover:text-amber-300 transition flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.helpCenter}</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-emerald-400/80 text-[11px] text-center md:text-right">
          {t.copyright}
        </div>

      </div>

      {/* Policy Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-emerald-950 border border-emerald-700 text-white rounded-2xl w-full max-w-lg p-5 shadow-2xl overflow-y-auto max-h-[80vh] custom-scrollbar text-xs leading-relaxed">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800 mb-3">
              <h4 className="font-bold text-amber-300 text-sm">
                {activeModal === 'privacy' && 'গোপনীয়তা নীতি (Privacy Policy)'}
                {activeModal === 'terms' && 'ব্যবহারের শর্তাবলী (Terms of Service)'}
                {activeModal === 'help' && 'সাহায্য কেন্দ্র (Help Center)'}
              </h4>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded bg-emerald-900 text-emerald-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeModal === 'privacy' && (
              <div className="space-y-2 text-emerald-200">
                <p>
                  ইসলামিক লাইফ ২৪/৭ ব্যবহারকারীদের ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা রক্ষা করে। অ্যাপটি আপনার অবস্থান সম্পর্কিত কোনো ব্যক্তিগত ডাটা সার্ভারে সংরক্ষণ করে না।
                </p>
                <p>
                  স্থানভিত্তিক নামাজের সঠিক সময় নির্ধারণের সুবিধার্থে ডিভাইস বা ম্যানুয়াল নির্বাচন ব্যবহার করা হয় যা সম্পুর্ণ নিরাপদ।
                </p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-2 text-emerald-200">
                <p>
                  এই অ্যাপটি মুসলিম উম্মাহর দৈনন্দিন এবাদত ও সহীহ জ্ঞানার্জনের সুবিধার জন্য প্রস্তুত করা হয়েছে।
                </p>
                <p>
                  এখানে প্রদানকৃত নামাজের সময়সূচি এবং ইসলামী বিষয়াবলী সহীহ হাদিস ও স্থানীয় ইসলামিক ফাউন্ডেশনের নীতিমালার সাথে সংগতিপূর্ণ।
                </p>
              </div>
            )}

            {activeModal === 'help' && (
              <div className="space-y-2 text-emerald-200">
                <p>
                  আপনার কোনো জিজ্ঞাসা বা পরামর্শ থাকলে আমাদের সাপোর্ট টিমকে জানাতে পারেন।
                </p>
                <p className="font-semibold text-amber-300">
                  ইমেইল: support@islamiclife247.bd
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
