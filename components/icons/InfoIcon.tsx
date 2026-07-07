import { IconProps } from '@/types/types';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const InfoIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={InformationCircleIcon} size={size} color={color} strokeWidth={stroke} />;
};
