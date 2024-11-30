import { createContext, useState } from "react";
import { message } from "antd";

const UIContext = createContext(null);

const UIProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [functions, setFunctions] = useState({});
  const showModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <UIContext.Provider
      value={{
        isLoginModalOpen,
        setIsLoginModalOpen,
        showModal,
        handleClose,
        functions,
        setFunctions,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export { UIProvider, UIContext };
