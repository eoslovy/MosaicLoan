'use client';

import React, { useState } from 'react';
import styles from '@/styles/borrowers/LoanFilter.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import FilterSelectTable from '@/components/common/FilterSelectTable';
import { subYears, isBefore } from 'date-fns';

import { ContractRow } from '@/types/components';

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

const LoanFilter = () => {
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

  const data: ContractRow[] = Array.from({ length: 10 }, (_, idx) => ({
    id: `loan-${idx + 1}`,
    name: `대출 ${idx + 1}`,
    startDate: `2024-0${(idx % 9) + 1}-01`,
    endDate: `2025-0${(idx % 9) + 1}-01`,
    status: idx % 2 === 0 ? '상환중' : '상환완료',
  }));

  const selectedData = data.filter((row) => selectedIds.includes(row.id));

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
            className={styles.toggleButton}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            상세 필터링 설정{' '}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {!isOpen && (
            <button type='button' className={styles.searchButton}>
              검색하기
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className={styles.detailBox}>
          <div className={styles.detailInner}>
            <div className={styles.tableWrapper}>
              <FilterSelectTable
                data={data}
                selectedIds={selectedIds}
                onSelect={setSelectedIds}
                columns={['대출명', '대출 시작일', '대출 만기일']}
              />
            </div>

            <div className={styles.selectedData}>
              {selectedData.map((row) => (
                <div key={row.id} className={styles.selectedItem}>
                  <span
                    className={
                      row.status === '상환중'
                        ? styles.ongoingBadge
                        : styles.finishedBadge
                    }
                  >
                    {row.name}
                    <X size={14} onClick={() => handleRemoveSelected(row.id)} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <button type='button' className={styles.searchButton}>
              검색하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanFilter;
