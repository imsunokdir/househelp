import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../contexts/AuthProvider";
import { fetchFilteredServices } from "../services/service";

const useFilter = () => {
  const filterOptions = useSelector((state) => state.filter);
  const { categoryId } = useSelector((state) => state.category);
  const { userLocation } = useContext(AuthContext);

  const filterData = {
    filterOptions: filterOptions,
    categoryId,
    userLocation,
  };

  // console.log("filteredData:", filterData);

  const applyFilters = async () => {
    console.log("hello from apply");
    try {
      const response = await fetchFilteredServices(filterData);
    } catch (error) {}
  };

  return { applyFilters };
};

export default useFilter;
