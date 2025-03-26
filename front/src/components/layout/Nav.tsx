'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/layouts/Nav.module.scss';
import { handleKakaoLogin } from '@/utils/auth';
import useUser from '@/hooks/useUser';

const Nav = () => {
  const user = useUser();

  const handleLogout = async () => {
    await fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.reload();
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
            <Text text={`${user.username}님`} size='sm' color='blue' />
            <Button
              label={{ text: '로그아웃', size: 'sm', color: 'blue' }}
              variant='outlined'
              size='normal'
              onClick={handleLogout}
            />
          </>
        ) : (
          <>
            <Button
              label={{ text: '로그인', size: 'sm', color: 'blue' }}
              variant='outlined'
              size='normal'
              onClick={handleKakaoLogin}
            />
            <Button
              label={{ text: '회원가입', size: 'sm', color: 'white' }}
              variant='filled'
              size='normal'
            />
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
