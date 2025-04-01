import React from 'react';
import styles from '@/styles/components/Pill.module.scss';
import { PillVariant } from '@/types/components';

export interface PillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

const Pill = ({ variant, children, className }: PillProps) => {
  return (
    <span className={`${styles.pill} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

Pill.defaultProps = {
  className: '',
};

export default Pill;
