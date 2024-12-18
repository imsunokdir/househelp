const { default: mongoose } = require("mongoose");
const Review = require("../Models/reviews.schema");
const Service = require("../Models/service.schema");
const Rating = require("../Models/rating.schema");

const giveReview = async (req, res) => {
  console.log("body:", req.body);
  const { serviceId, review, rating } = req.body;
  const reviewObj = new Review({
    comment: review,
    service: serviceId,
    user: req.session.user.userId,
    rating,
  });
  try {
    //save the new rating
    const newReview = await reviewObj.save();

    //update ratings related field in service schema
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "No matching services found",
      });
    }

    //update averageRating and ratingCount field in service schema

    const newRatingCount = service.ratingCount + 1;
    const newAverageRating =
      (service.averageRating * service.ratingCount + rating) / newRatingCount;

    service.ratingCount = newRatingCount;
    service.averageRating = newAverageRating;
    try {
      const updatedService = service.save();
      console.log("updated service:", updatedService);
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to created review",
      error: error,
    });
  }
};
const getReviews = async (req, res) => {
  const { serviceId } = req.params;

  // Get page and limit from query parameters (default to 1 and 10 if not provided)
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 5 reviews per page

  const skip = (page - 1) * limit; // Calculate the number of reviews to skip

  try {
    // Fetch the reviews for the given serviceId with pagination
    const reviews = await Review.find({ service: serviceId })
      .populate("user", "username email avatar")
      .select("comment createdAt rating")
      .skip(skip)
      .limit(limit);

    // Count total reviews to determine if there are more pages
    const totalReviews = await Review.countDocuments({ service: serviceId });

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found...",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        totalPages: Math.ceil(totalReviews / limit), // Calculate total pages
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getReviewCount = async (req, res) => {
  try {
    const { service } = req.query;
    console.log("service::", service);
    const totalReviews = await Review.countDocuments({ service });
    return res.status(200).json({
      message: "Total reviews fetched Successfully",
      totalReviews,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

module.exports = { giveReview, getReviews, getReviewCount };
