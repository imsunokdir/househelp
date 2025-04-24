import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import "./pages.css";

const ImageCarousel = ({ service, onImageClick }) => {
  return (
    <div className="relative w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        navigation
        breakpoints={{
          550: { slidesPerView: 2, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
          1025: { slidesPerView: 4, spaceBetween: 40 },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {service.images.map((image, index) => (
          <SwiperSlide key={image._id}>
            <div
              className="w-full h-full bg-red-100 relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => onImageClick(index)}
            >
              <img
                src={image.url.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_800/"
                )}
                alt="Service"
                className="w-full h-full object-contain object-center transform transition-transform duration-300 hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
