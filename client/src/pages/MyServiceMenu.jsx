import React from "react";
import { useNavigate } from "react-router-dom";
// import ROUTES from "../routes/ROUTES"; // adjust path if needed
import ROUTES from "../constants/routes";

const MyServiceMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto p-3">
        {/* Create Services */}
        <div
          className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
          onClick={() => navigate(ROUTES.ADD_SERVICE_FORM)}
        >
          <p className="m-0 font-semibold">Create Services</p>
          <p className="m-0 italic text-sm text-gray-600">
            Become a service provider
          </p>
        </div>

        {/* Manage my services */}
        <div
          className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => navigate(ROUTES.MY_SERVICES)}
        >
          <p className="m-0 font-semibold ">Manage My Services</p>
          <p className="m-0 italic text-sm text-gray-600">
            Edit or remove your services
          </p>
        </div>

        {/* Saved Services */}
        <div
          className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
          onClick={() => navigate(ROUTES.SAVED_SERVICES)}
        >
          <p className="m-0 font-semibold ">Saved Services</p>
          <p className="m-0 italic text-sm text-gray-600">
            View your saved services
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyServiceMenu;
