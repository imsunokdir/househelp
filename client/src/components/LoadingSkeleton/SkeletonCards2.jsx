import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";

const SkeletonCard2 = () => {
  return (
    <Fade in timeout={300}>
      <Card className="cursor-pointer">
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
    </Fade>
  );
};

export default SkeletonCard2;
