import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const DashboardActivity = ({ activity }) => {
  if (!activity || activity.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Recent Reviews
      </h3>
      <div className="space-y-3">
        {activity.slice(0, 5).map((review, i) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  review.user?.username?.[0]?.toUpperCase() || "?"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {review.user?.username}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {new Array(5).fill(null).map((_, j) => (
                      <Star
                        key={j}
                        size={11}
                        className={
                          j < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200 fill-gray-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {review.service?.serviceName}
                </p>
                {review.comment && (
                  <p className="text-sm text-gray-600 mt-1 leading-snug">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardActivity;
