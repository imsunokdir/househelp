import React, { useState } from "react";

// MUI Imports
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  CardActions,
  Modal,
  Box,
  Button,
} from "@mui/material";

// no image fallback
import noImage from "../../assets/no-img.jpg";

// service function
import { deleteSavedService } from "../../services/service";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  textAlign: "center",
};

const SavedServiceCard = ({ service, handleRemoveService }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const response = await deleteSavedService(service._id);

      if (response.status === 200) {
        handleRemoveService(service._id);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClick = () => {
    // window.open(`/show-service-details/${service._id}`, "_blank");
    navigate(`/show-service-details/${service._id}`);
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <CardActionArea sx={{ flexGrow: 1 }} onClick={handleClick}>
          <CardMedia
            component="img"
            sx={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              margin: "0 auto",
              borderRadius: "8px",
            }}
            image={
              service.images?.length > 0
                ? String(service.images[0].url)
                : noImage
            }
            alt="service image"
          />
          <CardContent sx={{ padding: "6px" }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ fontSize: "18px", fontWeight: 600, textAlign: "center" }}
            >
              {service.serviceName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              {service.description
                ? service.description.slice(0, 40) + "..."
                : "No description available."}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions sx={{ padding: "4px", justifyContent: "flex-start" }}>
          <Button variant="contained" color="error" onClick={showModal}>
            Delete
          </Button>
        </CardActions>
      </Card>

      <Modal open={open} onClose={handleCancel}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" mb={2}>
            Confirm Deletion
          </Typography>
          <Typography mb={3}>
            Are you sure you want to delete{" "}
            <strong>{service.serviceName}</strong>?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleOk}
              disabled={confirmLoading}
            >
              {confirmLoading ? "Deleting..." : "Delete"}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SavedServiceCard;
