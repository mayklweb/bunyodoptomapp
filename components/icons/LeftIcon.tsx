import { IconProps } from '@/types/types';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const LeftIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={ArrowLeft01Icon} size={size} color={color} strokeWidth={stroke} />;
};
