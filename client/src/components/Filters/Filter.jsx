import * as React from "react";
import { useEffect, useState, useContext } from "react";
import {
  Dialog,
  IconButton,
  Toolbar,
  Slide,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SlidersHorizontal } from "lucide-react";
import { Badge, Divider, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";

import PriceSlider from "./PriceSlider";
import RatingStar from "./RatingStar";
import Experience from "./Experience";

import { AuthContext } from "../../contexts/AuthProvider";
import { filterActions, defaultFilterValues } from "../../reducers/filter";
import { serviceActions } from "../../reducers/service";
import { fetchServiceByCategoryThunk } from "../../reducers/thunks/servicesThunk";
import { CategoryContext } from "../../contexts/CategoryProvider";
import { getFilteredCount } from "../../services/service";
import { getDefaultFilters } from "../../utils/filterUtils";
import dualball from "../../assets/dualball.svg";
import { LoadingOutlined } from "@ant-design/icons";
// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Filter = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { catLoading } = useContext(CategoryContext);

  // Global state
  const { categoryId } = useSelector((state) => state.category);
  const filterData = useSelector((state) => state.filter);
  const { filterCount, filterApplied } = filterData;

  // Context
  const { userLocation } = useContext(AuthContext);
  const abortController = React.useRef(null);

  // Local state
  const [open, setOpen] = useState(false);
  // const [currCategory, setCurrCategory] = useState(null);
  const [sessionFilters, setSessionFilters] = useState(null);
  const [countLoading, setCountLoading] = useState(false);
  const [serviceCount, setServiceCount] = useState(0);
  const [localFilters, setLocalFilters] = useState(getDefaultFilters());

  useEffect(() => {
    const stored = sessionStorage.getItem("submittedFilters");
    if (stored) {
      const parsed = JSON.parse(stored);
      setLocalFilters(parsed);
      dispatch(filterActions.setAllFilters(parsed));
      dispatch(filterActions.setIsFilterApplied());
    }
  }, []);

  const page = 1;

  // useEffect(() => {
  //   const cat = allCategories.find((category) => category._id === categoryId);
  //   setCurrCategory(cat);
  // }, [categoryId, allCategories]);

  // const resetFilters = React.useCallback(() => {
  //   console.log("reset Fil");
  //   // if (filterCount > 0) {
  //   setLocalFilters({
  //     priceRange: { ...filterData.priceRange },
  //     rating: filterData.rating,
  //     experience: filterData.experience,
  //   });
  //   // }
  // }, [localFilters, filterData]);

  const resetFilters = () => {
    const stored = sessionStorage.getItem("submittedFilters");
    if (stored) {
      setLocalFilters(JSON.parse(stored));
    }
  };

  // const handleClickOpen = () => {
  //   // resetFilters();
  //   setOpen((prev) => !prev);
  // };
  const handleClickOpen = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, [open]);

  const handleClose = React.useCallback(() => {
    console.log("close");
    resetFilters();
    setOpen(false);
  }, [open]);
  // Clear filter
  const handleFilterClear = () => {
    setLocalFilters(getDefaultFilters());
  };

  // Apply filter
  const handleFilterSubmit = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // handleClose();
    dispatch(serviceActions.clearServices());
    // sessionStorage.setItem("sessionFilters", JSON.stringify(localFilters));
    sessionStorage.setItem("submittedFilters", JSON.stringify(localFilters));
    dispatch(filterActions.setAllFilters(localFilters));
    dispatch(filterActions.setIsFilterApplied());
    // resetFilters();
    handleClose();

    dispatch(
      fetchServiceByCategoryThunk({
        categoryId,
        page,
        userLocation,
        filterData: localFilters,
      })
    );
  };

  const cancelPreviousRequest = React.useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      // console.log("Previous request canceled due to category change.");
      // console.log("✅ Canceling request for previous category:", categoryId);
    }
    abortController.current = new AbortController();
    return abortController.current.signal;
  }, []);

  let cnt = 0;

  const getCount = async () => {
    setCountLoading(true);

    const { coordinates } = userLocation || {};
    const longitude = coordinates?.[0];
    const latitude = coordinates?.[1];

    if (!longitude || !latitude) {
      setCountLoading(false);
      return;
    }
    const signal = cancelPreviousRequest();

    try {
      const res = await getFilteredCount({
        categoryId,
        longitude,
        latitude,
        filterData: localFilters,
        signal,
      });

      if (res.status === 200) {
        setServiceCount(res.data.count);
      }
    } catch (error) {
      console.log("error count:", error);
    } finally {
      setCountLoading(false);
    }
  };

  useEffect(() => {
    // sessionStorage.setItem("localFilters", JSON.stringify(localFilters));
    const { coordinates } = userLocation || {};
    if (categoryId && coordinates) {
      // getCount();
      setCountLoading(true);

      getCount();
    }
  }, [localFilters, categoryId, userLocation]);

  useEffect(() => {
    if (open) {
      window.history.pushState({ modal: true }, ""); // Push state when modal opens

      const handlePopState = (event) => {
        if (open) {
          // resetFilters();
          // setOpen(false); // Close the modal
          handleClose();
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [open]);

  return (
    <div className="w-3/12 flex justify-center">
      <Badge size="small" count={filterApplied ? filterCount : 0}>
        <button
          onClick={catLoading ? undefined : handleClickOpen}
          type="button"
          className="flex gap-2 border p-2 rounded shadow-sm"
          disabled={catLoading}
        >
          <SlidersHorizontal color={catLoading ? "#A0A0A0" : "black"} />{" "}
        </button>
      </Badge>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen={isSmallScreen}
        maxWidth={false}
        closeAfterTransition={false}
        sx={{
          "& .MuiDialog-paper": {
            width: isSmallScreen ? "100%" : "500px",
            maxWidth: "none",
            borderRadius: isSmallScreen ? "30px 30px 0 0" : "16px",
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        className="relative"
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

        {/* Filter components */}
        <div className="flex-grow p-5 overflow-y-auto">
          <PriceSlider
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
          <Divider />
          <RatingStar
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
          <Divider />
          <Experience
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t flex items-center justify-between bg-white">
          <button
            className="m-0 p-1 hover:bg-gray-100 rounded cursor-pointer"
            onClick={handleFilterClear}
          >
            Clear all
            {/* <img
              src={dualball}
              style={{ height: "25px", backgroundColor: "red" }}
            /> */}
          </button>
          <Button
            variant="contained"
            onClick={handleFilterSubmit}
            className="w-[150px]"
            disabled={countLoading}
          >
            {countLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 24, color: "blue" }}
                    spin
                  />
                }
              />
            ) : serviceCount > 1000 ? (
              `${Math.floor(serviceCount / 1000) * 1000}+ result`
            ) : (
              `${serviceCount} result`
            )}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Filter;
