import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";

const PriceSlider = ({ localFilters, setLocalFilters }) => {
  const defaultMin = 0;
  const defaultMax = 10000;

  const [price, setPrice] = useState({
    minimum: defaultMin,
    maximum: defaultMax,
  });

  // Sync local `price` state with incoming `localFilters.priceRange`
  useEffect(() => {
    const minimum = localFilters?.priceRange?.minimum ?? defaultMin;
    const maximum = localFilters?.priceRange?.maximum ?? defaultMax;
    setPrice({ minimum, maximum });
  }, [localFilters?.priceRange]);

  const handleChange = (e, newValue) => {
    const [min, max] = newValue;
    setPrice({ minimum: min, maximum: max });
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
        value={[price.minimum, price.maximum]}
        onChange={handleChange}
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
        <p>Min: ₹{price.minimum}</p>
        <p>Max: ₹{price.maximum}</p>
      </div>
    </div>
  );
};

export default PriceSlider;
