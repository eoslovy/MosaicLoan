'use client';

import React from 'react';
import BasicTable from '@/components/common/BasicTable';
import StatusBadge from '@/components/common/StatusBadge';
import styles from '@/styles/investors/OverviewTable.module.scss';
// import type { InvestmentItem, ProfitItem } from '@/types/pages';
import type { BasicTableRow } from '@/types/components';
import { fillEmptyRows } from '@/utils/fillEmptyRows';
import EmptyState from '@/components/empty/investor/EmptyState';
import { InvestmentOverviewTableProps } from '@/types/pages'

// interface OverviewTableProps {
//   investlist: InvestmentItem[];
//   profitHistory: ProfitItem[];
// }

const OverviewTable: React.FC<InvestmentOverviewTableProps> = ({ investlist, profitHistory }) => {
  const investmentRows: BasicTableRow[] = investlist.map((item, idx) => ({
    key: `investment-${idx}`,
    cells: [
      { key: `name-${idx}`, content: item.투자명 },
      { key: `amount-${idx}`, content: `₩ ${Number(item.투자금액).toLocaleString()}` },
      { key: `rate-${idx}`, content: `${item.금리} %` },
      { key: `date-${idx}`, content: item.상환일 },
      { key: `status-${idx}`, content: <StatusBadge status={item.상태} /> },
    ],
  }));

  const filledInvestmentRows = fillEmptyRows(investmentRows, 7, 5);

  const profitRows: BasicTableRow[] = profitHistory.map((item, idx) => ({
    key: `profit-${idx}`,
    cells: [
      {
        key: `label-${idx}`,
        content: (
          <div className={styles.labelWithDate}>
            <p>{item.수익명}</p>
            <span className={styles.date}>{item.날짜}</span>
          </div>
        ),
      },
      {
        key: `amount-${idx}`,
        content: <p className={styles.amount}>{Number(item.금액).toLocaleString()}₩</p>,
      },
    ],
  }));

  const filledProfitRows = fillEmptyRows(profitRows, 7, 2);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftTable}>
        <BasicTable
          title='투자 현황'
          columns={['투자명', '투자금액', '금리', '상환일', '상태']}
          rows={filledInvestmentRows}
          viewAllLink='/investor/contracts'
        />
      </div>
      <div className={styles.rightTable}>
        <BasicTable
          title='최근 수익 내역'
          columns={['', '']}
          rows={filledProfitRows}
          viewAllLink='/investor/earnings'
          showHeader={false}
        />
      </div>
    </div>
  );
};

export default OverviewTable;
