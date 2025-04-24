import React, { useContext } from "react";
import { Modal } from "antd";
import LoginForm from "./LoginForm";
import { Typography } from "@mui/material";
import { UIContext } from "../../contexts/UIProvider";

// import { createTheme, ThemeProvider } from "@mui/material/styles";

const LoginModal = () => {
  const { isLoginModalOpen, handleClose } = useContext(UIContext);
  return (
    <Modal
      open={isLoginModalOpen}
      onCancel={handleClose}
      onOk={handleClose}
      footer={null}
    >
      {/* <Typography component="h1" variant="h5">
        Log in
      </Typography> */}
      <LoginForm />
    </Modal>
  );
};

export default LoginModal;
