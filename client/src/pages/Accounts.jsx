import React from "react";
import { Route, Routes } from "react-router-dom";
import AccountTabs from "./AccountTabs";
import PersonalInfo from "./PersonalInfo";
import MyServices from "../components/services/MyServices";
import ProfileCheck from "./ProfileCheck";
import MyServiceMenu from "./MyServiceMenu";
import AddService from "../components/services/AddService";
import AcccSettingsMenu from "./AcccSettingsMenu";
import PasswordChange from "./PasswordChange";
import LogOutAll from "./LogOutAll";
import DeleteAcc from "./DeleteAcc";
import ProtectedRoutes from "../components/Routes/ProtectedRoutes";
import MyServiceDetails from "../components/services/MyServiceDetails";
import SavedServices from "./SavedServices";
import DynamicBreadCrumbs from "./DynamicBreadCrumbs";
import ScrollToTop from "../utils/ScrollToTop";
import EditService from "../components/services/EditService";
import { NavigationProvider } from "../contexts/NavigationContext";

const Accounts = () => {
  return (
    <NavigationProvider>
      <div className="p-0 m-0">
        <ScrollToTop />
        <DynamicBreadCrumbs />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            {/* These are all relative paths, because Accounts component is mounted at /accounts */}
            <Route path="/" element={<AccountTabs />} />
            <Route path="profile-check" element={<ProfileCheck />} />
            <Route path="personal-info" element={<PersonalInfo />} />
            {/* Service Menu */}
            <Route path="my-service-menu" element={<MyServiceMenu />} />
            <Route
              path="my-service-menu/add-service-form"
              element={<AddService />}
            />
            <Route path="add-service-form" element={<AddService />} />
            <Route
              path="my-service-menu/my-services"
              element={<MyServices />}
            />
            <Route
              path="my-service-menu/saved-services"
              element={<SavedServices />}
            />
            <Route
              path="my-service-menu/my-services/:serviceId"
              element={<MyServiceDetails />}
            />
            <Route
              path="my-service-menu/my-services/:serviceId/edit-service"
              element={<EditService />}
            />
            <Route
              path="my-service-menu/my-services/edit-single-service/:serviceId"
              element={<EditService />}
            />
            <Route
              path="my-service-menu/my-services/details/:serviceId/edit-single-service/:serviceId"
              element={<EditService />}
            />
            {/* <Route
              path="my-service-menu/my-services/details/edit-service/:serviceId"
              element={<EditService />}
            /> */}
            <Route
              path="my-service-menu/my-services/details/:serviceId/edit-service/"
              element={<EditService />}
            />
            /accounts/my-service-menu/my-services/details/edit-service
            {/* Account Settings */}
            <Route
              path="account-settings-menu"
              element={<AcccSettingsMenu />}
            />
            <Route
              path="account-settings-menu/change-password"
              element={<PasswordChange />}
            />
            <Route
              path="account-settings-menu/log-out-all"
              element={<LogOutAll />}
            />
            <Route
              path="account-settings-menu/delete-acc"
              element={<DeleteAcc />}
            />
          </Route>
        </Routes>
      </div>
    </NavigationProvider>
  );
};

export default Accounts;
