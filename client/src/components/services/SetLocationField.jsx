import { Tooltip } from "antd";
import React from "react";
import { Button as AntdButton } from "antd";
import { X, MapPin } from "lucide-react";

const SetLocationField = (params) => {
  const { formData, setFormData, handleLocationFetch, isLocationLoading } =
    params;

  const hasCoordinates =
    formData.location.coordinates[0] || formData.location.coordinates[1];

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <label className="text-sm font-medium text-gray-800">
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            Location
          </span>
        </label>
        {hasCoordinates && (
          <Tooltip placement="top" title="Reset location">
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 transition-all duration-200"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    coordinates: [null, null],
                  },
                }));
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <input
              id="latitude"
              type="number"
              name="latitude"
              value={formData.location.coordinates[1] || ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
              placeholder="Latitude"
              disabled
            />
            <span className="absolute right-4 top-2.5 text-xs font-medium text-gray-400 bg-gray-50 px-1">
              Lat
            </span>
          </div>

          <div className="relative group">
            <input
              id="longitude"
              type="number"
              name="longitude"
              value={formData.location.coordinates[0] || ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-gray-700 placeholder-gray-400 transition-all duration-200"
              placeholder="Longitude"
              disabled
            />
            <span className="absolute right-4 top-2.5 text-xs font-medium text-gray-400 bg-gray-50 px-1">
              Long
            </span>
          </div>
        </div>

        <AntdButton
          type="primary"
          size="middle"
          onClick={handleLocationFetch}
          loading={isLocationLoading}
          className="flex items-center justify-center h-10 text-sm"
          icon={!isLocationLoading && <MapPin className="h-4 w-4 mr-2" />}
        >
          {isLocationLoading ? "Getting location..." : "Use Current Location"}
        </AntdButton>
      </div>

      {hasCoordinates && (
        <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 p-2 rounded">
          <div className="mr-2 flex-shrink-0">
            <MapPin className="h-3 w-3" />
          </div>
          <p>Coordinates successfully set. Use the reset button to clear.</p>
        </div>
      )}
    </div>
  );
};

export default SetLocationField;
