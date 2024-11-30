const express = require("express");
const {
  giveReview,
  getReviews,
  getReviewCount,
} = require("../Controllers/review.controller");
const reviewRouter = express.Router();

reviewRouter.post("/give-review", giveReview);
reviewRouter.get("/reviews/:serviceId", getReviews);
reviewRouter.get("/review-count", getReviewCount);

module.exports = reviewRouter;
