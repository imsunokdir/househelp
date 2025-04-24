import {
  Reviews,
  ReviewsOutlined,
  ReviewsTwoTone,
  SettingsOutlined,
} from "@mui/icons-material";
import { Fade } from "@mui/material";
import { Avatar, Divider, Dropdown, Space } from "antd";
import React from "react";
import "./service.css";
import { EyeIcon } from "lucide-react";
import noimg from "../../assets/no-img.jpg";
import { useNavigate } from "react-router-dom";
import numeral from "numeral";

const MyServiceCard = ({ service }) => {
  const navigate = useNavigate();
  // const handleClick = () => {
  //   navigate(`/edit-service/${service._id}`);
  // };
  const handleClick = () => {
    navigate(
      `/accounts/my-service-menu/my-services/details/edit-service/${service._id}`,
      { replace: true }
    );
  };
  const items = [
    {
      label: (
        <a className="no-underline hover:text-blue-600" onClick={handleClick}>
          Edit
        </a>
      ),
      key: "0",
    },
    // {
    //   label: "Settings",
    //   key: "1",
    // },
  ];

  return (
    <div className="p-3">
      <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white">
        <div className="flex justify-between items-center bg-gray-50 border-b px-4 py-3">
          <div>
            <p className="m-0 font-semibold text-lg text-gray-800">
              {service.serviceName}
            </p>
          </div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            className="flex rounded-full"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <div className="hover:bg-gray-200 p-1 rounded-full">
                  <span className="dot bg-gray-600"></span>
                  <span className="dot bg-gray-600"></span>
                  <span className="dot bg-gray-600"></span>
                </div>
              </Space>
            </a>
          </Dropdown>
        </div>
        <div
          className="flex p-4 border-b"
          onClick={() => navigate(`${service._id}`)}
        >
          {/* first col */}
          <div className="w-1/3 flex justify-center items-center">
            <div className="w-[100px] h-[100px] overflow-hidden rounded-md">
              <img
                src={service.images.length > 0 ? service.images[0]?.url : noimg}
                className="w-full h-full object-cover"
                alt={service.serviceName}
              />
            </div>
          </div>
          {/* second col */}
          <div className="w-2/3 border-l pl-4 flex flex-col">
            <p className="m-0 mb-2">
              <span className="font-medium text-gray-700">Status: </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  service.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : service.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {service.status}
              </span>
            </p>
            <p className="m-0 text-gray-600 italic">
              "{service.description.slice(0, 55)}
              {service.description.length > 55 ? "..." : ""}"
            </p>
          </div>
        </div>
        <div className="flex justify-start gap-6 bg-gray-50 px-4 py-3">
          <div className="flex items-center text-gray-600">
            <EyeIcon size={18} className="mr-2" />
            <p className="m-0 text-sm">
              {numeral(service.views).format("0.[0]a")} views
            </p>
          </div>

          <div className="flex items-center text-gray-600">
            <ReviewsOutlined fontSize="small" className="mr-2" />
            <p className="m-0 text-sm">{service.ratingCount} reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyServiceCard;
