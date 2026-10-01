import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export function useCheckPhone() {
  return useMutation({
    mutationFn: (phone: string) =>
      authService.checkPhone(phone),
  });
}