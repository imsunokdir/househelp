import { Pencil } from "lucide-react";
import React, { useState } from "react";

const EditableField = ({
  label,
  value = "",
  icon: Icon,
  onSave,
  isDisabled,
  onEditStart,
  onEditEnd,
  isSaving,
  errorMessage,
  user,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isSameAsMobile, setIsSameAsMobile] = useState(false);

  const handleSave = async () => {
    const isSuccess = await onSave(tempValue);
    if (isSuccess) {
      setIsEditing(false); // Set editing state to false only if save is successful
      onEditEnd();
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
    onEditEnd();
  };

  return (
    <div
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:border-gray-200 transition-all ${
        isDisabled ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <p className="text-gray-600 font-medium text-sm">{label}</p>
        {!isEditing && !isDisabled && (
          <button
            onClick={() => {
              setIsEditing(true);
              onEditStart();
            }}
            className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-blue-50"
            title={`Edit ${label}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {isEditing ? (
            <>
              {label === "Bio" ? (
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  rows={4}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              ) : (
                <input
                  type={`${label === "Date of Birth" ? "date" : "text"}`}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full px-2 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                  placeholder={`Enter your ${label.toLowerCase()}`}
                />
              )}

              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
              {!user?.whatsapp && user?.mobile && label === "Whatsapp" && (
                <div className="flex gap-2 items-center mt-2 bg-blue-50 p-2 rounded-md">
                  <label className="text-sm text-gray-600">
                    Same as mobile?
                  </label>
                  <input
                    type="checkbox"
                    checked={isSameAsMobile}
                    onChange={(e) => {
                      setIsSameAsMobile(e.target.checked);
                      if (e.target.checked) {
                        setTempValue(user.mobile); // Set WhatsApp value to mobile
                      } else {
                        setTempValue(value); // Reset to original WhatsApp value
                      }
                    }}
                    className="h-4 w-4 text-blue-500 accent-blue-500"
                  />
                </div>
              )}
              <div className="flex justify-end mt-3 gap-3">
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                    isSaving
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 text-sm text-white rounded-md transition-all ${
                    isSaving
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-900 font-medium py-1 min-h-[24px]">
              {value || (
                <span className="text-gray-400 italic text-sm">
                  Not provided
                </span>
              )}
            </p>
          )}
        </div>
        <Icon className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
      </div>
    </div>
  );
};

export default EditableField;
