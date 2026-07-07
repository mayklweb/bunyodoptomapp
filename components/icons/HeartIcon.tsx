import { IconProps } from '@/types/types';
import { FavouriteIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const HeartIcon = ({  size, color, stroke }: IconProps) => {
  return (
    <HugeiconsIcon  icon={FavouriteIcon} size={size} color={color} strokeWidth={stroke} />
  );
};
