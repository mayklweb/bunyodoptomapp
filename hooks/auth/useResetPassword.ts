import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      phone,
      resetToken,
      newPassword,
    }: {
      phone: string;
      resetToken: string;
      newPassword: string;
    }) =>
      authService.resetPassword({
        phone,
        resetToken,
        newPassword,
      }),
  });
}