import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  type SignupPayload,
} from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useSignup() {
  const queryClient = useQueryClient();

  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: SignupPayload) =>
      authService.signup(payload),

    onSuccess: (data) => {
      queryClient.clear();

      setAuth({
        token: data.token,
        user: data.user,
      });
    },
  });
}