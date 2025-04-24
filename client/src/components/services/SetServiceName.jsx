import React from "react";
import { Briefcase, ListFilter, Clock } from "lucide-react";

const SetServiceName = ({ handleInputChange, formData }) => {
  return (
    <div className="space-y-2 bg-white p-4 px-2 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center border-b border-gray-100 pb-2">
        <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
        <label
          htmlFor="serviceName"
          className="text-sm font-medium text-gray-800"
        >
          Service Name
        </label>
      </div>
      <input
        id="serviceName"
        name="serviceName"
        type="text"
        value={formData.serviceName}
        onChange={handleInputChange}
        placeholder="Enter service name"
        required
        className="w-full px-4 py-2.5 border border-gray-200 rounded-md shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      />
      <p className="text-xs text-gray-500">
        Provide a clear, descriptive name for your service
      </p>
    </div>
  );
};

export default SetServiceName;
