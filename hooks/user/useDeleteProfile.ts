import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { userService } from "@/services/user.service";

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { password: string }) =>
      userService.deleteProfile(payload),

    onSuccess: () => {
      queryClient.clear();
    },
  });
}