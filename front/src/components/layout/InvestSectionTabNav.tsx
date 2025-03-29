'use client';

import React from 'react';
import clsx from 'clsx';
import styles from '@/styles/layouts/SectionTabNav.module.scss';
import Text from '@/components/common/Text';
import type { SectionTab } from '@/types/components';
import type { InvestSectionTabNavProps } from '@/types/pages';
import { TextProps } from '@/types/components';

const InvestSectionTabNav: React.FC<InvestSectionTabNavProps> = ({ activeIndex, onTabClick }) => {
  const title:TextProps = {
    text: '투자하기',
    size: 'text-3xl',
    color: 'primary-blue',
    weight: 'bold',
    className: '',
  };

  const description:TextProps = {
    text: '투자 현황 및 수익 내역을 확인해 보세요',
    size: 'md',
    color: 'gray',
    weight: 'regular',
    className: '',
  };

  const tabs: SectionTab[] = [
    {
      label: { text: '개요', size: 'sm', color: 'gray' },
      href: '/investor/overview',
    },
    {
      label: { text: '채권 거래 내역', size: 'sm', color: 'gray' },
      href: '/investor/contracts',
    },
    {
      label: { text: '채권 통계', size: 'sm', color: 'gray' },
      href: '/investor/statistics',
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Text
          className={clsx(styles.title, title.className)}
          {...title}
        />
        {description && (
          <Text
            className={clsx(styles.description, description.className)}
            {...description}
          />
        )}
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.href}
            className={clsx(styles.tab, {
              [styles.active]: idx === activeIndex,
            })}
            onClick={() => onTabClick(idx)}
            type="button"
          >
            <Text {...tab.label} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default InvestSectionTabNav;
