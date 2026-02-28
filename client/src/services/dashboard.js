import axiosInstance from "./axiosInstance";

export const fetchDashboardStats = () => axiosInstance.get(`/dashboard/stats`);

export const fetchDashboardActivity = () =>
  axiosInstance.get(`/dashboard/activity`);
