import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./Register";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import ScrollToTop from "../../utils/ScrollToTop";

const AuthRootRoute = () => {
  useEffect(() => {
    // Add overflow-hidden to body on mount
    document.body.classList.add("overflow-hidden");

    // Clean up: remove it on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen py-8 md:py-16 bg-white">
      <ScrollToTop />
      <div className="w-full max-w-md p-4 rounded m-3 sm:border sm:shadow">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default AuthRootRoute;
