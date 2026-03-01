const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // The two participants — always [user, worker]
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // The service this conversation is about
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    // Last message preview (so inbox doesn't need to fetch all messages)
    lastMessage: {
      text: { type: String, default: "" },
      sentAt: { type: Date, default: null },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    },

    // Unread count per participant
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Ensure only one conversation exists per user+worker pair per service
conversationSchema.index({ participants: 1, service: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", conversationSchema);
