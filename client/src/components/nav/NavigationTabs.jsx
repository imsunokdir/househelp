import React, { useContext, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Skeleton } from "antd";
import { Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CategoryContext } from "../../contexts/CategoryProvider";

const numberOfNavTabs = new Array(10).fill(null);

const NavigationTabs = () => {
  const [value, setValue] = useState(0);
  const { categories, loading } = useContext(CategoryContext);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    const categoryId = event.target.getAttribute("data-id");
    setValue(newValue);
  };

  return (
    <div className="w-full">
      <Fade in timeout={1000}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          {loading ? (
            <Tabs
              value={false}
              variant="scrollable"
              scrollButtons="auto"
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
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
                sx={{
                  "& .MuiTabs-scrollButtons": {
                    width: "40px",
                    height: "40px",
                    display: "flex",
                  },
                  "& .MuiTab-root": {
                    minWidth: "80px",
                  },
                }}
              >
                {categories.map((category) => (
                  <Tab
                    label={category.name}
                    data-id={category._id}
                    key={category._id}
                    onClick={() => navigate("/")}
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
