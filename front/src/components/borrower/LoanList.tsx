'use client';

import React from 'react';
import styles from '@/styles/borrowers/LoanList.module.scss';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PillVariant } from '@/types/components';
import Pagination from '@/components/common/Pagination';
import Pill from '@/components/common/Pill';
import { LoanTransaction } from '../../app/borrower/page';

interface LoanListProps {
  loans: LoanTransaction[];
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
    totalItemCount: number;
  };
  onPageChange: (page: number) => Promise<void>;
}

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

const LoanList: React.FC<LoanListProps> = ({ 
  loans, 
  pagination, 
  onPageChange 
}) => {
  return (
    <div className={styles.tableContainer}>
      {loans.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <>
          <table className={styles.contractsTable}>
            <thead>
              <tr>
                <th>대출명</th>
                <th>금액</th>
                <th>대출일</th>
                <th>대출만기일</th>
                <th>금리</th>
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
                  <td>{loan.interestRate}%</td>
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