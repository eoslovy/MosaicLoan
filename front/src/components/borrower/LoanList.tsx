'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanList.module.scss';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Loan } from '@/types/pages';
import type { PillVariant } from '@/types/components';
import Pagination from '@/components/common/Pagination';
import Pill from '@/components/common/Pill';

const mockLoans: Loan[] = [
  {
    id: 'loan-1',
    name: '대출 A',
    amount: '₩ 10,000,000',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    rate: '6.5%',
    status: '상환중',
    details: [
      {
        date: '2024-03-01',
        amount: '₩ 100,000',
        balance: '₩ 9,900,000',
        type: '이자 납부',
      },
      {
        date: '2024-06-01',
        amount: '₩ 1,000,000',
        balance: '₩ 8,900,000',
        type: '원금 상환',
      },
    ],
  },
  {
    id: 'loan-2',
    name: '대출 B',
    amount: '₩ 20,000,000',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    rate: '7.0%',
    status: '상환완료',
    details: [
      {
        date: '2024-03-15',
        amount: '₩ 120,000',
        balance: '₩ 0',
        type: '완납',
      },
    ],
  },
];

const itemsPerPage = 10;

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

const LoanList = () => {
  const [openRowIds, setOpenRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockLoans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLoans = mockLoans.slice(startIndex, startIndex + itemsPerPage);

  const toggleRow = (id: string) => {
    setOpenRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.contractsTable}>
        <thead>
          <tr>
            <th>대출명</th>
            <th>금액</th>
            <th>대출일</th>
            <th>대출만기일</th>
            <th>금리</th>
            <th>분류</th>
            <th>상세</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLoans.map((loan) => (
            <React.Fragment key={loan.id}>
              <tr>
                <td>{loan.name}</td>
                <td>{loan.amount}</td>
                <td>{loan.startDate}</td>
                <td>{loan.endDate}</td>
                <td>{loan.rate}</td>
                <td>
                  <div className={styles.statusWrapper}>
                    <Pill variant={getStatusVariant(loan.status)}>
                      {loan.status}
                    </Pill>
                  </div>
                </td>
                <td>
                  <button
                    type='button'
                    onClick={() => toggleRow(loan.id)}
                    className={styles.expandButton}
                    aria-label={`${loan.name} 거래내역 ${
                      openRowIds.includes(loan.id) ? '접기' : '펼치기'
                    }`}
                  >
                    {openRowIds.includes(loan.id) ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </td>
              </tr>
              {openRowIds.includes(loan.id) && (
                <tr className={styles.expandedRow}>
                  <td colSpan={7}>
                    <table className={styles.subTable}>
                      <thead>
                        <tr>
                          <th>날짜</th>
                          <th>거래액</th>
                          <th>대출잔액</th>
                          <th>거래유형</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loan.details.map((tx) => (
                          <tr key={`${loan.id}-${tx.date}-${tx.type}`}>
                            <td>{tx.date}</td>
                            <td>{tx.amount}</td>
                            <td>{tx.balance}</td>
                            <td>{tx.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LoanList;
