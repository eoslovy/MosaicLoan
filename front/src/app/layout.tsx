'use client';

import { Noto_Sans_KR } from 'next/font/google';
import React, { useEffect } from 'react';
import './globals.css';
import Nav from '@/components/layout/Nav';
import { useRouter } from 'next/navigation';
import Msw from '@/mocks/Msw';
import useUser from '@/hooks/useUser';

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
  useUser(); // 로그인 여부 확인

  useEffect(() => {
    const onUnauthorized = () => {
      const ignorePaths = ['/my/myAccount', '/my/myInfo']; // 제외할 경로들
      const currentPath = window.location.pathname;

      const shouldRedirect = !ignorePaths.some((path) =>
        currentPath.startsWith(path),
      );

      if (shouldRedirect) {
        router.replace('/');
      }
    };

    window.addEventListener('unauthorized', onUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', onUnauthorized);
    };
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
