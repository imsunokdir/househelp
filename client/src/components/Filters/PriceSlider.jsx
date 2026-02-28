import React, { useState, useEffect } from "react";
import { Slider } from "@mui/material";

const PriceSlider = ({ localFilters, setLocalFilters }) => {
  const defaultMin = 0;
  const defaultMax = 10000;

  const [tempValue, setTempValue] = useState([
    localFilters?.priceRange?.minimum ?? defaultMin,
    localFilters?.priceRange?.maximum ?? defaultMax,
  ]);

  useEffect(() => {
    setTempValue([
      localFilters?.priceRange?.minimum ?? defaultMin,
      localFilters?.priceRange?.maximum ?? defaultMax,
    ]);
  }, [localFilters]);

  const handleChange = (e, newValue) => setTempValue(newValue);

  const handleChangeCommitted = (e, newValue) => {
    const [min, max] = newValue;
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: { minimum: min, maximum: max },
    }));
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800 m-0">Price Range</p>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          ₹{tempValue[0].toLocaleString()} – ₹{tempValue[1].toLocaleString()}
        </span>
      </div>
      <Slider
        getAriaLabel={() => "Price Range"}
        value={tempValue}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="off"
        step={500}
        min={defaultMin}
        max={defaultMax}
        sx={{
          color: "#111827",
          "& .MuiSlider-thumb": {
            backgroundColor: "#111827",
            width: 18,
            height: 18,
            "&:hover": { boxShadow: "0 0 0 6px rgba(17,24,39,0.1)" },
          },
          "& .MuiSlider-rail": { backgroundColor: "#e5e7eb", height: 4 },
          "& .MuiSlider-track": {
            backgroundColor: "#111827",
            height: 4,
            border: "none",
          },
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">₹0</span>
        <span className="text-xs text-gray-400">₹10,000</span>
      </div>
    </div>
  );
};

export default PriceSlider;
