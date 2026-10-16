import React from 'react';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}

export function Chip({ label, selected, onPress, color = '#5B3D91' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer m-1 border ${
        selected
          ? 'text-white shadow-sm scale-105'
          : 'bg-white text-[#7A708A] hover:bg-[#F8F6FA] border-[#EAE4F2]'
      }`}
      style={{
        backgroundColor: selected ? color : undefined,
        borderColor: selected ? color : '#EAE4F2',
      }}
    >
      {label}
    </button>
  );
}
