import React, { useEffect, useState, useRef, useContext } from "react";
import validateServiceData from "../../utils/validateForm";
import Message from "../Messages/WarningMessage";
import {
  deleteService,
  deleteServiceImage,
  fetchServiceById,
  updateService2,
} from "../../services/service";
import { useNavigate, useParams } from "react-router-dom";
import { Fade } from "@mui/material";
import { Modal } from "antd";
import SetLocationField from "./SetLocationField";
import SetServiceDescriptionField from "./SetServiceDescriptionField";
import ServiceFormValiddationError from "./ServiceFormValiddationError";
import ServiceSkillsField from "./ServiceSkillsField";
import ServiceAvailability from "./ServiceAvailability";
import ServicePriceField from "./ServicePriceField";
import ServiceCategoryField from "./ServiceCategoryField";
import SetServiceName from "./SetServiceName";
import ServiceExperience from "./ServiceExperience";
import useCreateService from "../../hooks/useCreateService";
import ServiceUpdateButton from "./ServiceUpdateButton";
import SkeletonLoad from "../LoadingSkeleton/SkeletonLoad";
import UploadImagesByLen from "./UploadImagesByLen";
import CurrentServiceImages from "./CurrentServiceImages";
import SetServiceStatus from "./SetServiceStatus";
import ScrollToTop from "../../utils/ScrollToTop";
import ROUTES from "../../constants/routes";
import NavigationContext from "../../contexts/NavigationContext";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import useWarnOnUnsavedChanges from "../../hooks/useWarnOnUnsavedChangesBlocker";

const AddServiceForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const hasUnloaded = useRef(false);

  const [isServiceLoading, SetServiceLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState();
  const [fileList, setFileList] = useState([]);
  const [currImages, setCurrImages] = useState([]);
  const [imagesToBeDeleted, setImagesToBeDeleted] = useState([]);
  const [avlSlots, setAvlSlots] = useState(8);
  const [initialFormData, setInitialFormData] = useState(null);

  const { isFormDirty, setIsFormDirty, setPendingNavigation } =
    useContext(NavigationContext);
  const isIntentionallyNavigating = useRef(false);

  const {
    categories,
    loading,
    setLoading,
    isCreating,
    setIsCreating,
    errors,
    setErrors,
    isLocationLoading,
    functions,
    daysOfWeek,
    getNextDay,
    handleInputChange,
    handlePriceRangeChange,
    addSkill,
    removeSkill,
    updateSkill,
    addAvailability,
    removeAvailability,
    updateAvailability,
    handleCategory,
    handleLocationFetch,
    timeOptions,
    useTempImageCleanup,
  } = useCreateService(formData, setFormData);

  useEffect(() => {
    SetServiceLoading(true);
    const fetchService = async () => {
      try {
        const response = await fetchServiceById(serviceId);
        if (response.status === 200) {
          const serviceData = response.data.data;
          setFormData(serviceData);
          setCurrImages(serviceData.images);
          setInitialFormData(JSON.stringify(serviceData));
        }
      } catch (error) {
        console.log("error:", error);
        functions.error("There was an error.!!");
      } finally {
        SetServiceLoading(false);
      }
    };
    fetchService();
    setIsFormDirty(false);
    return () => {
      setIsFormDirty(false);
    };
  }, []);

  useEffect(() => {
    if (formData && initialFormData) {
      const currentFormDataStr = JSON.stringify(formData);
      const hasChanges =
        currentFormDataStr !== initialFormData ||
        fileList.length > 0 ||
        imagesToBeDeleted.length > 0;
      setIsFormDirty(hasChanges);
    }
  }, [formData, fileList, imagesToBeDeleted, initialFormData]);

  useEffect(() => {
    const currLen = currImages.length;
    const fileLen = fileList.length;
    const imagesDelLen = imagesToBeDeleted.length;
    setAvlSlots(currLen + fileLen - imagesDelLen);
  }, [fileList, imagesToBeDeleted, currImages]);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     if (isFormDirty) {
  //       event.preventDefault();
  //       event.returnValue =
  //         "You have unsaved changes. Are you sure you want to leave?";
  //       return event.returnValue;
  //     }
  //   };

  //   const handlePopState = (event) => {
  //     if (isFormDirty) {
  //       event.preventDefault();
  //       Modal.confirm({
  //         title: "Unsaved Changes",
  //         content:
  //           "You have unsaved changes. Are you sure you want to leave without saving?",
  //         onOk: () => {
  //           window.history.go(-1);
  //         },
  //       });
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [isFormDirty]);

  // useEffect(() => {
  //   // Push a dummy state when component mounts
  //   if (!hasUnloaded.current) {
  //     window.history.pushState(
  //       { preventNavigation: true },
  //       "",
  //       window.location.pathname
  //     );
  //   }

  //   const handlePopState = (event) => {
  //     if (isFormDirty) {
  //       // Push state again to prevent immediate navigation
  //       window.history.pushState(
  //         { preventNavigation: true },
  //         "",
  //         window.location.pathname
  //       );

  //       // Now show confirmation modal
  //       Modal.confirm({
  //         title: "Unsaved Changes",
  //         content:
  //           "You have unsaved changes. Are you sure you want to leave without saving?",
  //         onOk: () => {
  //           hasUnloaded.current = true;
  //           window.history.back();
  //         },
  //       });
  //     }
  //   };

  //   const handleBeforeUnload = (event) => {
  //     if (isFormDirty) {
  //       event.preventDefault();
  //       event.returnValue =
  //         "You have unsaved changes. Are you sure you want to leave?";
  //       return event.returnValue;
  //     }
  //   };

  //   window.addEventListener("popstate", handlePopState);
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [isFormDirty]);

  // In your AddServiceForm component

  // Remove all the complex history manipulation code

  // In your AddServiceForm component

  useBeforeUnload(isFormDirty);
  // useWarnOnUnsavedChanges({
  //   isDirty: isFormDirty,
  //   onConfirmLeave: () => {
  //     setIsFormDirty(false);
  //     navigate(-1);
  //   },
  // });

  // useEffect(() => {
  //   // Only set up when the form is dirty
  //   if (!isFormDirty) return;

  //   // Handle beforeunload for browser close/refresh
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue =
  //       "You have unsaved changes. Are you sure you want to leave?";
  //     return event.returnValue;
  //   };

  //   // Push a state entry to the history stack
  //   // window.history.pushState(null, "", window.location.pathname);

  //   // Handler for back/forward button clicks
  //   const handlePopState = (event) => {
  //     // Prevent the navigation
  //     window.history.pushState(null, "", window.location.pathname);

  //     // Show confirmation dialog
  //     Modal.confirm({
  //       title: "Unsaved Changes",
  //       content:
  //         "You have unsaved changes. Are you sure you want to leave without saving?",
  //       onOk: () => {
  //         // Clear dirty flag and navigate away
  //         setIsFormDirty(false);
  //         // Use setTimeout to ensure React state updates before navigation
  //         setTimeout(() => {
  //           navigate(-1);
  //         }, 0);
  //       },
  //     });
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [isFormDirty, navigate, setIsFormDirty]);

  // Add a simple React Router location listener to watch for navigation

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors(null);
    setIsUpdating(true);

    if (avlSlots > 8) {
      const message = `Please remove ${avlSlots - 8} ${
        avlSlots - 8 === 1 ? "image" : "images"
      }`;
      setErrors((prev) => [message]);
      setIsUpdating(false);
      return;
    }

    const isError = validateServiceData(formData);
    try {
      if (!isError.isValid) {
        setErrors((prev) => [...(prev || []), ...isError.errors]);
        return;
      }

      const updatedData = {
        formData,
        imagesToBeDeleted,
        serviceId,
      };

      const response = await updateService2(updatedData);
      if (response.status === 200) {
        setIsFormDirty(false);
        navigate(`/show-service-details/${serviceId}`);
      }
    } catch (error) {
      console.log("error:", error);
      functions.error("There was an error updating your data");
    } finally {
      setIsUpdating(false);
    }
  };

  useTempImageCleanup(fileList);
  useWarnOnUnsavedChanges({ isFormDirty, setIsFormDirty });

  // useEffect(() => {
  //   if (!isFormDirty) return;

  //   const handlePopState = (event) => {
  //     Modal.confirm({
  //       title: "Unsaved Changes",
  //       content:
  //         "You have unsaved changes. Are you sure you want to leave without saving?",
  //       onOk: () => {
  //         setIsFormDirty(false);
  //         // Allow back navigation
  //         navigate(-1);
  //       },
  //       onCancel: () => {
  //         // Push state back to stop the back nav (reverting browser nav)
  //         window.history.pushState(null, "", window.location.pathname);
  //       },
  //     });
  //   };

  //   // Listen to back button navigation
  //   window.addEventListener("popstate", handlePopState);

  //   // Push a dummy state to prevent immediate back nav
  //   window.history.pushState(null, "", window.location.pathname);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [isFormDirty, navigate]);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 p-4">
        <Message onMessage={functions.error} />
        <div
          className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md relative ${
            isUpdating ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Update Service</h2>
            {isServiceLoading ? (
              <SkeletonLoad />
            ) : (
              <Fade in timeout={1000}>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <SetServiceName
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                  <ServiceCategoryField
                    categories={categories}
                    handleCategory={handleCategory}
                    loading={loading}
                    formData={formData}
                  />
                  <ServiceExperience
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                  <ServicePriceField
                    formData={formData}
                    handlePriceRangeChange={handlePriceRangeChange}
                  />
                  <ServiceAvailability
                    formData={formData}
                    updateAvailability={updateAvailability}
                    daysOfWeek={daysOfWeek}
                    timeOptions={timeOptions}
                    removeAvailability={removeAvailability}
                    addAvailability={addAvailability}
                  />
                  <ServiceSkillsField
                    formData={formData}
                    updateSkill={updateSkill}
                    removeSkill={removeSkill}
                    addSkill={addSkill}
                  />
                  <SetLocationField
                    formData={formData}
                    setFormData={setFormData}
                    handleLocationFetch={handleLocationFetch}
                    isLocationLoading={isLocationLoading}
                  />
                  <CurrentServiceImages
                    formData={formData}
                    currImages={currImages}
                    setCurrImages={setCurrImages}
                    imagesToBeDeleted={imagesToBeDeleted}
                    setImagesToBeDeleted={setImagesToBeDeleted}
                  />
                  <UploadImagesByLen
                    fileList={fileList}
                    setFileList={setFileList}
                    formData={formData}
                    setFormData={setFormData}
                    avlSlots={avlSlots}
                  />
                  <SetServiceStatus
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                  <SetServiceDescriptionField
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                  <ServiceFormValiddationError errors={errors} />
                  <ServiceUpdateButton isUpdating={isUpdating} />
                </form>
              </Fade>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServiceForm;
