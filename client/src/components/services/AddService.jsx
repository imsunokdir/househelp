import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../services/user";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import AddServiceForm from "./AddServiceForm";
import { Link } from "@mui/material";

const AddService = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState();

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
      {userLoading && <LoadBalls />}
      {user && user.isProfileCompleted ? (
        <AddServiceForm />
      ) : (
        <div>
          <p>
            You have not completed your profile, please complete your profile
            first before continuing
          </p>

          <p>
            <Link href="/accounts/personal-info">Go to profile</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default AddService;
