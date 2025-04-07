'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/uis/InvestmentModal.module.scss';

interface WeekPickerProps {
  selected: number;
  onChange: (weeks: number, endDate: Date) => void;
  maxWeeks?: number;
  placeholderText?: string;
}

const WeekPicker = ({
  selected,
  onChange,
  maxWeeks = 52,
  placeholderText = '주차를 선택하세요',
}: WeekPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState<number | null>(
    selected || null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedWeeks(selected || null);
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateEndDate = (weeks: number): Date => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + weeks * 7);
    return endDate;
  };

  const handleWeekSelect = (weeks: number) => {
    setSelectedWeeks(weeks);
    const endDate = calculateEndDate(weeks);
    onChange(weeks, endDate);
    setIsOpen(false);
  };

  const formatEndDate = (weeks: number): string => {
    const endDate = calculateEndDate(weeks);
    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, '0');
    const day = String(endDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles.weekPickerWrapper} ref={dropdownRef}>
      <div
        className={styles.weekInput}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
          }
        }}
        role='button'
        tabIndex={0}
      >
        <div className={styles.weekText}>
          {selectedWeeks ? (
            <>
              <span>{selectedWeeks}주</span>
              <span> ({formatEndDate(selectedWeeks)})</span>
            </>
          ) : (
            <span className={styles.placeholder}>{placeholderText}</span>
          )}
        </div>
        <span className={`${styles.arrowIcon} ${isOpen ? styles.arrowUp : ''}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdownWrapper}>
          {Array.from({ length: maxWeeks }, (_, i) => i + 1).map((weeks) => (
            <div
              key={weeks}
              className={`${styles.weekOption} ${
                selectedWeeks === weeks ? styles.selected : ''
              }`}
              onClick={() => handleWeekSelect(weeks)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleWeekSelect(weeks);
                }
              }}
              role='button'
              tabIndex={0}
            >
              {weeks}주 ({formatEndDate(weeks)})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

WeekPicker.defaultProps = {
  maxWeeks: 52,
  placeholderText: '주차를 선택하세요',
};

export default WeekPicker;
