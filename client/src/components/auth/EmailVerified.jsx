import { CircularProgress, Fade, Grow, Link } from "@mui/material";
import { CheckIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../../services/user";

const EmailVerified = () => {
  const { verifiedToken } = useParams();
  const [isVerifying, setIsVerifying] = useState(true);

  const handleVerification = async () => {
    try {
      const response = await verifyEmail(verifiedToken);
      if (response.status === 200) {
        setIsVerifying(false);
      }
    } catch (error) {
      console.log("There was error in verifying your email:", error);
    }
  };

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-center  h-[70px]">
        <div className="flex justify-center items-center">
          {isVerifying ? (
            <div className="p-3">
              <CircularProgress className="" />
            </div>
          ) : (
            <Grow in>
              <div className="bg-green-300 p-3" style={{ borderRadius: "50%" }}>
                <CheckIcon />
              </div>
            </Grow>
          )}
        </div>
      </div>
      <div>
        {isVerifying ? (
          <p>Verifying your email....</p>
        ) : (
          <Fade in timeout={1000}>
            <div>
              <p className="m-0">Email verification done..!!</p>
              <p className="m-0">
                Go to{" "}
                <Link href="/" className="cursor-pointer">
                  home page
                </Link>
              </p>
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default EmailVerified;
