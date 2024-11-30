import React from "react";

const SetServiceDescriptionField = (params) => {
  const { formData, handleInputChange } = params;
  return (
    <div className="space-y-2">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter description"
        rows="4"
      />
    </div>
  );
};

export default SetServiceDescriptionField;
