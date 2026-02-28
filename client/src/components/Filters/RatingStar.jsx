import React from "react";
import { Star } from "lucide-react";

const RatingStar = ({ localFilters, setLocalFilters }) => {
  const rating = localFilters?.rating ?? 0;

  const handleRatingChange = (value) => {
    setLocalFilters((prev) => ({
      ...prev,
      rating: prev.rating === value ? 0 : value,
    }));
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800 m-0">
          Minimum Rating
        </p>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {rating === 0 ? "Any" : `${rating}★ & above`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all
              ${
                rating >= star
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
          >
            <Star
              size={11}
              className={
                rating >= star ? "fill-white text-white" : "text-gray-400"
              }
            />
            {star}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingStar;
