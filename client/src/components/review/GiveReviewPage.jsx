import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, Divider, Rate, Tooltip } from "antd";
import { CircularProgress } from "@mui/material";
import Message from "../Messages/WarningMessage";
import { getAvgRating, giveReview } from "../../services/reviews";
import { fetchServiceById } from "../../services/service";
import GiveReviewSkeleton from "../LoadingSkeleton/GiveReviewSkeleton";
import { UserOutlined } from "@ant-design/icons";

const GiveReviewPage = () => {
  const { serviceId } = useParams();
  const tooltips = ["Bad", "Average", "Good", "Very Good", "Excellent"];
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [functions, setFunctions] = useState({});
  const [averageRating, setAverageRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(null);
  const [service, setService] = useState(null);
  const [isServiceLoading, setServiceLoading] = useState(true);

  const handleSubmit = async () => {
    if (!review && !rating) {
      functions.warning("Please fill in both the rating and the review");
      return;
    } else if (review === "") {
      functions.warning("Description cannot be empty.");
      return;
    } else if (!rating) {
      functions.warning("Rating cannot be empty.");
      return;
    }
    setIsWriting(true);
    try {
      const response = await giveReview({ serviceId, rating, review });
      if (response.status === 201) {
        functions.success("Review submitted successfully..!");
      } else {
        functions.error("Opps..An error occured while submitting your review.");
      }
    } catch (error) {
      console.log(error);
      functions.error("Opps..An error occured while submitting your review.");
    } finally {
      setIsWriting(false);
    }
  };

  const fetchService = async () => {
    setServiceLoading(true);
    try {
      const response = await fetchServiceById(serviceId);
      if (response.status === 200) {
        setService(response.data.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setServiceLoading(false);
    }
  };

  useEffect(() => {
    const getAverageRating = async () => {
      try {
        const response = await getAvgRating(serviceId);

        if (response.status === 200) {
          setAverageRating(response.data.averageRating);
          setTotalReviews(response.data.totalReviews);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchService();
    getAverageRating();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-2">
        {isServiceLoading ? (
          <GiveReviewSkeleton />
        ) : (
          <>
            {isWriting && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-500 opacity-20 z-10 flex justify-center items-center rounded">
                {/* Empty, just an overlay */}
              </div>
            )}
            <div className="flex justify-between">
              <div>
                <h3 className="m-0">{service && service.serviceName}</h3>
                <p className="m-0">
                  <UserOutlined />
                  {service && service.createdBy.username}
                </p>
              </div>
              <div className="text-center">
                {averageRating && (
                  <p className="m-0 bg-green-500 text-gray-100">
                    {averageRating}✩
                  </p>
                )}
                {totalReviews && (
                  <p className="m-0 text-[14px]">({totalReviews} Reviews)</p>
                )}
              </div>
            </div>
            <Divider />
            <div className="flex justify-between">
              <div>
                <h5>Rate this service</h5>
                <span className="flex gap-3 items-center">
                  <Rate
                    value={rating}
                    characterRender={(node, { index }) => (
                      <Tooltip title={tooltips[index]}>{node}</Tooltip>
                    )}
                    onChange={(value) => setRating(value)}
                    allowClear={false}
                  />
                  {rating !== null && (
                    <p className="m-0">{tooltips[rating - 1]}</p>
                  )}
                </span>
              </div>
            </div>
            <Divider />
            <div className="">
              <h5>Write a review</h5>
              <div className="space-y-2 p-1">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows="5"
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
            </div>
            <div>
              {isWriting ? (
                <Button
                  variant="contained"
                  //   sx={{ mt: 3, mb: 2 }}
                  //   type="submit"
                  disabled={true}
                  className="py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  <CircularProgress
                    size="1.5rem"
                    sx={{
                      color: "white",
                    }}
                  />
                </Button>
              ) : (
                <Button
                  variant="contained"
                  // sx={{ mt: 3, mb: 2 }}
                  type="submit"
                  className="py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}

              <Message onMessage={setFunctions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GiveReviewPage;
