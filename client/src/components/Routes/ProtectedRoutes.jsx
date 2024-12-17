import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadBalls from "../LoadingSkeleton/LoadBalls";

const ProtectedRoutes = ({ children }) => {
  const { isAuth, authLoading } = useContext(AuthContext);
  const location = useLocation();
  console.log("isAuth:", isAuth);

  {
    authLoading ? (
      <LoadBalls />
    ) : !isAuth ? (
      <Navigate to="/user-auth/login" state={{ from: location }} replace />
    ) : (
      <Outlet />
    );
  }

  // if (!isAuth) {
  //   return (
  //     <Navigate to="/user-auth/login" state={{ from: location }} replace />
  //   );
  // }
  // return <Outlet />;
};

export default ProtectedRoutes;
