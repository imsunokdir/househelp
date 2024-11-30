const { mongoose } = require("mongoose");
const Rating = require("../Models/rating.schema");
const Service = require("../Models/service.schema");
const Review = require("../Models/reviews.schema");

const rateService = async (req, res) => {
  const { serviceId, rating } = req.body;
  const { userId } = req.session.user;
  console.log("userid:", userId);

  try {
    // Create the new rating
    const newRating = await Rating.create({
      service: serviceId,
      user: userId,
      rating,
    });

    // Get the average rating after the new rating is added

    return res.status(201).json({
      success: true,
      message: "Rating added successfully",
      data: newRating,
    });
  } catch (error) {
    // Handle errors in rateService and send an appropriate response
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // Send the error message for debugging
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
        message: "No user rating found for this service",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User rating found and fetched",
      data: userRating.rating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const generateRatingDistribution = async (serviceId) => {
  try {
    const ratingDistribution = await Rating.aggregate([
      {
        $match: { service: new mongoose.Types.ObjectId(serviceId) }, // Match ratings for the service
      },
      {
        $group: {
          _id: "$rating", // Group by the rating value
          count: { $sum: 1 }, // Count how many users gave each rating
        },
      },
      {
        $sort: { _id: 1 }, // Sort the ratings in ascending order
      },
    ]);
    return ratingDistribution;
  } catch (error) {
    throw new Error("Generating Rating distribution error");
  }
};

const getRatingDistribution = async (req, res) => {
  const { serviceId } = req.params;
  try {
    if (!serviceId)
      return res.status(400).json({ message: "Service Id is required." });

    // Convert serviceId to ObjectId if necessary

    // Find all reviews for the service
    const totalReviews = await Review.countDocuments({
      service: serviceId,
    });

    if (totalReviews === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this service" });
    }

    // Perform aggregation to get the count of each rating
    const distribution = await Review.aggregate([
      { $match: { service: new mongoose.Types.ObjectId(serviceId) } },
      {
        $group: {
          _id: "$rating", // Group by the rating value
          count: { $sum: 1 }, // Count reviews per rating
        },
      },
      { $sort: { _id: 1 } }, // Sort by rating
    ]);

    // Calculate percentage for each rating
    const result = distribution.map((item) => ({
      rating: item._id,
      count: item.count,
      percentage: ((item.count / totalReviews) * 100).toFixed(2), // Calculate percentage
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAverageRating = async (req, res) => {
  const { serviceId } = req.params;
  try {
    if (!serviceId)
      return res.status(400).json({ message: "Service Id is required." });

    // Find all reviews for the service
    const totalReviews = await Review.countDocuments({
      service: serviceId,
    });

    if (totalReviews === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this service" });
    }

    // Perform aggregation to get the total rating value
    const totalRatingValue = await Review.aggregate([
      { $match: { service: new mongoose.Types.ObjectId(serviceId) } },
      {
        $group: {
          _id: null, // No grouping, just aggregate
          totalRating: { $sum: { $multiply: ["$rating", 1] } }, // Sum of all ratings
        },
      },
    ]);

    const averageRating =
      totalRatingValue.length > 0
        ? (totalRatingValue[0].totalRating / totalReviews).toFixed(2)
        : "0";

    res.json({ averageRating, totalReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  rateService,
  serviceRatingByUser,
  getRatingDistribution,
  getAverageRating,
};
