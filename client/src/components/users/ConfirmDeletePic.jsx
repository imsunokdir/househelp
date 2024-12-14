import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteUserAvatar } from "../../services/user";
const ConfirmDeletePic = ({ imageUrl, setImageUrl, setUserUpdated }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
    try {
      const response = await deleteUserAvatar(imageUrl);
      if (response.status === 200) {
        setImageUrl("");
        setUserUpdated((prev) => !prev);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  return (
    <Popconfirm
      title="Title"
      description="Open Popconfirm with async logic"
      open={open}
      onConfirm={handleOk}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={handleCancel}
    >
      <Button onClick={showPopconfirm} icon={<DeleteOutlined />}>
        Delete Image
      </Button>
    </Popconfirm>
  );
};
export default ConfirmDeletePic;
