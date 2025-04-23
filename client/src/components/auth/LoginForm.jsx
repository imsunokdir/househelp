import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  Grow,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Link as Lk } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";

import Grid from "antd/es/card/Grid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button as AntdBtn, Divider, message, Space } from "antd";
import Message from "../Messages/WarningMessage";
import { LoginUser } from "../../services/user";
import { AuthContext } from "../../contexts/AuthProvider";
import { UIContext } from "../../contexts/UIProvider";
import { GoogleOutlined } from "@ant-design/icons";

const theme = createTheme();

const LoginForm = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, isAuth, setUser, setDeviceInfo } = useContext(AuthContext);
  const { handleClose } = useContext(UIContext);
  const { messageApi } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();
  //email and password related errors messages
  const [functions, setFunctions] = useState({});
  const [isGoogelLogginIn, setIsGoogleLogginIn] = useState(false);
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
        console.log(response);
        setIsLoggingIn(false);
        setLoginId("");
        setPassword("");
        handleClose();
        setDeviceInfo(response.data.ua);

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
    const state = encodeURIComponent(`redirectTo=${redirectTo}`); // encode the state

    window.location.href = `${
      import.meta.env.VITE_GOOGLE_REDIRECT
    }?state=${state}`; // Pass the state
  };
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs"></Container>
        <CssBaseline />
        <Box
          sx={{
            // marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          component="form"
          onSubmit={handleLogin}
        >
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
              disabled={true}
            >
              <CircularProgress
                size="1.5rem"
                sx={{
                  color: "white",
                }}
              />
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
            >
              <LoginIcon />
              Log in with Email and password
            </Button>
          )}
          <Divider className="m-0 p-0" />

          {isGoogelLogginIn ? (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={true}
            >
              <CircularProgress
                size="1.5rem"
                sx={{
                  color: "white",
                }}
              />
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleGoogleLogin}
            >
              <GoogleIcon />
              Log with google
              {/* <a href="http://localhost:8000/auth/google">GooGle</a> */}
            </Button>
          )}

          {/* <Grid container="true" className="bg-red-200">
            <Grid>
              <Lk>Forgot password</Lk>
            </Grid>
            <Grid>ok</Grid>
          </Grid> */}
          <div className="w-full flex justify-between">
            <p className="m-0">
              new user? <Lk href="/user-auth/register">Sign up</Lk>
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
              backgroundColor: "rgba(0, 0, 0, 0.3)", // Gray transparent overlay
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            {/* <div>Place your custom spinner here</div> */}
          </div>
        )}
      </ThemeProvider>
    </div>
  );
};

export default LoginForm;
