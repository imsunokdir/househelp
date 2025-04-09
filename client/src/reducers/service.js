import { createSlice } from "@reduxjs/toolkit";
import { fetchServiceByCategoryThunk } from "./thunks/servicesThunk";

const updateServiceState = (state, categoryId, data) => {
  const { page, hasMore, services } = data;

  state.currentPage[categoryId] = page;
  state.hasMoreServicesByCategory[categoryId] = hasMore;
  if (!state.servicesByCategoryId[categoryId]) {
    state.servicesByCategoryId[categoryId] = [];
  }
  state.servicesByCategoryId[categoryId].push(...services);
};

const serviceSlice = createSlice({
  name: "Service",
  initialState: {
    servicesByCategoryId: {}, // Stores services per category
    currentPage: {}, // Tracks the current page for each category
    hasMoreServicesByCategory: {}, // Indicates if more services are available for each category
    serviceLoading: true,
    error: false,
    status: "loading", //loading || succeeded || "failed"
  },
  reducers: {
    clearServices: (state) => {
      // state.status = "idle";
      state.servicesByCategoryId = {};
      state.hasMoreServicesByCategory = {};
      state.currentPage = {};

      state.serviceLoading = true;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceByCategoryThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServiceByCategoryThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { data, status, categoryId } = action.payload;

        updateServiceState(state, categoryId, data);
      })
      .addCase(fetchServiceByCategoryThunk.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const getServiceStatus = (state) => state.service.status;
export const getAllServices = (state) => state.service.servicesByCategoryId;
export const getCurrentPageByCategory = (state, categoryId) =>
  state.service.currentPage[categoryId] || 1;
export const getHasMoreServicesByCategory = (state, categoryId) =>
  state.service.hasMoreServicesByCategory[categoryId] ?? true;

export const getServicesByCategory = (state, categoryId) =>
  categoryId ? state.service.servicesByCategoryId[categoryId] : null;

export const serviceActions = serviceSlice.actions;
export default serviceSlice;
