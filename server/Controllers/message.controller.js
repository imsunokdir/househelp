const mongoose = require("mongoose");
const Conversation = require("../Models/conversation.schema");
const Message = require("../Models/message.schema");

// ─── Get or Create a Conversation ────────────────────────────────────────────
// Called when a user clicks "Message" on a service page
const getOrCreateConversation = async (req, res) => {
  const { workerId, serviceId } = req.body;
  const { userId } = req.session.user;

  if (!workerId || !serviceId) {
    return res.status(400).json({
      success: false,
      message: "Worker ID and Service ID are required.",
    });
  }

  if (userId.toString() === workerId.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot message yourself.",
    });
  }

  try {
    // Sort participants so [userA, userB] and [userB, userA] are treated the same
    const participants = [userId, workerId].sort();

    let conversation = await Conversation.findOne({
      participants: { $all: participants },
      service: serviceId,
    })
      .populate("participants", "username avatar")
      .populate("service", "serviceName");

    // Create if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        service: serviceId,
        unreadCount: {
          [userId]: 0,
          [workerId]: 0,
        },
      });

      conversation = await conversation.populate([
        { path: "participants", select: "username avatar" },
        { path: "service", select: "serviceName" },
      ]);
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("getOrCreateConversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Get All Conversations for a User (Inbox) ─────────────────────────────────
const getMyConversations = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "username avatar")
      .populate("service", "serviceName images")
      .populate("lastMessage.sentBy", "username")
      .sort({ "lastMessage.sentAt": -1 }); // Most recent first

    // Attach unread count for current user
    const result = conversations.map((conv) => ({
      ...conv.toObject(),
      myUnreadCount: conv.unreadCount?.get(userId.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("getMyConversations error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Get Messages in a Conversation (Paginated) ───────────────────────────────
const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const { userId } = req.session.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;

  try {
    // Make sure user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const totalMessages = await Message.countDocuments({
      conversation: conversationId,
      isDeleted: false,
    });

    // Fetch messages — newest first for pagination, then reverse for display
    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Reset unread count for this user
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 },
    });

    return res.status(200).json({
      success: true,
      data: messages.reverse(), // Reverse so oldest is first
      pagination: {
        total: totalMessages,
        page,
        limit,
        hasMore: page * limit < totalMessages,
      },
    });
  } catch (error) {
    console.error("getMessages error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Send a Message (REST fallback — main sending is via Socket.io) ───────────
const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  const { userId } = req.session.user;

  if (!conversationId || !text?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Conversation ID and message text are required.",
    });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString(),
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Save message to DB
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      text: text.trim(),
      readBy: [{ user: userId, readAt: new Date() }], // Sender has already "read" it
    });

    const populatedMessage = await message.populate(
      "sender",
      "username avatar",
    );

    // Update conversation's last message + increment unread for the OTHER participant
    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== userId.toString(),
    );

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text: text.trim(),
        sentAt: new Date(),
        sentBy: userId,
      },
      $inc: { [`unreadCount.${otherParticipant}`]: 1 },
    });

    return res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Mark Messages as Read ────────────────────────────────────────────────────
const markAsRead = async (req, res) => {
  const { conversationId } = req.body;
  const { userId } = req.session.user;

  try {
    // Mark all unread messages in this conversation as read by this user
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId }, // Not sent by me
        "readBy.user": { $ne: userId }, // Not already read by me
      },
      {
        $push: {
          readBy: { user: userId, readAt: new Date() },
        },
      },
    );

    // Reset unread count for this user
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 },
    });

    return res.status(200).json({
      success: true,
      message: "Messages marked as read.",
    });
  } catch (error) {
    console.error("markAsRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Get Total Unread Count (for navbar badge) ────────────────────────────────
const getTotalUnreadCount = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    });

    const totalUnread = conversations.reduce((sum, conv) => {
      return sum + (conv.unreadCount?.get(userId.toString()) || 0);
    }, 0);

    return res.status(200).json({
      success: true,
      totalUnread,
    });
  } catch (error) {
    console.error("getTotalUnreadCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getTotalUnreadCount,
};
