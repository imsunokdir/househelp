import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./category";
import userSlice from "./user";
import serviceSlice from "./service";
import filterSlice from "./filter";
import { thunk } from "redux-thunk";

const rootReducer = configureStore({
  reducer: {
    category: categorySlice.reducer,
    user: userSlice.reducer,
    service: serviceSlice.reducer,
    filter: filterSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default rootReducer;
