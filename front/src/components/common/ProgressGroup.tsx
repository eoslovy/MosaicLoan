import { ProgressGroupProps } from '@/types/components';
import React from 'react';
import styles from '@/styles/components/ProgressGroup.module.scss';
// import clsx from 'clsx';

const ProgressGroup: React.FC<ProgressGroupProps> = ({ title, items }) => {
  return (
    <div className={styles.wrapper}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.labelRow}>
            <div
              className={styles.dot}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.label}>{item.label}</span>
            <span className={styles.count}>{item.count}건</span>
            <span className={styles.percent}>({item.percentage}%)</span>
          </div>
          <div className={styles.progressBarBackground}>
            <div
              className={styles.progressBarFill}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressGroup;
