import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signupRequest } from '@/services/auth';
import { useAuthStore } from '@/store/auth.store';

export const useSignup = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({
      name,
      phone,
      password,
    }: {
      name: string;
      phone: string;
      password: string;
    }) => signupRequest(name, phone, password),

    onSuccess: (data) => {
      // Eski akkauntning keshi qolib ketmasligi uchun — useLogin'dagi kabi
      queryClient.clear();

      // setAuth ichida cart ham avtomatik tozalanadi (auth.store.ts)
      setAuth({
        token: data.token,
        user: data.user,
      });
    },
  });
};