'use client';

import React, { useState, useCallback } from 'react';
import styles from '@/styles/investors/ContractsFilter.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { MultiValue, StylesConfig } from 'react-select';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import FilterSelectTable from '@/components/common/FilterSelectTable';
import { subYears, isBefore, format } from 'date-fns';
import type { PillVariant } from '@/types/components';
import Pill from '@/components/common/Pill';
import request from '@/service/apis/request';
import type { ContractResponse, Investment } from '@/types/pages';

const typeOptions = [
  { value: 'LOAN', label: '대출' },
  { value: 'INTEREST', label: '이자' },
  { value: 'PRINCIPAL', label: '원금' },
  { value: 'OWNERSHIP_TRANSFER', label: '소유권 이전' },
];

const typeValueToApiValue = {
  LOAN: '대출',
  INTEREST: '이자',
  PRINCIPAL: '원금',
  OWNERSHIP_TRANSFER: '소유권 이전',
};

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
    case 'COMPLETED':
      return 'repayment-complete';
    case '진행중':
    case 'IN_PROGRESS':
      return 'repayment-in-progress';
    default:
      return 'repayment-in-progress';
  }
};

interface ContractsFilterProps {
  onSearch: (searchParams: Record<string, unknown>) => void;
}

const ContractsFilter = ({ onSearch }: ContractsFilterProps) => {
  const today = new Date();
  const oneYearAgo = subYears(today, 1);

  const [startDate, setStartDate] = useState<Date | null>(oneYearAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [selectedTypes, setSelectedTypes] =
    useState<MultiValue<{ label: string; value: string }>>(typeOptions);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [investmentData, setInvestmentData] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContrackData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await request.GET<ContractResponse>(
        '/contract/investments',
      );

      if (response?.investments && Array.isArray(response.investments)) {
        setInvestmentData(response.investments);
      } else {
        throw new Error('올바른 형식의 데이터를 받지 못했습니다.');
      }
    } catch (err) {
      console.error('데이터 로딩 중 오류:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDetails = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen && investmentData.length === 0) {
      fetchContrackData();
    }
  };

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

  const handleSearch = useCallback(() => {
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';

    // const types = selectedTypes.map(
    //   (type) =>
    //     typeValueToApiValue[type.value as keyof typeof typeValueToApiValue],
    // );
    const types = selectedTypes.map((type) => type.value);

    const searchParams = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      types,
      investmentIds: selectedIds.map((id) => parseInt(id, 10)),
    };

    onSearch(searchParams);
  }, [startDate, endDate, selectedTypes, selectedIds, onSearch]);

  const data = investmentData.length > 0 ? investmentData : [];
  const selectedData = data.filter((item) =>
    selectedIds.includes(item.investmentId.toString()),
  );

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
            onClick={handleToggleDetails}
          >
            상세 필터링 설정{' '}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {!isOpen && (
          <div className={styles.buttonWrapper}>
            <button
              type='button'
              className={styles.searchButton}
              onClick={handleSearch}
            >
              검색하기
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={styles.detailBox}>
          <div className={styles.detailInner}>
            <div className={styles.tableWrapper}>
              {isLoading ? (
                <div>데이터 로딩 중...</div>
              ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
              ) : (
                <FilterSelectTable
                  data={data}
                  selectedIds={selectedIds}
                  onSelect={setSelectedIds}
                  columns={['투자명', '거래 건수', '투자 시작일']}
                />
              )}
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <Pill variant='repayment-complete' size='small'>
                    거래 완료
                  </Pill>
                </div>
                <div className={styles.legendItem}>
                  <Pill variant='repayment-in-progress' size='small'>
                    거래중
                  </Pill>
                </div>
              </div>
            </div>

            <div className={styles.selectedData}>
              {selectedData.map((item) => (
                <div
                  key={`${item.investmentId}`}
                  className={styles.selectedItem}
                >
                  <Pill
                    variant={getStatusVariant(item.investStatus)}
                    onClose={() =>
                      handleRemoveSelected(item.investmentId.toString())
                    }
                  >
                    {`INVEST - ${item.investmentId}`}
                  </Pill>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <button
              type='button'
              className={styles.searchButton}
              onClick={handleSearch}
            >
              검색하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsFilter;
