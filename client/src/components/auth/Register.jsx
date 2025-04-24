import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

import Message from "../Messages/WarningMessage";
import { registerUser } from "../../services/user";
import { AuthContext } from "../../contexts/AuthProvider";
import { UIContext } from "../../contexts/UIProvider";
import gIcon from "../../assets/google-icon.svg";

const theme = createTheme();

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const { setUser } = useContext(AuthContext);
  const { messageApi } = useContext(UIContext);
  const navigate = useNavigate();

  const [functions, setFunctions] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const response = await registerUser({ email, username, password });
      if (response.status === 200) {
        const { email, _id } = response.data.user;
        navigate(`/email-verification/${_id}/${email}`);
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        message.error(error.response.data.message);
      } else {
        message.error("Something went wrong!");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   // Your Google login logic here
  //   setIsGoogleLoggingIn(true);
  //   // Example: simulate login
  //   setTimeout(() => setIsGoogleLoggingIn(false), 2000);
  // };

  const handleGoogleLogin = () => {
    setIsGoogleLoggingIn(true);
    const redirectTo = encodeURIComponent(from);
    const state = encodeURIComponent(`redirectTo=${redirectTo}`);
    window.location.href = `${
      import.meta.env.VITE_GOOGLE_REDIRECT
    }?state=${state}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Message onMessage={setFunctions} />

      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoginIcon sx={{ mr: 1 }} />
          <Typography component="h1" variant="h5" fontWeight="bold">
            Register
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
            disabled={isRegistering}
            startIcon={isRegistering ? null : <LoginIcon />}
          >
            {isRegistering ? (
              <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            ) : (
              "Register using Email and Password"
            )}
          </Button>

          <Divider>OR</Divider>

          {isGoogleLoggingIn ? (
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
              onClick={handleGoogleLogin}
              sx={{
                mt: 3,
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
            >
              <img
                src={gIcon}
                style={{ height: "25px", width: "25px", marginRight: "8px" }}
                alt="Google"
              />
              Sign up with Google
            </Button>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography variant="body2">
              Already a user?{" "}
              <Link to="/user-auth/login" replace>
                Sign in
              </Link>
            </Typography>

            <Typography variant="body2">
              <Link to="/user-auth/forgot-password" replace>
                Forgot Password
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
