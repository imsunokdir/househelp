import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Provider } from "react-redux";
import rootReducer from "./reducers/index.js";
import AppProvider from "./contexts/AppProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={rootReducer}>
    <AppProvider>
      <App />
    </AppProvider>
  </Provider>,
  // </StrictMode>
);
