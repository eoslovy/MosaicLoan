'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionTabNavProps } from '@/types/components';
import styles from '@/styles/layouts/SectionTabNav.module.scss';
import Text from '@/components/common/Text';

const SectionTabNav: React.FC<SectionTabNavProps> = ({
  title,
  description,
  tabs,
  activeIndex,
  onTabClick,
}) => {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Text
          className={clsx(styles.title, title.className)}
          weight='bold'
          color='primary-blue'
          size='text-3xl'
          {...title}
        />
        {description && (
          <Text
            {...description}
            className={clsx(styles.description, description.className)}
            weight='regular'
            color='gray'
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
            type='button'
          >
            <Text {...tab.label} className={clsx(tab.label.className)} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default SectionTabNav;
