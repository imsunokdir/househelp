import React from "react";
import { useNavigate } from "react-router-dom";
// import ROUTES from "../routes/ROUTES"; // adjust path if needed
import ROUTES from "../constants/routes";

const MyServiceMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto p-3">
        <div
          className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
          onClick={() => navigate(ROUTES.ADD_SERVICE_FORM)}
        >
          <p className="m-0 font-semibold">Create Services</p>
          <p className="m-0 italic text-sm text-gray-600">
            Become a service provider
          </p>
        </div>
        <div
          className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
          onClick={() => navigate(ROUTES.MY_SERVICES)}
        >
          Manage my services
        </div>
        <div
          className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
          onClick={() => navigate(ROUTES.SAVED_SERVICES)}
        >
          Saved Services
        </div>
      </div>
    </div>
  );
};

export default MyServiceMenu;
