'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/components/FilterSelectTable.module.scss';
import { FilterSelectTableProps, PillVariant } from '@/types/components';
import Pill from '@/components/common/Pill';

const getStatusVariant = (status: string | undefined): PillVariant => {
  switch (status) {
    case '완료':
    case '상환완료':
      return 'repayment-complete';
    case '진행중':
      return 'repayment-in-progress';
    default:
      return 'repayment-in-progress';
  }
};

const FilterSelectTable = ({
  data = [],
  selectedIds = [],
  onSelect,
  columns,
}: FilterSelectTableProps) => {
  const [allSelected, setAllSelected] = useState(false);

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
              <th className={styles.checkboxCell}>
                <label
                  htmlFor='selectAllTable'
                  className={styles.checkboxLabel}
                >
                  <input
                    type='checkbox'
                    id='selectAllTable'
                    checked={selectedIds.length === data.length}
                    onChange={(e) =>
                      onSelect(
                        e.target.checked ? data.map((row) => row.id) : [],
                      )
                    }
                  />
                  <span>전체선택</span>
                </label>
              </th>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className={styles.checkboxCell}>
                  <label
                    htmlFor={`select-${row.id}`}
                    className={styles.checkboxLabel}
                  >
                    <input
                      type='checkbox'
                      id={`select-${row.id}`}
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) =>
                        onSelect(
                          e.target.checked
                            ? [...selectedIds, row.id]
                            : selectedIds.filter((id) => id !== row.id),
                        )
                      }
                    />
                    <span>선택</span>
                  </label>
                </td>
                {columns.map((col) => {
                  if (col.includes('명')) {
                    return (
                      <td key={`${row.id}-${col}`}>
                        <Pill variant={getStatusVariant(row.status)}>
                          {row.name}
                        </Pill>
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
