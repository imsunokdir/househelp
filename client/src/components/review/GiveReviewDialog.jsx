import * as React from "react";
import { useState, useEffect } from "react";
import { Dialog, IconButton, Toolbar } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GiveReviewDialog = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screen size
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <div
        className="bg-green-200 w-32 p-2 cursor-pointer"
        onClick={handleClickOpen}
      >
        ok
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen={isSmallScreen} // Full screen for small screens
        fullWidth={!isSmallScreen} // Maintain full width for larger screens
        maxWidth={isSmallScreen ? false : "xl"} // Set max width for larger screens
        sx={{
          "& .MuiDialog-paper": {
            width: isSmallScreen ? "100%" : isMediumScreen ? "90%" : "80%",
            height: isSmallScreen ? "100vh" : "90vh",
            maxWidth: "none",
          },
        }}
        id="scrrrr"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <div
          className="h-full bg-red-200"
          id="scrollableTest"
          style={{
            overflowY: "auto", // Ensure it's scrollable
            border: "1px solid rgba(140, 140, 140, 0.35)",
            height: "100%", // Ensure it takes up full height
          }}
        ></div>
      </Dialog>
    </React.Fragment>
  );
};

export default GiveReviewDialog;
