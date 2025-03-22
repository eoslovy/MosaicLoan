// 카카오 로그인 URL 리다이렉트
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

// 로그아웃
export const handleLogout = async () => {
  await fetch('http://localhost:8080/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
