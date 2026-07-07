import { IconProps } from '@/types/types';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const LeftArrowIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={ArrowLeft02Icon} size={size} color={color} strokeWidth={stroke} />;
};
