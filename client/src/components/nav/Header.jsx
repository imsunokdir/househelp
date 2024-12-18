import React, { useContext, useState } from "react";
import "../../App.css";
import "./nav.css";
import MenuDropdown from "./MenuDropdown";
import { Link } from "react-router-dom";

import LocationModal from "./LocationModal";
import { Fade } from "@mui/material";
import hlp_logo from "../../assets/hlp_logo_t.png";

const Header = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    // <Fade in>
    <header className="main-header bg-gray-100 sticky top-0 w-full flex justify-between items-center py-2">
      <div className=" flex items-center gap-2">
        <Link to="/" className="ml-2">
          <Fade in={isLoaded} timeout={1000}>
            <div
              className="flex items-center"
              style={{ width: "50px", height: "50px" }}
            >
              <img src={hlp_logo} className="m-0" onLoad={handleImageLoad} />
            </div>
          </Fade>
        </Link>

        <LocationModal />
      </div>

      <div className="mr-5 flex items-center cursor-pointer gap-1 shadow-md p-1 rounded-full">
        <MenuDropdown />
      </div>
    </header>
    // </Fade>
  );
};

export default Header;
