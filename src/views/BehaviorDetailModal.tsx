import React from 'react';
import { Behavior } from '../types';
import { AudioPlayer } from '../components/AudioPlayer';
import { useApp } from '../contexts/AppContext';
import {
  ArrowRight,
  Heart,
  Info,
  ListOrdered,
  Lightbulb,
} from 'lucide-react';

interface BehaviorDetailModalProps {
  behavior: Behavior | null;
  onClose: () => void;
}

const STEP_COLORS = ['#5B3D91', '#4DB6AC', '#F59E0B', '#FF6B6B'];

export function BehaviorDetailModal({ behavior, onClose }: BehaviorDetailModalProps) {
  const { isFavorite, toggleFavorite } = useApp();

  if (!behavior) return null;

  const isFav = isFavorite(behavior.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#2D253D]/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#F8F6FA] w-full sm:max-w-xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl overflow-y-auto shadow-2xl border border-[#EAE4F2] flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#EAE4F2] flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-[#5B3D91] hover:bg-[#5B3D91]/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>رجوع</span>
          </button>

          <h2 className="font-extrabold text-base sm:text-lg text-[#2D253D] truncate max-w-[200px] sm:max-w-xs text-center">
            {behavior.title}
          </h2>

          <button
            onClick={() => toggleFavorite(behavior.id)}
            className="p-2 rounded-full hover:bg-[#F8F6FA] text-[#B4A9C4] hover:text-[#FF6B6B] transition-colors cursor-pointer"
            title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFav ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-[#B4A9C4]'
              }`}
            />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Subtitle Banner */}
          <div
            className="rounded-2xl p-4 flex items-center gap-3 border-r-4"
            style={{
              backgroundColor: `${behavior.color}15`,
              borderRightColor: behavior.color,
            }}
          >
            <Info className="w-5 h-5 shrink-0" style={{ color: behavior.color }} />
            <p
              className="text-sm font-bold leading-relaxed"
              style={{ color: behavior.color }}
            >
              {behavior.subtitle}
            </p>
          </div>

          {/* Audio Player */}
          <AudioPlayer
            duration={behavior.audioDuration}
            script={behavior.audioScript}
            audioUrl={behavior.audioUrl}
          />

          {/* Steps Section */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <ListOrdered className="w-5 h-5 text-[#5B3D91]" />
              <h3 className="font-extrabold text-base text-[#2D253D]">
                خطوات التعامل الإيجابي خطوة بخطوة
              </h3>
            </div>

            <div className="space-y-4">
              {behavior.steps.map((step, idx) => {
                const stepColor = STEP_COLORS[idx % STEP_COLORS.length];
                const isLast = idx === behavior.steps.length - 1;

                return (
                  <div key={step.number} className="flex items-start gap-3.5 relative">
                    {/* Timeline line */}
                    {!isLast && (
                      <div
                        className="absolute right-4.5 top-9 bottom-0 w-0.5"
                        style={{ backgroundColor: `${stepColor}35` }}
                      />
                    )}

                    {/* Step Number Circle */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-poppins font-black text-white text-sm shrink-0 shadow-xs z-10"
                      style={{ backgroundColor: stepColor }}
                    >
                      {step.number}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-3">
                      <h4
                        className="font-bold text-sm leading-tight"
                        style={{ color: stepColor }}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#7A708A] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Encouraging Tip */}
          <div className="bg-[#5B3D91]/10 rounded-2xl p-4 border-r-4 border-[#5B3D91] flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-[#5B3D91] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm font-semibold text-[#5B3D91] leading-relaxed">
              💡 تذكري يا ماما أن التكرار والاتساق في تطبيق الاستراتيجية هما مفتاح النجاح. كل نوبة تمر بهدوء تقربك خطوة نحو سلوك متزن لطفلك!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
