import { useEffect } from "react";
import { clearTempUploadedImages } from "../utils/clearTempUploadedImages";

export const useBeforeUnload = (shouldPrompt) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!shouldPrompt) return;
      e.preventDefault();
      e.returnValue = ""; // Modern browsers ignore custom text
    };

    const handleUnload = () => {
      clearTempUploadedImages();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [shouldPrompt]);
};
