import React, { useContext, useEffect, useState } from "react";
import {
  MapPin,
  Star,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";
import { StarFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { motion } from "framer-motion";
import whatsapp from "../assets/whatsapp.png";
import noprofile from "../../src/assets/noprofile.jpg";
import { checkSaveService, toggleSave } from "../services/service";
import { AuthContext } from "../contexts/AuthProvider";
import { Alert, Snackbar } from "@mui/material";
import MessageButton from "../components/chats/MessageButton";

const ServiceAndUser = ({ service, handleClickOpen, handleGiveReview }) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [isServiceSaved, setIsServiceSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user } = useContext(AuthContext);

  const handleContactClick = () => {
    const whatsappNum = service.createdBy?.whatsapp;
    if (whatsappNum) window.open(`https://wa.me/${whatsappNum}`);
  };

  const checkSavedServices = async () => {
    try {
      const res = await checkSaveService(service._id);
      if (res.status === 200) setIsServiceSaved(res.data.isSaved);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (user && service._id) checkSavedServices();
  }, [user, service._id]);

  const toggleSaveService = async () => {
    try {
      setSaveLoading(true);
      const res = await toggleSave(service._id);
      if (res.status === 200) {
        setIsServiceSaved(res.data.isSaved);
        setSnackbarMessage(
          res.data.isSaved ? "Service saved!" : "Service removed!",
        );
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.log("error");
    } finally {
      setSaveLoading(false);
    }
  };

  const mapsUrl = service.location?.coordinates
    ? `https://www.google.com/maps?q=${service.location.coordinates[1]},${service.location.coordinates[0]}`
    : null;

  const providerName = service.createdBy?.firstName
    ? `${service.createdBy.firstName} ${service.createdBy.lastName}`
    : service.createdBy?.username;

  const isOwner =
    user &&
    (user._id === service.createdBy?._id ||
      user.userId === service.createdBy?._id);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left — Provider card ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="flex lg:flex-col items-center lg:items-start gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                <img
                  src={
                    service.createdBy?.avatar
                      ? service.createdBy.avatar.replace(
                          "/upload/",
                          "/upload/f_auto,q_auto,w_200/",
                        )
                      : noprofile
                  }
                  alt={providerName}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
            </div>

            {/* Provider info */}
            <div className="flex-1 lg:w-full">
              <h3 className="text-base font-semibold text-gray-900">
                {providerName}
              </h3>

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 mt-1 transition-colors no-underline"
                >
                  <MapPin size={11} />
                  View location
                  <ExternalLink size={10} />
                </a>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={handleContactClick}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <img src={whatsapp} alt="WhatsApp" className="w-4 h-4" />
                  WhatsApp
                </button>

                {!isOwner && (
                  <MessageButton
                    workerId={service.createdBy._id}
                    serviceId={service._id}
                    workerName={providerName}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <div className="hidden lg:block w-px bg-gray-100 self-stretch" />

        {/* ── Right — Service details ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex-1 min-w-0"
        >
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {service.serviceName}
            </h1>

            {user && (
              <Spin
                indicator={<LoadingOutlined spin />}
                size="small"
                spinning={saveLoading}
              >
                <button
                  onClick={toggleSaveService}
                  className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                    isServiceSaved
                      ? "bg-blue-50 text-blue-500"
                      : "hover:bg-gray-100 text-gray-400"
                  }`}
                >
                  {isServiceSaved ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </button>
              </Spin>
            )}
          </div>

          {/* Rating row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl">
              <StarFilled style={{ color: "#f59e0b", fontSize: "14px" }} />
              <span className="text-sm font-bold text-amber-600">
                {service.averageRating.toFixed(1)}
              </span>
              {service.ratingCount > 0 ? (
                <button
                  onClick={handleClickOpen}
                  className="text-xs text-blue-500 hover:underline ml-1"
                >
                  {service.ratingCount} reviews
                </button>
              ) : (
                <span className="text-xs text-gray-400 ml-1">
                  No ratings yet
                </span>
              )}
            </div>

            <button
              onClick={handleGiveReview}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-xl transition-colors"
            >
              Write a review
            </button>
          </div>

          {/* Price */}
          {service.priceRange && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Pricing</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{service.priceRange.minimum}
                <span className="text-gray-400 font-normal text-sm"> – </span>₹
                {service.priceRange.maximum}
              </p>
            </div>
          )}

          {/* Skills */}
          {service.skills?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {service.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ServiceAndUser;
