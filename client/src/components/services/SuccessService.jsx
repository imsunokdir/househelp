import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToTop from "../../utils/ScrollToTop";

const SuccessService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const handleViewService = () => {
    navigate(`/show-service-details/${serviceId}`);
  };

  const handleEditService = () => {
    navigate(`/edit-service/${serviceId}`);
  };

  return (
    <>
      <ScrollToTop />
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50 py-10">
        <div className="bg-white w-full max-w-md shadow-xl rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-green-700 text-center mb-2">
            Service Created Successfully!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Your service has been successfully added.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleViewService}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              View Service
            </button>
            <button
              onClick={handleEditService}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              Edit Service
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessService;
