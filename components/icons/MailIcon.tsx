import { IconProps } from '@/types/types';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const MailIcon = ({ size, color ,stroke }: IconProps) => {
  return <HugeiconsIcon icon={Mail01Icon} size={size} color={color} strokeWidth={stroke} />;
};
