'use client';

import React, { useEffect, useState } from 'react';
import TotalContractsOverview from '@/components/investor/TotalContractsOverview';
import ContractsFilter from '@/components/investor/ContractsFilter';
import ContractsList from '@/components/investor/ContractsList';
import { fetchContractSummary } from '@/service/apis/investments';
import EmptyState from '@/components/empty/investor/EmptyState';
import request from '@/service/apis/request';
import type { ContractSummaryResponse } from '@/types/pages';

interface Transaction {
  id: number;
  contractId: number;
  investmentId: number;
  amount: string;
  createdAt: string;
  status: string;
  bondMaturity: string;
  interestRate: string;
}

interface ApiResponseData {
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
    totalItemCount: number;
  };
  transactions: Transaction[];
}

const ContractsPage = () => {
  const [summaryData, setSummaryData] =
    useState<ContractSummaryResponse | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isSummaryError, setIsSummaryError] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  const [sortState, setSortState] = useState<
    { field: string; order: string }[]
  >([]);

  const [currentSearchParams, setCurrentSearchParams] = useState<
    Record<string, unknown>
  >({
    startDate: '',
    endDate: '',
    types: [],
    investmentIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchContractSummary();
        setSummaryData(result);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('채권 요약 정보 요청 실패', error);
        }
        setIsSummaryError(true);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchData();
  }, []);

  const fetchTransactions = async (params: any) => {
    setIsLoadingTransactions(true);
    setTransactionsError(null);

    try {
      const response = await request.POST<ApiResponseData>(
        '/api/contract/investments/transactions/search',
        params
      );

      if (response && response.transactions) {
        setTransactions(response.transactions);
        setCurrentPage(response.pagination.page);
        setPageSize(response.pagination.pageSize);
        setTotalPages(response.pagination.totalPage);
      } else {
        throw new Error('유효하지 않은 응답 데이터입니다.');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : '거래 데이터를 가져오는데 실패했습니다.';

      if (process.env.NODE_ENV === 'development') {
        console.error('거래 데이터 검색 중 오류가 발생했습니다:', err);
      }

      setTransactionsError(message);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleSearch = (searchParams: any) => {
    const finalParams = {
      ...searchParams,
      page: 1,
      pageSize,
      sort: sortState
    };

    setCurrentPage(1);
    setCurrentSearchParams(searchParams);
    fetchTransactions(finalParams);
  };

  const handleSortChange = (newSortState: { field: string; order: string }[]) => {
    setSortState(newSortState);

    const finalParams = {
      ...currentSearchParams,
      page: 1,
      pageSize,
      sort: newSortState
    };

    setCurrentPage(1);
    fetchTransactions(finalParams);
  };

  const handlePageChange = (newPage: number) => {
    const finalParams = {
      ...currentSearchParams,
      page: newPage,
      pageSize,
      sort: sortState
    };

    setCurrentPage(newPage);
    fetchTransactions(finalParams);
  };

  if (isLoadingSummary) {
    return <EmptyState message='채권 정보를 불러오는 중입니다' />;
  }

  if (isSummaryError || !summaryData) {
    return <EmptyState message='채권 요약 정보를 불러올 수 없습니다.' />;
  }

  return (
    <>
      <TotalContractsOverview />
      <ContractsFilter onSearch={handleSearch} />
      <ContractsList
        transactions={transactions}
        isLoading={isLoadingTransactions}
        error={transactionsError}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </>
  );
};

export default ContractsPage;
