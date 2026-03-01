const express = require("express");
const dashboardRouter = express.Router();
const {
  getDashboardStats,
  getRecentActivity,
} = require("../Controllers/dashboard.controller");
const { isAuth } = require("../Middlewares/isAuth");

dashboardRouter.use(isAuth);

dashboardRouter.get("/stats", getDashboardStats); // All stats in one call
dashboardRouter.get("/activity", getRecentActivity); // Recent reviews

module.exports = { dashboardRouter };
