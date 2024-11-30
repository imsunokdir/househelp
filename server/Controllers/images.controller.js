const User = require("../Models/user.schema");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLDNRY_CLOUD_NAME,
  api_key: process.env.CLDNRY_API_KEY,
  api_secret: process.env.CLDNRY_API_SECRET,
});

const uploadAvatar = async (req, res) => {
  console.log("Upload started");
  console.log("File details:", req.file);

  const { userId } = req.session.user;

  // const imageUrl = req.body.imageUrl;
  // console.log("imageUrl server:", imageUrl);

  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`avatar/${publicId}`);
        console.log("Previous avatar deleted");
      } catch (error) {
        console.log("Error deleting prevoirs avatar from cloudinary", error);
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "avatar",
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).send({
            message: "Upload to Cloudinary failed",
            error: error.message,
          });
        }

        console.log("Cloudinary upload result:", result);

        try {
          user.avatar = result.secure_url;
          await user.save();

          res.status(200).json({
            message: "Avatar uploaded successfully",
            avatar: result.secure_url,
          });
        } catch (error) {
          console.log("Error upodating user in mongoDB", error);
          res.status(500).json({
            message: "Error  saving avatar to database",
            error,
          });
        }

        // res.status(200).send({
        //   message: "Upload successful",
        //   url: result.secure_url,
        // });
      }
    );

    // Pipe the buffer to the upload stream
    const uploadStreamBuffer = req.file.buffer;
    uploadStream.end(uploadStreamBuffer);
  } catch (error) {
    console.error("Server-side upload error:", error);
    res.status(500).send({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteAvatar = async (req, res) => {
  const { imageUrl } = req.query;
  const { userId } = req.session.user;
  console.log("imageUrl:", imageUrl);
  console.log("userId:", userId);

  try {
    const updateduser = await User.findByIdAndUpdate(userId, { avatar: "" });
    return res.status(200).json({
      message: "Avatar deleted successfully",
      data: updateduser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { uploadAvatar, deleteAvatar };
