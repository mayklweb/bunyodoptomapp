import React from "react";
import Svg, { Path } from "react-native-svg";

type HomeIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  backgroundColor?: string; // filled holatda ichki chiziq rangi (odatda tugma foni)
};

export default function PlusIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
  backgroundColor = "#FFF",
}: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11.9922 4V20M19.9922 12H3.99219"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
