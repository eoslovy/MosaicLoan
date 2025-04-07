'use client';

import React, { useState, useRef, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/borrowers/LoanModal.module.scss';
import { postLoanRequest } from '@/service/apis/borrow';
import request from '@/service/apis/request';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  maxLoanLimit: number;
}

const LoanModal = ({ isOpen, onClose, maxLoanLimit }: Props) => {
  const [amount, setAmount] = useState<number>(5000);
  const [weeks, setWeeks] = useState<number>(4);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [weeksError, setWeeksError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setAmount(5000);
      setWeeks(4);
      setErrorMessage(null);
      setWeeksError(null);
      setToast(null);

      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleAmountChange = (value: string) => {
    const number = Number(value.replace(/[^0-9]/g, ''));
    setAmount(number);
    setErrorMessage(null);
  };

  const handleAmountBlur = () => {
    if (amount < 5000) {
      setAmount(5000);
      setErrorMessage('최소 금액은 5,000원 입니다');
    } else if (amount > maxLoanLimit) {
      setAmount(maxLoanLimit);
      setErrorMessage(`대출한도는 ${maxLoanLimit.toLocaleString()}원 입니다`);
    } else {
      setErrorMessage(null);
    }
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAmountBlur();
    }
  };

  const handleWeeksInput = (value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ''));
    setWeeks(num);
  };

  const handleWeeksBlur = () => {
    if (weeks < 1) {
      setWeeks(1);
      setWeeksError('대출 기한은 1~52주입니다');
    } else if (weeks > 52) {
      setWeeks(52);
      setWeeksError('대출 기한은 1~52주입니다');
    } else {
      setWeeksError(null);
    }
  };

  const handleWeeksKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleWeeksBlur();
    }
  };

  const handleSubmit = async () => {
    if (amount < 5000) {
      setAmount(5000);
      setErrorMessage('최소 금액은 5,000원 입니다');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (amount > maxLoanLimit) {
      setAmount(maxLoanLimit);
      setErrorMessage(`대출한도는 ${maxLoanLimit.toLocaleString()}원 입니다`);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (weeks < 1 || weeks > 52) {
      setWeeks(1);
      setWeeksError('대출 기간은 1주 이상 52주 이하로 설정해야 합니다.');
      setTimeout(() => setWeeksError(null), 3000);
      return;
    }

    try {
      const user = await request.GET<{ id: number }>('/member/me');

      if (!user?.id) {
        setToast('사용자 정보가 없습니다.');
        return;
      }

      await postLoanRequest({
        id: user.id,
        requestAmount: amount,
        targetWeeks: weeks,
      });

      router.refresh();
      onClose();
    } catch (e) {
      setToast('대출 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getDueDate = () => {
    const validWeeks =
      typeof weeks !== 'number' ||
      Number.isNaN(weeks) ||
      weeks < 1 ||
      weeks > 52
        ? 1
        : weeks;
    const now = new Date();
    now.setDate(now.getDate() + validWeeks * 7);
    return now.toISOString().split('T')[0];
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
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                onKeyDown={handleAmountKeyDown}
                placeholder='대출 금액을 입력하세요'
              />
              <span className={styles.unit}>원</span>
            </div>
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.weeksControl}>
              <button
                type='button'
                onClick={() => setWeeks((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type='text'
                inputMode='numeric'
                className={styles.weeksInput}
                value={weeks}
                onChange={(e) => handleWeeksInput(e.target.value)}
                onBlur={handleWeeksBlur}
                onKeyDown={handleWeeksKeyDown}
              />
              <span>주</span>
              <button
                type='button'
                onClick={() => setWeeks((prev) => Math.min(52, prev + 1))}
              >
                +
              </button>
            </div>
            {weeksError && <div className={styles.error}>{weeksError}</div>}
          </div>

          <div className={styles.dueDate}>
            <Text
              text={`만기일: ${getDueDate()}`}
              size='sm'
              weight='medium'
              color='gray'
            />
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
