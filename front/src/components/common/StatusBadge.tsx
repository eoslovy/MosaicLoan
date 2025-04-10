'use client';

import React from 'react';
import styles from '@/styles/components/StatusBadge.module.scss';
import { StatusBadgeProps } from '@/types/components';
import clsx from 'clsx';

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClass = {
    COMPLETED: styles.success,
    IN_PROGRESS: styles.warning,
    DELINQUENT: styles.danger,
  }[status];

  return <span className={clsx(styles.badge, statusClass)}>{status}</span>;
};

export default StatusBadge;
