'use client';

import { useEffect, useState } from 'react';
import BorrowerCreditSection from '@/components/borrower/BorrowerCreditSection';
import LoanSummarySection from '@/components/borrower/LoanSummarySection';
import LoanOverview from '@/components/borrower/LoanOverview';
import LoanFilter from '@/components/borrower/LoanFilter';
import LoanList from '@/components/borrower/LoanList';
import EmptyState from '@/components/empty/investor/EmptyState';
import { getLoanOverview, LoanOverviewResponse } from '@/service/apis/borrow';
import request from '@/service/apis/request';
import { format, subMonths } from 'date-fns';
import { LoanTransaction, LoanSearchParams } from '@/types/components';

export interface LoanSortState {
  field: string;
  order: string;
}

export interface LoanSearchResponse {
  transactions: LoanTransaction[];
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
    totalItemCount: number;
  };
}

const loanStatusMap: Record<string, string> = {
  상환중: 'IN_PROGRESS',
  상환완료: 'COMPLETED',
  대출신청: 'PENDING',
  일부연체: 'PARTIALLY_DELINQUENT',
  연체: 'DELINQUENT',
};

const BorrowerPage = () => {
  const [loanData, setLoanData] = useState<LoanOverviewResponse | null>(null);
  const [isLoadingLoanData, setIsLoadingLoanData] = useState(true);
  const [loanDataError, setLoanDataError] = useState<string | null>(null);

  const [searchedLoans, setSearchedLoans] = useState<LoanTransaction[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(false);
  const [loansError, setLoansError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<
    LoanSearchResponse['pagination']
  >({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItemCount: 0,
  });

  const [creditKey, setCreditKey] = useState(0);
  const [currentSearchParams, setCurrentSearchParams] =
    useState<LoanSearchParams>({
      startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      types: ['상환중', '상환완료', '대출신청', '일부연체', '연체'].map(
        (type) => loanStatusMap[type],
      ),
    });
  const [sortState, setSortState] = useState<
    { field: string; order: string }[]
  >([]);

  const handleEvaluationComplete = () => {
    setCreditKey((prev) => prev + 1);
  };

  const fetchLoans = async (
    params: LoanSearchParams & {
      page: number;
      pageSize: number;
      sort: LoanSortState[];
    },
  ) => {
    setIsLoadingLoans(true);
    setLoansError(null);

    const defaultSortFields: LoanSortState[] = [
      { field: 'amount', order: 'asc' },
      { field: 'createdAt', order: 'desc' },
      { field: 'dueDate', order: 'asc' },
    ];

    const mergedSort: LoanSortState[] = defaultSortFields.map((defaultSort) => {
      const userSort = params.sort?.find((s) => s.field === defaultSort.field);
      return {
        field: defaultSort.field,
        order: userSort?.order ?? defaultSort.order,
      };
    });

    try {
      const response = await request.POST<LoanSearchResponse>(
        '/contract/loans/search',
        {
          ...params,
          types: params.types?.map((type) => loanStatusMap[type] ?? type),
          page: params.page || 1,
          pageSize: params.pageSize || 10,
          sort: mergedSort,
        },
      );

      setSearchedLoans(response.transactions);
      setPagination(response.pagination);
      setCurrentSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
        types: params.types,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '대출 검색 데이터 불러오기 실패';

      console.error('대출 검색 데이터 불러오기 실패:', err);
      setLoansError(errorMessage);
    } finally {
      setIsLoadingLoans(false);
    }
  };

  const handleLoanSearch = (searchParams: LoanSearchParams) => {
    fetchLoans({
      ...searchParams,
      page: 1,
      pageSize: 10,
      sort: sortState,
    });
  };

  const handleSortChange = (
    newSortState: { field: string; order: string }[],
  ) => {
    setSortState(newSortState);

    fetchLoans({
      ...currentSearchParams,
      page: 1,
      pageSize: 10,
      sort: newSortState,
    });
  };

  const handlePageChange = async (page: number) => {
    fetchLoans({
      ...currentSearchParams,
      page,
      pageSize: 10,
      sort: sortState,
    });
  };

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const data = await getLoanOverview();
        setLoanData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : '대출 요약 데이터 불러오기 실패';

        console.error('대출 요약 데이터 불러오기 실패:', err);
        setLoanDataError(errorMessage);
      } finally {
        setIsLoadingLoanData(false);
      }
    };

    fetchLoanData();
    fetchLoans({
      ...currentSearchParams,
      page: 1,
      pageSize: 10,
      sort: sortState,
    });
  }, []);

  if (isLoadingLoanData) {
    return <EmptyState message='대출 정보를 불러오는 중입니다' />;
  }

  if (loanDataError || !loanData) {
    return <EmptyState message='대출 요약 정보를 불러올 수 없습니다.' />;
  }

  const recentLoans = loanData?.recentLoans ?? [];
  const activeLoanCount = loanData?.activeLoanCount ?? 0;
  const totalCount = loanData?.totalCount ?? 0;
  const activeLoanAmount = loanData?.activeLoanAmount ?? 0;
  const averageInterestRate = loanData?.averageInterestRate ?? 0;

  return (
    <>
      <BorrowerCreditSection
        key={creditKey}
        onComplete={handleEvaluationComplete}
      />
      <LoanSummarySection recentLoans={recentLoans} />
      <LoanOverview
        activeLoanCount={activeLoanCount}
        totalCount={totalCount}
        activeLoanAmount={activeLoanAmount}
        averageInterestRate={averageInterestRate}
      />
      <LoanFilter onSearch={handleLoanSearch} />
      <LoanList
        loans={searchedLoans}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </>
  );
};

export default BorrowerPage;
