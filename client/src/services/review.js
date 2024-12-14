const api = import.meta.env.VITE_API_ROUTE;
import axiosInstance from "./axiosInstance";

export const getRatingDistribution = async (serviceId) =>
  await axiosInstance.get(`/rating/rating-distribution/${serviceId}`);
