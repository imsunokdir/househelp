import React, { act, useContext, useEffect, useState } from "react";
import { getActiveSessions, logOutAll } from "../services/user";
import { Button, CircularProgress } from "@mui/material";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import { AuthContext } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const LogOutAll = () => {
  const { setUser } = useContext(AuthContext);
  const [activeSessions, setActiveSessions] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isActiveSessionLoading, setActiveSessionsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActiveSessions = async () => {
    try {
      const response = await getActiveSessions();
      console.log("response:", response.data.activeSessions);
      if (response.status === 200) {
        setActiveSessions(response.data.activeSessions);
      }
    } catch (error) {
      console.log("response errrp:", error);
    } finally {
      setActiveSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true);
      const response = await logOutAll();

      if (response.status === 200) {
        setActiveSessions([]);
        setUser();
      }
    } catch (error) {
      console.log("logout all error");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return isActiveSessionLoading ? (
    <LoadBalls />
  ) : (
    <div>
      <div className="shadow-md p-2">
        {activeSessions && activeSessions.length > 0 ? (
          <div>
            <h2>
              You have {activeSessions.length} active{" "}
              {activeSessions.length > 1 ? "sessions" : "session"}
            </h2>

            <div>
              <ul className="flex flex-col gap-3">
                {activeSessions.map((session) => {
                  return (
                    <li style={{ listStyle: "disc" }} key={session._id}>
                      {session.session.userAgent.ua}
                    </li>
                  );
                })}
              </ul>
            </div>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
              onClick={handleLogOut}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <CircularProgress
                  size="1.5rem"
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Log out of all devices"
              )}
            </Button>
          </div>
        ) : (
          <div>You have no active session</div>
        )}
      </div>
    </div>
  );
};

export default LogOutAll;
