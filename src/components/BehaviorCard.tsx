import React from 'react';
import { Behavior } from '../types';
import {
  Headphones,
  ListOrdered,
  Brain,
  Heart,
  Star,
  Smile,
  Shield,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

interface BehaviorCardProps {
  behavior: Behavior;
  isFav?: boolean;
  onPress: () => void;
  onToggleFav?: (e: React.MouseEvent) => void;
}

export function getBehaviorIcon(name: string, className = 'w-6 h-6') {
  switch (name) {
    case 'headphones':
      return <Headphones className={className} />;
    case 'list':
      return <ListOrdered className={className} />;
    case 'brain':
    case 'psychology':
      return <Brain className={className} />;
    case 'heart':
    case 'favorite':
      return <Heart className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'smile':
    case 'emoji-emotions':
      return <Smile className={className} />;
    case 'shield':
      return <Shield className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function BehaviorCard({ behavior, isFav, onPress, onToggleFav }: BehaviorCardProps) {
  return (
    <div
      onClick={onPress}
      className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-[#EAE4F2] hover:border-[#5B3D91]/30 cursor-pointer flex items-center justify-between gap-4 overflow-hidden"
    >
      {/* Color Accent Indicator Strip */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1.5 transition-all group-hover:w-2"
        style={{ backgroundColor: behavior.color }}
      />

      <div className="flex items-center gap-3.5 pr-2">
        {/* Icon Circle */}
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${behavior.color}18`,
            color: behavior.color,
          }}
        >
          {getBehaviorIcon(behavior.iconName, 'w-6 h-6')}
        </div>

        {/* Text Content */}
        <div>
          <h3 className="font-bold text-base text-[#2D253D] group-hover:text-[#5B3D91] transition-colors leading-tight">
            {behavior.title}
          </h3>
          <p className="text-xs text-[#7A708A] mt-1 line-clamp-1">
            {behavior.subtitle}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-[#7A708A]">
            <span className="flex items-center gap-1 font-poppins">
              <Clock className="w-3.5 h-3.5 text-[#5B3D91]" />
              {behavior.audioDuration}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4DB6AC]" />
              {behavior.steps.length} خطوات
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-1">
        {onToggleFav && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(e);
            }}
            className="p-2 rounded-full hover:bg-[#F8F6FA] text-[#B4A9C4] hover:text-[#FF6B6B] transition-colors cursor-pointer"
            title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <Heart
              className={`w-5 h-5 ${
                isFav ? 'fill-[#FF6B6B] text-[#FF6B6B]' : ''
              }`}
            />
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-[#F8F6FA] group-hover:bg-[#5B3D91] group-hover:text-white text-[#7A708A] flex items-center justify-center transition-all">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
