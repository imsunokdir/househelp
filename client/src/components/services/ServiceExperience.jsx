import React from "react";

const ServiceExperience = (params) => {
  const { formData, handleInputChange } = params;
  return (
    <div className="space-y-2">
      <label
        htmlFor="experience"
        className="block text-sm font-medium text-gray-700"
      >
        Experience
      </label>
      <input
        id="experience"
        type="number"
        name="experience"
        value={formData.experience}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter experience in years"
        required
      />
    </div>
  );
};

export default ServiceExperience;
