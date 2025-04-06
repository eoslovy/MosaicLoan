'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/my/MyAccountTransactionFilter.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { subMonths, isBefore, isAfter, format } from 'date-fns';
import useAccountTransactionStore from '@/stores/useAccountTransactionStore';
import type { AccountTransactionType } from '@/types/pages';

const transactionTypeOptions = [
  { value: 'EXTERNAL_OUT', label: '출금' },
  { value: 'EXTERNAL_IN', label: '입금' },
  { value: 'INVESTMENT_OUT', label: '투자금 입금' },
  { value: 'INVESTMENT_IN', label: '투자금 환급' },
  { value: 'LOAN_OUT', label: '대출금 상환' },
  { value: 'LOAN_IN', label: '대출금 입금' },
];

const today = new Date();
const oneMonthAgo = subMonths(today, 1);

const MyAccountTransactionFilter = () => {
  const [startDate, setStartDate] = useState<Date | null>(oneMonthAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [selectedTypes, setSelectedTypes] = useState<
    { value: string; label: string }[]
  >(transactionTypeOptions);

  const fetchTransactions = useAccountTransactionStore(
    (state) => state.fetchTransactions,
  );

  useEffect(() => {
    const calculatedMax =
      endDate && isAfter(endDate, today) ? today : (endDate ?? today);
    let calculatedMin = startDate ?? subMonths(calculatedMax, 1);

    if (isAfter(calculatedMin, calculatedMax)) {
      calculatedMin = subMonths(calculatedMax, 1);
    }

    setEndDate(calculatedMax);
    setStartDate(calculatedMin);
  }, [startDate, endDate]);

  const handleStartDateChange = (selected: Date | null) => {
    if (!selected) return;
    setStartDate(selected);
    if (endDate && isBefore(endDate, selected)) {
      setEndDate(selected);
    }
  };

  const handleEndDateChange = (selected: Date | null) => {
    if (!selected) return;
    const safeEnd = isAfter(selected, today) ? today : selected;
    setEndDate(safeEnd);

    if (startDate && isAfter(startDate, safeEnd)) {
      setStartDate(subMonths(safeEnd, 1));
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return;

    fetchTransactions({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      types: selectedTypes.map((t) => t.value as AccountTransactionType),
      page: 1,
      pageSize: 10,
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.row}>
        {/* 거래일 */}
        <div className={styles.filterItem}>
          <span className={styles.label}>거래일</span>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat='yyyy-MM-dd'
            className={styles.dateInput}
            maxDate={endDate || today}
          />
          <span className={styles.tilde}>~</span>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat='yyyy-MM-dd'
            className={styles.dateInput}
            minDate={startDate || oneMonthAgo}
            maxDate={today}
          />
        </div>

        {/* 거래유형 */}
        <div className={styles.filterItem}>
          <span className={styles.label}>거래유형</span>
          <div className={styles.select}>
            <Select
              options={transactionTypeOptions}
              isMulti
              value={selectedTypes}
              onChange={(value) =>
                setSelectedTypes(value as { value: string; label: string }[])
              }
              closeMenuOnSelect={false}
            />
          </div>
        </div>

        {/* 검색 버튼 */}
        <button
          type='button'
          className={styles.searchButton}
          onClick={handleSearch}
        >
          검색하기
        </button>
      </div>
    </div>
  );
};

export default MyAccountTransactionFilter;
