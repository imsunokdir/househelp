import axios from "axios";

export const getAllCategories = async () =>
  await axios.get(`http://localhost:8000/api/v1/category/get-categories`);
