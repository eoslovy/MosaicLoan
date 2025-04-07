'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/components/FilterSelectTable.module.scss';
import type { PillVariant } from '@/types/components';
import Pill from '@/components/common/Pill';
import { ContractRow } from '@/types/components';

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
  data: Investment[] | ContractRow[];
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
      onSelect(
        data.map((item) =>
          'investmentId' in item ? item.investmentId.toString() : item.id,
        ),
      );
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
                          ? data.map((item) =>
                              'investmentId' in item
                                ? item.investmentId.toString()
                                : item.id,
                            )
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
              <tr key={'investmentId' in item ? item.investmentId : item.id}>
                <td className={styles.checkboxCell}>
                  <label
                    htmlFor={`select-${'investmentId' in item ? item.investmentId : item.id}`}
                    className={styles.checkboxLabel}
                  >
                    <input
                      type='checkbox'
                      id={`select-${'investmentId' in item ? item.investmentId : item.id}`}
                      checked={selectedIds.includes(
                        'investmentId' in item
                          ? item.investmentId.toString()
                          : item.id,
                      )}
                      onChange={(e) =>
                        onSelect(
                          e.target.checked
                            ? [
                                ...selectedIds,
                                'investmentId' in item
                                  ? item.investmentId.toString()
                                  : item.id,
                              ]
                            : selectedIds.filter(
                                (id) =>
                                  id !==
                                  ('investmentId' in item
                                    ? item.investmentId.toString()
                                    : item.id),
                              ),
                        )
                      }
                    />
                    <span className={styles.srOnly}>
                      {`${'investmentId' in item ? 'INVEST' : 'LOAN'} - ${'investmentId' in item ? item.investmentId : item.id} 선택`}
                    </span>
                  </label>
                </td>
                {columns.map((col) => {
                  if (col.includes('명')) {
                    return (
                      <td
                        key={`${'investmentId' in item ? item.investmentId : item.id}-${col}`}
                      >
                        <Pill
                          variant={getStatusVariant(
                            'investmentId' in item
                              ? item.investStatus
                              : item.status,
                          )}
                        >
                          {`${'investmentId' in item ? 'INVEST' : 'LOAN'} - ${'investmentId' in item ? item.investmentId : item.id}`}
                        </Pill>
                      </td>
                    );
                  }

                  if (col.includes('거래') || col.includes('건수')) {
                    return (
                      <td
                        key={`${'investmentId' in item ? item.investmentId : item.id}-${col}`}
                      >
                        {'investmentId' in item
                          ? (item.totalContractCount ?? '-')
                          : '-'}
                      </td>
                    );
                  }

                  if (col.includes('시작')) {
                    return (
                      <td
                        key={`${'investmentId' in item ? item.investmentId : item.id}-${col}`}
                      >
                        {'investmentId' in item
                          ? new Date(item.createdAt).toISOString().split('T')[0]
                          : item.startDate}
                      </td>
                    );
                  }

                  if (col.includes('만기') || col.includes('종료')) {
                    return (
                      <td
                        key={`${'investmentId' in item ? item.investmentId : item.id}-${col}`}
                      >
                        {'investmentId' in item ? '-' : item.endDate}
                      </td>
                    );
                  }

                  return (
                    <td
                      key={`${'investmentId' in item ? item.investmentId : item.id}-${col}`}
                    >
                      -
                    </td>
                  );
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
