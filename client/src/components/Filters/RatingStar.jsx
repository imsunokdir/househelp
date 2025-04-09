import React from "react";
import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";

const RatingStar = ({ localFilters, setLocalFilters }) => {
  const rating = localFilters?.rating ?? 0;

  const handleRatingChange = (e, value) => {
    if (!value) value = 0;
    setLocalFilters((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  return (
    <div>
      <p className="m-0">Rating</p>
      <Rating
        name="rating-controlled"
        onChange={handleRatingChange}
        value={rating}
        size="large"
      />
      <div className="flex items-center gap-1">
        <p className="m-0 text-[20px]">{rating}</p>
        <Star className="text-yellow-500 m-0 p-0" />
      </div>
    </div>
  );
};

export default RatingStar;
