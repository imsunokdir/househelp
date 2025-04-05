import React, { useEffect, useState } from "react";
import { fetchSavedServices } from "../services/service";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import SavedServiceCard from "../components/services/SavedServiceCard";
import { motion, AnimatePresence } from "framer-motion";

const SavedServices = () => {
  const [savedServices, setSavedServices] = useState([]);
  const [isSavedServicesLoading, setSavedServicesLoading] = useState(false);

  useEffect(() => {
    const getSavedServices = async () => {
      try {
        setSavedServicesLoading(true);
        const response = await fetchSavedServices();

        if (response.status === 200) {
          setSavedServices(response.data.savedServices);
        }
      } catch (error) {
        console.log("There was an error");
      } finally {
        setSavedServicesLoading(false);
      }
    };
    getSavedServices();
  }, []);

  const handleRemoveService = (serviceId) => {
    setSavedServices((prev) => prev.filter((serv) => serv._id !== serviceId));
  };

  return isSavedServicesLoading ? (
    <LoadBalls />
  ) : (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Saved Services</h3>
      <div className="p-3">
        {savedServices.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 place-items-center"
          >
            <AnimatePresence>
              {savedServices.map((service) => (
                <motion.div
                  key={service._id}
                  className="w-full max-w-xs"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <SavedServiceCard
                    service={service}
                    handleRemoveService={handleRemoveService}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center text-gray-500">No saved services.</div>
        )}
      </div>
    </div>
  );
};

export default SavedServices;
