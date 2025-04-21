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
import { Badge, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";

import PriceSlider from "./PriceSlider";
import RatingStar from "./RatingStar";
import Experience from "./Experience";

import { AuthContext } from "../../contexts/AuthProvider";
import { filterActions, defaultFilterValues } from "../../reducers/filter";
import { serviceActions } from "../../reducers/service";
import { fetchServiceByCategoryThunk } from "../../reducers/thunks/servicesThunk";
import { CategoryContext } from "../../contexts/CategoryProvider";

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
  const { allCategories, userLocation } = useContext(AuthContext);

  // Local state
  const [open, setOpen] = useState(false);
  const [currCategory, setCurrCategory] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    priceRange: { ...filterData.priceRange },
    rating: filterData.rating,
    experience: filterData.experience,
  });

  const page = 1;

  useEffect(() => {
    const cat = allCategories.find((category) => category._id === categoryId);
    setCurrCategory(cat);
  }, [categoryId, allCategories]);

  // Toggle modal
  const handleClickOpen = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  // Apply filter
  const handleFilterSubmit = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    handleClose();
    dispatch(serviceActions.clearServices());
    dispatch(filterActions.setAllFilters(localFilters));
    dispatch(filterActions.setIsFilterApplied());

    dispatch(
      fetchServiceByCategoryThunk({
        categoryId,
        page,
        userLocation,
        filterData: localFilters,
      })
    );
  };

  // Clear filter
  const handleFilterClear = () => {
    const defaultFilters = {
      priceRange: { ...defaultFilterValues.priceRange },
      rating: defaultFilterValues.rating,
      experience: defaultFilterValues.experience,
    };
    setLocalFilters(defaultFilters);
    // dispatch(serviceActions.clearServices());
    // dispatch(filterActions.clearFilters());

    // dispatch(
    //   fetchServiceByCategoryThunk({
    //     categoryId,
    //     page,
    //     userLocation,
    //     filterData: defaultFilters,
    //   })
    // );
  };

  useEffect(() => {
    if (open) {
      window.history.pushState({ modal: true }, ""); // Push state when modal opens

      const handlePopState = (event) => {
        if (open) {
          setOpen(false); // Close the modal
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
            currCategory={currCategory}
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
          <p
            className="m-0 p-1 hover:bg-gray-100 rounded cursor-pointer"
            onClick={handleFilterClear}
          >
            Clear all
          </p>
          <Button variant="contained" onClick={handleFilterSubmit}>
            Filter
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Filter;
