import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useMediaQuery, useTheme } from "@mui/material";
import RatingDistribution from "./RatingDistribution";
import Reviews from "../services/Reviews";
import InfiniteScroll from "react-infinite-scroll-component";
import { getServiceReviews } from "../../services/reviews";
import { Avatar, Divider as Dv, Skeleton, Rate } from "antd";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ReviewDialog = ({
  handleClose,
  open,
  rateDist,
  serviceId,
  averageRating,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screen size
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  //infiniteScroll
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(null);

  const loadMoreData = async () => {
    if (loading || (totalPages && page > totalPages)) {
      return; // Prevent fetching if already loading or if all pages are fetched
    }

    setLoading(true);
    try {
      const response = await getServiceReviews(serviceId, page, 10);
      // console.log("REVIEW RESP**:", response);
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

  useEffect(() => {
    // console.log("yolo");
    loadMoreData();
  }, [serviceId]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen={isSmallScreen} // Full screen for small screens
        maxWidth={isSmallScreen ? false : "xl"} // Set max width for larger screens
        sx={{
          "& .MuiDialog-paper": {
            width: isSmallScreen ? "100%" : isMediumScreen ? "90%" : "80%",
            height: "100%",
            maxWidth: "none",
          },
        }}
        id="scrrrr"
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <div
          className="h-full"
          id="scrollableTest"
          style={{
            overflowY: "auto", // Ensure it's scrollable
            border: "1px solid rgba(140, 140, 140, 0.35)",
            height: "100%", // Ensure it takes up full height
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={
              <Skeleton
                avatar
                paragraph={{
                  rows: 1,
                }}
                active
                className="p-4"
              />
            }
            endMessage={<Divider plain>That's All Folks 🤐</Divider>}
            scrollableTarget="scrollableTest" // Make sure this points to the correct container
            scrollThreshold={0.9} // Trigger loading when the user is 90% of the way down
            style={{ minHeight: "90vh" }} // Minimum height for the scroll container
          >
            <div className="flex flex-col items-center">
              <h2>{averageRating}✰</h2>
              <RatingDistribution rateDist={rateDist} />
            </div>
            <div className="h-full p-4">
              <h2> Reviews</h2>
              <Reviews serviceId={serviceId} data={data} />
            </div>
          </InfiniteScroll>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default ReviewDialog;
