import { Fade } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const AccountTabs = () => {
  const navigate = useNavigate();
  return (
    <Fade in timeout={500}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
          onClick={() => navigate("/test4/personal-info")}
        >
          <p className="text-[25px]">Personal info</p>
          <p className="">provide your personal details</p>
        </div>
        <div
          className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
          onClick={() => navigate("/test4/my-services")}
        >
          <p className="text-[25px]">My Services</p>
          <p className="">create and manage your service</p>
        </div>
        <div className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer">
          <p className="text-[25px]">Settings</p>
          <p className="">Not created</p>
        </div>
        <div className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer">
          <p className="text-[25px]">Something</p>
          <p className="">Not created</p>
        </div>
      </div>
    </Fade>
  );
};

export default AccountTabs;
