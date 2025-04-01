'use client';

import { useState, useEffect } from 'react';
import { AccountTransaction, PaginationInfo } from '@/types/pages';
import BasicTable from '@/components/common/BasicTable';
import Pagination from '@/components/common/Pagination';
import type { PillVariant } from '@/types/components';
import styles from '@/styles/my/MyAccountTransactionList.module.scss';
import Pill from '@/components/common/Pill';

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'EXTERNAL_IN':
      return '입금';
    case 'EXTERNAL_OUT':
      return '출금';
    case 'INVESTMENT_IN':
      return '투자금 환급';
    case 'INVESTMENT_OUT':
      return '투자금 입금';
    case 'LOAN_IN':
      return '대출금 입금';
    case 'LOAN_OUT':
      return '대출금 상환';
    default:
      return type;
  }
};

const getPaginatedTransactions = (
  data: AccountTransaction[],
  page: number,
  pageSize: number,
): AccountTransaction[] => {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
};

const getTypeVariant = (type: string): PillVariant => {
  switch (type) {
    case 'INVESTMENT_IN':
      return 'investment-in';
    case 'INVESTMENT_OUT':
      return 'investment-out';
    case 'LOAN_IN':
      return 'loan-in';
    case 'LOAN_OUT':
      return 'loan-out';
    case 'EXTERNAL_IN':
      return 'external-in';
    case 'EXTERNAL_OUT':
      return 'external-out';
    default:
      return 'external-in';
  }
};

const MyAccountTransactionList = () => {
  const mockTransactions: AccountTransaction[] = [
    {
      amount: 1000000000,
      cash: 1000000000,
      type: 'INVESTMENT_OUT',
      content: '투자상품1 신설',
      createdAt: '2025-03-25',
      targetId: 101,
    },
    {
      amount: 1000000000,
      cash: 1000000000,
      type: 'INVESTMENT_IN',
      content: '투자상품1 종료',
      createdAt: '2025-03-25',
      targetId: 102,
    },
    {
      amount: 1000000000,
      cash: 1000000000,
      type: 'EXTERNAL_OUT',
      content: '출금',
      createdAt: '2025-03-25',
      targetId: 0,
    },
    {
      amount: 1000000000,
      cash: 1000000000,
      type: 'LOAN_IN',
      content: '대출 시작한다',
      createdAt: '2025-03-25',
      targetId: 201,
    },
  ];

  const mockPagination: PaginationInfo = {
    page: 1,
    pageSize: 10,
    totalPage: 3,
    totalItemCount: 25,
  };

  // 상태연결
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>(mockPagination);

  // 초기설정
  useEffect(() => {
    setTransactions(mockTransactions);
    setPagination(mockPagination);
  }, []);

  // 거래 내역 컬럼
  const tableColumns = ['거래일', '금액', '잔액', '내용', '유형', ''];

  const pagedTransactions = getPaginatedTransactions(
    transactions,
    pagination.page,
    pagination.pageSize,
  );

  return (
    <section className={styles.container}>
      <BasicTable
        title='계좌 입출금 내역'
        columns={tableColumns}
        rows={pagedTransactions.map((tx, idx) => ({
          key: `tx-${idx}`,
          cells: [
            {
              key: `date-${idx}`,
              content: <span className={styles.cellWrap}>{tx.createdAt}</span>,
            },
            {
              key: `amount-${idx}`,
              content: (
                <span className={styles.cellWrap}>
                  {tx.amount.toLocaleString()} ₩
                </span>
              ),
            },
            {
              key: `cash-${idx}`,
              content: (
                <span className={styles.cellWrap}>
                  {tx.cash.toLocaleString()} ₩
                </span>
              ),
            },
            {
              key: `content-${idx}`,
              content: <span className={styles.cellWrap}>{tx.content}</span>,
            },
            {
              key: `type-${idx}`,
              content: (
                <Pill
                  variant={getTypeVariant(tx.type)}
                  className={styles.cellWrap}
                >
                  {getTypeLabel(tx.type)}
                </Pill>
              ),
            },
            {
              key: `action-${idx}`,
              content: (
                <button type='button' className={styles.cellWrap}>
                  상세
                </button>
              ),
            },
          ],
        }))}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPage}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </section>
  );
};

export default MyAccountTransactionList;
