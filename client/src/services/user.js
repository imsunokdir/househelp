import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const LoginUser = async ({ loginId, password }) =>
  await api.post(`api/v1/user/login`, {
    loginId,
    password,
  });

export const authCheck = async () => await api.get("/api/v1/user/auth/check");

export const logoutUser = async () => await api.post(`api/v1/user/logout`);

export const getUserDetails = async () =>
  await api.get(`/api/v1/user/get-user-details`);

export const uploadUserAvatar = async (formData) =>
  await api.post("/api/v1/image/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteUserAvatar = async (imageUrl) =>
  await api.delete("/api/v1/image/delete-avatar", {
    params: { imageUrl },
  });

// export const updateUserAvatar = async(formData)=>
//   await api.post("/api/v1/image/update-avatar")

export const saveUserCurrLocation = async () =>
  await api.post("api/v1/user/save-user-current-location");
