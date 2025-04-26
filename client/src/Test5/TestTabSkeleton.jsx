import { Tab, Tabs } from "@mui/material";
import { Skeleton } from "antd";
import React from "react";
import Filter from "../components/Filters/Filter";

const TestTabSkeleton = () => {
  const numberOfNavTabs = new Array(10).fill(null);
  return (
    <div className="navigation sticky top-[55px] z-10 w-full   flex items-center  shadow-md bg-white">
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
                  width: "80px",
                  animationDuration: "5s",
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
      <Filter />
    </div>
  );
};

export default TestTabSkeleton;
