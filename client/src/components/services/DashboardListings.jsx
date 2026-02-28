import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Star,
  MessageSquare,
  Zap,
  Clock,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const getExpiryColor = (days) => {
  if (days <= 0) return "text-red-500";
  if (days <= 3) return "text-orange-500";
  return "text-green-500";
};

const DashboardListings = ({ services }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          My Listings
        </h3>
        <button
          onClick={() => navigate("/accounts/my-service-menu/my-services")}
          className="text-xs text-blue-500 flex items-center gap-1 hover:underline"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
          <p className="text-sm">No services posted yet.</p>
          <button
            onClick={() => navigate("/add-service")}
            className="mt-3 text-sm text-blue-500 font-medium hover:underline"
          >
            Post your first service →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() =>
                navigate(`/accounts/my-service-menu/my-services/${service._id}`)
              }
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {service.serviceName}
                    </p>
                    {service.isBoosted && (
                      <span className="flex items-center gap-1 bg-orange-50 text-orange-500 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-orange-200">
                        <Zap size={10} /> Boosted
                      </span>
                    )}
                    {service.isExpired && (
                      <span className="bg-red-50 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-200">
                        Expired
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {service.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={11} /> {service.averageRating || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={11} /> {service.ratingCount || 0}{" "}
                      reviews
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {!service.isExpired ? (
                    <div
                      className={`text-xs font-semibold ${getExpiryColor(service.daysUntilExpiry)}`}
                    >
                      <Clock size={11} className="inline mr-1" />
                      {service.daysUntilExpiry}d left
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/accounts/my-service-menu/my-services/${service._id}`,
                        );
                      }}
                      className="flex items-center gap-1 text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <RotateCcw size={11} /> Renew
                    </button>
                  )}
                  {service.isBoosted && service.boostDaysRemaining > 0 && (
                    <p className="text-[10px] text-orange-400 mt-1">
                      Boost: {service.boostDaysRemaining}d left
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardListings;
