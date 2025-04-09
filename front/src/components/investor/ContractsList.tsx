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
  contractId: number;
  investmentId: number;
  amount: string;
  createdAt: string;
  status: string;
  dueDate: string;
  interestRate: string;
}

const apiToSortKeyMapping: Record<string, string> = {
  product: 'investmentId',
  bond: 'contractId',
  transactionDate: 'createdAt',
  dueDate: 'dueDate',
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

  const formatTransactionForDisplay = (transaction: Transaction) => {
    return {
      key: `transaction-${transaction.contractId}`,
      cells: [
        {
          key: `product-${transaction.contractId}`,
          content: `INVEST-${transaction.investmentId}`,
        },
        {
          key: `bond-${transaction.contractId}`,
          content: `BOND-${transaction.contractId}`,
        },
        {
          key: `date-${transaction.contractId}`,
          content: transaction.createdAt,
        },
        {
          key: `dueDate-${transaction.contractId}`,
          content: transaction.dueDate,
        },
        {
          key: `amount-${transaction.contractId}`,
          content: `+W ${transaction.amount}`,
        },
        {
          key: `rate-${transaction.contractId}`,
          content: transaction.interestRate,
        },
        {
          key: `type-${transaction.contractId}`,
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
      key='dueDate'
      label='채권 만기일'
      sortKey='dueDate'
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
