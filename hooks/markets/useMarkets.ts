import { useQuery } from "@tanstack/react-query";
import { marketService } from "@/services/market.service";
import { marketKeys } from "./market.keys";

export function useMarket() {
  return useQuery({
    queryKey: marketKeys.all,
    queryFn: marketService.getMarkets,
  });
}