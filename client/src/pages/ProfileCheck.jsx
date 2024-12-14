import React, { useEffect, useState } from "react";
import { getUserDetails } from "../services/user";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";

const ProfileCheck = () => {
  const [user, setUser] = useState();
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setUserLoading(true);
    try {
      const response = await getUserDetails();
      console.log("res res", response);
      const user = response.data.user;
      setUser(user);
      if (user.isProfileCompleted) {
        navigate("/accounts/add-service-form");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      {userLoading ? (
        <LoadBalls />
      ) : (
        !user.isProfileCompleted && (
          <div>
            <p>
              You have not completed your profile, please complete your profile
              first before continuing
            </p>

            <p>
              <Link href="/accounts/personal-info">Go to profile</Link>
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ProfileCheck;
