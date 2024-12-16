import {
  DeleteColumnOutlined,
  DeleteOutlined,
  DeleteTwoTone,
  UndoOutlined,
} from "@ant-design/icons";
import { DeleteForeverTwoTone } from "@mui/icons-material";
import { Fade } from "@mui/material";
import { Image } from "antd";
import { Undo2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

const CurrentServiceImages = (params) => {
  const {
    formData,
    currImages,
    setCurrImages,
    imagesToBeDeleted,
    setImagesToBeDeleted,
  } = params;

  const handleCheckboxChange = (image) => {
    const imageId = image._id;

    if (imagesToBeDeleted.some((img) => img._id === imageId)) {
      // Remove image from imagesToBeDeleted
      setImagesToBeDeleted(
        imagesToBeDeleted.filter((img) => img._id !== imageId)
      );
    } else {
      // Add image to imagesToBeDeleted
      setImagesToBeDeleted([
        ...imagesToBeDeleted,
        { _id: imageId, url: image.url },
      ]);
    }
  };

  useEffect(() => {
    console.log("Current Images:", currImages);
    console.log("Images to be Deleted:", imagesToBeDeleted);
  }, [imagesToBeDeleted]);

  return (
    <div className="space-y-2">
      <label
        htmlFor="serviceName"
        className="block text-sm font-medium text-gray-700"
      >
        Service images
      </label>
      <div className="flex gap-3 flex-wrap overflow-auto max-h-[400px]">
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          {currImages.map((image) => (
            <div
              key={image._id}
              className={`bg-gray-200 flex flex-col items-center shadow-md ${
                imagesToBeDeleted.some((img) => img._id === image._id) &&
                "p-[2px] border-red-500"
              }`}
            >
              <div
                className="relative w-[100px] h-[100px] group"
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "100px",
                  height: "100px",
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="absolute bottom-1 right-1 z-10"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "8px",
                    zIndex: 10,
                    borderRadius: "50%",
                  }}
                  onChange={() => handleCheckboxChange(image)}
                  checked={imagesToBeDeleted.some(
                    (img) => img._id === image._id
                  )}
                />

                {/* Image */}
                <Image
                  width={100}
                  height={100}
                  src={image.url}
                  style={{
                    objectFit: "cover",
                    opacity: imagesToBeDeleted.some(
                      (img) => img._id === image._id
                    )
                      ? 0.5
                      : 1,
                  }}
                  className="border shadow-md"
                />
              </div>
              <div
                className="bg-gray-100 w-full h-[28px] text-center cursor-pointer"
                onClick={() => handleCheckboxChange(image)}
              >
                <Fade in timeout={500}>
                  {imagesToBeDeleted.some((img) => img._id === image._id) ? (
                    <span className="flex bg-blue-200 justify-center items-center gap-1 h-full">
                      <p className="p-0 m-0">Undo</p>
                      <Undo2Icon size={18} className="mt-[1px]" />
                    </span>
                  ) : (
                    <span className="flex justify-center items-center h-full">
                      <p className="m-0">Delete</p>
                      <DeleteForeverTwoTone fontSize="small" />
                    </span>
                  )}
                </Fade>
              </div>
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};

export default CurrentServiceImages;
