import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchServiceByCategory } from "../../services/service";

export const fetchServiceByCategoryThunk = createAsyncThunk(
  "services/getServiceByCategory",
  async ({ categoryId, page, userLocation, filterData }) => {
    try {
      const { coordinates } = userLocation || {};
      const longitude = coordinates?.[0];
      const latitude = coordinates?.[1];
      const response = await fetchServiceByCategory(
        categoryId,
        page,
        5,
        longitude,
        latitude,
        filterData,
        axios.CancelToken.source().token
      );

      //   console.log("returned data for fetch thunk:", response.data);

      return {
        data: response.data,
        status: response.status,
        categoryId,
      };
    } catch (error) {}
  }
);
