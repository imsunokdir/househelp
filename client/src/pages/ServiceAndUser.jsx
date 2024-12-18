import { StarFilled } from "@ant-design/icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PersonPinCircle,
  PersonPinCircleOutlined,
  WhatsApp,
} from "@mui/icons-material";
import { Divider, Rate } from "antd";
import { Star } from "lucide-react";
import whatsapp from "../assets/whatsapp.png";

import React from "react";

const ServiceAndUser = ({
  service,
  handleClickOpen,
  handleGiveReview,
  noprofile,
}) => {
  const handleContactClick = () => {
    console.log("hello");
    const whatsappNum = service.createdBy?.whatsapp;
    console.log("whatsappnum:", whatsappNum);
    if (whatsappNum) {
      const whatsappUrl = `https://wa.me/${whatsappNum}`;
      window.open(whatsappUrl);
    }
  };
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
      {/* First Column - First Row */}
      <div className=" flex flex-col h-[150px] items-center justify-center relative">
        <div className="bg-blue flex justify-center rounded-full bg-red-100 absolute">
          <img
            src={`${service.createdBy?.avatar || noprofile}`}
            style={{
              backgroundPosition: "center",
              //   borderRadius: "10px",
              height: "150px",
              width: "150px",
              objectFit: "cover",
            }}
            className="shadow-md rounded-full"
          />
        </div>
        <div className="bg-gray  h-full w-full"></div>
        <div className="bg-gray-200 shadow-md h-full w-full"></div>
      </div>

      {/* Second Column - Spanning Two Rows */}
      <div className="shadow-md row-span-2 flex flex-col gap-2 p-2 rounded">
        <div>
          <h2 className="m-0">{service.serviceName}</h2>
          <p className="italic m-0">(Electrician)</p>
        </div>
        <span className="flex">
          <p className="p-1">
            Service provided by{" "}
            {service.createdBy?.firstName
              ? `${service.createdBy.firstName} ${service.createdBy?.lastName}`
              : service.createdBy.username}
          </p>
        </span>
        <span className="flex items-center">
          <PersonPinCircleOutlined />
          <p className="m-0  rounded w-64">South ex1 block-e</p>
        </span>
        <div className="flex gap-1">
          <div>
            <p>Skills</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {service.skills.map((skill, i) => (
              <span key={i} className="border shadow-sm p-[2px] rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* First Column - Second Row */}

      <div className=" h-32 flex p-2 shadow-md justify-between">
        <div>
          <p>Contact me at</p>
          <div onClick={handleContactClick} className="cursor-pointer">
            <img src={whatsapp} />
          </div>
        </div>
        <div className="flex flex-col">
          {/* <Rate disabled value={service.averageRating} allowHalf /> */}

          <div className="flex gap-3 items-end">
            <p className="text-[20px] m-0 flex items-center">
              {service.averageRating.toFixed(1)}
              <StarFilled />
            </p>

            {service.ratingCount === 0 ? (
              <p className="m-0">No ratings</p>
            ) : (
              <p
                className="text-[14px] underline cursor-pointer m-0"
                onClick={handleClickOpen}
              >
                {service.ratingCount} Reviews
              </p>
            )}
          </div>

          <button
            className=" rounded p-1 mt-3 shadow-md"
            onClick={handleGiveReview}
          >
            Write a review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAndUser;
