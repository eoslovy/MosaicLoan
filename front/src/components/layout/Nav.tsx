'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/layouts/Nav.module.scss';
import { handleKakaoLogin, handleLogout as logout, handleProtectedRoute } from '@/utils/auth';
import useUser from '@/hooks/useUser';

const Nav = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className={styles.nav}>
      {/* 로고 */}
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

      {/* 가운데 메뉴 */}
      <div className={styles.nav__center}>
        {/* <button
          type='button'
          onClick={() => handleProtectedRoute(user, '/investor', router)}
          className={styles['nav__center-link']}
        >
          <Text text='투자' size='sm' color='light-blue' />
        </button>
        <button
          type='button'
          onClick={() => handleProtectedRoute(user, '/borrower', router)}
          className={styles['nav__center-link']}
        >
          <Text text='대출' size='sm' color='light-blue' />
        </button>
        <Link href='/about' className={styles['nav__center-link']}>
          <Text text='서비스 소개' size='sm' color='light-blue' />
        </Link>
      </div> */}

        {/* 일단 로그인 protectedRoute 대신 직접 라우팅 */}
        <button
          type='button'
          onClick={() => router.push('/investor')}
          className={styles['nav__center-link']}
        >
          <Text text='투자' size='sm' color='light-blue' />
        </button>
        <button
          type='button'
          onClick={() => router.push('/borrower')}
          className={styles['nav__center-link']}
        >
          <Text text='대출' size='sm' color='light-blue' />
        </button>
        <Link href='/about' className={styles['nav__center-link']}>
          <Text text='서비스 소개' size='sm' color='light-blue' />
        </Link>
      </div>

      {/* 우측 로그인/로그아웃 */}
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
