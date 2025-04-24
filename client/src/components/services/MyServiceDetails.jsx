import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteService, fetchServiceById } from "../../services/service";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import MyServiceImageCarousel from "./MyServiceImageCarousel";
import { formatDistanceToNow } from "date-fns";
import { Delete, Edit, MapPin } from "lucide-react";
import { DeleteFilled } from "@ant-design/icons";
import { Button, Divider, message, Modal, Tag } from "antd";
import { content } from "flowbite-react/tailwind";
import ReviewsMain from "../review/ReviewsMain";

const MyServiceDetails = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
  const [serviceLoading, setServiceLoading] = useState(true);
  const [isServiceDeleting, setisServiceDeleting] = useState(false);
  const navigate = useNavigate();

  //modal
  const [modal2Open, setModal2Open] = useState(false);

  // Fetch service details by ID
  const fetchService = async () => {
    try {
      const response = await fetchServiceById(serviceId);
      if (response.status === 200) {
        setService(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching service:", error);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);
  useEffect(() => {
    console.log("Service:", service);
  }, [service]);

  const handleDelete = async () => {
    setisServiceDeleting(true);
    try {
      const response = await deleteService(serviceId);
      if (response.status === 200) {
        setModal2Open(false);
        setisServiceDeleting(false);
        navigate("/accounts/my-service-menu/my-services", { replace: true });
      }
    } catch (error) {
      setisServiceDeleting(false);
      message.error;
    }
  };

  return serviceLoading ? (
    <div className="flex justify-center items-center min-h-screen">
      <LoadBalls />
    </div>
  ) : (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Left Column - Image Carousel and Details */}
        <div className="w-full lg:w-3/4">
          {/* Image Carousel */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-6">
            <MyServiceImageCarousel images={service.images} />
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Description
            </h2>
            <p className="text-gray-600 italic leading-relaxed">
              "{service.description}"
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Details
            </h2>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full border-collapse">
                <tbody>
                  {/* Experience Row */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium text-gray-700 w-1/3">
                      Experience{" "}
                      <span className="italic font-normal text-sm">
                        (in years)
                      </span>
                    </td>
                    <td className="p-4 text-gray-800">{service.experience}</td>
                  </tr>

                  {/* Availability Row */}
                  <tr>
                    <td className="p-4 font-medium text-gray-700 w-1/3 border-t border-gray-200">
                      Availability
                    </td>
                    <td className="p-4 text-gray-800 border-t border-gray-200">
                      {service.availability.map((avl, i) => (
                        <div
                          className="flex flex-wrap items-center gap-2 mb-2"
                          key={i}
                        >
                          <span className="font-medium text-gray-800 min-w-[100px]">
                            {avl.day}:
                          </span>
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                            {avl.startTime} to {avl.endTime}
                          </span>
                        </div>
                      ))}
                    </td>
                  </tr>

                  {/* Skills Row */}
                  <tr className="bg-gray-50">
                    <td className="p-4 font-medium text-gray-700 w-1/3 border-t border-gray-200">
                      Skills
                    </td>
                    <td className="p-4 border-t border-gray-200">
                      <div className="flex gap-2 items-center flex-wrap">
                        {service.skills.map((skill, i) => (
                          <Tag
                            key={i}
                            className="px-3 py-1 text-sm"
                            color="blue"
                          >
                            {skill}
                          </Tag>
                        ))}
                        <Tag className="px-3 py-1 text-sm" color="blue">
                          test
                        </Tag>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Service Info and Actions */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          {/* Service Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {service.serviceName}
            </h1>

            <div className="p-3 bg-blue-50 rounded-lg mb-3">
              <p className="text-lg font-medium text-gray-700 mb-1">Pricing</p>
              <p className="text-xl font-semibold text-blue-700">
                ₹{service.priceRange.minimum} - ₹{service.priceRange.maximum}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              Posted{" "}
              {service.createdAt
                ? formatDistanceToNow(new Date(service.createdAt), {
                    addSuffix: true,
                  })
                : "N/A"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              type="button"
              className="w-full mb-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-3 transition-colors"
              onClick={() => navigate(`edit-service`)}
            >
              <Edit size={18} />
              Edit Service
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-600 font-medium rounded-lg px-5 py-3 transition-colors"
              onClick={() => setModal2Open(true)}
            >
              <DeleteFilled />
              Remove Service
            </button>
          </div>

          {/* Map Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-gray-700" />
              <h3 className="text-lg font-medium text-gray-800 m-0">
                Location
              </h3>
            </div>
            <div className="rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="250"
                style={{ border: 0 }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${service.location.coordinates[1]}, ${service.location.coordinates[0]}&z=15&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
        <ReviewsMain
          serviceId={serviceId}
          averageRating={service.averageRating}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        centered
        open={modal2Open}
        onOk={handleDelete}
        onCancel={() => setModal2Open(false)}
        okButtonProps={{
          loading: isServiceDeleting,
          danger: true,
        }}
        okText="Delete"
        title="Confirm Deletion"
        width={400}
      >
        <div className="py-4 text-center">
          <DeleteFilled className="text-red-500 text-4xl mb-3" />
          <h4 className="text-lg font-medium mb-3">Delete Service</h4>
          <p className="text-gray-600 mb-1">
            Are you sure you want to remove this service?
          </p>
          <p className="text-red-500 text-sm">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};

export default MyServiceDetails;
