import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import PasswordChange from "./PasswordChange";

const AcccSettingsMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto p-3">
      <div
        className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
        onClick={() => navigate("change-password")}
      >
        <p className="m-0 text-xl font-semibold">Change Password</p>
        <p className="m-0 italic text-[15px] text-gray-500">
          Secure your account by updating your password.
        </p>
      </div>
      <div
        className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
        onClick={() => navigate("log-out-all")}
      >
        <p className="m-0 text-xl font-semibold">Logged in Devices</p>
        <p className="m-0 italic text-[15px] text-gray-500">
          View devices currently logged in to your account.
        </p>
      </div>

      <div
        className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
        onClick={() => navigate("delete-acc")}
      >
        <p className="m-0 text-xl font-semibold text-red-600">Delete Account</p>
        <p className="m-0 italic text-[15px] text-gray-500">
          Permanently delete your account. This action cannot be undone.
        </p>
      </div>

      {/* <div className="shadow-md">Service analytics</div> */}
      <Routes>
        <Route path="change-password" element={<PasswordChange />} />
      </Routes>
    </div>
  );
};

export default AcccSettingsMenu;
