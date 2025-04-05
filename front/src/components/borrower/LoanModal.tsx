'use client';

import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/common/Modal';
// import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/borrowers/LoanModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  maxLoanLimit: number;
}

const LoanModal = ({ isOpen, onClose, maxLoanLimit }: Props) => {
  const [amount, setAmount] = useState<number>(5000);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleChange = (value: string) => {
    const number = Number(value.replace(/[^0-9]/g, ''));
    setAmount(number);
    setErrorMessage(null);
  };

  const handleSubmit = () => {
    if (amount < 5000) {
      setAmount(5000);
      setErrorMessage('최소 금액은 5,000원 입니다');
      // setToast('최소 대출금액보다 적게 입력하셨습니다.');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (amount > maxLoanLimit) {
      setAmount(maxLoanLimit);
      setErrorMessage(`대출한도는 ${maxLoanLimit.toLocaleString()}원 입니다`);
      // setToast('대출 한도를 초과한 금액입니다.');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    console.log('대출 요청:', { amount, maxLoanLimit });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {toast && <div className={styles.globalErrorToast}>{toast}</div>}

      <Modal isOpen={isOpen} onClose={onClose} title='대출하기'>
        <form
          className={styles.modalContent}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Text
            text={`대출한도: ${maxLoanLimit.toLocaleString()}원`}
            size='lg'
            weight='bold'
          />

          <div className={styles.inputWrapper}>
            <div className={styles.inputWithUnit}>
              <input
                ref={inputRef}
                type='text'
                inputMode='numeric'
                className={styles.input}
                value={amount.toLocaleString()}
                onChange={(e) => handleChange(e.target.value)}
                placeholder='대출 금액을 입력하세요'
              />
              <span className={styles.unit}>원</span>
            </div>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          </div>

          <Button
            label={{ text: '대출하기', size: 'md', color: 'white' }}
            variant='filled'
            size='large'
            onClick={handleSubmit}
          />
        </form>
      </Modal>
    </>
  );
};

export default LoanModal;
