const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema definitions (availabilitySlotSchema and priceRangeSchema) remain the same

const serviceSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Service name must be at least 3 characters long"],
    },
    description: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one skill is required",
      },
    },
    priceRange: {
      type: new Schema(
        {
          minimum: {
            type: Number,
            required: true,
            min: 0,
          },
          maximum: {
            type: Number,
            required: true,
            min: 0,
          },
        },
        { _id: false },
      ),
      required: [true, "Price range is required"],
      validate: {
        validator: function (v) {
          return v.maximum > v.minimum;
        },
        message: "Maximum price must be greater than minimum price",
      },
    },
    availability: {
      type: [
        new Schema(
          {
            day: {
              type: String,
              enum: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ],
              required: true,
            },
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            enabled: {
              type: Boolean,
              default: true,
            },
          },
          { _id: false },
        ),
      ],
      required: [true, "At least one availability slot is required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one availability slot is required",
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: { type: [Number], required: true },
    },
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isBoosted: {
      type: Boolean,
      default: false,
    },
    boostExpiresAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },

    isExpired: {
      type: Boolean,
      default: false,
    },

    // Monetization
    isPaid: {
      type: Boolean,
      default: false, // false = free listing
    },

    renewalCount: {
      type: Number,
      default: 0, // how many times this listing has been renewed
    },
  },

  {
    timestamps: true,
  },
);

// Add indexes
serviceSchema.index({
  location: "2dsphere",
});

// Middleware for validating price range
serviceSchema.pre("save", function (next) {
  if (this.priceRange.minimum > this.priceRange.maximum) {
    next(new Error("Minimum price cannot be greater than maximum price"));
  }
  next();
});

serviceSchema.index({ expiresAt: 1 }); // For expiry queries
serviceSchema.index({ createdBy: 1, isPaid: 1 }); // For free tier limit check
serviceSchema.index({ isBoosted: 1, boostExpiresAt: 1 });
serviceSchema.index(
  {
    serviceName: "text",
    description: "text",
    skills: "text",
  },
  {
    weights: {
      serviceName: 10,
      skills: 5,
      description: 1,
    },
    name: "service_text_index",
  },
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
