import { createSlice } from "@reduxjs/toolkit";
import categorySlice from "./category";

const initialState = {
  priceRange: { minimum: 0, maximum: null },
  rating: null,
  experience: null,
  // availability: [],
  filterApplied: false,
  filterCount: 0,
  filterApplying: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      // state.filterApplied = true;
      updateFilterCount(state);
    },
    setRating: (state, action) => {
      state.rating = action.payload;
      state.filterApplying = true;
      updateFilterCount(state);
    },
    setExperience: (state, action) => {
      state.experience = action.payload;
      state.filterApplying = true;
      updateFilterCount(state);
    },
    setAvailability: (state, action) => {
      state.availability = action.payload;
      state.filterApplying = true;
      updateFilterCount(state);
    },
    setIsFilterApplied: (state) => {
      state.filterApplied = true;
    },
    setFilterApplying: (state) => {
      state.filterApplying = false;
    },
    clearFilters: (state) => {
      state.priceRange = { minimum: 0, maximum: null };
      state.rating = null;
      state.experience = null;
      // state.availability = [];
      // state.filterApplied = false;
      state.filterCount = 0;
      state.filterApplied = false;
    },
  },
});

const updateFilterCount = (state) => {
  let count = 0;
  if (state.priceRange.minimum !== 0 || state.priceRange.maximum !== null) {
    count++;
  }
  if (state.rating > 0) {
    count++;
  }
  if (state.experience > 0) {
    count++;
  }
  // if (state.availability.length > 0) {
  //   count++;
  // }
  state.filterCount = count; // Update the filter count
};

export const filterActions = filterSlice.actions;
export default filterSlice;
