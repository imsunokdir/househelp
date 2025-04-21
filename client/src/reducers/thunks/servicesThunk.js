import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchServiceByCategory } from "../../services/service";

export const fetchServiceByCategoryThunk = createAsyncThunk(
  "services/getServiceByCategory",
  async (
    { categoryId, page, userLocation, filterData, signal },
    { rejectWithValue }
  ) => {
    try {
      const { coordinates } = userLocation || {};
      const longitude = coordinates?.[0];
      const latitude = coordinates?.[1];
      // console.log(
      //   "🚀 Fetching services for category:",
      //   categoryId,
      //   "with page:",
      //   page
      // );

      const response = await fetchServiceByCategory(
        categoryId,
        page,
        10,
        longitude,
        latitude,
        filterData,
        signal
      );

      return {
        data: response.data,
        status: response.status,
        categoryId,
        page,
      };
    } catch (error) {
      // console.log("🔥 Entered catch block of thunk");
      // Check for abort in a more comprehensive way
      if (
        error.name === "AbortError" ||
        error.name === "CanceledError" ||
        error.code === "ERR_CANCELED" ||
        error.isCanceled
      ) {
        // console.log("⚠️ Request canceled due to category change:", categoryId);
        return rejectWithValue({
          message: "Request was canceled",
          categoryId,
          canceled: true,
        });
      } else {
        // console.error("❌ Failed to fetch services:", error);
        return rejectWithValue({
          message:
            error?.response?.data?.message ||
            error.message ||
            "Unknown error occurred while fetching services",
          categoryId,
        });
      }
    }
  }
);
