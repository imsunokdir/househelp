import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";

const SkeletonCard2 = ({ index, delay }) => {
  const fadeOut = (index + 1) * delay;

  return (
    <Card
      className="cursor-pointer flex flex-col h-full shadow-none border-none"
      style={{ borderRadius: "10%" }}
    >
      {/* Card Header with image placeholder */}
      <CardHeader
        shadow={false}
        floated={false}
        className="h-42 flex justify-center"
      >
        <Fade in={true} timeout={{ enter: 0, exit: fadeOut }}>
          <div
            style={{
              height: "180px",
              width: "100%",
              borderRadius: "10%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Skeleton.Avatar
              active
              size={120}
              shape="square"
              style={{
                borderRadius: "8px",
                backgroundColor: "#e0e0e0",
                width: "80%",
                height: "80%",
              }}
            />
          </div>
        </Fade>
      </CardHeader>

      {/* Card Body */}
      <CardBody className="flex-grow py-2 overflow-hidden">
        <div className="flex items-center justify-between mb-3 gap-2">
          <div
            className="mt-[2px] flex-grow"
            style={{
              overflow: "hidden",
              width: "60%",
            }}
          >
            <Skeleton.Input
              active
              size="default"
              style={{
                width: "100%",
                height: "20px",
                maxWidth: "100%",
              }}
            />
          </div>

          <div
            className="mt-[2px]"
            style={{
              width: "30%",
              overflow: "hidden",
            }}
          >
            <Skeleton.Input
              active
              size="default"
              style={{
                width: "100%",
                height: "20px",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>

        {/* Description line */}
        <div style={{ width: "90%", overflow: "hidden" }}>
          <Skeleton.Input
            active
            size="small"
            style={{
              width: "100%",
              maxWidth: "100%",
            }}
          />
        </div>
      </CardBody>

      {/* Card Footer */}
      <CardFooter className=" m-0 overflow-hidden">
        <div className="flex flex-col justify-between w-full gap-2">
          <div style={{ width: "50%", overflow: "hidden" }}>
            <Skeleton.Input
              active
              size="small"
              style={{
                width: "100%",
                maxWidth: "100%",
              }}
            />
          </div>
          <div style={{ width: "25%", overflow: "hidden" }}>
            <Skeleton.Input
              active
              size="small"
              style={{
                width: "100%",
                maxWidth: "100%",
              }}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard2;
