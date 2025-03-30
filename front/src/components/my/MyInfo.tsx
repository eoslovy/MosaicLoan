'use client';

import styles from '@/styles/my/MyInfo.module.scss';
import React, { useEffect, useState } from 'react';

const mockUserInfo = {
  // emailProvider: '카카오 간편 가입',
  email: 'ssafy123@ssafy.com',
  name: '김 * 피',
  createdAt: '2025.05.10',
};

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    // emailProvider: '',
    email: '',
    name: '',
    createdAt: '',
  });

  useEffect(() => {
    // 실제 API 대체용
    setUserInfo(mockUserInfo);
  }, []);

  return (
    <section className={styles.container}>
      <h2 className={styles.heading}>내 계정</h2>

      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>이메일</span>
          <div className={styles.value}>
            {/* <p>{userInfo.emailProvider}</p> */}
            <p>카카오 간편 가입</p>
            <p>{userInfo.email}</p>
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
