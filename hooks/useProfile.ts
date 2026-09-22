import {userApi} from "@/services/api/profile.api"
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLogout } from "./useLogout";

// 👤 GET PROFILE
export function useProfile() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["user"],
    queryFn: userApi.getProfile,
    enabled: !!token, // 🔥 MUHIM
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

// ✏️ UPDATE PROFILE
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["user"], updatedUser);
    },
  });
}

// 🗑️ DELETE ACCOUNT
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { logout } = useLogout();

  return useMutation({
    mutationFn: (payload: { password: string }) => userApi.deleteProfile(payload),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
      logout();
    },
  });
}
