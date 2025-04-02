/* eslint-disable react/no-array-index-key */

'use client';

import React from 'react';
import styles from '@/styles/investors/OverviewTable.module.scss';
import skeleton from '@/styles/components/Skeleton.module.scss';

const InvestorOverviewSkeleton = () => {
  const renderSkeletonRows = (rowCount: number, colCount: number) =>
    Array.from({ length: rowCount }).map((__, rowIdx) => (
      <div key={rowIdx} className={skeleton.row}>
        {Array.from({ length: colCount }).map((___, colIdx) => (
          <div key={colIdx} className={skeleton.cell} />
        ))}
      </div>
    ));

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftTable}>
        <div className={skeleton.tableTitle} />
        {renderSkeletonRows(7, 5)}
      </div>
      <div className={styles.rightTable}>
        <div className={skeleton.tableTitle} />
        {renderSkeletonRows(7, 2)}
      </div>
    </div>
  );
};

export default InvestorOverviewSkeleton;
