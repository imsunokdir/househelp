const Message = require("./Models/message.schema");
const Conversation = require("./Models/conversation.schema");
const { notifyNewMessage } = require("./Utils/notificationHelper");
const User = require("./Models/user.schema");

// Track online users — { userId: socketId }
const onlineUsers = new Map();

const initSocket = (io) => {
  io.on("connection", (socket) => {
    // ── User comes online ────────────────────────────────────────────────────
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;

      // Join personal room — used to send notifications directly to this user
      socket.join(`user:${userId}`);
      // console.log(
      //   `✅ user:${userId} joined personal room, socketId: ${socket.id}`,
      // );

      io.emit("user:status", { userId, isOnline: true });
    });

    // ── Join a conversation room ─────────────────────────────────────────────
    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
    });

    // ── Leave a conversation room ────────────────────────────────────────────
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
    });

    // ── Send a message ───────────────────────────────────────────────────────
    socket.on("message:send", async (data) => {
      const { conversationId, text, senderId } = data;

      if (!conversationId || !text?.trim() || !senderId) return;

      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        // Save message to DB
        const message = await Message.create({
          conversation: conversationId,
          sender: senderId,
          text: text.trim(),
          readBy: [{ user: senderId, readAt: new Date() }],
        });

        const populatedMessage = await message.populate(
          "sender",
          "username avatar",
        );

        // Find the other participant
        const otherParticipant = conversation.participants.find(
          (p) => p.toString() !== senderId.toString(),
        );

        // Update conversation last message + unread count for receiver
        // Update conversation last message + unread count for receiver
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            text: text.trim(),
            sentAt: new Date(),
            sentBy: senderId,
          },
          $inc: { [`unreadCount.${otherParticipant}`]: 1 },
        });

        // Get updated unread count for receiver
        const updatedConv = await Conversation.findById(conversationId);
        const receiverUnreadCount = updatedConv.unreadCount?.get
          ? updatedConv.unreadCount.get(otherParticipant.toString())
          : updatedConv.unreadCount?.[otherParticipant.toString()];

        // Build payload with unread count included
        const payload = {
          ...populatedMessage.toObject(),
          receiverUnreadCount: receiverUnreadCount || 1,
        };

        socket.to(conversationId).emit("message:receive", payload);
        socket.emit("message:receive", populatedMessage);
        io.to(`user:${otherParticipant}`).emit("message:receive", payload);
        // console.log("emitted to personal room:", `user:${otherParticipant}`);
        // Check who is in that room
        // const room = io.sockets.adapter.rooms.get(`user:${otherParticipant}`);
        // console.log("sockets in room:", room);
        // Send in-app notification to the receiver
        const sender = await User.findById(senderId).select("username");
        await notifyNewMessage({
          recipient: otherParticipant,
          senderName: sender?.username || "Someone",
          conversationId,
        });
      } catch (error) {
        socket.emit("message:error", { message: "Failed to send message." });
      }
    });

    // ── Typing indicators ────────────────────────────────────────────────────
    socket.on("typing:start", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing:start", { userId });
    });

    socket.on("typing:stop", ({ conversationId, userId }) => {
      socket.to(conversationId).emit("typing:stop", { userId });
    });

    // ── Mark messages as read ────────────────────────────────────────────────
    socket.on("messages:read", async ({ conversationId, userId }) => {
      try {
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            "readBy.user": { $ne: userId },
          },
          {
            $push: { readBy: { user: userId, readAt: new Date() } },
          },
        );

        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { [`unreadCount.${userId}`]: 0 },
        });

        socket.to(conversationId).emit("messages:read", {
          conversationId,
          readBy: userId,
        });
      } catch (error) {
        console.error("Socket messages:read error:", error);
      }
    });

    // ── User disconnects ─────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("user:status", { userId: socket.userId, isOnline: false });
      }
    });
  });
};

const isUserOnline = (userId) => onlineUsers.has(userId.toString());

module.exports = { initSocket, isUserOnline };
