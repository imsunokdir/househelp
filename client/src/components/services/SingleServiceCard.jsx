import React from "react";
import { motion } from "framer-motion";
import { Fade, Grow } from "@mui/material";

const SingleServiceCard = ({ service }) => {
  const { serviceName, description, averageRating } = service;

  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };
  return (
    // <Grow in={true} style={{ transformOrigin: "center center" }}>
    <Fade in timeout={700}>
      <div
        className="sm:max-w-full  w-full lg:max-w-full lg:flex justify-center max-w-full cursor-pointer shadow-md rounded h-full"
        onClick={handleClick}
      >
        {/* Image container with background image */}
        <div
          className="w-full h-48 lg:h-full bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden lg:object-cover lg:object-center md:h-36"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?cs=srgb&dl=pexels-freestockpro-1172207.jpg&fm=jpg')",
            backgroundPosition: "center", // Ensure the image is centered
            backgroundSize: "cover",
          }}
          title="Woman holding a mug"
        ></div>

        {/* Card content */}
        <div className="bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">
              {serviceName}
            </div>
            <p className="text-gray-700 text-base">{description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <img
                className="w-10 h-10 rounded-full"
                src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png"
                alt="Avatar of Jonathan Reinink"
              />
              <div className="text-sm flex justify-between">
                <p className="text-gray-900 leading-none m-0">
                  @{service.createdBy.username}
                </p>
              </div>
            </div>
            <div className="bg-green-500 p-[2px] rounded">
              <p className="m-0 text-gray-200 text-[15px] ">
                {averageRating.toFixed(2)}☆
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default SingleServiceCard;
