import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchServiceById, updateServiceViews } from "../services/service";
import { getRatingDistribution } from "../services/review";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ReviewDialog from "../components/review/ReviewDialog";
import ImageCarousel from "./ImageCarousel";
import ServiceAndUser from "./ServiceAndUser";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import PreviewImageModal from "./PreviewImageModal";
import noprofile from "../../src/assets/noprofile.jpg";

const Service = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
  const [serviceLoading, setServiceLoading] = useState(true);
  const [rateDist, setRateDist] = useState(null);
  const [totalReviews, setTotalReviews] = useState(null);
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Close modals on browser back
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ modal: true }, "");
    const handler = () => setOpen(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [open]);

  useEffect(() => {
    if (!previewOpen) return;
    window.history.pushState({ previewModal: true }, "");
    const handler = () => setPreviewOpen(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [previewOpen]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const [serviceRes, distRes] = await Promise.all([
          fetchServiceById(serviceId),
          getRatingDistribution(serviceId),
        ]);
        if (serviceRes.status === 200) setService(serviceRes.data.data);
        if (distRes.status === 200) setRateDist(distRes.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setServiceLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  useEffect(() => {
    try {
      serviceId && updateServiceViews(serviceId);
    } catch (error) {
      console.error("error updating views");
    }
  }, [serviceId]);

  if (serviceLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadBalls />
      </div>
    );

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-0 sm:px-4 py-0 sm:py-6 space-y-4">
        {/* ── Main card ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white sm:rounded-2xl shadow-sm sm:border border-gray-100 overflow-hidden"
        >
          <ServiceAndUser
            service={service}
            handleClickOpen={() => setOpen(true)}
            handleGiveReview={() => navigate(`/write-review/${serviceId}`)}
            noprofile={noprofile}
          />
        </motion.div>

        {/* ── Description ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white sm:rounded-2xl shadow-sm sm:border border-gray-100 p-5 sm:p-6"
        >
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            About this service
          </h2>
          <p className="text-gray-500 italic leading-relaxed text-sm border-l-2 border-gray-200 pl-4">
            "{service.description}"
          </p>
        </motion.div>

        {/* ── Availability ─────────────────────────────────────────────── */}
        {service.availability?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="bg-white sm:rounded-2xl shadow-sm sm:border border-gray-100 p-5 sm:p-6"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Availability
            </h2>
            <div className="space-y-2">
              {service.availability.map((avl, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-600 font-medium w-28">
                    {avl.day}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                    {avl.startTime} – {avl.endTime}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Images ───────────────────────────────────────────────────── */}
        {service.images?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white sm:rounded-2xl shadow-sm sm:border border-gray-100 p-4 sm:p-6"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Work Gallery
            </h2>
            <ImageCarousel
              service={service}
              onImageClick={(index) => {
                setSelectedIndex(index);
                setPreviewOpen(true);
              }}
            />
          </motion.div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>

      {/* Modals */}
      <ReviewDialog
        handleClose={() => setOpen(false)}
        open={open}
        rateDist={rateDist}
        serviceId={serviceId}
        totalReviews={totalReviews}
        averageRating={service.averageRating.toFixed(1)}
      />
      <PreviewImageModal
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        service={service}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};

export default Service;
