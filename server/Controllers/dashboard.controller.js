const mongoose = require("mongoose");
const Service = require("../Models/service.schema");
const Review = require("../Models/reviews.schema");
const Conversation = require("../Models/conversation.schema");
const Boost = require("../Models/boost.schema");
const User = require("../Models/user.schema");

// ─── Single endpoint — returns all worker stats in one call ───────────────────
const getDashboardStats = async (req, res) => {
  const { userId } = req.session.user;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  try {
    // Run all aggregations in parallel for maximum performance
    const [serviceStats, reviewStats, messageStats, boostStats, user] =
      await Promise.all([
        // ── Service stats ──────────────────────────────────────────────────
        Service.aggregate([
          { $match: { createdBy: userObjectId } },
          {
            $group: {
              _id: null,
              totalServices: { $sum: 1 },
              totalViews: { $sum: "$views" },
              activeListings: {
                $sum: { $cond: [{ $eq: ["$isExpired", false] }, 1, 0] },
              },
              expiredListings: {
                $sum: { $cond: [{ $eq: ["$isExpired", true] }, 1, 0] },
              },
              boostedListings: {
                $sum: { $cond: [{ $eq: ["$isBoosted", true] }, 1, 0] },
              },
              averageRating: { $avg: "$averageRating" },
              totalRatingCount: { $sum: "$ratingCount" },
              // Get list of services with expiry info for countdown
              services: {
                $push: {
                  _id: "$_id",
                  serviceName: "$serviceName",
                  isExpired: "$isExpired",
                  isBoosted: "$isBoosted",
                  boostExpiresAt: "$boostExpiresAt",
                  expiresAt: "$expiresAt",
                  status: "$status",
                  views: "$views",
                  averageRating: "$averageRating",
                  ratingCount: "$ratingCount",
                  createdAt: "$createdAt",
                },
              },
            },
          },
        ]),

        // ── Review stats ───────────────────────────────────────────────────
        Service.aggregate([
          { $match: { createdBy: userObjectId } },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "service",
              as: "reviews",
            },
          },
          {
            $group: {
              _id: null,
              totalReviews: { $sum: { $size: "$reviews" } },
            },
          },
        ]),

        // ── Message stats ──────────────────────────────────────────────────
        Conversation.aggregate([
          { $match: { participants: userObjectId } },
          {
            $group: {
              _id: null,
              totalConversations: { $sum: 1 },
              totalUnread: {
                $sum: {
                  $ifNull: [
                    {
                      $toInt: {
                        $getField: {
                          field: userId.toString(),
                          input: "$unreadCount",
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        ]),

        // ── Boost stats ────────────────────────────────────────────────────
        Boost.aggregate([
          { $match: { boostedBy: userObjectId } },
          {
            $group: {
              _id: null,
              totalBoosts: { $sum: 1 },
              activeBoosts: {
                $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
              },
            },
          },
        ]),

        // ── User info ──────────────────────────────────────────────────────
        User.findById(userId).select(
          "firstName lastName username avatar createdAt isProfileCompleted",
        ),
      ]);

    // ── Assemble response ──────────────────────────────────────────────────
    const services = serviceStats[0] || {
      totalServices: 0,
      totalViews: 0,
      activeListings: 0,
      expiredListings: 0,
      boostedListings: 0,
      averageRating: 0,
      totalRatingCount: 0,
      services: [],
    };

    const reviews = reviewStats[0] || { totalReviews: 0 };
    const messages = messageStats[0] || {
      totalConversations: 0,
      totalUnread: 0,
    };
    const boosts = boostStats[0] || { totalBoosts: 0, activeBoosts: 0 };

    // Sort services — active first, then by views descending
    const sortedServices = services.services.sort((a, b) => {
      if (a.isExpired !== b.isExpired) return a.isExpired ? 1 : -1;
      return b.views - a.views;
    });

    // Add days remaining to each service
    const now = new Date();
    const servicesWithCountdown = sortedServices.map((s) => ({
      ...s,
      daysUntilExpiry: s.expiresAt
        ? Math.max(
            0,
            Math.ceil((new Date(s.expiresAt) - now) / (1000 * 60 * 60 * 24)),
          )
        : null,
      boostDaysRemaining: s.boostExpiresAt
        ? Math.max(
            0,
            Math.ceil(
              (new Date(s.boostExpiresAt) - now) / (1000 * 60 * 60 * 24),
            ),
          )
        : null,
    }));

    return res.status(200).json({
      success: true,
      data: {
        // Worker profile
        profile: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          username: user?.username,
          avatar: user?.avatar,
          memberSince: user?.createdAt,
          isProfileCompleted: user?.isProfileCompleted,
        },

        // Overview stats
        stats: {
          totalServices: services.totalServices,
          totalViews: services.totalViews,
          activeListings: services.activeListings,
          expiredListings: services.expiredListings,
          boostedListings: services.boostedListings,
          averageRating: services.averageRating
            ? parseFloat(services.averageRating.toFixed(2))
            : 0,
          totalReviews: reviews.totalReviews,
          totalRatingCount: services.totalRatingCount,
          totalConversations: messages.totalConversations,
          unreadMessages: messages.totalUnread,
          totalBoosts: boosts.totalBoosts,
          activeBoosts: boosts.activeBoosts,
        },

        // Individual service details with countdown
        services: servicesWithCountdown,
      },
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Get recent activity (last 10 reviews across all services) ────────────────
const getRecentActivity = async (req, res) => {
  const { userId } = req.session.user;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  try {
    // Get all service IDs owned by this worker
    const myServices = await Service.find({ createdBy: userObjectId }).select(
      "_id",
    );
    const serviceIds = myServices.map((s) => s._id);

    if (serviceIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Get last 10 reviews across all services
    const recentReviews = await Review.find({ service: { $in: serviceIds } })
      .populate("user", "username avatar")
      .populate("service", "serviceName")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("comment rating createdAt user service");

    return res.status(200).json({
      success: true,
      data: recentReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
};
