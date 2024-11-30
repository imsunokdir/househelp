import React from "react";
import AccountTabs from "./AccountTabs";
import { Route, Routes } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import MyServices from "../components/services/MyServices";
const Accounts = () => {
  return (
    <div className=" p-4">
      <Routes>
        <Route path="/" element={<AccountTabs />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/my-services" element={<MyServices />} />
      </Routes>
    </div>
  );
};

export default Accounts;
