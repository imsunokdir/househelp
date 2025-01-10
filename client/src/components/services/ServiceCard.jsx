import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import carpenter from "../../assets/carpenter.jpg";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";

const ServiceCard = ({ service }) => {
  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };

  return (
    // <Fade in timeout={1000} className="h-full">
    <Card
      className="cursor-pointer flex flex-col h-full"
      onClick={handleClick}
      style={{ borderRadius: "10%" }}
    >
      <CardHeader
        shadow={false}
        floated={false}
        className="h-42 flex justify-center"
      >
        <img
          src={service.images?.length > 0 ? service.images[0].url : carpenter}
          alt="card-image"
          className="h-full w-full object-cover rounded"
          style={{
            height: "180px",
            borderRadius: "10%",
            backgroundColor: "#d6d6d6",
          }}
        />
      </CardHeader>
      <CardBody className="flex-grow">
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
        <div className="flex flex-col justify-between w-full">
          <span className="flex">
            <p className="m-0">₹</p>
            <p className="m-0">
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                {service.priceRange.minimum}
              </span>
              -{" "}
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                {service.priceRange.maximum}
              </span>
            </p>
          </span>
          <span className="flex" style={{ fontSize: "15px" }}>
            <p className="m-0">{service.distanceInKm.toFixed()}</p>
            <p className="m-0">km</p>
          </span>
        </div>
      </CardFooter>
    </Card>
    // </Fade>
  );
};

export default ServiceCard;
