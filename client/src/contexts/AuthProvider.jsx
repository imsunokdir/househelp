import { createContext, useEffect, useState } from "react";
import { authCheck } from "../services/user";
import axios from "axios";
import Message from "../components/Messages/WarningMessage";
import { Slide, Snackbar } from "@mui/material";
import { message } from "antd";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const mapApi = import.meta.env.VITE_MAP_API;
  const [user, setUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLocationLoading, setLocationLoading] = useState(true);

  const [userLocation, setUserLocation] = useState({
    address: null,
    country: null,
    coordinates: [null, null],
  });

  const [openSnackbar, setSnackbar] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(false);
  };

  const getLocation = async () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      console.log("Your browser does not support geolocation.");
      throw new Error("Geolocation is not supported by this browser.");
    }

    // Wrap geolocation in a promise to make it async/await compatible
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${mapApi}`
            );
            if (response.ok) {
              const data = await response.json();
              // console.log(data);

              if (data.results && data.results[0]) {
                const address = data.results[0].formatted;
                const country = data.results[0].components.country;

                // Set the location data
                setUserLocation((prev) => ({
                  ...prev,
                  address,
                  coordinates: [longitude, latitude],
                  country,
                }));
                setLocationLoading(false);

                resolve({
                  address,
                  coordinates: [longitude, latitude],
                  country,
                });
              } else {
                setLocationLoading(false);
                reject(new Error("No results found from geocoding."));
              }
            } else {
              setLocationLoading(false);
              reject(new Error(`Geocoding API error: ${response.status}`));
            }
          } catch (error) {
            setLocationLoading(false);
            reject(
              new Error(`Error in fetching geocode data: ${error.message}`)
            );
          }
        },
        (error) => {
          console.log("Error in getting location:", error);
          setLocationLoading(false);
          reject(error);
        }
      );
    });
  };

  const fetchCountry = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json/");
      console.log("country response data:", response);
      if (response.status === 200) {
        setUserLocation((prev) => ({
          ...prev,
          country: response.data.country_name,
          coordinates: [response.data.longitude, response.data.latitude],
        }));
      }
    } catch (error) {
      console.log("country error:", error);
    }
  };

  // useEffect(() => {
  //   console.log("user location:", userLocation);
  // }, [userLocation]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authCheck();

        if (response.status === 200 && response.data.success) {
          setUser(response.data.user);
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.log("auth check error:", error);
      }
    };
    checkAuth();
    // fetchCountry();
    getLocation()
      .then(() => {})
      .catch((error) => {
        if (error.code === 1) {
          fetchCountry();
        }
      });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuth: !!user,
        userLocation,
        setUserLocation,
        getLocation,
        openSnackbar,
        setSnackbar,
        handleSnackbarClose,
        isLocationLoading,
        setLocationLoading,
      }}
    >
      {children}
      {contextHolder}
      <div></div>
    </AuthContext.Provider>
  );
};
export { AuthProvider, AuthContext };
