import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
  Divider,
} from "@mui/material";
import { Link as Lk } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import { UIContext } from "../../contexts/UIProvider";
import { LoginUser } from "../../services/user";
import Message from "../Messages/WarningMessage";
import gIcon from "../../assets/google-icon.svg";

const theme = createTheme();

const LoginForm = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogelLogginIn, setIsGoogleLogginIn] = useState(false);
  const [functions, setFunctions] = useState({});

  const { setUser, setDeviceInfo, setCurrentDevice } = useContext(AuthContext);
  const { handleClose } = useContext(UIContext);
  const { messageApi } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const usAg = navigator.userAgent;

    try {
      const response = await LoginUser({ loginId, password, usAg });

      if (response.status === 200) {
        setUser(response.data.user);
        functions.success("Logged in successfully!");
        setIsLoggingIn(false);
        setLoginId("");
        setPassword("");
        handleClose();
        setDeviceInfo(response.data.ua);
        setCurrentDevice(response.data.userAgent.deviceId);
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (error.status === 404) {
        functions.error("User not found. Please check your login details");
      } else if (error.status === 401) {
        functions.warning("Email and password does not match");
      } else {
        functions.error("There was an error.");
        console.log("Erroror:", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLogginIn(true);
    const redirectTo = encodeURIComponent(from);
    const state = encodeURIComponent(`redirectTo=${redirectTo}`);
    window.location.href = `${
      import.meta.env.VITE_GOOGLE_REDIRECT
    }?state=${state}`;
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            component="form"
            onSubmit={handleLogin}
          >
            <Box
              sx={{
                display: "flex",
                // flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <LoginIcon
                sx={{ fontSize: 40, color: "#1976d2", marginRight: 1 }}
              />
              <Typography component="h1" variant="h5" fontWeight="bold">
                Login
              </Typography>
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="loginId"
              label="Email Address / username"
              name="loginId"
              autoComplete="login-id"
              autoFocus
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isLoggingIn ? (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled
              >
                <CircularProgress size="1.5rem" sx={{ color: "white" }} />
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
              >
                <LoginIcon sx={{ mr: 1 }} />
                Log in with Email and password
              </Button>
            )}

            <Divider className="m-0 p-0" />

            {isGoogelLogginIn ? (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled
              >
                <CircularProgress size="1.5rem" sx={{ color: "white" }} />
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                  mb: 2,
                  color: "#4285F4", // Google blue
                  borderColor: "#4285F4",
                  textTransform: "none",
                  fontWeight: 500,
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#4285F4",
                  },
                }}
                onClick={handleGoogleLogin}
              >
                {/* <GoogleIcon sx={{ mr: 1, color: "#EA4335" }} />{" "}
                 */}
                {/* Google red */}
                <img src={gIcon} style={{ height: "25px", width: "25px" }} />
                Sign up with Google
              </Button>
            )}

            <div className="w-full flex justify-between">
              <p className="m-0">
                New user? <Lk href="/user-auth/register">Sign up</Lk>
              </p>
              <p className="m-0">
                <Lk href="/user-auth/forgot-password">Forgot Password</Lk>
              </p>
            </div>
          </Box>

          <Message onMessage={setFunctions} />

          {(isLoggingIn || isGoogelLogginIn) && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              {/* Custom spinner or overlay goes here if needed */}
            </div>
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default LoginForm;
