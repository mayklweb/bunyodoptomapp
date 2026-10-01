import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import {
  orderService,
  type CheckoutPayload,
} from "@/services/order.service";

import { orderKeys } from "./order.keys";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      orderService.checkout(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      Toast.show({
        type: "success",
        text1: "Buyurtma qabul qilindi",
        text2: "Tez orada siz bilan bog'lanamiz",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Buyurtma qabul qilinmadi",
        text2: "Qaytadan urinib ko'ring",
      });
    },
  });
}