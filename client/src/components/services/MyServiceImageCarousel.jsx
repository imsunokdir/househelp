import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const MyServiceImageCarousel = ({ images }) => {
  return (
    <div className="w-full max-w-[500px] mx-auto ">
      {images.length > 0 ? (
        <Swiper
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper w-full h-[300px] max-h-[400px]"
        >
          {images.map((image) => {
            return (
              <SwiperSlide
                key={image._id}
                className="flex justify-center items-center"
              >
                <img
                  src={image.url}
                  alt="carousel item"
                  className="w-full h-full object-contain rounded-lg"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <p className="text-center">No images available</p>
      )}
    </div>
  );
};

export default MyServiceImageCarousel;
