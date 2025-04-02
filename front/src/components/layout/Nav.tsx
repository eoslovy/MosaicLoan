'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/layouts/Nav.module.scss';
import { handleKakaoLogin } from '@/utils/auth';
import useUser from '@/hooks/useUser';
import { useUserStore } from '@/stores/userStore';

const Nav = () => {
  const user = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setUser(null); // 상태 초기화
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleProtectedRoute = (path: string) => {
    // if (user) {
    //   router.push(path); // 로그인 상태니까 페이지 정상 이동
    // } else {
    //   handleKakaoLogin(path); //  로그인한 다음 해당 페이지로 리다이렉트시키기(백 같이 고치기)
    // }
    router.push(path);
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

        {/* 소개는 로그인 여부와 상관없이 Link 유지 */}
        <Link href='/about' className={styles['nav__center-link']}>
          <Text text='서비스 소개' size='sm' color='light-blue' />
        </Link>
      </div>

      {/* 우측 로그인/로그아웃 버튼 */}
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
