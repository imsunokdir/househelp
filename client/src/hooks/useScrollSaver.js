import { useEffect } from "react";

const useScrollSaver = (categoryId) => {
  useEffect(() => {
    if (!categoryId) return;
    const handleScroll = (event) => {
      console.log(
        "cid from useScrollSave :: %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",
        categoryId
      );
      const currentScrollY = window.scrollY;
      console.log("current event from:", event.type);

      localStorage.setItem(
        `scrollPositionForServices-${categoryId}`,
        currentScrollY.toString()
      );
      sessionStorage.setItem(
        `navScrollPosition-${categoryId}`,
        currentScrollY.toString()
      );
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleScroll);
    };
  }, [categoryId]);
};

export default useScrollSaver;
