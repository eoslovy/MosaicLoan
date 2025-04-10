'use client';

import React from 'react';
import BasicTable from '@/components/common/BasicTable';
import EmptyState from '@/components/empty/investor/EmptyState';
import styles from '@/styles/investors/OverviewTable.module.scss';
import type { BasicTableRow, PillVariant } from '@/types/components';
import fillEmptyRows from '@/utils/fillEmptyRows';
import { InvestmentOverviewTableProps } from '@/types/pages';
import Pill from '@/components/common/Pill';

// const getStatusVariant = (status: string): PillVariant => {
//   switch (status) {
//     case '상환완료':
//       return 'repayment-complete';
//     case '상환중':
//       return 'repayment-in-progress';
//     case '부실':
//       return 'defaulted';
//     default:
//       return 'repayment-in-progress';
//   }
// };

const getStatusLabel = (
  status: 'REQUESTED' | 'ACTIVE' | 'COMPLETED',
): string => {
  switch (status) {
    case 'REQUESTED':
      return '대기';
    case 'ACTIVE':
      return '진행중';
    case 'COMPLETED':
      return '종료';
    default:
      return '기타';
  }
};

const getStatusVariant = (
  status: 'REQUESTED' | 'ACTIVE' | 'COMPLETED',
): PillVariant => {
  switch (status) {
    case 'REQUESTED':
      return 'info';
    case 'ACTIVE':
      return 'investing';
    case 'COMPLETED':
      return 'danger';
    default:
      return 'default';
  }
};

const OverviewTable: React.FC<InvestmentOverviewTableProps> = ({
  investmentlist,
  profitHistory,
}) => {
  // 투자 리스트가 비어있는지 확인
  const isInvestListEmpty = !investmentlist || investmentlist.length === 0;

  // 수익 내역이 비어있는지 확인
  const isProfitHistoryEmpty = !profitHistory || profitHistory.length === 0;

  const investmentRows: BasicTableRow[] = isInvestListEmpty
    ? []
    : investmentlist.map((item, idx) => ({
        key: `investment-${idx}`,
        cells: [
          { key: `name-${idx}`, content: item.investmentId },
          {
            key: `amount-${idx}`,
            content: `₩ ${Number(item.investmentAmount).toLocaleString()}`,
          },
          { key: `rate-${idx}`, content: `${item.rate} %` },
          { key: `date-${idx}`, content: item.dueDate },
          {
            key: `status-${idx}`,
            content: (
              <Pill variant={getStatusVariant(item.status)}>
                {getStatusLabel(item.status)}
              </Pill>
            ),
          },
        ],
      }));

  const filledInvestmentRows = isInvestListEmpty
    ? []
    : fillEmptyRows(investmentRows, 7, 5);

  const profitRows: BasicTableRow[] = isProfitHistoryEmpty
    ? []
    : profitHistory.map((item, idx) => ({
        key: `profit-${idx}`,
        cells: [
          {
            key: `label-${idx}`,
            content: (
              <div className={styles.labelWithDate}>
                <p>{item.title}</p>
                <span className={styles.date}>{item.date}</span>
              </div>
            ),
          },
          {
            key: `amount-${idx}`,
            content: (
              <p className={styles.amount}>
                {Number(item.amount).toLocaleString()}₩
              </p>
            ),
          },
        ],
      }));

  const filledProfitRows = isProfitHistoryEmpty
    ? []
    : fillEmptyRows(profitRows, 7, 2);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftTable}>
        {isInvestListEmpty ? (
          <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle}>투자 현황</h3>
            <EmptyState message='투자 내역이 없습니다.' isComponentLevel />
          </div>
        ) : (
          <BasicTable
            title='투자 현황'
            columns={['투자명', '투자금액', '기대수익률', '상환일', '상태']}
            rows={filledInvestmentRows}
            viewAllLink='/investor/contracts'
          />
        )}
      </div>
      <div className={styles.rightTable}>
        {isProfitHistoryEmpty ? (
          <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle}>최근 수익 내역</h3>
            <EmptyState message='수익 내역이 없습니다.' isComponentLevel />
          </div>
        ) : (
          <BasicTable
            title='최근 수익 내역'
            columns={['', '']}
            rows={filledProfitRows}
            viewAllLink='/investor/earnings'
            showHeader={false}
          />
        )}
      </div>
    </div>
  );
};

export default OverviewTable;
