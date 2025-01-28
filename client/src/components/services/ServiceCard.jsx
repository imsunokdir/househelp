import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import carpenter from "../../assets/carpenter.jpg";
import { Fade } from "@mui/material";
import { useState, useEffect } from "react";

const ServiceCard = ({ service, index, delay }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Set a timeout to trigger the visibility sequentially based on the index
    const timer = setTimeout(() => {
      setVisible(true);
    }, index * delay);

    // Cleanup timeout to avoid memory leaks
    return () => clearTimeout(timer);
  }, [index, delay]);

  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };

  return (
    <Card
      className="cursor-pointer flex flex-col h-full"
      onClick={handleClick}
      style={{ borderRadius: "10%" }}
    >
      {/* Card Header with Fade applied to the image */}
      <CardHeader
        shadow={false}
        floated={false}
        className="h-42 flex justify-center"
      >
        <Fade in={visible} timeout={500}>
          <img
            src={
              service.images?.length > 0
                ? `${service.images[0].url.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_720/" // Adjust width as needed
                  )}`
                : `${carpenter}?f_webp`
            }
            alt="card-image"
            className="h-full w-full object-cover rounded"
            style={{
              height: "180px",
              borderRadius: "10%",
              backgroundColor: "#d6d6d6",
            }}
            loading="lazy"
          />
        </Fade>
      </CardHeader>
      {/* Rest of the card content */}
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
  );
};

export default ServiceCard;
