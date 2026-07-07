import { IconProps } from '@/types/types';
import { ShoppingBasket03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const CartIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={ShoppingBasket03Icon} size={size} color={color} strokeWidth={stroke} />;
};
