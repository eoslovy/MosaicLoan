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

  return (
    <div onClick={() => onSort(sortKey)} className={styles.sortableHeader}>
      {label}
      {!isActive && (
        <ChevronDown size={16} className={styles.inactiveIcon} /> // 디폴트 회색
      )}
      {isActive && isAscending && (
        <ChevronUp size={16} className={styles.activeIcon} /> // 검정 위쪽화살표표
      )}
      {isActive && isAscending === false && (
        <ChevronDown size={16} className={styles.activeIcon} /> // 검정 , 아래쪽으로 화살표표
      )}
    </div>
  );
};


export default SortableTableHeader;
