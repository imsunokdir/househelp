import React, { useEffect, useState } from "react";
import { Avatar, Divider, List, Skeleton, Rate } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { getServiceReviews } from "../../services/reviews"; // Make sure this fetches the data from your backend
import "./service.css";
import { StarFilled, StarOutlined } from "@ant-design/icons";
const Reviews = ({ data }) => {
  // const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const [totalPages, setTotalPages] = useState(null);

  // const loadMoreData = async () => {
  //   if (loading || (totalPages && page > totalPages)) {
  //     return; // Prevent fetching if already loading or if all pages are fetched
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await getServiceReviews(serviceId, page, 3);
  //     console.log("REVIEW RESP**:", response);
  //     const reviews = response.data.data; // The actual reviews
  //     const pagination = response.data.pagination; // Pagination details
  //     setData((prevData) => [...prevData, ...reviews]);
  //     setTotalPages(pagination.totalPages);
  //     setHasMore(page < pagination.totalPages);
  //     setPage((prevPage) => prevPage + 1);
  //   } catch (error) {
  //     console.error("Failed to fetch reviews:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch initial reviews on component mount
  // useEffect(() => {
  //   console.log("yolo");
  //   loadMoreData();
  // }, [serviceId]);

  return (
    // <div
    //   id="scrollableDiv"
    // style={{
    //   overflow: "auto",
    //   padding: "0 16px",
    //   border: "1px solid rgba(140, 140, 140, 0.35)",
    // }}
    // >
    <>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <List.Item.Meta
              avatar={<Avatar src={item.user.avatar} />}
              title={
                <div>
                  <a href={`/users/${item.user._id}`}>{item.user.username}</a>
                  <br />
                  <Rate
                    value={item.rating}
                    character={({ index }) =>
                      index < item.rating ? (
                        <StarFilled style={{ color: "gray" }} />
                      ) : (
                        <StarOutlined style={{ color: "gray" }} />
                      )
                    }
                    style={{ fontSize: "10px" }}
                  />
                </div>
              }
              description={item.comment}
            />
            {/* <div>
                <Rate value={item.rating} />
              </div> */}
          </List.Item>
        )}
      />
    </>
  );
};

export default Reviews;
