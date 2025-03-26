'use client';

import Image from 'next/image';
import clsx from 'clsx';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import styles from '@/styles/layouts/Hero.module.scss';

const Hero = () => {
  return (
    <section className={clsx(styles.hero)}>
      <div className='max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8'>
        {/* 좌측: 이미지 */}
        <div
          className={clsx(
            styles.hero__image,
            'flex items-center justify-center md:justify-start w-full md:w-1/2 h-full',
          )}
        >
          <div className='flex justify-center items-center w-full'>
            <Image
              src='/img/logo_main_large.svg'
              alt='MOSAICLOAN Main Logo'
              width={400}
              height={400}
            />
          </div>
        </div>

        {/* 우측: 텍스트 + 버튼 */}
        <div className='w-full md:w-1/2 flex flex-col gap-6 items-center md:items-start text-center md:text-left'>
          {/* 상단 제목 2줄은 간격 없이 */}
          <div className='flex flex-col gap-1'>
            <Text
              text='MOSAICLOAN'
              size='text-4xl'
              color='black'
              weight='black'
            />
            <Text
              text='The Future of P2P'
              size='text-4xl'
              color='black'
              weight='black'
            />
          </div>

          {/* 버튼 영역 */}
          <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
            <Button
              label={{ text: '대출하기', size: 'sm', color: 'white' }}
              variant='filled'
              size='normal'
            />
            <Button
              label={{ text: '투자하기', size: 'sm', color: 'blue' }}
              variant='outlined'
              size='normal'
            />
          </div>

          {/* 설명 텍스트 */}
          <Text
            text='안전하고 간편한 투자, 개인 맞춤형 대출에는 모자익론'
            className='text-base sm:text-lg font-normal'
            color='blue'
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
