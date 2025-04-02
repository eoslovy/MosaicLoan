'use client';

import React from 'react';
import styles from '@/styles/empty/InvestorEmptyState.module.scss';
import type { EmptyStateProps } from '@/types/pages';

const EmptyState: React.FC<EmptyStateProps> = ({
  message = '표시할 정보가 없습니다.',
}) => {
  return (
    <div className={styles.emptyWrapper}>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default EmptyState;
