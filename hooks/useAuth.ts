// import { userApi } from "@/services/api/profile.api";
import { UserType } from "@/types";
import { userApi } from "@/services/api/profile.api";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const queryKeys = {
  user: ["user"] as const,
};

/**
 * Get current user from API
 */
export function useGetProfile() {
  return useQuery<UserType>({
    queryKey: queryKeys.user,
    queryFn: userApi.getProfile,
    enabled: !!useAuthStore.getState().token,
  });
}

/**
 * Current authenticated user.
 *
 * Auth information is stored in Zustand.
 * Server profile data is handled by React Query.
 */
export function useUser() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return {
    user,
    token,
    isHydrated,
    isAuthenticated: !!token,
  };
}

/**
 * Update current user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userApi.updateProfile,

    onSuccess: (updatedUser) => {
      // Update Zustand
      setUser({
        id: String(updatedUser.id),
        name: updatedUser.name,
      });

      // Update React Query cache
      queryClient.setQueryData(queryKeys.user, updatedUser);
    },
  });
}
