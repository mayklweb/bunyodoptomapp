import { IconProps } from "@/types/types";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export const RightIcon = ({ size, color, stroke }: IconProps) => {
  return (
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      size={size}
      color={color}
      strokeWidth={stroke}
    />
  );
};
