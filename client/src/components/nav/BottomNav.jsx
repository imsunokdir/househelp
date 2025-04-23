import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/AuthProvider";
import { replace } from "lodash";
import { Skeleton } from "antd";

const BottomNav = () => {
  const [isRegular, setIsRegular] = useState(false);
  const { user, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    setIsRegular(!isRegular);
  };

  const handleHomeClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14 px-2">
        {/* Home Button - Fixed Width */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center text-sm font-medium no-underline w-20 ${
            location.pathname === "/" ? "text-[#565edb]" : "text-gray-700"
          }`}
        >
          <FontAwesomeIcon icon={faHouse} size="xl" />
          <span>Home</span>
        </button>

        {/* Add Service Button - Stays Centered */}
        <Link
          to="/add-service"
          className="flex items-center justify-center w-20"
        >
          <button className="bg-orange-400 text-white rounded-full w-12 h-12 -mt-8 flex items-center justify-center shadow-lg border-2 border-blue-500">
            <FontAwesomeIcon icon={faPlus} size="xl" />
          </button>
        </Link>

        {/* Account/Login Button - Fixed Width */}
        {authLoading ? (
          <div className="flex flex-col items-center w-20 text-gray-400">
            <FontAwesomeIcon icon={faUser} size="xl" />
            <Skeleton.Button
              active
              size="small"
              shape="default"
              style={{ marginTop: 4, width: 40, height: 12 }}
            />
          </div>
        ) : user ? (
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `flex flex-col items-center text-sm font-medium no-underline w-20 ${
                isActive ? "text-[#565edb]" : "text-gray-700"
              }`
            }
          >
            <FontAwesomeIcon icon={faUser} size="xl" />
            <span>Accounts</span>
          </NavLink>
        ) : (
          <NavLink
            to="/user-auth/login"
            className={({ isActive }) =>
              `flex flex-col items-center text-sm font-medium no-underline w-20 ${
                isActive ? "text-[#565edb]" : "text-gray-700"
              }`
            }
          >
            <FontAwesomeIcon icon={faUser} size="xl" />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default BottomNav;
