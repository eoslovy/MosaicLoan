import BorrowerCreditSection from '@/components/borrower/BorrowerCreditSection';
import LoanSummarySection from '@/components/borrower/LoanSummarySection';
import LoanOverview from '@/components/borrower/LoanOverview';
import LoanFilter from '@/components/borrower/LoanFilter';
import LoanList from '@/components/borrower/LoanList';

const BorrowerPage = () => {
  return (
    <>
      <BorrowerCreditSection />
      <LoanSummarySection />
      <LoanOverview />
      <LoanFilter />
      <LoanList />
    </>
  );
};

export default BorrowerPage;
