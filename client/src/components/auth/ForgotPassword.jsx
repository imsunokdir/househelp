import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { Divider } from "antd";
// import { Link as Lk } from "@mui/material";
import React, { useState } from "react";
import { LogInIcon } from "lucide-react";
import { sendResetPasswordLink } from "../../services/user";
// import resetPasswordImage from "../.././assets/reset-password.png";
import { Link, useNavigate } from "react-router-dom";
import { RestartAlt } from "@mui/icons-material";
import { replace } from "lodash";

const theme = createTheme();

const ForgotPassword = () => {
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await sendResetPasswordLink({ email });
      if (response.status === 200) {
        // setIsSending(false);
        setIsEmailSent(true);
        navigate("/email/if-there");
      }
    } catch (error) {
      console.log("There was an error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    // <div className="w-[400px] bg-green-500">
    //   <h2>Reset Password</h2>

    <ThemeProvider theme={theme}>
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
        {/* Heading with Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <RestartAlt sx={{ fontSize: 30 }} />
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
        </Box>

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
          type="email"
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
            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
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
      </Box>
    </ThemeProvider>

    // </div>
  );
};

export default ForgotPassword;
