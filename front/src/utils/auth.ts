import { useUserStore } from '@/stores/userStore';
import { makeRequest } from '@/service/apis/request';

export const handleKakaoLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/member/auth/kakao/login`;
};

export const handleLogout = async () => {
  try {
    await makeRequest('POST', '/member/auth/logout');
    useUserStore.getState().setUser(null);
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
