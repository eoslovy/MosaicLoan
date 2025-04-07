'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/my/MyAccount.module.scss';
import request from '@/service/apis/request';
import useUser from '@/hooks/useUser';
import useAccountStore from '@/stores/accountStore';
import AccountModal from './AccountModal';

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
  const { balance, setBalance } = useAccountStore();
  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 잔액 조회
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
  }, [setBalance]);

  return (
    <>
      {toast && <div className={styles.globalErrorToast}>{toast}</div>}

      <section className={styles.container}>
        <div
          className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
          onClick={() => setIsFlipped((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsFlipped((prev) => !prev);
            }
          }}
          role='button'
          tabIndex={0}
        >
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

        <div className={styles.buttonGroup}>
          <button
            type='button'
            onClick={() => setIsChargeOpen(true)}
            className={styles.chargeBtn}
          >
            충전하기
          </button>
          <button
            type='button'
            onClick={() => setIsWithdrawOpen(true)}
            className={styles.withdrawBtn}
          >
            출금하기
          </button>
        </div>
      </section>

      {/* 모달 */}
      <AccountModal
        isOpen={isChargeOpen}
        onClose={() => setIsChargeOpen(false)}
        type='charge'
        setToast={setToast}
      />
      <AccountModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        type='withdraw'
        openChargeModal={() => {
          setIsWithdrawOpen(false);
          setTimeout(() => setIsChargeOpen(true), 300);
        }}
        setToast={setToast}
      />
    </>
  );
};

export default MyAccount;
