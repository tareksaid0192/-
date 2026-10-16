import React, { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useBehaviors } from '../contexts/BehaviorContext';
import { BehaviorCard } from '../components/BehaviorCard';
import { Behavior } from '../types';

interface HomeViewProps {
  onSelectBehavior: (behavior: Behavior) => void;
  onNavigateToContent: () => void;
}

export function HomeView({ onSelectBehavior }: HomeViewProps) {
  const { motherName, favorites, toggleFavorite, isFavorite } = useApp();
  const { behaviors } = useBehaviors();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBehaviors = behaviors.filter(
    (b) =>
      searchQuery === '' ||
      b.title.includes(searchQuery) ||
      b.subtitle.includes(searchQuery) ||
      b.audioScript.includes(searchQuery)
  );

  return (
    <div className="space-y-5 pb-24">
      {/* Welcome Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#5B3D91]/15 group">
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-[#5B3D91] via-[#6e4aa8] to-[#8659c2] relative">
          <img
            src="/assets/images/hero-banner.png"
            alt="معاً نقدر"
            className="w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D253D]/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC567]" />
              دليل التربية الإيجابية وABA
            </span>
            <h2 className="text-xl sm:text-2xl font-black leading-tight">
              مرحباً بكِ يا {motherName || 'ماما'} 💜
            </h2>
            <p className="text-sm text-white/90 mt-1 font-medium">
              أنتِ تبذلين جهداً رائعاً.. وخطوة بخطوة سنصل للأفضل!
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#7A708A]">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحثي عن سلوك أو موقف (صراخ، ضرب، عناد)..."
          className="w-full pr-11 pl-10 py-3.5 bg-white rounded-2xl border border-[#EAE4F2] focus:border-[#5B3D91] focus:ring-3 focus:ring-[#5B3D91]/10 text-sm text-[#2D253D] outline-none shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#7A708A] hover:text-[#5B3D91] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-[#2D253D]">السلوكيات الشائعة</h3>
          <p className="text-xs text-[#7A708A]">إرشادات صوتية وخطوات عملية فورية</p>
        </div>
        <span className="text-xs font-semibold text-[#5B3D91] bg-[#5B3D91]/10 px-3 py-1 rounded-full">
          {filteredBehaviors.length} سلوكيات
        </span>
      </div>

      {/* Behaviors List */}
      <div className="grid gap-3">
        {filteredBehaviors.map((behavior) => (
          <BehaviorCard
            key={behavior.id}
            behavior={behavior}
            isFav={isFavorite(behavior.id)}
            onPress={() => onSelectBehavior(behavior)}
            onToggleFav={() => toggleFavorite(behavior.id)}
          />
        ))}

        {filteredBehaviors.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#EAE4F2]">
            <Search className="w-10 h-10 text-[#B4A9C4] mx-auto mb-2" />
            <h4 className="font-bold text-[#2D253D]">لا توجد نتائج لبحثك</h4>
            <p className="text-xs text-[#7A708A] mt-1">
              جربي كتابة كلمة أخرى مثل "صراخ" أو "عناد" أو تصفحي كل السلوكيات.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
