import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollServiceToTop = ({ trigger }) => {
  const isFirstRender = useRef(true);
  const location = useLocation(); // only needed if you use this normally to scroll on path change

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.documentElement.style.scrollBehavior = "auto";

    window.scrollTo(0, 0);
  }, [trigger]);

  return null;
};

export default ScrollServiceToTop;
