import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Toolbar } from "@mui/material";
import { Divider, Skeleton } from "antd";
import RatingDistribution from "./RatingDistribution";
import Reviews from "../services/Reviews";
import { getServiceReviews } from "../../services/reviews";
import { getRatingDistribution } from "../../services/review";

const ReviewsMain = ({ serviceId, averageRating }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);
  const [rateDist, setRateDist] = useState(null);

  const loadMoreData = async () => {
    if (loading || (totalPages && page > totalPages)) {
      return; // Prevent fetching if already loading or if all pages are fetched
    }

    setLoading(true);
    try {
      const response = await getServiceReviews(serviceId, page, 10);
      const reviews = response.data.data; // The actual reviews
      const pagination = response.data.pagination; // Pagination details
      setData((prevData) => [...prevData, ...reviews]);
      setTotalPages(pagination.totalPages);
      setHasMore(page < pagination.totalPages);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatingDistribution = async () => {
    try {
      const response = await getRatingDistribution(serviceId);
      if (response.status === 200) {
        setRateDist(response.data);
      }
    } catch (error) {
      console.log("dist err:", error);
    }
  };

  useEffect(() => {
    loadMoreData();
  }, [serviceId]);

  useEffect(() => {
    loadRatingDistribution();
  }, []);

  useEffect(() => {
    console.log("rating distribution", rateDist);
  }, [rateDist]);

  return (
    <div>
      <div
        className="h-full"
        style={{
          overflowY: "auto",
          border: "1px solid rgba(140, 140, 140, 0.35)",
          height: "100%",
        }}
      >
        <div className="flex flex-col items-center">
          <div>{averageRating} ✩</div>
          {rateDist && <RatingDistribution rateDist={rateDist} />}
        </div>
        <div className="h-full p-4">
          <h2>Reviews</h2>
          <Reviews serviceId={serviceId} data={data} />
          {loading && (
            <Skeleton avatar paragraph={{ rows: 1 }} active className="p-4" />
          )}
          {!loading && hasMore && (
            <button
              onClick={loadMoreData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load More Reviews
            </button>
          )}
          {!hasMore && <Divider plain>That's All Folks 🤐</Divider>}
        </div>
      </div>
    </div>
  );
};

export default ReviewsMain;
