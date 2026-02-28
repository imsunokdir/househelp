import axiosInstance from "./axiosInstance";

export const fetchNotifications = () => axiosInstance.get("/notification");

export const fetchUnreadCount = () =>
  axiosInstance.get("/notification/unread-count");

export const markNotificationAsRead = (notificationId) =>
  axiosInstance.put(`/notification/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
  axiosInstance.put("/notification/mark-all-read");

export const deleteNotification = (notificationId) =>
  axiosInstance.delete(`/notification/${notificationId}`);
