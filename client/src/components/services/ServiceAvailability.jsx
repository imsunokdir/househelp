import React from "react";
import { Plus, X, Clock, Calendar } from "lucide-react";

const ServiceAvailability = ({
  formData,
  updateAvailability,
  daysOfWeek,
  timeOptions,
  removeAvailability,
  addAvailability,
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-800">Availability</h3>
      </div>

      <div className="space-y-4">
        {formData.availability.map((slot, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-md border border-gray-200 shadow-sm"
          >
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Day
                </label>
                <select
                  value={slot.day}
                  onChange={(e) =>
                    updateAvailability(index, "day", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day.toLowerCase()} value={day.toLowerCase()}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-5 md:col-span-3 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <select
                    value={slot.startTime}
                    onChange={(e) =>
                      updateAvailability(index, "startTime", e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    <option value="">Select</option>
                    {timeOptions.map((time) => (
                      <option key={`start-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="col-span-5 md:col-span-3 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End Time
                </label>
                <div className="relative">
                  <select
                    value={slot.endTime}
                    onChange={(e) =>
                      updateAvailability(index, "endTime", e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    <option value="">Select</option>
                    {timeOptions.map((time) => (
                      <option key={`end-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="col-span-2 md:col-span-2 lg:col-span-3 flex justify-end items-center">
                {formData.availability.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                    aria-label="Remove time slot"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addAvailability}
          className="w-full mt-3 flex items-center justify-center py-2 px-4 border border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Another Time Slot</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceAvailability;
