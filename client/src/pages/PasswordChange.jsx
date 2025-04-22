import React, { useContext, useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { Button as AntdBtn, Divider, message, Space } from "antd";
import {
  Password,
  PasswordRounded,
  PasswordTwoTone,
} from "@mui/icons-material";
import { changePassword } from "../services/user";
import PasswordChangeSuccess from "./PasswordChangeSuccess";
// import Message from "../Messages/WarningMessage";

const theme = createTheme();

const PasswordChange = () => {
  const [password, setPassword] = useState({
    currPassword: "",
    newPassword: "",
  });

  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [isPassChangeSuccess, setIsPassChangeSuccess] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (password.currPassword.length >= 6 && password.newPassword.length >= 6) {
      setIsPasswordMatched(true);
    } else {
      setIsPasswordMatched(false);
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPasswordChanging(true);
      setIsError(null);
      const response = await changePassword(password);
      console.log("response:", response);
      if (response.status === 200) {
        console.log("passowrd chages successfully");
        setIsPassChangeSuccess(true);
      }
    } catch (error) {
      console.log("error:", error);
      setIsError(error.response.data.message);
      setIsPassChangeSuccess(false);
    } finally {
      setIsPasswordChanging(false);
    }
  };
  return (
    <div className="flex justify-center p-4 px-3">
      <div className="w-full h-[320px] sm:w-[500px] md:w-[600px] lg:w-[800px] p-2 shadow-md">
        {!isPassChangeSuccess ? (
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
              onSubmit={handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="currPassword"
                label="Current Password"
                name="currPassword"
                autoComplete="currPassword"
                autoFocus
                type="password"
                value={password.currPassword}
                onChange={handlePasswordChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="newPassword"
                value={password.newPassword}
                onChange={handlePasswordChange}
              />

              <div className="w-full h-[20px]">
                {password.currPassword.length > 0 &&
                  password.newPassword.length > 0 &&
                  !isPasswordMatched && (
                    <p className="text-red-500 text-[14px] italic">
                      *password length must be of length greater than or equal
                      to 6
                    </p>
                  )}
              </div>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                type="submit"
                disabled={!isPasswordMatched || isPasswordChanging}
              >
                {isPasswordChanging ? (
                  <CircularProgress
                    size="1.5rem"
                    sx={{
                      color: "white",
                    }}
                  />
                ) : (
                  "Change Password"
                )}
              </Button>

              {isError && (
                <div className="w-full">
                  <p className="text-red-500">{isError}</p>
                </div>
              )}
              <Divider className="m-0 p-0" />

              <div className="w-full flex justify-between">
                <p className="m-0">
                  <Lk>Forgot Password</Lk>?
                </p>
              </div>
            </Box>
          </ThemeProvider>
        ) : (
          <PasswordChangeSuccess />
        )}
      </div>
    </div>
  );
};

export default PasswordChange;
