import { IconProps } from '@/types/types';
import { InstagramIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const InstIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={InstagramIcon} size={size} color={color} strokeWidth={stroke} />;
};
