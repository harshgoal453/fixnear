import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5.0, count, showCount = true, size = 'sm' }) {
  const numRating = Number(rating) || 5;
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(numRating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className="font-bold text-slate-800 text-sm ml-1">
        {numRating.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className="text-slate-500 text-xs font-normal">
          ({count})
        </span>
      )}
    </div>
  );
}
