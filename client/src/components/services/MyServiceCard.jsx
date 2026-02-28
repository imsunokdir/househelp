import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Star, Zap, Clock, Edit, ChevronRight } from "lucide-react";
import numeral from "numeral";
import noimg from "../../assets/no-img.jpg";
import { formatDistanceToNow } from "date-fns";

const statusConfig = {
  Active: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  Pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    dot: "bg-yellow-500",
  },
  Inactive: { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
};

const MyServiceCard = ({ service, index }) => {
  const navigate = useNavigate();
  const status = statusConfig[service.status] || statusConfig.Inactive;

  const daysUntilExpiry = service.expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(service.expiresAt) - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  const expiryColor =
    daysUntilExpiry === null
      ? ""
      : daysUntilExpiry <= 0
        ? "text-red-500"
        : daysUntilExpiry <= 3
          ? "text-orange-500"
          : "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div
        className="flex gap-0 cursor-pointer"
        onClick={() => navigate(`${service._id}`)}
      >
        {/* Image */}
        <div className="w-28 sm:w-36 flex-shrink-0">
          <img
            src={service.images?.length > 0 ? service.images[0]?.url : noimg}
            alt={service.serviceName}
            className="w-full h-full object-cover"
            style={{ minHeight: "110px", maxHeight: "130px" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {service.serviceName}
                </h3>
                {service.isBoosted && (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-orange-50 text-orange-500 border border-orange-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    <Zap size={9} /> Boosted
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`}
                />
                <span className={`text-xs font-medium ${status.text}`}>
                  {service.status}
                </span>
              </div>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 flex-shrink-0 mt-0.5"
            />
          </div>

          {/* Description */}
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
            {service.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye size={11} />
              {numeral(service.views).format("0.[0]a")}
            </span>
            <span className="flex items-center gap-1">
              <Star
                size={11}
                className={
                  service.averageRating > 0
                    ? "text-yellow-400 fill-yellow-400"
                    : ""
                }
              />
              {service.averageRating > 0
                ? service.averageRating.toFixed(1)
                : "—"}
            </span>
            <span>{service.ratingCount} reviews</span>
            {daysUntilExpiry !== null && (
              <span
                className={`flex items-center gap-1 ml-auto ${expiryColor}`}
              >
                <Clock size={11} />
                {daysUntilExpiry <= 0 ? "Expired" : `${daysUntilExpiry}d left`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-gray-50 px-4 py-2.5 flex items-center justify-between bg-gray-50/50">
        <span className="text-xs text-gray-400">
          ₹{service.priceRange?.minimum} – ₹{service.priceRange?.maximum}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `/accounts/my-service-menu/my-services/details/edit-service/${service._id}`,
              { replace: true },
            );
          }}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <Edit size={12} />
          Edit
        </button>
      </div>
    </motion.div>
  );
};

export default MyServiceCard;
