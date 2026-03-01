import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { MessageSquare } from "lucide-react";
import { getOrCreateConversation } from "../../reducers/thunks/chatThunk";
import { openChat } from "../../reducers/chatSlice";
import { AuthContext } from "../../contexts/AuthProvider";

const MessageButton = ({ workerId, serviceId, workerName }) => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const handleMessage = () => {
    if (!user) {
      window.location.href = "/user-auth/login";
      return;
    }
    // Open chat panel instantly — don't wait for API
    dispatch(openChat());
    dispatch(getOrCreateConversation({ workerId, serviceId }));
  };

  if (user?._id === workerId || user?.userId === workerId) return null;

  return (
    <button
      onClick={handleMessage}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors duration-150 shadow-sm"
    >
      <MessageSquare size={16} />
      Message {workerName || "Worker"}
    </button>
  );
};

export default MessageButton;
