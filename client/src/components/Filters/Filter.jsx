import * as React from "react";
import { useEffect, useState, useContext, useRef } from "react";
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
import { SlidersHorizontal, X } from "lucide-react";
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
import { LoadingOutlined } from "@ant-design/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Filter = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { catLoading } = useContext(CategoryContext);

  const { categoryId } = useSelector((state) => state.category);
  const filterData = useSelector((state) => state.filter);
  const { filterCount, filterApplied } = filterData;

  const { userLocation } = useContext(AuthContext);
  const abortController = useRef(null);

  const [open, setOpen] = useState(false);
  const [sessionFilters, setSessionFilters] = useState(null);
  const [countLoading, setCountLoading] = useState(false);
  const [serviceCount, setServiceCount] = useState(0);
  const [localFilters, setLocalFilters] = useState(getDefaultFilters());
  const [showRipple, setShowRipple] = useState(false);

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

  const resetFilters = () => {
    const stored = sessionStorage.getItem("submittedFilters");
    if (stored) setLocalFilters(JSON.parse(stored));
  };

  const handleClickOpen = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = React.useCallback(() => {
    resetFilters();
    setOpen(false);
  }, []);

  const handleFilterClear = () => {
    setLocalFilters(getDefaultFilters());
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 500);
  };

  const handleFilterSubmit = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    dispatch(serviceActions.clearServices());
    sessionStorage.setItem("submittedFilters", JSON.stringify(localFilters));
    dispatch(filterActions.setAllFilters(localFilters));
    dispatch(filterActions.setIsFilterApplied());
    handleClose();
    dispatch(
      fetchServiceByCategoryThunk({
        categoryId,
        page,
        userLocation,
        filterData: localFilters,
      }),
    );
  };

  const cancelPreviousRequest = React.useCallback(() => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();
    return abortController.current.signal;
  }, []);

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
      if (res.status === 200) setServiceCount(res.data.count);
    } catch (error) {
      console.log("error count:", error);
    } finally {
      setCountLoading(false);
    }
  };

  useEffect(() => {
    const { coordinates } = userLocation || {};
    if (categoryId && coordinates) {
      setCountLoading(true);
      getCount();
    }
  }, [localFilters, categoryId, userLocation]);

  useEffect(() => {
    if (open) {
      window.history.pushState({ modal: true }, "");
      const handlePopState = () => {
        if (open) handleClose();
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [open, handleClose]);

  const resultLabel = countLoading
    ? null
    : serviceCount > 1000
      ? `${Math.floor(serviceCount / 1000) * 1000}+ results`
      : `Show ${serviceCount} results`;

  return (
    <div className="w-3/12 flex justify-center">
      {/* Filter trigger button */}
      <button
        onClick={catLoading ? undefined : handleClickOpen}
        type="button"
        disabled={catLoading}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all
          ${
            filterApplied
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 shadow-sm"
          }
          ${catLoading ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <SlidersHorizontal size={16} />
        <span className="text-xs font-medium hidden sm:block">Filters</span>
        {filterApplied && filterCount > 0 && (
          <span className="w-4 h-4 bg-white text-gray-900 text-[10px] font-bold rounded-full flex items-center justify-center">
            {filterCount}
          </span>
        )}
      </button>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen={isSmallScreen}
        maxWidth={false}
        closeAfterTransition={false}
        sx={{
          "& .MuiDialog-paper": {
            width: isSmallScreen ? "100%" : "480px",
            maxWidth: "none",
            borderRadius: isSmallScreen ? "24px 24px 0 0" : "20px",
            marginTop: isSmallScreen ? "auto" : "0",
            display: "flex",
            flexDirection: "column",
            height: isSmallScreen ? "85vh" : "auto",
            maxHeight: isSmallScreen ? "85vh" : "80vh",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Ripple overlay */}
        {showRipple && (
          <span className="absolute inset-0 bg-blue-50 animate-ripple z-10 pointer-events-none rounded-inherit" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 relative z-20">
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Filter content */}
        <div className="flex-grow px-5 py-4 overflow-y-auto relative z-20 space-y-1">
          <PriceSlider
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
          <Divider className="my-4" />
          <RatingStar
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
          <Divider className="my-4" />
          <Experience
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white relative z-20">
          <button
            onClick={handleFilterClear}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>

          <button
            onClick={handleFilterSubmit}
            disabled={countLoading}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors min-w-[140px] justify-center"
          >
            {countLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 16, color: "white" }}
                    spin
                  />
                }
              />
            ) : (
              resultLabel
            )}
          </button>
        </div>
      </Dialog>

      <style>{`
        @keyframes rippleAnimation {
          0% { opacity: 0.4; transform: scale(0); }
          100% { opacity: 0; transform: scale(2); }
        }
        .animate-ripple {
          animation: rippleAnimation 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Filter;
