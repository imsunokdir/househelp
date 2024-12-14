import { useState, useEffect, useContext } from "react";
import { fetchServiceByCategory } from "../services/service";
import { serviceActions } from "../reducers/service";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider";

const useFetchService = () => {
  //cookies
  const [cookies, setCookies] = useCookies(["user_location"]);

  //states
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  //redux stores
  const { servicesByCategoryId, currentPage, hasMoreServicesByCategory } =
    useSelector((state) => state.service);
  const filterData = useSelector((state) => state.filter);
  const { categoryId } = useSelector((state) => state.category);

  //contexts
  const { userLocation, setUserLocation, setServiceLoading, serviceLoading } =
    useContext(AuthContext);

  const page = currentPage[categoryId] || 1;
  const hasMore = hasMoreServicesByCategory[categoryId] || false;

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

  const fetchServices = async (source) => {
    try {
      setLoading(true);
      setError(false);
      setServiceLoading(true);
      console.log(
        `************************\n*       page:${page}         *\n*                      *\n*                      *\n*                      *\n************************`
      );

      const longitude = userLocation.coordinates[0];
      const latitude = userLocation.coordinates[1];

      const response = await fetchServiceByCategory(
        categoryId,
        page,
        5,
        longitude,
        latitude,
        filterData,
        source.token
      );
      console.log("fetch services response:", response);

      if (response?.status === 200 && response.data.services.length > 0) {
        dispatch(
          serviceActions.setHasMoreForCategory({
            categoryId,
            hasMore: response.data.hasMore,
          })
        );

        dispatch(
          serviceActions.setCurrentPage({
            categoryId,
            page: page + 1,
          })
        );

        dispatch(
          serviceActions.setServicesForCategory({
            categoryId,
            services: response.data.services,
          })
        );
      } else if (
        response.status === 200 &&
        response.data.services.length === 0
      ) {
        console.log("no srevices for this catregory");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request cancelled", error);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (
      !servicesByCategoryId[categoryId] ||
      servicesByCategoryId[categoryId].length === 0
    ) {
      if (categoryId) {
        if (userLocation.coordinates[0] && userLocation.coordinates[1]) {
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
          console.log("category id:", categoryId);
          fetchServices(source);
        }
      }
    }

    return () => {
      source.cancel("request cancelled due to page or category change");
    };
  }, [categoryId]);

  useEffect(() => {
    setLoading(true);
    dispatch(serviceActions.clearServices());
    const source = axios.CancelToken.source();
    categoryId && userLocation.coordinates[0] && fetchServices(source);

    return () => {
      source.cancel("request cancelled due to page or category change");
    };
  }, [userLocation.coordinates[0]]);

  const applyFilters = async () => {};

  return { loading, fetchServices, applyFilters };
};

export default useFetchService;
