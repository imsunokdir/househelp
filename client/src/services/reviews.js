import axios from "axios";
const api = import.meta.env.VITE_API_ROUTE;

export const getServiceReviews = async (serviceId, page, limit) =>
  await axios.get(
    `${api}/review/reviews/${serviceId}?page=${page}&limit=${limit}`
  );

export const getReviewCount = async (serviceId) =>
  await axios.get(`${api}/review/review-count?service=${serviceId}`);

export const giveReview = async (params) =>
  await axios.post(`${api}/review/give-review`, params, {
    withCredentials: true,
  });

export const getAvgRating = async (serviceId) =>
  await axios.get(`${api}/rating/average-rating/${serviceId}`);
