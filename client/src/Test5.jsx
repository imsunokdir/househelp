import { SettingsOutlined } from "@mui/icons-material";
import { Fade } from "@mui/material";
import { Avatar, Dropdown, Space } from "antd";
import React from "react";

const Test5 = () => {
  const items = [
    {
      label: <a className="no-underline">Edit</a>,
      key: "0",
    },
    {
      label: "Settings",
      key: "1",
    },
  ];
  const serviceDropdown = () => {};
  return (
    <div className="p-2">
      <div className="bg-blue-200">
        <div className="bg-yellow-200 flex justify-between">
          <div>heading</div>
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
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className="flex">
          {/* first col */}
          <div className="w-1/3 bg-red-100">one</div>
          {/* second col */}
          <div className="w-2/3 bg-green-200">
            <p className="m-0">Status: Active</p>
            <p className="m-0">desc: description</p>
          </div>
        </div>
        <div className="flex">
          <div>views</div>
          <div>reviews</div>
        </div>
      </div>
    </div>
  );
};

export default Test5;
