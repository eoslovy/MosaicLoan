import { useRef, useEffect } from 'react';
import styles from '@/styles/about/About.module.scss';
import {
  Shield,
  TrendingUp,
  Users,
  Code,
  Database,
  Server,
} from 'lucide-react';

const InfoPage = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const developersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, observerOptions);

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    if (developersRef.current) {
      observer.observe(developersRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <h1>안전하고 투명한 P2P 투자 플랫폼</h1>
        <p>더 나은 금융 생활을 위한 현명한 선택</p>
      </section>

      <section className={`${styles.features}`} ref={featuresRef}>
        <div className={styles.feature}>
          <div className={styles.iconWrapper}>
            <Shield size={32} />
          </div>
          <h2>안전한 투자</h2>
          <p>
            철저한 심사와 리스크 관리로 투자자의 자산을 안전하게 보호합니다.
            전문가들의 세밀한 분석을 통해 검증된 투자 상품만을 제공합니다.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.iconWrapper}>
            <TrendingUp size={32} />
          </div>
          <h2>높은 수익률</h2>
          <p>
            은행 예금 대비 높은 수익률을 제공합니다. 다양한 투자 상품을 통해
            포트폴리오를 구성하고 안정적인 수익을 창출하세요.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.iconWrapper}>
            <Users size={32} />
          </div>
          <h2>신뢰할 수 있는 파트너</h2>
          <p>
            투명한 정보 공개와 전문적인 고객 서비스를 제공합니다. 여러분의
            성공적인 투자를 위한 최고의 파트너가 되겠습니다.
          </p>
        </div>
      </section>

      <section className={styles.process}>
        <h2>투자 프로세스</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>01</span>
            <h3>회원가입</h3>
            <p>간단한 정보 입력으로 시작하세요</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>02</span>
            <h3>자동 분산 투자</h3>
            <p>
              모자익론은 빅데이터를 기반으로 최적의 자동 분산 투자를 제공합니다.
            </p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>03</span>
            <h3>투자하기</h3>
            <p>원하는 금액을 투자하고 수익을 얻으세요</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>04</span>
            <h3>수익금 수령</h3>
            <p>투자 만기 시 원금과 수익금을 받으세요</p>
          </div>
        </div>
      </section>

      <section className={`${styles.developers}`} ref={developersRef}>
        <div className={styles.teamInfo}>
          <h2>Developers</h2>
          <div className={styles.teamName}>
            <strong>Team !PESSIMISTIC</strong>
          </div>
          <div className={styles.projectInfo}>
            <p>삼성 청년 SW 아카데미 (SSAFY) 12기 특화 프로젝트</p>
          </div>
        </div>

        <div className={styles.developerGrid}>
          <div className={styles.developer}>
            <div className={styles.developerIcon}>
              <Code size={24} />
            </div>
            <h3>박유진</h3>
            <p>프론트엔드</p>
          </div>

          <div className={styles.developer}>
            <div className={styles.developerIcon}>
              <Database size={24} />
            </div>
            <h3>이연규</h3>
            <p>모델링</p>
          </div>

          <div className={styles.developer}>
            <div className={styles.developerIcon}>
              <Database size={24} />
            </div>
            <h3>신예주</h3>
            <p>모델링</p>
          </div>

          <div className={styles.developer}>
            <div className={styles.developerIcon}>
              <Server size={24} />
            </div>
            <h3>강재현</h3>
            <p>인프라</p>
          </div>

          <div className={styles.developer}>
            <div className={styles.developerIcon}>
              <Code size={24} />
            </div>
            <h3>오지석</h3>
            <p>백엔드</p>
          </div>

          <div className={styles.developer}>
            <div className={styles.developerIcon}>
              <Code size={24} />
            </div>
            <h3>윤덕건</h3>
            <p>백엔드</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default InfoPage;
