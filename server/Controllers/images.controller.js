const User = require("../Models/user.schema");
const { cloudinary } = require("../Configurations/cloudinary.config");

const uploadAvatar = async (req, res) => {
  const { userId } = req.session.user;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete previous avatar from Cloudinary if it exists
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatar/${publicId}`);
    }

    // Upload new avatar
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatar" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Upload to Cloudinary failed",
            error: error.message,
          });
        }

        try {
          user.avatar = result.secure_url;
          await user.save();

          return res.status(200).json({
            message: "Avatar uploaded successfully",
            avatar: result.secure_url,
          });
        } catch (error) {
          return res.status(500).json({
            message: "Error saving avatar to database",
            error: error.message,
          });
        }
      },
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteAvatar = async (req, res) => {
  const { imageUrl } = req.query;
  const { userId } = req.session.user;

  try {
    // Delete from Cloudinary if url exists
    if (imageUrl) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatar/${publicId}`);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: "" },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Avatar deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { uploadAvatar, deleteAvatar };
