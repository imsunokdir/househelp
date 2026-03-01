const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "NEW_MESSAGE",
        "LISTING_EXPIRING", // 3 days warning
        "LISTING_EXPIRED",
        "BOOST_EXPIRED",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    // Optional reference to related document
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // What collection the reference points to
    referenceModel: {
      type: String,
      enum: ["Service", "Conversation", "Boost", null],
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Index for fast fetching of user notifications
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
