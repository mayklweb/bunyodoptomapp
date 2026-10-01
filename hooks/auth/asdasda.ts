import { useMutation } from "@tanstack/react-query";

import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "@/services/auth";

export function useSendPasswordResetOtp() {
  return useMutation({
    mutationFn: (phone: string) => sendPasswordResetOtp(phone),
  });
}

export function useVerifyPasswordResetOtp() {
  return useMutation({
    mutationFn: ({
      phone,
      code,
    }: {
      phone: string;
      code: string;
    }) => verifyPasswordResetOtp(phone, code),
  });
}

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
    }) => resetPassword(phone, resetToken, newPassword,),
  });
}