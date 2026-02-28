import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteService, fetchServiceById } from "../../services/service";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import MyServiceImageCarousel from "./MyServiceImageCarousel";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  MapPin,
  Trash2,
  Clock,
  Star,
  Eye,
  Zap,
  ChevronRight,
} from "lucide-react";
import { DeleteFilled } from "@ant-design/icons";
import { message, Modal, Tag } from "antd";
import ReviewsMain from "../review/ReviewsMain";
import BoostCard from "./BoostCard";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
});

const MyServiceDetails = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
  const [serviceLoading, setServiceLoading] = useState(true);
  const [isServiceDeleting, setisServiceDeleting] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const navigate = useNavigate();

  const fetchService = async () => {
    try {
      const response = await fetchServiceById(serviceId);
      if (response.status === 200) setService(response.data.data);
    } catch (error) {
      console.log("Error fetching service:", error);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  const handleDelete = async () => {
    setisServiceDeleting(true);
    try {
      const response = await deleteService(serviceId);
      if (response.status === 200) {
        setModal2Open(false);
        navigate("/accounts/my-service-menu/my-services", { replace: true });
      }
    } catch (error) {
      message.error("Failed to delete service");
    } finally {
      setisServiceDeleting(false);
    }
  };

  if (serviceLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadBalls />
      </div>
    );

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Top hero strip ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {service.serviceName}
              </h1>
              {service.isBoosted && (
                <span className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-200">
                  <Zap size={11} /> Boosted
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {service.createdAt
                  ? formatDistanceToNow(new Date(service.createdAt), {
                      addSuffix: true,
                    })
                  : "N/A"}
              </span>
              {service.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  {service.averageRating.toFixed(1)} ({service.ratingCount}{" "}
                  reviews)
                </span>
              )}
              {service.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye size={13} />
                  {service.views} views
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`edit-service`)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <Edit size={15} />
              Edit
            </button>
            <button
              onClick={() => setModal2Open(true)}
              className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <motion.div
            {...fadeUp(0)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            <MyServiceImageCarousel images={service.images} />
          </motion.div>

          {/* Description */}
          <motion.div
            {...fadeUp(0.05)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              About this service
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm italic border-l-2 border-gray-200 pl-4">
              "{service.description}"
            </p>
          </motion.div>

          {/* Details */}
          <motion.div
            {...fadeUp(0.1)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Details
            </h2>

            <div className="space-y-4">
              {/* Experience */}
              <div className="flex items-start justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-400 font-medium">
                  Experience
                </span>
                <span className="text-sm text-gray-700 font-semibold">
                  {service.experience}{" "}
                  {service.experience === 1 ? "year" : "years"}
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-start justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-400 font-medium">
                  Pricing
                </span>
                <span className="text-sm font-bold text-gray-900">
                  ₹{service.priceRange.minimum} – ₹{service.priceRange.maximum}
                </span>
              </div>

              {/* Skills */}
              <div className="py-3 border-b border-gray-50">
                <span className="text-sm text-gray-400 font-medium block mb-2">
                  Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {service.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="py-3">
                <span className="text-sm text-gray-400 font-medium block mb-2">
                  Availability
                </span>
                <div className="space-y-1.5">
                  {service.availability.map((avl, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium w-24">
                        {avl.day}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                        {avl.startTime} – {avl.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            {...fadeUp(0.15)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            <ReviewsMain
              serviceId={serviceId}
              averageRating={service.averageRating}
            />
          </motion.div>
        </div>

        {/* Right — 1/3 width */}
        <div className="space-y-4">
          {/* Boost */}
          <motion.div {...fadeUp(0.05)}>
            <BoostCard service={service} onBoostUpdate={fetchService} />
          </motion.div>

          {/* Location */}
          <motion.div
            {...fadeUp(0.1)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-50">
              <MapPin size={15} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 m-0">
                Location
              </h3>
            </div>
            <iframe
              width="100%"
              height="220"
              style={{ border: 0, display: "block" }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${service.location.coordinates[1]},${service.location.coordinates[0]}&z=15&output=embed`}
              allowFullScreen
            />
          </motion.div>

          {/* Quick stats */}
          <motion.div
            {...fadeUp(0.15)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Eye size={12} /> Total Views
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {service.views || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Star size={12} /> Avg Rating
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {service.averageRating?.toFixed(1) || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Star size={12} /> Reviews
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {service.ratingCount || 0}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        centered
        open={modal2Open}
        onOk={handleDelete}
        onCancel={() => setModal2Open(false)}
        okButtonProps={{ loading: isServiceDeleting, danger: true }}
        okText="Delete"
        title="Delete Service"
        width={400}
      >
        <div className="py-4 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-gray-600 mb-1">
            Are you sure you want to remove{" "}
            <strong>{service.serviceName}</strong>?
          </p>
          <p className="text-red-500 text-sm">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default MyServiceDetails;
