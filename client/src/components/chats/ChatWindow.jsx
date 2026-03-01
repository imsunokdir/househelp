import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, CheckCheck } from "lucide-react";
import useChatSocket, { getSocket } from "../../hooks/useChatSocket";
import { fetchMessages } from "../../reducers/thunks/chatThunk";
import { markMessagesRead } from "../../reducers/chatSlice";

const MessageSkeleton = () => (
  <div className="flex flex-col gap-3 px-4 py-4">
    {/* Other person message */}
    <div className="flex justify-start">
      <div className="h-8 w-40 bg-gray-200 rounded-2xl rounded-bl-sm animate-pulse" />
    </div>
    {/* My message */}
    <div className="flex justify-end">
      <div className="h-8 w-52 bg-blue-100 rounded-2xl rounded-br-sm animate-pulse" />
    </div>
    {/* Other */}
    <div className="flex justify-start">
      <div className="h-8 w-32 bg-gray-200 rounded-2xl rounded-bl-sm animate-pulse" />
    </div>
    {/* My message */}
    <div className="flex justify-end">
      <div className="h-8 w-44 bg-blue-100 rounded-2xl rounded-br-sm animate-pulse" />
    </div>
    {/* Other */}
    <div className="flex justify-start">
      <div className="h-16 w-56 bg-gray-200 rounded-2xl rounded-bl-sm animate-pulse" />
    </div>
  </div>
);

const ChatWindow = ({ conversationId, currentUserId, onBack }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState([]);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastReadRef = useRef(0);

  const {
    sendMessage,
    startTyping,
    stopTyping,
    joinConversation,
    leaveConversation,
    markRead,
  } = useChatSocket(currentUserId);

  const messages = useSelector(
    (state) => state.chat.messages[conversationId] ?? [],
    shallowEqual,
  );
  const messagesLoading = useSelector((state) => state.chat.messagesLoading);
  const conversations = useSelector(
    (state) => state.chat.conversations,
    shallowEqual,
  );
  const onlineUsers = useSelector(
    (state) => state.chat.onlineUsers,
    shallowEqual,
  );

  const conversation = conversations.find((c) => c._id === conversationId);
  const otherParticipant = conversation?.participants?.find(
    (p) => p._id !== currentUserId,
  );
  const isOtherOnline = onlineUsers[otherParticipant?._id];

  // Clear optimistic messages when real ones arrive
  useEffect(() => {
    if (messages.length > 0) setOptimisticMessages([]);
  }, [messages.length]);

  useEffect(() => {
    if (!conversationId) return;
    dispatch(fetchMessages({ conversationId }));
    joinConversation(conversationId);
    markRead(conversationId, currentUserId);
    return () => leaveConversation(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || messages.length === 0) return;
    if (messages.length === lastReadRef.current) return;
    lastReadRef.current = messages.length;
    markRead(conversationId, currentUserId);
    dispatch(markMessagesRead({ conversationId, readBy: currentUserId }));
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, optimisticMessages, isOtherTyping]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTypingStart = ({ userId }) => {
      if (userId !== currentUserId) setIsOtherTyping(true);
    };
    const handleTypingStop = ({ userId }) => {
      if (userId !== currentUserId) setIsOtherTyping(false);
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [currentUserId]);

  const handleTyping = (e) => {
    setText(e.target.value);
    startTyping(conversationId, currentUserId);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId, currentUserId);
    }, 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;

    // Add optimistic message immediately
    const optimistic = {
      _id: `optimistic-${Date.now()}`,
      text: text.trim(),
      sender: { _id: currentUserId },
      conversation: conversationId,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setOptimisticMessages((prev) => [...prev, optimistic]);

    sendMessage(conversationId, text.trim(), currentUserId);
    setText("");
    stopTyping(conversationId, currentUserId);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMyMessage = (msg) =>
    msg.sender?._id === currentUserId || msg.sender === currentUserId;

  const isRead = (msg) => msg.readBy?.some((r) => r.user !== currentUserId);

  // Combine real + optimistic messages
  const allMessages = [...messages, ...optimisticMessages];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        )}
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
            {otherParticipant?.avatar ? (
              <img
                src={otherParticipant.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              otherParticipant?.username?.[0]?.toUpperCase() || "?"
            )}
          </div>
          {isOtherOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {otherParticipant?.username}
          </p>
          <p className="text-xs text-gray-400">
            {isOtherTyping ? (
              <span className="text-blue-500">typing...</span>
            ) : isOtherOnline ? (
              "Online"
            ) : (
              conversation?.service?.serviceName || "Offline"
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {messagesLoading ? (
          <MessageSkeleton />
        ) : allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400">Say hello! 👋</p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-2">
            <AnimatePresence initial={false}>
              {allMessages.map((msg, i) => {
                const mine = isMyMessage(msg);
                const read = isRead(msg);
                const showTime =
                  i === 0 ||
                  new Date(msg.createdAt) -
                    new Date(allMessages[i - 1]?.createdAt) >
                    300000;

                return (
                  <React.Fragment key={msg._id || i}>
                    {showTime && (
                      <div className="flex justify-center my-2">
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(msg.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed transition-colors duration-300
                            ${
                              mine
                                ? msg.pending
                                  ? "bg-blue-300 text-white rounded-br-sm"
                                  : "bg-blue-500 text-white rounded-br-sm"
                                : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                            }`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 ${mine ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-[10px] text-gray-400">
                            {msg.pending
                              ? "sending..."
                              : formatTime(msg.createdAt)}
                          </span>
                          {mine && !msg.pending && (
                            <CheckCheck
                              size={12}
                              className={
                                read ? "text-blue-400" : "text-gray-300"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {isOtherTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none bg-gray-100 rounded-2xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-200 transition-all max-h-32 overflow-y-auto"
            style={{ minHeight: "42px" }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send
              size={16}
              className={text.trim() ? "text-white" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
