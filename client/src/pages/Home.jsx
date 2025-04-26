import React, { useCallback, useContext, useEffect, useState } from "react";
import NavigationTabs from "../components/nav/NavigationTabs";
import "./pages.css";
import Filter from "../components/Filters/Filter";
import Services from "./Services";
import Search from "../components/forms/Search";
import Services2 from "./Services2";
import Services3 from "./Services3";
import { AuthContext } from "../contexts/AuthProvider";
import { Route, Routes } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* <Search /> */}
      <div className="navigation sticky top-[55px] z-10 w-full   flex items-center  shadow-md bg-white">
        <NavigationTabs />
        <Filter />
        {/* <FilterDialog /> */}
      </div>

      {/* <Services /> */}

      <Routes>
        <Route path="/services/:categoryId" element={<Services3 />} />
        <Route path="/" element={<Services3 />} />
      </Routes>
      {/* <Services2 /> */}
      <div className="bg-white-200 h-[400px]"></div>
    </>
  );
};

export default Home;
