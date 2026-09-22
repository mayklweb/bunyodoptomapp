<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    stroke="#141B34"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    stroke="#141B34"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    stroke="#141B34"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    stroke="#141B34"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>;

import React from "react";
import Svg, { Path } from "react-native-svg";

type HomeIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  backgroundColor?: string; // filled holatda ichki chiziq rangi (odatda tugma foni)
};

export default function OrderIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
  backgroundColor = "#FFF",
}: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 7.5V13.5C2.5 17.2712 2.5 19.1569 3.67157 20.3284C4.84315 21.5 6.72876 21.5 10.5 21.5H13.5C17.2712 21.5 19.1569 21.5 20.3284 20.3284C21.5 19.1569 21.5 17.2712 21.5 13.5V7.5"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3.86909 5.31461L2.5 7.5H21.5L20.2478 5.41303C19.3941 3.99021 18.9673 3.2788 18.2795 2.8894C17.5918 2.5 16.7621 2.5 15.1029 2.5H8.95371C7.32998 2.5 6.51812 2.5 5.84013 2.8753C5.16215 3.2506 4.73113 3.93861 3.86909 5.31461Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 7.5V13.5C2.5 17.2712 2.5 19.1569 3.67157 20.3284C4.84315 21.5 6.72876 21.5 10.5 21.5H13.5C17.2712 21.5 19.1569 21.5 20.3284 20.3284C21.5 19.1569 21.5 17.2712 21.5 13.5V7.5"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7.5V2.5"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 10.5H14"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
