// serviceValidation.js

// Helper functions for specific validations
const isValidPrice = (price) => {
  return typeof price === "number" && price >= 0 && price <= 1000000;
};

const isValidTimeFormat = (time) => {
  // Validate HH:MM format using regex
  const regex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  return regex.test(time);
};

const isValidDateRange = (availability) => {
  if (!Array.isArray(availability)) return false;

  return availability.every((slot) => {
    if (!slot.startTime || !slot.endTime) return false;

    // Check if both startTime and endTime are in HH:MM format
    if (
      !isValidTimeFormat(slot.startTime) ||
      !isValidTimeFormat(slot.endTime)
    ) {
      return false;
    }

    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);

    // Convert start and end times to minutes since midnight for comparison
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    return startTimeInMinutes < endTimeInMinutes; // Start time must be before end time
  });
};

const isValidExperience = (experience) => {
  return typeof experience === "number" && experience >= 0 && experience <= 100;
};

/**
 * Validates service data before registration
 * @param {Object} serviceData - The service data to validate
 * @returns {Object} Validation result with isValid flag and any errors
 */
const validateServiceData = (serviceData) => {
  const errors = [];

  // Destructure the service data
  const {
    serviceName,
    description,
    experience,
    skills,
    priceRange,
    availability,
    category,
  } = serviceData;

  // Validate serviceName
  if (!serviceName || typeof serviceName !== "string") {
    errors.push("Service name is required and must be a string");
  } else if (serviceName.trim().length < 3 || serviceName.trim().length > 100) {
    errors.push("Service name must be between 3 and 100 characters");
  }

  if (!category) {
    errors.push("Category is required");
  }

  // Validate description
  //   if (!description || typeof description !== "string") {
  //     errors.push("Description is required and must be a string");
  //   } else
  if (description.trim().length > 500) {
    errors.push("Description must be between 0 and 500 characters");
  }

  // Validate experience
  if (!experience || !isValidExperience(Number(experience))) {
    errors.push("Experience must be a number between 0 and 100");
  }

  // Validate skills
  if (!skills || (!Array.isArray(skills) && typeof skills !== "string")) {
    errors.push("Skills must be provided as an array or string");
  } else {
    const skillsArray = Array.isArray(skills) ? skills : [skills];
    if (skillsArray.length === 0) {
      errors.push("At least one skill must be provided");
    } else if (
      skillsArray.some(
        (skill) => typeof skill !== "string" || skill.trim().length === 0
      )
    ) {
      errors.push("All skills must be non-empty strings");
    }
  }

  // Validate priceRange
  if (!priceRange || typeof priceRange !== "object") {
    errors.push("Price range must be provided as an object");
  } else {
    const { minimum, maximum } = priceRange;

    if (!isValidPrice(Number(minimum)) || !isValidPrice(Number(maximum))) {
      errors.push(
        "Price range must contain valid minimum and maximum values between 0 and 1,000,000"
      );
    }
    if (Number(minimum) >= Number(maximum)) {
      errors.push("Minimum price must be less than maximum price");
    }
  }

  // Validate availability
  if (!availability) {
    errors.push("Availability is required");
  } else if (!isValidDateRange(availability)) {
    errors.push(
      "Availability must be an array of valid date ranges with startTime and endTime"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Export the validation function

export default validateServiceData;
