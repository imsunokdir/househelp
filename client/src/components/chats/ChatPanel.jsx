import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ChevronLeft } from "lucide-react";
import {
  addMessage,
  closeChat,
  setActiveConversation,
} from "../../reducers/chatSlice";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import useChatSocket, { getSocket } from "../../hooks/useChatSocket";
import { fetchConversations } from "../../reducers/thunks/chatThunk";

const ChatPanel = ({ currentUserId }) => {
  const dispatch = useDispatch();
  const { isOpen, activeConversationId } = useSelector((state) => state.chat);
  console.log("ChatPanel currentUserId:", currentUserId);

  // Initialize socket connection
  useChatSocket(currentUserId);

  const handleClose = () => dispatch(closeChat());
  const handleBack = () => dispatch(setActiveConversation(null));

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // useEffect(() => {
  //   if (!currentUserId) return;
  //   dispatch(fetchConversations());
  // }, [currentUserId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — only on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`
              fixed z-50 bg-white shadow-2xl flex flex-col
              /* Mobile — full screen */
              inset-0
              /* Desktop — side panel */
              sm:inset-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-96 sm:border-l sm:border-gray-200
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                {activeConversationId && (
                  <button
                    onClick={handleBack}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors sm:hidden"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-500" />
                  <h2 className="text-base font-semibold text-gray-800">
                    {activeConversationId ? "Chat" : "Messages"}
                  </h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {activeConversationId ? (
                  <motion.div
                    key="chat-window"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    <ChatWindow
                      conversationId={activeConversationId}
                      currentUserId={currentUserId}
                      onBack={handleBack}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="conversation-list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 overflow-hidden"
                  >
                    <ConversationList currentUserId={currentUserId} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
