const express = require("express");
const listingRouter = express.Router();
const {
  renewService,
  getListingStatus,
  checkPostingEligibility,
} = require("../Controllers/listing.controller");
const { isAuth } = require("../Middlewares/isAuth");

// All listing routes require authentication
listingRouter.use(isAuth);

listingRouter.post("/renew", renewService); // Renew a listing for 30 more days
listingRouter.get("/status/:serviceId", getListingStatus); // Get days remaining etc
listingRouter.get("/eligibility", checkPostingEligibility); // Can this user post a free service?

module.exports = { listingRouter };
