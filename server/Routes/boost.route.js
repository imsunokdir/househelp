const express = require("express");
const boostRouter = express.Router();
const {
  activateBoost,
  getBoostStatus,
  deactivateBoost,
  getBoostPlans,
  getBoostHistory,
} = require("../Controllers/boost.controller");
const { isAuth } = require("../Middlewares/isAuth");
// const { isAuth } = require("../Middlewares/auth.middleware");

// Public — anyone can see the plans
boostRouter.get("/plans", getBoostPlans);

// Protected — must be logged in
boostRouter.post("/activate", isAuth, activateBoost);
boostRouter.post("/deactivate", isAuth, deactivateBoost);
boostRouter.get("/status/:serviceId", isAuth, getBoostStatus);
boostRouter.get("/history/:serviceId", isAuth, getBoostHistory);

module.exports = { boostRouter };
