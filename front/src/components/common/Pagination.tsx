'use client';

import React from 'react';
import styles from '@/styles/components/Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 현재 페이지와 전체 페이지 검증 및 보정
  const validCurrentPage = Math.max(1, currentPage); // 현재 페이지가 0이하면 1로 설정
  const validTotalPages = Math.max(1, totalPages); // 전체 페이지가 0이하면 1로 설정

  const handlePrev = () => {
    if (validCurrentPage > 1) onPageChange(validCurrentPage - 1);
  };

  const handleNext = () => {
    if (validCurrentPage < validTotalPages) onPageChange(validCurrentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <button
        type='button'
        className={styles.paginationButton}
        onClick={handlePrev}
        disabled={validCurrentPage === 1}
      >
        이전
      </button>
      <span className={styles.pageInfo}>
        {validCurrentPage} / {validTotalPages}
      </span>
      <button
        type='button'
        className={styles.paginationButton}
        onClick={handleNext}
        disabled={validCurrentPage === validTotalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;