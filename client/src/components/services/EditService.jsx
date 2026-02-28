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
import NavigationContext from "../../contexts/NavigationContext";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import useWarnOnUnsavedChanges from "../../hooks/useWarnOnUnsavedChangesBlocker";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";

const EditService = () => {
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
      const hasChanges =
        JSON.stringify(formData) !== initialFormData ||
        fileList.length > 0 ||
        imagesToBeDeleted.length > 0;
      setIsFormDirty(hasChanges);
    }
  }, [formData, fileList, imagesToBeDeleted, initialFormData]);

  useEffect(() => {
    setAvlSlots(currImages.length + fileList.length - imagesToBeDeleted.length);
  }, [fileList, imagesToBeDeleted, currImages]);

  useBeforeUnload(isFormDirty);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors(null);
    setIsUpdating(true);

    if (avlSlots > 8) {
      setErrors([
        `Please remove ${avlSlots - 8} ${avlSlots - 8 === 1 ? "image" : "images"}`,
      ]);
      setIsUpdating(false);
      return;
    }

    const isError = validateServiceData(formData);
    try {
      if (!isError.isValid) {
        setErrors([...([] || []), ...isError.errors]);
        return;
      }
      const response = await updateService2({
        formData,
        imagesToBeDeleted,
        serviceId,
      });
      if (response.status === 200) {
        setIsFormDirty(false);
        navigate(`/show-service-details/${serviceId}`, { replace: true });
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

  const sections = [
    {
      label: "Basic Info",
      fields: ["name", "category", "experience", "price"],
    },
    { label: "Schedule & Skills", fields: ["availability", "skills"] },
    { label: "Location & Media", fields: ["location", "images", "status"] },
    { label: "Description", fields: ["description"] },
  ];

  return (
    <>
      <ScrollToTop />
      <Message onMessage={functions.error} />

      <div className="min-h-screen bg-gray-50/50">
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 sticky top-[55px] z-10">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft size={18} className="text-gray-500" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900 leading-tight">
                  Edit Service
                </h1>
                {isFormDirty && (
                  <p className="text-xs text-orange-500">Unsaved changes</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              form="edit-service-form"
              disabled={isUpdating}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* ── Form ────────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {isServiceLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <SkeletonLoad />
            </div>
          ) : (
            <Fade in timeout={500}>
              <form
                id="edit-service-form"
                onSubmit={handleUpdate}
                className={`space-y-4 ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
              >
                {/* Basic Info */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
                >
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Basic Info
                  </h2>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <ServiceExperience
                      formData={formData}
                      handleInputChange={handleInputChange}
                    />
                    <ServicePriceField
                      formData={formData}
                      handlePriceRangeChange={handlePriceRangeChange}
                    />
                  </div>
                </motion.div>

                {/* Schedule & Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
                >
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Schedule & Skills
                  </h2>
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
                </motion.div>

                {/* Location & Media */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
                >
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Location & Media
                  </h2>
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
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
                >
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Description
                  </h2>
                  <SetServiceDescriptionField
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </motion.div>

                {/* Validation errors */}
                {errors && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ServiceFormValiddationError errors={errors} />
                  </motion.div>
                )}

                {/* Mobile save button */}
                <div className="pb-6 sm:hidden">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </Fade>
          )}
        </div>
      </div>
    </>
  );
};

export default EditService;
