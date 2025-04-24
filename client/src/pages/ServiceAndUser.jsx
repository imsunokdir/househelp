import {
  LoadingOutlined,
  SaveFilled,
  SaveOutlined,
  StarFilled,
} from "@ant-design/icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PersonPinCircle,
  PersonPinCircleOutlined,
  Save,
  SaveAlt,
  SaveAs,
  WhatsApp,
} from "@mui/icons-material";
import { Divider, Rate, Spin } from "antd";
import { MapPin, Star } from "lucide-react";
import whatsapp from "../assets/whatsapp.png";

import React, { useContext, useEffect, useState } from "react";
import { checkSaveService, toggleSave } from "../services/service";
import { AuthContext } from "../contexts/AuthProvider";
import { Alert, Box, Snackbar } from "@mui/material";

const ServiceAndUser = ({
  service,
  handleClickOpen,
  handleGiveReview,
  noprofile,
}) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [isServiceSaved, setIsServiceSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user } = useContext(AuthContext);

  const handleContactClick = () => {
    const whatsappNum = service.createdBy?.whatsapp;
    if (whatsappNum) {
      const whatsappUrl = `https://wa.me/${whatsappNum}`;
      window.open(whatsappUrl);
    }
  };

  const checkSavedServices = async () => {
    try {
      const res = await checkSaveService(service._id);
      if (res.status == 200) {
        setIsServiceSaved(res.data.isSaved);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (user && service._id) {
      checkSavedServices();
    }
  }, [user, service._id]);

  const toggleSaveService = async () => {
    try {
      setSaveLoading(true);
      const res = await toggleSave(service._id);
      if (res.status === 200) {
        setIsServiceSaved(res.data.isSaved);
        setSnackbarMessage(
          res.data.isSaved
            ? "Service saved successfully!"
            : "Service removed successfully!"
        );
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log("error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Provider Info */}
        <div className="flex items-center">
          <div className="relative">
            {/* Profile Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={
                  service.createdBy?.avatar
                    ? service.createdBy.avatar.replace(
                        "/upload/",
                        "/upload/f_auto,q_auto,w_550/"
                      )
                    : noprofile
                }
                alt="Service Provider"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Background Design */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full scale-150 blur-sm"></div>
          </div>

          <div className="ml-6">
            <h3 className="text-lg font-medium mb-1">
              {service.createdBy?.firstName
                ? `${service.createdBy.firstName} ${service.createdBy?.lastName}`
                : service.createdBy.username}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-1" />
              <span>South ex1 block-e</span>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleContactClick}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <img src={whatsapp} alt="WhatsApp" className="w-5 h-5 mr-2" />
                <span>Contact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Service Details */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {service.serviceName}
            </h2>

            {user && (
              <div className="ml-3">
                <Spin
                  indicator={<LoadingOutlined spin />}
                  size="small"
                  spinning={saveLoading}
                >
                  <button
                    className={`p-2 rounded-full ${
                      isServiceSaved
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={toggleSaveService}
                  >
                    {isServiceSaved ? (
                      <SaveFilled style={{ fontSize: "24px" }} />
                    ) : (
                      <SaveOutlined style={{ fontSize: "24px" }} />
                    )}
                  </button>
                </Spin>
              </div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <div className="flex items-center bg-amber-50 px-3 py-2 rounded-lg">
              <span className="text-2xl font-bold text-amber-500 mr-1">
                {service.averageRating.toFixed(1)}
              </span>
              <StarFilled style={{ color: "#f59e0b", fontSize: "18px" }} />

              {service.ratingCount > 0 && (
                <span
                  className="ml-2 text-blue-600 underline cursor-pointer"
                  onClick={handleClickOpen}
                >
                  {service.ratingCount} Reviews
                </span>
              )}

              {service.ratingCount === 0 && (
                <span className="ml-2 text-gray-500">No ratings yet</span>
              )}
            </div>

            <button
              onClick={handleGiveReview}
              className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              Write a review
            </button>
          </div>

          <div className="mt-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {service.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={isServiceSaved ? "success" : "info"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ServiceAndUser;
