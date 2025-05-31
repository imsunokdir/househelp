import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
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
import ScrollServiceToTop from "../utils/ScrollServiceToTop";
import { useLocation, useNavigationType, useParams } from "react-router-dom";
import useScrollSaver from "../hooks/useScrollSaver";

const Services3 = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userLocation, setUserLocation } = useContext(AuthContext);
  const abortController = useRef(null);

  const [cookies, setCookies] = useCookies(["user_location"]);
  const { categories } = useContext(CategoryContext);

  const [loadingMore, setLoadingMore] = useState(true);
  const numOfCards = new Array(4).fill(null); // Skeleton loader count

  const [delay, setDelay] = useState(100);
  // const [isInitialLoad, setIsInitialLoad] = useState(true);
  const scrollRestoredRef = useRef(false);
  const navigationTypeRef = useRef("new");
  const navigationType = useNavigationType();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const currentCategoryId = searchParams.get("tab");

  // const { categoryId } = useSelector((store) => store.category);
  // let categoryId;
  const [categoryId, setCategoryId] = useState();

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

  const BATCH_SIZE = 10; // 10 services per batch
  const MAX_AUTO_BATCH = 2; // Only allow 2 batches before showing "Load More"

  useScrollSaver(categoryId);

  // Continuously save scroll position
  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     const currentScrollY = window.scrollY;
  //     console.log("current event from:", event.type);

  //     localStorage.setItem(
  //       `scrollPositionForServices-${categoryId}`,
  //       currentScrollY.toString()
  //     );
  //     sessionStorage.setItem(
  //       `navScrollPosition-${categoryId}`,
  //       currentScrollY.toString()
  //     );
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   window.addEventListener("beforeunload", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("beforeunload", handleScroll);
  //   };
  // }, [categoryId]);

  // Track if we're coming from the back button
  // console.log("category_id:", categoryId);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (location.pathname === "/") {
      setCategoryId(categories[0]._id);
    } else {
      setCategoryId(currentCategoryId);
    }
  }, [location, categories, categoryId]);

  useEffect(() => {
    // console.log("Cid:", typeof categoryId);
    if (!categoryId) return;
    console.log("c_id 1:", categoryId);
    console.log("nav type:", navigationType);
    if (navigationType === "POP") {
      navigationTypeRef.current = "back_forward";
    } else {
      navigationTypeRef.current = "new";
      // Scroll to top when user navigates to a new category
      window.scrollTo({ top: 0, behavior: "auto" });
      scrollRestoredRef.current = true; // Prevent scroll restore
    }
  }, [categoryId, navigationType]);

  useEffect(() => {
    if (categoryId && userLocation.coordinates[0] && hasMore && !services) {
      console.log("first service load useEffect:", navigationTypeRef.current);

      setLoadingMore(true);
      scrollRestoredRef.current = false;
      const signal = cancelPreviousRequest();
      dispatch(
        fetchServiceByCategoryThunk({
          categoryId,
          page,
          userLocation,
          filterData,
          signal,
        })
      ).finally(() => {
        setLoadingMore(false);
      });
    }
  }, [categoryId, userLocation]);

  useEffect(() => {
    if (scrollRestoredRef.current) return;
    if (
      services &&
      services.length > 0 &&
      !scrollRestoredRef.current &&
      categoryId
    ) {
      scrollRestoredRef.current = true;

      let savedScrollPosition;

      console.log("navigationTypeRef.current:", navigationTypeRef.current);

      if (navigationTypeRef.current === "back_forward") {
        savedScrollPosition = sessionStorage.getItem(
          `navScrollPosition-${categoryId}`
        );
        console.log("Restoring from back navigation:", savedScrollPosition);
      } else {
        savedScrollPosition = localStorage.getItem(
          `scrollPositionForServices-${categoryId}`
        );
        console.log("Restoring from refresh:", savedScrollPosition);
      }

      if (savedScrollPosition) {
        console.log("if savedScrollPosition");
        const targetPosition = parseInt(savedScrollPosition);

        const waitForContentAndScroll = (target, attempts = 10) => {
          if (attempts <= 0) {
            console.log("if attempt<=0");
            return;
          }

          const pageHeight = document.body.scrollHeight;

          if (pageHeight > target) {
            console.log("pageHeight>target");
            window.scrollTo({ top: target, behavior: "auto" });
            scrollRestoredRef.current = true;
          } else {
            console.log("requestAnmimateFrame");
            requestAnimationFrame(() => {
              waitForContentAndScroll(target, attempts - 1);
            });
          }
        };

        waitForContentAndScroll(targetPosition);
        console.log("_______________________________");
      }
    }
  }, [services, categoryId]);

  // useEffect(() => {
  //   if (services && categoryId) {
  //     // localStorage.setItem(`scrollPositionForServices-${categoryId}`, 0);
  //     // sessionStorage.setItem(`navScrollPosition-${categoryId}`, 0);
  //     window.scrollTo({ top: 0, behavior: "auto" });
  //   }
  // }, [categoryId, services]);

  // Memoize the cancelPreviousRequest function using useCallback
  const cancelPreviousRequest = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    return abortController.current.signal;
  }, [categoryId]);

  // Manual load function
  const loadMoreServices = () => {
    const signal = cancelPreviousRequest();
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
    setLoadingMore(false);
  };

  // Observer for infinite scroll
  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      if (!hasMore) return;
      if (batchesLoaded >= MAX_AUTO_BATCH) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreServices();
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -10%",
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, batchesLoaded, cancelPreviousRequest, categoryId]
  );

  const handleLoadMore = () => {
    dispatch(serviceActions.resetBatchLoaded(categoryId));
  };

  const renderSkeletonCards = () => {
    const skDelay = 10;
    return new Array(BATCH_SIZE).fill(null).map((_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        className="h-[300px] w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{
        //   duration: 0.2,
        //   delay: (i * skDelay) / 1000,
        // }}
      >
        <SkeletonCard2 index={i} delay={delay} />
      </motion.div>
    ));
  };

  return (
    <div className="p-4">
      {/* <ScrollServiceToTop trigger={categoryId} /> */}
      {/* <ScrollToTop /> */}
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
                  className="h-[300px]"
                >
                  <ServiceCard
                    service={service}
                    delay={delay}
                    index={i}
                    categoryId={categoryId}
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
          </>
        ) : serviceStatus === "loading" ? (
          new Array(BATCH_SIZE).fill(null).map((_, i) => (
            <div key={i} className="rounded h-[300px]">
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

export default Services3;
