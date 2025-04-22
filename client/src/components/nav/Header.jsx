import React, { useContext, useState } from "react";
import "../../App.css";
import "./nav.css";
import MenuDropdown from "./MenuDropdown";
import { Link } from "react-router-dom";

import LocationModal from "./LocationModal";
import { Fade } from "@mui/material";
import hlp_logo from "../../assets/hlp_logo_t.png";
import BottomNav from "./BottomNav";

const Header = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <>
      <header className="main-header sticky top-0 w-full flex justify-between items-center py-2 bg-gray-100">
        <div className="flex gap-2 p-1 w-full items-center justify-between sm:justify-start">
          <Link to="/" className="ml-2 ">
            <Fade in={isLoaded} timeout={1000}>
              <div className="w-[50px] h-[50px]">
                <div
                  className="flex items-center "
                  style={{ width: "100%x", height: "100%" }}
                >
                  <img
                    src={hlp_logo}
                    className="m-0"
                    onLoad={handleImageLoad}
                  />
                </div>
              </div>
            </Fade>
          </Link>

          <div className="bg-red">
            {" "}
            <LocationModal />
          </div>
        </div>

        {/* MenuDropdown visible only on sm and above */}
        <div className="mr-5 flex items-center cursor-pointer shadow-md hover:shadow-lg p-1 rounded-full hidden sm:flex">
          <MenuDropdown />
        </div>
      </header>

      {/* Show BottomNav only on smaller screens */}
      <div className="sm:hidden">
        <BottomNav />
      </div>
    </>
  );
};

export default Header;
