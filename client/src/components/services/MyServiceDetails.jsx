import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteService, fetchServiceById } from "../../services/service";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import MyServiceImageCarousel from "./MyServiceImageCarousel";
import { formatDistanceToNow } from "date-fns";
import { Delete, Edit } from "lucide-react";
import { DeleteFilled } from "@ant-design/icons";
import { Button, Divider, message, Modal } from "antd";
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
    <LoadBalls />
  ) : (
    <div className="p-3">
      <div className="flex flex-col md:flex-row gap-2 w-full ">
        {/* Image Carousel */}
        <div className=" w-full lg:w-3/4 ">
          <div className="bg-gray-200 shadow-md">
            <MyServiceImageCarousel images={service.images} />
          </div>
          {/* service details */}
          <div className="shadow-md p-2">
            <div className="">
              <p className="text-[25px]">Description</p>
              <p>"{service.description}"</p>
            </div>
            <Divider />
            <div>
              <p className="text-[25px]">Details</p>
              {/* Experience */}
              <div className="flex flex-col gap-3">
                {/* Experience */}
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    {/* Experience Row */}
                    <tr>
                      <td className="border border-gray-300 p-2 font-bold">
                        Experience{" "}
                        <span className="italic font-normal">(in years):</span>
                      </td>

                      <td className="border border-gray-300 p-2">
                        {service.experience}
                      </td>
                    </tr>

                    {/* Availability */}
                    <tr>
                      <td className="border border-gray-300 p-2 font-bold">
                        Availability
                      </td>
                      <td className="border border-gray-300 p-2">
                        {service.availability.map((avl, i) => (
                          <div className="flex gap-1" key={i}>
                            <p className="m-0 w-[100px]">{avl.day}</p>
                            <p className="m-0">{avl.startTime}</p>
                            <p className="m-0">to</p>
                            <p className="m-0">{avl.endTime}</p>
                          </div>
                        ))}
                      </td>
                    </tr>

                    {/* Skills */}
                    <tr>
                      <td className="border border-gray-300 p-2 font-bold">
                        Skills
                      </td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex gap-1 items-center flex-wrap">
                          {service.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="m-0 border shadow-md p-1 rounded bg-gray-100"
                            >
                              {skill}
                            </span>
                          ))}
                          <span className="m-0 border shadow-md p-1 rounded bg-gray-100">
                            test
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className=" lg:w-1/4">
          <div className="shadow-md p-2">
            <p className="text-[25px] m-0">{service.serviceName}</p>
            <p className="m-0">
              Rate: ₹{service.priceRange.minimum} - ₹
              {service.priceRange.maximum}
            </p>
            {/* Posted Time */}
            <p className="text-[13px] m-0">
              {service.createdAt
                ? formatDistanceToNow(new Date(service.createdAt), {
                    addSuffix: true,
                  })
                : "N/A"}
            </p>
          </div>
          <div className="shadow-md p-2 flex flex-row md:flex-col">
            <button
              type="button"
              className="text-black flex bg-white 
              border border-gray-300  hover:bg-gray-100 
              font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
              dark:bg-gray-800 dark:text-yellow-400 
              dark:border-gray-600 dark:hover:bg-gray-700 
              dark:hover:border-gray-600 dark:focus:ring-gray-700 
              hover:shadow-md"
              // onClick={() =>
              //   navigate(
              //     `/accounts/my-service-menu/my-services/details/edit-service/${service._id}`
              //   )
              // }
              onClick={() => navigate(`edit-service`)}
            >
              <Edit />
              Edit
            </button>

            <button
              type="button"
              className="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              onClick={() => setModal2Open(true)}
            >
              <DeleteFilled />
              Remove
            </button>
          </div>
          <div>
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
      {/* reviews */}
      <div className="mt-2">
        <ReviewsMain
          serviceId={serviceId}
          averageRating={service.averageRating}
        />
      </div>
      <Modal
        centered
        open={modal2Open}
        // onOk={() => setModal2Open(false)}
        onOk={handleDelete}
        onCancel={() => setModal2Open(false)}
        okButtonProps={{ loading: isServiceDeleting }}
      >
        <h4 className="text-center">Confirm Delete</h4>
        <p className="m-0">Are you sure you want to remove this service</p>
        <p>You cannot undo this process</p>
      </Modal>
    </div>
  );
};

export default MyServiceDetails;
