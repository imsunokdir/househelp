import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PasswordChange from "./PasswordChange";

const AcccSettingsMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("change-password")}
      >
        <p className="m-0">Change Password</p>
        <p className="m-0 italic text-[15px]"></p>
      </div>
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("log-out-all")}
      >
        Logged in devices
      </div>
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("delete-acc")}
      >
        Delete Account
      </div>
      {/* <div className="shadow-md">Service analytics</div> */}
      <Routes>
        <Route path="change-password" element={<PasswordChange />} />
      </Routes>
    </div>
  );
};

export default AcccSettingsMenu;
