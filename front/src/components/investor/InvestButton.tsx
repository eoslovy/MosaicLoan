'use client';

import React, { useState } from 'react';
import styles from '@/styles/investors/InvestButton.module.scss';
import InvestmentModal from '@/components/ui/InvestmentModal';

const InvestButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <InvestmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default InvestButton;
