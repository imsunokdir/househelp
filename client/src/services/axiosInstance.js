import axios from "axios";

const api = import.meta.env.VITE_API_ROUTE;

const axiosInstance = axios.create({
  baseURL: api,
  withCredentials: true,
  "Access-Control-Allow-Origin": import.meta.env.VITE_HOME_ROUTE,
});

// Add an interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Interceptor Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
