'use client';

import React from 'react';
import styles from '@/styles/borrowers/BorrowButton.module.scss';
import useCreditEvaluation from '@/hooks/useCreditEvaluation';
import CreditEvaluationProgress from './CreditEvaluationProgress';

const BorrowButton = ({ onComplete }: { onComplete: () => void }) => {
  const { step, isEvaluating, startEvaluation } = useCreditEvaluation({
    onCompleted: onComplete,
  });

  return (
    <div className={styles.container}>
      {isEvaluating ? (
        <CreditEvaluationProgress currentStep={step} />
      ) : (
        <button
          type='button'
          className={styles.borrowButton}
          onClick={startEvaluation}
        >
          신용평가하기
        </button>
      )}
    </div>
  );
};

export default BorrowButton;
