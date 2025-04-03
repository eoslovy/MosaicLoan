'use client';

// import MyPageSectionTabNav from '@/components/my/MyPageSectionTabNav';
import MyAccount from '@/components/my/MyAccount';
import MyAccountTransactionList from '@/components/my/MyAccountTransactionList';

const MyAccountPage = () => {
  return (
    <main>
      {/* <MyPageSectionTabNav activeIndex={1} onTabClick={() => {}} /> */}
      <section className='mt-6'>
        <MyAccount />
        <MyAccountTransactionList />
      </section>
    </main>
  );
};

export default MyAccountPage;
