import { useUserStore } from '@/stores/userStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handleKakaoLogin = (redirectTo?: string) => {
  const encoded = encodeURIComponent(redirectTo || window.location.pathname);
  window.location.href = `${API_URL}/auth/kakao/login?redirectTo=${encoded}`;
};

export const fetchUser = async () => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: 'include',
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
};

export const handleLogout = async () => {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const { setUser } = useUserStore.getState();
  setUser(null);
};
