import React, { useState, useEffect } from "react";
import { Slider } from "@mui/material";

const PriceSlider = ({ localFilters, setLocalFilters }) => {
  const defaultMin = 0;
  const defaultMax = 10000;

  // Set temporary slider value for live UI update
  const [tempValue, setTempValue] = useState([
    localFilters?.priceRange?.minimum ?? defaultMin,
    localFilters?.priceRange?.maximum ?? defaultMax,
  ]);

  // Keep tempValue in sync with props (in case parent updates filters externally)
  useEffect(() => {
    setTempValue([
      localFilters?.priceRange?.minimum ?? defaultMin,
      localFilters?.priceRange?.maximum ?? defaultMax,
    ]);
  }, [localFilters]);

  const handleChange = (e, newValue) => {
    setTempValue(newValue); // live update
  };

  const handleChangeCommitted = (e, newValue) => {
    const [min, max] = newValue;
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: { minimum: min, maximum: max },
    }));
  };

  return (
    <div>
      <p className="m-0">Price</p>
      <Slider
        getAriaLabel={() => "Price Range"}
        value={tempValue}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        step={500}
        min={defaultMin}
        max={defaultMax}
        sx={{
          color: "gray",
          "& .MuiSlider-thumb": { backgroundColor: "gray" },
          "& .MuiSlider-rail": { backgroundColor: "#d3d3d3" },
          "& .MuiSlider-track": { backgroundColor: "gray" },
        }}
      />
      <div className="flex justify-between">
        <p>Min: ₹{tempValue[0]}</p>
        <p>Max: ₹{tempValue[1]}</p>
      </div>
    </div>
  );
};

export default PriceSlider;
