import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConversations,
  fetchMessages,
  getOrCreateConversation,
} from "./thunks/chatThunk";

const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

// ─── Slice ────────────────────────────────────────────────────────────────────

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    isOpen: false,
    activeConversationId: null,
    conversations: [],
    messages: {}, // { conversationId: [messages] }
    onlineUsers: {}, // { userId: boolean }
    typingUsers: {}, // { conversationId: userId }
    conversationsLoading: false,
    messagesLoading: false,
    error: null,
  },
  reducers: {
    openChat: (state, action) => {
      state.isOpen = true;
      if (action.payload) {
        state.activeConversationId = action.payload;
      }
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const convId = message.conversation;
      if (!state.messages[convId]) state.messages[convId] = [];

      const exists = state.messages[convId].some((m) => m._id === message._id);
      if (!exists) state.messages[convId].push(message);

      // Update last message in conversation list
      const conv = state.conversations.find((c) => c._id === convId);
      console.log(
        "addMessage - convId:",
        convId,
        "conv found:",
        !!conv,
        "conversations count:",
        state.conversations.length,
      );

      if (conv) {
        conv.lastMessage = {
          text: message.text,
          sentAt: message.createdAt,
          sentBy: message.sender,
        };
        // Increment unread count if message is not from current user
        // We pass currentUserId via the action payload
        if (
          message.currentUserId &&
          message.sender?._id !== message.currentUserId
        ) {
          conv.myUnreadCount = (conv.myUnreadCount || 0) + 1;
        }
      }
    },
    setUserOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      state.onlineUsers[userId] = isOnline;
    },
    setTyping: (state, action) => {
      const { conversationId, userId } = action.payload;
      state.typingUsers[conversationId] = userId;
    },
    clearTyping: (state, action) => {
      delete state.typingUsers[action.payload];
    },
    markMessagesRead: (state, action) => {
      const { conversationId, readBy } = action.payload;

      const conv = state.conversations.find((c) => c._id === conversationId);
      if (conv) conv.myUnreadCount = 0;

      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map(
          (msg) => ({
            ...msg,
            readBy: msg.readBy?.some((r) => r.user === readBy)
              ? msg.readBy
              : [
                  ...(msg.readBy || []),
                  { user: readBy, readAt: new Date().toISOString() },
                ],
          }),
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.conversationsLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversationsLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.conversationsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        const conv = action.payload;
        state.activeConversationId = conv._id;
        state.isOpen = true;
        // Add to conversations list if not already there
        const exists = state.conversations.some((c) => c._id === conv._id);
        if (!exists) state.conversations.unshift(conv);
      });
  },
});

export const {
  openChat,
  closeChat,
  setActiveConversation,
  addMessage,
  setUserOnlineStatus,
  setTyping,
  clearTyping,
  markMessagesRead,
} = chatSlice.actions;

export default chatSlice.reducer;
