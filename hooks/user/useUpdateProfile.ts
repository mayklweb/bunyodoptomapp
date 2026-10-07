import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { userService } from "@/services/user.service";
import { userKeys } from "./user.keys";
import { useAuthStore } from "@/stores/auth.store";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: userService.updateProfile,

    onSuccess: (updatedUser) => {
      setUser({
        id: String(updatedUser.id),
        name: updatedUser.name,
      });

      queryClient.setQueryData(
        userKeys.profile(),
        updatedUser,
      );
    },
  });
}