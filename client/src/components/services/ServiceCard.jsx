import carpenter from "../../assets/carpenter.jpg";
import { Fade } from "@mui/material";
import { useState, useEffect } from "react";
import SkeletonCard2 from "../LoadingSkeleton/SkeletonCards2";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Zap } from "lucide-react";

const ServiceCard = ({ service, index, delay }) => {
  const [visible, setVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * delay);
    return () => clearTimeout(timer);
  }, [index, delay]);

  useEffect(() => {
    if (visible && imageLoaded) setShowContent(true);
  }, [visible, imageLoaded]);

  const handleClick = () => {
    console.log("window.scrollY.toString():", window.scrollY.toString());
    navigate(`/show-service-details/${service._id}`);
  };

  const imageSrc =
    imageError || !service.images?.length
      ? carpenter
      : service.images[0].url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_720/",
        );

  const renderActualContent = () => (
    <Fade in={showContent} timeout={500}>
      <div className="flex flex-col h-full">
        {/* Image */}
        <div className="relative h-44 overflow-hidden rounded-xl flex-shrink-0">
          <img
            src={imageSrc}
            alt={service.serviceName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {/* Boost badge */}
          {service.isBoosted && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <Zap size={9} /> Top
            </div>
          )}
          {/* Rating pill */}
          {service.averageRating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              {service.averageRating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 pt-2.5 px-0.5">
          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
            {service.serviceName}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-xs leading-snug mt-1 line-clamp-2">
            {service.description.slice(0, 55)}...
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-sm font-bold text-gray-900">
              ₹{service.priceRange.minimum}
              <span className="text-gray-400 font-normal text-xs">
                {" "}
                – ₹{service.priceRange.maximum}
              </span>
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />
              {service.distanceInKm.toFixed(1)} km
            </span>
          </div>
        </div>
      </div>
    </Fade>
  );

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-xl"
    >
      {!showContent ? (
        <SkeletonCard2 index={index} delay={delay} />
      ) : (
        renderActualContent()
      )}

      {/* Preload image invisibly */}
      <img
        src={imageSrc}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{ display: "none" }}
        alt=""
      />
    </div>
  );
};

export default ServiceCard;
