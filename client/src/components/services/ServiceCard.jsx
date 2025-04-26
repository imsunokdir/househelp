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
import SkeletonCard2 from "../LoadingSkeleton/SkeletonCards2";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service, index, delay }) => {
  const [visible, setVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * delay);
    return () => clearTimeout(timer);
  }, [index, delay]);

  useEffect(() => {
    if (visible && imageLoaded) setShowContent(true);
  }, [visible, imageLoaded]);

  const handleClick = () => {
    // Save the current scroll position with the category ID from Redux store
    const categoryId = service.categoryId; // Assuming you have access to categoryId
    // localStorage.setItem(
    //   `scrollPositionForServices-${categoryId}`,
    //   window.scrollY.toString()
    // );

    console.log(" window.scrollY.toString():", window.scrollY.toString());

    navigate(`/show-service-details/${service._id}`);
  };

  const imageSrc =
    imageError || !service.images?.length
      ? carpenter
      : service.images[0].url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_720/"
        );

  const renderActualContent = () => (
    <Fade in={showContent} timeout={500}>
      <div className="flex flex-col h-full">
        <CardHeader
          shadow={false}
          floated={false}
          className="h-44 rounded-xl overflow-hidden"
        >
          <img
            src={imageSrc}
            alt="Service"
            className="h-full w-full object-cover"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </CardHeader>

        <CardBody className="pt-2 pb-1 px-4 ">
          <div className="flex justify-between items-center pb-2">
            <Typography
              color="blue-gray"
              className="font-medium text-base truncate w-[85%] leading-tight m-0"
            >
              {service.serviceName}
            </Typography>
            <Typography
              color="blue-gray"
              className="font-medium text-sm leading-tight m-0"
            >
              {service.averageRating.toFixed(1)}☆
            </Typography>
          </div>

          <Typography
            variant="small"
            color="gray"
            className="opacity-75 text-sm leading-snug mt-1 m-0"
          >
            {service.description.slice(0, 45)}...
          </Typography>
        </CardBody>

        <CardFooter className="flex flex-col py-0 mt-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">
              ₹{service.priceRange.minimum} - ₹{service.priceRange.maximum}
            </span>
            <span>{service.distanceInKm.toFixed()} km</span>
          </div>
        </CardFooter>
      </div>
    </Fade>
  );

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer flex flex-col h-full bg-white shadow-none"
    >
      {!showContent ? (
        <SkeletonCard2 index={index} delay={delay} />
      ) : (
        renderActualContent()
      )}

      {/* Preload image invisibly to trigger onLoad */}
      <img
        src={imageSrc}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{ display: "none" }}
        alt=""
      />
    </Card>
  );
};

export default ServiceCard;
