import { Slider } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../../reducers/filter";

const Experience = ({ currCategory }) => {
  const dispatch = useDispatch();
  const { experience } = useSelector((state) => state.filter);
  const handleExpChange = (e, value) => {
    console.log("value:", value);
    dispatch(filterActions.setExperience(value));
  };
  return (
    <div>
      <p className="m-0">Experience</p>
      <Slider
        aria-label="Temperature"
        value={experience}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={currCategory.maxExp}
        onChange={handleExpChange}
      />
      <div>
        <p className="m-0">
          {experience} {experience > 1 ? "years" : "year"}
        </p>
      </div>
    </div>
  );
};

export default Experience;
