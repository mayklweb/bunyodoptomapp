import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'expo-router';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const logout = () => {
    // clearAuth ichida cart ham avtomatik tozalanadi (auth.store.ts)
    clearAuth();
    queryClient.clear();
    router.replace('/(auth)/login');
  };

  return { logout };
};