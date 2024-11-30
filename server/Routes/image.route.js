const express = require("express");
const multer = require("multer");
const {
  uploadAvatar,
  deleteAvatar,
} = require("../Controllers/images.controller");

//consts
const imageRouter = express.Router();

//multer file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

imageRouter.post("/upload-avatar", upload.single("file"), uploadAvatar);
imageRouter.delete("/delete-avatar", deleteAvatar);
module.exports = imageRouter;
