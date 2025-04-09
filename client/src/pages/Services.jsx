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
// import ServiceCard2 from "../components/services/ServiceCard2";
import { fetchServiceByCategoryThunk } from "../reducers/thunks/servicesThunk";

const Services = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const numOfCards = new Array(10).fill(null);
  const { userLocation, setUserLocation } = useContext(AuthContext);

  //cookies
  const [cookies, setCookies] = useCookies(["user_location"]);
  // Redux state
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
      dispatch(
        fetchServiceByCategoryThunk({
          categoryId,
          page: page + 1,
          userLocation,
          filterData,
        })
      );
    } catch (error) {
      ConstructionOutlined.log(error);
    }
  }, 300);

  // Observer for infinite scrolling
  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            // setIsFetching(true);
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
    <div>
      <div className="p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
          {services &&
            services.map((service, i) => {
              if (services.length === i + 1) {
                return (
                  <div
                    ref={lastServiceElement}
                    key={service._id}
                    className="rounded h-[400px] "
                  >
                    <ServiceCard service={service} delay={100} index={i} />
                    {/* <ServiceCard2 service={service} /> */}
                  </div>
                );
              } else {
                return (
                  <div
                    key={service._id}
                    className="rounded h-[400px] "
                    // style={{ borderRadius: "10%" }}
                  >
                    <ServiceCard service={service} delay={100} index={i} />
                    {/* <ServiceCard2 service={service} /> */}
                  </div>
                );
              }
            })}

          {/* Show loading skeletons if loading */}
          {serviceStatus === "loading" &&
            numOfCards.map((_, i) => (
              <div key={i} className="rounded h-[400px] ">
                <SkeletonCard2 delay={50} index={i} />
              </div>
            ))}
        </div>

        {/* no service available */}
        {services && services.length === 0 && <NoServiceAvl />}
      </div>
    </div>
  );
};

export default Services;
