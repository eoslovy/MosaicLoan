import clsx from 'clsx';
import { TextProps, TextColor, TextSize } from '@/types/components';

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
  'text-4xl': 'text-4xl font-bold',
};

const colorClasses: Record<TextColor, string> = {
  white: 'text-white',
  gray: 'text-gray-500',
  'light-blue': 'text-sky-400',
  blue: 'text-blue-500',
  black: 'text-black',
  'text-ascendRed': 'text-red-500',
  'text-descentBlue': 'text-blue-300',
};

const Text = ({
  text,
  size = 'md',
  color = 'black',
  className = '',
}: TextProps) => {
  const combinedClassName = clsx(
    'inline-block',
    sizeClasses[size],
    colorClasses[color],
    className,
  );

  return <span className={combinedClassName}>{text}</span>;
};

export default Text;
