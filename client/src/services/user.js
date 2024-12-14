import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000",
//   withCredentials: true,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });
import axiosInstance from "./axiosInstance";

export const LoginUser = async ({ loginId, password }) =>
  await axiosInstance.post(`/user/login`, {
    loginId,
    password,
  });

export const registerUser = async ({ email, username, password }) =>
  await axiosInstance.post(`/user/register`, {
    email,
    username,
    password,
  });

export const verifyEmail = async (verifiedToken) =>
  await axiosInstance.get(`/user/verify/${verifiedToken}`);

export const authCheck = async () =>
  await axiosInstance.get("/user/auth-check");

export const logoutUser = async () => await axiosInstance.post(`/user/logout`);

export const getUserDetails = async () =>
  await axiosInstance.get(`/user/get-user-details`);

export const uploadUserAvatar = async (formData) =>
  await axiosInstance.post("/image/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteUserAvatar = async (imageUrl) =>
  await axiosInstance.delete("/image/delete-avatar", {
    params: { imageUrl },
  });

// export const updateUserAvatar = async(formData)=>
//   await api.post("//image/update-avatar")

export const saveUserCurrLocation = async () =>
  await axiosInstance.post("/user/save-user-current-location");

export const updateUserInfo = async (data) => {
  const response = await axiosInstance.put("/user/update-user-info", data);
  return response;
};
