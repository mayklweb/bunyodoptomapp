import { IconProps } from '@/types/types';
import { Edit03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const EditIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Edit03Icon} size={size} color={color} strokeWidth={stroke} />;
};
