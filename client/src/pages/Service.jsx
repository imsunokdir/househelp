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
import { DialogContent, useMediaQuery, useTheme } from "@mui/material";
import Test from "../Test";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ReviewDialog from "../components/review/ReviewDialog";
import { getRatingDistribution } from "../services/review";
import ImageCarousel from "./ImageCarousel";
import noprofile from "../../src/assets/noprofile.jpg";
import ServiceAndUser from "./ServiceAndUser";
import LoadBalls from "../components/LoadingSkeleton/LoadBalls";
import { AuthContext } from "../contexts/AuthProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import PreviewImageModal from "./PreviewImageModal";

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
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
  };
  const handleClosePreview = () => {
    setPreviewImage(null);
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

  useEffect(() => {
    if (previewOpen) {
      window.history.pushState({ previewModal: true }, ""); // Push state for preview modal

      const handlePopState = (event) => {
        if (previewOpen) {
          setPreviewOpen(false); // Close preview modal on back
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [previewOpen]);

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
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setServiceLoading(false);
      }
    };
    fetchService();
    loadRatingDistribution();
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
    <div className="flex justify-center items-center min-h-screen">
      <LoadBalls />
    </div>
  ) : (
    service && (
      <div className="sm:bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-white rounded-lg sm:shadow-md overflow-hidden mb-6">
            <ServiceAndUser
              service={service}
              handleClickOpen={handleClickOpen}
              handleGiveReview={handleGiveReview}
              noprofile={noprofile}
            />

            <div className="p-6 border-t border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                About my work
              </h2>
              <p className="text-gray-600 italic leading-relaxed bg-gray-50 p-4 rounded-lg">
                "{service.description}"
              </p>
            </div>
          </div>

          <div className=" sm:p-0 border-t border-gray-100">
            <ImageCarousel
              service={service}
              onImageClick={(index) => {
                setSelectedIndex(index);
                setPreviewOpen(true);
              }}
            />
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
        {/* Image Preview Modal */}
        <PreviewImageModal
          previewOpen={previewOpen}
          setPreviewOpen={setPreviewOpen}
          service={service}
          selectedIndex={selectedIndex}
        />
      </div>
    )
  );
};

export default Service;
