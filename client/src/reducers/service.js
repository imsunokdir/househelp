import { createSlice } from "@reduxjs/toolkit";
import { fetchServiceByCategoryThunk } from "./thunks/servicesThunk";

const updateServiceState = (state, categoryId, data) => {
  const { page, hasMore, services } = data;
  console.log("services:", ...services);

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
    status: "idle", //loading || succeeded || "failed"
  },
  reducers: {
    // setServiceLoading: (state, action) => {
    //   state.serviceLoading = action.payload;
    // },
    // setServicesForCategory: (state, action) => {
    //   const { categoryId, services, page } = action.payload;
    //   // Update services for the category
    //   state.servicesByCategoryId = {
    //     ...state.servicesByCategoryId,
    //     [categoryId]: [
    //       ...(state.servicesByCategoryId[categoryId] || []),
    //       ...services,
    //     ],
    //   };
    // Update the current page for the category
    // state.currentPage = {
    //   ...state.currentPage,
    //   [categoryId]: page,
    // };
    // },
    // setHasMoreForCategory: (state, action) => {
    //   const { categoryId, hasMore } = action.payload;
    //   // Set whether more services are available for the category
    //   state.hasMoreServicesByCategory = {
    //     ...state.hasMoreServicesByCategory,
    //     [categoryId]: hasMore,
    //   };
    // },
    // setCurrentPage: (state, action) => {
    //   const { categoryId, page } = action.payload;
    //   // Directly update the current page for the given category
    //   state.currentPage = {
    //     ...state.currentPage,
    //     [categoryId]: page,
    //   };
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
    clearServices: (state) => {
      console.log("clear services reer");
      state.status = "idle";
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
        // console.log("services thunk:::::: Loading");
        state.status = "loading";
      })
      .addCase(fetchServiceByCategoryThunk.fulfilled, (state, action) => {
        // console.log("services thunk:::::: succeeded");
        // console.log("action.payload:", action.payload);
        state.status = "succeeded";
        const { data, status, categoryId } = action.payload;

        updateServiceState(state, categoryId, data);
      })
      .addCase(fetchServiceByCategoryThunk.rejected, (state) => {
        state.status = "failed";
        console.log("services thunk:::::: failed");
      });
  },
});

export const getServiceStatus = (state) => state.service.status;
export const getAllServices = (state) => state.service.servicesByCategoryId;
export const getCurrentPageByCategory = (state, categoryId) =>
  state.service.currentPage[categoryId] || 1;
export const getHasMoreServicesByCategory = (state, categoryId) =>
  state.service.hasMoreServicesByCategory[categoryId] ?? true;

export const serviceActions = serviceSlice.actions;
export default serviceSlice;
