import { useUserStore } from '@/stores/userStore';
import request from '@/service/apis/request';
import type { User } from '@/types/user';

export const handleKakaoLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/member/auth/kakao/login`;
};

export const handleLogout = async () => {
  await request.POST('/member/auth/logout');
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
