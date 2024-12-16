import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useMediaQuery, useTheme } from "@mui/material";
import { SlidersHorizontal } from "lucide-react";
import { Badge, Divider } from "antd";
import PriceSlider from "./PriceSlider";
import RatingStar from "./RatingStar";
import Experience from "./Experience";
import { useDispatch, useSelector } from "react-redux";
import useFilter from "../../hooks/useFilter";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import { filterActions } from "../../reducers/filter";
import { serviceActions } from "../../reducers/service";
import useFetchService from "../../hooks/useFetchService";
import axios from "axios";
import { fetchServiceFunc } from "../../functions/services";
import { fetchServicesThunk } from "../../reducers/thunks/serviceThunk";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Filter = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  //reducers
  const { filterCount, filterApplied, filterApplying } = useSelector(
    (state) => state.filter
  );
  const { categoryId } = useSelector((state) => state.category);
  const filterData = useSelector((state) => state.filter);

  const {
    servicesByCategoryId,
    currentPage,
    hasMoreServicesByCategory,
    setCurrentPage,
  } = useSelector((state) => state.service);

  //states
  const [currCategory, setCurrCategory] = useState();

  //contexts
  const { allCategories, userLocation } = useContext(AuthContext);

  const page = 1;

  //functions for toggling modal
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(!open);
  };

  // function to call redux thunk to fetch the services and save to store
  const callServiceFetchThunk = async () => {
    dispatch(fetchServicesThunk(categoryId, page, userLocation, filterData));
  };

  const handleFilterSubmit = async () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    handleClose();
    // dispatch(setCurr);
    dispatch(serviceActions.clearServices());
    dispatch(filterActions.setIsFilterApplied(true));
    callServiceFetchThunk();
  };

  //function to set the current category
  useEffect(() => {
    const cat = allCategories.find((category) => category._id === categoryId);
    setCurrCategory(cat);
  }, [categoryId, allCategories]);

  const handleFilterClear = () => {
    dispatch(filterActions.clearFilters());
    dispatch(filterActions.setIsFilterApplied());
    dispatch(filterActions.setFilterApplying());
    // callServiceFetchThunk();
  };

  return (
    <div className="w-3/12 flex justify-center">
      <Badge size="small" count={filterApplied ? filterCount : 0}>
        <button
          onClick={handleClickOpen}
          type="button"
          className="flex gap-2 border p-2 rounded shadow-sm"
        >
          <SlidersHorizontal />
        </button>
      </Badge>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
          fullScreen={isSmallScreen} // Full screen for small screens
          maxWidth={false} // Disables default max width
          sx={{
            "& .MuiDialog-paper": {
              width: isSmallScreen ? "100%" : "500px", // Adjust width
              maxWidth: "none",
              borderRadius: isSmallScreen ? "30px 30px 0 0" : "16px", // Rounded corners
              marginTop: isSmallScreen ? "30px" : "0 auto", // Margin for small screens
              display: "flex",
              flexDirection: "column", // Flex column for layout
              height: "100vh", // Full height for the dialog
            },
          }}
        >
          <Toolbar className="">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <div className="flex-grow p-3 overflow-y-auto">
            <PriceSlider currCategory={currCategory} />
            <Divider />
            <RatingStar currCategory={currCategory} />
            <Divider />
            <Experience currCategory={currCategory} />
          </div>

          {/* Footer */}
          <div className="p-2 border-t flex items-center justify-between bg-white">
            <p
              className="m-0 hover:bg-gray-100 p-1 rounded cursor-pointer"
              onClick={handleFilterClear}
            >
              Clear all
            </p>
            <Button
              variant="contained"
              onClick={handleFilterSubmit}
              // disabled={!filterApplying}
            >
              Filter
            </Button>
          </div>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default Filter;
