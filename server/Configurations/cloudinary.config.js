const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLDNRY_CLOUD_NAME,
    api_key: process.env.CLDNRY_API_KEY,
    api_secret: process.env.CLDNRY_API_SECRET,
  });

  console.log("Cloudinary connected");
};

module.exports = { cloudinaryConfig, cloudinary };
