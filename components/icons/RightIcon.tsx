import React from "react";
import Svg, { Path } from "react-native-svg";

type ProfileIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
};

export default function RightIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
}: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

    </Svg>
  );
}
