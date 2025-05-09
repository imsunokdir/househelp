import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../services/category";
import validateServiceData from "../utils/validateForm";
import { createService, createService2 } from "../services/service";

const useCreateService = (formData, setFormData, initialFormData) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // State to show loading indicator
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isServiceSuccess, setIsServiceSuccess] = useState(false);

  const [functions, setFunctions] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // Start loading
      // console.log("form-data:", formData);
      try {
        // Replace the URL with your API endpoint
        const response = await getAllCategories();
        if (response.status === 200) {
          const formattedCategories = response.data.data.map((item) => ({
            value: item._id, // Value for the select option
            label: item.name, // Label to display in the dropdown
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCategories();
  }, [formData]);

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const getNextDay = (currentDay) => {
    const currentIndex = daysOfWeek.indexOf(currentDay);
    const nextIndex = (currentIndex + 1) % daysOfWeek.length;
    return daysOfWeek[nextIndex].toLowerCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [name]: value,
      },
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const updateSkill = (index, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const addAvailability = () => {
    const lastAvailability =
      formData.availability[formData.availability.length - 1];

    // If no availability, start from Tuesday
    const lastDay = lastAvailability ? lastAvailability.day : "Tuesday";
    const nextDayIndex = (daysOfWeek.indexOf(lastDay) + 1) % daysOfWeek.length;
    const nextDay = daysOfWeek[nextDayIndex];

    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          day: nextDay,
          startTime: "",
          endTime: "",
          enabled: true,
        },
      ],
    }));
  };

  const removeAvailability = (index) => {
    const newAvailability = formData.availability.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      availability: newAvailability,
    }));
  };

  const updateAvailability = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      availability: newAvailability,
    }));
  };

  // const handleSubmit = async (e) => {
  //   setErrors(null);
  //   e.preventDefault();
  //   setIsCreating(true);

  //   //validate form data
  //   const isError = validateServiceData(formData);
  //   if (!isError.isValid) {
  //     setErrors(isError.errors);
  //     setIsCreating(false);
  //     return;
  //   }

  //   //create formData object

  //   const formDataToSend = new FormData();

  //   fileList.forEach((file) => {
  //     // console.log("Appending file:", file.originFileObj);
  //     formDataToSend.append("serviceImages", file.originFileObj);
  //   });

  //   formDataToSend.append("serviceName", formData.serviceName);
  //   formDataToSend.append("description", formData.description);
  //   formDataToSend.append("experience", formData.experience);
  //   formDataToSend.append("status", formData.status);
  //   formDataToSend.append("skills", JSON.stringify(formData.skills)); // Serialize array
  //   formDataToSend.append("priceRange", JSON.stringify(formData.priceRange)); // Serialize object
  //   formDataToSend.append(
  //     "availability",
  //     JSON.stringify(formData.availability)
  //   ); // Serialize array
  //   formDataToSend.append("category", formData.category);
  //   formDataToSend.append("location", JSON.stringify(formData.location));
  //   // console.log("fileList:", fileList);
  //   // console.log("formDatta tot senbd", formData);

  //   try {
  //     const response = await createService(formDataToSend);
  //     if (response.status === 201) {
  //       // console.log("response:", response);
  //       functions.success("Service created.");
  //       // navigate(-1);
  //     }
  //   } catch (error) {
  //     console.log("error:", error);
  //   } finally {
  //     setIsCreating(false);
  //   }
  // };

  const handleSubmit2 = async (e) => {
    setIsServiceSuccess(false);
    setErrors(null);
    e.preventDefault();
    setIsCreating(true);

    const isError = validateServiceData(formData);
    if (!isError.isValid) {
      setErrors(isError.errors);
      setIsCreating(false);
      return;
    }

    try {
      const response = await createService2(formData);
      console.log("Response:", response);
      const serviceId = response.data.data.serviceId;
      if (response.status === 201) {
        localStorage.removeItem("temp_uploaded_images");
        functions.success("Service created");
        sessionStorage.removeItem("formData");
        sessionStorage.setItem("isServiceSuccess", "true");

        // setFormData(initialFormData);
        // setFileList([]);
        // setErrors(null);
        setIsServiceSuccess(true);
        // navigate("/accounts/my-service-menu", { replace: true });
        // navigate(`/service-creation-success/${serviceId}`, { replace: true });

        navigate(`/service-creation-success/${serviceId}`, { replace: true });
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCategory = (value) => {
    console.log("cat:", value);
    setFormData((prev) => ({
      ...prev,
      category: value, // Update the category in formData
    }));
  };

  const handleLocationFetch = () => {
    setIsLocationLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: [longitude, latitude],
        },
      }));
    });
    setIsLocationLoading(false);
  };

  const useTempImageCleanup = (fileList = []) => {
    const hasUnloaded = useRef(false);

    // Save uploaded image public_ids to localStorage

    useEffect(() => {
      if (fileList.length > 0) {
        const tempUploadedImages = fileList.map((file) => ({
          public_id: file?.response?.public_id,
        }));

        localStorage.setItem(
          "temp_uploaded_images",
          JSON.stringify(tempUploadedImages)
        );
      }
    }, [fileList]);

    // Handle cleanup on page unload
    // useEffect(() => {
    //   const handleBeforeUnload = (e) => {
    //     if (hasUnloaded.current) return;
    //     hasUnloaded.current = true;

    //     e.preventDefault();
    //     e.returnValue = "";

    //     const tempImages = JSON.parse(
    //       localStorage.getItem("temp_uploaded_images") || "[]"
    //     );

    //     if (tempImages.length > 0) {
    //       const url = `${
    //         import.meta.env.VITE_API_ROUTE
    //       }/service/delete-service-form-image`;

    //       tempImages.forEach((img) => {
    //         const blob = new Blob(
    //           [JSON.stringify({ public_id: img.public_id })],
    //           {
    //             type: "application/json",
    //           }
    //         );
    //         navigator.sendBeacon(url, blob);
    //       });

    //       localStorage.removeItem("temp_uploaded_images");
    //     }
    //   };

    //   window.addEventListener("beforeunload", handleBeforeUnload);

    //   return () => {
    //     window.removeEventListener("beforeunload", handleBeforeUnload);
    //   };
    // }, []);
  };

  return {
    formData,
    setFormData,
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
  };
};

export default useCreateService;
