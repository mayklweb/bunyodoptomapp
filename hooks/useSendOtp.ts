import { useMutation } from "@tanstack/react-query";
import { sendOtpRequest } from "@/services/auth";

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => sendOtpRequest(phone),
  });
}