import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveConversation } from "../../reducers/chatSlice";
import { Skeleton } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { fetchConversations } from "../../reducers/thunks/chatThunk";

const ConversationList = ({ currentUserId }) => {
  const dispatch = useDispatch();
  const {
    conversations,
    conversationsLoading,
    activeConversationId,
    onlineUsers,
  } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const getOtherParticipant = (conv) => {
    return conv.participants?.find((p) => p._id !== currentUserId);
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString();
  };

  if (conversationsLoading) {
    return (
      <div className="p-4 space-y-4">
        {new Array(5).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton.Avatar active size={44} />
            <div className="flex-1">
              <Skeleton.Input
                active
                size="small"
                style={{ width: "60%", marginBottom: 6 }}
              />
              <Skeleton.Input active size="small" style={{ width: "90%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 p-8">
        <MessageSquare size={48} strokeWidth={1} />
        <p className="text-sm text-center">
          No conversations yet. Message a service provider to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <AnimatePresence>
        {conversations.map((conv, i) => {
          const other = getOtherParticipant(conv);
          const isActive = conv._id === activeConversationId;
          const isOnline = onlineUsers[other?._id];
          const hasUnread = conv.myUnreadCount > 0;

          return (
            <motion.div
              key={conv._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => dispatch(setActiveConversation(conv._id))}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-50
                ${isActive ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-gray-50"}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                  {other?.avatar ? (
                    <img
                      src={other.avatar}
                      alt={other.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    other?.username?.[0]?.toUpperCase() || "?"
                  )}
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm truncate ${hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                  >
                    {other?.username || "Unknown"}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatTime(conv.lastMessage?.sentAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p
                    className={`text-xs truncate ${hasUnread ? "text-gray-800 font-medium" : "text-gray-400"}`}
                  >
                    {conv.lastMessage?.text ||
                      conv.service?.serviceName ||
                      "Start a conversation"}
                  </p>
                  {hasUnread && (
                    <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {conv.myUnreadCount > 9 ? "9+" : conv.myUnreadCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ConversationList;
