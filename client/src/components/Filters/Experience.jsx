import { Slider } from "@mui/material";
import React from "react";

const Experience = ({ localFilters, setLocalFilters }) => {
  const experience = localFilters?.experience ?? 0;
  const maxExperience = 10; // Set your default max experience value (you can customize this)

  const handleExpChange = (e, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      experience: value,
    }));
  };

  return (
    <div>
      <p className="m-0">Experience</p>
      <Slider
        aria-label="Experience"
        value={experience}
        onChange={handleExpChange}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={maxExperience}
        sx={{
          color: "gray",
          "& .MuiSlider-thumb": { backgroundColor: "gray" },
          "& .MuiSlider-rail": { backgroundColor: "#d3d3d3" },
          "& .MuiSlider-track": { backgroundColor: "gray" },
        }}
      />
      <div>
        <p className="m-0">
          {experience} {experience === 1 ? "year" : "years"}
        </p>
      </div>
    </div>
  );
};

export default Experience;
