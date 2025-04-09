import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentPageByCategory,
  getHasMoreServicesByCategory,
  getServicesByCategory,
  getServiceStatus,
} from "../reducers/service";

import ServiceCard from "../components/services/ServiceCard";
import { AuthContext } from "../contexts/AuthProvider";
import SkeletonCard2 from "../components/LoadingSkeleton/SkeletonCards2";
import { useCookies } from "react-cookie";
import NoServiceAvl from "./NoServiceAvl";
import { fetchServiceByCategoryThunk } from "../reducers/thunks/servicesThunk";

const Services = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const numOfCards = new Array(10).fill(null);
  const { userLocation, setUserLocation } = useContext(AuthContext);
  const [cookies, setCookies] = useCookies(["user_location"]);

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

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetch = debounce(() => {
    try {
      setLoadingMore(true);
      dispatch(
        fetchServiceByCategoryThunk({
          categoryId,
          page: page + 1,
          userLocation,
          filterData,
        })
      ).finally(() => setLoadingMore(false));
    } catch (error) {
      console.error(error);
      setLoadingMore(false);
    }
  }, 300);

  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            debouncedFetch();
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -10%",
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, categoryId, page, userLocation, dispatch, filterData]
  );

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

  return (
    <div className="p-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
        {services && services.length > 0 ? (
          <>
            {services.map((service, i) => {
              const isLast = services.length === i + 1;
              return (
                <div
                  ref={isLast ? lastServiceElement : null}
                  key={service._id}
                  className="rounded h-[400px]"
                >
                  <ServiceCard service={service} delay={100} index={i} />
                </div>
              );
            })}
            {loadingMore &&
              numOfCards.map((_, i) => (
                <div key={`skeleton-${i}`} className="rounded h-[400px]">
                  <SkeletonCard2 delay={50} index={i} />
                </div>
              ))}
          </>
        ) : serviceStatus === "loading" ? (
          numOfCards.map((_, i) => (
            <div key={i} className="rounded h-[400px]">
              <SkeletonCard2 delay={50} index={i} />
            </div>
          ))
        ) : (
          <NoServiceAvl />
        )}
      </div>
    </div>
  );
};

export default Services;
