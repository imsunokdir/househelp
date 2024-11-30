import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "./nav.css";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategories } from "../../services/category";
import { Category } from "@mui/icons-material";
import { categoryActions } from "../../reducers/category";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Skeleton } from "antd";
import Message from "../Messages/WarningMessage";
import { Fade } from "@mui/material";

const numberOfNavTabs = new Array(10).fill(null);
const { TabPane } = Tabs;

const NavigationTabs = () => {
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [functions, setFunctions] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    const categoryId = event.target.getAttribute("data-id");
    console.log("New Tab Selected:", newValue, "Category ID:", categoryId);
    setValue(newValue);
    dispatch(categoryActions.changeCategory(categoryId));
  };

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.status === 200) {
          const fetchedCategories = response.data.data;
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
            setLoading(false);
            // Set initial value and categoryId to the first category
            setValue(0);
            dispatch(categoryActions.changeCategory(fetchedCategories[0]._id));
          } else {
            functions.warning("No categories found..!!");
          }
        }
      } catch (err) {
        console.log("Error:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-3/4">
      <Message onMessage={setFunctions} />
      <Fade in timeout={1000}>
        <Box sx={{ width: "99%", bgcolor: "background.paper" }}>
          {loading ? (
            <Tabs
              value={false} // Prevents value mismatch during loading
              variant="scrollable"
              scrollButtons="auto"
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
                aria-label="scrollable auto tabs example"
              >
                {categories.map((category, index) => (
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
