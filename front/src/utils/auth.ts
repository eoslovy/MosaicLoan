import { useUserStore } from '@/stores/userStore';
import { httpClient } from '@/service/apis/apiClient';

export const handleKakaoLogin = () => {
  window.location.href = `${httpClient.defaults.baseURL}/member/auth/kakao/login`;
};

export const handleLogout = async () => {
  try {
    await httpClient.post('/member/auth/logout');
    const { setUser } = useUserStore.getState();
    setUser(null);
  } catch (error) {
    throw new Error('로그아웃 실패');
  }
};

export const handleProtectedRoute = (
  user: any,
  path: string,
  router: ReturnType<typeof import('next/navigation').useRouter>
) => {
  if (user) {
    router.push(path);
  } else {
    handleKakaoLogin();
  }
};
