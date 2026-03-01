const express = require("express");
const notificationRouter = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../Controllers/notification.controller");
const { isAuth } = require("../Middlewares/isAuth");

notificationRouter.use(isAuth);

notificationRouter.get("/", getMyNotifications); // Get all my notifications
notificationRouter.get("/unread-count", getUnreadCount); // Get unread count for bell badge
notificationRouter.put("/mark-all-read", markAllAsRead); // Mark all as read
notificationRouter.put("/:notificationId/read", markAsRead); // Mark one as read
notificationRouter.delete("/clear-all", clearAllNotifications); // Clear all
notificationRouter.delete("/:notificationId", deleteNotification); // Delete one

module.exports = { notificationRouter };
