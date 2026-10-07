import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";
import { productKeys } from "./category.keys";

export function useProduct(id?: string | number) {
  return useQuery({
    queryKey: productKeys.detail(id!),

    queryFn: () => productService.getProductById(id!),

    enabled: !!id,
  });
}
