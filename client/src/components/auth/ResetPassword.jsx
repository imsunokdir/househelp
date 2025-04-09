import React, { useEffect, useState } from "react";
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
  Grow,
  Fade,
  Link,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PasswordChangeSuccess from "../../pages/PasswordChangeSuccess";
import { resetThePassword } from "../../services/user";
import { CheckIcon } from "lucide-react";
// import { resetPassword } from "../services/user"; // Your API call here

const theme = createTheme();

const ResetPassword = () => {
  const navigate = useNavigate();
  const { verifiedToken } = useParams(); // Assuming you're passing the token in the URL
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [isPassChangeSuccess, setIsPassChangeSuccess] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (
      passwords.newPassword.length >= 6 &&
      passwords.newPassword === passwords.confirmPassword
    ) {
      setIsPasswordMatched(true);
    } else {
      setIsPasswordMatched(false);
    }
  }, [passwords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsPasswordChanging(true);
      setIsError(null);

      // Replace with your API call
      const response = await resetThePassword({
        token: verifiedToken,
        newPassword: passwords.confirmPassword,
      });

      if (response.status) {
        setIsPassChangeSuccess(true);
      } else {
        const data = await response.json();
        setIsError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setIsError("Something went wrong. Please try again later.");
    } finally {
      setIsPasswordChanging(false);
    }
  };

  return (
    <div className="flex justify-center">
      {isPassChangeSuccess ? (
        <div className="p-4">
          <div className="flex justify-center  h-[70px]">
            <div className="flex justify-center items-center">
              <Grow in>
                <div
                  className="bg-green-300 p-3"
                  style={{ borderRadius: "50%" }}
                >
                  <CheckIcon />
                </div>
              </Grow>
            </div>
          </div>
          <div>
            <Fade in timeout={1000}>
              <div>
                <p className="m-0">Password changed successfully!!</p>
                <p className="m-0">
                  Go to{" "}
                  <Link href="/user-auth/login" className="cursor-pointer">
                    Log In
                  </Link>
                </p>
              </div>
            </Fade>
          </div>
        </div>
      ) : (
        <div className="w-full h-auto sm:w-[500px] md:w-[600px] lg:w-[800px] p-4 shadow-md">
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
                onSubmit={handleSubmit}
              >
                <Typography component="h1" variant="h5">
                  Reset Your Password
                </Typography>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />

                <div className="w-full h-[20px]">
                  {passwords.newPassword &&
                    passwords.confirmPassword &&
                    !isPasswordMatched && (
                      <p className="text-red-500 text-[14px] italic">
                        *Passwords must match and be at least 6 characters long
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
                    <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                {isError && (
                  <div className="w-full">
                    <p className="text-red-500">{isError}</p>
                  </div>
                )}
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      )}
    </div>
  );

  return isPassChangeSuccess ? (
    <div className="p-4">
      <div className="flex justify-center  h-[70px]">
        <div className="flex justify-center items-center">
          <Grow in>
            <div className="bg-green-300 p-3" style={{ borderRadius: "50%" }}>
              <CheckIcon />
            </div>
          </Grow>
        </div>
      </div>
      <div>
        <Fade in timeout={1000}>
          <div>
            <p className="m-0">Password changed successfully!!</p>
            <p className="m-0">
              Go to{" "}
              <Link href="/user-auth/login" className="cursor-pointer">
                Log In
              </Link>
            </p>
          </div>
        </Fade>
      </div>
    </div>
  ) : (
    <div className="flex justify-center">
      <div className="w-full h-auto sm:w-[500px] md:w-[600px] lg:w-[800px] p-4 shadow-md">
        {!isPassChangeSuccess ? (
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
                onSubmit={handleSubmit}
              >
                <Typography component="h1" variant="h5">
                  Reset Your Password
                </Typography>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                />

                <div className="w-full h-[20px]">
                  {passwords.newPassword &&
                    passwords.confirmPassword &&
                    !isPasswordMatched && (
                      <p className="text-red-500 text-[14px] italic">
                        *Passwords must match and be at least 6 characters long
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
                    <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                {isError && (
                  <div className="w-full">
                    <p className="text-red-500">{isError}</p>
                  </div>
                )}
              </Box>
            </Container>
          </ThemeProvider>
        ) : (
          <PasswordChangeSuccess />
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
