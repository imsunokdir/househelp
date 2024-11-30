import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "Service",
  initialState: {
    servicesByCategoryId: {}, // Stores services per category
    currentPage: {}, // Tracks the current page for each category
    hasMoreServicesByCategory: {}, // Indicates if more services are available for each category
  },
  reducers: {
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
  },
});

export const serviceActions = serviceSlice.actions;
export default serviceSlice;
