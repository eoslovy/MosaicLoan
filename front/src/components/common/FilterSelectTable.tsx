'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/components/FilterSelectTable.module.scss';
import type { PillVariant } from '@/types/components';
import Pill from '@/components/common/Pill';

interface Investment {
  investmentId: number;
  createdAt: string;
  investStatus: 'COMPLETED' | 'IN_PROGRESS';
  totalContractCount: number;
  statusDistribution: {
    completed: number;
    active: number;
    default: number;
    transferred: number;
  };
}

interface FilterSelectTableProps {
  data: Investment[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  columns: string[];
}

const getStatusVariant = (status: string | undefined): PillVariant => {
  switch (status) {
    case '완료':
    case '상환완료':
    case 'COMPLETED':
      return 'repayment-complete';
    case '진행중':
    case 'IN_PROGRESS':
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
      onSelect(data.map((item) => item.investmentId.toString()));
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
                        e.target.checked
                          ? data.map((item) => item.investmentId.toString())
                          : [],
                      )
                    }
                  />
                  <span className={styles.srOnly}>테이블 전체 선택</span>
                </label>
              </th>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.investmentId}>
                <td className={styles.checkboxCell}>
                  <label
                    htmlFor={`select-${item.investmentId}`}
                    className={styles.checkboxLabel}
                  >
                    <input
                      type='checkbox'
                      id={`select-${item.investmentId}`}
                      checked={selectedIds.includes(
                        item.investmentId.toString(),
                      )}
                      onChange={(e) =>
                        onSelect(
                          e.target.checked
                            ? [...selectedIds, item.investmentId.toString()]
                            : selectedIds.filter(
                                (id) => id !== item.investmentId.toString(),
                              ),
                        )
                      }
                    />
                    <span
                      className={styles.srOnly}
                    >{`INVEST - ${item.investmentId} 선택`}</span>
                  </label>
                </td>
                {columns.map((col) => {
                  if (col.includes('명')) {
                    return (
                      <td key={`${item.investmentId}-${col}`}>
                        <Pill variant={getStatusVariant(item.investStatus)}>
                          {`INVESR - ${item.investmentId}`}
                        </Pill>
                      </td>
                    );
                  }

                  if (col.includes('거래') || col.includes('건수')) {
                    return (
                      <td key={`${item.investmentId}-${col}`}>
                        {item.totalContractCount ?? '-'}
                      </td>
                    );
                  }

                  if (col.includes('시작')) {
                    return (
                      <td key={`${item.investmentId}-${col}`}>
                        {new Date(item.createdAt).toISOString().split('T')[0]}
                      </td>
                    );
                  }

                  if (col.includes('만기') || col.includes('종료')) {
                    return <td key={`${item.investmentId}-${col}`}>-</td>;
                  }

                  return <td key={`${item.investmentId}-${col}`}>-</td>;
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
