import React, { useMemo } from "react";

const colorRanges = [
  { min: 1.0, max: Infinity, color: "#FF0040", font: "#FFFFFF" },
  { min: 0.9, max: 1.0, color: "#FF0040", font: "#FFFFFF" },
  { min: 0.8, max: 0.9, color: "#FF4D79", font: "#FFFFFF" },
  { min: 0.7, max: 0.8, color: "#FF809F", font: "#FFFFFF" },
  { min: 0.6, max: 0.7, color: "#FFB2C6", font: "#FF0040" },
  { min: 0.5, max: 0.6, color: "#FFE5EC", font: "#FF0040" },
  { min: 0.4, max: 0.5, color: "#E5FBF5", font: "#00D498" },
  { min: 0.3, max: 0.4, color: "#B2F2E0", font: "#00D498" },
  { min: 0.2, max: 0.3, color: "#80E9CB", font: "#FFFFFF" },
  { min: 0.1, max: 0.2, color: "#4DE1B7", font: "#FFFFFF" },
  { min: 0.0, max: 0.1, color: "#00D498", font: "#FFFFFF" },
];

export const useColorForValue = (value) => {
  return useMemo(() => {
    const range = colorRanges.find((r) => value >= r.min && value < r.max);
    return range ? range.color : "#FF0040";
  }, [value]);
};

export const useFontColorForValue = (value) => {
  return useMemo(() => {
    const range = colorRanges.find((r) => value >= r.min && value < r.max);
    return range ? range.font : "#FFFFFF";
  }, [value]);
};
