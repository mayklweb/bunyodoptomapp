import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useLogin() {
  const queryClient = useQueryClient();

  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      queryClient.clear();

      setAuth({
        token: data.token,
        user: data.data,
      });
    },
  });
}



