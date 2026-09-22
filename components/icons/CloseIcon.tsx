import React from "react";
import Svg, { Path } from "react-native-svg";

type HomeIconProps = {
  size?: number;
  color?: string;
  filled?: boolean;
  backgroundColor?: string; // filled holatda ichki chiziq rangi (odatda tugma foni)
};

export default function CloseIcon({
  size = 24,
  color = "#007AFF",
  filled = false,
  backgroundColor = "#FFF",
}: HomeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
