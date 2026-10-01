import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import Toast from "react-native-toast-message";

import { orderService } from "@/services/order.service";
import { orderKeys } from "./order.keys";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) =>
      orderService.cancelOrder(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.one(id),
      });

      Toast.show({
        type: "success",
        text1: "Buyurtma bekor qilindi",
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: "Buyurtmani bekor qilib bo'lmadi",
        text2: "Qaytadan urinib ko'ring",
      });
    },
  });
}