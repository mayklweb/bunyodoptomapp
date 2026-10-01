import { useMutation } from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import {
  userService,
  type ChangePasswordPayload,
} from "@/services/user.service";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      userService.changePassword(payload),

    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Parol o'zgartirildi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Parolni o'zgartirib bo'lmadi",
        text2: "Ma'lumotlarni tekshiring",
      });
    },
  });
}