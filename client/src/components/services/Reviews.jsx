import React from "react";
import { Avatar, List, Skeleton, Rate } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import "./service.css";

const Reviews = ({ data, loading }) => {
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
          </List.Item>
        )}
      />

      {/* Proper loading skeleton wrapped inside a List to avoid stray dots */}
      {loading && (
        <List
          dataSource={[1, 2]}
          renderItem={(_, index) => (
            <List.Item key={`skeleton-${index}`}>
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default Reviews;
