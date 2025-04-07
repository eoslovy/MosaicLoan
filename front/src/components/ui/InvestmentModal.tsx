'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import WeekPicker from '@/components/common/WeekPicker';
import styles from '@/styles/uis/InvestmentModal.module.scss';
import request from '@/service/apis/request';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialRate?: number;
  setAmount?: (amount: number) => void;
  setRate?: (rate: number) => void;
  setToast?: (msg: string | null) => void;
}

const DEFAULT_AMOUNT = 5000000;
const DEFAULT_RATE = 8.8;
const DEFAULT_WEEKS = 4;
const MAX_AMOUNT = 30000000; // 최대 3000만원
const MIN_AMOUNT = 10000; // 최소 1만원
const MIN_RATE = 8; // 최소 8%
const MAX_RATE = 15; // 최대 15%

const InvestmentModal = ({
  isOpen,
  onClose,
  initialAmount,
  initialRate,
  setAmount,
  setRate,
  setToast,
}: InvestmentModalProps): React.JSX.Element => {
  const [localAmount, setLocalAmount] = useState(initialAmount);
  const [localRate, setLocalRate] = useState(initialRate);
  const [selectedWeeks, setSelectedWeeks] = useState(DEFAULT_WEEKS);
  const [maturityDate, setMaturityDate] = useState<Date | null>(null);

  // 유효성 검사 오류 상태
  const [amountError, setAmountError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  // 버튼 활성화 상태
  const [isFormValid, setIsFormValid] = useState(true);

  // 금액 유효성 검사 (단 한 번만 정의)
  const validateAmount = (value: number): boolean => {
    if (Number.isNaN(value) || value === null) {
      setAmountError('투자 금액을 입력해주세요.');
      return false;
    }

    if (value < MIN_AMOUNT) {
      setAmountError(
        `최소 ${MIN_AMOUNT.toLocaleString()}원 이상 입력해주세요.`,
      );
      return false;
    }

    if (value > MAX_AMOUNT) {
      setAmountError(
        `최대 ${MAX_AMOUNT.toLocaleString()}원까지 입력 가능합니다.`,
      );
      return false;
    }

    setAmountError(null);
    return true;
  };

  // 수익률 유효성 검사
  const validateRate = (value: number): boolean => {
    if (Number.isNaN(value) || value === null) {
      setRateError('기대 수익률을 입력해주세요.');
      return false;
    }

    if (value < MIN_RATE) {
      setRateError(`최소 ${MIN_RATE}% 이상 입력해주세요.`);
      return false;
    }

    if (value > MAX_RATE) {
      setRateError(`최대 ${MAX_RATE}%까지 입력 가능합니다.`);
      return false;
    }

    setRateError(null);
    return true;
  };

  useEffect(() => {
    setLocalAmount(initialAmount);
    setLocalRate(initialRate);
    // 초기값 유효성 검사
    validateAmount(initialAmount || DEFAULT_AMOUNT);
    validateRate(initialRate || DEFAULT_RATE);
  }, [initialAmount, initialRate]);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 기본 주차와 해당 만기일 설정
      setSelectedWeeks(DEFAULT_WEEKS);
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + DEFAULT_WEEKS * 7);
      setMaturityDate(defaultDate);

      // 오류 상태 초기화
      setAmountError(null);
      setRateError(null);
      setIsFormValid(true);
    }
  }, [isOpen]);

  // 폼 유효성 검사
  useEffect(() => {
    // 오류가 없고 필수 값이 있으면 폼 유효
    setIsFormValid(!amountError && !rateError && !!localAmount && !!localRate);
  }, [amountError, rateError, localAmount, localRate]);

  const handleAmountChange = (value: number) => {
    const formattedValue = Math.min(value, MAX_AMOUNT); // 최대값 제한
    setLocalAmount(formattedValue);
    validateAmount(formattedValue);
    setAmount?.(formattedValue);
  };

  const handleRateChange = (value: number) => {
    // 소수점 1자리로 제한
    const formattedValue = parseFloat(value.toFixed(1));
    setLocalRate(formattedValue);
    validateRate(formattedValue);
    setRate?.(formattedValue);
  };

  const handleWeeksChange = (weeks: number, endDate: Date) => {
    setSelectedWeeks(weeks);
    setMaturityDate(endDate);
  };

  const handleInvest = async () => {
    const isAmountValid = validateAmount(localAmount || 0);
    const isRateValid = validateRate(localRate || 0);

    if (!isAmountValid || !isRateValid) return;

    try {
      await request.POST('/contract/investments/', {
        principal: localAmount,
        targetRate: Math.round((localRate || 0) * 100), // 소수 → 만분율
        targetWeeks: selectedWeeks,
      });

      onClose(); // 성공 시 모달 닫기
      // 성공 알림 추가하고 싶다면 여기서 setToast?.("투자 신청이 완료되었습니다.") 해도 됨
    } catch (error) {
      console.error('투자 신청 실패:', error);
      setToast?.('투자 신청 중 오류가 발생했습니다.');
    }
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
            min={MIN_AMOUNT}
            max={MAX_AMOUNT}
          />
          {amountError && (
            <div className={styles.errorMessage}>{amountError}</div>
          )}
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
            min={MIN_RATE}
            max={MAX_RATE}
            step={0.1}
          />
          {rateError && <div className={styles.errorMessage}>{rateError}</div>}
        </div>

        <div className={styles.inputGroup}>
          <Text
            text='투자 기간'
            size='md'
            weight='medium'
            color='gray'
            className={styles.label}
          />
          <WeekPicker
            selected={selectedWeeks}
            onChange={handleWeeksChange}
            maxWeeks={52}
            placeholderText='투자 기간을 선택하세요'
          />
        </div>

        <Button
          label={{ text: '투자하기', size: 'md', color: 'white' }}
          variant='filled'
          size='large'
          onClick={handleInvest}
          disabled={!isFormValid}
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
  setToast: () => {},
} as Partial<InvestmentModalProps>;

export default InvestmentModal;
