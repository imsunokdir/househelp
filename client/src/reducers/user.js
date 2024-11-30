import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "UserStore",
  initialState: {
    userLocation: {
      address: null,
      country: null,
      coordinates: [null, null],
    },
  },
  reducers: {
    setUserLocationStore: (state, action) => {
      state.userLocation = {
        ...state.userLocation,
        ...action.payload,
      };
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
