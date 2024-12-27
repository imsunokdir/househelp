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

const AddServiceForm = () => {
  const [formData, setFormData] = useState({
    serviceName: "",
    experience: "",
    category: "",
    priceRange: {
      minimum: 0,
      maximum: 0,
    },
    availability: [
      { day: "monday", startTime: "", endTime: "", enabled: true },
    ],
    skills: [""],
    description: "",
    location: {
      type: "Point",
      coordinates: [null, null],
    },
    status: "Active",
  });
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
    handleSubmit,
    handleCategory,
    handleLocationFetch,
    timeOptions,
  } = useCreateService(formData, setFormData);

  return (
    <Fade in timeout={500}>
      <div className="min-h-screen bg-gray-50 p-4">
        <Message onMessage={setFunctions} />
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Add Service</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
