import React from "react";
import Svg, { Path } from "react-native-svg";

type HeartIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  backgroundColor?: string; // filled holatda ichki chiziq rangi (odatda tugma foni)
};

export default function HeartIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
}: HeartIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.4107 19.9677C7.58942 17.8579 2 13.0348 2 8.69445C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69445C22 13.0348 16.4106 17.8579 13.5893 19.9677C12.6399 20.6776 11.3601 20.6776 10.4107 19.9677Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
