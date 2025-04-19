import React, { useContext, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./nav.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Skeleton } from "antd";
import { Fade } from "@mui/material";
import { categoryActions } from "../../reducers/category";
import { CategoryContext } from "../../contexts/CategoryProvider";

const numberOfNavTabs = new Array(10).fill(null);

const NavigationTabs = () => {
  const { categories, catLoading, value, setValue } =
    useContext(CategoryContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    const categoryId = event.target.getAttribute("data-id");
    setValue(newValue);
    dispatch(categoryActions.changeCategory(categoryId));
    sessionStorage.setItem("selectedCategoryId", categoryId);
    sessionStorage.setItem("selectedTabIndex", newValue);
  };

  return (
    <div className="w-10/12">
      <Fade in timeout={1000}>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            "& .MuiTabs-scroller": {
              paddingLeft: "0px !important",
              marginLeft: "0px !important",
            },
            "& .MuiTabs-flexContainer": {
              marginLeft: "0px !important",
            },
            "& .MuiTab-root:first-of-type": {
              marginLeft: "0px !important",
            },
          }}
        >
          {catLoading ? (
            <Tabs
              value={false}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile
              aria-label="scrollable auto tabs example"
            >
              {numberOfNavTabs.map((_, i) => (
                <Tab label={<Skeleton.Input active size="small" />} key={i} />
              ))}
            </Tabs>
          ) : (
            <Fade in timeout={1000}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons={false}
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
                textColor="primary"
                indicatorColor="primary"
                // TabIndicatorProps={{
                //   style: { backgroundColor: "orange" },
                // }}
              >
                {categories.map((category) => (
                  <Tab
                    label={category.name}
                    data-id={category._id}
                    key={category._id}
                    onClick={() => navigate("/")}
                    sx={{
                      minWidth: "auto",
                      paddingX: { xs: 1, sm: 2 },
                      fontSize: { xs: "12px", sm: "14px" },
                      marginX: { xs: 0.5, sm: 1 },
                      "&.Mui-selected": {
                        color: "#1976d2",
                        borderBottom: "2px solid rgba(25, 118, 210, 1)",
                        cursor: "default",
                      },
                      "&:hover:not(.Mui-selected)": {
                        color: "rgba(25, 118, 210, 0.6)",
                        borderBottom: "2px solid rgba(25, 118, 210, 0.6)",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Fade>
          )}
        </Box>
      </Fade>
    </div>
  );
};

export default NavigationTabs;
