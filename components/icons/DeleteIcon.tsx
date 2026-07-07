import { IconProps } from '@/types/types';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const DeleteIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Delete02Icon} size={size} color={color} strokeWidth={stroke} />;
};
