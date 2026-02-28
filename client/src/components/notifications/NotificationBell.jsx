import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageSquare, Clock, Zap, CheckCheck, X } from "lucide-react";
import { getSocket } from "../../hooks/useChatSocket";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notification";
import { useDispatch } from "react-redux";
import { openChat, setActiveConversation } from "../../reducers/chatSlice";

const ICONS = {
  NEW_MESSAGE: <MessageSquare size={16} className="text-blue-500" />,
  LISTING_EXPIRING: <Clock size={16} className="text-orange-500" />,
  LISTING_EXPIRED: <Clock size={16} className="text-red-500" />,
  BOOST_EXPIRED: <Zap size={16} className="text-purple-500" />,
};

const formatTime = (date) => {
  const diff = Date.now() - new Date(date);
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(date).toLocaleDateString();
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const loadUnreadCount = async () => {
    try {
      const res = await fetchUnreadCount();
      setUnreadCount(res.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count");
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      // setNotifications(res.data.data || []);
      setNotifications(
        (res.data.data || []).filter((n) => n.type !== "NEW_MESSAGE"),
      );
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  // On mount — fetch count + listen for real-time notifications
  useEffect(() => {
    loadUnreadCount();

    const socket = getSocket();
    if (!socket) return;

    const handleNew = (notification) => {
      if (notification.type === "NEW_MESSAGE") return; // ignore message notifications
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNew);
    return () => socket.off("notification:new", handleNew);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (!open) loadNotifications();
    setOpen((prev) => !prev);
  };

  const handleNotificationClick = async (n) => {
    // Mark as read
    if (!n.isRead) {
      try {
        await markNotificationAsRead(n._id);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === n._id ? { ...notif, isRead: true } : notif,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark as read");
      }
    }

    // Navigate based on type
    if (n.type === "NEW_MESSAGE" && n.reference) {
      setOpen(false);
      dispatch(setActiveConversation(n.reference));
      dispatch(openChat(n.reference));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      const deleted = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deleted && !deleted.isRead)
        setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to delete notification");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-gray-200 rounded-full transition-colors"
      >
        <Bell size={22} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed right-4 top-16 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-[9999] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                  <Bell size={32} strokeWidth={1} />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleNotificationClick(n)}
                    className={`group flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50
                      ${!n.isRead ? "bg-blue-50/60" : ""}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {ICONS[n.type] || (
                        <Bell size={16} className="text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${!n.isRead ? "text-gray-900 font-medium" : "text-gray-600"}`}
                      >
                        {n.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => handleDelete(e, n._id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} className="text-gray-400" />
                      </button>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
