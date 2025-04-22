import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { forwardRef, useState, useEffect } from "react";
import { logoutUser } from "../services/user"; // Assuming you have a logout function
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { message } from "antd"; // Import antd message component
import { useNavigate } from "react-router-dom";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutDialog({
  handleLogoutClickClose,
  handleLogoutClickOpen,
  open,
  isLoading,
  setIsLoading,
}) {
  //   const [isLoading, setIsLoading] = useState(false); // Track the loading state
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  //   const [isBlurring, setIsBlurring] = useState(false); // Track the blur effect

  // Apply blur effect when logging out
  //   useEffect(() => {
  //     if (isLoading) {
  //       setIsBlurring(true);
  //     } else {
  //       setIsBlurring(false);
  //     }
  //   }, [isLoading]);

  // Handle the logout
  const handleLogout = async () => {
    setIsLoading(true); // Set loading to true when logout starts

    try {
      const response = await logoutUser();
      if (response.status === 200) {
        setIsLoading(false); // Set loading to false when logout is complete
        // setUser(null);
        // message.success("Logged out successfully!"); // Show success message
        handleLogoutClickClose();
        navigate("/", { replace: true });
        setTimeout(() => {
          // Then update auth state
          setUser(null);
          setIsLoading(false);
          message.success("Logged out successfully!");
        }, 50);
        // Navigate to home or login page
      }
    } catch (error) {
      console.log("logouterror:", error);
      setIsLoading(false); // Ensure loading is stopped even if there's an error
      message.error("Logout failed. Please try again!"); // Show error message
    }
  };

  return (
    <React.Fragment>
      {/* Add a class to blur the background */}
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {}} // Prevent closing the dialog
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Are you sure you want to log out?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You will be logged out of your account. Do you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutClickClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              color="primary"
              disabled={isLoading} // Disable logout button while loading
            >
              {isLoading ? (
                <div className="flex items-center">
                  <CircularProgress size={24} style={{ marginRight: "8px" }} />
                  Logging out...
                </div>
              ) : (
                "Logout"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </React.Fragment>
  );
}
