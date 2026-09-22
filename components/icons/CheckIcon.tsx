import React from "react";
import Svg, { Path } from "react-native-svg";

type HomeIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  stroke?: number;

  backgroundColor?: string; // filled holatda ichki chiziq rangi (odatda tugma foni)
};

export default function CheckIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
  stroke = 1.5,
  backgroundColor = "#FFF",
}: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13.2591L7.58583 15.9567C8.2525 16.6522 8.58583 17 9.00004 17C9.41425 17 9.74759 16.6522 10.4143 15.9567L19 7"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
