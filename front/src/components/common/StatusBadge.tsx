'use client';

import React from 'react';
import styles from '@/styles/components/StatusBadge.module.scss';
import { StatusBadgeProps } from '@/types/components';
import clsx from 'clsx';

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClass = {
    상환완료: styles.success,
    상환중: styles.warning,
    부실: styles.danger,
  }[status];

  return <span className={clsx(styles.badge, statusClass)}>{status}</span>;
};

export default StatusBadge;
