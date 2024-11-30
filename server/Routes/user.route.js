const express = require("express");
const {
  registerUser,
  verifyUser,
  loginUser,
  verifyMobile,
  logoutUser,
  logoutFromAllDevice,
  authCheck,
  saveUserCurrLocation,
  getUserDetails,
} = require("../Controllers/user.controller");
const { isAuth } = require("../Middlewares/isAuth");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyUser);
userRouter.post("/login", loginUser);
userRouter.post("/user-mobile-verify", verifyMobile);
userRouter.post("/logout", isAuth, logoutUser);
userRouter.post("/logout-out-from-all", logoutFromAllDevice);
userRouter.get("/auth/check", authCheck);
userRouter.get("/get-user-details", getUserDetails);

//
userRouter.post("/save-user-current-location", saveUserCurrLocation);

module.exports = { userRouter };
