import React, { useContext, useState } from "react";
import "../../App.css";
import "./nav.css";
import MenuDropdown from "./MenuDropdown";
import { Link } from "react-router-dom";
import LocationModal from "./LocationModal";
import { Fade } from "@mui/material";
import hlp_logo from "../../assets/hlp_logo_t.png";
import BottomNav from "./BottomNav";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import { openChat } from "../../reducers/chatSlice";
import { AuthContext } from "../../contexts/AuthProvider";
import NotificationBell from "../notifications/NotificationBell";

const Header = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const totalUnread = useSelector((state) =>
    state.chat.conversations.reduce(
      (sum, c) => sum + (c.myUnreadCount || 0),
      0,
    ),
  );

  return (
    <>
      <header className="main-header sticky top-0 w-full flex justify-between items-center py-2 bg-gray-100 z-30">
        {/* Left — Logo + Location */}
        <div className="flex gap-2 p-1 w-full items-center justify-between sm:justify-start">
          <Link
            to="/"
            className="ml-2"
            onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
          >
            <Fade in={isLoaded} timeout={1000}>
              <div className="w-[50px] h-[50px]">
                <div
                  className="flex items-center"
                  style={{ width: "100%", height: "100%" }}
                >
                  <img
                    src={hlp_logo}
                    className="m-0"
                    onLoad={() => setIsLoaded(true)}
                  />
                </div>
              </div>
            </Fade>
          </Link>
          <div className="bg-red">
            <LocationModal />
          </div>
        </div>

        {/* Right — Chat button + Menu */}
        <div className="mr-5 flex items-center gap-2">
          {/* Messages button */}
          {user && (
            <div className="flex items-center gap-1">
              <NotificationBell />
              <button
                onClick={() => dispatch(openChat())}
                className="relative p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <MessageSquare size={22} className="text-gray-600" />
                {totalUnread > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Menu — desktop only */}
          <div className="cursor-pointer shadow-md hover:shadow-lg p-1 rounded-full hidden sm:flex">
            <MenuDropdown />
          </div>
        </div>
      </header>

      {/* Bottom nav — mobile only */}
      <div className="sm:hidden">
        <BottomNav />
      </div>
    </>
  );
};

export default Header;
