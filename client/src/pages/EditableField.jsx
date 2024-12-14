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
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition ${
        isDisabled ? "opacity-50 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-600">{label}</p>
        {!isEditing && !isDisabled && (
          <button
            onClick={() => {
              setIsEditing(true);
              onEditStart();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  autoFocus
                />
              ) : (
                <input
                  type={`${label === "Date of Birth" ? "date" : "text"}`}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full px-0 py-1 text-gray-900 font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
                  autoFocus
                />
              )}

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              {!user?.whatsapp && user?.mobile && label === "Whatsapp" && (
                <div className="flex gap-1 items-center">
                  <label>Same as mobile?</label>
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
                  />
                </div>
              )}
              <div className="flex justify-end mt-2 gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-4 py-2 text-sm text-white ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 rounded hover:bg-green-600"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-900 font-medium py-1">{value}</p>
          )}
        </div>
        <Icon className="w-5 h-5 text-gray-400 ml-4" />
      </div>
    </div>
  );
};

export default EditableField;
