import { Plus, X } from "lucide-react";
import React from "react";

const ServiceAvailability = (params) => {
  const {
    formData,
    updateAvailability,
    daysOfWeek,
    timeOptions,
    removeAvailability,
    addAvailability,
  } = params;
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Availability
      </label>
      <div className="space-y-2">
        {formData.availability.map((slot, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <select
                value={slot.day}
                onChange={(e) =>
                  updateAvailability(index, "day", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {daysOfWeek.map((day) => (
                  <option key={day.toLowerCase()} value={day.toLowerCase()}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <select
                value={slot.startTime}
                onChange={(e) =>
                  updateAvailability(index, "startTime", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Start Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <select
                value={slot.endTime}
                onChange={(e) =>
                  updateAvailability(index, "endTime", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">End Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 flex justify-center">
              {formData.availability.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="ml-2 text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addAvailability}
          className="w-full flex items-center justify-center text-blue-500 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Availability Slot
        </button>
      </div>
    </div>
  );
};

export default ServiceAvailability;
