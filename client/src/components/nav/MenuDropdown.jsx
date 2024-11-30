import React, { useContext, useEffect, useState } from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import Avatar from "@mui/material/Avatar";
import { Login } from "@mui/icons-material";

import LoginModal from "../auth/LoginModal";
import { AuthContext } from "../../contexts/AuthProvider";
import { UIContext } from "../../contexts/UIProvider";
import Message from "../Messages/WarningMessage";
import FullBackdrop from "../FullBackdrop";
import { logoutUser } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { Fade } from "@mui/material";

const MenuDropdown = () => {
  const { showModal } = useContext(UIContext);
  const { isAuth } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [messageFunctions, setMessageFunctions] = useState({});
  const { messageApi, contextHolder } = message.useMessage();

  const handleLogout = async () => {
    const key = "logoutMessage";
    messageFunctions.loading("Loggin out...", key);

    try {
      const response = await logoutUser();
      console.log("logout-response", response);
      if (response.status === 200) {
        setUser(null);
        messageFunctions.destroy(key);
        messageFunctions.success("Logged out successfully");
      }
    } catch (error) {
      console.log("logouterror:", error);
    }
  };

  const handleAccountsClick = () => {
    navigate("/accounts");
  };

  const items = [
    isAuth && {
      label: (
        <a className="no-underline" onClick={handleAccountsClick}>
          Accounts
        </a>
      ),
      key: "0",
      icon: <Avatar sx={{ width: 20, height: 20 }} />,
    },
    isAuth
      ? {
          label: (
            <a className="no-underline" onClick={handleLogout}>
              Logout
            </a>
          ),
          key: "1",
          icon: <Login sx={{ width: 18, height: 18 }} />,
        }
      : {
          label: (
            <a className="no-underline" onClick={showModal}>
              Login/Register
            </a>
          ),
          key: "1",
          icon: <Login sx={{ width: 18, height: 18 }} />,
        },
    {
      type: "divider",
    },
    {
      label: "Settings",
      key: "3",
      icon: <SettingOutlined />,
    },
  ];
  return (
    <>
      <Message onMessage={setMessageFunctions}></Message>
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Fade in timeout={1000}>
              <Avatar />
            </Fade>
          </Space>
        </a>
      </Dropdown>
      <LoginModal />
    </>
  );
};
export default MenuDropdown;
