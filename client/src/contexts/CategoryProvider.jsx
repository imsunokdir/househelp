import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { getAllCategories } from "../services/category";
import { useDispatch } from "react-redux";
import { categoryActions } from "../reducers/category";
import { useNavigate } from "react-router-dom";

const CategoryContext = createContext(null);

const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  // const navigate = useNavigate();
  const [currCat, setCurrCat] = useState();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200) {
        const fetchedCategories = response.data.data;
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          sessionStorage.setItem(
            "categories",
            JSON.stringify(fetchedCategories)
          );
          setCatLoading(false);
          // Set initial value and categoryId to the first category
          setCurrCat(fetchedCategories[0]._id);
          console.log("fetched curr cat:", fetchedCategories[0]._id);
          dispatch(categoryActions.changeCategory(fetchedCategories[0]._id));

          sessionStorage.setItem(
            "selectedCategoryId",
            fetchedCategories[0]._id
          );
          // navigate(`/services/${fetchedCategories[0]._id}`);
          setCurrCat(fetchedCategories[0]._id);
        }
        //   else {
        //     functions.warning("No categories found..!!");
        //   }
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };
  useEffect(() => {
    const storedCategories = sessionStorage.getItem("categories");
    const storedCategoryId = sessionStorage.getItem("selectedCategoryId");
    const selectedTabIndex = sessionStorage.getItem("selectedTabIndex");

    if (storedCategories && storedCategoryId) {
      const parsedCategories = JSON.parse(storedCategories);
      setValue(Number(selectedTabIndex));
      setCategories(parsedCategories);
      dispatch(categoryActions.changeCategory(storedCategoryId));

      setCatLoading(false);
    } else {
      fetchCategories(); // fallback to API
    }
  }, []);
  return (
    <CategoryContext.Provider
      value={{ categories, catLoading, value, setValue, currCat }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryProvider, CategoryContext };
