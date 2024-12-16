import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { getAllCategories } from "../services/category";
import { useDispatch } from "react-redux";
import { categoryActions } from "../reducers/category";

const CategoryContext = createContext(null);

const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200) {
        const fetchedCategories = response.data.data;
        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          setLoading(false);
          // Set initial value and categoryId to the first category
          dispatch(categoryActions.changeCategory(fetchedCategories[0]._id));
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
    fetchCategories();
  }, []);
  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryProvider, CategoryContext };
