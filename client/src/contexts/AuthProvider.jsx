import { createContext, useEffect, useState } from "react";
import { authCheck } from "../services/user";
import axios from "axios";
import { useCookies } from "react-cookie";
import Message from "../components/Messages/WarningMessage";
import { Slide, Snackbar } from "@mui/material";
import { message } from "antd";
import { getAllCategories } from "../services/category";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const mapApi = import.meta.env.VITE_MAP_API;
  const [user, setUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLocationLoading, setLocationLoading] = useState(true);
  const [isUserUpdated, setUserUpdated] = useState(false);
  const [cookies, setCookies] = useCookies(["user_location"]);
  const COOKIE_AGE = 1800;
  const [serviceLoading, setServiceLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const [deviceInfo, setDeviceInfo] = useState("");
  const [currentDevice, setCurrentDevice] = useState(null);

  //get all the categories
  // const [allCategories, setAllCategories] = useState([]);

  // const fetchAllCategories = async () => {
  //   {
  //     try {
  //       const response = await getAllCategories();
  //       if (response.status === 200) {
  //         const fetchedCategories = response.data.data;
  //         setAllCategories(fetchedCategories);
  //       }
  //     } catch (error) {
  //       console.log("category fetch error:", error);
  //     }
  //   }
  // };

  const [userLocation, setUserLocation] = useState({
    address: null,
    country: null,
    _normalized_city: null,
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

              if (data.results && data.results[0]) {
                const address = data.results[0].formatted;
                const _normalized_city =
                  data.results[0].components._normalized_city;
                const country = data.results[0].components.country;
                const county = data.results[0].components.county;
                const road = data.results[0].components.road;
                const district = data.results[0].components.state_district;

                // Set the location data
                setUserLocation((prev) => ({
                  ...prev,
                  address,
                  _normalized_city,
                  county,
                  road,
                  coordinates: [longitude, latitude],
                  country,
                  district,
                }));

                const user_location = {
                  address,
                  _normalized_city,
                  coordinates: [longitude, latitude],
                  country,
                  county,
                  road,
                  district,
                };

                // console.log("user_location:", user_location);
                // Set location in local storage

                localStorage.setItem(
                  "user_location",
                  JSON.stringify(user_location)
                );

                //set location in cookie
                setCookies(
                  "user_location",
                  JSON.stringify({
                    address,
                    coordinates: [longitude, latitude],
                    _normalized_city,
                    country,
                    road,
                    county,
                    district,
                  }),
                  {
                    path: "/",
                    maxAge: COOKIE_AGE,
                  }
                );

                setLocationLoading(false);

                resolve({
                  address,
                  coordinates: [longitude, latitude],
                  _normalized_city,
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
      // console.log("country response data:", response);
      if (response.status === 200) {
        //set location in state
        setUserLocation((prev) => ({
          ...prev,
          country: response.data.country_name,
          coordinates: [response.data.longitude, response.data.latitude],
        }));
        // Set location in local storage

        const user_location = {
          address: "",
          country: response.data.country_name,
          coordinates: [response.data.longitude, response.data.latitude],
        };
        localStorage.setItem(
          "aprx_user_location",
          JSON.stringify(user_location)
        );
        setCookies(
          "user_location",
          JSON.stringify({
            address: "",
            country: response.data.country_name,
            coordinates: [response.data.longitude, response.data.latitude],
          }),
          {
            path: "/",
            maxAge: COOKIE_AGE,
          }
        );
        // setLocationLoading(false);
      }
    } catch (error) {
      console.log("country error:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const getLoc = async () => {
    setLocationLoading(true);

    // If we already have user_location in cookies
    if (cookies?.user_location?.address) {
      // Save to localStorage if needed
      localStorage.setItem(
        "aprx_user_location",
        JSON.stringify(cookies.user_location)
      );

      // Set location in state from cookie
      setUserLocation((prev) => ({
        ...prev,
        ...cookies.user_location,
      }));

      setLocationLoading(false);
      return;
    }

    // If no cookie, try geolocation
    try {
      await getLocation(); // This already sets loading false on success/fail
    } catch (error) {
      if (error.code === 1) {
        // User denied location — fallback to IP-based
        await fetchCountry(); // Don't forget to set loading false here too
      } else {
        console.log("Other location error:", error);
        setLocationLoading(false);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const response = await authCheck();

        if (response.status === 200 && response.data.success) {
          // console.log("resp.data.user:", response.data.user);
          setUser(response.data.user);
          setCurrentDevice(response.data.userAgent.deviceId);
        }
        // else {
        //   console.log("User not authenticated");
        // }
      } catch (error) {
        console.log("auth check error:", error);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
    getLoc();
    // fetchAllCategories();
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
        isUserUpdated,
        setUserUpdated,
        serviceLoading,
        setServiceLoading,
        // allCategories,
        authLoading,
        deviceInfo,
        setDeviceInfo,
        currentDevice,
        setCurrentDevice,
      }}
    >
      {children}
      {contextHolder}
      <div></div>
    </AuthContext.Provider>
  );
};
export { AuthProvider, AuthContext };
