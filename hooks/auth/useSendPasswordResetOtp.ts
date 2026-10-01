import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export function useSendPasswordResetOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      authService.sendPasswordResetOtp(phone),
  });
}