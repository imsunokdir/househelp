import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="overflow-hidden p-2">
      {/* avatar icon */}
      <div className="mt-2 text-center">
        <Avatar
          style={{
            backgroundColor: "#87d068",
          }}
          className="mr-2"
          icon={<UserOutlined />}
        />
      </div>
      {/* username and email */}
      <span>
        <p className="m-0">{user.username}</p>
        <p className="m-0">{user.email}</p>
      </span>
      {/* nav section */}
    </div>
  );
};

export default Profile;
