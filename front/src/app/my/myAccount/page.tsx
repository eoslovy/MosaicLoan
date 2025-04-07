'use client';

import { useEffect } from 'react';
import MyAccount from '@/components/my/MyAccount';
import MyAccountTransactionFilter from '@/components/my/MyAccountTransactionFilter';
import MyAccountTransactionList from '@/components/my/MyAccountTransactionList';
import useAccountTransactionStore from '@/stores/useAccountTransactionStore';
import { format } from 'date-fns';

const MyAccountPage = () => {
  const fetchTransactions = useAccountTransactionStore(
    (state) => state.fetchTransactions,
  );

  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // 날짜 포맷 맞추기 (YYYY-MM-DD)
    const startDate = format(oneMonthAgo, 'yyyy-MM-dd');
    const endDate = format(today, 'yyyy-MM-dd');

    fetchTransactions({
      startDate,
      endDate,
      types: [
        'EXTERNAL_OUT',
        'EXTERNAL_IN',
        'INVESTMENT_OUT',
        'INVESTMENT_IN',
        'LOAN_OUT',
        'LOAN_IN',
      ],
      page: 1,
      pageSize: 10,
    });
  }, [fetchTransactions]);

  return (
    <main>
      <section className='mt-6'>
        <MyAccount />
        <MyAccountTransactionFilter />
        <MyAccountTransactionList />
      </section>
    </main>
  );
};

export default MyAccountPage;
