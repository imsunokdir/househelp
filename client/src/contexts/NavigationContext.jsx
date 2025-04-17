import { createContext, useState } from "react";

const NavigationContext = createContext({
  isFormDirty: false,
  setIsFormDirty: () => {},
  pendingNavigation: null,
  setPendingNavigation: () => {},
  showUnsavedChangesModal: false,
  setShowUnsavedChangesModal: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        isFormDirty,
        setIsFormDirty,
        pendingNavigation,
        setPendingNavigation,
        showUnsavedChangesModal,
        setShowUnsavedChangesModal,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
