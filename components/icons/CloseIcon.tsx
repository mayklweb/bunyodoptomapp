import { IconProps } from '@/types/types';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const CloseIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Cancel01Icon} size={size} color={color} strokeWidth={stroke} />;
};
