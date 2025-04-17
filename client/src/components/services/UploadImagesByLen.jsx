import React, { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import { deleteServiceImage, uploadServiceImage } from "../../services/service";
import { AuthContext } from "../../contexts/AuthProvider";
import imageCompression from "browser-image-compression";

const UploadImagesByLen = (params) => {
  const { fileList, setFileList, avlSlots, setFormData } = params;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { user } = useContext(AuthContext);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    console.log("File list:", fileList);
  }, [fileList]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    const base64 = await getBase64(file);
    const uid = file.uid;

    setFileList((prev) => {
      const exists = prev.some((item) => item.uid === uid);
      if (exists) return prev;
      return [
        ...prev,
        {
          uid,
          name: file.name,
          status: "uploading",
          percent: 0,
          thumbUrl: base64,
        },
      ];
    });
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
          customRequest={customRequest}
          onRemove={handleRemove}
          beforeUpload={() => true}
        >
          {avlSlots >= 8 ? null : uploadButton}
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
        {avlSlots > 8 && (
          <p className="text-red-500 text-[15px] italic">
            **Please remove {avlSlots - 8}{" "}
            {avlSlots - 8 === 1 ? "image" : "images"}
          </p>
        )}
        <p className="m-0 p-0 italic text-[14px]">
          *You can upload upto 8 images in total
        </p>
      </div>
    </div>
  );
};

export default UploadImagesByLen;
