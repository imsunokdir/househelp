import React from "react";

const SetServiceName = (params) => {
  const { handleInputChange, formData } = params;
  return (
    <div className="space-y-2">
      <label
        htmlFor="serviceName"
        className="block text-sm font-medium text-gray-700"
      >
        Service Name
      </label>
      <input
        id="serviceName"
        type="text"
        name="serviceName"
        value={formData.serviceName}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter service name"
        required
      />
    </div>
  );
};

export default SetServiceName;
