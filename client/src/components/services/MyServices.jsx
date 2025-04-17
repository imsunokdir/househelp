import React, { useEffect, useState } from "react";
import { getMyServices } from "../../services/service";
import { Empty, Button } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { Fade } from "@mui/material";
import LoadBalls from "../LoadingSkeleton/LoadBalls";
import MyServiceCard from "./MyServiceCard";

const MyServices = () => {
  const [myServices, setMyServices] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isServiceLoading, setServiceLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddService = () => {
    navigate("/accounts/add-service-form"); // match the exact route from MyServiceMenu
  };

  useEffect(() => {
    setServiceLoading(true);
    const fetchMyServices = async () => {
      try {
        const response = await getMyServices();
        if (response.status === 200) {
          setMyServices(response.data.data);
        }
      } catch (error) {
        setIsError(error);
      } finally {
        setServiceLoading(false);
      }
    };
    fetchMyServices();
  }, []);

  useEffect(() => {
    console.log("service:", myServices);
  }, [myServices]);

  return isServiceLoading ? (
    <LoadBalls />
  ) : (
    <div>
      <div className="p-3 rounded">
        <h3>My Services</h3>

        {myServices && myServices.length > 0 ? (
          <Fade in timeout={500}>
            <div className="grid grid-cols-1 gap-3">
              {myServices.map((service) => (
                <MyServiceCard service={service} key={service._id} />
              ))}
            </div>
          </Fade>
        ) : (
          <div>
            <Empty description="No services found.. !!" />
            <p className="mt-2">Do you wanna be a service provider?</p>
          </div>
        )}
        <div className="mt-3">
          <Button onClick={handleAddService}>+ Add Service</Button>
        </div>
      </div>

      {/* Outlet for nested route */}
      <Outlet />
    </div>
  );
};

export default MyServices;
