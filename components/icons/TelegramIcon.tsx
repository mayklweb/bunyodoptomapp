import { IconProps } from '@/types/types';
import { TelegramIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const TeleIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={TelegramIcon} size={size} color={color} strokeWidth={stroke} />;
};
