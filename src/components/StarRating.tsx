import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = 28, readonly = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5 justify-center flex-row-reverse">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            className={`p-1 transition-transform ${
              readonly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-120 active:scale-95'
            }`}
          >
            <Star
              style={{ width: size, height: size }}
              className={`transition-colors ${
                isFilled
                  ? 'fill-[#F59E0B] text-[#F59E0B]'
                  : 'text-[#EAE4F2] fill-[#EAE4F2]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
