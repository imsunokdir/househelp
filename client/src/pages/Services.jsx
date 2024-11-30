import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleServiceCard from "../components/services/SingleServiceCard";
import SkeletonCards from "../components/LoadingSkeleton/SkeletonCards";
import { serviceActions } from "../reducers/service";
import useFetchService from "../hooks/useFetchService";
import axios from "axios";

const Services = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false); // New state for error handling
  const numOfCards = new Array(10).fill(null);

  const { loading, fetchServices } = useFetchService();
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
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            console.log("Visible");
            const source = axios.CancelToken.source();
            fetchServices(source);
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -10%",
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <div className="p-4">
        <div className="">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 mx-auto">
            {services.map((service, i) => {
              if (services.length === i + 1) {
                return (
                  <div ref={lastServiceElement} key={service._id} className="">
                    <SingleServiceCard service={service} />
                  </div>
                );
              } else {
                return (
                  <div key={service._id} className="rounded">
                    <SingleServiceCard service={service} />
                  </div>
                );
              }
            })}
            {loading && numOfCards.map((_, i) => <SkeletonCards key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
