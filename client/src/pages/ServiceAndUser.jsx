import {
  LoadingOutlined,
  SaveFilled,
  SaveOutlined,
  StarFilled,
} from "@ant-design/icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PersonPinCircle,
  PersonPinCircleOutlined,
  Save,
  SaveAlt,
  SaveAs,
  WhatsApp,
} from "@mui/icons-material";
import { Divider, Rate, Spin } from "antd";
import { Star } from "lucide-react";
import whatsapp from "../assets/whatsapp.png";

import React, { useContext, useEffect, useState } from "react";
import { checkSaveService, toggleSave } from "../services/service";
import { AuthContext } from "../contexts/AuthProvider";
import { Alert, Box, Snackbar } from "@mui/material";

const ServiceAndUser = ({
  service,
  handleClickOpen,
  handleGiveReview,
  noprofile,
}) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [isServiceSaved, setIsServiceSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { user } = useContext(AuthContext);
  const handleContactClick = () => {
    console.log("hello");
    const whatsappNum = service.createdBy?.whatsapp;
    console.log("whatsappnum:", whatsappNum);
    if (whatsappNum) {
      const whatsappUrl = `https://wa.me/${whatsappNum}`;
      window.open(whatsappUrl);
    }
  };
  const checkSavedServices = async () => {
    try {
      console.log("ser id", service._id);
      const res = await checkSaveService(service._id);
      if (res.status == 200) {
        console.log("**", res);
        setIsServiceSaved(res.data.isSaved);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setSaveLoading(false);
    }
  };
  useEffect(() => {
    if (user && service._id) {
      checkSavedServices();
    }
  }, [user, service._id]);

  useEffect(() => {
    console.log("Ser:", service);
  });

  const toggleSaveService = async () => {
    console.log("user logged???::", user);
    try {
      setSaveLoading(true);
      const res = await toggleSave(service._id);
      if (res.status === 200) {
        setIsServiceSaved(res.data.isSaved);
        setSnackbarMessage(
          res.data.isSaved
            ? "Service saved successfully!"
            : "Service removed successfully!"
        );
        setSnackbarOpen(true); // Open the Snackbar
      }
    } catch (error) {
      console.log("error");
    } finally {
      setSaveLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
      {/* First Column - First Row */}
      <div className=" flex flex-col h-[150px] items-center justify-center relative">
        <div className="bg-blue flex justify-center rounded-full bg-red-100 absolute">
          <img
            src={`${
              service.createdBy?.avatar
                ? service.createdBy.avatar.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_550/"
                  )
                : noprofile
            }`}
            style={{
              backgroundPosition: "center",
              //   borderRadius: "10px",
              height: "150px",
              width: "150px",
              objectFit: "cover",
            }}
            className="shadow-md rounded-full"
          />
        </div>
        <div className="bg-gray  h-full w-full"></div>
        <div className="bg-gray-200 shadow-md h-full w-full"></div>
      </div>
      {/* Second Column - Spanning Two Rows */}
      <div className="shadow-md row-span-2 flex flex-col gap-2 p-2 rounded">
        <div className="flex justify-between">
          <div>
            <h2 className="m-0">{service.serviceName}</h2>
          </div>
          {user && (
            <div className=" mx-3">
              <Spin
                indicator={<LoadingOutlined spin />}
                size="small"
                // tip="saving"
                spinning={saveLoading}
              >
                {/* <SaveOutlined
                style={{ fontSize: "24px" }}
                onClick={toggleSaveService}
              /> */}
                {user && isServiceSaved ? (
                  <div>
                    <SaveFilled
                      style={{ fontSize: "24px" }}
                      onClick={toggleSaveService}
                    />
                  </div>
                ) : (
                  <SaveOutlined
                    style={{ fontSize: "24px" }}
                    onClick={toggleSaveService}
                  />
                )}
              </Spin>
              {/* <LoadingOutlined /> */}
            </div>
          )}

          {/* <p className="italic m-0">(Electrician)</p> */}
        </div>
        <span className="flex">
          <p className="p-1">
            Service provided by{" "}
            {service.createdBy?.firstName
              ? `${service.createdBy.firstName} ${service.createdBy?.lastName}`
              : service.createdBy.username}
          </p>
        </span>
        <span className="flex items-center">
          <PersonPinCircleOutlined />
          <p className="m-0  rounded w-64">South ex1 block-e</p>
        </span>
        <div className="flex gap-1">
          <div>
            <p>Skills</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {service.skills.map((skill, i) => (
              <span key={i} className="border shadow-sm p-[2px] rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* First Column - Second Row */}
      <div className=" h-32 flex p-2 shadow-md justify-between">
        <div>
          <p>Contact me at</p>
          <div onClick={handleContactClick} className="cursor-pointer">
            <img src={whatsapp} />
          </div>
        </div>
        <div className="flex flex-col">
          {/* <Rate disabled value={service.averageRating} allowHalf /> */}

          <div className="flex gap-3 items-end">
            <p className="text-[20px] m-0 flex items-center">
              {service.averageRating.toFixed(1)}
              <StarFilled />
            </p>

            {service.ratingCount === 0 ? (
              <p className="m-0">No ratings</p>
            ) : (
              <p
                className="text-[14px] underline cursor-pointer m-0"
                onClick={handleClickOpen}
              >
                {service.ratingCount} Reviews
              </p>
            )}
          </div>

          <button
            className=" rounded p-1 mt-3 shadow-md"
            onClick={handleGiveReview}
          >
            Write a review
          </button>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      ></Snackbar>
    </div>
  );
};

export default ServiceAndUser;
