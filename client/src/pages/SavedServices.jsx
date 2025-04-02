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
    <div>
      <h3>Saved Services</h3>
      <div>
        {savedServices.length > 0 ? (
          <motion.div className="flex flex-wrap gap-4 justify-start">
            <AnimatePresence>
              {savedServices.map((service) => (
                <motion.div
                  key={service._id}
                  className="w-[200px]"
                  layout //This enables smooth reordering animations.
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
          <div>No saved services.</div>
        )}
      </div>
    </div>
  );
};

export default SavedServices;
