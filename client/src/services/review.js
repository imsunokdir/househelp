import axios from "axios";
const api = import.meta.env.VITE_API_ROUTE;

export const getRatingDistribution = async (serviceId) =>
  await axios.get(`${api}/rating/rating-distribution/${serviceId}`);
