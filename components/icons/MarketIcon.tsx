import { IconProps } from '@/types/types';
import { Store01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const MarketIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Store01Icon} size={size} color={color} strokeWidth={stroke} />;
};
  