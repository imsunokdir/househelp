import { Tab, Tabs } from "@mui/material";
import { Skeleton } from "antd";
import React from "react";

const TestTabSkeleton = () => {
  const numberOfNavTabs = new Array(10).fill(null);
  return (
    <Tabs
      // value={false}
      variant="scrollable"
      scrollButtons={false}
      allowScrollButtonsMobile
      aria-label="scrollable auto tabs example"
    >
      {numberOfNavTabs.map((_, i) => (
        <Tab
          label={
            <Skeleton.Button
              active
              //   size="large"
              style={{
                height: "25px",
                width: "100px",
                animationDuration: "3s",
                // animationDelay: "50s",
              }}
            />
          }
          sx={{
            minWidth: "auto",
            paddingX: { xs: 1, sm: 2 },
            fontSize: { xs: "12px", sm: "14px" },
            marginX: { xs: 0.5, sm: 1 },
          }}
          key={i}
        />
      ))}
    </Tabs>
  );
};

export default TestTabSkeleton;
