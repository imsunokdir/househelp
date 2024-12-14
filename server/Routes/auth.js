const express = require("express");
const passport = require("../passport/google");
const { findOne } = require("../Models/user.schema");
const User = require("../Models/user.schema");
require("dotenv").config();

const router = express.Router();

// Google Authentication
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  async (req, res) => {
    try {
      //   console.log("google req:", req);
      //   res.redirect("http://localhost:5173");
      const existingUser = await User.findOne({
        email: req.user.emails[0].value,
      });

      // console.log("req.user:", req.user);

      const avatarUrl = req.user.photos[0].value;
      if (!existingUser) {
        const newUser = new User({
          username: req.user.displayName,
          email: req.user.emails[0].value,
          isEmailVerified: true,
          avatar: avatarUrl,
        });
        await newUser.save();

        req.session.user = {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
        };
      } else {
        req.session.user = {
          userId: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
        };
      }
      req.session.isAuth = true;
      // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      // res.setHeader("Access-Control-Allow-Credentials", "true");

      //   redirect user to home after login
      console.log("res:", res);
      res.redirect(process.env.REDIRECT_LINK);
    } catch (error) {
      console.log("google error", error);
    }
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("http://localhost:5173"); // Redirect to React app
  });
});

module.exports = router;
