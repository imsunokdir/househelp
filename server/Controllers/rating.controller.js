const mongoose = require("mongoose");
const Rating = require("../Models/rating.schema");
const Review = require("../Models/reviews.schema");

const rateService = async (req, res) => {
  const { serviceId, rating } = req.body;
  const { userId } = req.session.user;

  try {
    const newRating = await Rating.create({
      service: serviceId,
      user: userId,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: "Rating added successfully",
      data: newRating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const serviceRatingByUser = async (req, res) => {
  const { serviceId } = req.params;
  const { userId } = req.session.user;

  try {
    const userRating = await Rating.findOne({
      user: userId,
      service: serviceId,
    });

    if (!userRating) {
      return res.status(404).json({
        success: false,
        message: "No rating found for this service",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User rating fetched successfully",
      data: userRating.rating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getRatingDistribution = async (req, res) => {
  const { serviceId } = req.params;

  try {
    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    const totalReviews = await Review.countDocuments({ service: serviceId });

    if (totalReviews === 0) {
      return res.status(200).json([]);
    }

    const distribution = await Review.aggregate([
      { $match: { service: new mongoose.Types.ObjectId(serviceId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = distribution.map((item) => ({
      rating: item._id,
      count: item.count,
      percentage: ((item.count / totalReviews) * 100).toFixed(2),
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAverageRating = async (req, res) => {
  const { serviceId } = req.params;

  try {
    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    const totalReviews = await Review.countDocuments({ service: serviceId });

    if (totalReviews === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this service" });
    }

    const totalRatingValue = await Review.aggregate([
      { $match: { service: new mongoose.Types.ObjectId(serviceId) } },
      {
        $group: {
          _id: null,
          totalRating: { $sum: "$rating" },
        },
      },
    ]);

    const averageRating =
      totalRatingValue.length > 0
        ? (totalRatingValue[0].totalRating / totalReviews).toFixed(2)
        : "0";

    return res.status(200).json({ averageRating, totalReviews });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  rateService,
  serviceRatingByUser,
  getRatingDistribution,
  getAverageRating,
};
