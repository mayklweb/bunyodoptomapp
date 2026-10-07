import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  marketService,
  type UpdateMarketPayload,
} from "@/services/market.service";

import { marketKeys } from "./market.keys";

type UpdateMarketVariables = {
  id: number;
  data: UpdateMarketPayload;
};

export function useUpdateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateMarketVariables) =>
      marketService.updateMarket(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: marketKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: marketKeys.one(variables.id),
      });
    },
  });
}
