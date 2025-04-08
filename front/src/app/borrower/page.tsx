'use client';

import { useEffect, useState } from 'react';
import BorrowerCreditSection from '@/components/borrower/BorrowerCreditSection';
import LoanSummarySection from '@/components/borrower/LoanSummarySection';
import LoanOverview from '@/components/borrower/LoanOverview';
import LoanFilter from '@/components/borrower/LoanFilter';
import LoanList from '@/components/borrower/LoanList';
import { getLoanOverview, LoanOverviewResponse } from'@/service/apis/borrow';
import request from '@/service/apis/request';
import { format } from 'date-fns';

export interface LoanTransaction {
  id: number;
  contractId: number;
  amount: string;
  createdAt: string;
  status: string;
  dueDate: string;
  interestRate: number;
}

export interface LoanSearchParams {
  startDate: string;
  endDate: string;
  types: string[];
  page?: number;
  pageSize?: number;
  sort?: Array<{
    field: string;
    order: 'asc' | 'desc' | 'unsorted';
  }>;
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

const BorrowerPage = () => {
  const [loanData, setLoanData] = useState<LoanOverviewResponse | null>(null);
  const [searchedLoans, setSearchedLoans] = useState<LoanTransaction[]>([]);
  const [pagination, setPagination] = useState<LoanSearchResponse['pagination']>({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItemCount: 0,
  });
  const [error, setError] = useState(false);
  const [creditKey, setCreditKey] = useState(0);

  const handleEvaluationComplete = () => {
    setCreditKey((prev) => prev + 1); // 신용평가 한 다음에 화면 리렌더링하기 위함.
  };

  const handleLoanSearch = async (searchParams: LoanSearchParams) => {
    try {
      const defaultSort = [
        { field: 'createdAt', order: 'desc' as const },
      ];

      const response = await request.POST<LoanSearchResponse>(
        '/api/contract/loans/transactions/search', 
        {
          ...searchParams,
          page: searchParams.page || 1,
          pageSize: searchParams.pageSize || 10,
          sort: searchParams.sort || defaultSort,
        }
      );
      console.log
      setSearchedLoans(response.transactions);
      setPagination(response.pagination);
    } catch (err) {
      console.error('대출 검색 데이터 불러오기 실패:', err);
      setError(true);
    }
  };

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const data = await getLoanOverview();
        setLoanData(data);
      } catch (err) {
        console.error('대출 요약 데이터 불러오기 실패:', err);
        setError(true);
      }
    };

    fetchLoanData();
  }, []);

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
        onPageChange={(page) => handleLoanSearch({ 
          startDate: format(new Date(), 'yyyy-MM-dd'), 
          endDate: format(new Date(), 'yyyy-MM-dd'), 
          types: ['상환중', '상환완료'], 
          page 
        })}
      />
    </>
  );
};

export default BorrowerPage;
