import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  marketService,
  type CreateMarketPayload,
} from "@/services/market.service";

import { marketKeys } from "./market.keys";

export function useCreateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMarketPayload) =>
      marketService.createMarket(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: marketKeys.all,
      });
    },
  });
}