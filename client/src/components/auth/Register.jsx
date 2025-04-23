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
// import { Link as Lk } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";

import Grid from "antd/es/card/Grid";
import { Link, useNavigate } from "react-router-dom";
import { Button as AntdBtn, Divider, message, Space } from "antd";
import Message from "../Messages/WarningMessage";
import { LoginUser, registerUser } from "../../services/user";
import { AuthContext } from "../../contexts/AuthProvider";
import { UIContext } from "../../contexts/UIProvider";
import { GoogleOutlined } from "@ant-design/icons";

const theme = createTheme();

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, isAuth, setUser } = useContext(AuthContext);
  const { handleClose } = useContext(UIContext);
  const { messageApi } = useContext(UIContext);

  const navigate = useNavigate();

  //email and password related errors messages
  const [functions, setFunctions] = useState({});
  const [isGoogelLogginIn, setIsGoogleLogginIn] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const response = await registerUser({ email, username, password });
      console.log("registertration response:", response);
      if (response.status === 200) {
        const { email, _id } = response.data.user;
        navigate(`/email-verification/${_id}/${email}`);
      }
    } catch (error) {
      console.log("registration error", error);
      if (error.status === 409) {
        message.error(error.response.data.message);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleLogin = () => {};
  return (
    <div className="">
      <Message onMessage={setFunctions} />
      <h2>
        {/* <Lk href="/email-verification">ok</Lk> */}
        Register
      </h2>
      <ThemeProvider theme={theme}>
        {/* <Container component="main" maxWidth="xs"></Container> */}
        <CssBaseline />
        <Box
          sx={{
            // marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          component="form"
          onSubmit={handleRegister}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          {isRegistering ? (
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              type="submit"
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
              Register using Email and password
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
              Sign up with google
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
              Already a user?{" "}
              <Link to="/user-auth/login" replace>
                Sign in
              </Link>
            </p>

            <p className="m-0">
              <Link to="/user-auth/forgot-password" replace>
                Forgot Password
              </Link>
            </p>
          </div>
        </Box>
        <Message onMessage={setFunctions} />
      </ThemeProvider>
    </div>
  );
};

export default Register;
