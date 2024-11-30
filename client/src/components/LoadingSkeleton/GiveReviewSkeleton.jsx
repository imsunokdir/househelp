import { Divider, Skeleton } from "antd";
import React, { useState } from "react";

const GiveReviewSkeleton = () => {
  return (
    <>
      <div>
        <div>
          <Skeleton.Input active size="small" />
        </div>
        <div className="text-center">
          <Skeleton.Button active size="small" shape="square" block />
        </div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div>
          <Skeleton.Input active size="small" />
          <span className="flex gap-3 items-center">
            <Skeleton.Input active size="small" />
            <Skeleton.Input active size="small" />
          </span>
        </div>
      </div>
      <Divider />
      <div className="">
        <Skeleton.Input active size="small" />
        <div className="space-y-2 p-1">
          <Skeleton active />
        </div>
      </div>
      <div>
        <Skeleton.Button active size="small" shape="square" block />
      </div>
    </>
  );
};

export default GiveReviewSkeleton;
