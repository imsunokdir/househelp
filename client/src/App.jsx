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
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import SuccessService from "./components/services/SuccessService";
import SkeletonCard2 from "./components/LoadingSkeleton/SkeletonCards2";
import AddService from "./components/services/AddService";
import TrackUserActivity from "./middlewares/TrackUserActivity";
import AddService2 from "./components/services/AddService2";
import EmailIfThere from "./components/auth/EmailIfThere";

const App = () => {
  return (
    <>
      <AppProvider>
        <TrackUserActivity />
        <BrowserRouter>
          <Header />
          <div className="min-h-screen pb-16 sm:pb-0">
            <Routes>
              {/* root route */}
              <Route path="/" element={<Home />} />
              {/* protected routes */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/accounts/*" element={<Accounts />} />
                <Route
                  path="/service-creation-success/:serviceId"
                  element={<SuccessService />}
                />
                <Route path="/add-service" element={<AddService2 />} />
                <Route
                  path="/edit-service/:serviceId"
                  element={<EditService />}
                />
                <Route
                  path="/write-review/:serviceId"
                  element={<GiveReviewPage />}
                />
              </Route>

              {/* service routes */}
              <Route
                path="/show-service-details/:serviceId"
                element={<Service />}
              />

              {/* token related routes */}
              <Route
                path="email-verification/:userId/:email"
                element={<EmailVrfSent />}
              />
              <Route
                path="reset-password/:verifiedToken"
                element={<ResetPassword />}
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/email-verification-done/:verifiedToken"
                element={<EmailVerified />}
              />

              {/* user routes */}
              <Route path="/user-auth/*" element={<AuthRootRoute />} />
              <Route path="/email/if-there" element={<EmailIfThere />} />

              {/* test routes */}
              <Route path="/test" element={<Test />} />
              <Route path="/test2" element={<Test2 />} />
              <Route path="/test3" element={<Test3 />} />
              <Route path="/test4/*" element={<Test4 />} />
              <Route path="/test5/*" element={<MyServiceCard />} />
              <Route path="/load" element={<LoadBalls />} />
              <Route path="/error" element={<Error />} />
              <Route path="/success" element={<Success />} />
              <Route path="/test-login" element={<DummyLogin />} />
              <Route path="/test-skeleton" element={<SkeletonCard2 />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </>
  );
};

export default App;
