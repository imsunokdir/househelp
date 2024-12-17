import React from "react";
import { useNavigate } from "react-router-dom";

const AcccSettingsMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("/accounts/change-password")}
      >
        <p className="m-0">Change Password</p>
        <p className="m-0 italic text-[15px]"></p>
      </div>
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("/accounts/log-out-all")}
      >
        Logged in devices
      </div>
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("/accounts/delete-acc")}
      >
        Delete Account
      </div>
      {/* <div className="shadow-md">Service analytics</div> */}
    </div>
  );
};

export default AcccSettingsMenu;
