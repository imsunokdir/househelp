import React, { useContext, useEffect, useState } from "react";
import { Button, Upload, message } from "antd";
import {
  DeleteFilled,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
// import { uploadUserAvatar } from "./api"; // Assuming this is imported from your API file
import { getUserDetails, uploadUserAvatar } from "../../services/user";
import { AuthContext } from "../../contexts/AuthProvider";
import { UploadIcon } from "lucide-react";
import { Fade, Grow } from "@mui/material";
import ConfirmDeletePic from "./ConfirmDeletePic";

const UploadProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  useEffect(() => {
    setLoading(true);
    if (user?.avatar) {
      setImageUrl(user.avatar);
    }
    setLoading(false);
  }, [user]);

  // Custom upload method
  const customUpload = async (info) => {
    const { file } = info;

    console.log("info:", info);
    console.log("file:", file);

    // Create FormData to send file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageUrl", imageUrl);
    setImageUrl();

    try {
      setLoading(true);
      const response = await uploadUserAvatar(formData);
      console.log("response", response);

      if (response.status === 200) {
        setImageUrl(response.data.avatar);
        // Convert to base64 for preview
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // console.log("reader")
          // setImageUrl(reader.result);
          message.success("Avatar uploaded successfully");
        };
      }
    } catch (error) {
      message.error(
        "Upload failed: " + (error.response?.data?.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  // Validate file before upload
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  // Upload button component
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className=" items-center justify-center ">
      <div className=" flex flex-col items-center ">
        <Upload
          name="file"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={customUpload}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>
        <div className="text-center">
          <p className="m-0">{user && user.username}</p>
          <p className="m-0">{user && user.email}</p>
        </div>
      </div>
      <div className=" h-[35px]">
        {imageUrl && (
          <Fade in timeout={1000}>
            <div className="flex justify-center gap-2 ">
              <Upload
                beforeUpload={beforeUpload}
                customRequest={customUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Change Profile</Button>
              </Upload>

              <ConfirmDeletePic imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default UploadProfile;
