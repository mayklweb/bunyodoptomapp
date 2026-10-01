import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      authService.sendOtp(phone),
  });
}