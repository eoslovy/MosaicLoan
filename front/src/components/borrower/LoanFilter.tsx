'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanFilter.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
// import FilterSelectTable from '@/components/common/FilterSelectTable';
import { subYears, isBefore, format } from 'date-fns';
// import Pill from '@/components/common/Pill';
// import { ContractRow } from '@/types/components';
import { LoanSearchParams } from '@/types/components';

const typeOptions = [
  { value: 'repaid', label: '상환완료' },
  { value: 'inProgress', label: '상환중' },
  { value: 'defaulted', label: '부실확정' },
  { value: 'delayed', label: '연체' },
];

const customSelectStyles: StylesConfig<{ label: string; value: string }, true> =
  {
    container: (base) => ({
      ...base,
      minWidth: '160px',
    }),
  };

interface LoanFilterProps {
  onSearch: (params: LoanSearchParams) => void;
}

const LoanFilter: React.FC<LoanFilterProps> = ({ onSearch }) => {
  const today = new Date();
  const oneYearAgo = subYears(today, 1);

  const [startDate, setStartDate] = useState<Date | null>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [selectedTypes, setSelectedTypes] =
    useState<MultiValue<{ label: string; value: string }>>(typeOptions);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return;
    setStartDate(date);
    if (endDate && isBefore(endDate, date)) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return;
    if (startDate && isBefore(date, startDate)) {
      setEndDate(startDate);
    } else {
      setEndDate(date);
    }
  };

  const handleTypeChange = (
    value: MultiValue<{ label: string; value: string }>,
  ) => {
    setSelectedTypes(value);
  };

  const handleRemoveSelected = (id: string) => {
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  const handleSearch = () => {
    if (!startDate || !endDate) return;

    const typeMap: { [key: string]: string } = {
      repaid: '상환완료',
      inProgress: '상환중',
      defaulted: '부실확정',
      delayed: '연체',
    };

    const searchParams: LoanSearchParams = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      types: selectedTypes.map((type) => typeMap[type.value] || type.value),
      page: 1,
      pageSize: 10,
      sort: [{ field: 'createdAt', order: 'desc' }],
    };

    onSearch(searchParams);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.row}>
        <div className={styles.filterItem}>
          <span className={styles.label}>거래일</span>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat='yyyy-MM-dd'
            className={styles.dateInput}
          />
          <span className={styles.tilde}>~</span>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat='yyyy-MM-dd'
            className={styles.dateInput}
          />
        </div>

        <div className={styles.filterItem}>
          <Filter size={16} />
          <Select
            options={typeOptions}
            isMulti
            value={selectedTypes}
            onChange={handleTypeChange}
            className={styles.select}
            styles={customSelectStyles}
            closeMenuOnSelect={false}
          />
        </div>

        <div className={styles.rightButtons}>
          <button
            type='button'
            className={styles.searchButton}
            onClick={handleSearch}
          >
            검색하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanFilter;
