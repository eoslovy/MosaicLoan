'use client';

import styles from '@/styles/my/MyInfo.module.scss';
import React, { useEffect, useState } from 'react';
import useUser from '@/hooks/useUser';

const maskName = (name: string) => {
  if (name.length <= 2) return `${name[0]} *`;
  return `${name[0]} * ${name[name.length - 1]}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const MyInfo = () => {
  const { user, isFetched, isLoading } = useUser();
  const [userInfo, setUserInfo] = useState({
    oauthProvider: '',
    name: '',
    createdAt: '',
  });

  useEffect(() => {
    if (user && isFetched) {
      setUserInfo({
        oauthProvider: user.oauthProvider ?? '-',
        name: maskName(user.username),
        createdAt: user.createdAt ? formatDate(user.createdAt) : '-',
      });
    }
  }, [user, isFetched]);

  if (isLoading) return <p>불러오는 중...</p>;

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>내 계정</h2>

      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>인증 경로</span>
          <div className={styles.value}>
            <p>{userInfo.oauthProvider}</p>
          </div>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>이&nbsp;&nbsp;&nbsp;름</span>
          <span className={styles.value}>{userInfo.name}</span>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>가입일</span>
          <span className={styles.value}>{userInfo.createdAt}</span>
        </div>
      </div>
    </section>
  );
};

export default MyInfo;
