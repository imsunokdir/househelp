import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Clock, CheckCircle, X } from "lucide-react";
import { message, Modal } from "antd";
import { boostService, cancelBoost } from "../../services/boost";

const PLANS = [
  {
    id: "7days",
    label: "7 Days",
    price: "₹99",
    description: "Great for a quick push",
    days: 7,
  },
  {
    id: "15days",
    label: "15 Days",
    price: "₹179",
    description: "Most popular",
    days: 15,
    popular: true,
  },
  {
    id: "30days",
    label: "30 Days",
    price: "₹299",
    description: "Best value",
    days: 30,
  },
];

const BoostCard = ({ service, onBoostUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlans, setShowPlans] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const isBoosted = service?.isBoosted;
  const boostExpiresAt = service?.boostExpiresAt;

  const daysRemaining = boostExpiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(boostExpiresAt) - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const handleBoost = async () => {
    if (!selectedPlan) {
      message.warning("Please select a plan first");
      return;
    }
    setLoading(true);
    try {
      await boostService(service._id, selectedPlan);
      message.success("Service boosted successfully!");
      setShowPlans(false);
      setSelectedPlan(null);
      onBoostUpdate?.();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to boost service");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelBoost(service._id);
      message.success("Boost cancelled");
      setCancelModalOpen(false);
      onBoostUpdate?.();
    } catch (error) {
      message.error("Failed to cancel boost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Zap size={20} className="text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-800 m-0">
          Boost Service
        </h3>
      </div>

      {isBoosted ? (
        // ── Active boost ────────────────────────────────────────────────
        <div>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
            <CheckCircle size={18} className="text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-orange-700">
                Boost Active
              </p>
              <p className="text-xs text-orange-500 flex items-center gap-1 mt-0.5">
                <Clock size={11} />
                {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-3">
            Your service is appearing at the top of search results.
          </p>

          <button
            onClick={() => setCancelModalOpen(true)}
            className="w-full text-sm text-red-500 border border-red-200 hover:bg-red-50 py-2 rounded-lg transition-colors"
          >
            Cancel Boost
          </button>
        </div>
      ) : (
        // ── No active boost ──────────────────────────────────────────────
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Boost your service to appear at the top of search results and get
            more customers.
          </p>

          <AnimatePresence>
            {showPlans && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-2 overflow-hidden"
              >
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all
                      ${
                        selectedPlan === plan.id
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-100 hover:border-orange-200"
                      }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {plan.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-orange-500">
                        {plan.price}
                      </p>
                    </div>
                    {selectedPlan === plan.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-3 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle size={10} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {showPlans ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPlans(false);
                  setSelectedPlan(null);
                }}
                className="flex-1 py-2.5 text-sm border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBoost}
                disabled={!selectedPlan || loading}
                className="flex-1 py-2.5 text-sm bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={14} />
                    Boost Now
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPlans(true)}
              className="w-full py-2.5 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              Boost this Service
            </button>
          )}
        </div>
      )}

      {/* Cancel boost confirmation */}
      <Modal
        centered
        open={cancelModalOpen}
        onOk={handleCancel}
        onCancel={() => setCancelModalOpen(false)}
        okButtonProps={{ loading, danger: true }}
        okText="Cancel Boost"
        title="Cancel Boost"
        width={360}
      >
        <p className="text-gray-600 py-4">
          Are you sure you want to cancel your boost? Your service will no
          longer appear at the top of results.
        </p>
      </Modal>
    </div>
  );
};

export default BoostCard;
