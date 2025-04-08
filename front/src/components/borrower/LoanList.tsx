'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanList.module.scss';
import type { PillVariant, SortState, SortKey } from '@/types/components';
import Pagination from '@/components/common/Pagination';
import Pill from '@/components/common/Pill';
import SortableTableHeader from '@/components/common/SortableTableHeader';
import { LoanTransaction } from '../../app/borrower/page';

const apiToSortKeyMapping: Record<string, string> = {
  loan: 'contractId',
  amount: 'amount',
  loanDate: 'createdAt',
  loanMaturityDate: 'dueDate',
  interestRate: 'interestRate',
};

const sortOrderMapping: { [key: string]: string } = {
  true: 'asc',
  false: 'desc',
};

const getStatusVariant = (status: string): PillVariant => {
  switch (status) {
    case '상환완료':
      return 'repayment-complete';
    case '상환중':
      return 'repayment-in-progress';
    case '부실':
    case '부실확정':
      return 'defaulted';
    case '연체':
      return 'overdue';
    default:
      return 'repayment-in-progress';
  }
};

interface LoanListProps {
  loans: LoanTransaction[];
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
    totalItemCount: number;
  };
  onPageChange: (page: number) => Promise<void>;
  onSortChange: (sortState: { field: string; order: string }[]) => void;
}

const LoanList: React.FC<LoanListProps> = ({
  loans,
  pagination,
  onPageChange,
  onSortChange,
}) => {
  const [sortStates, setSortStates] = useState<SortState[]>([]);

  const handleSort = (key: SortKey) => {
    let newSortStates: SortState[] = [...sortStates];

    const existingIndex = newSortStates.findIndex((s) => s.key === key);
    const existing = existingIndex !== -1 ? newSortStates[existingIndex] : null;

    if (!existing) {
      newSortStates.push({ key, ascending: true });
    } else if (existing.ascending) {
      newSortStates[existingIndex] = { ...existing, ascending: false };
    } else {
      newSortStates = newSortStates.filter((s) => s.key !== key);
    }

    setSortStates(newSortStates);
    console.log(newSortStates);

    const apiSortFormat = newSortStates.map((sort) => ({
      field: apiToSortKeyMapping[sort.key] || sort.key,
      order: sortOrderMapping[String(sort.ascending)],
    }));

    onSortChange(apiSortFormat);
  };

  return (
    <div className={styles.tableContainer}>
      {loans.length === 0 ? (
        <div className='text-center py-4 text-gray-500'>
          검색 결과가 없습니다.
        </div>
      ) : (
        <>
          <table className={styles.contractsTable}>
          <thead>
              <tr>
                <th>대출명</th>
                <th>
                  <SortableTableHeader
                    label='금액'
                    sortKey='amount'
                    sortStates={sortStates}
                    onSort={handleSort}
                  />
                </th>
                <th>
                  <SortableTableHeader
                    label='대출일'
                    sortKey='transactionDate'
                    sortStates={sortStates}
                    onSort={handleSort}
                  />
                </th>
                <th>
                  <SortableTableHeader
                    label='대출만기일'
                    sortKey='dueDate'
                    sortStates={sortStates}
                    onSort={handleSort}
                  />
                </th>
                <th>
                  <SortableTableHeader
                    label='금리'
                    sortKey='interestRate'
                    sortStates={sortStates}
                    onSort={handleSort}
                  />
                </th>
                <th>분류</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.contractId}</td>
                  <td>{loan.amount}</td>
                  <td>{loan.createdAt}</td>
                  <td>{loan.dueDate}</td>
                  <td>{loan.interestRate}</td>
                  <td>
                    <div className={styles.statusWrapper}>
                      <Pill variant={getStatusVariant(loan.status)}>
                        {loan.status}
                      </Pill>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination.totalPage > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPage}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LoanList;
