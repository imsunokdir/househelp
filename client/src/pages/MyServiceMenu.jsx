import React from "react";
import { useNavigate } from "react-router-dom";

const MyServiceMenu = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("/accounts/add-service-form")}
      >
        <p className="m-0">Create Services</p>
        <p className="m-0 italic text-[15px]">Become a service provider</p>
      </div>
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("/accounts/my-services")}
      >
        View My Services
      </div>
      <div
        className="shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
        onClick={() => navigate("/accounts/my-services")}
      >
        Manage my services
      </div>
      {/* <div className="shadow-md p-2">Service analytics</div> */}
      {/* <div className="shadow-md">Service analytics</div> */}
    </div>
  );
};

export default MyServiceMenu;
