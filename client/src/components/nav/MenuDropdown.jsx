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
import { getUserDetails, logoutUser } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { Fade, keyframes } from "@mui/material";

const MenuDropdown = () => {
  const { showModal } = useContext(UIContext);
  const { setUser, user, isAuth, isUserUpdated } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate();

  const [messageFunctions, setMessageFunctions] = useState({});
  const { messageApi, contextHolder } = message.useMessage();

  useEffect(() => {
    setUserDetails();
    const fetchUserDetails = async () => {
      if (isAuth) {
        try {
          const response = await getUserDetails();
          setUserDetails(response.data.user);
        } catch (error) {
          console.log("failed to fetch user details.");
        }
      }
    };
    fetchUserDetails();
  }, [isAuth, isUserUpdated, user]);

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
        navigate("/");
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
            {userDetails && userDetails?.avatar ? (
              <Fade in timeout={500}>
                <Avatar src={userDetails.avatar} className="shadow" />
              </Fade>
            ) : (
              <Avatar className="shadow-md" />
            )}
          </Space>
        </a>
      </Dropdown>
      <LoginModal />
    </>
  );
};
export default MenuDropdown;
