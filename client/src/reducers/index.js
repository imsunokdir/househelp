import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./category";
import userSlice from "./user";
import serviceSlice from "./service";

const rootReducer = configureStore({
  reducer: {
    category: categorySlice.reducer,
    user: userSlice.reducer,
    service: serviceSlice.reducer,
  },
});

export default rootReducer;
