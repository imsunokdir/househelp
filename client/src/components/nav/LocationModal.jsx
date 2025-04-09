import * as React from "react";
import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  Fade,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationCrosshairs,
  faLocationDot,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/AuthProvider";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useCookies } from "react-cookie";
// test

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const LocationModal = () => {
  const {
    getLocation,
    setSnackbar,
    openSnackbar,
    handleSnackbarClose,
    isLocationLoading,
  } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  // location Related web storage
  const [cookies, setCookies] = useCookies(["user_location"]);
  const user_location = JSON.parse(localStorage.getItem("user_location"));

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
  const handleGetLocation = async () => {
    getLocation()
      .then((data) => {
        handleClose();
      })
      .catch((err) => {
        console.log("Error", err);
        if (err.code === 1) {
          setSnackbar(open);
        }
      });
  };

  const [locationDetails, setLocationDetails] = useState();

  return (
    <div className="mt-[10px]">
      <React.Fragment>
        <div
          className={`p-1 w-[120px] bg-red h-full underline rounded-full flex items-center gap-1 cursor-pointer  ${
            isLocationLoading ? "bg-gray-100 opacity-60" : ""
          }`}
          onClick={handleClickOpen}
        >
          <FontAwesomeIcon icon={faLocationDot} />
          <div className="overflow-hidden whitespace-nowrap w-full flex bg-blu">
            {isLocationLoading ? (
              <Fade in timeout={1000}>
                <span className="m-0 flex items-center justify-between">
                  <p className="m-0 text-[12px] italic">Fetching location</p>
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                </span>
              </Fade>
            ) : cookies?.user_location?.address ? (
              <p className="m-0 text-[15px] bg-green">
                {/* {cookies?.user_location?.address.slice(0, 28)}... */}
                {`${cookies?.user_location?._normalized_city}, ${cookies?.user_location?.country}`}
              </p>
            ) : (
              <p className="m-0 text-[15px]">
                {cookies?.user_location?.country}
              </p>
              // <p className="m-0 text-[12px]">Please select a location</p>
            )}
          </div>
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
              width: isSmallScreen ? "100%" : isMediumScreen ? "50%" : "80%",
              height: isSmallScreen ? "100%" : "50vh",
              maxWidth: "none",
            },
          }}
          id="scrrrr"
        >
          <Toolbar className="bg-gray-100">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
              className="flex items-center gap-2"
            >
              Choose your location
              <FontAwesomeIcon icon={faMapPin} size="sm" />
            </Typography>
          </Toolbar>

          <div
            className="h-full flex justify-center p-2"
            style={{
              overflowY: "auto", // Ensure it's scrollable
              border: "1px solid rgba(140, 140, 140, 0.35)",
              height: "100%", // Ensure it takes up full height
            }}
          >
            <div className=" flex flex-col">
              {/* <FontAwesomeIcon icon={faLocationDot} size="2xl" /> */}
              {cookies?.user_location?.address ? (
                <div className="flex gap-2 mb-2">
                  <div>
                    <FontAwesomeIcon icon={faLocationDot} size="sm" />
                  </div>
                  <div>{cookies.user_location.address}</div>
                </div>
              ) : (
                <p className="text-center italic text-red-400">
                  You have not set any location
                </p>
              )}
              <div className="flex flex-col mt-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ color: "#FFD43B" }}
                  size="2xl"
                  className="text-[45px]"
                />

                <p className="m-1 text-[15px] italic">
                  Select your location to see nearby service providers
                </p>
                <button
                  className={`p-2 rounded border shadow-sm  hover:bg-yellow-100 flex items-center gap-2 justify-center ${
                    isLocationLoading && "bg-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={handleGetLocation}
                >
                  <FontAwesomeIcon icon={faLocationCrosshairs} />
                  {isLocationLoading
                    ? "Fecthing location"
                    : "Use current location"}
                </button>
              </div>
            </div>
          </div>
          <Snackbar
            message="Please enable location in settings and try again..!!"
            open={openSnackbar}
            autoHideDuration={3000} // Closes after 3 seconds
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            TransitionComponent={SlideTransition}
            onClose={handleSnackbarClose}
            sx={{
              "& .MuiSnackbarContent-root": {
                backgroundColor: "#fecaca", // Red-100 shade from Tailwind (or customize as needed)
                color: "black", // Text color to contrast with red background
              },
              zIndex: 1400,
            }}
          />
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default LocationModal;
