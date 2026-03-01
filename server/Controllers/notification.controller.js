const Notification = require("../Models/notification.schema");

// ─── Get all notifications for current user ───────────────────────────────────
const getMyNotifications = async (req, res) => {
  const { userId } = req.session.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const total = await Notification.countDocuments({ recipient: userId });

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Get unread notification count (for bell badge) ──────────────────────────
const getUnreadCount = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      type: { $ne: "NEW_MESSAGE" },
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Mark a single notification as read ──────────────────────────────────────
const markAsRead = async (req, res) => {
  const { notificationId } = req.params;
  const { userId } = req.session.user;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Mark all notifications as read ──────────────────────────────────────────
const markAllAsRead = async (req, res) => {
  const { userId } = req.session.user;

  try {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Delete a single notification ────────────────────────────────────────────
const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { userId } = req.session.user;

  try {
    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Clear all notifications ──────────────────────────────────────────────────
const clearAllNotifications = async (req, res) => {
  const { userId } = req.session.user;

  try {
    await Notification.deleteMany({ recipient: userId });

    return res.status(200).json({
      success: true,
      message: "All notifications cleared.",
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
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
