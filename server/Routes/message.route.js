const express = require("express");
const messageRouter = express.Router();
const {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getTotalUnreadCount,
} = require("../Controllers/message.controller");
const { isAuth } = require("../Middlewares/isAuth");
// const { isAuth } = require("../Middlewares/auth.middleware");

// All message routes require authentication
messageRouter.use(isAuth);

// Conversations
messageRouter.post("/conversation", getOrCreateConversation); // Start or get a conversation
messageRouter.get("/conversations", getMyConversations); // Get all my conversations (inbox)

// Messages
messageRouter.get("/:conversationId", getMessages); // Get messages in a conversation
messageRouter.post("/send", sendMessage); // Send a message (REST fallback)
messageRouter.post("/read", markAsRead); // Mark messages as read

// Unread badge
messageRouter.get("/unread/count", getTotalUnreadCount); // Total unread count for navbar

module.exports = { messageRouter };
