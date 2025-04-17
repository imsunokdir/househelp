import React, { useEffect } from "react";
import { replace, useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
    // Check if the service creation was successful
    const isServiceSuccess = sessionStorage.getItem("isServiceSuccess");

    // if (!isServiceSuccess) {
    //   sessionStorage.removeItem("isServiceSuccess");
    //   // Redirect to the accounts page if the service wasn't created or the user tried to visit the page directly
    //   navigate(-1);
    // }
    sessionStorage.removeItem("isServiceSuccess"); // Remove success flag after redirect

    const handlePopState = () => {
      // Go back 2 steps instead of 1
      navigate("/accounts/my-service-menu", { replace: true });
      // navigate(-3);
    };
    window.addEventListener("popstate", handlePopState);

    // Clean up and prevent going back to the success page
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

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
