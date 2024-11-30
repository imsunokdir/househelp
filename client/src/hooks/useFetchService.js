import { useState, useEffect } from "react";
import { fetchServiceByCategory } from "../services/service";
import { serviceActions } from "../reducers/service";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const useFetchService = () => {
  const dispatch = useDispatch();
  const { servicesByCategoryId, currentPage, hasMoreServicesByCategory } =
    useSelector((state) => state.service);
  const { categoryId } = useSelector((state) => state.category);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const page = currentPage[categoryId] || 1;
  const hasMore = hasMoreServicesByCategory[categoryId] || false;

  const fetchServices = async (source) => {
    console.log("okokokokokokokkookoko");
    // if (!hasMore) return;
    try {
      setLoading(true);
      setError(false);

      const response = await fetchServiceByCategory(
        categoryId,
        page,
        5,
        source.token
      );

      if (response?.status === 200 && response.data.data.length > 0) {
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
            services: response.data.data,
          })
        );

        console.log("cat:", categoryId, "hasMore:", response.data.hasMore);
      } else if (response.status === 200 && response.data.data.length === 0) {
        console.log("no srevices for this catregory");
      }

      // console.log("response:", response);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request cancelled", error);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("category changed:", categoryId);
    const source = axios.CancelToken.source();
    if (
      !servicesByCategoryId[categoryId] ||
      servicesByCategoryId[categoryId].length === 0
    ) {
      console.log("more services loaded though category change", categoryId);
      fetchServices(source);
    }

    // hasMore && fetchServices();

    return () => {
      source.cancel("request cancelled due to page or category change");
    };
  }, [categoryId]);

  // useEffect(() => {
  //   console.log("page changed:", page);
  //   const source = axios.CancelToken.source();
  //   console.log("HASMORE:", hasMore, "CATID:", categoryId);

  //   if (hasMore) {
  //     console.log(
  //       "More services loaded through page change for category:",
  //       categoryId
  //     );
  //     fetchServices(source);
  //   }
  //   return () => {
  //     source.cancel("request cancelled due to page or category change");
  //   };
  // }, [page]);

  return { loading, fetchServices };
};

export default useFetchService;
