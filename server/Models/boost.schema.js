const mongoose = require("mongoose");

const boostSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    boostedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["3days", "7days", "15days", "30days"],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Payment info — empty for now, will be filled when Razorpay is added
    paymentId: {
      type: String,
      default: null,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Auto-expire: mark inactive when endDate has passed
boostSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Boost", boostSchema);
