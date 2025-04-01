'use client';

import React from 'react';
import styles from '@/styles/components/Pill.module.scss';
import { PillVariant } from '@/types/components';
import { X } from 'lucide-react';

export interface PillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium';
  onClose?: () => void;
}

const Pill = ({
  variant,
  children,
  className = '',
  size = 'medium',
  onClose,
}: PillProps) => {
  return (
    <span
      className={`${styles.pill} ${styles[variant]} ${styles[size]} ${className}`}
    >
      {children}
      {onClose && (
        <button type='button' className={styles.closeButton} onClick={onClose}>
          <X size={size === 'small' ? 14 : 16} />
        </button>
      )}
    </span>
  );
};

Pill.defaultProps = {
  className: '',
  size: 'medium',
  onClose: undefined,
};

export default Pill;
