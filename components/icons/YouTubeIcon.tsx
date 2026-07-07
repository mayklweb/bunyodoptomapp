import { IconProps } from "@/types/types";
import { Youtube } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export const YouTubeIcon = ({ size, color, stroke }: IconProps) => {
  return (
    <HugeiconsIcon
      icon={Youtube}
      size={size}
      color={color}
      strokeWidth={stroke}
    />
  );
};
