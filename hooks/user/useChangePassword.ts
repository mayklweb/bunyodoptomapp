import { useMutation } from "@tanstack/react-query";

import { userService } from "@/services/user.service";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof userService.changePassword>[0]) =>
      userService.changePassword(payload),
  });
}