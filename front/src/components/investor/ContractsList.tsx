'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/investors/ContractsList.module.scss';
import BasicTable from '@/components/common/BasicTable';
import SortableTableHeader from '@/components/common/SortableTableHeader';
import Pagination from '@/components/common/Pagination';
import type {
  BasicTableRow,
  SortState,
  SortKey,
  PillVariant,
} from '@/types/components';
import Pill from '@/components/common/Pill';

interface Transaction {
  id: number;
  contractId: number;
  investmentId: number;
  amount: string;
  createdAt: string;
  status: string;
  bondMaturity: string;
  interestRate: string;
}

const apiToSortKeyMapping: Record<string, string> = {
  product: 'investmentId',
  bond: 'contractId',
  transactionDate: 'createdAt',
  maturityDate: 'bondMaturity',
  interestRate: 'interestRate',
};

const sortOrderMapping: { [key: string]: string } = {
  true: 'asc',
  false: 'desc',
};

const getTypeVariant = (type: string): PillVariant => {
  switch (type) {
    case '원금 상환':
    case '원금상환':
      return 'principal-repayment';
    case '이자상환':
      return 'interest-repayment';
    case '대출':
      return 'loan';
    case '환급':
      return 'refund';
    default:
      return 'principal-repayment';
  }
};

interface ContractsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (sortState: { field: string; order: string }[]) => void;
}

const ContractsList = ({
  transactions,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
}: ContractsListProps) => {
  const [sortStates, setSortStates] = useState<SortState[]>([]);

  const handleSort = (key: SortKey) => {
    const newSortStates = (() => {
      const existing = sortStates.find((s) => s.key === key);

      if (!existing) {
        return [...sortStates, { key, ascending: true }];
      }
      if (existing.ascending) {
        return sortStates.map((s) =>
          s.key === key ? { ...s, ascending: false } : s,
        );
      }
      return sortStates.filter((s) => s.key !== key);
    })();

    setSortStates(newSortStates);
    console.log(newSortStates);

    const apiSortFormat = newSortStates.map((sort) => ({
      field: apiToSortKeyMapping[sort.key] || sort.key,
      order: sortOrderMapping[String(sort.ascending)] || 'unsorted',
    }));

    onSortChange(apiSortFormat);
  };

  const formatTransactionForDisplay = (transaction: Transaction) => {
    return {
      key: `transaction-${transaction.id}`,
      cells: [
        {
          key: `product-${transaction.id}`,
          content: `INVEST-${transaction.investmentId}`,
        },
        {
          key: `bond-${transaction.id}`,
          content: `BOND-${transaction.contractId}`,
        },
        {
          key: `date-${transaction.id}`,
          content: transaction.createdAt,
        },
        {
          key: `maturity-${transaction.id}`,
          content: transaction.bondMaturity,
        },
        {
          key: `amount-${transaction.id}`,
          content: `+W ${transaction.amount}`,
        },
        {
          key: `rate-${transaction.id}`,
          content: transaction.interestRate,
        },
        {
          key: `type-${transaction.id}`,
          content: (
            <Pill variant={getTypeVariant(transaction.status)}>
              {transaction.status}
            </Pill>
          ),
        },
      ],
    };
  };

  const rows: BasicTableRow[] = isLoading
    ? []
    : transactions.map(formatTransactionForDisplay);

  const columnHeaders = [
    <SortableTableHeader
      key='product'
      label='상품명'
      sortKey='product'
      sortStates={sortStates}
      onSort={handleSort}
    />,
    <SortableTableHeader
      key='bond'
      label='채권명'
      sortKey='bond'
      sortStates={sortStates}
      onSort={handleSort}
    />,
    <SortableTableHeader
      key='transactionDate'
      label='거래 날짜'
      sortKey='transactionDate'
      sortStates={sortStates}
      onSort={handleSort}
    />,
    <SortableTableHeader
      key='maturityDate'
      label='채권 만기일'
      sortKey='maturityDate'
      sortStates={sortStates}
      onSort={handleSort}
    />,
    '거래 금액',
    <SortableTableHeader
      key='interestRate'
      label='금리'
      sortKey='interestRate'
      sortStates={sortStates}
      onSort={handleSort}
    />,
    '분류',
  ];

  const hasTransactions = transactions && transactions.length > 0;

  return (
    <div className={styles.tableContainer}>
      {isLoading ? (
        <div>데이터 로딩 중...</div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : (
        <>
          <BasicTable
            title='채권 거래 내역'
            columns={columnHeaders}
            rows={rows}
          />
          {hasTransactions && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ContractsList;
