import { IconProps } from '@/types/types';
import { File02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const FileIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={File02Icon} size={size} color={color} strokeWidth={stroke} />;
};
