// ScrollToTop.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { categoryId } = useSelector((store) => store.category);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";

    window.scrollTo(0, 0); // Scroll to top whenever route changes
  }, [pathname, categoryId]);

  return null;
};

export default ScrollToTop;
