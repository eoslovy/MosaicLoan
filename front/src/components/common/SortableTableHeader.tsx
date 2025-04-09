'use client';

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from '@/styles/components/SortableTableHeader.module.scss';
import { SortableTableHeaderProps } from '@/types/components';

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  label,
  sortKey,
  sortStates,
  onSort,
}) => {
  const sortState = sortStates.find((s) => s.key === sortKey);
  const isActive = !!sortState;
  const isAscending = sortState?.ascending;

  const handleSort = () => {
    onSort(sortKey);
  };

  return (
    <button
      type='button'
      onClick={handleSort}
      className={styles.sortableHeader}
    >
      {label}
      {!isActive && <ChevronDown size={16} className={styles.inactiveIcon} />}
      {isActive && isAscending && (
        <ChevronUp size={16} className={styles.activeIcon} />
      )}
      {isActive && isAscending === false && (
        <ChevronDown size={16} className={styles.activeIcon} />
      )}
    </button>
  );
};

export default SortableTableHeader;
