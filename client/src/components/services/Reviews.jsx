import React, { useEffect, useState } from "react";
import { Avatar, Divider, List, Skeleton, Rate } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { getServiceReviews } from "../../services/reviews"; // Make sure this fetches the data from your backend
import "./service.css";
import { StarFilled, StarOutlined } from "@ant-design/icons";
const Reviews = ({ data }) => {
  return (
    <>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <List.Item.Meta
              avatar={<Avatar src={item.user.avatar} />}
              title={
                <div>
                  <p className="m-0">{item.user.username}</p>
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
