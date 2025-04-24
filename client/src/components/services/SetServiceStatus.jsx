import React from "react";
import { Switch } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";

const SetServiceStatus = ({ formData, handleInputChange }) => {
  const handleToggle = (event) => {
    handleInputChange({
      target: {
        name: "status",
        value: event.target.checked ? "Active" : "Inactive",
      },
    });
  };

  const isActive = formData.status === "Active";

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Service Status
      </h3>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isActive ? (
            <div className="p-2 rounded-full bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-gray-100">
              <XCircle className="h-5 w-5 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">
              {isActive ? "Active" : "Inactive"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isActive
                ? "Your service is visible to customers"
                : "Your service is hidden from customers"}
            </p>
          </div>
        </div>

        <Switch
          checked={isActive}
          onChange={handleToggle}
          inputProps={{ "aria-label": "Service status toggle" }}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#10b981",
              "&:hover": {
                backgroundColor: "rgba(16, 185, 129, 0.08)",
              },
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#10b981",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SetServiceStatus;
