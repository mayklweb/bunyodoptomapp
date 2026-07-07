import { IconProps } from '@/types/types';
import { User } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const UserIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={User} size={size} color={color} strokeWidth={stroke} />;
};
