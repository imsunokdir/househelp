import React from "react";

import { UIProvider } from "./UIProvider";
import { AuthProvider } from "./AuthProvider";
import { CategoryProvider } from "./CategoryProvider";

const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UIProvider>
        <CategoryProvider>{children}</CategoryProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default AppProvider;
