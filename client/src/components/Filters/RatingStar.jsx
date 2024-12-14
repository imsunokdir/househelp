import React from "react";
import { Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../../reducers/filter";
import { Star } from "@mui/icons-material";

const RatingStar = () => {
  const dispatch = useDispatch();
  const { rating } = useSelector((state) => state.filter);

  const handleRatingChange = (e, value) => {
    if (!value) value = 0;
    dispatch(filterActions.setRating(value));
  };
  return (
    <div>
      <p className="m-0">Rating</p>
      <Rating
        name="simple-uncontrolled"
        onChange={handleRatingChange}
        value={rating}
        size="large"
      />
      <div className="flex items-center gap-1">
        <p className="m-0 text-[20px]">{(rating && rating) || 0}</p>
        <Star className="text-yellow-500 m-0 p-0" />
      </div>
    </div>
  );
};

export default RatingStar;
