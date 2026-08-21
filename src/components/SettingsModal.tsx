import React from 'react';
import { X, MapPin, Sliders, Zap, Check, HelpCircle } from 'lucide-react';
import { BDLocation, Language } from '../types';
import { BANGLADESH_LOCATIONS } from '../utils/bengaliUtils';
import { CALCULATION_METHODS } from '../utils/prayerTimes';
import { translations } from '../locales/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  selectedLocation: BDLocation;
  onSelectLocation: (loc: BDLocation) => void;
  selectedMethodId: string;
  onSelectMethod: (methodId: string) => void;
  dataSaver: boolean;
  onToggleDataSaver: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  selectedLocation,
  onSelectLocation,
  selectedMethodId,
  onSelectMethod,
  dataSaver,
  onToggleDataSaver
}) => {
  if (!isOpen) return null;

  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-emerald-950 border border-emerald-700/80 text-white rounded-2xl w-full max-w-lg p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold text-emerald-50">
              {t.settings}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 py-4 overflow-y-auto custom-scrollbar flex-1 pr-1 text-xs sm:text-sm">
          
          {/* Location Picker */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>বাংলাদেশ জেলা ও স্থান নির্বাচন</span>
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar border border-emerald-800 p-2 rounded-xl bg-emerald-900/60">
              {BANGLADESH_LOCATIONS.map((loc) => {
                const isSelected = loc.district === selectedLocation.district;
                return (
                  <button
                    key={loc.district}
                    onClick={() => onSelectLocation(loc)}
                    className={`p-2 rounded-lg text-left font-medium transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-400 text-emerald-950 font-bold shadow-md'
                        : 'bg-emerald-950/60 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    <span>{loc.districtBn} ({loc.divisionBn})</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calculation Method */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              {t.calculationMethod}
            </label>
            <div className="space-y-2">
              {CALCULATION_METHODS.map(m => {
                const isSelected = m.id === selectedMethodId;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectMethod(m.id)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-emerald-900/40 border-emerald-800 text-emerald-200 hover:bg-emerald-800'
                    }`}
                  >
                    <span>{m.nameBn}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Saver Mode Toggle */}
          <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-emerald-100">{t.dataSaver}</div>
                <div className="text-[11px] text-emerald-300/80">মোবাইল নেটওয়ার্ক ব্যান্ডউইথ সাশ্রয়ী মোড</div>
              </div>
            </div>
            <button
              onClick={onToggleDataSaver}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                dataSaver ? 'bg-amber-400' : 'bg-emerald-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-emerald-950 absolute top-0.5 transition-transform ${
                  dataSaver ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-emerald-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition shadow-lg"
          >
            সংরক্ষণ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
