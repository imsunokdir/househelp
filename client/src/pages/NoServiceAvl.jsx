import React from "react";
import { Empty, Typography } from "antd";

const NoServiceAvl = () => {
  return (
    <div className="">
      <Empty
        description={<Typography.Text>No services found</Typography.Text>}
      />
    </div>
  );
};

export default NoServiceAvl;
