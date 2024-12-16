import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Calendar,
  Globe,
  Mail,
  Pencil,
  LifeBuoy,
  Book,
} from "lucide-react";
import Test from "../Test";
import UploadProfile from "../components/users/UploadProfile";
import { AuthContext } from "../contexts/AuthProvider";
import { getUserDetails, updateUserInfo } from "../services/user";
import { Fade } from "@mui/material";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import { MobileFilled } from "@ant-design/icons";
import { WhatsApp } from "@mui/icons-material";
import { format } from "date-fns";

import EditableField from "./EditableField";

const PersonalInfo = () => {
  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState();
  const [editingField, setEditingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (field, value) => {
    console.log(`Saving ${field}:`, value);
    setIsSaving(true);
    setErrorMessage(""); // Reset any previous error message

    try {
      const response = await updateUserInfo({ [field]: value });
      console.log("res user:", response);
      // Optionally update user state with the new values if necessary
      setUser((prev) => ({
        ...prev,
        [field]: value, // Update the specific field
      }));
      return true; // Indicate success
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      setErrorMessage("Failed to update. Please try again."); // Set error message
      return false; // Indicate failure
    } finally {
      setIsSaving(false);
      // Do not reset editing field here; it's handled in EditableField
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
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

  return userLoading ? (
    <LoadBalls />
  ) : (
    <Fade in timeout={500}>
      <div className="max-w-4xl mx-auto p-6">
        <UploadProfile user={user} />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
          <p className="text-gray-600 mb-6">
            Manage your personal information, including phone numbers and email
            address where you can be contacted.
          </p>
        </div>

        {user && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <EditableField
                label="First Name"
                value={user.firstName}
                icon={User}
                isDisabled={
                  editingField !== null && editingField !== "firstName"
                }
                onEditStart={() => setEditingField("firstName")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("firstName", value)}
                isSaving={isSaving && editingField === "firstName"}
                errorMessage={editingField === "firstName" ? errorMessage : ""}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <EditableField
                label="Last Name"
                value={user.lastName}
                icon={User}
                isDisabled={
                  editingField !== null && editingField !== "lastName"
                }
                onEditStart={() => setEditingField("lastName")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("lastName", value)}
                isSaving={isSaving && editingField === "lastName"}
                errorMessage={editingField === "lastName" ? errorMessage : ""}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <EditableField
                label="Email"
                value={user.email}
                icon={Mail}
                isDisabled={editingField !== null && editingField !== "email"}
                onEditStart={() => setEditingField("email")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("email", value)}
                isSaving={isSaving && editingField === "email"}
                errorMessage={editingField === "email" ? errorMessage : ""}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <EditableField
                label="Date of Birth"
                value={
                  user?.dateOfBirth
                    ? format(new Date(user.dateOfBirth), "MM/dd/yyyy")
                    : ""
                }
                icon={Calendar}
                isDisabled={
                  editingField !== null && editingField !== "dateOfBirth"
                }
                onEditStart={() => setEditingField("dateOfBirth")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("dateOfBirth", value)}
                isSaving={isSaving && editingField === "dateOfBirth"}
                errorMessage={
                  editingField === "dateOfBirth" ? errorMessage : ""
                }
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <EditableField
                label="Mobile"
                value={user.mobile}
                icon={MobileFilled}
                isDisabled={editingField !== null && editingField !== "mobile"}
                onEditStart={() => setEditingField("mobile")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("mobile", value)}
                isSaving={isSaving && editingField === "mobile"}
                errorMessage={editingField === "mobile" ? errorMessage : ""}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <EditableField
                label="Whatsapp"
                value={user.whatsapp}
                icon={WhatsApp}
                isDisabled={
                  editingField !== null && editingField !== "whatsapp"
                }
                onEditStart={() => setEditingField("whatsapp")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("whatsapp", value)}
                isSaving={isSaving && editingField === "whatsapp"}
                errorMessage={editingField === "whatsapp" ? errorMessage : ""}
                user={user}
              />
            </div>
            <div className="col-span-2">
              <EditableField
                label="Bio"
                value={user.bio}
                icon={Book}
                isDisabled={editingField !== null && editingField !== "bio"}
                onEditStart={() => setEditingField("bio")}
                onEditEnd={() => setEditingField(null)}
                onSave={(value) => handleSave("bio", value)}
                isSaving={isSaving && editingField === "bio"}
                errorMessage={editingField === "bio" ? errorMessage : ""}
                user={user}
              />
            </div>
          </div>
        )}
      </div>
    </Fade>
  );
};

export default PersonalInfo;
