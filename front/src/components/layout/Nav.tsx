'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/layouts/Nav.module.scss';
import { handleKakaoLogin } from '@/utils/auth';
import useUser from '@/hooks/useUser';
import { useUserStore } from '@/stores/userStore';

const Nav = () => {
  const user = useUser();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null); // 상태 초기화
      }
      // else {
      //   console.error('Logout failed:', res.status);
      // }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className={styles.nav}>
      {/* 로고 부분 */}
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

      {/* 이동 버튼 */}
      <div className={styles.nav__center}>
        <Link href='/investor' className={styles['nav__center-link']}>
          <Text text='투자' size='sm' color='light-blue' />
        </Link>
        <Link href='/borrower' className={styles['nav__center-link']}>
          <Text text='대출' size='sm' color='light-blue' />
        </Link>
        <Link href='/about' className={styles['nav__center-link']}>
          <Text text='서비스 소개' size='sm' color='light-blue' />
        </Link>
      </div>

      {/* 로그인/로그아웃 영역 */}
      <div className={styles.nav__right}>
        {user ? (
          <>
            <Button
              label={{ text: `${user.username}님`, size: 'sm', color: 'blue' }}
              variant='outlined'
              size='normal'
              onClick={() => {}}
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
