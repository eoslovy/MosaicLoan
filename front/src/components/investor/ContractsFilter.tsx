import React, { useState } from 'react';
import styles from '@/styles/investors/ContractsFilter.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import FilterSelectTable from '@/components/common/FilterSelectTable';

const typeOptions = [
  { value: 'all', label: '전체 유형' },
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

interface ContractRow {
  id: string;
  name: string;
  count: number;
  startDate: string;
  status: '진행중' | '완료'; // status 필드를 "진행중" 또는 "완료"로 지정
}

const ContractsFilter = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date('2024-12-14'),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date('2025-03-17'));
  const [selectedTypes, setSelectedTypes] = useState<
    MultiValue<{ label: string; value: string }>
  >([typeOptions[0]]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // Initialize as empty array
  const [isOpen, setIsOpen] = useState(false);

  const data: ContractRow[] = [
    {
      id: '1',
      name: '투자 A',
      count: 5,
      startDate: '2024-01-01',
      status: '진행중',
    },
    {
      id: '2',
      name: '투자 B',
      count: 10,
      startDate: '2024-02-01',
      status: '완료',
    },
    // 데이터 수정 시 status 값을 "진행중" 또는 "완료"로 설정
  ];

  // 선택된 항목들 필터링
  const selectedData = data.filter((row) => selectedIds.includes(row.id));

  return (
    <div className={styles.filterContainer}>
      <div className={styles.row}>
        <div className={styles.filterItem}>
          <span className={styles.label}>거래일</span>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat='yyyy-MM-dd'
            className={styles.dateInput}
          />
          <span className={styles.tilde}>~</span>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
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
            onChange={(value) => setSelectedTypes(value)}
            className={styles.select}
            styles={customSelectStyles}
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
          <div className={styles.filterItem}>
            <button type='button' className={styles.searchButton}>
              검색하기
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.detailBox}>
          <div className={styles.detailInner}>
            {/* Pass the selectedIds to FilterSelectTable */}
            <FilterSelectTable
              data={data} // Pass data
              selectedIds={selectedIds} // Pass selectedIds
              onSelect={setSelectedIds} // Pass the function to update selectedIds
            />
          </div>

          <div className={styles.buttonWrapper}>
            <button type='button' className={styles.searchButton}>
              검색하기
            </button>
          </div>
        </div>
      )}

      <div className={styles.selectedData}>
        {/* Display selected items */}
        {selectedData.map((row) => (
          <div key={row.id} className={styles.selectedItem}>
            <span
              className={
                row.status === '진행중'
                  ? styles.ongoingBadge
                  : styles.finishedBadge
              }
            >
              {row.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractsFilter;
