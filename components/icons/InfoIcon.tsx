import React from "react";
import Svg, { Path } from "react-native-svg";

type ProfileIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
};

export default function InfoIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
}: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 16V12"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.875 8.25H12M11.75 8.25C11.75 8.11193 11.8619 8 12 8C12.1381 8 12.25 8.11193 12.25 8.25C12.25 8.38807 12.1381 8.5 12 8.5C11.8619 8.5 11.75 8.38807 11.75 8.25Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// <svg
//   width="24"
//   height="24"
//   viewBox="0 0 24 24"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <path
//     stroke="#141B34"
//     stroke-width="1.5"
//     stroke-linecap="round"
//     stroke-linejoin="round"
//   />
//   <path
//     stroke="#141B34"
//     stroke-width="1.5"
//     stroke-linecap="round"
//     stroke-linejoin="round"
//   />
//   <path
//     stroke="#141B34"
//     stroke-width="1.5"
//     stroke-linecap="round"
//     stroke-linejoin="round"
//   />
// </svg>;
