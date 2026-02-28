import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../services/axiosInstance";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/message/conversations`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch conversations",
      );
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ conversationId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/message/${conversationId}?page=${page}`,
        { withCredentials: true },
      );
      return {
        conversationId,
        messages: res.data.data,
        pagination: res.data.pagination,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const getOrCreateConversation = createAsyncThunk(
  "chat/getOrCreateConversation",
  async ({ workerId, serviceId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/message/conversation`,
        { workerId, serviceId },
        { withCredentials: true },
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to open conversation",
      );
    }
  },
);
