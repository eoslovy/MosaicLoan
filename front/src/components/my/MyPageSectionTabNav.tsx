'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/my/MyPageSectionTabNav.module.scss';
import Text from '@/components/common/Text';
import type { SectionTab } from '@/types/components';
import { TextProps } from '@/types/components';

interface MyPageSectionTabNavProps {
  activeIndex: number;
  onTabClick: (index: number) => void;
}

const MyPageSectionTabNav: React.FC<MyPageSectionTabNavProps> = ({
  activeIndex,
  onTabClick,
}) => {
  const title: TextProps = {
    text: '마이페이지',
    size: 'text-3xl',
    color: 'primary-blue',
    weight: 'bold',
    className: '',
  };

  const description: TextProps = {
    text: '나의 계좌내역 및 계정정보를 확인해보세요',
    size: 'md',
    color: 'gray',
    weight: 'regular',
    className: '',
  };

  const tabs: SectionTab[] = [
    {
      label: { text: '계정정보', size: 'sm', color: 'gray' },
      href: '/my/MyInfo',
    },
    {
      label: { text: '계좌내역', size: 'sm', color: 'gray' },
      href: '/my/MyAccount',
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Text className={clsx(styles.title, title.className)} {...title} />
        <Text
          className={clsx(styles.description, description.className)}
          {...description}
        />
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.href}
            className={clsx(styles.tab, {
              [styles.active]: idx === activeIndex,
            })}
            onClick={() => onTabClick(idx)}
            type='button'
          >
            <Text {...tab.label} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default MyPageSectionTabNav;
