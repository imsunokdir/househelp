import { useEffect } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { clearTempUploadedImages } from "../utils/clearTempUploadedImages";

const useWarnOnUnsavedChanges = ({ isFormDirty, setIsFormDirty }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isFormDirty) return;

    const handlePopState = (event) => {
      Modal.confirm({
        title: "Unsaved Changes",
        content:
          "You have unsaved changes. Are you sure you want to leave without saving?",
        onOk: () => {
          setIsFormDirty(false);
          // Allow back navigation
          clearTempUploadedImages();
          navigate(-1);
        },
        onCancel: () => {
          // Push state back to stop the back nav (reverting browser nav)
          window.history.pushState(null, "", window.location.pathname);
        },
      });
    };

    // Listen to back button navigation
    window.addEventListener("popstate", handlePopState);

    // Push a dummy state to prevent immediate back nav
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFormDirty, navigate]);
};

export default useWarnOnUnsavedChanges;
