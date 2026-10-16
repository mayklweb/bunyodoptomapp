import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { userService } from "@/services/user.service";
import { useCartStore } from "@/stores/cart.store";

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { password: string }) =>
      userService.deleteProfile(payload),

    onSuccess: () => {
      useCartStore.getState().clearCart();
      queryClient.clear();
    },
  });
}