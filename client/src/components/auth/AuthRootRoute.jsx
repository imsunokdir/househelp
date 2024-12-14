import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./Register";
import LoginForm from "./LoginForm";
import { Lock, LockKeyhole, Unlock } from "lucide-react";
import EmailVrfSent from "./EmailVrfSent";

const AuthRootRoute = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <div className=" md:w-[500px] shadow-md p-3 rounded border">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default AuthRootRoute;
