import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const logout = () => {
    // clearAuth ichida cart ham avtomatik tozalanadi (auth.store.ts)
    clearAuth();
    queryClient.clear();
    router.replace("/login");
  };

  return { logout };
};
