import React from "react";
import { useParams } from "react-router-dom";
import emailImg from "../../assets/emailicon1.png";

const EmailVrfSent = () => {
  const { userId, email } = useParams();
  return (
    <div className="p-4">
      <div className="flex justify-center">
        <img src={emailImg} style={{ width: "100px" }} />
      </div>

      <p>
        We have sent an email to <span className="text-blue-500">{email}</span>{" "}
        to verify your email address and activate your account.
      </p>
      <p>Please go to your email and activate your account.</p>
    </div>
  );
};

export default EmailVrfSent;
