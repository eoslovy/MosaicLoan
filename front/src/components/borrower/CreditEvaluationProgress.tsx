'use client';

import React, { useEffect } from 'react';
import styles from '@/styles/borrowers/CreditEvaluationProgress.module.scss';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  currentStep: number;
}

const stepLabels = ['요청 중', '심사 중', '완료'];

const CreditEvaluationProgress = ({ currentStep }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (currentStep === 2) {
      const timer = setTimeout(() => {
        router.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [currentStep, router]);

  return (
    <div className={styles.progressContainer}>
      {stepLabels.map((label, index) => (
        <div key={label} className={styles.stepWrapper}>
          <div
            className={`${styles.circle} ${
              index <= currentStep ? styles.active : ''
            }`}
          >
            {index < currentStep ? <Check size={20} /> : index + 1}
          </div>
          <span className={styles.label}>{label}</span>
          {index < stepLabels.length - 1 && <div className={styles.line} />}
        </div>
      ))}
    </div>
  );
};

export default CreditEvaluationProgress;
