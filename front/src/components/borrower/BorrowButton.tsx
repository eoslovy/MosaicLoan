'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/BorrowButton.module.scss';
import { postCreditEvaluation } from '@/service/apis/borrow';

const BorrowButton = () => {
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await postCreditEvaluation(today);
      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (err) {
      setError('신용평가 요청에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setError(null), 3000); // 3초 후 알림 사라짐
    }
  };

  return (
    <div className={styles.container}>
      <button
        type='button'
        className={styles.borrowButton}
        onClick={handleClick}
      >
        신용평가하기
      </button>
      {error && <div className={styles.errorNotification}>{error}</div>}
    </div>
  );
};

export default BorrowButton;
