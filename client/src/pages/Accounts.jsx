import React from "react";
import AccountTabs from "./AccountTabs";
import { Route, Routes, useLocation } from "react-router-dom";
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

const Accounts = () => {
  const location = useLocation();

  // Hide settings menu on Change Password page
  const hideSettingsMenuRoutes = [
    "/accounts/account-settings-menu/change-password",
  ];
  const isSettingsMenuHidden = hideSettingsMenuRoutes.includes(
    location.pathname
  );

  return (
    <div className="p-4">
      <DynamicBreadCrumbs />

      {/* Conditionally render AcccSettingsMenu */}
      {/* {!isSettingsMenuHidden && <AcccSettingsMenu />} */}

      <Routes>
        {/* ProtectedRoutes --- user has to be logged in */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<AccountTabs />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/profile-check" element={<ProfileCheck />} />
          <Route path="/my-service-menu/*" element={<MyServiceMenu />} />
          <Route
            path="/account-settings-menu/*"
            element={<AcccSettingsMenu />}
          />
          <Route
            path="/account-settings-menu/change-password"
            element={<PasswordChange />}
          />

          <Route
            path="/account-settings-menu/log-out-all"
            element={<LogOutAll />}
          />
          <Route
            path="/account-settings-menu/delete-acc"
            element={<DeleteAcc />}
          />
          <Route path="/saved-services" element={<SavedServices />} />
          <Route
            path="/my-service/details/:serviceId"
            element={<MyServiceDetails />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default Accounts;
