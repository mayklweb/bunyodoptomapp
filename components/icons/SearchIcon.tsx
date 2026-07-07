import { IconProps } from '@/types/types';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const SearchIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={Search01Icon} size={size} color={color} strokeWidth={stroke} />;
};
