const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { type } = require("os");
require("dotenv").config();

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    bio: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      // required: true,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v);
        },
        message: (props) => `${props.value} is not a valid date!`,
      },
    },
    avatar: {
      type: String,
      default: "",
    },
    whatsapp: {
      type: Number,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    currentLocation: {
      type: {
        type: "String",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    savedServices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },

  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = await bcrypt.hash(this.password, process.env.SALT);
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
