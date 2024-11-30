const express = require("express");
const {
  rateService,
  serviceRatingByUser,
  getRatingDistribution,
  getAverageRating,
} = require("../Controllers/rating.controller");
const ratingRouter = express.Router();

ratingRouter.post("/rate-service", rateService);
ratingRouter.get("/average-rating/:serviceId", getAverageRating);
ratingRouter.get("/rating-by-user/:serviceId", serviceRatingByUser);
ratingRouter.get("/rating-distribution/:serviceId", getRatingDistribution);

module.exports = ratingRouter;
