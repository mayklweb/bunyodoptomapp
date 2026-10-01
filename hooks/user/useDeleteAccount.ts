import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import {
  userService,
  type DeleteAccountPayload,
} from "@/services/user.service";

import { userKeys } from "./user.keys";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) =>
      userService.deleteAccount(payload),

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: userKeys.all,
      });

      Toast.show({
        type: "success",
        text1: "Hisob o'chirildi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Hisobni o'chirib bo'lmadi",
        text2: "Parolni tekshiring",
      });
    },
  });
}