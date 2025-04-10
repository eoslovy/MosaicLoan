'use client';

import MyInfo from '@/components/my/MyInfo';
import useAuthRedirect from '@/hooks/useAuthRedirect';

const MyInfoPage = () => {
  useAuthRedirect('/my/myInfo');
  return (
    <main>
      <section className='mt-6'>
        <MyInfo />
      </section>
    </main>
  );
};

export default MyInfoPage;
