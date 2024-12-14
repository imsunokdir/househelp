const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  maxPrice: {
    type: Number,
    default: 0,
  },
  maxExp: {
    type: Number,
    default: 0,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
