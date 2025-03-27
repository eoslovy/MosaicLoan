'use client';

import React from 'react';
import BasicTable from '@/components/common/BasicTable';
import styles from '@/styles/investors/OverviewTable.module.scss';
import { BasicTableRow } from '@/types/components';

const OverviewTable = () => {
  const investmentData: BasicTableRow[] = [
    {
      key: 'investment-0',
      cells: [
        { key: 'name-0', content: '멋진 투자' },
        { key: 'amount-0', content: '₩1,000,000,000' },
        { key: 'rate-0', content: '8.5 %' },
        { key: 'date-0', content: '2025-03-25' },
        {
          key: 'status-0',
          content: <span className={styles.badgeSuccess}>상환완료</span>,
        },
      ],
    },
    {
      key: 'investment-1',
      cells: [
        { key: 'name-1', content: '즐거운 투자' },
        { key: 'amount-1', content: '₩1,000,000,000' },
        { key: 'rate-1', content: '8.5 %' },
        { key: 'date-1', content: '2025-03-24' },
        {
          key: 'status-1',
          content: <span className={styles.badgeWarning}>상환중</span>,
        },
      ],
    },
    {
      key: 'investment-2',
      cells: [
        { key: 'name-2', content: '대박 투자' },
        { key: 'amount-2', content: '₩1,000,000,000' },
        { key: 'rate-2', content: '8.5 %' },
        { key: 'date-2', content: '2025-02-25' },
        {
          key: 'status-2',
          content: <span className={styles.badgeDanger}>부실</span>,
        },
      ],
    },
  ];

  const fixedInvestmentRows: BasicTableRow[] = [
    ...investmentData,
    ...Array.from({ length: 7 - investmentData.length }, (_, idx) => ({
      key: `investment-empty-${idx}`,
      cells: [
        { key: `empty-${idx}-0`, content: '' },
        { key: `empty-${idx}-1`, content: '' },
        { key: `empty-${idx}-2`, content: '' },
        { key: `empty-${idx}-3`, content: '' },
        { key: `empty-${idx}-4`, content: '' },
      ],
    })),
  ];

  const profitData: BasicTableRow[] = [
    {
      key: 'profit-0',
      cells: [
        {
          key: 'label-0',
          content: (
            <div className={styles.labelWithDate}>
              <p>이자 수익</p>
              <span className={styles.date}>2025-03-10</span>
            </div>
          ),
        },
        {
          key: 'amount-0',
          content: <p className={styles.amount}>5,000₩</p>,
        },
      ],
    },
    {
      key: 'profit-1',
      cells: [
        {
          key: 'label-1',
          content: (
            <div className={styles.labelWithDate}>
              <p>원금 상환</p>
              <span className={styles.date}>2025-03-10</span>
            </div>
          ),
        },
        {
          key: 'amount-1',
          content: <p className={styles.amount}>5,000₩</p>,
        },
      ],
    },
    {
      key: 'profit-2',
      cells: [
        {
          key: 'label-2',
          content: (
            <div className={styles.labelWithDate}>
              <p>환 급</p>
              <span className={styles.date}>2025-03-10</span>
            </div>
          ),
        },
        {
          key: 'amount-2',
          content: <p className={styles.amount}>5,000₩</p>,
        },
      ],
    },
  ];

  const fixedProfitRows: BasicTableRow[] = [
    ...profitData,
    ...Array.from({ length: 4 - profitData.length }, (_, idx) => ({
      key: `profit-empty-${idx}`,
      cells: [
        { key: `profit-empty-${idx}-0`, content: '' },
        { key: `profit-empty-${idx}-1`, content: '' },
      ],
    })),
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftTable}>
        <BasicTable
          title='투자 현황'
          columns={['투자명', '투자금액', '금리', '상환일', '상태']}
          rows={fixedInvestmentRows}
          viewAllLink='/investor/transactions'
        />
      </div>
      <div className={styles.rightTable}>
        <BasicTable
          title='최근 수익 내역'
          columns={['', '']}
          rows={fixedProfitRows}
          viewAllLink='/investor/earnings'
          showHeader={false}
        />
      </div>
    </div>
  );
};

export default OverviewTable;
