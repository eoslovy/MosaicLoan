'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanList.module.scss';
import type { PillVariant, SortState, SortKey } from '@/types/components';
import Pagination from '@/components/common/Pagination';
import Pill from '@/components/common/Pill';
import SortableTableHeader from '@/components/common/SortableTableHeader';
import { LoanTransaction } from '@/types/components';
import { Info } from 'lucide-react';
import request from '@/service/apis/request';

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
    case 'PENDING':
      return 'info';
    case 'IN_PROGRESS':
      return 'investing';
    case 'COMPLETED':
      return 'success';
    case 'PARTIALLY_DELINQUENT':
      return 'overdue';
    case 'DELINQUENT':
      return 'overdue';
    default:
      return 'defaulted';
  }
};

const statusMap = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '대출 신청';
    case 'IN_PROGRESS':
      return '진행중';
    case 'COMPLETED':
      return '완료';
    case 'PARTIALLY_DELINQUENT':
      return '일부연체';
    case 'DELINQUENT':
      return '연체';
    default:
      return '';
  }
};

interface TransactionDetail {
  contractId: number | string;
  loanId: string;
  amount: string;
  createdAt: string;
  status: string;
}

interface TransactionResponse {
  transactions: TransactionDetail[];
}

interface TransactionWithBalance extends TransactionDetail {
  balance: string;
}

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loanDetails, setLoanDetails] = useState<TransactionWithBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentLoanId, setCurrentLoanId] = useState<string | null>(null);
  const [currentLoan, setCurrentLoan] = useState<LoanTransaction | null>(null);

  const extractAmount = (amountStr: string): number => {
    return Number(amountStr.replace(/[^0-9]/g, ''));
  };

  const calculateBalance = (
    transactions: TransactionDetail[],
    totalAmount: string,
  ): TransactionWithBalance[] => {
    let balance = 0;
    let initialLoanAmount = 0;

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (a.status === '대출실행') return -1;
      if (b.status === '대출실행') return 1;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return sortedTransactions.map((transaction, index) => {
      const transactionAmount = extractAmount(transaction.amount);

      if (index === 0 || transaction.status === '대출실행') {
        if (transaction.status === '대출실행') {
          initialLoanAmount = transactionAmount;
          balance = initialLoanAmount;
        } else {
          initialLoanAmount = extractAmount(totalAmount);
          balance = initialLoanAmount;
        }
      }

      if (transaction.status === '원금상환') {
        balance -= transactionAmount;
      }

      const formattedBalance = `₩ ${balance.toLocaleString()}`;

      return {
        ...transaction,
        balance: formattedBalance,
      };
    });
  };

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

    const apiSortFormat = newSortStates.map((sort) => ({
      field: apiToSortKeyMapping[sort.key] || sort.key,
      order: sortOrderMapping[String(sort.ascending)],
    }));

    onSortChange(apiSortFormat);
  };

  const handleToggleClick = async (loan: LoanTransaction) => {
    setLoading(true);
    setCurrentLoanId(loan.id.toString());
    setCurrentLoan(loan);

    try {
      const response = await request.GET<TransactionResponse>(
        `/contract/loans/${loan.id}/transactions`,
      );
      const detailsWithBalance = calculateBalance(
        response.transactions,
        loan.amount,
      );
      setLoanDetails(detailsWithBalance);
      setIsModalOpen(true);
    } catch (error) {
      console.error('대출 상세 정보를 불러오는 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoanDetails([]);
    setCurrentLoanId(null);
  };

  return (
    <div className={styles.tableContainer}>
      {!loans || loans.length === 0 ? (
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
                  금리
                  {/* <SortableTableHeader
                    label='금리'
                    sortKey='interestRate'
                    sortStates={sortStates}
                    onSort={handleSort}
                  /> */}
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
                  <td>
                    {loan.interestRate
                      ? loan.interestRate.toLocaleString()
                      : '-'}
                  </td>
                  <td>
                    <div className={styles.statusWrapper}>
                      <Pill variant={getStatusVariant(loan.status)}>
                        {statusMap(loan.status)}
                      </Pill>
                      {loan.status === 'DELIQUENT' && (
                        <button
                          className={styles.toggleButton}
                          onClick={() => handleToggleClick(loan)}
                          disabled={
                            loading && currentLoanId === loan.id.toString()
                          }
                          aria-label='상세 정보 보기'
                          type='button'
                        >
                          <Info size={16} />
                        </button>
                      )}
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

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>대출 상세 정보</h2>
              <button
                className={styles.closeButton}
                onClick={closeModal}
                aria-label='닫기'
                type='button'
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              {loanDetails.length > 0 ? (
                <table className={styles.detailsTable}>
                  <thead>
                    <tr>
                      <th>날짜</th>
                      <th>거래 금액</th>
                      <th>대출 잔액</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanDetails.map((detail, index) => (
                      <tr
                        key={`transaction-${detail.contractId}-${detail.createdAt}`}
                      >
                        <td>{detail.createdAt}</td>
                        <td>{detail.amount}</td>
                        <td>{detail.balance}</td>
                        <td>{detail.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>거래 내역이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanList;
