'use client';

import { useEffect, useState } from 'react';
import BorrowerCreditSection from '@/components/borrower/BorrowerCreditSection';
import LoanSummarySection from '@/components/borrower/LoanSummarySection';
import LoanOverview from '@/components/borrower/LoanOverview';
import LoanFilter from '@/components/borrower/LoanFilter';
import LoanList from '@/components/borrower/LoanList';
import { getLoanOverview, LoanOverviewResponse } from '@/service/apis/borrow';

const BorrowerPage = () => {
  const [loanData, setLoanData] = useState<LoanOverviewResponse | null>(null);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const data = await getLoanOverview();
        setLoanData(data);
      } catch (err) {
        console.error('대출 요약 데이터 불러오기 실패:', err);
      }
    };

    fetchLoanData();
  }, []);

  if (!loanData) return null; // 로딩 처리 추가 가능

  return (
    <>
      <BorrowerCreditSection />
      <LoanSummarySection recentLoans={loanData.recentLoans} />
      <LoanOverview
        activeLoanCount={loanData.activeLoanCount}
        totalCount={loanData.totalCount}
        activeLoanAmount={loanData.activeLoanAmount}
        averageInterestRate={loanData.averageInterestRate}
      />
      <LoanFilter />
      <LoanList />
    </>
  );
};

export default BorrowerPage;
