import clsx from 'clsx';
import { TextProps } from '@/types/components';
import styles from '@/styles/components/Text.module.scss';

const Text = ({
  text,
  size = 'md',
  color = 'black',
  weight = 'regular',
  className = '',
}: TextProps) => {
const combinedClassName = clsx(
  styles.text,
  styles[`text--size-${size}`],
  styles[`text--color-${color}`],
  styles[`text--weight-${weight}`],
  className,
);

  return <span className={combinedClassName}>{text}</span>;
};

export default Text;
