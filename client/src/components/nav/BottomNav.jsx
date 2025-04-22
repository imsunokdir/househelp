import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/AuthProvider";

const BottomNav = () => {
  const [isRegular, setIsRegular] = useState(false);

  const { user } = useContext(AuthContext);

  const handleUserIconClick = () => {
    setIsRegular(!isRegular);
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14 px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm font-medium no-underline ${
              isActive ? "text-[#565edb]" : "text-gray-700"
            }`
          } //   className="flex flex-col items-center text-gray-700 text-sm font-medium"
        >
          <FontAwesomeIcon icon={faHouse} size="xl" />
          <span>Home</span>
        </NavLink>

        <Link to="/add-service">
          <button className="bg-orange-400 text-white rounded-full w-12 h-12 -mt-8 flex items-center justify-center shadow-lg border-2 border-blue-500">
            <FontAwesomeIcon icon={faPlus} size="xl" />
          </button>
        </Link>

        {user ? (
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `flex flex-col items-center text-sm font-medium no-underline ${
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
              `flex flex-col items-center text-sm font-medium no-underline ${
                isActive ? "text-[#565edb]" : "text-gray-700"
              }`
            }
          >
            <FontAwesomeIcon icon={faUser} size="xl" />
            <span>Login</span>
          </NavLink>
        )}
        {/* <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm font-medium no-underline ${
              isActive ? "text-[#565edb]" : "text-gray-700"
            }`
          }
        >
          <FontAwesomeIcon icon={faUser} size="xl" />
          <span>{user ? "Accounts" : "Login"}</span>
        </NavLink> */}
      </div>
    </div>
  );
};

export default BottomNav;
