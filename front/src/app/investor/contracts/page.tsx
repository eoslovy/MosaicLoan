'use client';

import React, { useEffect, useState } from 'react';
import TotalContractsOverview from '@/components/investor/TotalContractsOverview';
import ContractsFilter from '@/components/investor/ContractsFilter';
import ContractsList from '@/components/investor/ContractsList';
import { fetchContractSummary } from '@/service/apis/investments';
import EmptyState from '@/components/empty/investor/EmptyState';
import request from '@/service/apis/request';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import type {
  InvestOverview,
  ContractResponse,
  Transaction,
  ApiResponseData,
} from '@/types/pages';

interface SearchParams extends Record<string, unknown> {
  startDate?: string;
  endDate?: string;
  types?: string[];
  investmentIds?: number[];
}

interface SortState {
  field: string;
  order: string;
}

const ContractsPage = () => {
  useAuthRedirect('/borrower'); // 로그인 안 된 경우 리디렉션 경로

  const [responseData, setResponseData] = useState<ContractResponse | null>(
    null,
  );
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isSummaryError, setIsSummaryError] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [sortState, setSortState] = useState<SortState[]>([]);

  const [currentSearchParams, setCurrentSearchParams] = useState<SearchParams>({
    startDate: '',
    endDate: '',
    types: [],
    investmentIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await request.GET<ContractResponse>(
          '/contract/investments',
        );
        setResponseData(result);
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

  const fetchTransactions = async (
    params: SearchParams & {
      page: number;
      pageSize: number;
      sort: SortState[];
    },
  ) => {
    setIsLoadingTransactions(true);
    setTransactionsError(null);

    try {
      const response = await request.POST<ApiResponseData>(
        '/contract/investments/transactions/search',
        params,
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

  const handleSearch = (searchParams: SearchParams) => {
    const finalParams = {
      ...searchParams,
      page: 1,
      pageSize,
      sort: sortState,
    };

    setCurrentPage(1);
    setCurrentSearchParams(searchParams);
    fetchTransactions(finalParams);
  };

  const handleSortChange = (newSortState: SortState[]) => {
    setSortState(newSortState);

    const finalParams = {
      ...currentSearchParams,
      page: 1,
      pageSize,
      sort: newSortState,
    };

    setCurrentPage(1);
    fetchTransactions(finalParams);
  };

  const handlePageChange = (newPage: number) => {
    const finalParams = {
      ...currentSearchParams,
      page: newPage,
      pageSize,
      sort: sortState,
    };

    setCurrentPage(newPage);
    fetchTransactions(finalParams);
  };

  if (isLoadingSummary) {
    return <EmptyState message='채권 정보를 불러오는 중입니다' />;
  }

  if (isSummaryError || !responseData) {
    return <EmptyState message='채권 요약 정보를 불러올 수 없습니다.' />;
  }

  return (
    <>
      <TotalContractsOverview data={responseData.investOverview} />
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
