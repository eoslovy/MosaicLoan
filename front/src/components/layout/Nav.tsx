'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/layouts/Nav.module.scss';
import { handleKakaoLogin, handleLogout as logout } from '@/utils/auth';
import { useUserStore } from '@/stores/userStore';
import useUser from '@/hooks/useUser';

const Nav = () => {
  const { user, isFetched } = useUser();
  const router = useRouter();

  if (!isFetched) {
    return null;
  }

  // const maskName = (name: string) => {
  //   if (name.length <= 2) return `${name[0]} *`;
  //   return `${name[0]} * ${name[name.length - 1]}`;
  // };

  const handleLogout = async () => {
    try {
      await logout();
      useUserStore.getState().setUser(null);
      useUserStore.getState().setIsFetched(false);
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleProtectedRoute = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      handleKakaoLogin();
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.nav__logo}>
        <Link href='/'>
          <Image
            src='/img/logo_nav.svg'
            alt='Logo'
            width={120}
            height={40}
            className='cursor-pointer'
          />
        </Link>
      </div>

      <div className={styles.nav__center}>
        <button
          type='button'
          onClick={() => handleProtectedRoute('/investor')}
          className={styles['nav__center-link']}
        >
          <Text text='투자' size='sm' color='light-blue' />
        </button>
        <button
          type='button'
          onClick={() => handleProtectedRoute('/borrower')}
          className={styles['nav__center-link']}
        >
          <Text text='대출' size='sm' color='light-blue' />
        </button>
        <Link href='/about' className={styles['nav__center-link']}>
          <Text text='서비스 소개' size='sm' color='light-blue' />
        </Link>
      </div>

      <div className={styles.nav__right}>
        {user ? (
          <>
            <Button
              label={{
                text: `${user.username}님`,
                size: 'sm',
                color: 'blue',
              }}
              variant='outlined'
              size='normal'
              onClick={() => handleProtectedRoute('/my')}
            />
            <Button
              label={{ text: '로그아웃', size: 'sm', color: 'blue' }}
              variant='outlined'
              size='normal'
              onClick={handleLogout}
            />
          </>
        ) : (
          <Button
            label={{ text: '로그인', size: 'sm', color: 'blue' }}
            variant='outlined'
            size='normal'
            onClick={handleKakaoLogin}
          />
        )}
      </div>
    </nav>
  );
};

export default Nav;
