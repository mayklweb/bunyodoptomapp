import { IconProps } from '@/types/types';
import { MinusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const MinusIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={MinusSignIcon} size={size} color={color} strokeWidth={stroke} />;
};
