'use client';

import React, { useState } from 'react';
import styles from '@/styles/investors/ContractsList.module.scss';
import BasicTable from '@/components/common/BasicTable';
import SortableTableHeader from '@/components/common/SortableTableHeader';
import Pagination from '@/components/common/Pagination';
import type { BasicTableRow, SortState, SortKey } from '@/types/components';

interface Contract {
  id: string;
  product: string;
  bond: string;
  transactionDate: string;
  bondMaturity: string;
  amount: string;
  interestRate: string;
  type: string;
}

const contracts: Contract[] = [
  {
    id: '1',
    product: 'INVEST-A',
    bond: 'BOND-1',
    transactionDate: '2025-03-01',
    bondMaturity: '2025-09-01',
    amount: '+W 10,000',
    interestRate: '6.5%',
    type: '원금 상환',
  },
  {
    id: '2',
    product: 'INVEST-A',
    bond: 'BOND-1',
    transactionDate: '2025-03-02',
    bondMaturity: '2025-09-01',
    amount: '+W 15,000',
    interestRate: '6.5%',
    type: '이자상환',
  },
  {
    id: '3',
    product: 'INVEST-A',
    bond: 'BOND-2',
    transactionDate: '2025-03-03',
    bondMaturity: '2025-09-01',
    amount: '+W 20,000',
    interestRate: '6.5%',
    type: '원금 상환',
  },
  {
    id: '4',
    product: 'INVEST-A',
    bond: 'BOND-2',
    transactionDate: '2025-03-04',
    bondMaturity: '2025-09-01',
    amount: '+W 25,000',
    interestRate: '6.5%',
    type: '이자상환',
  },
  {
    id: '5',
    product: 'INVEST-A',
    bond: 'BOND-3',
    transactionDate: '2025-03-05',
    bondMaturity: '2025-09-01',
    amount: '+W 30,000',
    interestRate: '6.5%',
    type: '원금 상환',
  },
  {
    id: '6',
    product: 'INVEST-B',
    bond: 'BOND-3',
    transactionDate: '2025-03-06',
    bondMaturity: '2025-09-01',
    amount: '+W 11,000',
    interestRate: '6.6%',
    type: '이자상환',
  },
  {
    id: '7',
    product: 'INVEST-B',
    bond: 'BOND-4',
    transactionDate: '2025-03-07',
    bondMaturity: '2025-09-01',
    amount: '+W 12,000',
    interestRate: '6.6%',
    type: '원금 상환',
  },
  {
    id: '8',
    product: 'INVEST-B',
    bond: 'BOND-4',
    transactionDate: '2025-03-08',
    bondMaturity: '2025-09-01',
    amount: '+W 13,000',
    interestRate: '6.6%',
    type: '이자상환',
  },
  {
    id: '9',
    product: 'INVEST-B',
    bond: 'BOND-5',
    transactionDate: '2025-03-09',
    bondMaturity: '2025-09-01',
    amount: '+W 14,000',
    interestRate: '6.6%',
    type: '원금 상환',
  },
  {
    id: '10',
    product: 'INVEST-B',
    bond: 'BOND-5',
    transactionDate: '2025-03-10',
    bondMaturity: '2025-09-01',
    amount: '+W 15,000',
    interestRate: '6.6%',
    type: '이자상환',
  },
  {
    id: '11',
    product: 'INVEST-C',
    bond: 'BOND-6',
    transactionDate: '2025-03-11',
    bondMaturity: '2025-09-01',
    amount: '+W 16,000',
    interestRate: '6.7%',
    type: '원금 상환',
  },
  {
    id: '12',
    product: 'INVEST-C',
    bond: 'BOND-6',
    transactionDate: '2025-03-12',
    bondMaturity: '2025-09-01',
    amount: '+W 17,000',
    interestRate: '6.7%',
    type: '이자상환',
  },
  {
    id: '13',
    product: 'INVEST-C',
    bond: 'BOND-7',
    transactionDate: '2025-03-13',
    bondMaturity: '2025-09-01',
    amount: '+W 18,000',
    interestRate: '6.7%',
    type: '원금 상환',
  },
  {
    id: '14',
    product: 'INVEST-C',
    bond: 'BOND-7',
    transactionDate: '2025-03-14',
    bondMaturity: '2025-09-01',
    amount: '+W 19,000',
    interestRate: '6.7%',
    type: '이자상환',
  },
  {
    id: '15',
    product: 'INVEST-C',
    bond: 'BOND-8',
    transactionDate: '2025-03-15',
    bondMaturity: '2025-09-01',
    amount: '+W 20,000',
    interestRate: '6.7%',
    type: '원금 상환',
  },
  {
    id: '16',
    product: 'INVEST-D',
    bond: 'BOND-8',
    transactionDate: '2025-03-16',
    bondMaturity: '2025-09-01',
    amount: '+W 21,000',
    interestRate: '6.8%',
    type: '이자상환',
  },
  {
    id: '17',
    product: 'INVEST-D',
    bond: 'BOND-9',
    transactionDate: '2025-03-17',
    bondMaturity: '2025-09-01',
    amount: '+W 22,000',
    interestRate: '6.8%',
    type: '원금 상환',
  },
  {
    id: '18',
    product: 'INVEST-D',
    bond: 'BOND-9',
    transactionDate: '2025-03-18',
    bondMaturity: '2025-09-01',
    amount: '+W 23,000',
    interestRate: '6.8%',
    type: '이자상환',
  },
  {
    id: '19',
    product: 'INVEST-D',
    bond: 'BOND-10',
    transactionDate: '2025-03-19',
    bondMaturity: '2025-09-01',
    amount: '+W 24,000',
    interestRate: '6.8%',
    type: '원금 상환',
  },
  {
    id: '20',
    product: 'INVEST-D',
    bond: 'BOND-10',
    transactionDate: '2025-03-20',
    bondMaturity: '2025-09-01',
    amount: '+W 25,000',
    interestRate: '6.8%',
    type: '이자상환',
  },
];

const ContractsList = () => {
  const [sortStates, setSortStates] = useState<SortState[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (key: SortKey) => {
    setSortStates((prev) => {
      const existing = prev.find((s) => s.key === key);
  
      if (!existing) return [...prev, { key, ascending: true }];
  
      if (existing.ascending) {
        return prev.map((s) =>
          s.key === key ? { ...s, ascending: false } : s
        );
      }
      
      return prev.filter((s) => s.key !== key);
    });
  };
  
  const sortPriority: SortKey[] = ['product', 'bond', 'transactionDate'];

  const activeSortStates = sortStates.length === 1
    ? sortStates
    : sortPriority
        .map((key) => sortStates.find((s) => s.key === key))
        .filter((s): s is SortState => !!s);

  const sortedContracts = [...contracts].sort((a, b) => {
    for (const { key, ascending } of activeSortStates) {
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
    }
    return 0;
  });

  const paginatedContracts = sortedContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const rows: BasicTableRow[] = paginatedContracts.map((c, idx) => ({
    key: c.id || `contract-${idx}`,
    cells: [
      { key: `product-${idx}`, content: c.product },
      { key: `bond-${idx}`, content: c.bond },
      { key: `date-${idx}`, content: c.transactionDate },
      { key: `maturity-${idx}`, content: c.bondMaturity },
      { key: `amount-${idx}`, content: c.amount },
      { key: `rate-${idx}`, content: c.interestRate },
      { key: `type-${idx}`, content: <span className={styles.pill}>{c.type}</span> },
    ],
  }));

  const columnHeaders = [
    <SortableTableHeader
      key="product"
      label="상품명"
      sortKey="product"
      sortStates={sortStates}
      onSort={handleSort}
    />,
    <SortableTableHeader
      key="bond"
      label="채권명"
      sortKey="bond"
      sortStates={sortStates}
      onSort={handleSort}
    />,
    <SortableTableHeader
      key="transactionDate"
      label="거래 날짜"
      sortKey="transactionDate"
      sortStates={sortStates}
      onSort={handleSort}
    />,
    '채권 만기일',
    '거래 금액',
    '금리',
    '분류',
  ];

  return (
    <div className={styles.tableContainer}>
      <BasicTable title="채권 거래 내역" columns={columnHeaders} rows={rows} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(contracts.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ContractsList;
