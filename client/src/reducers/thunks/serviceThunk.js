import axios from "axios";
// import { serviceActions } from "../reducers/service";
import { serviceActions } from "../service";
import { fetchServiceByCategory } from "../../services/service";
import { useSelector } from "react-redux";

export const fetchServicesThunk = (
  categoryId,
  page,
  userLocation,
  filterData
) => {
  return async (dispatch) => {
    try {
      dispatch(serviceActions.setServiceLoading(true));

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

      console.log("response:", response);

      if (response.status === 200) {
        const { services, hasMore } = response.data;

        dispatch(
          serviceActions.setServicesForCategory({
            categoryId,
            services,
          })
        );
        dispatch(
          serviceActions.setHasMoreForCategory({
            categoryId,
            hasMore,
          })
        );
        dispatch(
          serviceActions.setCurrentPage({
            categoryId,
            page: page + 1,
          })
        );
      } else {
        console.log("No services available.");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error);
      } else {
        dispatch(serviceActions.setError(true));
      }
    } finally {
      dispatch(serviceActions.setServiceLoading(false));
    }
  };
};
