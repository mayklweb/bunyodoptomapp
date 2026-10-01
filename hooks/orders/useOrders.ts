import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { orderKeys } from "./order.keys";

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: orderService.getOrders,
  });
}