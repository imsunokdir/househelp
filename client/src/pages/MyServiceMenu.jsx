import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ProtectedRoutes from "../components/Routes/ProtectedRoutes";
import AddService from "../components/services/AddService";
import MyServices from "../components/services/MyServices";
import SavedServices from "./SavedServices";
import MyServiceDetails from "../components/services/MyServiceDetails";
import EditService from ".././components/services/EditService";

const MyServiceMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide menu when on specific subroutes
  const hideMenuRoutes = [
    "/accounts/my-service-menu/add-service-form",
    "/accounts/my-service-menu/my-services",
    "/accounts/my-service-menu/saved-services",
  ];

  // Hide menu when viewing service details
  const isHidden =
    hideMenuRoutes.includes(location.pathname) ||
    location.pathname.includes(
      "/accounts/my-service-menu/my-services/details/"
    ) ||
    location.pathname.includes(
      "/accounts/my-service-menu/my-services/edit-single-service/"
    );

  return (
    <div className="p-4">
      {/* Show menu only when NOT in hideMenuRoutes */}
      {!isHidden && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
            onClick={() =>
              navigate("/accounts/my-service-menu/add-service-form")
            }
          >
            <p className="m-0 font-semibold">Create Services</p>
            <p className="m-0 italic text-sm text-gray-600">
              Become a service provider
            </p>
          </div>
          <div
            className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
            onClick={() => navigate("/accounts/my-service-menu/my-services")}
          >
            Manage my services
          </div>
          <div
            className="shadow-md p-4 rounded-lg hover:shadow-lg cursor-pointer"
            onClick={() => navigate("/accounts/my-service-menu/saved-services")}
          >
            Saved Services
          </div>
        </div>
      )}

      {/* Nested Routes inside accounts/my-service-menu */}
      <div className="mt-6">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="add-service-form" element={<AddService />} />
            <Route path="my-services/*" element={<MyServices />} />
            <Route
              path="my-services/details/:serviceId"
              element={<MyServiceDetails />}
            />

            <Route path="saved-services" element={<SavedServices />} />
            {/* <Route path=""/> */}
            <Route
              path="my-services/edit-single-service/:serviceId"
              element={<EditService />}
            />
            <Route
              path="my-services/details/:serviceId/edit-single-service/:serviceId"
              element={<EditService />}
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default MyServiceMenu;
