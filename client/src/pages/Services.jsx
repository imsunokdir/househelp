import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleServiceCard from "../components/services/SingleServiceCard";
import SkeletonCards from "../components/LoadingSkeleton/SkeletonCards";
import { serviceActions } from "../reducers/service";
import axios from "axios";
import ServiceCard from "../components/services/ServiceCard";
import { AuthContext } from "../contexts/AuthProvider";
import SkeletonCard2 from "../components/LoadingSkeleton/SkeletonCards2";
import { fetchServicesThunk } from "../reducers/thunks/serviceThunk";
import { useCookies } from "react-cookie";
import NoServiceAvl from "./NoServiceAvl";
import ServiceCard2 from "../components/services/ServiceCard2";

const Services = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const numOfCards = new Array(10).fill(null);
  const { userLocation, setUserLocation } = useContext(AuthContext);

  //cookies
  const [cookies, setCookies] = useCookies(["user_location"]);
  // Redux state
  const { categoryId } = useSelector((store) => store.category);
  const { servicesByCategoryId, currentPage, hasMoreServicesByCategory } =
    useSelector((state) => state.service);
  const filterData = useSelector((state) => state.filter);
  const loading = useSelector((state) => state.service.serviceLoading);

  const services = servicesByCategoryId[categoryId] || [];
  const page = currentPage[categoryId] || 1;
  const hasMore = hasMoreServicesByCategory[categoryId] ?? true;
  const [isFetching, setIsFetching] = useState(false);

  const [prevPage, setPrevPage] = useState(0);

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetch = debounce(() => {
    // setIsFetching(true);
    try {
      dispatch(fetchServicesThunk(categoryId, page, userLocation, filterData));
    } catch (error) {
      ConstructionOutlined.log(error);
    } finally {
      setIsFetching(false);
    }
  }, 300);

  // Observer for infinite scrolling
  const observer = useRef();
  const lastServiceElement = useCallback(
    (node) => {
      console.log("visible");
      if (!hasMore || loading || isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setIsFetching(true);
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
    if (
      categoryId &&
      userLocation.coordinates[0] &&
      hasMore &&
      !servicesByCategoryId[categoryId]
    ) {
      dispatch(fetchServicesThunk(categoryId, page, userLocation, filterData));
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
          {services.map((service, i) => {
            if (services.length === i + 1) {
              return (
                <div
                  ref={lastServiceElement}
                  key={service._id}
                  className="rounded h-[400px] "
                >
                  <ServiceCard service={service} />
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
                  <ServiceCard service={service} />
                  {/* <ServiceCard2 service={service} /> */}
                </div>
              );
            }
          })}

          {/* Show loading skeletons if loading */}
          {loading &&
            numOfCards.map((_, i) => (
              <div key={i} className="rounded h-[400px] ">
                <SkeletonCard2 />
              </div>
            ))}
        </div>

        {/* no service available */}
        {servicesByCategoryId[categoryId] &&
          servicesByCategoryId[categoryId].length === 0 && <NoServiceAvl />}
      </div>
    </div>
  );
};

export default Services;
