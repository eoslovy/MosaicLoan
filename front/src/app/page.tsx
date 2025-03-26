import Image from 'next/image';
import React from 'react';
import Hero from '@/components/layout/Hero';

const Home = () => (
  <div className='w-full min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]'>
    {/* 메인 콘텐츠 */}
    <main className='flex flex-col gap-8 px-6 sm:px-10 pt-3 sm:pt-10 items-center sm:items-start'>
      <Hero />
    </main>

    {/* 푸터 */}
    <footer className='mt-auto flex gap-6 flex-wrap items-center justify-center py-6'>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://nextjs.org/learn'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          aria-hidden
          src='/file.svg'
          alt='File icon'
          width={16}
          height={16}
        />
        Learn
      </a>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://vercel.com/templates'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          aria-hidden
          src='/window.svg'
          alt='Window icon'
          width={16}
          height={16}
        />
        Examples
      </a>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://nextjs.org'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          aria-hidden
          src='/globe.svg'
          alt='Globe icon'
          width={16}
          height={16}
        />
        Go to nextjs.org →
      </a>
    </footer>
  </div>
);

export default Home;
