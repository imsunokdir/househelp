import React, { useContext, useEffect, useState } from "react";
import { User, Calendar, Globe, Mail, Pencil, Check, X } from "lucide-react";
import Test from "../Test";
import UploadProfile from "../components/users/UploadProfile";
import { AuthContext } from "../contexts/AuthProvider";
import { getUserDetails } from "../services/user";
import { Button, Upload } from "antd";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { Fade } from "@mui/material";
import { ThreeDot } from "react-loading-indicators";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";

const EditableField = ({ label, value, icon: Icon, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    setCurrentValue(tempValue);
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(currentValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <p className="text-gray-600">{label}</p>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-600 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full px-0 py-1 text-gray-900 font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none"
              autoFocus
            />
          ) : (
            <p className="text-gray-900 font-medium py-1">{currentValue}</p>
          )}
        </div>
        <Icon className="w-5 h-5 text-gray-400 ml-4" />
      </div>
    </div>
  );
};

const PersonalInfo = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState();
  const handleSave = (field, value) => {
    console.log(`Saving ${field}:`, value);
    // Here you would typically make an API call to save the changes
  };

  useEffect(() => {
    setUserLoading(true);
    const fetchUser = async () => {
      try {
        const response = await getUserDetails();
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.log("user error:", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  return userLoading ? (
    <LoadBalls />
  ) : (
    <Fade in timeout={500}>
      <div className="max-w-4xl mx-auto p-6 ">
        <UploadProfile user={user} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Personal information</h2>
          <p className="text-gray-600 mb-6">
            Manage your personal information, including phone numbers and email
            address where you can be contacted
          </p>
        </div>

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              label="First Name"
              value={user.firstName}
              icon={User}
              // onSave={(value) => handleSave("name", value)}
            />
            <EditableField
              label="Last Name"
              value={user.lastName}
              icon={User}
              // onSave={(value) => handleSave("name", value)}
            />

            <div className="md:col-span-2">
              <EditableField
                label="Email"
                value={user.email}
                icon={Mail}
                onSave={(value) => handleSave("email", value)}
              />
            </div>

            <EditableField
              label="Date of Birth"
              value="07 July 1993"
              icon={Calendar}
              // onSave={(value) => handleSave("dateOfBirth", value)}
            />

            <EditableField
              label="Country Region"
              value="Georgia, Tbilisi"
              icon={Globe}
              onSave={(value) => handleSave("countryRegion", value)}
            />

            {/* <EditableField
        label="Language"
        value="English (UK) - English"
        icon={Globe}
        onSave={(value) => handleSave("language", value)}
      /> */}

            <div className="md:col-span-2">
              <EditableField
                label="Contactable at"
                value="ikakodesign@gmail.com"
                icon={Mail}
                onSave={(value) => handleSave("email", value)}
              />
            </div>
            <div className="md:col-span-2">
              <EditableField
                label="Contactable at"
                value="ikakodesign@gmail.com"
                icon={Mail}
                onSave={(value) => handleSave("email", value)}
              />
            </div>
            <div className="md:col-span-2">
              <EditableField
                label="Contactable at"
                value="ikakodesign@gmail.com"
                icon={Mail}
                onSave={(value) => handleSave("email", value)}
              />
            </div>
          </div>
        )}
      </div>
    </Fade>
  );
};

export default PersonalInfo;
