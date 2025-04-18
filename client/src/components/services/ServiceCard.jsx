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
import { Skeleton } from "antd";
import SkeletonCard2 from "../LoadingSkeleton/SkeletonCards2";

const ServiceCard = ({ service, index, delay }) => {
  const [visible, setVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, index * delay);

    return () => clearTimeout(timer);
  }, [index, delay]);

  useEffect(() => {
    if (visible && imageLoaded) {
      setShowContent(true);
    }
  }, [visible, imageLoaded]);

  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // const renderSkeletonContent = () => (
  //   <>
  //     {/* Card Header with image placeholder */}
  //     <CardHeader
  //       shadow={false}
  //       floated={false}
  //       className="h-42 flex justify-center items-center"
  //     >
  //       <div
  //         style={{
  //           height: "180px",
  //           width: "100%",
  //           borderRadius: "10%",
  //           backgroundColor: "#f0f0f0",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           overflow: "hidden",
  //         }}
  //       >
  //         <Skeleton.Avatar
  //           active
  //           size={120}
  //           shape="square"
  //           style={{
  //             borderRadius: "8px",
  //             backgroundColor: "#e0e0e0",
  //             width: "80%",
  //             height: "80%",
  //           }}
  //         />
  //       </div>
  //     </CardHeader>

  //     {/* Card Body */}
  //     <CardBody className="flex-grow py-2 overflow-hidden">
  //       <div className="flex items-center justify-between mb-3 gap-2">
  //         <div
  //           className="mt-[2px] flex-grow"
  //           style={{
  //             overflow: "hidden",
  //             width: "60%",
  //           }}
  //         >
  //           <Skeleton.Input
  //             active
  //             size="default"
  //             style={{
  //               width: "100%",
  //               height: "20px",
  //               maxWidth: "100%",
  //             }}
  //           />
  //         </div>

  //         <div
  //           className="mt-[2px]"
  //           style={{
  //             width: "30%",
  //             overflow: "hidden",
  //           }}
  //         >
  //           <Skeleton.Input
  //             active
  //             size="default"
  //             style={{
  //               width: "100%",
  //               height: "20px",
  //               maxWidth: "100%",
  //             }}
  //           />
  //         </div>
  //       </div>

  //       {/* Description line */}
  //       <div style={{ width: "90%", overflow: "hidden" }}>
  //         <Skeleton.Input
  //           active
  //           size="small"
  //           style={{
  //             width: "100%",
  //             maxWidth: "100%",
  //           }}
  //         />
  //       </div>
  //     </CardBody>

  //     {/* Card Footer */}
  //     <CardFooter className=" m-0 overflow-hidden">
  //       <div className="flex flex-col justify-between w-full gap-2">
  //         <div style={{ width: "50%", overflow: "hidden" }}>
  //           <Skeleton.Input
  //             active
  //             size="small"
  //             style={{
  //               width: "100%",
  //               maxWidth: "100%",
  //             }}
  //           />
  //         </div>
  //         <div style={{ width: "25%", overflow: "hidden" }}>
  //           <Skeleton.Input
  //             active
  //             size="small"
  //             style={{
  //               width: "100%",
  //               maxWidth: "100%",
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </CardFooter>
  //   </>
  // );

  const renderActualContent = () => (
    <>
      <Fade in={showContent} timeout={500}>
        <div>
          <CardHeader
            shadow={false}
            floated={false}
            className="h-42 flex justify-center items-center"
          >
            <img
              src={
                service.images?.length > 0
                  ? `${service.images[0].url.replace(
                      "/upload/",
                      "/upload/f_auto,q_auto,w_720/"
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
              onLoad={handleImageLoad}
              {...(!showContent && { style: { display: "none" } })}
            />
          </CardHeader>

          <CardBody className="flex-grow py-2">
            <div className="flex items-center justify-between mb-3 gap-2">
              <Typography color="blue-gray" className="font-medium flex-grow">
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
              {service.description.slice(0, 45)}...
            </Typography>
          </CardBody>

          <CardFooter className="m-0 flex justify-between">
            <div className="flex flex-col justify-between w-full">
              <span className="flex items-center">
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

              <span className="flex items-center" style={{ fontSize: "15px" }}>
                <p className="m-0">{service.distanceInKm.toFixed()}</p>
                <p className="m-0">km</p>
              </span>
            </div>
          </CardFooter>
        </div>
      </Fade>
    </>
  );

  return (
    <Card
      className="cursor-pointer flex flex-col h-full shadow-none border-none"
      onClick={handleClick}
      // style={{ borderRadius: "10%" }}
    >
      {!showContent ? (
        <SkeletonCard2 index={index} delay={delay} />
      ) : (
        renderActualContent()
      )}

      <img
        src={
          service.images?.length > 0
            ? `${service.images[0].url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_720/"
              )}`
            : `${carpenter}?f_webp`
        }
        onLoad={handleImageLoad}
        style={{ display: "none" }}
        alt=""
      />
    </Card>
  );
};

export default ServiceCard;
