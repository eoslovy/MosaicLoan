'use client';

// import { useState } from 'react';
// import MyPageSectionTabNav from '@/components/my/MyPageSectionTabNav';
import MyInfo from '@/components/my/MyInfo';

const MyInfoPage = () => {
  return (
    <main>
      {/* <MyPageSectionTabNav activeIndex={0} onTabClick={() => {}} /> */}
      <section className='mt-6'>
        <MyInfo />
      </section>
    </main>
  );
};

export default MyInfoPage;
