import axios from "axios";
const api = import.meta.env.VITE_API_ROUTE;
import axiosInstance from "./axiosInstance";

export const getServiceReviews = async (serviceId, page, limit) =>
  await axiosInstance.get(
    `/review/reviews/${serviceId}?page=${page}&limit=${limit}`
  );

export const getReviewCount = async (serviceId) =>
  await axiosInstance.get(`/review/review-count?service=${serviceId}`);

export const giveReview = async (params) =>
  await axiosInstance.post(`/review/give-review`, params);

export const getAvgRating = async (serviceId) =>
  await axiosInstance.get(`/rating/average-rating/${serviceId}`);
