'use client';

import { Noto_Sans_KR } from 'next/font/google';
import React, { useEffect } from 'react';
import './globals.css';
import Nav from '@/components/layout/Nav';
// import Providers from './providers';
import { useRouter } from 'next/navigation';
import Msw from '@/mocks/Msw';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();

  useEffect(() => {
    const onUnauthorized = () => router.replace('/');
    window.addEventListener('unauthorized', onUnauthorized);
    return () => window.removeEventListener('unauthorized', onUnauthorized);
  }, [router]);

  return (
    <html lang='ko'>
      <body
        className={`${notoSansKR.variable} antialiased bg-white text-black`}
      >
        <Msw>
          <Nav />
          <main id='main'>{children}</main>
        </Msw>
      </body>
    </html>
  );
};

export default RootLayout;
