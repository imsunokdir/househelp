import React from "react";
import { Fade } from "@mui/material";
import { Skeleton } from "antd";
import { motion } from "framer-motion";
import useDashboard from "../hooks/useDashboard";
import DashboardStats from "../components/services/DashboardStats";
import DashboardListings from "../components/services/DashboardListings";
import DashboardActivity from "../components/services/DashboardActivity";

const WorkerDashboard = () => {
  const { stats, activity, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton active paragraph={{ rows: 2 }} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {new Array(6).fill(null).map((_, i) => (
            <Skeleton.Button
              key={i}
              active
              style={{ width: "100%", height: 80 }}
            />
          ))}
        </div>
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>{error || "Failed to load dashboard. Try refreshing."}</p>
      </div>
    );
  }

  const { profile, stats: s, services } = stats;

  return (
    <Fade in timeout={500}>
      <div className="p-4 max-w-4xl mx-auto space-y-6 pb-10">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden flex-shrink-0">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              profile.username?.[0]?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {profile.firstName
                ? `${profile.firstName} ${profile.lastName}`
                : profile.username}
            </h2>
            <p className="text-sm text-gray-400">
              Member since{" "}
              {new Date(profile.memberSince).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </motion.div>

        <DashboardStats s={s} />
        <DashboardListings services={services} />
        <DashboardActivity activity={activity} />
      </div>
    </Fade>
  );
};

export default WorkerDashboard;
