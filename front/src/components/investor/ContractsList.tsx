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
import { format, parseISO } from 'date-fns';
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
    case 'PENDING':
      return 'success';
    case 'IN_PROGRESS':
      return 'investing';
    case 'COMPLETED':
      return 'completed';
    case 'PARTIALLY_DELINQUENT':
      return 'defaulted';
    case 'DELINQUENT':
      return 'danger';
    default:
      return 'principal-repayment';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return '대출 신청';
    case 'IN_PROGRESS':
      return '진행 중';
    case 'COMPLETED':
      return '완료';
    case 'PARTIALLY_DELINQUENT':
      return '일부 연체';
    case 'DELINQUENT':
      return '연체';
    default:
      return '-';
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
              {getStatusText(transaction.status)}
            </Pill>
          ),
        },
      ],
    };
  };

  const rows: BasicTableRow[] = isLoading
    ? []
    : transactions.map(formatTransactionForDisplay);

  const formatTransactionsToRows = (
    investTransactions: Transaction[],
  ): BasicTableRow[] => {
    const uniqueKeys = new Set();

    return investTransactions
      .filter((transaction) => {
        const key = `${transaction.contractId}-${transaction.investmentId}`;
        if (uniqueKeys.has(key)) {
          return false;
        }
        uniqueKeys.add(key);
        return true;
      })
      .map((transaction) => ({
        key: `${transaction.contractId}-${transaction.investmentId}`,
        cells: [
          {
            key: 'investmentId',
            content: `상품번호 - ${transaction.investmentId}`,
          },
          {
            key: 'contractId',
            content: `contract - ${transaction.contractId}`,
          },
          {
            key: 'createdAt',
            content:
              format(parseISO(transaction.createdAt), 'yyyy-MM-dd') || '-',
          },
          {
            key: 'dueDate',
            content: transaction.dueDate,
          },
          {
            key: 'amount',
            content: Math.round(
              Number(transaction.amount) || 0,
            ).toLocaleString(),
          },
          {
            key: 'interestRate',
            content: transaction.interestRate
              ? `${(Number(transaction.interestRate) / 100).toFixed(2)} %`
              : '-',
          },
          {
            key: 'status',
            content: (
              <Pill variant={getTypeVariant(transaction.status)}>
                {transaction.status}
              </Pill>
            ),
          },
        ],
      }));
  };

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
    '금리',
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
            rows={hasTransactions ? formatTransactionsToRows(transactions) : []}
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
