import React from "react";
import resetPasswordImage from "../../assets/reset-password.png";
import { Button } from "@mui/material"; // If you're using MUI
import { useNavigate } from "react-router-dom";
import { replace } from "lodash";

const EmailIfThere = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/user-auth/forgot-password", { replace: true });
  };

  return (
    <div className="h-[400px] flex flex-col items-center justify-start pt-10 text-center w-full">
      <img
        src={resetPasswordImage}
        className="w-32 h-32 mb-4"
        alt="Reset Password"
      />
      <p className="max-w-md mb-4">
        If an account with that email exists, a password reset link has been
        sent to your email. Please click on the Reset button to reset your
        password.
      </p>
      <Button
        variant="contained"
        color="white"
        onClick={handleClick}
        sx={{ mt: 2, color: "gray" }}
      >
        Resend Email
      </Button>
    </div>
  );
};

export default EmailIfThere;
