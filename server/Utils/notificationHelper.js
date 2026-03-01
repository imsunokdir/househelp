const Notification = require("../Models/notification.schema");

// Global io instance — set once when server starts
let _io = null;

const setIO = (io) => {
  _io = io;
};

// ─── Core helper — call this from anywhere to create a notification ───────────
const createNotification = async ({
  recipient,
  type,
  title,
  body,
  reference = null,
  referenceModel = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      type,
      title,
      body,
      reference,
      referenceModel,
    });

    // Emit real-time notification via Socket.io if user is online
    if (_io) {
      _io.to(`user:${recipient}`).emit("notification:new", notification);
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// ─── Notification creators for each type ─────────────────────────────────────

const notifyNewMessage = async ({ recipient, senderName, conversationId }) => {
  return createNotification({
    recipient,
    type: "NEW_MESSAGE",
    title: "New Message",
    body: `You have a new message from ${senderName}`,
    reference: conversationId,
    referenceModel: "Conversation",
  });
};

const notifyListingExpiring = async ({ recipient, serviceName, serviceId }) => {
  return createNotification({
    recipient,
    type: "LISTING_EXPIRING",
    title: "Listing Expiring Soon",
    body: `Your listing "${serviceName}" expires in 3 days. Renew it to stay visible.`,
    reference: serviceId,
    referenceModel: "Service",
  });
};

const notifyListingExpired = async ({ recipient, serviceName, serviceId }) => {
  return createNotification({
    recipient,
    type: "LISTING_EXPIRED",
    title: "Listing Expired",
    body: `Your listing "${serviceName}" has expired and is no longer visible. Renew it now.`,
    reference: serviceId,
    referenceModel: "Service",
  });
};

const notifyBoostExpired = async ({ recipient, serviceName, serviceId }) => {
  return createNotification({
    recipient,
    type: "BOOST_EXPIRED",
    title: "Boost Expired",
    body: `Your boost for "${serviceName}" has expired. Boost again to appear at the top.`,
    reference: serviceId,
    referenceModel: "Service",
  });
};

module.exports = {
  setIO,
  createNotification,
  notifyNewMessage,
  notifyListingExpiring,
  notifyListingExpired,
  notifyBoostExpired,
};
