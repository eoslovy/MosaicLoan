import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/common/Button';
import Text from '@/components/common/Text';
import styles from '@/styles/layout/Nav.module.scss';

const Nav = () => {
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

      {/* 로그인 관련 버튼 */}
      <div className={styles.nav__right}>
        <Button
          label={{ text: '로그인', size: 'sm', color: 'blue' }}
          variant='outlined'
          size='normal'
        />
        <Button
          label={{ text: '회원가입', size: 'sm', color: 'white' }}
          variant='filled'
          size='normal'
        />
      </div>
    </nav>
  );
};

export default Nav;
