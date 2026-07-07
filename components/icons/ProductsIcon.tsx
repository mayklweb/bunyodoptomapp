import { IconProps } from '@/types/types';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { MenuSquareIcon } from '@hugeicons/core-free-icons';

export const ProductsIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={MenuSquareIcon} size={size} color={color} strokeWidth={stroke} />;
};
