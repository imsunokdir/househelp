import React from "react";

import { UIProvider } from "./UIProvider";
import { AuthProvider } from "./AuthProvider";

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UIProvider>{children}</UIProvider>
    </AuthProvider>
  );
};

export default AppProvider;
