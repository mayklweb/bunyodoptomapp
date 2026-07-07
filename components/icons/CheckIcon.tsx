import { IconProps } from '@/types/types';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const CheckIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Tick02Icon} size={size} color={color} strokeWidth={stroke} />;
};
