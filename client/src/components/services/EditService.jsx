import React, { useEffect, useState } from "react";
import validateServiceData from "../../utils/validateForm";
import Message from "../Messages/WarningMessage";
import { fetchServiceById, updateService } from "../../services/service";
import { useParams } from "react-router-dom";
import { Fade } from "@mui/material";
import { Button as ABtn } from "antd";
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
import UploadServiceImages from "./UploadServiceImages";
import CurrentServiceImages from "./CurrentServiceImages";
import UploadImagesByLen from "./UploadImagesByLen";

const AddServiceForm = () => {
  const { serviceId } = useParams();

  const [isServiceLoading, SetServiceLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState();

  const [fileList, setFileList] = useState([]);
  const [currImages, setCurrImages] = useState([]);
  const [imagesToBeDeleted, setImagesToBeDeleted] = useState([]);
  const [avlSlots, setAvlSlots] = useState(8);

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

  // fetch service details
  useEffect(() => {
    SetServiceLoading(true);
    const fetchService = async () => {
      try {
        const response = await fetchServiceById(serviceId);
        if (response.status === 200) {
          setFormData(response.data.data);
          setCurrImages(response.data.data.images);
          console.log("res:", response.data.data);
        }
      } catch (error) {
        console.log("error:", error);
        functions.error("There was an error.!!");
      } finally {
        SetServiceLoading(false);
      }
    };
    fetchService();
  }, []);

  //update form / submit form
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors(null);
    setIsUpdating(true);
    console.log("hola");
    if (avlSlots > 8) {
      const message = `Please remove ${avlSlots - 8} ${
        avlSlots - 8 === 1 ? "image" : "images"
      }`;
      setErrors((prev) => [message]); // Set error message in an array
      setIsUpdating(false); // Stop updating if there is an error
      return;
    }

    const isError = validateServiceData(formData);
    try {
      if (!isError.isValid) {
        setErrors((prev) => [...(prev || []), ...isError.errors]);
        return;
      }

      const formDataToSend = new FormData();

      fileList.forEach((file) => {
        formDataToSend.append("updatedImages", file.originFileObj);
      });

      formDataToSend.append("serviceName", formData.serviceName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("skills", JSON.stringify(formData.skills)); // Serialize array
      formDataToSend.append("priceRange", JSON.stringify(formData.priceRange)); // Serialize object
      formDataToSend.append(
        "availability",
        JSON.stringify(formData.availability)
      ); // Serialize array
      formDataToSend.append("category", formData.category);
      formDataToSend.append("location", JSON.stringify(formData.location));
      formDataToSend.append("serviceId", serviceId);
      formDataToSend.append(
        "imagesToBeDeleted",
        JSON.stringify(imagesToBeDeleted)
      );

      const response = await updateService(formDataToSend);
      if (response.status === 200) {
        navigate("/accounts");
      }
    } catch (error) {
      console.log("error:", error);
      functions.error("There was an error updating your data");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    let currLen = currImages.length;
    let fileLen = fileList.length;
    let imagesDelLen = imagesToBeDeleted.length;

    setAvlSlots(currLen + fileLen - imagesDelLen);

    console.log("calculate:", currLen + fileLen - imagesDelLen);
  }, [fileList, imagesToBeDeleted]);

  useEffect(() => {
    console.log("formdata:", formData);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Message onMessage={setFunctions} />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Update Service</h2>
          {isServiceLoading ? (
            <SkeletonLoad />
          ) : (
            <Fade in timeout={1000}>
              <form onSubmit={handleUpdate} className="space-y-6">
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

                {/* current service images */}
                <CurrentServiceImages
                  formData={formData}
                  currImages={currImages}
                  setCurrImages={setCurrImages}
                  imagesToBeDeleted={imagesToBeDeleted}
                  setImagesToBeDeleted={setImagesToBeDeleted}
                />

                {/* images */}
                <UploadImagesByLen
                  fileList={fileList}
                  setFileList={setFileList}
                  formData={formData}
                  avlSlots={avlSlots}
                  setAvlSlots={avlSlots}
                />

                {/* Description */}
                <SetServiceDescriptionField
                  formData={formData}
                  handleInputChange={handleInputChange}
                />

                {/* Error */}
                <ServiceFormValiddationError errors={errors} />

                {/* Submit Button */}
                {/* <ServiceSubmitButton isCreating={isCreating} /> */}
                <ServiceUpdateButton isUpdating={isUpdating} />
              </form>
            </Fade>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddServiceForm;
