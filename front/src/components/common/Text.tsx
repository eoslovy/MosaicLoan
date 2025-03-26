import clsx from 'clsx';
import { TextProps, TextColor, TextSize, TextWeight } from '@/types/components';

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
  'text-4xl': 'text-4xl',
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

const weightClasses: Record<TextWeight, string> = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
};

const Text = ({
  text,
  size = 'md',
  color = 'black',
  weight = 'normal',
  className = '',
}: TextProps) => {
  const combinedClassName = clsx(
    'inline-block',
    sizeClasses[size],
    colorClasses[color],
    weightClasses[weight],
    className,
  );

  return <span className={combinedClassName}>{text}</span>;
};

export default Text;
