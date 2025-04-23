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
  updateUserInfo,
  changePassword,
  activeSessions,
  forgotPassword,
  sendResetPasswordLink,
  verifyPasswordReset,
  resetPassword,
  updateLastActive,
  logoutSession,
} = require("../Controllers/user.controller");
const { isAuth } = require("../Middlewares/isAuth");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyUser);

userRouter.post("/login", loginUser);
userRouter.post("/user-mobile-verify", verifyMobile);
userRouter.post("/logout", isAuth, logoutUser);

userRouter.get("/auth-check", authCheck);
userRouter.get("/get-user-details", getUserDetails);
userRouter.put("/update-user-info", updateUserInfo);
userRouter.put("/change-password", changePassword);
userRouter.get("/active-sessions", activeSessions);
userRouter.post("/logout-out-from-all", logoutFromAllDevice);

// userRouter.get("/verify-password-reset/:token", verifyPasswordReset);
userRouter.post("/forgot-password", sendResetPasswordLink);
userRouter.post("/reset-password", resetPassword);

//
userRouter.post("/save-user-current-location", saveUserCurrLocation);
userRouter.post("/update-last-active", updateLastActive);
userRouter.post("/logout-session", logoutSession);

module.exports = { userRouter };
