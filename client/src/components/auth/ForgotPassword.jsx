import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { Divider } from "antd";
// import { Link as Lk } from "@mui/material";
import React, { useState } from "react";
import { LogInIcon } from "lucide-react";
import { sendResetPasswordLink } from "../../services/user";
import resetPasswordImage from "../.././assets/reset-password.png";
import { Link } from "react-router-dom";

const theme = createTheme();

const ForgotPassword = () => {
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await sendResetPasswordLink({ email });
      if (response.status === 200) {
        setIsSending(false);
        setIsEmailSent(true);
      }
    } catch (error) {
      console.log("There was an error");
    }
  };
  return isEmailSent ? (
    <div className="h-[400px] flex flex-col items-center justify-start pt-10 text-center w-full">
      <img
        src={resetPasswordImage}
        className="w-32 h-32 mb-4"
        alt="Reset Password"
      />
      <p>
        If an account with that email exists, a password reset link has been
        sent to your email. Please click on the Reset button to reset your
        password.
      </p>
    </div>
  ) : (
    <div className="w-[400px]">
      <h2>Reset Password</h2>
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
          onSubmit={handleSubmit}
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
          {isSending ? (
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
              Submit
            </Button>
          )}

          <Divider className="m-0 p-0" />

          {/* <div className="w-full flex justify-between">
            <p className="m-0">
              Already a user? <Link to="/user-auth/login">Sign in</Link>
            </p>
          </div> */}
        </Box>
        {/* <Message onMessage={setFunctions} /> */}
      </ThemeProvider>
    </div>
  );
};

export default ForgotPassword;
