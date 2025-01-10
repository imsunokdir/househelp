import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../../reducers/filter";

const PriceSlider = ({ currCategory }) => {
  const dispatch = useDispatch();
  const { priceRange } = useSelector((state) => state.filter);

  const [price, setPrice] = useState({
    minimum: 0,
    maximum: currCategory.maxPrice,
  });

  // useEffect(()=>{
  //   setPrice(pri)
  // },[priceRange])

  useEffect(() => {
    console.log("okokokokokokokkokokokook");
    setPrice({ minimum: 0, maximum: currCategory.maxPrice });
  }, []);

  useEffect(() => {
    if (priceRange.maximum) {
      console.log("hola");
      setPrice(priceRange);
    }
  }, [priceRange, currCategory]);

  useEffect(() => {
    console.log("curr cat:", currCategory);
  }, [currCategory]);

  useEffect(() => {
    console.log("price:", price);
  }, [price]);

  //   const [value, setValue] = useState([priceRange.minimum, priceRange.maximum]);
  const handleChange = (e, newValue) => {
    console.log("newValue:", newValue);
    dispatch(
      filterActions.setPriceRange({
        minimum: newValue[0],
        maximum: newValue[1],
      })
    );
  };
  return (
    <div>
      <p className="m-0">Price</p>
      <Slider
        getAriaLabel={() => "Price Range"}
        value={[price.minimum, price.maximum]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={500}
        min={0}
        max={currCategory.maxPrice}
        sx={{
          color: "gray", // Sets the slider's active color to gray
          "& .MuiSlider-thumb": {
            backgroundColor: "gray", // Thumb (circular knob) color
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#d3d3d3", // Rail color (track behind the slider)
          },
          "& .MuiSlider-track": {
            backgroundColor: "gray", // Active track color
          },
        }}
      />
      <div className="flex justify-between">
        <p>Min: ₹{price.minimum}</p>
        <p>Max: ₹{price.maximum}</p>
      </div>
    </div>
  );
};

export default PriceSlider;
