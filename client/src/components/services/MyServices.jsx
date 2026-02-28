import React, { useEffect, useState } from "react";
import { getMyServices } from "../../services/service";
import { useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Layers } from "lucide-react";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import MyServiceCard from "./MyServiceCard";

const MyServices = () => {
  const [myServices, setMyServices] = useState(null);
  const [isServiceLoading, setServiceLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setServiceLoading(true);
    const fetchMyServices = async () => {
      try {
        const response = await getMyServices();
        if (response.status === 200) setMyServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setServiceLoading(false);
      }
    };
    fetchMyServices();
  }, []);

  if (isServiceLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <LoadBalls />
      </div>
    );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">My Services</h2>
          {myServices?.length > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">
              {myServices.length}{" "}
              {myServices.length === 1 ? "listing" : "listings"}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/accounts/add-service-form")}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* List */}
      {myServices && myServices.length > 0 ? (
        <div className="space-y-3">
          {myServices.map((service, i) => (
            <MyServiceCard service={service} key={service._id} index={i} />
          ))}
        </div>
      ) : (
        // Empty state
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center"
        >
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layers size={24} className="text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            No services yet
          </h3>
          <p className="text-sm text-gray-400 mb-5">
            Start offering your skills to people nearby
          </p>
          <button
            onClick={() => navigate("/accounts/add-service-form")}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Post your first service
          </button>
        </motion.div>
      )}

      <Outlet />
    </div>
  );
};

export default MyServices;
