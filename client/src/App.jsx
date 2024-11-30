import React from "react";
import Header from "./components/nav/Header";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Service from "./pages/Service";

import AppProvider from "./contexts/AppProvider";
import AddServiceForm from "./components/services/AddServiceForm";
import Test from "./Test";
import EditService from "./components/services/EditService";
import GiveReviewPage from "./components/review/GiveReviewPage";
import GiveReviewSkeleton from "./components/LoadingSkeleton/GiveReviewSkeleton";
// import Test2 from "./Test2/Test2";
import Test2 from "./Test2/Test2";
import Test3 from "./Test3/Test3";
import Test4 from "./pages/Accounts";
import Accounts from "./pages/Accounts";
import LoadBalls from "./components/LoadingSkeleton/LoadBalls";
const App = () => {
  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/show-service-details/:serviceId"
              element={<Service />}
            />
            <Route path="/accounts/*" element={<Accounts />} />
            <Route path="/add-service" element={<AddServiceForm />} />
            <Route path="/edit-service/:serviceId" element={<EditService />} />
            <Route
              path="/write-review/:serviceId"
              element={<GiveReviewPage />}
            />

            <Route path="/test" element={<Test />} />
            <Route path="/test2" element={<Test2 />} />
            <Route path="/test3" element={<Test3 />} />
            <Route path="/test4/*" element={<Test4 />} />
            <Route path="/load" element={<LoadBalls />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </>
  );
};

export default App;
