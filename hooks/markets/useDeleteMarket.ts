import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { marketService } from "@/services/market.service";
import { marketKeys } from "./market.keys";

export function useDeleteMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      marketService.deleteMarket(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: marketKeys.all,
      });

      queryClient.removeQueries({
        queryKey: marketKeys.one(id),
      });
    },
  });
}