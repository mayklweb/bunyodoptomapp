import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export function useVerifyPasswordResetOtp() {
  return useMutation({
    mutationFn: ({
      phone,
      code,
    }: {
      phone: string;
      code: string;
    }) =>
      authService.verifyPasswordResetOtp({
        phone,
        code,
      }),
  });
}