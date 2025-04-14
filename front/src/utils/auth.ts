import { useUserStore } from '@/stores/userStore';
import request from '@/service/apis/request';
import type { User } from '@/types/user';

export const handleKakaoLogin = () => {
  // 현재 페이지 경로를 저장
  localStorage.setItem('redirectAfterLogin', window.location.pathname);
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/member/auth/kakao/login`;
};
// accesstoken 없는 경우 로그아웃 보내면
export const handleLogout = async () => {
  await request.POST('/member/logout');
  const { setUser, setIsFetched } = useUserStore.getState();
  setUser(null);
  setIsFetched(false);
};

export const handleProtectedRoute = (
  user: User | null,
  path: string,
  router: ReturnType<typeof import('next/navigation').useRouter>,
) => {
  if (user) {
    router.push(path);
  } else {
    handleKakaoLogin();
  }
};
