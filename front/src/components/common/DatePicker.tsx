'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '@/styles/common/DatePicker.module.scss';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  placeholderText?: string;
}

const DatePickerComponent = ({
  selected,
  onChange,
  minDate,
  placeholderText,
}: DatePickerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [localDate, setLocalDate] = useState<Date | null>(selected);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!isInternalChange.current && selected) {
      const year = selected.getFullYear();
      const month = String(selected.getMonth() + 1).padStart(2, '0');
      const day = String(selected.getDate()).padStart(2, '0');
      setInputValue(`${year}-${month}-${day}`);
      setLocalDate(selected);
    }
    isInternalChange.current = false;
  }, [selected]);

  const formatInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');

    let result = '';
    if (numbers.length > 0) {
      result += numbers.substring(0, 4);
      if (numbers.length > 4) {
        result += `-${numbers.substring(4, 6)}`;
        if (numbers.length > 6) {
          result += `-${numbers.substring(6, 8)}`;
        }
      }
    }
    return result;
  };

  const validateAndUpdateDate = (formatted: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const setToToday = () => {
      isInternalChange.current = true;
      setLocalDate(today);
      onChange(today);

      const todayYear = today.getFullYear();
      const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
      const todayDay = String(today.getDate()).padStart(2, '0');
      setInputValue(`${todayYear}-${todayMonth}-${todayDay}`);
    };

    if (formatted.length === 10) {
      const [year, month, day] = formatted.split('-').map(Number);
      if (month < 1 || month > 12) {
        setToToday();
        return;
      }

      const lastDayOfMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > lastDayOfMonth) {
        setToToday();
        return;
      }

      const date = new Date(year, month - 1, day);

      if (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      ) {
        if (date < today) {
          setToToday();
        } else {
          isInternalChange.current = true;
          setLocalDate(date);
          onChange(date);
        }
      } else {
        setToToday();
      }
    } else {
      setToToday();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInput(e.target.value);
    setInputValue(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndUpdateDate(inputValue);
    }
  };

  const handleBlur = () => {
    validateAndUpdateDate(inputValue);
  };

  const handleCalendarChange = (date: Date | null) => {
    isInternalChange.current = true;
    setLocalDate(date);
    onChange(date);

    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      setInputValue(`${year}-${month}-${day}`);
    } else {
      setInputValue('');
    }
  };

  return (
    <div className={styles.datePickerWrapper}>
      <input
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholderText}
        className={styles.dateInput}
        maxLength={10}
      />
      <div className={styles.calendarWrapper}>
        <ReactDatePicker
          selected={localDate}
          onChange={handleCalendarChange}
          minDate={minDate}
          dateFormat='yyyy-MM-dd'
          inline
          showPopperArrow={false}
          openToDate={localDate || minDate}
        />
      </div>
    </div>
  );
};

DatePickerComponent.defaultProps = {
  minDate: new Date(),
  placeholderText: '____-__-__',
};

export default DatePickerComponent;
