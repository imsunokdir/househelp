import React, { useContext, useEffect, useState } from "react";
import { getActiveSessions, logOutAll, logoutSession } from "../services/user";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Paper,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import { AuthContext } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import DevicesIcon from "@mui/icons-material/Devices";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ComputerIcon from "@mui/icons-material/Computer";
import TabletIcon from "@mui/icons-material/Tablet";

const LogOutAll = () => {
  const { setUser, currentDevice } = useContext(AuthContext);
  const [activeSessions, setActiveSessions] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loggingOutSession, setLoggingOutSession] = useState(null);
  const [isActiveSessionLoading, setActiveSessionsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActiveSessions = async () => {
    try {
      const response = await getActiveSessions();
      if (response.status === 200) {
        console.log("res res:", response);
        const sortedSessions = response.data.activeSessions.sort((a, b) => {
          if (
            a.session.userAgent.deviceId === currentDevice &&
            b.session.userAgent.deviceId !== currentDevice
          )
            return -1;
          if (
            b.session.userAgent.deviceId === currentDevice &&
            a.session.userAgent.deviceId !== currentDevice
          )
            return 1;
          return a.session.userAgent.ua.localeCompare(b.session.userAgent.ua);
        });
        setActiveSessions(sortedSessions);
      }
    } catch (error) {
      console.log("Error fetching active sessions:", error);
    } finally {
      setActiveSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [currentDevice]);

  const handleLogOutAll = async () => {
    try {
      setIsLoggingOut(true);
      const response = await logOutAll();
      if (response.status === 200) {
        setActiveSessions([]);
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.log("Logout all error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogOutSession = async (sessionId) => {
    console.log("session id:", sessionId);
    try {
      setLoggingOutSession(sessionId);
      const response = await logoutSession(sessionId);
      if (response.status === 200) {
        fetchActiveSessions();
      }
    } catch (error) {
      console.log("Logout session error:", error);
    } finally {
      setLoggingOutSession(null);
    }
  };

  const getDeviceIcon = (userAgent) => {
    const ua = userAgent.ua.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android")) {
      return <PhoneAndroidIcon />;
    } else if (ua.includes("tablet") || ua.includes("ipad")) {
      return <TabletIcon />;
    } else {
      return <ComputerIcon />;
    }
  };

  useEffect(() => {
    console.log("Active sessions:", activeSessions);
  }, [activeSessions]);

  const getDeviceName = (userAgent) => {
    const ua = userAgent.ua;
    let deviceInfo = "Unknown Device";
    if (ua.includes("iPhone")) {
      deviceInfo = "iPhone";
    } else if (ua.includes("iPad")) {
      deviceInfo = "iPad";
    } else if (ua.includes("Android")) {
      const androidMatch = ua.match(/Android .+?;.+?([\w\s]+)\s+Build/);
      if (androidMatch && androidMatch[1]) {
        deviceInfo = androidMatch[1].trim();
      } else {
        deviceInfo = "Android Device";
      }
    } else if (ua.includes("Windows")) {
      deviceInfo = "Windows PC";
    } else if (ua.includes("Macintosh")) {
      deviceInfo = "Mac";
    } else if (ua.includes("Linux")) {
      deviceInfo = "Linux Device";
    }
    return deviceInfo;
  };

  return isActiveSessionLoading ? (
    <LoadBalls />
  ) : (
    <Box className="p-4" sx={{ maxWidth: 800, mx: "auto" }}>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 2, border: "none", boxShadow: "none" }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <DevicesIcon sx={{ mr: 1 }} /> Active Sessions
        </Typography>

        {activeSessions && activeSessions.length > 0 ? (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You have {activeSessions.length} active{" "}
              {activeSessions.length > 1 ? "sessions" : "session"}.
            </Typography>

            <List sx={{ width: "100%" }}>
              {activeSessions.map((session, index) => {
                const isCurrentDevice =
                  session.session.userAgent.deviceId === currentDevice;
                const deviceName = getDeviceName(session.session.userAgent);

                return (
                  <React.Fragment key={session._id}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <Paper
                      elevation={isCurrentDevice ? 2 : 0}
                      sx={{
                        p: 2,
                        backgroundColor: isCurrentDevice
                          ? "rgba(76, 175, 80, 0.1)"
                          : "transparent",
                        border: isCurrentDevice
                          ? "1px solid rgba(76, 175, 80, 0.5)"
                          : "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: 2,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ mr: 2 }}>
                            {getDeviceIcon(session.session.userAgent)}
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={isCurrentDevice ? "bold" : "normal"}
                          >
                            {deviceName}
                          </Typography>
                        </Box>

                        {isCurrentDevice && (
                          <Chip
                            label="Current Device"
                            color="success"
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Full User Agent: {session.session.userAgent.ua}
                      </Typography>

                      {!isCurrentDevice && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          Last active:{" "}
                          {new Date(
                            session.session.lastActive
                          ).toLocaleString()}
                        </Typography>
                      )}

                      {!isCurrentDevice && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<LogoutIcon />}
                          onClick={() => handleLogOutSession(session._id)}
                          disabled={loggingOutSession === session._id}
                          sx={{ mt: 1 }}
                        >
                          {loggingOutSession === session._id ? (
                            <CircularProgress size="1.5rem" color="error" />
                          ) : (
                            "Logout from this device"
                          )}
                        </Button>
                      )}
                    </Paper>
                  </React.Fragment>
                );
              })}
            </List>

            <Box
              sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogOutAll}
                disabled={isLoggingOut}
                sx={{ py: 1.5 }}
              >
                {isLoggingOut ? (
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                ) : (
                  "Log out of all devices"
                )}
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", fontSize: 16, py: 4 }}
          >
            You have no active sessions.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default LogOutAll;
