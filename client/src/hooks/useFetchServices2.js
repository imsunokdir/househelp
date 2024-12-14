import { useDispatch, useSelector } from "react-redux";
import { useEffect, useContext } from "react";
// import { fetchServicesThunk } from "../path_to_your_thunk"; // Update with the actual path
// import { AuthContext } from "../contexts/AuthProvider";
import { fetchServicesThunk } from "../reducers/thunks/serviceThunk";
import { AuthContext } from "../contexts/AuthProvider";

const useFetchService2 = () => {
  const dispatch = useDispatch();
  const { userLocation } = useContext(AuthContext);
  const { categoryId } = useSelector((state) => state.category);
  const { currentPage, hasMoreServicesByCategory } = useSelector(
    (state) => state.service
  );

  const page = currentPage[categoryId] || 1;
  const hasMore = hasMoreServicesByCategory[categoryId] || false;

  useEffect(() => {
    if (hasMore && userLocation.coordinates) {
      dispatch(fetchServicesThunk(categoryId, page, userLocation));
    }
  }, [categoryId, page, userLocation, dispatch, hasMore]);

  // Add any additional logic or return values as needed
};

export default useFetchService2;
