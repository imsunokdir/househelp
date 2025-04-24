import { Clock } from "lucide-react";
import React from "react";

const ServiceExperience = ({ formData, handleInputChange }) => {
  const handleWheel = (e) => {
    // Blur the input so scrolling doesn't affect the value
    e.target.blur();
  };

  const handleKeyPress = (e) => {
    // Allow only numeric input
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center border-b border-gray-100 pb-2">
        <Clock className="h-4 w-4 mr-2 text-green-500" />
        <label
          htmlFor="experience"
          className="text-sm font-medium text-gray-800"
        >
          Experience
        </label>
      </div>
      <div className="relative">
        <input
          id="experience"
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          onWheel={handleWheel} // Blur input on scroll to prevent number change
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-md shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          placeholder="Enter experience in years"
          required
        />
        <span className="absolute right-4 top-2.5 text-xs font-medium text-gray-400">
          Years
        </span>
      </div>
      <p className="text-xs text-gray-500">
        How many years of experience do you have in this service?
      </p>
    </div>
  );
};

export default ServiceExperience;
