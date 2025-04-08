'use client';

/* eslint-disable react/no-array-index-key */
import React from 'react';
import styles from '@/styles/investors/OverviewTable.module.scss';
import overviewStyles from '@/styles/investors/Overview.module.scss';
import skeleton from '@/styles/components/Skeleton.module.scss';

const InvestorOverviewSkeleton = () => {
  const renderSkeletonRows = (rowCount: number, colCount: number) =>
    Array.from({ length: rowCount }).map((__, rowIdx) => (
      <div key={`row-${rowIdx}`} className={skeleton.row}>
        {Array.from({ length: colCount }).map((___, colIdx) => (
          <div key={`cell-${rowIdx}-${colIdx}`} className={skeleton.cell} />
        ))}
      </div>
    ));

  return (
    <>
      {/* 투자 버튼 스켈레톤 */}
      <div className={skeleton.investButton} />

      {/* Overview 스켈레톤 */}
      <section className={overviewStyles.wrapper}>
        <div className={overviewStyles.cardWrapper}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={`card-${idx}`} className={skeleton.card}>
              <div className={skeleton.iconPlaceholder} />
              <div className={skeleton.valuePlaceholder} />
              <div className={skeleton.labelPlaceholder} />
            </div>
          ))}
        </div>
      </section>

      {/* OverviewTable 스켈레톤 */}
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

      {/* OverviewInvestSimulation 스켈레톤 */}
      <div className={skeleton.simulationSection}>
        <div className={skeleton.sectionTitle} />
        <div className={skeleton.simulationWrapper}>
          <div className={skeleton.simulationLeft}>
            <div className={skeleton.sliderContainer}>
              <div className={skeleton.sliderLabel} />
              <div className={skeleton.slider} />
            </div>
            <div className={skeleton.sliderContainer}>
              <div className={skeleton.sliderLabel} />
              <div className={skeleton.slider} />
            </div>
          </div>
          <div className={skeleton.simulationRight}>
            <div className={skeleton.resultTitle} />
            <div className={skeleton.resultAmount} />
            <div className={skeleton.resultDetail} />
            <div className={skeleton.chartContainer}>
              <div className={skeleton.chartTitle} />
              <div className={skeleton.chart} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestorOverviewSkeleton;
