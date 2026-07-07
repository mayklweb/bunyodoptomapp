import { IconProps } from '@/types/types';
import { Package } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const OrderIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Package} size={size} color={color} strokeWidth={stroke} />;
};
