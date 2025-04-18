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
    batchesLoadedByCategory: {},
    status: "loading", //loading || succeeded || "failed"
    MAX_AUTO_LOAD: 2,
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
    incrementBatchLoaded: (state, action) => {
      const categoryId = action.payload;
      if (!state.batchesLoadedByCategory) {
        state.batchesLoadedByCategory = {};
      }
      if (!state.batchesLoadedByCategory[categoryId]) {
        state.batchesLoadedByCategory[categoryId] = 0;
      }
      state.batchesLoadedByCategory[categoryId]++;
    },
    resetBatchLoaded: (state, action) => {
      const categoryId = action.payload;
      if (state.batchesLoadedByCategory?.[categoryId]) {
        state.batchesLoadedByCategory[categoryId] = 0;
      }
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
        if (!state.batchesLoadedByCategory[categoryId]) {
          state.batchesLoadedByCategory[categoryId] = 0;
        }
        state.batchesLoadedByCategory[categoryId]++;
        // ✅ Reset to 0 if it reaches MAX_AUTO_LOAD

        // if (state.batchesLoadedByCategory[categoryId] >= state.MAX_AUTO_LOAD) {
        //   state.batchesLoadedByCategory[categoryId] = 0;
        // }
      })
      .addCase(fetchServiceByCategoryThunk.rejected, (state) => {
        state.status = "failed";
        console.log("rejected");
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

export const getBatchesLoadedByCategory = (state, categoryId) =>
  state.service.batchesLoadedByCategory[categoryId] || 0;

export const serviceActions = serviceSlice.actions;
export default serviceSlice;
