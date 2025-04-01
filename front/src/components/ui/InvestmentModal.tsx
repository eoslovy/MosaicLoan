'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import DatePicker from '@/components/common/DatePicker';
import styles from '@/styles/uis/InvestmentModal.module.scss';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialRate?: number;
  setAmount?: (amount: number) => void;
  setRate?: (rate: number) => void;
}

const DEFAULT_AMOUNT = 5000000;
const DEFAULT_RATE = 8.8;

const InvestmentModal = ({
  isOpen,
  onClose,
  initialAmount,
  initialRate,
  setAmount,
  setRate,
}: InvestmentModalProps): React.JSX.Element => {
  const [localAmount, setLocalAmount] = useState(initialAmount);
  const [localRate, setLocalRate] = useState(initialRate);
  const [maturityDate, setMaturityDate] = useState<Date | null>(null);

  useEffect(() => {
    setLocalAmount(initialAmount);
    setLocalRate(initialRate);
  }, [initialAmount, initialRate]);

  useEffect(() => {
    if (isOpen) {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 1);
      setMaturityDate(defaultDate);
    }
  }, [isOpen]);

  const handleAmountChange = (value: number) => {
    setLocalAmount(value);
    setAmount?.(value);
  };

  const handleRateChange = (value: number) => {
    setLocalRate(value);
    setRate?.(value);
  };

  const handleInvest = () => {
    // TODO: 투자 처리 로직
    // eslint-disable-next-line no-console
    console.log('Investment:', {
      amount: localAmount,
      rate: localRate,
      maturityDate,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='투자하기'>
      <div className={styles.modalContent}>
        <div className={styles.inputGroup}>
          <Text
            text='투자 금액'
            size='md'
            weight='medium'
            color='gray'
            className={styles.label}
          />
          <Input
            type='number'
            value={localAmount}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            placeholder='투자 금액을 입력하세요'
            min={10000}
            max={50000000}
          />
        </div>

        <div className={styles.inputGroup}>
          <Text
            text='기대 수익률'
            size='md'
            weight='medium'
            color='gray'
            className={styles.label}
          />
          <Input
            type='number'
            value={localRate}
            onChange={(e) => handleRateChange(Number(e.target.value))}
            placeholder='기대 수익률을 입력하세요'
            min={8}
            max={15}
            step={0.1}
          />
        </div>

        <div className={styles.inputGroup}>
          <Text
            text='만기일'
            size='md'
            weight='medium'
            color='gray'
            className={styles.label}
          />
          <DatePicker
            selected={maturityDate}
            onChange={(date: Date | null) => setMaturityDate(date)}
            minDate={new Date()}
            placeholderText='만기일을 선택하세요'
          />
        </div>

        <Button
          label={{ text: '투자하기', size: 'md', color: 'white' }}
          variant='filled'
          size='large'
          onClick={handleInvest}
        />
      </div>
    </Modal>
  );
};

InvestmentModal.defaultProps = {
  initialAmount: DEFAULT_AMOUNT,
  initialRate: DEFAULT_RATE,
  setAmount: () => {},
  setRate: () => {},
} as Partial<InvestmentModalProps>;

export default InvestmentModal;
