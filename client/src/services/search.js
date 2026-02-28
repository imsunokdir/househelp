import axiosInstance from "./axiosInstance";

export const searchServices = ({
  keyword,
  longitude,
  latitude,
  page = 1,
  limit = 10,
}) =>
  axiosInstance.post("/service/search", {
    keyword,
    longitude,
    latitude,
    page,
    limit,
  });
