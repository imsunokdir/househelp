const mongoose = require("mongoose");
const Boost = require("../Models/boost.schema");
const Service = require("../Models/service.schema");
const { notifyBoostExpired } = require("../Utils/notificationHelper");

const BOOST_PLANS = {
  "3days": 3,
  "7days": 7,
  "15days": 15,
  "30days": 30,
};

const BOOST_PRICES = {
  "3days": 99,
  "7days": 199,
  "15days": 349,
  "30days": 599,
};

const activateBoost = async (req, res) => {
  const { serviceId, plan } = req.body;
  const { userId } = req.session.user;

  if (!serviceId || !plan) {
    return res
      .status(400)
      .json({ success: false, message: "Service ID and plan are required." });
  }

  if (!BOOST_PLANS[plan]) {
    return res.status(400).json({
      success: false,
      message: `Invalid plan. Choose from: ${Object.keys(BOOST_PLANS).join(", ")}`,
    });
  }

  try {
    const service = await Service.findById(serviceId);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });

    if (service.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only boost your own services.",
        });
    }

    if (service.isBoosted && service.boostExpiresAt > new Date()) {
      return res.status(409).json({
        success: false,
        message: "This service is already boosted.",
        boostExpiresAt: service.boostExpiresAt,
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + BOOST_PLANS[plan]);

    const boost = await Boost.create({
      service: serviceId,
      boostedBy: userId,
      plan,
      startDate,
      endDate,
      isActive: true,
    });

    await Service.findByIdAndUpdate(serviceId, {
      isBoosted: true,
      boostExpiresAt: endDate,
    });

    return res.status(201).json({
      success: true,
      message: `Service boosted for ${BOOST_PLANS[plan]} days!`,
      data: {
        boostId: boost._id,
        plan,
        startDate,
        endDate,
        price: BOOST_PRICES[plan],
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

const getBoostStatus = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId).select(
      "isBoosted boostExpiresAt",
    );
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });

    if (service.isBoosted && service.boostExpiresAt < new Date()) {
      await Service.findByIdAndUpdate(serviceId, {
        isBoosted: false,
        boostExpiresAt: null,
      });
      return res
        .status(200)
        .json({
          success: true,
          isBoosted: false,
          message: "Boost has expired.",
        });
    }

    return res.status(200).json({
      success: true,
      isBoosted: service.isBoosted,
      boostExpiresAt: service.boostExpiresAt || null,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

const deactivateBoost = async (req, res) => {
  const { serviceId } = req.body;
  const { userId } = req.session.user;

  try {
    const service = await Service.findById(serviceId);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    if (service.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    await Boost.findOneAndUpdate(
      { service: serviceId, isActive: true },
      { isActive: false },
    );
    await Service.findByIdAndUpdate(serviceId, {
      isBoosted: false,
      boostExpiresAt: null,
    });

    return res
      .status(200)
      .json({ success: true, message: "Boost deactivated." });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

const getBoostPlans = async (req, res) => {
  const plans = Object.entries(BOOST_PLANS).map(([key, days]) => ({
    plan: key,
    days,
    price: BOOST_PRICES[key],
    pricePerDay: Math.round(BOOST_PRICES[key] / days),
  }));

  return res.status(200).json({ success: true, data: plans });
};

const getBoostHistory = async (req, res) => {
  const { serviceId } = req.params;
  const { userId } = req.session.user;

  try {
    const service = await Service.findById(serviceId);
    if (!service || service.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Unauthorized or service not found.",
        });
    }

    const boosts = await Boost.find({ service: serviceId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: boosts });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

// ─── Cron — expire overdue boosts ────────────────────────────────────────────
const expireOverdueBoosts = async () => {
  try {
    const now = new Date();

    const expiredServices = await Service.find({
      isBoosted: true,
      boostExpiresAt: { $lt: now },
    }).select("_id serviceName createdBy");

    if (expiredServices.length === 0) return;

    const expiredIds = expiredServices.map((s) => s._id);

    await Service.updateMany(
      { _id: { $in: expiredIds } },
      { isBoosted: false, boostExpiresAt: null },
    );

    await Boost.updateMany(
      { service: { $in: expiredIds }, isActive: true },
      { isActive: false },
    );

    // Send notifications
    for (const service of expiredServices) {
      await notifyBoostExpired({
        recipient: service.createdBy,
        serviceName: service.serviceName,
        serviceId: service._id,
      });
    }
  } catch (error) {
    console.error("expireOverdueBoosts error:", error);
  }
};

module.exports = {
  activateBoost,
  getBoostStatus,
  deactivateBoost,
  getBoostPlans,
  getBoostHistory,
  expireOverdueBoosts,
};
