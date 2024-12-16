import React, { useContext, useEffect, useState } from "react";
import NavigationTabs from "../components/nav/NavigationTabs";
import "./pages.css";
import Filter from "../components/Filters/Filter";
import Services from "./Services";
import Search from "../components/forms/Search";
import { AuthContext } from "../contexts/AuthProvider";
import FullBackdrop from "../components/FullBackdrop";
import { UIContext } from "../contexts/UIProvider";
import WarningMessage from "../components/Messages/WarningMessage";
const Home = () => {
  return (
    <>
      <Search />
      <div className="navigation sticky top-[60px] z-10 w-full  flex items-center justify-between  shadow-md bg-white">
        <NavigationTabs />
        <Filter />
      </div>

      <Services />
    </>
  );
};

export default Home;
