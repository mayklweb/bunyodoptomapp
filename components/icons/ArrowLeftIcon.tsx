import React from "react";
import Svg, { Path } from "react-native-svg";

type HomeIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  backgroundColor?: string; // filled holatda ichki chiziq rangi (odatda tugma foni)
};

export default function ArrowLeftIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
  backgroundColor = "#FFF",
}: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 12.002H19"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"  
      />
      <Path
        d="M10.9999 18.002C10.9999 18.002 5.00001 13.583 5 12.0019C4.99999 10.4208 11 6.00195 11 6.00195"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
