import { Tooltip } from "antd";
import React from "react";
import { Button as ABtn } from "antd";

const SetLocationField = (params) => {
  const { formData, setFormData, handleLocationFetch, isLocationLoading } =
    params;
  return (
    <div className="space-y-2">
      <label
        htmlFor="experience"
        className="block text-sm font-medium text-gray-700"
      >
        Location
      </label>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <input
            id="latitude"
            type="number"
            name="latitude"
            value={formData.location.coordinates[1] || ""}
            className="w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Latitude"
            required
            disabled
          />
          <input
            id="longitude"
            type="number"
            name="longitude"
            value={formData.location.coordinates[0] || ""}
            className="w-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Longitude"
            required
            disabled
          />
          {formData.location.coordinates[0] ||
          formData.location.coordinates[1] ? (
            <Tooltip placement="top" title="reset location">
              <button
                className="bg-red-100 text-black w-[45px] p-2 rounded hover:bg-red-300 focus:outline-none"
                onClick={() => {
                  // Handle button click, e.g., reset location coordinates to null
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: [null, null], // Reset coordinates
                    },
                  }));
                }}
              >
                X
              </button>
            </Tooltip>
          ) : null}
        </div>

        <ABtn
          type="primary"
          size="large"
          onClick={handleLocationFetch}
          // style={{ width: "150px" }} // Set a fixed width
          loading={isLocationLoading}
          className="p-1 w-1/3 min-w-[150px]"
        >
          {isLocationLoading ? "Loading" : "Use current location"}
        </ABtn>
      </div>
    </div>
  );
};

export default SetLocationField;
