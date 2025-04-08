import { createSlice } from "@reduxjs/toolkit";
import { fetchServiceByCategoryThunk } from "./thunks/servicesThunk";

const updateServiceState = (state, categoryId, data) => {
  const { page, hasMore, services } = data;
  console.log("datat datata:", services);
  // state.currentPage[categoryId]=page;
  // state.hasMoreServicesByCategory[categoryId]=hasMore;
  // if(!state.servicesByCategoryId[categoryId]){
  //   state.servicesByCategoryId[categoryId]=[]
  // }
  // state.servicesByCategoryId[categoryId].push(...data.);
};

const serviceSlice = createSlice({
  name: "Service",
  initialState: {
    servicesByCategoryId: {}, // Stores services per category
    currentPage: {}, // Tracks the current page for each category
    hasMoreServicesByCategory: {}, // Indicates if more services are available for each category
    serviceLoading: true,
    error: false,
  },
  reducers: {
    setServiceLoading: (state, action) => {
      state.serviceLoading = action.payload;
    },
    setServicesForCategory: (state, action) => {
      const { categoryId, services, page } = action.payload;

      // Update services for the category
      state.servicesByCategoryId = {
        ...state.servicesByCategoryId,
        [categoryId]: [
          ...(state.servicesByCategoryId[categoryId] || []),
          ...services,
        ],
      };

      // Update the current page for the category
      // state.currentPage = {
      //   ...state.currentPage,
      //   [categoryId]: page,
      // };
    },

    setHasMoreForCategory: (state, action) => {
      const { categoryId, hasMore } = action.payload;

      // Set whether more services are available for the category
      state.hasMoreServicesByCategory = {
        ...state.hasMoreServicesByCategory,
        [categoryId]: hasMore,
      };
    },
    setCurrentPage: (state, action) => {
      const { categoryId, page } = action.payload;
      // Directly update the current page for the given category
      state.currentPage = {
        ...state.currentPage,
        [categoryId]: page,
      };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearServices: (state) => {
      state.servicesByCategoryId = {};
      state.hasMoreServicesByCategory = {};
      state.currentPage = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceByCategoryThunk.pending, (state) => {
        console.log("services thunk:::::: Loading");
      })
      .addCase(fetchServiceByCategoryThunk.fulfilled, (state, action) => {
        console.log("services thunk:::::: succeeded");
        console.log("action.payload:", action.payload);
        const { data, status, categoryId } = action.payload;
        const { services, totalCount, hasMore } = data;

        updateServiceState(state, categoryId, data);
      })
      .addCase(fetchServiceByCategoryThunk.rejected, (state) => {
        console.log("services thunk:::::: failed");
      });
  },
});

export const serviceActions = serviceSlice.actions;
export default serviceSlice;
