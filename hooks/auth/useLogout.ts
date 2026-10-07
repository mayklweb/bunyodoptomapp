import { useAuthStore } from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const logout = () => {
    clearAuth();
    queryClient.clear();
    router.replace("/login");
  };

  return { logout };
};