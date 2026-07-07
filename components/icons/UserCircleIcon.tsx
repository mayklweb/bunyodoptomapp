import { IconProps } from "@/types/types";
import { User03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export const UserCircleIcon = ({ size, color, stroke }: IconProps) => {
  return (
    <HugeiconsIcon
      icon={User03Icon}
      size={size}
      color={color}
      strokeWidth={stroke}
    />
  );
};
