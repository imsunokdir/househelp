import React from "react";
import { Flex, Divider, Form, Radio, Skeleton, Space, Switch } from "antd";
import { Height } from "@mui/icons-material";
import { Fade } from "@mui/material";

const SkeletonCards = () => {
  return (
    // <div className="services p-4 ">
    //   <div className="grid gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 mx-auto">
    <Fade in={true} timeout={300}>
      <div className="sm:max-w-full w-full lg:max-w-full lg:flex justify-center max-w-full cursor-pointer">
        {/* Image container with background image */}
        <div className="w-full h-48 lg:h-full rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
          {/* <Skeleton.Image
          active
          style={{
            width: "100%",
            height: "100%",

            // Remove default skeleton styles
            marginTop: 0,
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="!w-full !h-full" // Using important to override antd defaults
        /> */}

          <Skeleton.Node
            active
            style={{
              width: "100%",
              height: "100%",

              // Remove default skeleton styles
              marginTop: 0,
              marginBottom: 0,
            }}
            className="!w-full !h-full"
          />
        </div>

        {/* Card content */}
        <div className="border-r border-b border-t border-l border-gray-200 lg:border-l-0 lg:border-t lg:border-gray-200 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            {/* <div className="mb-2">
                <Skeleton.Input active size="small" />
              </div> */}

            <Skeleton active />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Skeleton.Avatar active size="large" shape="circle" />
            </div>

            <div className="text-sm">
              {/* <p> */}
              <Skeleton.Input active size="small" block />
              {/* </p> */}
            </div>
          </div>
        </div>
      </div>
    </Fade>
    //   </div>
    // </div>
  );
};

export default SkeletonCards;
