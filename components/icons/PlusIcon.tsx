import { IconProps } from '@/types/types';
import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const PlusIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={PlusSignIcon} size={size} color={color} strokeWidth={stroke} />;
};
