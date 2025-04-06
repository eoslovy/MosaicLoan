'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/investors/InvestButton.module.scss';
import InvestmentModal from '@/components/ui/InvestmentModal';

const InvestButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [toast]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <button
        type='button'
        className={styles.investButton}
        onClick={handleOpenModal}
      >
        투자하기
      </button>
      {toast && <div className={styles.globalErrorToast}>{toast}</div>}
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        setToast={setToast}
      />
    </div>
  );
};

export default InvestButton;
