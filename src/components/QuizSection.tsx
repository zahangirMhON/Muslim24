import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language, QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/islamicData';
import { toBengaliDigits } from '../utils/bengaliUtils';
import { translations } from '../locales/translations';

interface QuizSectionProps {
  lang: Language;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing after selection
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === currentQ.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-5 shadow-xl border border-emerald-700/60 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-emerald-700/40">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <HelpCircle className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-emerald-50">
              {t.quizTitle}
            </h3>
            <p className="text-xs text-emerald-200/90 font-medium">
              {t.quizSubtitle}
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="bg-emerald-950/80 px-3.5 py-1.5 rounded-xl border border-amber-400/40 flex items-center gap-2 text-xs font-bold text-amber-300">
          <Award className="w-4 h-4 text-amber-300" />
          <span>{t.score}: {toBengaliDigits(score)} / {toBengaliDigits(QUIZ_QUESTIONS.length)}</span>
        </div>
      </div>

      {!quizCompleted ? (
        <div className="bg-emerald-950/80 p-5 rounded-2xl border border-emerald-800/60 shadow-inner">
          
          {/* Question Meta */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-800/80 text-amber-200 border border-emerald-600/50">
              {currentQ.categoryBn}
            </span>
            <span className="text-xs font-medium text-emerald-300">
              প্রশ্ন {toBengaliDigits(currentIndex + 1)} / {toBengaliDigits(QUIZ_QUESTIONS.length)}
            </span>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-bold text-emerald-50 mb-5 leading-relaxed">
            {currentQ.questionBn}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {currentQ.optionsBn.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let btnStyle = 'bg-emerald-900/60 border-emerald-700/50 hover:bg-emerald-800 text-emerald-100';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/30 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/30 border-rose-400 text-rose-200 ring-2 ring-rose-400/50';
                } else {
                  btnStyle = 'bg-emerald-950/40 border-emerald-800/40 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-2 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption !== null && (
                    <>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Card */}
          {showExplanation && (
            <div className="bg-emerald-900/90 p-4 rounded-xl border border-amber-400/40 mb-4 animate-fade-in text-xs sm:text-sm leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>{t.seeExplanation}</span>
              </div>
              <p className="text-emerald-100 mb-2">
                {currentQ.explanationBn}
              </p>
              <div className="text-[11px] font-semibold text-amber-200/90 pt-2 border-t border-emerald-800">
                সূত্র: {currentQ.sahihReferenceBn}
              </div>
            </div>
          )}

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg"
              >
                <span>{t.nextQuestion}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Completion Screen */
        <div className="bg-emerald-950/80 p-6 rounded-2xl border border-amber-400/40 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-3 border border-amber-400/50">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-emerald-50 mb-1">
            {t.quizCompleted}
          </h4>
          <p className="text-sm text-amber-300 font-semibold mb-4">
            আপনার অর্জিত স্কোর: {toBengaliDigits(score)} / {toBengaliDigits(QUIZ_QUESTIONS.length)}
          </p>

          <button
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>পুনরায় কুইজ খেলুন</span>
          </button>
        </div>
      )}

    </div>
  );
};
