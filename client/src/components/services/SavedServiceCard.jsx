import React, { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";

// antdImports
import { Button, Popconfirm, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

//no image
import noImage from "../../assets/no-img.jpg";

//imports
import { deleteSavedService } from "../../services/service";

const SavedServiceCard = ({ service, handleRemoveService }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const response = await deleteSavedService(service._id);

      if (response.status === 200) {
        console.log("updated user::", response);
        handleRemoveService(service._id);
        message.success("Service deleted successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      message.error("Failed to delete service. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleClick = () => {
    window.open(`/show-service-details/${service._id}`);
  };
  return (
    <Card
      sx={{
        // maxWidth: 200,
        width: "100%",
        height: 250,
        display: "flex",
        flexDirection: "column",

        justifyContent: "space-between",
        padding: "5px", // Remove extra padding
      }}
    >
      <CardActionArea sx={{ flexGrow: 1 }} onClick={handleClick}>
        {/* Reduced Image Size */}
        <CardMedia
          component="img"
          sx={{
            width: "100px", // Smaller width
            height: "100px", // Smaller height
            objectFit: "cover", // Ensures no distortion
            margin: "0 auto", // Centers the image
          }}
          image={
            service.images?.length > 0 ? String(service.images[0].url) : noImage
          }
          alt="service image"
        />
        <CardContent sx={{ padding: "6px" }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontSize: "20px", fontWeight: "bold" }}
          >
            {service.serviceName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", color: "text.secondary" }}
          >
            {service.description
              ? service.description.slice(0, 40) + "..."
              : "No description available."}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ padding: "4px" }} className="">
        {/* <Button
          size="small"
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            textTransform: "none",
            borderRadius: "5px",
            "&:hover": { backgroundColor: "#2563eb" }, // Tailwind's blue-600 color
          }}
        >
          Remove
        </Button> */}
        <Popconfirm
          title="Confirm Delete"
          description="Are you sure you want to delete?"
          open={open}
          onConfirm={handleOk}
          okButtonProps={{ loading: confirmLoading }}
          onCancel={handleCancel}
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <Button onClick={showPopconfirm} danger>
            Delete
          </Button>
        </Popconfirm>
      </CardActions>
    </Card>
  );
};

export default SavedServiceCard;
