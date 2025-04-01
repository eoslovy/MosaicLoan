'use client';

import React, { useState } from 'react';
import styles from '@/styles/investors/ContractsFilter.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import FilterSelectTable from '@/components/common/FilterSelectTable';
import type { ContractRow } from '@/types/pages';
import { subYears, isBefore } from 'date-fns';
import type { PillVariant } from '@/types/components';
import Pill from '@/components/common/Pill';

const typeOptions = [
  { value: 'repayment', label: '상환' },
  { value: 'delayed', label: '연체' },
  { value: 'defaulted', label: '부실' },
];

const customSelectStyles: StylesConfig<{ label: string; value: string }, true> =
  {
    container: (base) => ({
      ...base,
      minWidth: '160px',
    }),
  };

const getStatusVariant = (status: string): PillVariant => {
  switch (status) {
    case '완료':
    case '상환완료':
      return 'repayment-complete';
    case '진행중':
      return 'repayment-in-progress';
    default:
      return 'repayment-in-progress';
  }
};

const ContractsFilter = () => {
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

  const data: ContractRow[] = Array.from({ length: 14 }, (_, idx) => ({
    id: `mock-${idx + 1}`,
    name: idx % 2 === 0 ? '투자 A' : '투자 B',
    count: idx % 2 === 0 ? 5 : 10,
    startDate: idx % 2 === 0 ? '2024-01-01' : '2024-02-01',
    status: idx % 2 === 0 ? '진행중' : '완료',
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

        <div className={styles.filterItem}>
          <button
            type='button'
            className={styles.toggleButton}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            상세 필터링 설정{' '}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {!isOpen && (
          <div className={styles.buttonWrapper}>
            <button type='button' className={styles.searchButton}>
              검색하기
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.detailBox}>
          <div className={styles.detailInner}>
            <div className={styles.tableWrapper}>
              <FilterSelectTable
                data={data}
                selectedIds={selectedIds}
                onSelect={setSelectedIds}
                columns={['투자명', '거래 건수', '투자 시작일']}
              />
            </div>

            <div className={styles.selectedData}>
              {selectedData.map((row) => (
                <div key={`${row.id}`} className={styles.selectedItem}>
                  <Pill variant={getStatusVariant(row.status)}>
                    {row.name}
                    <X size={14} onClick={() => handleRemoveSelected(row.id)} />
                  </Pill>
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

export default ContractsFilter;
