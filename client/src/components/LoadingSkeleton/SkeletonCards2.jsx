import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";

const SkeletonCard2 = ({ index, delay }) => {
  // Calculate whether to fade out based on the delay and index
  const fadeOut = (index + 1) * delay;

  return (
    <Card className="cursor-pointer" style={{ borderRadius: "10%" }}>
      <Fade in={true} timeout={{ enter: 0, exit: fadeOut }}>
        <CardHeader
          shadow={false}
          floated={false}
          className="h-42 flex justify-center"
        >
          <Skeleton.Node
            active
            style={{
              height: "180px",
              borderRadius: "50% !important",
            }}
            className="!w-full rounded"
          />
        </CardHeader>
      </Fade>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton.Input active={true} size="small" />
          </div>
          <div>
            <Skeleton.Button
              active={true}
              size="small"
              shape="square"
              block={true}
            />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton
            active={true}
            paragraph={{
              rows: 0,
            }}
          />
        </div>
      </CardBody>
      <CardFooter className="p-1 m-0 flex justify-between">
        <div className=" p-[2px] rounded">
          <Skeleton.Input active={true} size="small" />
        </div>
        <div>
          <Skeleton.Input active={true} size="small" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkeletonCard2;
