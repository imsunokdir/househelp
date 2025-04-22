import * as React from "react";
import { useState, useContext } from "react";
import {
  Dialog,
  Fade,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
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
import { useCookies } from "react-cookie";

// Transition for modal opening/closing
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LocationModal = () => {
  const {
    getLocation,
    setSnackbar,
    openSnackbar,
    handleSnackbarClose,
    isLocationLoading,
  } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(["user_location"]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log("gl:", cookies);

  const handleGetLocation = async () => {
    try {
      await getLocation();
      handleClose();
    } catch (err) {
      console.error("Error getting location:", err);
      setSnackbar(true);
    }
  };

  const hasLocation = cookies?.user_location?.address;

  return (
    <div>
      {/* Compact Location Button */}
      <div
        className={`flex h-10 border items-center gap-1 px-3 py-1 rounded-md cursor-pointer
    ${isLocationLoading ? "opacity-70 cursor-not-allowed" : ""}
    ${hasLocation ? "bg-white text-gray" : "bg-white text-gray-700"}
    hover:shadow-md transition-all w-36
    sm:mr-0 mr-3`}
        onClick={!isLocationLoading ? handleClickOpen : undefined}
      >
        <FontAwesomeIcon
          icon={faLocationDot}
          className={hasLocation ? "text-gray" : "text-blue-600"}
        />
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
          {isLocationLoading ? (
            <span className="flex items-center text-xs">
              <span>Locating</span>
              <CircularProgress size={14} className="ml-1" />
            </span>
          ) : hasLocation ? (
            <span
              className="text-sm md:text-base max-w-[140px] block overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ fontSize: "clamp(12px, 3vw, 16px)" }}
              title={
                cookies?.user_location?._normalized_city ||
                cookies?.user_location?.district ||
                cookies?.user_location?.road ||
                cookies?.user_location?.county
              }
            >
              {(cookies?.user_location?._normalized_city ||
                cookies?.user_location?.district ||
                cookies?.user_location?.road ||
                cookies?.user_location?.county) +
                (cookies?.user_location?.country
                  ? `, ${cookies.user_location.country}`
                  : "")}
            </span>
          ) : (
            <span className="text-xs">Set Location</span>
          )}
        </div>
      </div>

      {/* Compact Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen={isSmallScreen}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <Toolbar sx={{ p: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
            Location
          </Typography>
        </Toolbar>

        <div className="px-4 pb-4 pt-2 flex flex-col items-center">
          {/* Icon and Description */}
          <div className="mb-3 flex items-center">
            <FontAwesomeIcon icon={faMapPin} className="text-amber-500 mr-2" />
            <Typography variant="body2" color="textSecondary">
              Set your location for nearby services
            </Typography>
          </div>

          {/* Current Location Display */}
          {hasLocation ? (
            <div className="w-full p-2 mb-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-green-600 mt-1"
              />
              <div>
                <p className="text-sm font-medium">
                  {cookies.user_location?.address}
                </p>
                <p className="text-xs text-gray-500">
                  {`${
                    cookies?.user_location?._normalized_city ||
                    cookies?.user_location?.district ||
                    cookies?.user_location?.road ||
                    cookies?.user_location?.county ||
                    "Unknown location"
                  }, ${cookies?.user_location?.country || ""}`}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-500 mb-3">No location set</p>
          )}

          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={!isLocationLoading ? handleGetLocation : undefined}
            disabled={isLocationLoading}
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              py: 1,
            }}
          >
            {isLocationLoading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <span className="text-xs">Getting location...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLocationCrosshairs} className="mr-1" />
                <span className="text-sm">Use current location</span>
              </>
            )}
          </Button>
        </div>
      </Dialog>

      {/* Compact Snackbar */}
      <Snackbar
        message="Please enable location services and try again"
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
        onClose={handleSnackbarClose}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#f44336",
            fontSize: "0.875rem",
            borderRadius: "6px",
          },
        }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default LocationModal;
