import React from "react";
import { AlignLeft } from "lucide-react";

const SetServiceDescriptionField = (params) => {
  const { formData, handleInputChange } = params;

  return (
    <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center space-x-2 mb-3">
        <AlignLeft className="h-4 w-4 text-blue-600" />
        <label
          htmlFor="description"
          className="text-base font-semibold text-gray-800"
        >
          Description
        </label>
      </div>

      <div className="relative">
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px] text-gray-700"
          placeholder="Enter a detailed description of your service..."
          rows="5"
        />

        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <span>
            Describe your service in detail including benefits and features
          </span>
          <span>{formData.description?.length || 0} characters</span>
        </div>
      </div>
    </div>
  );
};

export default SetServiceDescriptionField;
