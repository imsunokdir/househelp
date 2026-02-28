import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";
import { getOrCreateConversation } from "../../reducers/thunks/chatThunk";
import { AuthContext } from "../../contexts/AuthProvider";

// Place this button on your Service detail page
// Props: workerId, serviceId, workerName

const MessageButton = ({ workerId, serviceId, workerName }) => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const handleMessage = () => {
    if (!user) {
      // redirect to login if not authenticated
      window.location.href = "/user-auth/login";
      return;
    }
    dispatch(getOrCreateConversation({ workerId, serviceId }));
  };

  // Don't show button if user IS the worker
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
