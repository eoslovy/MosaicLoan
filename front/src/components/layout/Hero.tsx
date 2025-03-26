'use client';

import Image from 'next/image';
import Text from '@/components/common/Text';
import Button from '@/components/common/Button';
import styles from '@/styles/layouts/Hero.module.scss';

const Hero = () => {
  return (
    <section className="flex flex-wrap max-w-screen-xl mx-auto justify-between items-center md:flex-nowrap text-center md:text-left px-6 sm:px-8 py-12">
      {/* 좌측: 이미지 */}
      <div className={`${styles.hero__image} flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start`}>
        <Image
          src="/img/logo_main_large.svg"
          alt="MOSAICLOAN Main Logo"
          width={400}
          height={400}
        />
      </div>

      {/* 우측: 텍스트 + 버튼 */}
      <div className="flex flex-col gap-6 flex-1 items-center md:items-start text-center md:text-left max-w-xl">
        <Text text="MOSAICLOAN" size="text-4xl" color="black" />
        <Text text="The Future of P2P" size="text-4xl" color="black" />

        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Button
            label={{ text: '대출하기', size: 'sm', color: 'white' }}
            variant="filled"
            size="normal"
          />
          <Button
            label={{ text: '투자하기', size: 'sm', color: 'blue' }}
            variant="outlined"
            size="normal"
          />
        </div>

        <Text
          text="안전하고 간편한 투자, 개인 맞춤형 대출에는 모자익론"
          className="text-base sm:text-lg text-sky-400 font-medium"
        />
      </div>
    </section>
  );
};

export default Hero;
