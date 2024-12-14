import axios from "axios";
import axiosInstance from "./axiosInstance";

export const getAllCategories = async () =>
  await axiosInstance.get(`/category/get-categories`);
