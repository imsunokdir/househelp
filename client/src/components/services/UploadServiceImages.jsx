import React, { useContext, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import imageCompression from "browser-image-compression";
import { uploadServiceImage, deleteServiceImage } from "../../services/service";
import { AuthContext } from "../../contexts/AuthProvider";

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
  // const [fileList, setFileList] = useState([]);
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

    // setFileList((prev) => {
    //   const exists = prev.some((item) => item.uid === uid);
    //   if (exists) return prev;
    //   return [
    //     ...prev,
    //     {
    //       uid,
    //       name: file.name,
    //       status: "uploading",
    //       percent: 0,
    //       thumbUrl: base64,
    //     },
    //   ];
    // });

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
        // console.log("base64", base64);
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
        // sessionStorage.setItem("previewImage", file.url || file.preview);

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
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
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
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={customRequest}
        onRemove={handleRemove}
        beforeUpload={() => true}
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

      <p className="m-0 p-0 italic text-[14px]">
        *You can upload up to 8 images in total.
      </p>
    </div>
  );
};

export default UploadServiceImages;
