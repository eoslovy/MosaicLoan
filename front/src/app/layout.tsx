import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import React from 'react';
import './globals.css';
import Nav from '@/components/layout/Nav';
import Providers from './providers';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'P2P 금융 플랫폼',
  description: '투자와 대출을 간편하게',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang='ko'>
    <body className={`${notoSansKR.variable} antialiased`}>
      <Providers>
        <Nav />
        <main>{children}</main>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
