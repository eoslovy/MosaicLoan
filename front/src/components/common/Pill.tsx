'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/components/Pill.module.scss';

export type PillVariant =
  | 'deposit'
  | 'withdraw'
  | 'investment-deposit'
  | 'investment-refund'
  | 'loan-deposit'
  | 'loan-repayment'
  | 'investing'
  | 'completed'
  | 'principal-repayment'
  | 'loan'
  | 'interest-repayment'
  | 'refund'
  | 'repayment-complete'
  | 'repayment-in-progress'
  | 'defaulted'
  | 'overdue';

interface PillProps {
  variant?: PillVariant;
  children: React.ReactNode;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ variant = 'deposit', children, className }) => {
  return (
    <span className={clsx(styles.pill, styles[variant], className)}>
      {children}
    </span>
  );
};

export default Pill; 