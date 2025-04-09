import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadBalls from "../LoadingSkeleton/LoadBalls";

const ProtectedRoutes = () => {
  const { isAuth, authLoading } = useContext(AuthContext);
  const location = useLocation();

  // If loading, show the loading indicator
  if (authLoading) {
    return <LoadBalls />;
  }

  // If not authenticated, redirect to login
  if (!isAuth) {
    return (
      <Navigate to="/user-auth/login" state={{ from: location }} replace />
    );
  }

  // If authenticated, render the protected routes
  return <Outlet />;
};

export default ProtectedRoutes;
