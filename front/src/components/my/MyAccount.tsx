'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/my/MyAccount.module.scss';
import request from '@/service/apis/request';
import useUser from '@/hooks/useUser';

const formatBalance = (amount: number): string => {
  if (amount >= 1_0000_0000_0000) {
    return `${Math.floor(amount / 1_0000_0000_0000)} 조원`;
  }
  if (amount >= 1_0000_0000) {
    return `${Math.floor(amount / 1_0000_0000).toLocaleString()} 억원`;
  }
  if (amount >= 1_0000) {
    return `${Math.floor(amount / 1_0000).toLocaleString()} 만원`;
  }
  return `${amount.toLocaleString()} 원`;
};

const MyAccount = () => {
  const { user } = useUser();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await request.GET<{ amount: number }>(
          '/api/account/accounts',
        );
        setBalance(response.amount);
      } catch (error) {
        console.error('잔액 조회 실패:', error);
        setBalance(0);
      }
    };

    fetchBalance();
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          {/* 앞면 */}
          <div className={styles.cardFront}>
            <p className={styles.label}>모자익론 머니</p>
            <p className={styles.balance}>
              {formatBalance(balance)} <span className={styles.unit} />
            </p>
          </div>

          {/* 뒷면 */}
          <div className={styles.cardBack}>
            <p className={styles.backLabel}>사용자 이름</p>
            <p className={styles.username}>{user?.username ?? '-'}</p>
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
