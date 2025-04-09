'use client';

import React from 'react';
import styles from '@/styles/empty/InvestorEmptyState.module.scss';
import type { EmptyStateProps } from '@/types/pages';

const EmptyState: React.FC<EmptyStateProps> = ({
  message = '표시할 정보가 없습니다.',
  className = '',
  isComponentLevel = false,
  preserveHeight = true,
  minHeight = '120px',
}) => {
  const containerClass = isComponentLevel
    ? `${styles.emptyComponent} ${className}`
    : `${styles.emptyWrapper} ${className}`;

  const style = isComponentLevel && preserveHeight ? { minHeight } : {};

  return (
    <div className={containerClass} style={style}>
      <p className={isComponentLevel ? styles.emptyMessage : styles.message}>
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
