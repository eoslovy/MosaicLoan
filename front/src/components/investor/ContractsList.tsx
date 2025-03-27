'use client';

import React, { useState } from 'react';
import styles from '@/styles/investors/ContractsList.module.scss';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Define the types for the contract fields (keys)
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

// Sample contract data
const contracts: Contract[] = [
  {
    id: '1',
    product: 'INVEST-1250',
    bond: 'BO-1250',
    transactionDate: '2025-03-03',
    bondMaturity: '2025-03-03',
    amount: '+W 25,000',
    interestRate: '8.5%',
    type: '원금 상환',
  },
  {
    id: '2',
    product: 'INVEST-1251',
    bond: 'BO-1251',
    transactionDate: '2025-02-15',
    bondMaturity: '2025-04-01',
    amount: '+W 30,000',
    interestRate: '7.5%',
    type: '이자상환',
  },
  // More contract data...
];

const ContractsList = () => {
  const [sortedColumn, setSortedColumn] = useState<
    'product' | 'bond' | 'transactionDate'
  >('product'); // Define the possible keys here
  const [ascending, setAscending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 15;

  const handleSort = (column: 'product' | 'bond' | 'transactionDate') => {
    const isAscending = sortedColumn === column ? !ascending : true;
    setSortedColumn(column);
    setAscending(isAscending);
  };

  const sortedContracts = [...contracts].sort((a, b) => {
    if (a[sortedColumn] < b[sortedColumn]) return ascending ? -1 : 1;
    if (a[sortedColumn] > b[sortedColumn]) return ascending ? 1 : -1;
    return 0;
  });

  const paginatedContracts = sortedContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.contractsTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort('product')}>
              상품명{' '}
              {sortedColumn === 'product' &&
                (ascending ? <ChevronUp /> : <ChevronDown />)}
            </th>
            <th onClick={() => handleSort('bond')}>
              채권명{' '}
              {sortedColumn === 'bond' &&
                (ascending ? <ChevronUp /> : <ChevronDown />)}
            </th>
            <th onClick={() => handleSort('transactionDate')}>
              거래 날짜{' '}
              {sortedColumn === 'transactionDate' &&
                (ascending ? <ChevronUp /> : <ChevronDown />)}
            </th>
            <th>채권 만기일</th>
            <th>거래 금액</th>
            <th>금리</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          {paginatedContracts.map((contract) => (
            <tr key={contract.id}>
              <td>{contract.product}</td>
              <td>{contract.bond}</td>
              <td>{contract.transactionDate}</td>
              <td>{contract.bondMaturity}</td>
              <td>{contract.amount}</td>
              <td>{contract.interestRate}</td>
              <td>
                <span className={styles.pill}>{contract.type}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        >
          이전
        </button>
        <span>{currentPage}</span>
        <button
          className={styles.paginationButton}
          onClick={() =>
            setCurrentPage(
              Math.min(
                currentPage + 1,
                Math.ceil(contracts.length / itemsPerPage),
              ),
            )
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ContractsList;
