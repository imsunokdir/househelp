import React, { useEffect, useState } from "react";
import { getMyServices } from "../../services/service";
import MyServiceSingle from "./MyServiceSingle";
import Service from "../../pages/Service";
import { Empty, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Fade } from "@mui/material";
import LoadBalls from "../LoadingSkeleton/LoadBalls";

const MyServices = () => {
  const [myServices, setMyServices] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isServiceLoading, setServiceLoading] = useState(true);
  const navigate = useNavigate();

  const handleAddService = () => {
    navigate("/add-service");
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
      <div className=" p-3 rounded">
        <h3>My services</h3>

        {myServices && myServices.length > 0 ? (
          <div className="">
            {myServices && myServices.length > 0 && (
              <Fade in timeout={500}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {myServices.map((service) => (
                    <MyServiceSingle service={service} key={service._id} />
                  ))}
                </div>
              </Fade>
            )}
          </div>
        ) : (
          <div>
            <Empty description="No services found.. !!" />
            {/* <p className=" mt-2">Do you wanna be a service provider?</p> */}
            <Typography>Do you wanna be a service provider?</Typography>
            <Button onClick={handleAddService}>+ Add Service</Button>
          </div>
        )}
        <div className="mt-3">
          <Button onClick={handleAddService}>+ Add Service</Button>
        </div>
      </div>
    </div>
  );
};

export default MyServices;
