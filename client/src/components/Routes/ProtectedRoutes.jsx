import React, { useContext } from "react";
import { AuthContext, AuthProvider } from "../../contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ChartLine } from "lucide-react";

const ProtectedRoutes = ({ children }) => {
  const { isAuth } = useContext(AuthContext);
  const location = useLocation();

  console.log("isAuth:", isAuth);
  if (!isAuth) {
    return (
      <Navigate to="/user-auth/login" state={{ from: location }} replace />
    );
  }
  return <Outlet />;
};

export default ProtectedRoutes;
