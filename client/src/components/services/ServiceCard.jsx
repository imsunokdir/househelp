import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import carpenter from "../../assets/carpenter.jpg";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";

const ServiceCard = ({ service }) => {
  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };

  return (
    <Fade in timeout={1000}>
      <Card className="cursor-pointer" onClick={handleClick}>
        <CardHeader
          shadow={false}
          floated={false}
          className="h-42 flex justify-center"
        >
          <img
            //   src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"
            src={service.images?.length > 0 ? service.images[0].url : carpenter}
            alt="card-image"
            className="h-full w-full object-cover rounded"
            style={{
              height: "180px",
              width: "",
              // borderRadius: "10%",
            }}
          />
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <Typography color="blue-gray" className="font-medium">
              {service.serviceName}
            </Typography>
            <Typography color="blue-gray" className="font-medium">
              {service.averageRating.toFixed(1)}☆
            </Typography>
          </div>
          <Typography
            variant="small"
            color="gray"
            className="font-normal opacity-75 m-0"
          >
            "{service.description.slice(0, 45)}..."
          </Typography>
        </CardBody>
        <CardFooter className="p-1 px-3 m-0 flex justify-between">
          <div className="flex justify-between w-full">
            <span className="flex">
              <p className="m-0">₹</p>
              <p className="m-0">
                {" "}
                {service.priceRange.minimum}-{service.priceRange.maximum}
              </p>
            </span>
            <span className="flex">
              <p className="m-0">{service.distanceInKm.toFixed()}</p>
              <p className="m-0">km</p>
            </span>
          </div>
        </CardFooter>
      </Card>
    </Fade>
  );
};

export default ServiceCard;