'use client';

import React from 'react';
import BasicTable from '@/components/common/BasicTable';
import styles from '@/styles/investors/OverviewTable.module.scss';
import type { BasicTableRow } from '@/types/components';
import fillEmptyRows from '@/utils/fillEmptyRows';
import { InvestmentOverviewTableProps } from '@/types/pages';
import Pill, { PillVariant } from '@/components/common/Pill';

const getStatusVariant = (status: string): PillVariant => {
  switch (status) {
    case '상환완료':
      return 'repayment-complete';
    case '상환중':
      return 'repayment-in-progress';
    case '부실':
      return 'defaulted';
    default:
      return 'repayment-in-progress';
  }
};

const OverviewTable: React.FC<InvestmentOverviewTableProps> = ({
  investlist,
  profitHistory,
}) => {
  const investmentRows: BasicTableRow[] = investlist.map((item, idx) => ({
    key: `investment-${idx}`,
    cells: [
      { key: `name-${idx}`, content: item.투자명 },
      {
        key: `amount-${idx}`,
        content: `₩ ${Number(item.투자금액).toLocaleString()}`,
      },
      { key: `rate-${idx}`, content: `${item.금리} %` },
      { key: `date-${idx}`, content: item.상환일 },
      { key: `status-${idx}`, content: <Pill variant={getStatusVariant(item.상태)}>{item.상태}</Pill> },
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
        content: (
          <p className={styles.amount}>{Number(item.금액).toLocaleString()}₩</p>
        ),
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
