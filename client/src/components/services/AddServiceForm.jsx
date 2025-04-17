import React, { useContext, useEffect, useState } from "react";
import { X, Plus, LogInIcon } from "lucide-react";
import { getAllCategories } from "../../services/category";
import { Select, Form, Tooltip } from "antd";
import validateServiceData from "../../utils/validateForm";
import Message from "../Messages/WarningMessage";
import { createService } from "../../services/service";
import { useNavigate } from "react-router-dom";
import { UIContext } from "../../contexts/UIProvider";
import { Button, CircularProgress, Fade } from "@mui/material";
import { Button as ABtn } from "antd";
import { ContactsFilled } from "@ant-design/icons";
import SetLocationField from "./SetLocationField";
import SetServiceDescriptionField from "./SetServiceDescriptionField";
import ServiceSubmitButton from "./ServiceSubmitButton";
import ServiceFormValiddationError from "./ServiceFormValiddationError";
import ServiceSkillsField from "./ServiceSkillsField";
import ServiceAvailability from "./ServiceAvailability";
import ServicePriceField from "./ServicePriceField";
import ServiceCategoryField from "./ServiceCategoryField";
import SetServiceName from "./SetServiceName";
import ServiceExperience from "./ServiceExperience";
import useCreateService from "../../hooks/useCreateService";
import UploadServiceImages from "./UploadServiceImages";
import SetServiceStatus from "./SetServiceStatus";
import NavigationContext from "../../contexts/NavigationContext";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import useWarnOnUnsavedChanges from "../../hooks/useWarnOnUnsavedChangesBlocker";

// const initialFormData = {
//   serviceName: "test test test",
//   experience: "5",
//   category: "675288d8a078165157762178",
//   priceRange: {
//     minimum: 1500,
//     maximum: 3500,
//   },
//   availability: [
//     { day: "monday", startTime: "03:00", endTime: "06:00", enabled: true },
//   ],
//   skills: ["all"],
//   description: "asd asd asd a sdasd",
//   location: {
//     type: "Point",
//     coordinates: [94.644295, 26.672238],
//   },
//   status: "Active",
//   images: [],
// };

const initialFormData = {
  serviceName: "",
  experience: "",
  category: "",
  priceRange: {
    minimum: "",
    maximum: "",
  },
  availability: [{ day: "monday", startTime: "", endTime: "", enabled: true }],
  skills: [""],
  description: "",
  location: {
    type: "Point",
    coordinates: [null, null],
  },
  status: "Active",
  images: [],
};
const AddServiceForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    console.log("formdata:", formData);
  }, [formData]);

  const {
    // formData,
    // setFormData,
    categories,
    setCategories,
    loading,
    setLoading,
    isCreating,
    setIsCreating,
    errors,
    setErrors,
    navigate,
    isLocationLoading,
    setIsLocationLoading,
    fileList,
    setFileList,
    functions,
    setFunctions,
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
    // handleSubmit,
    handleCategory,
    handleLocationFetch,
    timeOptions,
    handleSubmit2,
    isServiceSuccess,
    useTempImageCleanup,
  } = useCreateService(formData, setFormData);

  const { isFormDirty, setIsFormDirty, setPendingNavigation } =
    useContext(NavigationContext);

  // useEffect(() => {
  //   const savedFormData = sessionStorage.getItem("formData");
  //   const savedFileList = sessionStorage.getItem("fileList");

  //   if (savedFormData) {
  //     setFormData(JSON.parse(savedFormData));
  //   }
  //   if (savedFileList) {
  //     setFileList(JSON.parse(savedFileList));
  //   }
  // }, []);
  // useEffect(() => {
  //   if (formData && formData !== initialFormData) {
  //     sessionStorage.setItem("formData", JSON.stringify(formData));
  //   }
  // }, [formData]);
  // useEffect(() => {
  //   if (
  //     fileList &&
  //     fileList.length > 0 &&
  //     fileList.some((file) => file.response)
  //   ) {
  //     console.log("before before Saved to sessionStorage:", fileList);

  //     const serializableList = fileList.map((file) => {
  //       console.log("thumbUrl inside map:", file.thumbUrl);
  //       return {
  //         uid: file.uid,
  //         name: file.name,
  //         status: file.status,
  //         url: file.response?.secure_url || file.url || "",
  //         thumbUrl: file.thumbUrl || "", // <- You can even hardcode for testing here
  //         response: file.response || null,
  //         percent: file.percent || 0,
  //       };
  //     });
  //     // console.log("before Saved to sessionStorage:", serializableList);
  //     console.log("Saved to sessionStorage:", serializableList);
  //     sessionStorage.setItem("fileList", JSON.stringify(serializableList));
  //     // console.log("Saved to sessionStorage:", serializableList);
  //   }
  // }, [fileList]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (
  //       fileList &&
  //       fileList.length > 0 &&
  //       fileList.some((file) => file.response)
  //     ) {
  //       const serializableList = fileList.map((file) => {
  //         return {
  //           uid: file.uid,
  //           name: file.name,
  //           status: file.status,
  //           url: file.response?.secure_url || file.url || "",
  //           thumbUrl: file.thumbUrl || "no-thumb", // force fallback
  //           response: file.response || null,
  //           percent: file.percent || 0,
  //         };
  //       });

  //       sessionStorage.setItem("fileList", JSON.stringify(serializableList));
  //     }
  //   }, 100); // ← small delay

  //   return () => clearTimeout(timer);
  // }, [fileList]);

  useEffect(() => {
    if (formData && initialFormData) {
      const currentFormDataStr = JSON.stringify(formData);
      const initialFormDataStr = JSON.stringify(initialFormData);

      // Compare the current form data with the initial form data
      const hasChanges =
        currentFormDataStr !== initialFormDataStr || fileList.length > 0;

      setIsFormDirty(hasChanges); // Set the form dirty state
    }
  }, [formData, fileList, initialFormData, setIsFormDirty]);

  useBeforeUnload(isFormDirty);
  useTempImageCleanup(fileList);
  useWarnOnUnsavedChanges({ isFormDirty, setIsFormDirty });

  return (
    <Fade in timeout={500}>
      <div className="min-h-screen bg-gray-50 p-4">
        <Message onMessage={setFunctions} />
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Add Service</h2>

            <form onSubmit={handleSubmit2} className="space-y-6">
              {/* service name */}
              <SetServiceName
                formData={formData}
                handleInputChange={handleInputChange}
              />
              {/* {categories} */}

              <ServiceCategoryField
                categories={categories}
                handleCategory={handleCategory}
                loading={loading}
                formData={formData}
              />

              {/* experience */}
              <ServiceExperience
                formData={formData}
                handleInputChange={handleInputChange}
              />

              {/* Price Range */}
              <ServicePriceField
                formData={formData}
                handlePriceRangeChange={handlePriceRangeChange}
              />

              {/* Availability */}
              <ServiceAvailability
                formData={formData}
                updateAvailability={updateAvailability}
                daysOfWeek={daysOfWeek}
                timeOptions={timeOptions}
                removeAvailability={removeAvailability}
                addAvailability={addAvailability}
              />

              {/* Skills */}
              <ServiceSkillsField
                formData={formData}
                updateSkill={updateSkill}
                removeSkill={removeSkill}
                addSkill={addSkill}
              />

              {/* location */}
              <SetLocationField
                formData={formData}
                setFormData={setFormData}
                handleLocationFetch={handleLocationFetch}
                isLocationLoading={isLocationLoading}
              />

              {/* images */}
              <UploadServiceImages
                fileList={fileList}
                setFileList={setFileList}
                formData={formData}
                setFormData={setFormData}
                useTempImageCleanup={useTempImageCleanup}
              />

              {/* Description */}
              <SetServiceDescriptionField
                formData={formData}
                handleInputChange={handleInputChange}
              />

              <SetServiceStatus
                formData={formData}
                handleInputChange={handleInputChange}
              />

              {/* Error */}
              <ServiceFormValiddationError errors={errors} />

              {/* Submit Button */}
              <ServiceSubmitButton isCreating={isCreating} />
            </form>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default AddServiceForm;
