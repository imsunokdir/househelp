import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const PreviewImageModal = ({
  previewOpen,
  setPreviewOpen,
  service,
  selectedIndex,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is smaller than 'sm'

  return (
    <Dialog
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      fullScreen={isMobile} // Make the modal full screen on smaller screens
      maxWidth="lg"
    >
      <DialogContent
        className="bg-black p-0 relative flex justify-center items-center" // Flex for centering content
        sx={{ height: isMobile ? "100vh" : "auto" }} // Full height on mobile
      >
        {/* ❌ Close Button */}
        <IconButton
          onClick={() => setPreviewOpen(false)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "gray",
            zIndex: 10,
            width: 48,
            height: 48,
            backgroundColor: "#e5e7eb",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#d1d5db",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* ✅ Image Carousel */}
        <Swiper
          initialSlide={selectedIndex}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
        >
          {service.images.map((image) => (
            <SwiperSlide key={image._id}>
              <img
                src={image.url.replace(
                  "/upload/",
                  "/upload/f_auto,q_auto,w_1200/"
                )}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain" // Ensures the image stays contained
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewImageModal;
