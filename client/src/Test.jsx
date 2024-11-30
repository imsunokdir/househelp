import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetch } from "../services/service";
// import SingleServiceCard from "../components/services/SingleServiceCard";
import SingleServiceCard from "./components/services/SingleServiceCard";
// import SkeletonCards from "../components/LoadingSkeleton/SkeletonCards";
import SkeletonCards from "./components/LoadingSkeleton/SkeletonCards";
// import { serviceActions } from "../reducers/service";
import { serviceActions } from "./reducers/service";
import { fetchServiceByCategory } from "./services/service";

const Test = () => {
  // const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // New state for error handling
  const numOfCards = new Array(5).fill(null);

  const { categoryId } = useSelector((store) => store.category);

  useSelector((state) => console.log("store:", state.category));

  //redux

  const { servicesByCategoryId, currentPage, hasMoreServicesByCategory } =
    useSelector((state) => state.service);

  const services = servicesByCategoryId[categoryId] || [];
  const page = currentPage[categoryId] || 1;
  const hasMore = hasMoreServicesByCategory[categoryId] || [];

  const fetchMoreServices = async () => {
    console.log("categoryId:", categoryId);
    if (!hasMore || loading) return;
    setLoading(true);
    setError(false);
    try {
      const response = await fetchServiceByCategory(categoryId, page, 5);
      console.log("response main:", response);
      if (response.status === 200 && response.data.data.length > 0) {
        const newServices = response.data.data;
        const newHasMore = response.data.hasMore;

        dispatch(
          serviceActions.setServicesForCategory({
            categoryId,
            services: newServices,
          })
        );

        dispatch(
          serviceActions.setCurrentPage({
            categoryId,
            page: currentPage,
          })
        );

        dispatch(
          serviceActions.setHasMoreForCategory({
            categoryId,
            hasMore: newHasMore,
          })
        );

        // setServices(response.data.data);
      }
      // else if (response.status === 200 && response.data.data.length === 0) {
      //   setServices([]);
      // }
    } catch (error) {
      setError(true);
      // setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("categoryId main:", categoryId);
    categoryId && fetchMoreServices();
  }, [categoryId]);

  useEffect(() => {
    console.log("services of main:", services);
  }, [services]);

  return (
    <div className="services p-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 mx-auto">
        {loading ? (
          // Show loading skeletons
          numOfCards.map((_, i) => <SkeletonCards key={i} />)
        ) : error ? (
          // Show error message if fetch failed
          <h3>Error loading services. Please try again later.</h3>
        ) : services.length > 0 ? (
          // Render services if available
          services.map((service) => (
            <SingleServiceCard key={service._id} service={service} />
          ))
        ) : (
          // No services found
          <h3>No services found</h3>
        )}
      </div>
    </div>
  );
};

export default Test;
