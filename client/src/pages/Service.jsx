import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchServiceById, updateServiceViews } from "../services/service";
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
import ImageCarousel from "./ImageCarousel";
import noprofile from "../../src/assets/noprofile.jpg";
import ServiceAndUser from "./ServiceAndUser";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import { AuthContext } from "../contexts/AuthProvider";

const boxShadowStyle = {
  boxShadow: "-8px 6px 10px rgba(0, 0, 0, 0.2)", // Left and bottom shadow
};

const Service = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState();
  const [showMore, setShowMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [rateDist, setRateDist] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuth } = useContext(AuthContext);

  //modal states
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      window.history.pushState({ modal: true }, ""); // Push state when modal opens

      const handlePopState = (event) => {
        if (open) {
          setOpen(false); // Close the modal
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [open]);

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
      } finally {
        setServiceLoading(false);
      }
    };
    fetchService();
    // loadTotalReviews();
    loadRatingDistribution();
    // getAverageRating();
  }, []);

  useEffect(() => {
    try {
      serviceId && updateServiceViews(serviceId);
    } catch (error) {
      console.error("there was an error in updating the service views");
    }
  }, [serviceId]);
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handleGiveReview = () => {
    navigate(`/write-review/${serviceId}`);
  };

  return serviceLoading ? (
    <LoadBalls />
  ) : (
    service && (
      <div className="bg-white flex flex-col">
        <div className="mx-1 md:mx-4 mt-2  bg-white rounded p-2">
          <ServiceAndUser
            service={service}
            handleClickOpen={handleClickOpen}
            handleGiveReview={handleGiveReview}
            noprofile={noprofile}
          />
          <div className=" h-1/2 p-2 rounded shadow-sm">
            <h2>About my work</h2>
            <p>"{service.description}"</p>
          </div>

          <div className="w-full mt-2 p-2 rounded shadow-md">
            <ImageCarousel service={service} />
          </div>
        </div>

        <ReviewDialog
          handleClose={handleClose}
          open={open}
          rateDist={rateDist}
          serviceId={serviceId}
          totalReviews={totalReviews}
          averageRating={service.averageRating.toFixed(1)}
        />
      </div>
    )
  );
};

export default Service;
