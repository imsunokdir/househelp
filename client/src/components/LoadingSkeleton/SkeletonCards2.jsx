import { Fade } from "@mui/material";
import { useState } from "react";

const SkeletonCard2 = ({ index, delay }) => {
  const fadeOut = (index + 1) * delay;

  return (
    <div className="flex flex-col h-full">
      {/* Image skeleton */}
      <Fade in={true} timeout={{ enter: 0, exit: fadeOut }}>
        <div className="h-44 w-full rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
      </Fade>

      {/* Content skeleton */}
      <div className="pt-2.5 px-0.5 flex flex-col gap-2">
        {/* Title */}
        <div className="h-3.5 w-3/4 bg-gray-200 rounded-full animate-pulse" />

        {/* Description lines */}
        <div className="h-2.5 w-full bg-gray-100 rounded-full animate-pulse" />
        <div className="h-2.5 w-4/5 bg-gray-100 rounded-full animate-pulse" />

        {/* Price + distance */}
        <div className="flex items-center justify-between mt-1">
          <div className="h-3 w-1/3 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard2;
