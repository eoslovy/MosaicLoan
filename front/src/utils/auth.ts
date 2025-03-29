import { useUserStore } from '@/stores/userStore';

export const handleKakaoLogin = () => {
  window.location.href = 'http://localhost:8080/auth/kakao/login';
};

// 내 정보 가져오기
export const fetchUser = async () => {
  const res = await fetch('http://localhost:8080/me', {
    credentials: 'include',
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
};

export const handleLogout = async () => {
  await fetch('http://localhost:8080/logout', {
    method: 'POST',
    credentials: 'include',
  });

  // 상태 초기화
  const { setUser } = useUserStore.getState();
  setUser(null);
};
