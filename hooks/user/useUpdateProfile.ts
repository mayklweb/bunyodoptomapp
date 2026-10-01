import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import {
  userService,
  type UpdateProfilePayload,
} from "@/services/user.service";

import { userKeys } from "./user.keys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      userService.updateProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me(),
      });

      Toast.show({
        type: "success",
        text1: "Profil yangilandi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Profilni yangilab bo'lmadi",
        text2: "Qaytadan urinib ko'ring",
      });
    },
  });
}