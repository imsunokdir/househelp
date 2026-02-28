import axiosInstance from "./axiosInstance";

export const boostService = (serviceId, plan) =>
  axiosInstance.post(`/boost/activate`, { serviceId, plan });

export const cancelBoost = (serviceId) =>
  axiosInstance.post(`/boost/deactivate`, { serviceId });
