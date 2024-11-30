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
        { _id: false }
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
          { _id: false }
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
      enum: ["active", "inactive", "pending"],
      default: "active",
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes
serviceSchema.index({
  serviceName: "text",
  location: "2dsphere",
});

// Middleware for validating price range
serviceSchema.pre("save", function (next) {
  if (this.priceRange.minimum > this.priceRange.maximum) {
    next(new Error("Minimum price cannot be greater than maximum price"));
  }
  next();
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
