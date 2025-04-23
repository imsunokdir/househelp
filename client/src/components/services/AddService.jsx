import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../services/user";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import AddServiceForm from "./AddServiceForm";
// import { Link } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddService = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setUserLoading(true);
    try {
      const response = await getUserDetails();
      const user = response.data.user;
      setUser(user);
      if (user.isProfileCompleted) {
        navigate("/accounts/my-service-menu/add-service-form", {
          replace: true,
        });
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

      {user &&
        (user.isProfileCompleted ? (
          <AddServiceForm />
        ) : (
          <div className="p-4">
            <p>
              You have not completed your profile, please complete your profile
              first before continuing
            </p>

            <p>
              <Link to="/accounts/personal-info">Go to profile</Link>
            </p>
          </div>
        ))}
    </div>
  );
};

export default AddService;
