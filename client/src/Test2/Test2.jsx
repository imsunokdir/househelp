import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchServiceByCategory } from "../services/service";
import { fetchServiceByCategory } from "../services/service";
// import SingleServiceCard from "../components/services/SingleServiceCard";
import SingleServiceCard from "../components/services/SingleServiceCard";
// import SkeletonCards from "../components/LoadingSkeleton/SkeletonCards";
import SkeletonCards from "../components/LoadingSkeleton/SkeletonCards";
// import { serviceActions } from "../reducers/service";
import { serviceActions } from "../reducers/service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider } from "antd";
import NavigationTabs from "../components/nav/NavigationTabs";
import useFetchService from "../hooks/useFetchService";
// import "../../src/App.css"
// import "./pages.css";

const Test2 = () => {
  // const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // New state for error handling
  const numOfCards = new Array(10).fill(null);

  const { loading } = useFetchService();
  //redux
  const { categoryId } = useSelector((store) => store.category);

  const { servicesByCategoryId, currentPage, hasMoreServicesByCategory } =
    useSelector((state) => state.service);

  const services = servicesByCategoryId[categoryId] || [];
  const page = currentPage[categoryId] || 1;
  const hasMore = hasMoreServicesByCategory[categoryId] ?? true;

  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Visible");
          dispatch(
            serviceActions.setCurrentPage({
              categoryId,
              page: page + 1,
            })
          );
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // const services = servicesByCategoryId[categoryId] || [];
  // const page = currentPage[categoryId] || 1;
  // const hasMore = hasMoreServicesByCategory[categoryId] ?? true;

  // useEffect(() => {
  //   console.log("page:", page);
  //   console.log("hasMore:", hasMore);
  // }, [page, hasMore, services]);

  // const fetchMoreServices = async () => {
  //   if (!hasMore || loading) return;
  //   setLoading(true);
  //   // setError(false);
  //   try {
  //     const response = await fetchServiceByCategory(categoryId, page, 5);
  //     console.log("response main:", response);
  //     if (response.status === 200 && response.data.data.length > 0) {
  //       const newServices = response.data.data;
  //       const newHasMore = response.data.hasMore;

  //       dispatch(
  //         serviceActions.setServicesForCategory({
  //           categoryId,
  //           services: newServices,
  //         })
  //       );

  //       dispatch(
  //         serviceActions.setCurrentPage({
  //           categoryId,
  //           page: page + 1,
  //         })
  //       );

  //       dispatch(
  //         serviceActions.setHasMoreForCategory({
  //           categoryId,
  //           hasMore: newHasMore,
  //         })
  //       );

  //       // setServices(response.data.data);
  //     }
  //     // else if (response.status === 200 && response.data.data.length === 0) {
  //     //   setServices([]);
  //     // }
  //   } catch (error) {
  //     setError(true);
  //     // setServices([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   console.log("categoryId main:", categoryId);
  //   // categoryId && fetchMoreServices();
  //   if (
  //     !servicesByCategoryId[categoryId] ||
  //     servicesByCategoryId[categoryId].length === 0
  //   ) {
  //     dispatch(
  //       serviceActions.setCurrentPage({ categoryId: categoryId, page: 1 })
  //     );
  //     categoryId && fetchMoreServices();
  //   }
  // }, [categoryId]);

  // useEffect(() => {
  //   console.log("services of main:", services);
  // }, [services]);

  // const handleScroll = () => {
  //   console.log(
  //     "height%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:",
  //     document.documentElement.scrollHeight
  //   );
  // };

  return (
    <div>
      <NavigationTabs />
      <div className="services p-4">
        {/* <h2>page: {page}</h2> */}
        <div className="">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 mx-auto">
            {services.map((service, i) => {
              if (services.length === i + 1) {
                return (
                  <div ref={lastServiceElement} key={service._id}>
                    <SingleServiceCard service={service} />
                  </div>
                );
              } else {
                return (
                  <div key={service._id}>
                    <SingleServiceCard service={service} />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test2;
