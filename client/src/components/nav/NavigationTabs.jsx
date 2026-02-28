import React, { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fade } from "@mui/material";
import { categoryActions } from "../../reducers/category";
import { CategoryContext } from "../../contexts/CategoryProvider";

const numberOfNavTabs = new Array(10).fill(null);

const NavigationTabs = () => {
  const { categories, catLoading, value, setValue, currCat } =
    useContext(CategoryContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (categories && categories.length > 0) {
      const currentCategoryId = searchParams.get("tab");
      const tabIndex = categories.findIndex(
        (cat) => cat._id === currentCategoryId,
      );
      setValue(tabIndex !== -1 ? tabIndex : 0);
    }
  }, [searchParams, categories, setValue]);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [value]);

  const handleChange = (category, index) => {
    setValue(index);
    dispatch(categoryActions.changeCategory(category._id));
    sessionStorage.setItem("selectedCategoryId", category._id);
    sessionStorage.setItem("selectedTabIndex", index);
    if (value !== index) {
      navigate(`/services?tab=${category._id}`);
    }
  };

  return (
    <div className="w-10/12 overflow-hidden">
      <Fade in timeout={1000}>
        <div
          ref={scrollRef}
          className="flex items-center overflow-x-auto gap-1.5 py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {catLoading
            ? numberOfNavTabs.map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 h-8 rounded-full bg-gray-100 animate-pulse"
                  style={{ width: `${60 + (i % 3) * 20}px` }}
                />
              ))
            : categories.map((category, index) => {
                const isActive = value === index;
                return (
                  <button
                    key={category._id}
                    ref={isActive ? activeTabRef : null}
                    onClick={() => handleChange(category, index)}
                    onTouchStart={(e) => e.target.blur()}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border
                      ${
                        isActive
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800"
                      }`}
                  >
                    {category.name}
                  </button>
                );
              })}
        </div>
      </Fade>
    </div>
  );
};

export default NavigationTabs;
