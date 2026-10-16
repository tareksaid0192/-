import React, { useState } from 'react';
import { useBehaviors } from '../contexts/BehaviorContext';
import { useApp } from '../contexts/AppContext';
import { BehaviorCard } from '../components/BehaviorCard';
import { Behavior } from '../types';
import { FolderOpen, Heart, Sparkles } from 'lucide-react';

interface ContentViewProps {
  onSelectBehavior: (behavior: Behavior) => void;
}

export function ContentView({ onSelectBehavior }: ContentViewProps) {
  const { behaviors } = useBehaviors();
  const { isFavorite, toggleFavorite, favorites } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');

  const displayedBehaviors = behaviors.filter((b) => {
    if (filterType === 'favorites') {
      return isFavorite(b.id);
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#EAE4F2] shadow-xs">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-[#5B3D91]/10 text-[#5B3D91] flex items-center justify-center">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-[#2D253D]">دليل السلوكيات الشامل</h2>
            <p className="text-xs text-[#7A708A]">اختاري السلوك للاطلاع على الاستراتيجية والخطوات</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#EAE4F2]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#5B3D91] text-white shadow-xs'
                : 'bg-[#F8F6FA] text-[#7A708A] hover:bg-[#EAE4F2]'
            }`}
          >
            جميع السلوكيات ({behaviors.length})
          </button>
          <button
            onClick={() => setFilterType('favorites')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterType === 'favorites'
                ? 'bg-[#FF6B6B] text-white shadow-xs'
                : 'bg-[#F8F6FA] text-[#7A708A] hover:bg-[#EAE4F2]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            المفضلة ({favorites.length})
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid gap-3">
        {displayedBehaviors.map((behavior) => (
          <BehaviorCard
            key={behavior.id}
            behavior={behavior}
            isFav={isFavorite(behavior.id)}
            onPress={() => onSelectBehavior(behavior)}
            onToggleFav={() => toggleFavorite(behavior.id)}
          />
        ))}

        {displayedBehaviors.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#EAE4F2]">
            <Heart className="w-10 h-10 text-[#B4A9C4] mx-auto mb-2" />
            <h4 className="font-bold text-[#2D253D]">لا توجد سلوكيات في المفضلة حالياً</h4>
            <p className="text-xs text-[#7A708A] mt-1">
              اضغطي على أيقونة القلب بجانب أي سلوك لإضافته هنا لسهولة الوصول إليه وقت الحاجة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
