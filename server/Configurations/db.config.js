const mongoose = require("mongoose");
require("dotenv").config();

const dbConfig = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    if (retries > 0) {
      console.log(`DB connection failed, retrying... (${retries} left)`);
      setTimeout(() => dbConfig(retries - 1), 3000);
    } else {
      console.error("MongoDB connection failed:", error.message);
    }
  }
};

module.exports = dbConfig;
