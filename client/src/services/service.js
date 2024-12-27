import axios from "axios";
// const api = import.meta.env.VITE_API_ROUTE;
import axiosInstance from "./axiosInstance";

export const fetchServiceByCategory = async (
  categoryId,
  page,
  limit,
  longitude,
  latitude,
  filterData,
  cancelToken
) => {
  try {
    const response = await axiosInstance.post(
      `/service/get-nearby-services/${categoryId}`,
      {
        page,
        limit,
        longitude,
        latitude,
        filterData,
      },
      {
        cancelToken: cancelToken, // Pass the cancelToken in the request options
      }
    );
    return response; // Return the response if request is successful
  } catch (error) {
    // Handle cancellation or other errors
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      throw error; // Rethrow the error to handle it outside (e.g., in the component)
    }
  }
};

export const fetchFilteredServices = async (filterData) => {
  const { categoryId, filterOptions, userLocation } = filterData;
  const latitude = userLocation.coordinates[0];
  const longitude = userLocation.coordinates[1];
  console.log("filter options:", filterOptions);

  const response = await axiosInstance.get(
    `/service/filter-services/${categoryId}?longitude=${longitude}&latitude=${latitude}&filterOptions=${filterOptions}`
  );

  return response;
};

export const fetchServiceById = async (serviceId) =>
  await axiosInstance.get(`/service/get-service/${serviceId}`);

export const getMyServices = async () =>
  await axiosInstance.get(`/service/my-services`, {});

export const createService = async (formDataToSend) => {
  return await axiosInstance.post(`/service/register-service`, formDataToSend);
};

export const updateService = async (formDataToSend) =>
  await axiosInstance.post(`/service/update-service`, formDataToSend);

export const deleteService = async (serviceId) =>
  await axiosInstance.delete(`/service/delete-service/${serviceId}`);

export const updateServiceViews = async (serviceId) =>
  await axiosInstance.put(`/service/views/inc`, { serviceId });
