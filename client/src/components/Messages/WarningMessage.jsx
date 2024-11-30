import React, { useEffect } from "react";
import { message } from "antd";

const Message = ({ onMessage }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };

  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const warning = (message) => {
    messageApi.open({
      type: "warning",
      content: message,
    });
  };

  const loading = (msg, key) => {
    // Show loading spinner with custom message
    messageApi.open({
      key,
      type: "loading",
      content: msg,
    });
  };

  const destroy = (key) => {
    messageApi.destroy(key);
  };

  // Provide the functions to the parent or other components via a callback
  useEffect(() => {
    if (onMessage) {
      onMessage({ success, error, warning, loading, destroy });
    }
  }, [onMessage]);

  return <>{contextHolder}</>;
};

export default Message;
