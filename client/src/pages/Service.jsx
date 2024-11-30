import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchServiceById } from "../services/service";
import UserDetails from "../components/UserDetails";
import { Rate } from "antd";
import Reviews from "../components/services/Reviews";
import { getAvgRating, getReviewCount } from "../services/reviews";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useMediaQuery, useTheme } from "@mui/material";
import Test from "../Test";
import ReviewDialog from "../components/review/ReviewDialog";
import { getRatingDistribution } from "../services/review";

const boxShadowStyle = {
  boxShadow: "-8px 6px 10px rgba(0, 0, 0, 0.2)", // Left and bottom shadow
};

const Service = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
  const [showMore, setShowMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(null);
  const [rateDist, setRateDist] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  //modal states
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const loadRatingDistribution = async () => {
    try {
      const response = await getRatingDistribution(serviceId);

      if (response.status === 200) {
        setRateDist(response.data);
      }
    } catch (error) {
      console.log("dist err:", error);
    }
  };
  // const getAverageRating = async () => {
  //   try {
  //     const response = await getAvgRating(serviceId);
  //     if (response.status === 200) {
  //       setAverageRating(Number(response.data.averageRating));
  //       setTotalReviews(response.data.totalReviews);
  //       console.log("avg rating", averageRating);
  //     }
  //     console.log("avg:", response);
  //   } catch (error) {
  //     console.log("avg err:", error);
  //   }
  // };
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetchServiceById(serviceId);
        if (response.status === 200) {
          setService(response.data.data);
          // console.log("Service:", service);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchService();
    // loadTotalReviews();
    loadRatingDistribution();
    // getAverageRating();
  }, []);
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handleGiveReview = () => {
    navigate(`/write-review/${serviceId}`);
  };

  return (
    service && (
      <div className="bg-white flex flex-col">
        <div className="mx-4 mt-2  bg-white rounded p-2" style={boxShadowStyle}>
          <div className=" h-1/2 p-2 rounded flex ">
            <div
              className="bg-blue-200 w-1/3"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?cs=srgb&dl=pexels-freestockpro-1172207.jpg&fm=jpg')",
                backgroundPosition: "center", // Ensure the image is centered
                backgroundSize: "cover",
              }}
            ></div>
            <div className="bg-[#B1B8B6] w-2/3 text-[#0C110F]">
              <div className="p-2">
                <div>
                  <h2 className="m-0">{service.serviceName}</h2>
                  <p className="italic m-0">(Electrician)</p>
                </div>

                <span className="flex justify-between ">
                  <p className="p-1">Name</p>
                  <p className="p-1 bg-white rounded w-64">
                    {service.createdBy?.firstName || ""}{" "}
                    {service.createdBy?.lastName || ""}
                  </p>
                </span>
                <span className="flex justify-between ">
                  <p className="p-1">Location</p>
                  <p className="p-1 bg-white rounded w-64">South ex1 block-e</p>
                </span>
                <div>
                  skills:{" "}
                  {service.skills.map((skill, i) => (
                    <span key={i}>{skill},</span>
                  ))}
                </div>
                <div className="flex flex-col items-end">
                  <Rate disabled value={service.averageRating} allowHalf />

                  {service.ratingCount === 0 ? (
                    <p>No ratings</p>
                  ) : (
                    <p
                      className="text-[14px] underline cursor-pointer"
                      onClick={handleClickOpen}
                    >
                      {service.ratingCount} Reviews
                    </p>
                  )}
                  <button
                    className="bg-white rounded p-1"
                    onClick={handleGiveReview}
                  >
                    Write a review
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-green-100 h-1/2 p-2 rounded">
            <h2>About my work</h2>
          </div>
        </div>
        <div className="w-full h-48 bg-white mt-2 p-2">
          Similar service provider
        </div>
        {/* <div className="w-full mt-2 p-[20px]">
          <h2>Reviews</h2>
          <Reviews serviceId={serviceId} />
        </div> */}
        <ReviewDialog
          handleClose={handleClose}
          open={open}
          rateDist={rateDist}
          serviceId={serviceId}
          totalReviews={totalReviews}
        />
      </div>
    )
  );
};

export default Service;
