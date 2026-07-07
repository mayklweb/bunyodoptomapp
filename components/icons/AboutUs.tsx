import { IconProps } from '@/types/types';
import { Call02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const SupportIcon = ({ size, color , stroke}: IconProps) => {
  return <HugeiconsIcon icon={Call02Icon} size={size} color={color} strokeWidth={stroke} />;
};
