'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/about/About.module.scss';
import { ArrowRight } from 'lucide-react';
import InfoPage from '@/components/about/InfoPage';

const Page = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          type='button'
          className={styles.myButton}
          onClick={() => router.push('/about/myInfo')}
        >
          My 페이지 <ArrowRight size={16} />
        </button>
      </div>
      <InfoPage />
    </div>
  );
};

export default Page;
