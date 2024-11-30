import React from "react";
import { Progress } from "antd";

const RatingDistribution = ({ rateDist }) => {
  // Array of ratings from 5 to 1 (ordered from highest to lowest)
  const allRatings = [5, 4, 3, 2, 1];

  // If rateDist is empty or has fewer items, fill missing ratings with zero
  const ratingCounts = allRatings.map((rating) => {
    const ratingData = rateDist.find((item) => item.rating === rating);
    return ratingData ? ratingData.count : 0; // Default to 0 if rating is not found
  });

  // Calculate total number of reviews
  const totalReviews = ratingCounts.reduce((acc, count) => acc + count, 0);

  // Calculate percentages based on the total reviews
  const ratingPercentages = totalReviews
    ? ratingCounts.map((count) => ((count / totalReviews) * 100).toFixed(2))
    : allRatings.map(() => "0.00"); // If no reviews, set 0% for all

  return (
    <div style={{ width: 180 }} className="flex flex-col">
      {allRatings.map((rating, index) => (
        <Progress
          key={rating}
          percent={ratingPercentages[index]}
          size="small"
          strokeColor="gray"
          format={() => `${rating}`}
          showInfo={true}
        />
      ))}
    </div>
  );
};

export default RatingDistribution;
