import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { faL } from "@fortawesome/free-solid-svg-icons";
import imageCompression from "browser-image-compression";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UploadServiceImages = (params) => {
  const { fileList, setFileList } = params;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // const handleChange = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  // };

  const handleChange = async ({ fileList: newFileList }) => {
    const compressedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj) {
          const options = {
            maxSizeMB: 0.25, // Specify max size in MB
            maxWidthOrHeight: 1920, // Resize image to a maximum width or height
            useWebWorker: true, // Use web worker for performance
          };
          const compressedFile = await imageCompression(
            file.originFileObj,
            options
          );
          return {
            ...file,
            originFileObj: compressedFile, // Use the compressed file for upload
          };
        }
        return file;
      })
    );
    setFileList(compressedFileList);
  };

  useEffect(() => {
    console.log("File list:", fileList);
  }, [fileList]);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700"
      >
        Images
      </label>
      <div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
        <p className="m-0 p-0 italic text-[14px]">
          *You can upload upto 8 images in total
        </p>
      </div>
    </div>
  );
};

export default UploadServiceImages;
