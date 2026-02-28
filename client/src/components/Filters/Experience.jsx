import { Slider } from "@mui/material";
import React from "react";

const Experience = ({ localFilters, setLocalFilters }) => {
  const experience = localFilters?.experience ?? 0;
  const maxExperience = 10;

  const handleExpChange = (e, value) => {
    setLocalFilters((prev) => ({ ...prev, experience: value }));
  };

  const marks = Array.from({ length: maxExperience + 1 }, (_, i) => ({
    value: i,
    label:
      i === 0 ? "0" : i === maxExperience ? `${maxExperience}+` : undefined,
  }));

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800 m-0">
          Min Experience
        </p>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {experience === 0
            ? "Any"
            : `${experience} ${experience === 1 ? "year" : "years"}`}
        </span>
      </div>
      <Slider
        aria-label="Experience"
        value={experience}
        onChange={handleExpChange}
        valueLabelDisplay="off"
        step={1}
        marks={marks}
        min={0}
        max={maxExperience}
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
          "& .MuiSlider-mark": {
            backgroundColor: "#d1d5db",
            width: 4,
            height: 4,
            borderRadius: "50%",
          },
          "& .MuiSlider-markActive": { backgroundColor: "#111827" },
          "& .MuiSlider-markLabel": { fontSize: "11px", color: "#9ca3af" },
        }}
      />
    </div>
  );
};

export default Experience;
