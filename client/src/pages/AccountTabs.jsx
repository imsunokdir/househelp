import { Fade } from "@mui/material";
import { Divider } from "antd";
import { FooterDivider } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutDialog from "./LogoutDialog";
import { useState } from "react";

const AccountTabs = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClickOpen = () => {
    // Implement your logout logic here
    setOpen(true);
  };

  const handleLogoutClickClose = () => {
    // Implement your logout logic here
    setOpen(false);
  };

  return (
    <Fade in timeout={500}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-3">
        <div
          className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
          onClick={() => navigate("/accounts/personal-info")}
        >
          <p className="text-[25px]">Personal info</p>
          <p className="">Provide your personal details</p>
        </div>
        <div
          className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
          onClick={() => navigate("/accounts/my-service-menu")}
        >
          <p className="text-[25px]">My Services</p>
          <p className="">Create and manage your service</p>
        </div>
        <div
          className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
          onClick={() => navigate("/accounts/account-settings-menu")}
        >
          <p className="text-[25px]">Account Settings</p>
          <p className="">Manage your account</p>
        </div>
        <div className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer">
          <p className="text-[25px]">Something</p>
          <p className="">Not created</p>
        </div>

        {/* Logout button for smaller screens */}
        <Divider
          style={{ borderColor: "#d9d9d9" }}
          className="block sm:hidden"
        />
        {/* <Divider /> */}

        {/* <FooterDivider /> */}
        <div className="sm:hidden col-span-full">
          <button
            className="w-full p-2 border-[1px] border-red-400 text-red-500 rounded transition-colors duration-200 hover:bg-red-500 hover:text-white"
            onClick={handleLogoutClickOpen}
          >
            Log out
          </button>
        </div>
        <LogoutDialog
          handleLogoutClickClose={handleLogoutClickClose}
          handleLogoutClickOpen={handleLogoutClickOpen}
          open={open}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Gray transparent overlay
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            {/* <div>Place your custom spinner here</div> */}
          </div>
        )}
      </div>
    </Fade>
  );
};

export default AccountTabs;
