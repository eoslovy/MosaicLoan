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
  const [error, setError] = useState(false);
  const [creditKey, setCreditKey] = useState(0);

  const handleEvaluationComplete = () => {
    setCreditKey((prev) => prev + 1); // 신용평가 한 다음에 화면 리렌더링하기 위함.
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
      <LoanFilter />
      <LoanList />
    </>
  );
};

export default BorrowerPage;
