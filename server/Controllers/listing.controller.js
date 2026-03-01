const mongoose = require("mongoose");
const Service = require("../Models/service.schema");
const {
  notifyListingExpiring,
  notifyListingExpired,
} = require("../Utils/notificationHelper");

const renewService = async (req, res) => {
  const { serviceId } = req.body;
  const { userId } = req.session.user;

  if (!serviceId) {
    return res
      .status(400)
      .json({ success: false, message: "Service ID is required." });
  }

  try {
    const service = await Service.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    if (service.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const baseDate =
      service.isExpired || service.expiresAt < new Date()
        ? new Date()
        : service.expiresAt;

    const newExpiresAt = new Date(baseDate);
    newExpiresAt.setDate(newExpiresAt.getDate() + 30);

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        expiresAt: newExpiresAt,
        isExpired: false,
        status: "Active",
        $inc: { renewalCount: 1 },
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Service renewed for 30 more days.",
      data: {
        serviceId: updatedService._id,
        expiresAt: updatedService.expiresAt,
        renewalCount: updatedService.renewalCount,
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

const getListingStatus = async (req, res) => {
  const { serviceId } = req.params;
  const { userId } = req.session.user;

  try {
    const service = await Service.findById(serviceId).select(
      "expiresAt isExpired isPaid renewalCount createdBy status",
    );

    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    if (service.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    const now = new Date();
    const daysRemaining = Math.ceil(
      (service.expiresAt - now) / (1000 * 60 * 60 * 24),
    );

    return res.status(200).json({
      success: true,
      data: {
        isExpired: service.isExpired || service.expiresAt < now,
        expiresAt: service.expiresAt,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
        isPaid: service.isPaid,
        renewalCount: service.renewalCount,
        status: service.status,
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

const checkPostingEligibility = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const freeServiceCount = await Service.countDocuments({
      createdBy: userId,
      isPaid: false,
      isExpired: false,
    });

    const canPostFree = freeServiceCount < 1;

    return res.status(200).json({
      success: true,
      canPostFree,
      freeServiceCount,
      freeLimit: 1,
      message: canPostFree
        ? "You can post a free service."
        : "Free limit reached.",
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

// ─── Cron — warn listings expiring in 3 days ─────────────────────────────────
const warnExpiringListings = async () => {
  try {
    const now = new Date();
    const in3Days = new Date();
    in3Days.setDate(in3Days.getDate() + 3);

    const expiringSoon = await Service.find({
      isExpired: false,
      expiresAt: { $gte: now, $lte: in3Days },
    }).select("_id serviceName createdBy");

    for (const service of expiringSoon) {
      await notifyListingExpiring({
        recipient: service.createdBy,
        serviceName: service.serviceName,
        serviceId: service._id,
      });
    }
  } catch (error) {
    console.error("warnExpiringListings error:", error);
  }
};

// ─── Cron — expire overdue listings ──────────────────────────────────────────
const expireOverdueListings = async () => {
  try {
    const now = new Date();

    const toExpire = await Service.find({
      isExpired: false,
      expiresAt: { $lt: now },
    }).select("_id serviceName createdBy");

    if (toExpire.length === 0) return;

    await Service.updateMany(
      { _id: { $in: toExpire.map((s) => s._id) } },
      { isExpired: true, status: "Inactive" },
    );

    for (const service of toExpire) {
      await notifyListingExpired({
        recipient: service.createdBy,
        serviceName: service.serviceName,
        serviceId: service._id,
      });
    }
  } catch (error) {
    console.error("expireOverdueListings error:", error);
  }
};

module.exports = {
  renewService,
  getListingStatus,
  checkPostingEligibility,
  expireOverdueListings,
  warnExpiringListings,
};
