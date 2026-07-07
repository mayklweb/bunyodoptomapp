import { IconProps } from '@/types/types';
import { QuestionIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export const SupportIcon = ({ size, color, stroke }: IconProps) => {
  return <HugeiconsIcon icon={QuestionIcon} size={size} color={color} strokeWidth={stroke} />;
};
