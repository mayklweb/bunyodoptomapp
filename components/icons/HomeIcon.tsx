import { IconProps } from '@/types/types';
import { Home04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const HomeIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Home04Icon} size={size} color={color} strokeWidth={stroke} />;
};
