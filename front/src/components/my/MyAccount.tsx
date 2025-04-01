'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/my/MyAccount.module.scss';

const mockUserStore = {
  username: '김 * 피',
};

const MyAccount = () => {
  const [balance, setBalance] = useState(0);
  const { username } = mockUserStore;

  useEffect(() => {
    setBalance(1000000);
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          {/* 앞면 */}
          <div className={styles.cardFront}>
            <p className={styles.label}>모자익론 머니</p>
            <p className={styles.balance}>
              {balance.toLocaleString()} <span className={styles.unit}>₩</span>
            </p>
          </div>

          {/* 뒷면 */}
          <div className={styles.cardBack}>
            <p className={styles.backLabel}>사용자 이름</p>
            <p className={styles.username}>{username}</p>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type='button' className={styles.chargeBtn}>
          충전하기
        </button>
        <button type='button' className={styles.withdrawBtn}>
          출금하기
        </button>
      </div>
    </section>
  );
};

export default MyAccount;
