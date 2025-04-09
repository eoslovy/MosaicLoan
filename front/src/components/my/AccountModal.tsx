'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUser from '@/hooks/useUser';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/my/AccountModal.module.scss';
import useAccountStore from '@/stores/accountStore';
import request from '@/service/apis/request';
import bankCodes from '@/types/bankCodes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'charge' | 'withdraw';
  openChargeModal?: () => void;
  setToast?: (msg: string | null) => void;
  refetchBalance?: () => void;
}

const formatBalance = (amount: number): string => {
  if (amount >= 1_0000_0000_0000)
    return `${Math.floor(amount / 1_0000_0000_0000)} 조원`;
  if (amount >= 1_0000_0000)
    return `${Math.floor(amount / 1_0000_0000).toLocaleString()} 억원`;
  if (amount >= 1_0000)
    return `${Math.floor(amount / 1_0000).toLocaleString()} 만원`;
  return `${amount.toLocaleString()} 원`;
};

const AccountModal = ({
  isOpen,
  onClose,
  type,
  openChargeModal,
  setToast,
  refetchBalance,
}: Props) => {
  const { balance, isFetched } = useAccountStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [isBlurred, setIsBlurred] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setAmount(0);
      setAccountNumber('');
      setBankCode('');
      setErrorMessage(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const formatAccountNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length > 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length > 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };

  const handleAmountChange = (value: string) => {
    const raw = value.replace(/[^0-9]/g, '');
    const number = Number(raw);
    setInputValue(raw === '' ? '' : number.toLocaleString());
    setAmount(number);
    setErrorMessage(null);
  };

  const handleAmountBlur = () => {
    setIsBlurred(true);

    if (!amount) {
      setErrorMessage('금액을 입력해주세요');
    } else if (amount % 1000 !== 0) {
      setErrorMessage('1000원 단위로만 입력 가능합니다');
    } else if (type === 'withdraw' && amount > balance) {
      setErrorMessage('잔액이 부족합니다');
    }
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const isValidAmount =
    amount > 0 &&
    amount % 1000 === 0 &&
    (type === 'charge' || amount <= balance);
  const rawAccountNumber = accountNumber.replace(/-/g, '');

  const isValidAccountNumber =
    rawAccountNumber.length > 0 &&
    rawAccountNumber.length <= 14 &&
    /^[0-9]+$/.test(rawAccountNumber);

  const isValidWithdraw =
    type === 'withdraw'
      ? isValidAmount && isValidAccountNumber && bankCode !== ''
      : true;

  const handleSubmit = async () => {
    if (!isValidAmount || (type === 'withdraw' && !isValidWithdraw)) {
      return;
    }

    try {
      if (type === 'charge') {
        if (!user?.id) {
          setToast?.('로그인 정보를 확인할 수 없습니다.');
          return;
        }

        const res = await request.POST<{ redirectUrl: string }>(
          `/account/external/deposit/ready`,
          { amount },
        );

        if (res?.redirectUrl) {
          window.location.href = res.redirectUrl;
        } else {
          setToast?.('결제 페이지 요청에 실패했습니다.');
        }
      } else {
        await request.POST('/account/external/withdrawal', {
          amount,
          accountNumber: rawAccountNumber,
          bankCode,
        });
        refetchBalance?.();
      }
    } catch (e) {
      console.error(`${type === 'charge' ? '충전' : '출금'} 요청 실패:`, e);
      setToast?.(
        `${type === 'charge' ? '충전' : '출금'} 중 오류가 발생했습니다.`,
      );
    }

    onClose();
  };

  const formattedBalance = isFetched
    ? formatBalance(balance)
    : '잔액을 불러오는 중...';
  const expectedBalance =
    type === 'charge' ? balance + amount : balance - amount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'charge' ? '충전하기' : '출금하기'}
    >
      <form
        className={styles.modalContent}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Text text={`현재 잔액: ${formattedBalance}`} size='lg' weight='bold' />

        <div className={styles.inputWrapper}>
          <div className={styles.inputWithUnit}>
            <input
              ref={inputRef}
              type='text'
              inputMode='numeric'
              className={styles.input}
              value={inputValue}
              onChange={(e) => handleAmountChange(e.target.value)}
              onBlur={handleAmountBlur}
              onKeyDown={handleAmountKeyDown}
              placeholder='금액을 입력하세요'
            />
            <span className={styles.unit}>원</span>
          </div>

          {errorMessage === '잔액이 부족합니다' ? (
            <div className={styles.error}>
              <p>{errorMessage}</p>
              {type === 'withdraw' && openChargeModal && (
                <button
                  type='button'
                  className={styles.chargeLink}
                  onClick={() => {
                    onClose();
                    openChargeModal?.();
                  }}
                >
                  충전하러 가기 →
                </button>
              )}
            </div>
          ) : (
            errorMessage && <div className={styles.error}>{errorMessage}</div>
          )}
        </div>

        {type === 'withdraw' && (
          <>
            <div className={styles.inputWrapper}>
              <input
                type='text'
                inputMode='numeric'
                className={styles.input}
                placeholder='계좌번호를 입력하세요'
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(formatAccountNumber(e.target.value))
                }
              />
            </div>
            <div className={styles.inputWrapper}>
              <select
                className={styles.select}
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              >
                <option value=''>은행을 선택하세요</option>
                {bankCodes.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {isBlurred && isValidAmount && !errorMessage && (
          <div className={styles.expectedBalance}>
            <Text
              text={`${
                type === 'charge' ? '충전 후 잔액' : '출금 후 잔액'
              }: ${expectedBalance.toLocaleString()} 원`}
              size='sm'
              color='gray'
            />
          </div>
        )}

        <Button
          label={{
            text: type === 'charge' ? '충전하기' : '출금하기',
            size: 'md',
            color: 'white',
          }}
          variant='filled'
          size='large'
          onClick={handleSubmit}
        />
      </form>
    </Modal>
  );
};

AccountModal.defaultProps = {
  openChargeModal: undefined,
  setToast: undefined,
  refetchBalance: undefined,
};

export default AccountModal;
