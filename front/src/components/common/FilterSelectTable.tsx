'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/components/FilterSelectTable.module.scss';
import { FilterSelectTableProps } from '@/types/components';

const FilterSelectTable: React.FC<FilterSelectTableProps> = ({
  data = [],
  selectedIds = [],
  onSelect,
  columns,
}) => {
  const [allSelected, setAllSelected] = useState(false);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((item) => item !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      onSelect([]);
    } else {
      onSelect(data.map((row) => row.id));
    }
  };

  useEffect(() => {
    setAllSelected(selectedIds.length === data.length && data.length > 0);
  }, [selectedIds, data]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <label htmlFor='selectAll' className={styles.checkboxLabel}>
          <input
            type='checkbox'
            id='selectAll'
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <span>전체선택</span>
        </label>
        <span className={styles.count}>
          총 {data.length}건 중 {selectedIds.length}건
        </span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>선택</th>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type='checkbox'
                      id={`select-${row.id}`}
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelection(row.id)}
                      aria-labelledby={`label-${row.id}`}
                    />
                    <label
                      id={`label-${row.id}`}
                      htmlFor={`select-${row.id}`}
                      className={styles.checkboxLabel}
                    >
                      <span className='sr-only'>{row.name} 선택</span>
                    </label>
                  </div>
                </td>

                {/* 컬럼 순서대로 동적 렌더링 */}
                {columns.map((col) => {
                  if (col.includes('명')) {
                    return (
                      <td key={`${row.id}-${col}`}>
                        <span
                          className={
                            row.status === '완료' || row.status === '상환완료'
                              ? styles.finishedBadge
                              : styles.ongoingBadge
                          }
                        >
                          {row.name}
                        </span>
                      </td>
                    );
                  }

                  if (col.includes('거래') || col.includes('건수')) {
                    return <td key={`${row.id}-${col}`}>{row.count ?? '-'}</td>;
                  }

                  if (col.includes('시작')) {
                    return <td key={`${row.id}-${col}`}>{row.startDate}</td>;
                  }

                  if (col.includes('만기') || col.includes('종료')) {
                    return (
                      <td key={`${row.id}-${col}`}>{row.endDate ?? '-'}</td>
                    );
                  }

                  return <td key={`${row.id}-${col}`}>-</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilterSelectTable;
