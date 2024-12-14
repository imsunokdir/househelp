import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import "./pages.css";

const ImageCarousel = ({ service }) => {
  return (
    <div className="h-full">
      <h2>images</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        breakpoints={{
          //   300: { slidesPerView: 1, spaceBetween: 20 },

          550: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {service.images.map((image) => {
          return (
            <SwiperSlide key={image._id}>
              <img src={image.url} className="carousel-img" />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
