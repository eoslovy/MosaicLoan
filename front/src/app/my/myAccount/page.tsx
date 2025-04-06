'use client';

import MyAccount from '@/components/my/MyAccount';
import MyAccountTransactionFilter from '@/components/my/MyAccountTransactionFilter';
import MyAccountTransactionList from '@/components/my/MyAccountTransactionList';

const MyAccountPage = () => {
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
