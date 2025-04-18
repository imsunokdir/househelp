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
import ScrollToTop from "../utils/ScrollToTop";
import axios from "axios";
import { CategoryContext } from "../contexts/CategoryProvider";

const Services2 = () => {
  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);
  const numOfCards = new Array(4).fill(null); // Skeleton loader count
  const { userLocation, setUserLocation } = useContext(AuthContext);
  const [cookies, setCookies] = useCookies(["user_location"]);

  const { categories } = useContext(CategoryContext);

  const [delay, setDelay] = useState(100);
  const abortController = useRef(null);

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

  // Memoize the cancelPreviousRequest function using useCallback
  const cancelPreviousRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      console.log("Previous request canceled due to category change.");
      console.log("✅ Canceling request for previous category:", categoryId);
    }
    abortController.current = new AbortController();
    return abortController.current.signal;
  }, [categoryId]);
  // Empty dependency array ensures this function is stable and doesn't change on re-renders

  // Manual load function
  const loadMoreServices = () => {
    const signal = cancelPreviousRequest();
    // cancelPreviousRequest();
    setLoadingMore(true);
    dispatch(
      fetchServiceByCategoryThunk({
        categoryId,
        page: page + 1,
        userLocation,
        filterData,
        signal,
      })
    );
  };

  useEffect(() => {
    if (categoryId && userLocation.coordinates[0] && hasMore && !services) {
      const signal = cancelPreviousRequest();
      dispatch(
        fetchServiceByCategoryThunk({
          categoryId,
          page,
          userLocation,
          filterData,
          signal,
        })
      );
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

  // useEffect(() => {
  //   const matchedCategory = categories.find((cat) => cat._id === categoryId);
  //   console.log(`batchesLoaded for ${matchedCategory?.name}:`, batchesLoaded);
  // }, [batchesLoaded, categoryId]);

  // Observer for infinite scroll (not needed here since we handle Load More manually)
  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      if (!hasMore) return;
      if (batchesLoaded >= MAX_AUTO_BATCH) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
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
    [hasMore, batchesLoaded, cancelPreviousRequest, categoryId] // Make sure cancelPreviousRequest is included in dependencies
  );

  const handleLoadMore = () => {
    dispatch(serviceActions.resetBatchLoaded(categoryId));
  };

  const renderSkeletonCards = () => {
    const skDelay = 50;
    return new Array(BATCH_SIZE).fill(null).map((_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        className="h-[400px] w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2, // Reduced duration to make the animation faster
          delay: (i * skDelay) / 1000,
        }}
      >
        <SkeletonCard2 index={i} delay={delay} />
      </motion.div>
    ));
  };

  useEffect(() => {
    const matchedC = categories.find((cat) => cat._id === categoryId);
    console.log("curr cat:", matchedC?.name);
  }, [categoryId, categories]);

  // useEffect(() => {
  //   const matchedCategory = categories.find((cat) => cat._id === categoryId);
  //   console.log(`batchesLoaded for ${matchedCategory?.name}:`);
  // }, [categoryId]);

  // useEffect(() => {
  //   console.log("serviceStatus:", serviceStatus);
  //   console.log("hasMore:", hasMore);
  // }, [serviceStatus, hasMore]);

  return (
    <div className="p-4">
      <ScrollToTop />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
        {services && services.length > 0 ? (
          <>
            {services.map((service, i) => {
              const isLast =
                services.length === i + 1 && batchesLoaded < MAX_AUTO_BATCH;
              return (
                <div
                  ref={isLast ? lastServiceElement : null}
                  key={service._id}
                  className=" h-[400px]"
                >
                  <ServiceCard
                    service={service}
                    delay={delay}
                    index={i}
                    renderSkeletonCards={renderSkeletonCards}
                  />
                </div>
              );
            })}
            {hasMore && batchesLoaded < MAX_AUTO_BATCH && renderSkeletonCards()}
            {/* Show "Load More" button after 2 batches */}
            {batchesLoaded >= MAX_AUTO_BATCH && hasMore && (
              <div className="col-span-full flex justify-center">
                <button
                  className="bg-blue-500 text-white py-2 px-5 text-lg rounded-full hover:bg-blue-600 transition-colors duration-200"
                  onClick={handleLoadMore}
                >
                  Load more
                </button>
              </div>
            )}
            {/* Skeleton Loader */}
          </>
        ) : serviceStatus === "loading" ? (
          new Array(BATCH_SIZE).fill(null).map((_, i) => (
            <div key={i} className="rounded h-[400px]">
              <SkeletonCard2 delay={delay} index={i} />
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center w-full col-span-full h-[60vh]">
            <NoServiceAvl />
          </div>
        )}
      </div>
    </div>
  );
};

export default Services2;
