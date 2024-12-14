import React, { useContext, useState } from "react";
import "../../App.css";

import MenuDropdown from "./MenuDropdown";
import { Link } from "react-router-dom";

import LocationModal from "./LocationModal";
import { Fade } from "@mui/material";

const Header = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Fade in>
      <header className="main-header bg-gray-100 sticky top-0 w-full flex justify-between items-center p-1 py-2">
        <div className=" flex items-center p-1 gap-4">
          <Link to="/" className="ml-2">
            <Fade in={isLoaded} timeout={1000}>
              <div
                className="flex items-center gap-1 "
                style={{ width: "35px", height: "35px" }}
              >
                <img
                  src="/h_logo.svg"
                  className="m-0"
                  onLoad={handleImageLoad}
                />
              </div>
            </Fade>
          </Link>
          <LocationModal />
        </div>

        <div className="mr-5 flex items-center">
          <MenuDropdown />
        </div>
      </header>
    </Fade>
  );
};

export default Header;
