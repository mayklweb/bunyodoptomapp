import { IconProps } from '@/types/types';
import { Location01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const LocationIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Location01Icon} size={size} color={color} strokeWidth={stroke} />;
};
