const express = require("express");
const passport = require("../passport/google");
const { findOne } = require("../Models/user.schema");
const User = require("../Models/user.schema");
require("dotenv").config();

const router = express.Router();

// Google Authentication
router.get(
  "/auth/google",
  (req, res, next) => {
    const state = req.query.state;
    const params = new URLSearchParams(state);
    req.session.redirectPath = params.get("redirectTo");
    return next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    const savedRedirectPath = req.session.redirectPath;
    passport.authenticate("google", { failureRedirect: "/error" })(
      req,
      res,
      () => {
        req.session.redirectPath = savedRedirectPath;
        next();
      }
    );
  },
  async (req, res) => {
    try {
      console.log("session session json:", req.session);

      const existingUser = await User.findOne({
        email: req.user.emails[0].value,
      });

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
      const redirectTo = req.session.redirectPath || process.env.REDIRECT_LINK;
      console.log("redirect to:", redirectTo);

      res.redirect(`${process.env.REDIRECT_LINK}${redirectTo}`);
    } catch (error) {
      console.log("google error", error);
    }
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.REDIRECT_LINK); // Redirect to React app
  });
});

module.exports = router;
