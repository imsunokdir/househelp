import React, { useContext, useEffect, useState } from "react";
import { X, Plus, LogInIcon } from "lucide-react";
import { Form, Tooltip } from "antd";
import { Button, CircularProgress, Fade } from "@mui/material";
import { Button as ABtn } from "antd";
import { ContactsFilled } from "@ant-design/icons";
import NavigationContext from "../../contexts/NavigationContext";
import { UIContext } from "../../contexts/UIProvider";
import Message from "../Messages/WarningMessage";
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
import UploadServiceImages from "./UploadServiceImages";
import SetServiceStatus from "./SetServiceStatus";
import useCreateService from "../../hooks/useCreateService";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import useWarnOnUnsavedChanges from "../../hooks/useWarnOnUnsavedChangesBlocker";

const initialFormData = {
  serviceName: "",
  experience: "",
  category: "",
  priceRange: {
    minimum: "",
    maximum: "",
  },
  availability: [{ day: "monday", startTime: "", endTime: "", enabled: true }],
  skills: [],
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
    handleCategory,
    handleLocationFetch,
    timeOptions,
    handleSubmit2,
    isServiceSuccess,
    useTempImageCleanup,
  } = useCreateService(formData, setFormData);

  const { isFormDirty, setIsFormDirty, setPendingNavigation } =
    useContext(NavigationContext);

  useEffect(() => {
    if (formData && initialFormData) {
      const currentFormDataStr = JSON.stringify(formData);
      const initialFormDataStr = JSON.stringify(initialFormData);
      const hasChanges =
        currentFormDataStr !== initialFormDataStr || fileList.length > 0;
      setIsFormDirty(hasChanges);
    }
  }, [formData, fileList, initialFormData, setIsFormDirty]);

  useBeforeUnload(isFormDirty);
  useTempImageCleanup(fileList);
  useWarnOnUnsavedChanges({ isFormDirty, setIsFormDirty });

  return (
    <Fade in timeout={500}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <Message onMessage={setFunctions} />
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white py-5 px-6">
            <h2 className="text-2xl font-semibold">Add New Service</h2>
            <p className="text-blue-100 mt-1 text-sm">
              Complete the form below to list your service
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit2} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service name */}
                <div className="md:col-span-2">
                  <SetServiceName
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <ServiceCategoryField
                    categories={categories}
                    handleCategory={handleCategory}
                    loading={loading}
                    formData={formData}
                  />
                </div>

                {/* Experience */}
                <div>
                  <ServiceExperience
                    formData={formData}
                    handleInputChange={handleInputChange}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <ServicePriceField
                    formData={formData}
                    handlePriceRangeChange={handlePriceRangeChange}
                  />
                </div>
              </div>

              {/* Horizontal divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Skills */}
              <ServiceSkillsField
                formData={formData}
                updateSkill={updateSkill}
                removeSkill={removeSkill}
                addSkill={addSkill}
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

              {/* Horizontal divider */}
              <div className="border-t border-gray-200 my-8"></div>

              {/* Location */}
              <SetLocationField
                formData={formData}
                setFormData={setFormData}
                handleLocationFetch={handleLocationFetch}
                isLocationLoading={isLocationLoading}
              />

              {/* Images */}
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

              {/* Status */}
              <SetServiceStatus
                formData={formData}
                handleInputChange={handleInputChange}
              />

              {/* Error */}
              <ServiceFormValiddationError errors={errors} />

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <ServiceSubmitButton isCreating={isCreating} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default AddServiceForm;
