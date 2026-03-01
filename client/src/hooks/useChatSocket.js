import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import {
  addMessage,
  setUserOnlineStatus,
  markMessagesRead,
} from "../reducers/chatSlice";
import { fetchConversations } from "../reducers/thunks/chatThunk";

const SOCKET_URL = import.meta.env.VITE_ROOT_ROUTE;

let socketInstance = null;

export const getSocket = () => socketInstance;

const useChatSocket = (userId) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Create socket connection once for entire app lifetime
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });

      // socketInstance.on("connect", () => {
      //   console.log("🟢 socket connected:", socketInstance.id);
      // });

      // socketInstance.on("disconnect", () => {
      //   console.log("🔴 socket disconnected");
      // });
    }

    socketRef.current = socketInstance;
    const socket = socketRef.current;

    // Emit user:online only after socket is confirmed connected
    const emitOnline = () => {
      socket.emit("user:online", userId);
      dispatch(fetchConversations());
    };

    if (socket.connected) {
      emitOnline();
    } else {
      socket.once("connect", emitOnline);
    }

    // ── Listeners ─────────────────────────────────────────────────────────────
    // Remove before re-adding to prevent duplicates on re-renders
    socket.off("message:receive");
    socket.on("message:receive", (message) => {
      dispatch(addMessage({ ...message, currentUserId: userId }));
    });

    socket.off("user:status");
    socket.on("user:status", ({ userId: uid, isOnline }) => {
      dispatch(setUserOnlineStatus({ userId: uid, isOnline }));
    });

    socket.off("messages:read");
    socket.on("messages:read", ({ conversationId, readBy }) => {
      dispatch(markMessagesRead({ conversationId, readBy }));
    });

    // Only cleanup the connect listener — socket itself persists for app lifetime
    return () => {
      socket.off("connect", emitOnline);
    };
  }, [userId, dispatch]);

  const joinConversation = useCallback((conversationId) => {
    socketInstance?.emit("conversation:join", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    socketInstance?.emit("conversation:leave", conversationId);
  }, []);

  const sendMessage = useCallback((conversationId, text, senderId) => {
    socketInstance?.emit("message:send", { conversationId, text, senderId });
  }, []);

  const startTyping = useCallback((conversationId, userId) => {
    socketInstance?.emit("typing:start", { conversationId, userId });
  }, []);

  const stopTyping = useCallback((conversationId, userId) => {
    socketInstance?.emit("typing:stop", { conversationId, userId });
  }, []);

  const markRead = useCallback((conversationId, userId) => {
    socketInstance?.emit("messages:read", { conversationId, userId });
  }, []);

  return {
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markRead,
  };
};

export default useChatSocket;
