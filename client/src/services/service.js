import axios from "axios";
// const api = import.meta.env.VITE_API_ROUTE;
import axiosInstance from "./axiosInstance";

// export const fetchServiceByCategory = async (
//   categoryId,
//   page,
//   limit,
//   longitude,
//   latitude,
//   filterData,
//   cancelToken
// ) => {
//   try {
//     const response = await axiosInstance.post(
//       `/service/get-nearby-services/${categoryId}`,
//       {
//         page,
//         limit,
//         longitude,
//         latitude,
//         filterData,
//       },
//       {
//         cancelToken: cancelToken, // Pass the cancelToken in the request options
//       }
//     );
//     return response; // Return the response if request is successful
//   } catch (error) {
//     // Handle cancellation or other errors
//     if (axios.isCancel(error)) {
//       console.log("Request canceled:", error.message);
//     } else {
//       throw error; // Rethrow the error to handle it outside (e.g., in the component)
//     }
//   }
// };

// export const fetchServiceByCategory = async (
//   categoryId,
//   page,
//   limit,
//   longitude,
//   latitude,
//   filterData,
//   cancelToken
// ) => {
//   try {
//     const response = await axiosInstance.post(
//       `/service/get-nearby-services/${categoryId}`,
//       {
//         page,
//         limit,
//         longitude,
//         latitude,
//         filterData,
//       },
//       {
//         cancelToken: cancelToken, // Pass the cancelToken in the request options
//       }
//     );
//     return response; // Return the response if request is successful
//   } catch (error) {
//     // Handle cancellation or other errors
//     if (axios.isCancel(error)) {
//       console.log("Request canceled:", error.message);
//       throw error; // Rethrow canceled requests too so the thunk can handle them properly
//     } else {
//       throw error; // Rethrow other errors
//     }
//   }
// };

export const fetchServiceByCategory = async (
  categoryId,
  page,
  limit,
  longitude,
  latitude,
  filterData,
  signal
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
        signal,
      }
    );
    return response;
  } catch (error) {
    // More comprehensive abort error detection
    if (
      error.name === "AbortError" ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {
      console.warn("🛑 Axios request aborted:", error.message);
      error.isCanceled = true; // Flag for external handling
      throw error;
    } else {
      console.error("❌ Error in fetchServiceByCategory:", error);
      throw error;
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

// export const updateService = async (formDataToSend) =>
//   await axiosInstance.post(`/service/update-service`, formDataToSend);
export const updateService2 = async (data) =>
  await axiosInstance.post(`/service/update-service-2`, data);

export const deleteService = async (serviceId) =>
  await axiosInstance.delete(`/service/delete-service/${serviceId}`);

export const updateServiceViews = async (serviceId) =>
  await axiosInstance.put(`/service/views/inc`, { serviceId });

export const toggleSave = async (serviceId) =>
  await axiosInstance.put(`/service/save-service`, { serviceId });

export const checkSaveService = async (serviceId) =>
  await axiosInstance.get(`/service/check-saved-service`, {
    params: { serviceId },
  });

export const fetchSavedServices = async () =>
  await axiosInstance.get("/service/get-saved-services");

export const deleteSavedService = async (serviceId) =>
  await axiosInstance.post("/service/delete-single-saved-service", {
    serviceId,
  });

export const uploadServiceImage = async (formData, config = {}) =>
  axiosInstance.post("/service/upload-service-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });

export const deleteServiceImage = async (public_id) =>
  axiosInstance.post("/service/delete-service-form-image", { public_id });

export const createService2 = async (data) =>
  axiosInstance.post("/service/create-service", data);

export const getFilteredCount = async ({
  categoryId,
  longitude,
  latitude,
  filterData,
  signal,
}) => {
  try {
    const response = await axiosInstance.post(
      `/service/get-filtered-count/${categoryId}`, // Make sure this matches your backend route
      {
        longitude,
        latitude,
        filterData,
      },
      {
        signal,
      }
    );
    return response;
  } catch (error) {
    if (
      error.name === "AbortError" ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED"
    ) {
      console.warn("🛑 Axios request aborted:", error.message);
      error.isCanceled = true;
      throw error;
    } else {
      console.error("❌ Error in getFilteredCount:", error);
      throw error;
    }
  }
};
