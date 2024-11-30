import React, { useState } from "react";
import {
  Select,
  Form,
  Flex,
  Divider,
  Radio,
  Skeleton,
  Space,
  Switch,
} from "antd";

const SkeletonLoad = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton.Input active size="default" block={true} />
      <Skeleton.Input active size="default" block={true} />
      <Skeleton.Input active size="default" block={false} />
      <div className="flex gap-10 mt-1">
        <Skeleton.Input active size="default" block={false} />
        <Skeleton.Input active size="default" block={false} />
      </div>
      <div className="flex gap-10 mt-1">
        <Skeleton.Input active size="default" block={false} />
        <Skeleton.Input active size="default" block={false} />
        <Skeleton.Input active size="default" block={false} />
      </div>
      <Skeleton.Input active size="default" block={true} />
      <Skeleton active />
    </div>
  );
};

export default SkeletonLoad;
