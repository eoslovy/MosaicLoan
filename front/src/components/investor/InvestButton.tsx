'use client';

import React from 'react';
import styles from '@/styles/investors/InvestButton.module.scss';

const InvestButton = () => {
  return (
    <div className={styles.container}>
      <button type='button' className={styles.investButton}>
        투자하기
      </button>
    </div>
  );
};

export default InvestButton;
