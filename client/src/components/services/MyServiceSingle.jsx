import React from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Tooltip } from "@mui/material";

const MyServiceSingle = ({ service }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleClick = () => {
    navigate(`/edit-service/${service._id}`);
  };
  const positionRef = React.useRef({
    x: 0,
    y: 0,
  });
  const popperRef = React.useRef(null);
  const areaRef = React.useRef(null);

  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };
  return (
    <div className=" h-[100px] rounded shadow-md hover:shadow-lg">
      <Tooltip
        className="h-full"
        title="Click to edit"
        placement="top"
        arrow
        PopperProps={{
          popperRef,
          anchorEl: {
            getBoundingClientRect: () => {
              return new DOMRect(
                positionRef.current.x,
                areaRef.current.getBoundingClientRect().y,
                0,
                0
              );
            },
          },
        }}
      >
        {/* <Box > */}
        <div
          className="p-1 rounded w-full cursor-pointer flex flex-col"
          onClick={handleClick}
          ref={areaRef}
          onMouseMove={handleMouseMove}
        >
          <div className="bg-green-100 p-1 flex justify-between">
            <p className="mb-0">{service.serviceName}</p>
            <p className="mb-0">
              {service.averageRating}
              <span style={{ color: "black" }}>✰</span>
            </p>
          </div>
          <div className="p-1">
            <p className="text-gray-400 italic text-[15px]">
              <span>“</span>
              {service.description.slice(0, 42)}
              <span>”</span>
            </p>
          </div>
          <p className="mb-0 italic text-sm mt-auto">
            Posted on: {formatDate(service.createdAt)}
          </p>
        </div>

        {/* </Box> */}
      </Tooltip>
    </div>
  );
};

export default MyServiceSingle;
