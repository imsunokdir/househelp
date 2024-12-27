import React from "react";
import { Switch } from "@mui/material";

const SetServiceStatus = ({ formData, handleInputChange }) => {
  const handleToggle = (event) => {
    handleInputChange({
      target: {
        name: "status",
        value: event.target.checked ? "Active" : "Inactive",
      },
    });
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="status"
        className="block text-sm font-medium text-gray-700"
      >
        Service Status
      </label>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.status === "Active"}
          onChange={handleToggle}
          inputProps={{ "aria-label": "Service status toggle" }}
        />
        <span className="text-sm font-medium">
          {formData.status === "Active" ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

export default SetServiceStatus;
