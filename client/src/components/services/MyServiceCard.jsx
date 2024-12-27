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
  const handleClick = () => {
    navigate(`/edit-service/${service._id}`);
  };
  const items = [
    {
      label: (
        <a className="no-underline" onClick={handleClick}>
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
    <div className="p-2">
      <div className="shadow-md cursor-pointer">
        <div className=" flex justify-between border">
          <div className="p-1">
            <p className="m-0 text-[20px]">{service.serviceName}</p>
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
                <div className="service-dropdown">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </Space>
            </a>
          </Dropdown>
        </div>
        <div
          className="flex border p-1"
          onClick={() =>
            navigate(`/accounts/my-service/details/${service._id}`)
          }
        >
          {/* first col */}
          <div className="w-1/3  flex justify-center">
            <div className="w-[100px] ">
              <img
                src={service.images.length > 0 ? service.images[0]?.url : noimg}
                className="w-full h-full"
              />
            </div>
          </div>
          {/* second col */}
          <div className="w-2/3 border-l p-1">
            <p className="m-0">Status: {service.status}</p>
            <p className="m-0">
              description: "{service.description.slice(0, 55)}"
            </p>
          </div>
        </div>
        <div className="flex gap-2 border">
          <div className="flex gap-1 items-center justify-center">
            <EyeIcon />
            <p className="m-0">
              {numeral(service.views).format("0.[0]a")} views
            </p>
          </div>

          <div className="flex gap-1 items-center justify-center p-1">
            <ReviewsOutlined />
            <p className="m-0"> {service.ratingCount} reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyServiceCard;
