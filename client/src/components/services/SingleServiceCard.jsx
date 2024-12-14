import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, Fade, Grow } from "@mui/material";

import { useCookies } from "react-cookie";

const SingleServiceCard = ({ service }) => {
  const { serviceName, description, averageRating } = service;
  const [cookies, setCookies] = useCookies(["user_location"]);

  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };

  return (
    <Fade in timeout={700}>
      <div
        className="bg-red-100 sm:max-w-full  w-full lg:max-w-full lg:flex justify-center max-w-full cursor-pointer shadow-md rounded h-full"
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
        <div className=" rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">
              {serviceName}
            </div>
            <p className="text-gray-700 text-base">{description}</p>
          </div>
          <div className="flex justify-end">
            <p>{service.distanceInKm.toFixed(2)} Km</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Avatar src={service.createdBy?.avatar} />
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
