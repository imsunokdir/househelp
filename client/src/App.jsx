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
import Error from "./Error";
import Success from "./Success";
import Register from "./components/auth/Register";
import AuthRootRoute from "./components/auth/AuthRootRoute";
import EmailVrfSent from "./components/auth/EmailVrfSent";
import EmailVerified from "./components/auth/EmailVerified";
import DummyLogin from "./Test5/DummyLogin";
import ProtectedRoutes from "./components/Routes/ProtectedRoutes";
import Test5 from "./Test5";
import MyServiceCard from "./components/services/MyServiceCard";

const App = () => {
  return (
    <>
      <AppProvider>
        <BrowserRouter>
          <Header />
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="email-verification/:userId/:email"
                element={<EmailVrfSent />}
              />
              <Route
                path="/show-service-details/:serviceId"
                element={<Service />}
              />
              {/* <Route path="/accounts/*" element={<Accounts />} /> */}

              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="/user-auth/*" element={<AuthRootRoute />} />
              <Route
                path="/email-verification-done/:verifiedToken"
                element={<EmailVerified />}
              />

              <Route path="/test" element={<Test />} />
              <Route path="/test2" element={<Test2 />} />
              <Route path="/test3" element={<Test3 />} />
              <Route path="/test4/*" element={<Test4 />} />
              <Route path="/test5/*" element={<MyServiceCard />} />
              <Route path="/load" element={<LoadBalls />} />
              <Route path="/error" element={<Error />} />
              <Route path="/success" element={<Success />} />
              <Route path="/test-login" element={<DummyLogin />} />

              {/* protected routes */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/accounts/*" element={<Accounts />} />
                <Route path="/add-service" element={<AddServiceForm />} />
                <Route
                  path="/edit-service/:serviceId"
                  element={<EditService />}
                />
                <Route
                  path="/write-review/:serviceId"
                  element={<GiveReviewPage />}
                />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </>
  );
};

export default App;
