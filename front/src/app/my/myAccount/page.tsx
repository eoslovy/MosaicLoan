'use client';

import MyAccount from '@/components/my/MyAccount';
import MyAccountTransactionList from '@/components/my/MyAccountTransactionList';

const MyAccountPage = () => {
  return (
    <main>
      <section className='mt-6'>
        <MyAccount />
        <MyAccountTransactionList />
      </section>
    </main>
  );
};

export default MyAccountPage;
