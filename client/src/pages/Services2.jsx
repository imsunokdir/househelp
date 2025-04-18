import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBatchesLoadedByCategory,
  getCurrentPageByCategory,
  getHasMoreServicesByCategory,
  getServicesByCategory,
  getServiceStatus,
  serviceActions,
} from "../reducers/service";
import { motion } from "framer-motion";

import ServiceCard from "../components/services/ServiceCard";
import { AuthContext } from "../contexts/AuthProvider";
import SkeletonCard2 from "../components/LoadingSkeleton/SkeletonCards2";
import { useCookies } from "react-cookie";
import NoServiceAvl from "./NoServiceAvl";
import { fetchServiceByCategoryThunk } from "../reducers/thunks/servicesThunk";
import { InsertRowAboveOutlined } from "@ant-design/icons";

const Services2 = () => {
  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);
  const numOfCards = new Array(4).fill(null); // Skeleton loader count
  const { userLocation, setUserLocation } = useContext(AuthContext);
  const [cookies, setCookies] = useCookies(["user_location"]);

  const BATCH_SIZE = 10; // 4 services per batch
  const MAX_AUTO_BATCH = 2; // Only allow 2 batches before showing "Load More"

  const { categoryId } = useSelector((store) => store.category);
  const filterData = useSelector((state) => state.filter);
  const page = useSelector((state) =>
    getCurrentPageByCategory(state, categoryId)
  );
  const hasMore = useSelector((state) =>
    getHasMoreServicesByCategory(state, categoryId)
  );

  const serviceStatus = useSelector(getServiceStatus);
  const services = useSelector((state) =>
    getServicesByCategory(state, categoryId)
  );

  const batchesLoaded = useSelector((state) =>
    getBatchesLoadedByCategory(state, categoryId)
  );

  // Manual load function
  const loadMoreServices = () => {
    setLoadingMore(true);
    dispatch(
      fetchServiceByCategoryThunk({
        categoryId,
        page: page + 1,
        userLocation,
        filterData,
      })
    );
    // .finally(() => {
    //   dispatch(serviceActions.incrementBatchLoaded(categoryId));
    //   setLoadingMore(false);
    // });
  };

  // useEffect(() => {
  //   console.log("batchesLoaded:", batchesLoaded);
  // }, [batchesLoaded]);
  // Effect to fetch services when component mounts or location/category changes
  useEffect(() => {
    if (categoryId && userLocation.coordinates[0] && hasMore && !services) {
      dispatch(
        fetchServiceByCategoryThunk({
          categoryId,
          page,
          userLocation,
          filterData,
        })
      );
      // .finally(() => {
      //   dispatch(serviceActions.incrementBatchLoaded(categoryId));
      // });
    }
  }, [categoryId, userLocation]);

  useEffect(() => {
    if (cookies?.user_location?.coordinates) {
      setUserLocation((prev) => ({
        ...prev,
        coordinates: [
          cookies.user_location.coordinates[0],
          cookies.user_location.coordinates[1],
        ],
      }));
    }
  }, [cookies]);

  // Observer for infinite scroll (not needed here since we handle Load More manually)
  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      console.log("hasMore:", hasMore);
      console.log("batches loaded in observer:", batchesLoaded);
      if (!hasMore) return;
      if (batchesLoaded >= MAX_AUTO_BATCH) return;
      console.log(`_________________________________________________________`);

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore
            // &&
            // batchesLoaded < MAX_AUTO_BATCH
          ) {
            loadMoreServices(); // Trigger loading more services
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -10%",
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, batchesLoaded]
  );

  const handleLoadMore = () => {
    dispatch(serviceActions.resetBatchLoaded(categoryId));
    // no need to call loadMoreServices function here
    // because reseting the batchesLoaded by dispatching as done above
    // will load the services..in useCallback check is done to
    // where batchesLoaded<MAX_AUTO_BATCH will laod more services
  };

  const renderSkeletonCards = (delay = 50) => {
    return new Array(BATCH_SIZE).fill(null).map((_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        className="rounded h-[400px] w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: (i * delay) / 1000 }}
      >
        <SkeletonCard2 index={i} delay={delay} />
      </motion.div>
    ));
  };

  return (
    <div className="p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
        {services && services.length > 0 ? (
          <>
            {services.map((service, i) => {
              console.log(
                `services.length:${services.length} === i + 1:${i + 1}`,
                services.length === i + 1
              );
              console.log(
                `batchesLoaded:${batchesLoaded} < MAX_AUTO_BATCH:${MAX_AUTO_BATCH}`,
                batchesLoaded < MAX_AUTO_BATCH
              );
              const isLast =
                services.length === i + 1 && batchesLoaded < MAX_AUTO_BATCH;
              console.log("isLast:", isLast);
              console.log("*******************************************");
              return (
                <div
                  ref={isLast ? lastServiceElement : null}
                  key={service._id}
                  className="rounded h-[400px]"
                >
                  <ServiceCard service={service} delay={70} index={i} />
                </div>
              );
            })}
            {hasMore && batchesLoaded < MAX_AUTO_BATCH && renderSkeletonCards()}
            {/* Show "Load More" button after 2 batches */}
            {batchesLoaded >= MAX_AUTO_BATCH && hasMore && (
              <div className="col-span-full flex justify-center">
                <button className="bg-red-500 p-2" onClick={handleLoadMore}>
                  Load more
                </button>
              </div>
            )}
            {/* Skeleton Loader */}
          </>
        ) : serviceStatus === "loading" ? (
          new Array(BATCH_SIZE).fill(null).map((_, i) => (
            <div key={i} className="rounded h-[400px]">
              <SkeletonCard2 delay={0} index={i} />
            </div>
          ))
        ) : (
          // numOfCards.map((_, i) => (
          //   <div key={i} className="rounded h-[400px]">
          //     <SkeletonCard2 delay={50} index={i} />
          //   </div>
          // ))
          <div className="flex justify-center items-center w-full col-span-full h-[60vh]">
            <NoServiceAvl />
          </div>
        )}
      </div>
    </div>
  );
};

export default Services2;
