import React from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Star,
  MessageSquare,
  Zap,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value ?? 0}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  </motion.div>
);

const DashboardStats = ({ s }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Overview
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          icon={<Eye size={20} className="text-white" />}
          label="Total Views"
          value={s.totalViews}
          color="bg-blue-500"
          delay={0.05}
        />
        <StatCard
          icon={<Star size={20} className="text-white" />}
          label="Avg Rating"
          value={s.averageRating}
          color="bg-yellow-400"
          delay={0.1}
        />
        <StatCard
          icon={<MessageSquare size={20} className="text-white" />}
          label="Conversations"
          value={s.totalConversations}
          color="bg-green-500"
          delay={0.15}
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-white" />}
          label="Total Reviews"
          value={s.totalReviews}
          color="bg-purple-500"
          delay={0.2}
        />
        <StatCard
          icon={<CheckCircle size={20} className="text-white" />}
          label="Active Listings"
          value={s.activeListings}
          color="bg-emerald-500"
          delay={0.25}
        />
        <StatCard
          icon={<Zap size={20} className="text-white" />}
          label="Boosted"
          value={s.boostedListings}
          color="bg-orange-400"
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
