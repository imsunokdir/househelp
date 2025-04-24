import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import imageCompression from "browser-image-compression";
import { uploadServiceImage, deleteServiceImage } from "../../services/service";
import { AuthContext } from "../../contexts/AuthProvider";
import { ImageIcon, Upload as UploadIcon, XCircle } from "lucide-react";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadServiceImages = ({
  formData,
  setFormData,
  fileList,
  setFileList,
  useTempImageCleanup,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { user } = useContext(AuthContext);
  const hasUnloaded = useRef(false);

  // Delete temporary images on unload (refresh or close)
  useTempImageCleanup(fileList);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const base64 = await getBase64(file);
    const uid = file.uid;

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: "image/webp",
    };

    try {
      const compressedWebP = await imageCompression(file, options);
      const formDataToSend = new FormData();
      formDataToSend.append("image", compressedWebP);
      formDataToSend.append("uploadedBy", user.userId);
      const res = await uploadServiceImage(formDataToSend, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded / event.total) * 100);
          setFileList((prev) =>
            prev.map((item) =>
              item.uid === uid
                ? { ...item, percent, status: "uploading" }
                : item
            )
          );
          onProgress({ percent });
        },
      });

      if (res.status === 200) {
        const { secure_url, public_id } = res.data;

        // Save image to formData
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), { url: secure_url, public_id }],
        }));

        // Mark image as done
        setFileList((prev) =>
          prev.map((item) =>
            item.uid === uid
              ? {
                  ...item,
                  status: "done",
                  url: secure_url,
                  response: res.data,
                  thumbUrl: base64,
                }
              : item
          )
        );

        onSuccess(res.data);
      }
    } catch (error) {
      onError(error);
      message.error("Upload failed");
    }
  };

  const handleRemove = async (file) => {
    try {
      if (file.response && file.response.public_id) {
        const public_id = file.response.public_id;
        const res = await deleteServiceImage(public_id);
        if (res.status === 200) {
          setFormData((prev) => ({
            ...prev,
            images: (prev.images || []).filter(
              (img) => img.public_id !== public_id
            ),
          }));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center h-full p-2 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-200">
      <div className="flex flex-col items-center text-blue-600">
        <UploadIcon className="h-5 w-5 mb-1" />
        <span className="text-sm">Upload</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
        <div className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
          <label className="text-sm font-medium text-gray-800">
            Service Images
          </label>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          {fileList.length}/8 uploaded
        </span>
      </div>

      <div className="mb-4">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          customRequest={customRequest}
          onRemove={handleRemove}
          beforeUpload={() => true}
          className="service-image-upload"
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>

        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>

      <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-md text-gray-600">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-xs">
          <p className="m-0 p-0">
            You can upload up to 8 images in total. Images will be compressed
            for optimal loading speed.
          </p>
          <p className="m-0 mt-1 p-0 text-blue-600">
            Recommended: Upload high-quality images with good lighting to
            showcase your service.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .service-image-upload .ant-upload-list-item {
          border-radius: 8px !important;
          overflow: hidden !important;
          border: 1px solid #e5e7eb !important;
        }

        .service-image-upload .ant-upload-list-item-thumbnail {
          border-radius: 6px !important;
          overflow: hidden !important;
        }

        .service-image-upload .ant-upload-select {
          border-radius: 8px !important;
          overflow: hidden !important;
          border: none !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default UploadServiceImages;
