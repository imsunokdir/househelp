import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "Category",
  initialState: { categoryId: "" },
  reducers: {
    changeCategory: (state, action) => {
      state.categoryId = action.payload;
    },
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice;
