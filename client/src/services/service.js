import axios from "axios";
const api = import.meta.env.VITE_API_ROUTE;

export const fetchServiceByCategory = async (
  categoryId,
  page,
  limit,
  cancelToken
) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/service/service-category/${categoryId}?page=${page}&limit=${limit}`,
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

export const fetchServiceById = async (serviceId) =>
  await axios.get(
    `http://localhost:8000/api/v1/service/get-service/${serviceId}`
  );

export const getMyServices = async () =>
  await axios.get(`http://localhost:8000/api/v1/service/my-services`, {
    withCredentials: true,
  });

export const createService = async (formDataToSend) => {
  return await axios.post(
    `http://localhost:8000/api/v1/service/register-service`,
    formDataToSend,
    { withCredentials: true }
  );
};

export const updateService = async (formDataToSend) =>
  await axios.post(
    `http://localhost:8000/api/v1/service/update-service`,
    formDataToSend,
    { withCredentials: true }
  );
